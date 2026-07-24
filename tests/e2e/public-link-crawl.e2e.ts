/**
 * Rendered-site internal LINK-INTEGRITY crawl over the PUBLIC surface
 * (Issue #296, epic #261 website-platform, acceptance "Link check green — no
 * broken internal/SEO/feed links"). This is the RENDERED-PAGE counterpart to
 * the handler-level `public-link-integrity.integration.test.ts` (which follows
 * the sitemap/canonical/hreflang/robots graph on a SEEDED tenant): here we
 * fetch each hermetic public entry page, extract every same-origin `<a href>`
 * it actually renders, and assert each one resolves (HTTP < 400 after
 * redirects) — proving the rendered pages advertise no dangling internal link.
 *
 * HERMETIC — no DB seed, no tenant, no `E2E_SEED_DATABASE_URL`. The entry set
 * is exactly the public pages that render reliably without seeded content
 * (verified against `src/pages/**`): `/`, `/login`, `/register`,
 * `/forgot-password`, `/newsletter/demo`, `/comments/demo`. Published
 * blog/news content links are deliberately NOT crawled from here — a positive
 * render needs a wizard-bootstrapped tenant, and that graph is already covered
 * by `public-link-integrity.integration.test.ts` (sitemap → child → every
 * content `<loc>` = 200) and `seo-discovery-smoke.e2e.ts`.
 *
 * Depth-1 crawl (entries → the links they render): the hermetic public pages
 * only inter-link within this same reliably-rendering set (login ↔ register ↔
 * forgot-password, the two demo pages, the homepage's health link), so a
 * single hop covers the reachable hermetic graph without wandering into a
 * seed-gated route that would legitimately 404 on a bare server. A bounded cap
 * is still applied as a runaway guard.
 *
 * Pure Bun `fetch` (no browser) — deliberately NOT Playwright's `request`
 * (APIRequestContext) fixture: under `bun --bun playwright test` that fixture
 * throws `TypeError: … cannot be parsed as a URL.` the moment a response
 * carries a `Set-Cookie` header (the public routes set the
 * `awcms_micro_visitor_key` analytics cookie), exactly as
 * `seo-discovery-smoke.e2e.ts` documents. `fetch` needs an absolute URL,
 * resolved against the `baseURL` fixture (`use.baseURL`, default
 * `http://localhost:4321`).
 *
 * Requires only the server under `E2E_BASE_URL`. Run:
 *   `bun run test:e2e tests/e2e/public-link-crawl.e2e.ts`.
 */
import { test, expect } from "@playwright/test";

const ENTRY_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/newsletter/demo",
  "/comments/demo"
] as const;

/** Runaway guard — the hermetic public graph is tiny; a crawl this large means we wandered somewhere unexpected. */
const MAX_URLS = 60;

/** Schemes/targets that are not internal same-origin page links to follow. */
function isCrawlableHref(href: string): boolean {
  if (href.length === 0) return false;
  if (href.startsWith("#")) return false;
  const lower = href.toLowerCase();
  return !(
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:") ||
    lower.startsWith("javascript:") ||
    lower.startsWith("data:")
  );
}

/** Extract raw href values from HTML (double- or single-quoted). */
function extractHrefs(html: string): string[] {
  const hrefs: string[] = [];
  const re = /href\s*=\s*("([^"]*)"|'([^']*)')/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    hrefs.push(match[2] ?? match[3] ?? "");
  }
  return hrefs;
}

test.describe("Public — rendered-site internal link integrity (Issue #296)", () => {
  test("every same-origin link rendered on the public entry pages resolves", async ({
    baseURL
  }) => {
    const origin = new URL(baseURL ?? "http://localhost:4321").origin;

    // 1) Discover: fetch each entry page, collect its same-origin links.
    const discovered = new Map<string, string>(); // url -> where it was found
    for (const entry of ENTRY_PATHS) {
      const pageUrl = new URL(entry, origin).toString();
      const res = await fetch(pageUrl, { redirect: "follow" });
      expect(
        res.status,
        `entry page ${entry} should render (got ${res.status})`
      ).toBeLessThan(400);

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("text/html")) continue;

      const html = await res.text();
      for (const rawHref of extractHrefs(html)) {
        if (!isCrawlableHref(rawHref)) continue;
        let abs: URL;
        try {
          abs = new URL(rawHref, pageUrl);
        } catch {
          continue; // unparseable href — not a navigable link
        }
        if (abs.origin !== origin) continue; // external — never followed
        abs.hash = "";
        const key = abs.pathname + abs.search;
        if (!discovered.has(key)) discovered.set(key, entry);
      }
    }

    expect(
      discovered.size,
      "crawl found an implausibly large link set — likely wandered off the hermetic public graph"
    ).toBeLessThanOrEqual(MAX_URLS);

    // 2) Verify: every discovered internal link resolves (< 400 after redirects).
    const broken: string[] = [];
    for (const [pathAndQuery, foundOn] of discovered) {
      const target = new URL(pathAndQuery, origin).toString();
      const res = await fetch(target, { redirect: "follow" });
      if (res.status >= 400) {
        broken.push(
          `${pathAndQuery} → HTTP ${res.status} (linked from ${foundOn})`
        );
      }
    }

    expect(
      broken,
      `broken internal link(s) found on rendered public pages:\n${broken.join("\n")}`
    ).toEqual([]);
  });
});
