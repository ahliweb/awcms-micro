/**
 * Automated accessibility test for the PUBLIC rendered CONTENT-READING
 * templates — the published news/blog article detail pages (Playwright + Bun +
 * `@axe-core/playwright`) — Issue #296, epic #261 (website-platform),
 * acceptance criterion "full-journey accessibility (axe EN/ID)".
 *
 * This closes the piece `public-a11y-smoke.e2e.ts` deliberately left deferred:
 * it scans the anonymous homepage / newsletter-demo / comments-demo pages but
 * NOT a published `/news` or `/blog` article template, because rendering one
 * positively needs a bootstrapped tenant with published content (a bare-seeded
 * tenant does not pass the public blog/news route gates). This spec supplies
 * exactly that content — reusing the SAME proven seed shape as
 * `seo-discovery-smoke.e2e.ts` (tenant + verified primary domain + a published
 * post + repointing `awcms_micro_setup_state` at the tenant so localhost's
 * default resolution serves it) — then runs axe-core over the rendered
 * article templates.
 *
 * COVERAGE (Issue #296 "axe over the rendered content-reading templates
 * `/news`, `/blog` article pages"):
 *   - `/news/{slug}` (Issue #560, tenant-code-free canonical route,
 *     `withNewsTenant`, resolved via the setup_state singleton for localhost);
 *   - `/blog/{tenantCode}/{slug}` (Issue #540, tenant-code route,
 *     `resolvePublicTenantByCode` — `legacyTenantRouteEnabled` defaults true);
 *   both share the exact same `renderPublicPageShell` +
 *   `buildNewsArticleSeoMetadata` + `renderContentJsonToHtml` render path, so
 *   the two routes validate the shared content template from both entry points.
 *
 * LOCALE (EN/ID): the rendered `<html lang>` of these routes is the ARTICLE's
 * own `locale` (`renderPublicPageShell({ locale: post.locale })`), NOT the
 * `awcms_micro_locale` cookie the static/demo pages key off. So EN and ID are
 * exercised by seeding TWO posts — one `locale='en'`, one `locale='id'` — and
 * scanning each; the article's language is a property of the content, which is
 * the correct thing to assert for a content-reading template.
 *
 * DEVICE MATRIX (Issue #296 "desktop + mobile"): every page is scanned at both
 * a desktop (1280×800) and a small-phone (390×844) viewport — several WCAG 2.2
 * AA rules are viewport-dependent (`target-size`, reflow, breakpoint contrast)
 * and a desktop-only pass can miss a critical/serious mobile-only regression.
 * Screen-reader journeys remain deferred (manual; see
 * `website-platform-e2e-evidence.md` §Deferred work).
 *
 * Same axe threshold + rule tags as `public-a11y-smoke.e2e.ts`:
 * `wcag2a`/`wcag2aa`/`wcag21aa`/`wcag22aa`, failing on any `critical`/`serious`
 * violation. `@axe-core/playwright` is a plain JS library used from inside an
 * already-`bun --bun playwright test`-run process (the same "not an AGENTS.md
 * #14 Bun-only violation" reasoning `admin-a11y-smoke.e2e.ts` documents).
 *
 * Requires (identical to `seo-discovery-smoke.e2e.ts`):
 *   - `E2E_SEED_DATABASE_URL` — the PRIVILEGED (superuser) Postgres role, used
 *     to seed the tenant + posts + verified domain and to repoint
 *     `awcms_micro_setup_state`.
 *   - The dev server under `E2E_BASE_URL` (default `http://localhost:4321`)
 *     running against the SAME database.
 *
 * Shares the `awcms_micro_setup_state` singleton with five sibling specs, so it
 * runs serially and takes the cross-file advisory lock (`setup-state-ownership`)
 * exactly like `seo-discovery-smoke` — Playwright's `fullyParallel: true` runs
 * spec FILES in parallel and `mode: "serial"` only serializes WITHIN a file.
 *
 * Run: `bun run dev` (with DATABASE_URL set) in one terminal, then
 * `bun run test:e2e tests/e2e/public-content-a11y.e2e.ts` in another.
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

/**
 * Device matrix (Issue #296 "desktop + mobile"). 390×844 is a common
 * small-phone logical viewport (iPhone 12/13/14 class); 1280×800 a laptop.
 */
const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844 }
] as const;

// Shared global setup_state singleton → run serially on one worker.
test.describe.configure({ mode: "serial" });

let seededTenantId = "";
let seededTenantCode = "";
let seededHostname = "";
const slugEn = "content-a11y-en";
const slugId = "content-a11y-id";
// Held for the file's lifetime so no sibling spec repoints the shared
// `awcms_micro_setup_state` singleton between our seed and our page loads.
let setupStateOwnership: SetupStateOwnership | null = null;

/**
 * A realistic content_json (the top-level `{ blocks: [...] }` shape
 * `renderContentJsonToHtml` reads) — a heading (level 2, so the document order
 * is h1 → h2 under the shell's `<h1>{title}`), a paragraph, a list, and a
 * quote. Real body content exercises heading-order, list-markup, and contrast
 * rules over the rendered article, not just the page chrome.
 */
function articleContentJson(locale: "en" | "id"): string {
  const blocks =
    locale === "en"
      ? [
          { type: "heading", level: 2, text: "About this article" },
          {
            type: "paragraph",
            text: "This published article exercises the public content-reading template for accessibility."
          },
          { type: "list", items: ["First point", "Second point"] },
          { type: "quote", text: "An accessible website is a usable website." }
        ]
      : [
          { type: "heading", level: 2, text: "Tentang artikel ini" },
          {
            type: "paragraph",
            text: "Artikel yang telah dipublikasikan ini menguji template baca konten publik untuk aksesibilitas."
          },
          { type: "list", items: ["Poin pertama", "Poin kedua"] },
          {
            type: "quote",
            text: "Situs yang mudah diakses adalah situs yang mudah digunakan."
          }
        ];
  return JSON.stringify({ blocks });
}

test.beforeAll(async () => {
  if (SEED_URL.length === 0) {
    throw new Error(
      "E2E_SEED_DATABASE_URL must be set for the public content a11y spec."
    );
  }
  setupStateOwnership = await acquireSetupStateOwnership(SEED_URL);
  const unique = crypto.randomUUID().slice(0, 12);
  seededTenantCode = `a11y-e2e-${unique}`;
  // Per-run-unique hostname keeps the normalized_hostname dedup index (migration
  // 031, unique WHERE deleted_at IS NULL) collision-free under retry / rerun.
  seededHostname = `a11y-e2e-${unique}.example`;
  const sql = new Bun.SQL(SEED_URL);
  try {
    const tenantRows = await sql`
      INSERT INTO awcms_micro_tenants
        (tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
      VALUES (${seededTenantCode}, 'Content A11y E2E', 'Content A11y E2E Legal', 'active', 'en', 'light')
      RETURNING id
    `;
    seededTenantId = tenantRows[0]!.id as string;

    await sql`
      INSERT INTO awcms_micro_tenant_domains
        (tenant_id, hostname, normalized_hostname, domain_type, status, is_primary)
      VALUES (${seededTenantId}, ${seededHostname}, ${seededHostname}, 'custom_domain', 'active', true)
    `;

    // Two published posts — one per locale — so the rendered `<html lang>`
    // (which is `post.locale`, not the locale cookie) covers EN and ID.
    for (const [slug, locale, title] of [
      [slugEn, "en", "Content A11y EN"],
      [slugId, "id", "Content A11y ID"]
    ] as const) {
      await sql`
        INSERT INTO awcms_micro_blog_posts
          (tenant_id, author_tenant_user_id, title, slug, content_json, content_text,
           status, visibility, locale, published_at, updated_at)
        VALUES (${seededTenantId}, ${crypto.randomUUID()}, ${title}, ${slug},
          ${articleContentJson(locale)}::jsonb, 'body', 'published', 'public', ${locale},
          '2026-06-01T00:00:00.000Z', '2026-06-01T00:00:00.000Z')
      `;
    }

    // Point the setup singleton at this tenant so the default resolution
    // (no host mapping) serves it for localhost `/news/{slug}` requests.
    await sql`
      INSERT INTO awcms_micro_setup_state (id, tenant_id, locked_at)
      VALUES (true, ${seededTenantId}, now())
      ON CONFLICT (id) DO UPDATE SET tenant_id = EXCLUDED.tenant_id
    `;
  } finally {
    await sql.end();
  }
});

test.afterAll(async () => {
  try {
    if (SEED_URL.length === 0 || seededTenantId === "") return;
    const sql = new Bun.SQL(SEED_URL);
    try {
      // Detach the shared singleton from this run's tenant, then soft-delete the
      // seeded domain (setting `deleted_at` frees the hostname from the partial
      // `..._normalized_hostname_dedup` index whose predicate is `deleted_at IS
      // NULL` — migration 031's documented reuse mechanism) so a second full
      // suite run starts clean. Both are guarded, idempotent UPDATEs.
      await sql`
        UPDATE awcms_micro_setup_state SET tenant_id = NULL
        WHERE id = true AND tenant_id = ${seededTenantId}
      `;
      await sql`
        UPDATE awcms_micro_tenant_domains SET deleted_at = now()
        WHERE tenant_id = ${seededTenantId} AND deleted_at IS NULL
      `;
    } finally {
      await sql.end();
    }
  } finally {
    // Release LAST (outer finally) so the lock is freed even on the early return
    // above — otherwise a beforeAll that acquired then failed would leak it.
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
 * Load a rendered article page, assert it actually rendered the published
 * article (200 + the `<h1>` title, not a 404/error shell), assert its
 * `<html lang>`, then run the axe scan.
 */
async function scanArticle(
  page: Page,
  path: string,
  expectedLang: "en" | "id",
  label: string
): Promise<void> {
  const response = await page.goto(path);
  expect(response?.status(), `${label}: HTTP status`).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", expectedLang);
  // The article shell renders the title in an <h1>; presence confirms we hit
  // the content template rather than a generic page.
  await expect(page.locator("main h1")).toBeVisible();
  await assertNoSeriousViolations(page, label);
}

test.describe("Public content templates — accessibility (axe-core, WCAG 2.2 AA)", () => {
  for (const viewport of VIEWPORTS) {
    test(`/news article template — EN + ID (${viewport.name})`, async ({
      page
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });
      await scanArticle(
        page,
        `/news/${slugEn}`,
        "en",
        `/news/${slugEn} (${viewport.name})`
      );
      await scanArticle(
        page,
        `/news/${slugId}`,
        "id",
        `/news/${slugId} (${viewport.name})`
      );
    });

    test(`/blog/{tenantCode} article template — EN + ID (${viewport.name})`, async ({
      page
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });
      await scanArticle(
        page,
        `/blog/${seededTenantCode}/${slugEn}`,
        "en",
        `/blog/${seededTenantCode}/${slugEn} (${viewport.name})`
      );
      await scanArticle(
        page,
        `/blog/${seededTenantCode}/${slugId}`,
        "id",
        `/blog/${seededTenantCode}/${slugId} (${viewport.name})`
      );
    });
  }
});
