/**
 * Accessibility (axe-core) over the public DISCOVERY surfaces — Issue #296,
 * epic #261 (website-platform), acceptance criterion "Critical public
 * journeys meet the declared WCAG 2.2 target (axe, EN + ID, desktop +
 * mobile, keyboard)".
 *
 * WHAT THIS ADDS THAT THE EXISTING PUBLIC SPECS DO NOT
 * ----------------------------------------------------
 * The public a11y coverage before this spec stopped at two ends of the
 * journey and left the middle unscanned:
 *   - `public-a11y-smoke.e2e.ts`   → `/`, `/newsletter/demo`, `/comments/demo`
 *     (hermetic pages that need no seeded content);
 *   - `public-content-a11y.e2e.ts` → the ARTICLE templates
 *     (`/news/{slug}`, `/blog/{tenantCode}/{slug}`).
 * Nobody ever reaches an article without first passing through a LISTING or
 * a SEARCH page, and the states a real visitor hits most often on those
 * pages are precisely the ones a happy-path scan never renders: the empty
 * prompt, the "query too short" hint, the zero-results state, and the 404.
 * Those states are separate DOM branches (`renderSearchPageBody` picks one
 * of four; `notFoundHtmlResponse` is a different document entirely), so a
 * green scan of the populated branch says nothing about them.
 *
 * SURFACES SCANNED (all seeded, all rendered server-side):
 *   - `/news` and `/blog/{tenantCode}` — the two listing entry points
 *     (tenant-code-free host-resolved vs. code-in-path), populated.
 *   - `/news/search` and `/blog/{tenantCode}/search` — blog_content search,
 *     empty-query state AND populated-results state.
 *   - `/search` — the site_search page (`site-search/domain/
 *     search-page-rendering.ts`), in all four of its render branches:
 *     no query (hint), too short, no results, and results present.
 *   - `/news/{missing}` — the shared public 404 document
 *     (`src/lib/html/error-responses.ts`), the error state of every public
 *     route in the app.
 *
 * LOCALE (EN + ID). Three DIFFERENT mechanisms drive `<html lang>` on the
 * public surface and this spec exercises each on the page that uses it —
 * assuming one mechanism covers all three is how "we tested both locales"
 * silently becomes "we tested English twice":
 *   - listing/search shells (`renderPublicPageShell`) take the TENANT's
 *     `default_locale` → covered by seeding a second tenant whose default
 *     is `id` and scanning its `/blog/{code}` + `/blog/{code}/search`;
 *   - `/search` takes the `?locale=` query parameter (`normalizeSearchLocale`
 *     → `uiLocale`), NOT the locale cookie;
 *   - the article template takes the POST's own locale (already covered by
 *     `public-content-a11y.e2e.ts` — not repeated here).
 *
 * DEVICE MATRIX: every scan runs at desktop (1280×800) and small-phone
 * (390×844), because `target-size` (2.5.8), reflow (1.4.10) and
 * breakpoint-dependent contrast can only fail at one of them.
 *
 * KEYBOARD: `public-keyboard-journey.e2e.ts` covers the hermetic pages;
 * this spec adds the one keyboard interaction that only exists here — a
 * visitor Tab-ing into the search field and submitting with Enter (no
 * mouse, no JS) and getting a results page back. `role="search"` markup
 * that looks perfect to axe is still broken if Enter does not submit.
 *
 * SETUP-STATE OWNERSHIP: this spec repoints the global
 * `awcms_micro_setup_state` singleton (localhost default-tenant
 * resolution), so it takes the shared cross-file advisory lock via
 * `acquireSetupStateOwnership` for its whole lifetime — otherwise a
 * sibling spec's repoint lands between our seed and our page loads and the
 * listings render another tenant's (empty) content. See
 * `tests/e2e/helpers/setup-state-ownership.ts`.
 *
 * Seeds are per-run-unique and cleaned up in `afterAll`, so a Playwright
 * retry (which re-runs `beforeAll`) never collides with its own first
 * attempt.
 *
 * Run: `bun run dev` / `bun run start` (with DATABASE_URL set) in one
 * terminal, then
 *   `E2E_SEED_DATABASE_URL=... bun run test:e2e tests/e2e/public-discovery-a11y.e2e.ts`
 */
import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import {
  acquireSetupStateOwnership,
  type SetupStateOwnership
} from "./helpers/setup-state-ownership";

const SEED_URL = process.env.E2E_SEED_DATABASE_URL ?? "";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];
const FAILING_IMPACTS = new Set(["critical", "serious"]);

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844 }
] as const;

// Shared global setup_state singleton → run this file's tests serially.
test.describe.configure({ mode: "serial" });

/** A word present in both seeded posts, so every "populated" search hits. */
const SEARCH_TERM = "accessibility";

let enTenantId = "";
let enTenantCode = "";
let idTenantId = "";
let idTenantCode = "";
let setupStateOwnership: SetupStateOwnership | null = null;

function articleContentJson(locale: "en" | "id"): string {
  const blocks =
    locale === "en"
      ? [
          {
            type: "paragraph",
            text: "A published article about accessibility on the public discovery surfaces."
          }
        ]
      : [
          {
            type: "paragraph",
            text: "Artikel terbit tentang accessibility pada permukaan penemuan publik."
          }
        ];
  return JSON.stringify({ blocks });
}

/**
 * Seed one tenant (with an active primary domain) plus one published post
 * whose title/body contain `SEARCH_TERM`. Returns the tenant id.
 */
async function seedTenant(
  sql: Bun.SQL,
  tenantCode: string,
  hostname: string,
  defaultLocale: "en" | "id"
): Promise<string> {
  const tenantRows = await sql`
    INSERT INTO awcms_micro_tenants
      (tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
    VALUES (${tenantCode}, 'Discovery A11y E2E', 'Discovery A11y E2E Legal',
      'active', ${defaultLocale}, 'light')
    RETURNING id
  `;
  const tenantId = tenantRows[0]!.id as string;

  await sql`
    INSERT INTO awcms_micro_tenant_domains
      (tenant_id, hostname, normalized_hostname, domain_type, status, is_primary)
    VALUES (${tenantId}, ${hostname}, ${hostname}, 'custom_domain', 'active', true)
  `;

  const title =
    defaultLocale === "en"
      ? "Accessibility on the listing page"
      : "Accessibility pada halaman daftar";
  await sql`
    INSERT INTO awcms_micro_blog_posts
      (tenant_id, author_tenant_user_id, title, slug, content_json, content_text,
       status, visibility, locale, published_at, updated_at)
    VALUES (${tenantId}, ${crypto.randomUUID()}, ${title}, ${`discovery-a11y-${defaultLocale}`},
      ${articleContentJson(defaultLocale)}::jsonb,
      ${`${SEARCH_TERM} discovery listing body`},
      'published', 'public', ${defaultLocale},
      '2026-06-01T00:00:00.000Z', '2026-06-01T00:00:00.000Z')
  `;

  return tenantId;
}

test.beforeAll(async () => {
  if (SEED_URL.length === 0) {
    throw new Error(
      "E2E_SEED_DATABASE_URL must be set for the public discovery a11y spec."
    );
  }
  setupStateOwnership = await acquireSetupStateOwnership(SEED_URL);

  const unique = crypto.randomUUID().slice(0, 12);
  enTenantCode = `disc-a11y-en-${unique}`;
  idTenantCode = `disc-a11y-id-${unique}`;

  const sql = new Bun.SQL(SEED_URL);
  try {
    // Per-run-unique hostnames keep the `normalized_hostname` dedup index
    // (migration 031, unique WHERE deleted_at IS NULL) collision-free under
    // retry/rerun and across parallel workers.
    enTenantId = await seedTenant(
      sql,
      enTenantCode,
      `${enTenantCode}.example`,
      "en"
    );
    idTenantId = await seedTenant(
      sql,
      idTenantCode,
      `${idTenantCode}.example`,
      "id"
    );

    // localhost has no host→tenant mapping, so the setup singleton decides
    // which tenant `/news` and `/search` serve. Point it at the EN tenant;
    // the ID tenant is reached by code through `/blog/{tenantCode}`.
    await sql`
      INSERT INTO awcms_micro_setup_state (id, tenant_id, locked_at)
      VALUES (true, ${enTenantId}, now())
      ON CONFLICT (id) DO UPDATE SET tenant_id = EXCLUDED.tenant_id
    `;
  } finally {
    await sql.end();
  }
});

test.afterAll(async () => {
  try {
    if (SEED_URL.length === 0) return;
    const sql = new Bun.SQL(SEED_URL);
    try {
      await sql`
        UPDATE awcms_micro_setup_state SET tenant_id = NULL
        WHERE id = true AND tenant_id = ${enTenantId}
      `;
      // Soft-delete frees the hostname from the partial dedup index whose
      // predicate is `deleted_at IS NULL` (migration 031's documented reuse
      // mechanism) so a second full suite run starts clean.
      for (const tenantId of [enTenantId, idTenantId]) {
        if (tenantId === "") continue;
        await sql`
          UPDATE awcms_micro_tenant_domains SET deleted_at = now()
          WHERE tenant_id = ${tenantId} AND deleted_at IS NULL
        `;
      }
    } finally {
      await sql.end();
    }
  } finally {
    // Outer finally: release even if the cleanup above returned early, so a
    // failed beforeAll can never leak the cross-file lock.
    await setupStateOwnership?.release();
    setupStateOwnership = null;
  }
});

async function assertNoSeriousViolations(
  page: Page,
  label: string
): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const seriousOrCritical = results.violations.filter(
    (violation) => violation.impact && FAILING_IMPACTS.has(violation.impact)
  );

  if (seriousOrCritical.length > 0) {
    const summary = seriousOrCritical
      .map(
        (violation) =>
          `${violation.id} (${violation.impact}): ${violation.nodes.length} node(s) — ${violation.help}`
      )
      .join("\n");
    throw new Error(
      `${label}: ${seriousOrCritical.length} critical/serious a11y violation(s):\n${summary}`
    );
  }
}

/**
 * Navigate, assert the response actually is the page we meant to scan
 * (status + `<html lang>`), then run axe. Asserting the status BEFORE the
 * scan is what stops a silently-404'd route from being reported as "no
 * violations found" — an error document with three elements always passes.
 */
async function scan(
  page: Page,
  path: string,
  expected: { status: number; lang: string },
  label: string
): Promise<void> {
  const response = await page.goto(path);
  expect(response?.status(), `${label}: HTTP status`).toBe(expected.status);
  await expect(page.locator("html")).toHaveAttribute("lang", expected.lang);
  await assertNoSeriousViolations(page, label);
}

test.describe("Public discovery surfaces — accessibility (axe-core, WCAG 2.2 AA)", () => {
  for (const viewport of VIEWPORTS) {
    test(`listing pages — EN + ID (${viewport.name})`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });

      // Host-resolved, tenant-code-free listing (EN tenant via setup_state).
      await scan(
        page,
        "/news",
        { status: 200, lang: "en" },
        `/news (${viewport.name})`
      );
      // Code-in-path listing, EN and ID tenants (shell lang = tenant default).
      await scan(
        page,
        `/blog/${enTenantCode}`,
        { status: 200, lang: "en" },
        `/blog/{en} (${viewport.name})`
      );
      await scan(
        page,
        `/blog/${idTenantCode}`,
        { status: 200, lang: "id" },
        `/blog/{id} (${viewport.name})`
      );
    });

    test(`blog search — empty + populated, EN + ID (${viewport.name})`, async ({
      page
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });

      // Empty-query state ("enter a search term") — a different DOM branch
      // from the results list, and the one a visitor sees first.
      await scan(
        page,
        "/news/search",
        { status: 200, lang: "en" },
        `/news/search empty (${viewport.name})`
      );
      await scan(
        page,
        `/news/search?q=${SEARCH_TERM}`,
        { status: 200, lang: "en" },
        `/news/search results (${viewport.name})`
      );
      await scan(
        page,
        `/blog/${idTenantCode}/search?q=${SEARCH_TERM}`,
        { status: 200, lang: "id" },
        `/blog/{id}/search results (${viewport.name})`
      );
    });

    test(`site search page — all four render branches, EN + ID (${viewport.name})`, async ({
      page
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });

      // `/search` resolves its UI locale from `?locale=`, not the cookie.
      for (const locale of ["en", "id"] as const) {
        const suffix = `locale=${locale}`;
        // 1. no query → the "enter a term" hint.
        await scan(
          page,
          `/search?${suffix}`,
          { status: 200, lang: locale },
          `/search prompt ${locale} (${viewport.name})`
        );
        // 2. below the minimum length → the "too short" hint.
        await scan(
          page,
          `/search?q=a&${suffix}`,
          { status: 200, lang: locale },
          `/search too-short ${locale} (${viewport.name})`
        );
        // 3. valid query, nothing matches → the empty-results state. This is
        //    the state most likely to be shipped unstyled and unlabelled.
        await scan(
          page,
          `/search?q=zzzqqqnothingmatches&${suffix}`,
          { status: 200, lang: locale },
          `/search no-results ${locale} (${viewport.name})`
        );
        // 4. valid query (results depend on the search index being built —
        //    the page renders either the result list or the empty state, and
        //    both are legitimate a11y targets, so this is not asserted on).
        await scan(
          page,
          `/search?q=${SEARCH_TERM}&${suffix}`,
          { status: 200, lang: locale },
          `/search query ${locale} (${viewport.name})`
        );
      }
    });

    test(`public 404 error document (${viewport.name})`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });

      // Every public route funnels its miss into this one document; a
      // direct-URL negative is a journey a real visitor takes (stale link,
      // typo, unpublished slug) and it must be readable too.
      await scan(
        page,
        "/news/no-such-article-exists",
        { status: 404, lang: "en" },
        `/news 404 (${viewport.name})`
      );
      await expect(page.locator("h1")).toBeVisible();
      await scan(
        page,
        `/blog/${enTenantCode}/no-such-article-exists`,
        { status: 404, lang: "en" },
        `/blog 404 (${viewport.name})`
      );
    });
  }

  test("search is operable by keyboard alone (Tab to field, Enter to submit)", async ({
    page
  }) => {
    await page.goto("/news/search");

    // Tab until focus lands in the search field — bounded, so a keyboard
    // trap or an unreachable field fails fast instead of hanging.
    let reached = false;
    for (let press = 0; press < 20; press += 1) {
      await page.keyboard.press("Tab");
      const isSearchInput = await page.evaluate(() => {
        const active = document.activeElement as HTMLElement | null;
        return (
          active?.tagName === "INPUT" &&
          (active as HTMLInputElement).name === "q"
        );
      });
      if (isSearchInput) {
        reached = true;
        break;
      }
    }
    expect(reached, "search input reachable by Tab").toBe(true);

    // The focused field must be visibly indicated (WCAG 2.4.7). A border
    // colour change is deliberately NOT accepted — see
    // `public-keyboard-journey.e2e.ts` for why that would be unfalsifiable.
    const focusIndicated = await page.evaluate(() => {
      const active = document.activeElement as HTMLElement | null;
      if (!active) return false;
      const style = getComputedStyle(active);
      const outline =
        style.outlineStyle !== "none" &&
        parseFloat(style.outlineWidth || "0") > 0;
      const shadow = style.boxShadow !== "none" && style.boxShadow !== "";
      return outline || shadow;
    });
    expect(focusIndicated, "focused search input has a visible indicator").toBe(
      true
    );

    // Enter submits the native form — core search must work with no mouse
    // and no JavaScript.
    await page.keyboard.type(SEARCH_TERM);
    await page.keyboard.press("Enter");
    await page.waitForURL(/\/search\?/);
    expect(page.url()).toContain(`q=${SEARCH_TERM}`);
  });
});
