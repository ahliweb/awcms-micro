/**
 * Integration tests for `GET`/`PUT /api/v1/seo/config` (Issue #266, ADR-0028)
 * against a real PostgreSQL. Guards the wiring the unit suite cannot see:
 * ABAC + tenant transaction + RLS FORCE on `awcms_micro_seo_tenant_settings`,
 * the audit event on update, and idempotency replay/conflict.
 *
 * Skipped unless DATABASE_URL is set (see tests/integration/harness.ts).
 */
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test
} from "bun:test";

import {
  applyMigrations,
  createCookieJar,
  getAdminSql,
  getTestSql,
  integrationEnabled,
  invoke,
  provisionAppRole,
  resetDatabase
} from "./harness";

import { POST as setupInitialize } from "../../src/pages/api/v1/setup/initialize";
import { POST as authLogin } from "../../src/pages/api/v1/auth/login";
import {
  GET as seoConfigGet,
  PUT as seoConfigPut
} from "../../src/pages/api/v1/seo/config";
import { withTenant } from "../../src/lib/database/tenant-context";
import { fetchSeoTenantSettings } from "../../src/modules/seo-distribution/application/seo-config-directory";

/** Seed a bare, active tenant row directly (privileged role) — the one-time setup wizard can only run once per reset. */
async function seedBareTenant(
  tenantCode: string,
  tenantName: string
): Promise<string> {
  const id = crypto.randomUUID();
  await getAdminSql()`
    INSERT INTO awcms_micro_tenants (id, tenant_code, tenant_name, status)
    VALUES (${id}, ${tenantCode}, ${tenantName}, 'active')
  `;
  return id;
}

const OWNER_LOGIN = "owner@example.com";
const OWNER_PASSWORD = "integration-test-owner-password";

type Bootstrap = { tenantId: string; token: string };

async function bootstrap(
  tenantCode = "acme",
  tenantName = "Acme"
): Promise<Bootstrap> {
  const setup = await invoke<{ data: { tenantId: string } }>(setupInitialize, {
    method: "POST",
    path: "/api/v1/setup/initialize",
    headers: { "content-type": "application/json" },
    body: {
      tenantName,
      tenantCode,
      officeCode: "hq",
      officeName: "HQ",
      ownerLoginIdentifier: `${tenantCode}-${OWNER_LOGIN}`,
      ownerPassword: OWNER_PASSWORD,
      ownerDisplayName: "Owner"
    }
  });
  expect(setup.status).toBe(200);

  const login = await invoke<{ data: { token: string } }>(authLogin, {
    method: "POST",
    path: "/api/v1/auth/login",
    headers: {
      "content-type": "application/json",
      "x-awcms-micro-tenant-id": setup.body.data.tenantId
    },
    body: {
      loginIdentifier: `${tenantCode}-${OWNER_LOGIN}`,
      password: OWNER_PASSWORD
    },
    cookies: createCookieJar()
  });
  expect(login.status).toBe(200);

  return { tenantId: setup.body.data.tenantId, token: login.body.data.token };
}

function headers(b: Bootstrap): Record<string, string> {
  return {
    "content-type": "application/json",
    "x-awcms-micro-tenant-id": b.tenantId,
    authorization: `Bearer ${b.token}`
  };
}

const integrationDescribe = integrationEnabled ? describe : describe.skip;

integrationDescribe("SEO config API (integration)", () => {
  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterEach(async () => {
    await resetDatabase();
  });

  test("GET returns neutral defaults before any config is written", async () => {
    const owner = await bootstrap();
    const result = await invoke<{
      data: { siteName: string | null; defaultRobotsNoindex: boolean };
    }>(seoConfigGet, {
      method: "GET",
      path: "/api/v1/seo/config",
      headers: headers(owner)
    });
    expect(result.status).toBe(200);
    expect(result.body.data.siteName).toBeNull();
    expect(result.body.data.defaultRobotsNoindex).toBe(false);
  });

  test("PUT persists settings, is audited, and GET reads them back", async () => {
    const owner = await bootstrap();

    const put = await invoke<{
      data: { siteName: string; defaultRobotsNoindex: boolean };
    }>(seoConfigPut, {
      method: "PUT",
      path: "/api/v1/seo/config",
      headers: { ...headers(owner), "idempotency-key": "seo-key-1" },
      body: {
        siteName: "Acme Media",
        defaultMetaDescription: "The Acme newsroom.",
        twitterSiteHandle: "@acme",
        defaultRobotsNoindex: true
      }
    });
    expect(put.status).toBe(200);
    expect(put.body.data.siteName).toBe("Acme Media");
    expect(put.body.data.defaultRobotsNoindex).toBe(true);

    const get = await invoke<{ data: { siteName: string } }>(seoConfigGet, {
      method: "GET",
      path: "/api/v1/seo/config",
      headers: headers(owner)
    });
    expect(get.body.data.siteName).toBe("Acme Media");

    // The update is audited as a high-risk action.
    const audit = (await getAdminSql()`
      SELECT action, resource_type FROM awcms_micro_audit_events
      WHERE tenant_id = ${owner.tenantId}
        AND action = 'seo_distribution.config.update'
    `) as { action: string; resource_type: string }[];
    expect(audit.length).toBe(1);
    expect(audit[0]!.resource_type).toBe("seo_tenant_settings");
  });

  test("idempotency: same key + same body replays; same key + different body conflicts", async () => {
    const owner = await bootstrap();

    const first = await invoke(seoConfigPut, {
      method: "PUT",
      path: "/api/v1/seo/config",
      headers: { ...headers(owner), "idempotency-key": "dup-key" },
      body: { siteName: "First" }
    });
    expect(first.status).toBe(200);

    const replay = await invoke<{ data: { siteName: string } }>(seoConfigPut, {
      method: "PUT",
      path: "/api/v1/seo/config",
      headers: { ...headers(owner), "idempotency-key": "dup-key" },
      body: { siteName: "First" }
    });
    expect(replay.status).toBe(200);
    expect(replay.body.data.siteName).toBe("First");

    const conflict = await invoke<{ error: { code: string } }>(seoConfigPut, {
      method: "PUT",
      path: "/api/v1/seo/config",
      headers: { ...headers(owner), "idempotency-key": "dup-key" },
      body: { siteName: "Changed" }
    });
    expect(conflict.status).toBe(409);
    expect(conflict.body.error.code).toBe("IDEMPOTENCY_CONFLICT");

    // Only ONE audit event — the replay and the conflict never re-ran the write.
    const audit = (await getAdminSql()`
      SELECT id FROM awcms_micro_audit_events
      WHERE tenant_id = ${owner.tenantId}
        AND action = 'seo_distribution.config.update'
    `) as { id: string }[];
    expect(audit.length).toBe(1);
  });

  test("PUT without an Idempotency-Key is rejected", async () => {
    const owner = await bootstrap();
    const result = await invoke<{ error: { code: string } }>(seoConfigPut, {
      method: "PUT",
      path: "/api/v1/seo/config",
      headers: headers(owner),
      body: { siteName: "No key" }
    });
    expect(result.status).toBe(400);
    expect(result.body.error.code).toBe("IDEMPOTENCY_REQUIRED");
  });

  test("tenant A's config is invisible to another tenant under RLS FORCE", async () => {
    const tenantA = await bootstrap("acme", "Acme");
    // A second tenant is seeded directly — the one-time setup wizard cannot run
    // twice per reset. This tenant needs no session: RLS is asserted at the DB
    // layer through the least-privilege app role.
    const tenantB = await seedBareTenant("globex", "Globex");

    await invoke(seoConfigPut, {
      method: "PUT",
      path: "/api/v1/seo/config",
      headers: { ...headers(tenantA), "idempotency-key": "a-key" },
      body: { siteName: "Acme Only", defaultRobotsNoindex: true }
    });

    // Under tenant B's app-role context, tenant B's own config is empty...
    const bOwn = await withTenant(getTestSql(), tenantB, (tx) =>
      fetchSeoTenantSettings(tx, tenantB)
    );
    expect(bOwn.siteName).toBeNull();
    expect(bOwn.defaultRobotsNoindex).toBe(false);

    // ...and even querying tenant A's id from tenant B's context returns nothing:
    // the RLS policy filters on app.current_tenant_id (= B), so A's row is
    // structurally unreachable regardless of the explicit WHERE tenant_id = A.
    const bTriesA = await withTenant(getTestSql(), tenantB, (tx) =>
      fetchSeoTenantSettings(tx, tenantA.tenantId)
    );
    expect(bTriesA.siteName).toBeNull();

    // Exactly one row overall — tenant A's.
    const rows = (await getAdminSql()`
      SELECT tenant_id FROM awcms_micro_seo_tenant_settings
    `) as { tenant_id: string }[];
    expect(rows.length).toBe(1);
    expect(rows[0]!.tenant_id).toBe(tenantA.tenantId);
  });
});
