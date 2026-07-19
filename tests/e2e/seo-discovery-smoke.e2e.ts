/**
 * E2E smoke spec (Playwright + Bun, skill `awcms-micro-browser-test`) — Issue
 * #267. Exercises the public discovery/syndication surfaces against a running
 * dev server + real Postgres: robots.txt, the sitemap index + a child sitemap,
 * RSS/Atom/JSON feeds, and conditional-request (304) behavior.
 *
 * Requires:
 *   - `E2E_SEED_DATABASE_URL` — the PRIVILEGED (superuser) Postgres role, used
 *     here to seed a tenant + a published post + a verified primary domain, and
 *     to point `awcms_micro_setup_state` at that tenant so the default
 *     resolution serves it (no host mapping needed for localhost).
 *   - The dev server under `E2E_BASE_URL` (default `http://localhost:4321`)
 *     running against the SAME database.
 *
 * Run: `bun run dev` (with DATABASE_URL set) in one terminal, then
 * `bun run test:e2e tests/e2e/seo-discovery-smoke.e2e.ts` in another.
 */
import { test, expect } from "@playwright/test";

const SEED_URL = process.env.E2E_SEED_DATABASE_URL ?? "";

test.beforeAll(async () => {
  if (SEED_URL.length === 0) {
    throw new Error(
      "E2E_SEED_DATABASE_URL must be set for the SEO discovery smoke spec."
    );
  }
  const sql = new Bun.SQL(SEED_URL);
  try {
    const code = `seo-e2e-${Date.now()}`;
    const tenantRows = await sql`
      INSERT INTO awcms_micro_tenants
        (tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
      VALUES (${code}, 'SEO E2E', 'SEO E2E Legal', 'active', 'en', 'light')
      RETURNING id
    `;
    const tenantId = tenantRows[0]!.id as string;

    await sql`
      INSERT INTO awcms_micro_tenant_domains
        (tenant_id, hostname, normalized_hostname, domain_type, status, is_primary)
      VALUES (${tenantId}, 'seo-e2e.example', 'seo-e2e.example', 'custom_domain', 'active', true)
    `;

    await sql`
      INSERT INTO awcms_micro_blog_posts
        (tenant_id, author_tenant_user_id, title, slug, content_json, content_text,
         status, visibility, locale, published_at, updated_at)
      VALUES (${tenantId}, ${crypto.randomUUID()}, 'E2E Hello', 'e2e-hello',
        '{}'::jsonb, 'body', 'published', 'public', 'en',
        '2026-06-01T00:00:00.000Z', '2026-06-01T00:00:00.000Z')
    `;

    // Point the setup singleton at this tenant so the default resolution
    // (no host mapping) serves it for localhost requests.
    await sql`
      INSERT INTO awcms_micro_setup_state (id, tenant_id, locked_at)
      VALUES (true, ${tenantId}, now())
      ON CONFLICT (id) DO UPDATE SET tenant_id = EXCLUDED.tenant_id
    `;
  } finally {
    await sql.end();
  }
});

test.describe("SEO discovery smoke (#267)", () => {
  test("robots.txt is served as text and points at the sitemap", async ({
    request
  }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("text/plain");
    const body = await res.text();
    expect(body).toContain("User-agent: *");
    expect(body).toContain("Sitemap:");
  });

  test("sitemap index + child sitemap serve valid XML with the published URL", async ({
    request
  }) => {
    const index = await request.get("/sitemap.xml");
    expect(index.status()).toBe(200);
    expect(index.headers()["content-type"]).toContain("xml");
    expect(await index.text()).toContain("<sitemapindex");

    const child = await request.get("/sitemap-1.xml");
    expect(child.status()).toBe(200);
    expect(await child.text()).toContain("/news/e2e-hello");
  });

  test("RSS, Atom, and JSON feeds serve the published item", async ({
    request
  }) => {
    const rss = await request.get("/feed.xml");
    expect(rss.status()).toBe(200);
    expect(rss.headers()["content-type"]).toContain("rss");
    expect(await rss.text()).toContain("e2e-hello");

    const atom = await request.get("/atom.xml");
    expect(atom.status()).toBe(200);
    expect(atom.headers()["content-type"]).toContain("atom");

    const json = await request.get("/feed.json");
    expect(json.status()).toBe(200);
    expect(json.headers()["content-type"]).toContain("json");
    const parsed = JSON.parse(await json.text());
    expect(parsed.version).toBe("https://jsonfeed.org/version/1.1");
    expect(parsed.items.length).toBeGreaterThan(0);
  });

  test("conditional request returns 304 when the ETag matches", async ({
    request
  }) => {
    const first = await request.get("/sitemap.xml");
    const etag = first.headers()["etag"];
    expect(etag).toBeTruthy();

    const conditional = await request.get("/sitemap.xml", {
      headers: { "if-none-match": etag! }
    });
    expect(conditional.status()).toBe(304);
  });
});
