/**
 * Automated accessibility smoke test for the PUBLIC (anonymous) surfaces
 * (Playwright + Bun + `@axe-core/playwright`) — Issue #296, epic #261
 * (website-platform), acceptance criterion "full-journey accessibility
 * (axe EN/ID)". This is the public-journey counterpart to
 * `admin-a11y-smoke.e2e.ts` (which only covers the authenticated admin
 * shell): it scans the anonymous public pages with axe-core's
 * `wcag2a`/`wcag2aa`/`wcag21aa`/`wcag22aa` rule tags and fails on any
 * "critical" or "serious" violation. "moderate"/"minor" findings are out
 * of scope for a smoke gate (same rationale + threshold as the admin
 * spec) — see `awcms-micro-ux-review` for a full page-by-page audit.
 *
 * DEVICE MATRIX (Issue #296, "desktop + mobile"): every page is scanned at
 * both a desktop (1280×800) and a small-phone (390×844) viewport, because
 * several WCAG 2.2 AA rules are viewport-dependent (`target-size`,
 * reflow/`meta-viewport`, breakpoint-specific contrast) and a desktop-only
 * pass can miss a critical/serious mobile-only regression. Screen-reader
 * and the full published-content-template journey remain deferred (needs a
 * bootstrapped pilot tenant — see `website-platform-e2e-evidence.md`
 * §Deferred work).
 *
 * `@axe-core/playwright` is a plain JS library used from inside an
 * already-`bun --bun playwright test`-run process (not Node-only build
 * tooling) — the same "not an AGENTS.md #14 Bun-only violation" reasoning
 * the admin spec's header documents applies verbatim.
 *
 * LOCALE MECHANISM (verified against `src/middleware.ts` +
 * `src/lib/i18n/{locale,request-locale}.ts`): for every NON-`/admin/*`
 * route the effective locale is resolved COOKIE-ONLY —
 * `resolveRequestLocale(context.cookies)` reads the `awcms_micro_locale`
 * cookie (`LOCALE_COOKIE_NAME`), whose only supported values are `en` and
 * `id`, falling back to the tenant default then `en`. So both locales are
 * exercised purely by seeding that cookie before navigating — no DB seed,
 * no tenant, no host header, no `E2E_SEED_DATABASE_URL`. That keeps this
 * spec hermetic and retry-safe: there is no mutable server/DB state to
 * re-arm on a Playwright retry.
 *
 * SCOPE — only public pages that render RELIABLY without seeded content:
 *   - `/` (`src/pages/index.astro`): a fully STATIC page with a hardcoded
 *     `lang="id"` that does NOT consult `Astro.locals.locale`, so a locale
 *     cookie has no effect on it — scanned ONCE rather than per-locale.
 *   - `/newsletter/demo` (`src/pages/newsletter/demo.astro`): SSR page that
 *     renders `Astro.locals.locale`-translated text + a labelled subscribe
 *     form; scanned in BOTH locales, plus a cheap keyboard-focusability
 *     assertion on its primary interactive controls.
 *   - `/comments/demo` (`src/pages/comments/demo.astro`) with NO
 *     `resourceId`: renders the localized heading + "missing resource"
 *     copy (the `CommentsSection` island itself needs a seeded tenant +
 *     resource, deliberately NOT exercised here to stay hermetic);
 *     scanned in BOTH locales.
 *
 * DELIBERATELY SKIPPED: a published blog/news public page. Rendering one
 * positively requires bootstrapping a tenant through the setup wizard
 * (bare-seeded tenants do NOT pass the public blog/news route gates —
 * `isLegacyTenantRouteEnabled` / `checkBlogContentAndRouteGate`), which is
 * far more fragile than this issue's a11y-smoke goal warrants; the seeded
 * discovery/feed surfaces are already covered by `seo-discovery-smoke`.
 *
 * Requires only the server under `E2E_BASE_URL` (default
 * `http://localhost:4321`). Run:
 *   `bun run test:e2e tests/e2e/public-a11y-smoke.e2e.ts`.
 */
import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];
const FAILING_IMPACTS = new Set(["critical", "serious"]);

/** The cookie the language switcher sets; `LOCALE_COOKIE_NAME` in `locale.ts`. */
const LOCALE_COOKIE_NAME = "awcms_micro_locale";
const LOCALES = ["en", "id"] as const;

/**
 * Device matrix (Issue #296, "desktop + mobile"). The same axe scan runs at
 * each viewport because several WCAG 2.2 AA rules are viewport-dependent —
 * `target-size` (2.5.8), `meta-viewport`/reflow (1.4.10), and contrast on
 * responsive layouts that change at a breakpoint — so a desktop-only pass
 * can miss a critical/serious mobile-only violation. 390×844 is a common
 * small-phone logical viewport (iPhone 12/13/14 class); 1280×800 a laptop.
 */
const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844 }
] as const;

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
 * Seed the locale cookie for the origin under test, then navigate. Clearing
 * first keeps a prior locale from leaking across a per-locale loop iteration.
 */
async function gotoWithLocale(
  page: Page,
  path: string,
  locale: (typeof LOCALES)[number],
  baseURL: string | undefined
): Promise<void> {
  await page.context().clearCookies();
  await page.context().addCookies([
    {
      name: LOCALE_COOKIE_NAME,
      value: locale,
      url: baseURL ?? "http://localhost:4321"
    }
  ]);
  await page.goto(path);
}

test.describe("Public — accessibility smoke (axe-core, WCAG 2.2 AA)", () => {
  for (const viewport of VIEWPORTS) {
    test(`homepage has no critical/serious violations (${viewport.name})`, async ({
      page
    }) => {
      // `/` is static (hardcoded lang, ignores the locale cookie) — scan once
      // per viewport rather than per-locale.
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });
      await page.goto("/");
      await assertNoSeriousViolations(page, `/ (homepage, ${viewport.name})`);
    });

    for (const locale of LOCALES) {
      test(`newsletter demo page has no critical/serious violations (${viewport.name}, ${locale})`, async ({
        page,
        baseURL
      }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height
        });
        await gotoWithLocale(page, "/newsletter/demo", locale, baseURL);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await assertNoSeriousViolations(
          page,
          `/newsletter/demo (${viewport.name}, ${locale})`
        );

        // Cheap keyboard-focusability check on the primary interactive controls.
        const email = page.locator("#newsletter-email");
        await email.focus();
        await expect(email).toBeFocused();

        const submit = page.locator(
          "form[data-newsletter-subscribe] button[type='submit']"
        );
        await submit.focus();
        await expect(submit).toBeFocused();
      });

      test(`comments demo page has no critical/serious violations (${viewport.name}, ${locale})`, async ({
        page,
        baseURL
      }) => {
        // No `resourceId` → localized heading + "missing resource" copy; the
        // CommentsSection island (needs a seeded tenant+resource) is not mounted.
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height
        });
        await gotoWithLocale(page, "/comments/demo", locale, baseURL);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await assertNoSeriousViolations(
          page,
          `/comments/demo (${viewport.name}, ${locale})`
        );
      });
    }
  }
});
