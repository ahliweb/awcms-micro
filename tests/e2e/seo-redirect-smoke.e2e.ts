/**
 * E2E smoke spec (Playwright + Bun) — Issue #268. Exercises the PUBLIC redirect
 * governance against a running dev server + real Postgres, through the real
 * `src/middleware.ts` pipeline: permanent/temporary redirects, a disabled/expired
 * rule that does NOT redirect, the legacy `/blog/{tenantCode}` → `/news`
 * auto-redirect (a URL-change governance flow), and privacy-minimized 404 capture.
 *
 * Pure HTTP via Bun's native `fetch` (redirect: "manual") — deliberately NOT
 * Playwright's `request`/APIRequestContext fixture, which crashes under
 * `bun --bun playwright test` the instant a response carries a `Set-Cookie`
 * header (every request here sets the visitor cookie). See
 * tests/e2e/seo-discovery-smoke.e2e.ts's header for the full writeup. `fetch`
 * needs an absolute URL, resolved against the `baseURL` fixture; no browser is
 * launched.
 *
 * Requires:
 *   - `E2E_SEED_DATABASE_URL` — the PRIVILEGED Postgres role, to seed a tenant, a
 *     verified primary domain, redirect rules, and point `awcms_micro_setup_state`
 *     at the tenant so localhost requests resolve to it (no host mapping needed).
 *   - The dev server under `E2E_BASE_URL` (default http://localhost:4321) on the
 *     SAME database.
 *
 * The tests share the `awcms_micro_setup_state` singleton, so they run serially.
 * The seeded domain uses a per-run-unique `normalized_hostname` so it never
 * collides on the partial-unique dedup index across tests / Playwright retry #1 /
 * a second full run; `afterAll` detaches the singleton and soft-deletes the
 * domain (freeing the hostname) and hard-deletes this run's rules/observations.
 *
 * Run: `bun run dev` (with DATABASE_URL set) in one terminal, then
 * `bun run test:e2e tests/e2e/seo-redirect-smoke.e2e.ts` in another.
 */
import { test, expect } from "@playwright/test";

import {
  acquireSetupStateOwnership,
  type SetupStateOwnership
} from "./helpers/setup-state-ownership";

const SEED_URL = process.env.E2E_SEED_DATABASE_URL ?? "";

test.describe.configure({ mode: "serial" });

let seededTenantId = "";
let seededCode = "";
let seededHostname = "";
// Held for the file's lifetime so no sibling spec repoints the shared
// `awcms_micro_setup_state` singleton between our seed and our HTTP assertions.
let setupStateOwnership: SetupStateOwnership | null = null;
const MISSING_PATH = `/e2e-missing-${crypto.randomUUID().slice(0, 8)}`;

test.beforeAll(async () => {
  if (SEED_URL.length === 0) {
    throw new Error(
      "E2E_SEED_DATABASE_URL must be set for the redirect smoke spec."
    );
  }
  setupStateOwnership = await acquireSetupStateOwnership(SEED_URL);
  const unique = crypto.randomUUID().slice(0, 12);
  seededCode = `rd-e2e-${unique}`;
  seededHostname = `rd-e2e-${unique}.example`;
  const sql = new Bun.SQL(SEED_URL);
  try {
    const rows = await sql`
      INSERT INTO awcms_micro_tenants
        (tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
      VALUES (${seededCode}, 'RD E2E', 'RD E2E Legal', 'active', 'en', 'light')
      RETURNING id
    `;
    seededTenantId = rows[0]!.id as string;

    await sql`
      INSERT INTO awcms_micro_tenant_domains
        (tenant_id, hostname, normalized_hostname, domain_type, status, is_primary)
      VALUES (${seededTenantId}, ${seededHostname}, ${seededHostname}, 'custom_domain', 'active', true)
    `;

    await sql`
      INSERT INTO awcms_micro_setup_state (id, tenant_id, locked_at)
      VALUES (true, ${seededTenantId}, now())
      ON CONFLICT (id) DO UPDATE SET tenant_id = EXCLUDED.tenant_id
    `;

    // Redirect rules: a permanent, a temporary, and an expired one.
    await sql`
      INSERT INTO awcms_micro_seo_redirects
        (tenant_id, source_path, normalized_source_path, target_type, target, status_code, state, origin)
      VALUES
        (${seededTenantId}, '/e2e-old', '/e2e-old', 'relative_same_tenant', '/e2e-new', 301, 'active', 'slug_change'),
        (${seededTenantId}, '/e2e-temp', '/e2e-temp', 'relative_same_tenant', '/e2e-t2', 302, 'active', 'manual'),
        (${seededTenantId}, '/e2e-expired', '/e2e-expired', 'relative_same_tenant', '/e2e-x', 301, 'active', 'manual')
    `;
    await sql`
      UPDATE awcms_micro_seo_redirects
      SET effective_until = '2020-01-01T00:00:00Z'
      WHERE tenant_id = ${seededTenantId} AND normalized_source_path = '/e2e-expired'
    `;

    // Enable the legacy-blog → /news auto-redirect policy.
    await sql`
      INSERT INTO awcms_micro_seo_redirect_settings (tenant_id, legacy_blog_redirect_enabled)
      VALUES (${seededTenantId}, true)
      ON CONFLICT (tenant_id) DO UPDATE SET legacy_blog_redirect_enabled = true
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
      await sql`
        UPDATE awcms_micro_tenant_domains SET deleted_at = now()
        WHERE tenant_id = ${seededTenantId} AND deleted_at IS NULL
      `;
      await sql`DELETE FROM awcms_micro_seo_redirects WHERE tenant_id = ${seededTenantId}`;
      await sql`DELETE FROM awcms_micro_seo_not_found_observations WHERE tenant_id = ${seededTenantId}`;
      await sql`DELETE FROM awcms_micro_seo_redirect_settings WHERE tenant_id = ${seededTenantId}`;
    } finally {
      await sql.end();
    }
  } finally {
    // Release LAST so the lock is freed even on the early return above.
    await setupStateOwnership?.release();
    setupStateOwnership = null;
  }
});

function urlFor(path: string, baseURL: string | undefined): string {
  return new URL(path, baseURL).toString();
}

test.describe("SEO redirect governance smoke (#268)", () => {
  test("permanent redirect returns 301 to the new path", async ({
    baseURL
  }) => {
    const res = await fetch(urlFor("/e2e-old", baseURL), {
      redirect: "manual"
    });
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("/e2e-new");
    expect(res.headers.get("cache-control")).toContain("max-age");
  });

  test("temporary redirect returns 302 and is not cached", async ({
    baseURL
  }) => {
    const res = await fetch(urlFor("/e2e-temp", baseURL), {
      redirect: "manual"
    });
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("/e2e-t2");
    expect(res.headers.get("cache-control")).toContain("no-store");
  });

  test("an expired rule does NOT redirect", async ({ baseURL }) => {
    const res = await fetch(urlFor("/e2e-expired", baseURL), {
      redirect: "manual"
    });
    expect(res.status).not.toBe(301);
    expect(res.status).not.toBe(302);
  });

  test("legacy /blog/{tenantCode}/post 301-redirects to the canonical /news path (URL-change flow)", async ({
    baseURL
  }) => {
    const res = await fetch(urlFor(`/blog/${seededCode}/post`, baseURL), {
      redirect: "manual"
    });
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe(
      `https://${seededHostname}/news/post`
    );
  });

  test("a missing content path 404s and is captured (privacy-minimized) in 404 governance", async ({
    baseURL
  }) => {
    const res = await fetch(urlFor(MISSING_PATH, baseURL), {
      redirect: "manual"
    });
    expect(res.status).toBe(404);

    // The middleware records the 404 synchronously before responding.
    const sql = new Bun.SQL(SEED_URL);
    try {
      const rows = await sql`
        SELECT normalized_path, hit_count
        FROM awcms_micro_seo_not_found_observations
        WHERE tenant_id = ${seededTenantId} AND normalized_path = ${MISSING_PATH}
      `;
      expect(rows.length).toBe(1);
      expect(Number(rows[0]!.hit_count)).toBeGreaterThanOrEqual(1);
    } finally {
      await sql.end();
    }
  });
});
