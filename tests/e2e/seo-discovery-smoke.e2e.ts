/**
 * E2E smoke spec (Playwright + Bun, skill `awcms-micro-browser-test`) — Issue
 * #267. Exercises the public discovery/syndication surfaces against a running
 * dev server + real Postgres: robots.txt, the sitemap index + a child sitemap,
 * RSS/Atom/JSON feeds, and conditional-request (304) behavior.
 *
 * Pure HTTP via Bun's native `fetch` — deliberately NOT Playwright's `request`
 * (APIRequestContext) fixture. Under `bun --bun playwright test` that fixture's
 * cookie-jar storage throws `TypeError: "…" cannot be parsed as a URL.` the
 * moment a response carries ANY `Set-Cookie` header (isolated to a one-line
 * standalone repro), and every discovery route sets the `awcms_micro_visitor_key`
 * visitor-analytics cookie — so the fixture crashes before a single assertion
 * runs. The cookie itself is valid HTTP (curl/browsers accept it); this is purely
 * a Playwright-on-Bun tooling limitation, so the spec issues plain `fetch`
 * requests instead. `fetch` needs an ABSOLUTE URL, resolved against the
 * `baseURL` fixture (`use.baseURL`, default `http://localhost:4321`); this spec
 * launches no browser.
 *
 * Requires:
 *   - `E2E_SEED_DATABASE_URL` — the PRIVILEGED (superuser) Postgres role, used
 *     here to seed a tenant + a published post + a verified primary domain, and
 *     to point `awcms_micro_setup_state` at that tenant so the default
 *     resolution serves it (no host mapping needed for localhost).
 *   - The dev server under `E2E_BASE_URL` (default `http://localhost:4321`)
 *     running against the SAME database.
 *
 * The three tests share ONE piece of global mutable state — the
 * `awcms_micro_setup_state` singleton that repoints localhost's default tenant
 * resolution at our seeded tenant — so they run serially (`mode: "serial"`) on a
 * single worker rather than being sharded across workers by `fullyParallel:
 * true`. That keeps the single `beforeAll` seed (and its `afterAll` cleanup)
 * from being raced. The seeded domain uses a per-run-unique `normalized_hostname`
 * so it never collides on the partial-unique
 * `awcms_micro_tenant_domains_normalized_hostname_dedup` index (migration 031,
 * `WHERE deleted_at IS NULL`) — across the tests, across Playwright's retry #1
 * (which re-runs `beforeAll` with a fresh value), or across a second full run.
 *
 * Run: `bun run dev` (with DATABASE_URL set) in one terminal, then
 * `bun run test:e2e tests/e2e/seo-discovery-smoke.e2e.ts` in another.
 */
import { test, expect } from "@playwright/test";

const SEED_URL = process.env.E2E_SEED_DATABASE_URL ?? "";

// Shared global setup_state singleton → run serially on one worker.
test.describe.configure({ mode: "serial" });

let seededTenantId = "";
let seededHostname = "";

test.beforeAll(async () => {
  if (SEED_URL.length === 0) {
    throw new Error(
      "E2E_SEED_DATABASE_URL must be set for the SEO discovery smoke spec."
    );
  }
  const unique = crypto.randomUUID().slice(0, 12);
  const code = `seo-e2e-${unique}`;
  // Per-run-unique hostname keeps the normalized_hostname dedup index (migration
  // 031, unique WHERE deleted_at IS NULL) collision-free under retry / rerun.
  seededHostname = `seo-e2e-${unique}.example`;
  const sql = new Bun.SQL(SEED_URL);
  try {
    const tenantRows = await sql`
      INSERT INTO awcms_micro_tenants
        (tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
      VALUES (${code}, 'SEO E2E', 'SEO E2E Legal', 'active', 'en', 'light')
      RETURNING id
    `;
    seededTenantId = tenantRows[0]!.id as string;

    await sql`
      INSERT INTO awcms_micro_tenant_domains
        (tenant_id, hostname, normalized_hostname, domain_type, status, is_primary)
      VALUES (${seededTenantId}, ${seededHostname}, ${seededHostname}, 'custom_domain', 'active', true)
    `;

    await sql`
      INSERT INTO awcms_micro_blog_posts
        (tenant_id, author_tenant_user_id, title, slug, content_json, content_text,
         status, visibility, locale, published_at, updated_at)
      VALUES (${seededTenantId}, ${crypto.randomUUID()}, 'E2E Hello', 'e2e-hello',
        '{}'::jsonb, 'body', 'published', 'public', 'en',
        '2026-06-01T00:00:00.000Z', '2026-06-01T00:00:00.000Z')
    `;

    // Point the setup singleton at this tenant so the default resolution
    // (no host mapping) serves it for localhost requests.
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
  if (SEED_URL.length === 0 || seededTenantId === "") return;
  const sql = new Bun.SQL(SEED_URL);
  try {
    // Detach the shared singleton from this run's tenant, then soft-delete the
    // seeded domain: setting `deleted_at` drops the row from the partial
    // `..._normalized_hostname_dedup` index (its predicate is `deleted_at IS
    // NULL`), freeing the hostname — the exact reuse mechanism migration 031
    // documents — so a second full suite run starts clean. Both are guarded,
    // idempotent UPDATEs (no FK-cascade hazard), and run only after every test
    // in the serial group has finished.
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
});

/** Resolve a discovery path against the configured base origin (fetch needs an absolute URL). */
function discoveryUrl(path: string, baseURL: string | undefined): string {
  return new URL(path, baseURL).toString();
}

test.describe("SEO discovery smoke (#267)", () => {
  test("robots.txt is served as text and points at the sitemap", async ({
    baseURL
  }) => {
    const res = await fetch(discoveryUrl("/robots.txt", baseURL));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/plain");
    const body = await res.text();
    expect(body).toContain("User-agent: *");
    expect(body).toContain("Sitemap:");
  });

  test("sitemap index + child sitemap serve valid XML with the published URL", async ({
    baseURL
  }) => {
    const index = await fetch(discoveryUrl("/sitemap.xml", baseURL));
    expect(index.status).toBe(200);
    expect(index.headers.get("content-type")).toContain("xml");
    expect(await index.text()).toContain("<sitemapindex");

    const child = await fetch(discoveryUrl("/sitemap-1.xml", baseURL));
    expect(child.status).toBe(200);
    expect(await child.text()).toContain("/news/e2e-hello");
  });

  test("RSS, Atom, and JSON feeds serve the published item", async ({
    baseURL
  }) => {
    const rss = await fetch(discoveryUrl("/feed.xml", baseURL));
    expect(rss.status).toBe(200);
    expect(rss.headers.get("content-type")).toContain("rss");
    expect(await rss.text()).toContain("e2e-hello");

    const atom = await fetch(discoveryUrl("/atom.xml", baseURL));
    expect(atom.status).toBe(200);
    expect(atom.headers.get("content-type")).toContain("atom");

    const json = await fetch(discoveryUrl("/feed.json", baseURL));
    expect(json.status).toBe(200);
    expect(json.headers.get("content-type")).toContain("json");
    const parsed = (await json.json()) as {
      version: string;
      items: unknown[];
    };
    expect(parsed.version).toBe("https://jsonfeed.org/version/1.1");
    expect(parsed.items.length).toBeGreaterThan(0);
  });

  test("conditional request returns 304 when the ETag matches", async ({
    baseURL
  }) => {
    const sitemapUrl = discoveryUrl("/sitemap.xml", baseURL);
    const first = await fetch(sitemapUrl);
    const etag = first.headers.get("etag");
    expect(etag).toBeTruthy();

    const conditional = await fetch(sitemapUrl, {
      headers: { "if-none-match": etag! }
    });
    expect(conditional.status).toBe(304);
  });
});
