import type { APIRoute } from "astro";

import { getDatabaseClient } from "../lib/database/client";
import { escapeHtml } from "../lib/html/escape";
import {
  notFoundHtmlResponse,
  serverErrorHtmlResponse
} from "../lib/html/error-responses";
import { DEFAULT_LOCALE, isSupportedLocale } from "../lib/i18n/locale";
import { createTranslator } from "../lib/i18n/translate";
import { log } from "../lib/logging/logger";
import { withSiteSearchTenant } from "../modules/site-search/application/public-search-tenant-resolution";
import {
  decodeSearchCursor,
  searchSiteContent,
  type SearchResultItem
} from "../modules/site-search/application/search-service";
import {
  normalizeSearchLocale,
  normalizeSearchQuery
} from "../modules/site-search/domain/search-query";
import { renderSearchPageBody } from "../modules/site-search/domain/search-page-rendering";

/**
 * `GET /search?q=` (Issue #270, ADR-0031 §5) — the PUBLIC, anonymous, accessible
 * search page. Host-based tenant resolution (mirrors `/news`); tenant + locale
 * scoped; snippets are pre-escaped safe HTML; the page renders `robots: noindex`
 * (a search-results page should not be indexed). Core search works with no JS.
 */
function renderShell(title: string, locale: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="${escapeHtml(locale)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, follow" />
  <title>${escapeHtml(title)}</title>
</head>
<body>${bodyHtml}</body>
</html>`;
}

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const sql = getDatabaseClient();
    const rawQuery = url.searchParams.get("q");
    const cursorParam = url.searchParams.get("cursor");
    const localeParam = url.searchParams.get("locale");

    const result = await withSiteSearchTenant(
      sql,
      request,
      async (tx, tenant, settings) => {
        // `locale` filters the (content) search index (any content locale);
        // `uiLocale` narrows to a supported UI locale for the label translator +
        // the page `lang`.
        const locale = normalizeSearchLocale(localeParam, tenant.defaultLocale);
        const uiLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
        const t = await createTranslator(uiLocale);
        const labels = {
          title: t("site_search.page.title"),
          heading: t("site_search.page.heading"),
          inputLabel: t("site_search.page.input_label"),
          placeholder: t("site_search.page.placeholder"),
          button: t("site_search.page.button"),
          enterTerm: t("site_search.page.enter_term"),
          tooShort: t("site_search.page.too_short"),
          noResults: t("site_search.page.no_results"),
          resultsHeading: t("site_search.page.results_heading"),
          next: t("site_search.page.next"),
          suggestionsLabel: t("site_search.page.suggestions_label")
        };

        let items: readonly SearchResultItem[] = [];
        let nextCursor: string | null = null;
        let query = "";
        let reason: "empty" | "too_short" | "too_long" | undefined;

        const hasInput =
          typeof rawQuery === "string" && rawQuery.trim().length > 0;
        if (hasInput) {
          const normalized = normalizeSearchQuery(
            rawQuery,
            settings.minQueryLength
          );
          if (!normalized.ok) {
            reason = normalized.reason;
          } else {
            query = normalized.value;
            const cursor = decodeSearchCursor(cursorParam);
            const search = await searchSiteContent(tx, tenant.tenantId, {
              query,
              locale,
              enabledResourceTypes: settings.enabledResourceTypes,
              limit: settings.resultLimit,
              cursor
            });
            items = search.items;
            nextCursor = search.nextCursor;
          }
        }

        const bodyHtml = renderSearchPageBody({
          locale: uiLocale,
          siteName: tenant.tenantName,
          query,
          minQueryLength: settings.minQueryLength,
          reason,
          items,
          nextCursor,
          labels
        });

        return new Response(renderShell(labels.title, uiLocale, bodyHtml), {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" }
        });
      }
    );

    return result ?? notFoundHtmlResponse();
  } catch (error) {
    log("error", "public_site_search.page_failed", {
      error: error instanceof Error ? error.message : String(error)
    });
    return serverErrorHtmlResponse();
  }
};
