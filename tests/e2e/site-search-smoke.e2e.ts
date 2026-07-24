/**
 * E2E smoke spec (Playwright + Bun, skill `awcms-micro-browser-test`) — Issue
 * #270. Exercises the PUBLIC search surfaces against a running dev/preview server
 * + real Postgres: the `/search` HTML page, the JSON `/api/v1/site-search/query`
 * and `/suggest` endpoints, and the empty state.
 *
 * Pure HTTP via Bun's native `fetch` — deliberately NOT Playwright's `request`
 * (APIRequestContext) fixture, which crashes under `bun --bun playwright test` on
 * any `Set-Cookie` response ([[awcms-micro-e2e-not-in-check]]); `fetch` needs an
 * ABSOLUTE URL resolved against `use.baseURL`. This spec launches no browser
 * (keyboard-nav/ARIA is unit-tested in `tests/unit/site-search-domain.test.ts`).
 *
 * Requires:
 *   - `E2E_SEED_DATABASE_URL` — the PRIVILEGED Postgres role, used to seed a
 *     tenant, a published post, a directly-inserted search index document, and to
 *     point `awcms_micro_setup_state` at the tenant so localhost's default
 *     resolution serves it.
 *   - The server under `E2E_BASE_URL` (default `http://localhost:4321`) against
 *     the SAME database.
 *
 * Run: build + start the server (with DATABASE_URL), then
 * `bun run test:e2e tests/e2e/site-search-smoke.e2e.ts`.
 */
import { test, expect } from "@playwright/test";

import {
  acquireSetupStateOwnership,
  type SetupStateOwnership
} from "./helpers/setup-state-ownership";

const SEED_URL = process.env.E2E_SEED_DATABASE_URL ?? "";

test.describe.configure({ mode: "serial" });

let seededTenantId = "";
// Held for the file's lifetime so no sibling spec repoints the shared
// `awcms_micro_setup_state` singleton between our seed and our HTTP assertions.
let setupStateOwnership: SetupStateOwnership | null = null;

test.beforeAll(async () => {
  if (SEED_URL.length === 0) {
    throw new Error(
      "E2E_SEED_DATABASE_URL must be set for the site-search smoke spec."
    );
  }
  setupStateOwnership = await acquireSetupStateOwnership(SEED_URL);
  const unique = crypto.randomUUID().slice(0, 12);
  const code = `ss-e2e-${unique}`;
  const sql = new Bun.SQL(SEED_URL);
  try {
    const tenantRows = await sql`
      INSERT INTO awcms_micro_tenants
        (tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
      VALUES (${code}, 'Site Search E2E', 'SS E2E Legal', 'active', 'en', 'light')
      RETURNING id
    `;
    seededTenantId = tenantRows[0]!.id as string;

    // A directly-inserted index document (the engine is integration-tested; here
    // we just need a searchable row so the public surfaces return results).
    await sql`
      INSERT INTO awcms_micro_site_search_documents
        (tenant_id, source_key, resource_type, resource_id, locale, url, title,
         summary, body_text, tags, source_updated_at, source_checksum)
      VALUES (${seededTenantId}, 'blog_content.post', 'blog_post', 'e2e-1', 'en',
        '/news/e2e-searchable', 'E2E Searchable Aardvark', 'a summary',
        'the searchable aardvark body text', ${sql.array([], "text")}, now(), 'chk-e2e-1')
    `;

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
      await sql`
        UPDATE awcms_micro_setup_state SET tenant_id = NULL
        WHERE id = true AND tenant_id = ${seededTenantId}
      `;
    } finally {
      await sql.end();
    }
  } finally {
    // Release LAST so the lock is freed even on the early return above.
    await setupStateOwnership?.release();
    setupStateOwnership = null;
  }
});

function url(path: string, baseURL: string | undefined): string {
  return new URL(path, baseURL).toString();
}

test.describe("site_search public smoke (#270)", () => {
  test("the /search page renders results with an escaped, marked snippet", async ({
    baseURL
  }) => {
    const res = await fetch(url("/search?q=aardvark", baseURL));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    const body = await res.text();
    expect(body).toContain("E2E Searchable Aardvark");
    expect(body).toContain("<mark>");
    expect(body).toContain('role="search"');
    // The search-results page is noindex.
    expect(body).toContain('name="robots" content="noindex');
  });

  test("the /search page shows the empty state with no query", async ({
    baseURL
  }) => {
    const res = await fetch(url("/search", baseURL));
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("site-search-hint");
  });

  test("the JSON query endpoint returns escaped results", async ({
    baseURL
  }) => {
    const res = await fetch(
      url("/api/v1/site-search/query?q=aardvark", baseURL)
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      success: boolean;
      data: { items: { title: string; snippet: string; url: string }[] };
    };
    expect(json.success).toBe(true);
    expect(json.data.items.length).toBeGreaterThan(0);
    expect(json.data.items[0]!.title).toBe("E2E Searchable Aardvark");
    expect(json.data.items[0]!.snippet).not.toContain("<script");
  });

  test("the JSON query endpoint returns empty for a too-short query", async ({
    baseURL
  }) => {
    const res = await fetch(url("/api/v1/site-search/query?q=a", baseURL));
    expect(res.status).toBe(200);
    const json = (await res.json()) as { data: { items: unknown[] } };
    expect(json.data.items).toHaveLength(0);
  });

  test("the JSON suggest endpoint returns title suggestions", async ({
    baseURL
  }) => {
    const res = await fetch(
      url("/api/v1/site-search/suggest?q=aardv", baseURL)
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      success: boolean;
      data: { items: { title: string }[] };
    };
    expect(json.success).toBe(true);
    expect(json.data.items.some((i) => i.title.includes("Aardvark"))).toBe(
      true
    );
  });
});
