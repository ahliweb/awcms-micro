/**
 * Integration tests for `GET`/`POST /api/v1/media/enforcement` (ADR-0026 step
 * 5a) against a real PostgreSQL — the managed-media switch a brochure-site
 * operator previously did not have.
 *
 * The assertion that matters most is the LAST one: a caller holding
 * `enforcement.enable` still cannot turn enforcement OFF, because no such
 * transition exists. That is the security property `sql/043` bought at the cost
 * of a redesign, and it must be proven against the real endpoint rather than
 * assumed from the absence of code.
 *
 * Skipped unless DATABASE_URL is set (see tests/integration/harness.ts).
 */
import {
  afterAll,
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
  integrationEnabled,
  invoke,
  provisionAppRole,
  resetDatabase
} from "./harness";

import { POST as setupInitialize } from "../../src/pages/api/v1/setup/initialize";
import { POST as authLogin } from "../../src/pages/api/v1/auth/login";
import {
  GET as readEnforcement,
  POST as enableEnforcement
} from "../../src/pages/api/v1/media/enforcement";

const OWNER_PASSWORD = "integration-test-owner-password";

type Bootstrap = { tenantId: string; token: string };

async function bootstrap(): Promise<Bootstrap> {
  const loginIdentifier = "owner@example.com";
  const setup = await invoke<{ data: { tenantId: string } }>(setupInitialize, {
    method: "POST",
    path: "/api/v1/setup/initialize",
    headers: { "content-type": "application/json" },
    body: {
      tenantName: "Acme",
      tenantCode: "acme",
      officeCode: "hq",
      officeName: "HQ",
      ownerLoginIdentifier: loginIdentifier,
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
    body: { loginIdentifier, password: OWNER_PASSWORD },
    cookies: createCookieJar()
  });
  expect(login.status).toBe(200);

  return { tenantId: setup.body.data.tenantId, token: login.body.data.token };
}

/** A tenant user holding ONLY `media_library.enforcement.read` — never `enable`. */
async function provisionReadOnlyUser(
  tenantId: string,
  loginIdentifier: string
): Promise<Bootstrap> {
  const password = "integration-test-scoped-password";
  const admin = getAdminSql();
  const passwordHash = await Bun.password.hash(password);

  await admin.begin(async (tx) => {
    await tx.unsafe(`SET LOCAL app.current_tenant_id = '${tenantId}'`);

    const profile = (await tx`
      INSERT INTO awcms_micro_profiles (tenant_id, profile_type, display_name)
      VALUES (${tenantId}, 'person', ${loginIdentifier}) RETURNING id
    `) as { id: string }[];
    const identity = (await tx`
      INSERT INTO awcms_micro_identities (tenant_id, profile_id, login_identifier, password_hash)
      VALUES (${tenantId}, ${profile[0]!.id}, ${loginIdentifier}, ${passwordHash})
      RETURNING id
    `) as { id: string }[];
    const tenantUser = (await tx`
      INSERT INTO awcms_micro_tenant_users (tenant_id, identity_id)
      VALUES (${tenantId}, ${identity[0]!.id}) RETURNING id
    `) as { id: string }[];
    const role = (await tx`
      INSERT INTO awcms_micro_roles (tenant_id, role_code, role_name)
      VALUES (${tenantId}, ${`role_${loginIdentifier}`}, ${loginIdentifier}) RETURNING id
    `) as { id: string }[];

    const permission = (await tx`
      SELECT id FROM awcms_micro_permissions
      WHERE module_key = 'media_library' AND activity_code = 'enforcement' AND action = 'read'
    `) as { id: string }[];

    await tx`
      INSERT INTO awcms_micro_role_permissions (tenant_id, role_id, permission_id)
      VALUES (${tenantId}, ${role[0]!.id}, ${permission[0]!.id})
    `;

    await tx`
      INSERT INTO awcms_micro_access_assignments (tenant_id, tenant_user_id, role_id)
      VALUES (${tenantId}, ${tenantUser[0]!.id}, ${role[0]!.id})
    `;
  });

  const login = await invoke<{ data: { token: string } }>(authLogin, {
    method: "POST",
    path: "/api/v1/auth/login",
    headers: {
      "content-type": "application/json",
      "x-awcms-micro-tenant-id": tenantId
    },
    body: { loginIdentifier, password },
    cookies: createCookieJar()
  });
  expect(login.status).toBe(200);

  return { tenantId, token: login.body.data.token };
}

function authHeaders(b: Bootstrap): Record<string, string> {
  return {
    "content-type": "application/json",
    "x-awcms-micro-tenant-id": b.tenantId,
    authorization: `Bearer ${b.token}`
  };
}

function setMediaReadyEnv(): void {
  process.env.NEWS_MEDIA_R2_ENABLED = "true";
  process.env.NEWS_MEDIA_R2_ACCOUNT_ID = "test-account";
  process.env.NEWS_MEDIA_R2_ACCESS_KEY_ID = "test-news-media-key";
  process.env.NEWS_MEDIA_R2_SECRET_ACCESS_KEY = "test-news-media-secret";
  process.env.NEWS_MEDIA_R2_BUCKET = "test-news-media-bucket";
  process.env.NEWS_MEDIA_R2_PUBLIC_BASE_URL = "https://media.example.test";
}

const suite = integrationEnabled ? describe : describe.skip;

suite("managed-media enforcement API (ADR-0026 step 5a)", () => {
  const previousEnv = { ...process.env };

  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
  });

  beforeEach(async () => {
    await resetDatabase();
    // Deliberately NOT setting any NEWS_PORTAL_* var anywhere in this file: the
    // whole point of step 5a is that a tenant with no news portal can do this.
    setMediaReadyEnv();
  });

  afterAll(() => {
    process.env = { ...previousEnv };
  });

  test("GET reports not-enforced-but-ready for a fresh tenant on a configured deployment", async () => {
    const owner = await bootstrap();

    const response = await invoke<{
      data: {
        enforced: boolean;
        ready: boolean;
        reasons: string[];
        detail: string[];
      };
    }>(readEnforcement, {
      method: "GET",
      path: "/api/v1/media/enforcement",
      headers: authHeaders(owner)
    });

    expect(response.status).toBe(200);
    // Readiness alone must never imply enforcement — a configured deployment
    // does not silently opt every tenant in.
    expect(response.body.data).toEqual({
      enforced: false,
      ready: true,
      reasons: [],
      detail: []
    });
  });

  test("POST enables enforcement for a tenant with NO news portal — the button ADR-0026 steps 3-4 left missing", async () => {
    const owner = await bootstrap();

    const response = await invoke<{
      data: { enforced: boolean; alreadyEnforced: boolean; enforcedAt: string };
    }>(enableEnforcement, {
      method: "POST",
      path: "/api/v1/media/enforcement",
      headers: authHeaders(owner)
    });

    expect(response.status).toBe(200);
    expect(response.body.data.enforced).toBe(true);
    expect(response.body.data.alreadyEnforced).toBe(false);

    // The flag really landed, and nothing wrote news_portal's own marker — the
    // two are now genuinely independent.
    const admin = getAdminSql();
    const rows = (await admin`
      SELECT tenant_id FROM awcms_micro_media_library_tenant_state
    `) as { tenant_id: string }[];
    expect(rows.map((r) => r.tenant_id)).toEqual([owner.tenantId]);

    const newsPortalRows = (await admin`
      SELECT tenant_id FROM awcms_micro_news_portal_tenant_state
    `) as { tenant_id: string }[];
    expect(newsPortalRows).toEqual([]);

    const followUp = await invoke<{ data: { enforced: boolean } }>(
      readEnforcement,
      {
        method: "GET",
        path: "/api/v1/media/enforcement",
        headers: authHeaders(owner)
      }
    );
    expect(followUp.body.data.enforced).toBe(true);
  });

  test("POST is idempotent: re-enabling succeeds and reports alreadyEnforced, never a duplicate row", async () => {
    const owner = await bootstrap();

    await invoke(enableEnforcement, {
      method: "POST",
      path: "/api/v1/media/enforcement",
      headers: authHeaders(owner)
    });

    const second = await invoke<{ data: { alreadyEnforced: boolean } }>(
      enableEnforcement,
      {
        method: "POST",
        path: "/api/v1/media/enforcement",
        headers: authHeaders(owner)
      }
    );

    expect(second.status).toBe(200);
    expect(second.body.data.alreadyEnforced).toBe(true);

    const admin = getAdminSql();
    const rows = (await admin`
      SELECT tenant_id FROM awcms_micro_media_library_tenant_state
    `) as { tenant_id: string }[];
    expect(rows.length).toBe(1);
  });

  test("POST is rejected 409 when the deployment's media storage is not configured — and writes nothing", async () => {
    const owner = await bootstrap();
    process.env.NEWS_MEDIA_R2_ENABLED = "false";

    const response = await invoke<{
      error: { code: string; details: { reasons: string[] } };
    }>(enableEnforcement, {
      method: "POST",
      path: "/api/v1/media/enforcement",
      headers: authHeaders(owner)
    });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("MANAGED_MEDIA_NOT_READY");
    expect(response.body.error.details.reasons).toContain(
      "news_media_r2_disabled"
    );

    // Fail-closed AND fail-clean: a rejected activation must not leave a flag
    // behind that later reads as enforcing once the config is fixed.
    const admin = getAdminSql();
    const rows = (await admin`
      SELECT tenant_id FROM awcms_micro_media_library_tenant_state
    `) as { tenant_id: string }[];
    expect(rows).toEqual([]);

    const audit = (await admin`
      SELECT action, severity FROM awcms_micro_audit_events
      WHERE tenant_id = ${owner.tenantId} AND module_key = 'media_library'
    `) as { action: string; severity: string }[];
    expect(audit).toEqual([
      { action: "media_enforcement_activation_rejected", severity: "warning" }
    ]);
  });

  test("ABAC default-deny: enforcement.read does NOT imply enforcement.enable", async () => {
    // The separation that makes the split activity code worth having: a reader
    // can see the policy without being able to change it.
    const owner = await bootstrap();
    const reader = await provisionReadOnlyUser(
      owner.tenantId,
      "reader@example.com"
    );

    const read = await invoke(readEnforcement, {
      method: "GET",
      path: "/api/v1/media/enforcement",
      headers: authHeaders(reader)
    });
    expect(read.status).toBe(200);

    const enable = await invoke(enableEnforcement, {
      method: "POST",
      path: "/api/v1/media/enforcement",
      headers: authHeaders(reader)
    });
    expect(enable.status).toBe(403);

    const admin = getAdminSql();
    const rows = (await admin`
      SELECT tenant_id FROM awcms_micro_media_library_tenant_state
    `) as { tenant_id: string }[];
    expect(rows).toEqual([]);
  });

  test("an enforcing tenant cannot turn enforcement back OFF — no method on this route does it", async () => {
    // THE load-bearing test. `sql/043`'s header records that the earlier design
    // was confirmed exploitable precisely because a tenant could clear its own
    // marker and silently disable all media validation. The fix was to make the
    // "off" transition not exist — so an owner holding every media permission
    // there is must still have no way to reach it.
    const owner = await bootstrap();

    await invoke(enableEnforcement, {
      method: "POST",
      path: "/api/v1/media/enforcement",
      headers: authHeaders(owner)
    });

    const route =
      (await import("../../src/pages/api/v1/media/enforcement")) as Record<
        string,
        unknown
      >;

    // Only the two read/enable verbs exist. A DELETE/PATCH/PUT handler is what a
    // future "let tenants opt out again" change would add, and it must fail here
    // rather than in a security re-audit two epics later.
    expect(Object.keys(route).sort()).toEqual(["GET", "POST"]);

    // And the state genuinely survives: still enforcing.
    const after = await invoke<{ data: { enforced: boolean } }>(
      readEnforcement,
      {
        method: "GET",
        path: "/api/v1/media/enforcement",
        headers: authHeaders(owner)
      }
    );
    expect(after.body.data.enforced).toBe(true);
  });
});
