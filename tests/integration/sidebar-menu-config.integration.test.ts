/**
 * Integration tests for `/api/v1/navigation/sidebar-config` (GET/PUT + reset)
 * against a real PostgreSQL (feat/sidebar-menu-management). Guards the wiring
 * the unit suite cannot see: ABAC + tenant transaction + RLS FORCE on
 * `awcms_micro_sidebar_menu_types`/`_items`, the audit event on save/reset,
 * idempotency, and cross-tenant isolation.
 *
 * The setup wizard is a SINGLE-TENANT singleton per reset — one tenant is
 * bootstrapped via `/api/v1/setup/initialize`; a second tenant is seeded
 * directly (privileged role) to prove RLS isolation.
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
  GET as sidebarConfigGet,
  PUT as sidebarConfigPut
} from "../../src/pages/api/v1/navigation/sidebar-config/index";
import { POST as sidebarConfigReset } from "../../src/pages/api/v1/navigation/sidebar-config/reset";
import { withTenant } from "../../src/lib/database/tenant-context";
import { fetchSidebarConfigForAdmin } from "../../src/modules/module-management/application/sidebar-menu-config";

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

integrationDescribe("Sidebar menu config API (integration)", () => {
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

  test("GET returns the editable model with default types before any override", async () => {
    const owner = await bootstrap();
    const result = await invoke<{
      data: { types: { typeKey: string }[]; availableTypeKeys: unknown[] };
    }>(sidebarConfigGet, {
      method: "GET",
      path: "/api/v1/navigation/sidebar-config",
      headers: headers(owner)
    });
    expect(result.status).toBe(200);
    expect(result.body.data.types.some((t) => t.typeKey === "system")).toBe(
      true
    );
    expect(result.body.data.availableTypeKeys.length).toBeGreaterThan(0);
  });

  test("PUT persists overrides, is audited, and GET reads them back", async () => {
    const owner = await bootstrap();

    const put = await invoke<{
      data: { typeCount: number; itemCount: number };
    }>(sidebarConfigPut, {
      method: "PUT",
      path: "/api/v1/navigation/sidebar-config",
      headers: { ...headers(owner), "idempotency-key": "sb-key-1" },
      body: {
        types: [
          {
            typeKey: "system",
            labelOverride: "Administration",
            position: 0,
            hidden: false
          }
        ],
        items: [
          {
            entryKey: "/admin/settings",
            typeKey: "system",
            position: 0,
            labelOverride: "Config",
            hidden: false
          }
        ]
      }
    });
    expect(put.status).toBe(200);
    expect(put.body.data.typeCount).toBe(1);
    expect(put.body.data.itemCount).toBe(1);

    // Read the override back via the application service under the tenant GUC.
    const config = await withTenant(getTestSql(), owner.tenantId, (tx) =>
      fetchSidebarConfigForAdmin(tx, owner.tenantId)
    );
    const systemType = config.types.find((t) => t.typeKey === "system");
    expect(systemType?.labelOverride).toBe("Administration");
    const settings = systemType?.modules
      .flatMap((m) => m.items)
      .find((i) => i.entryKey === "/admin/settings");
    expect(settings?.labelOverride).toBe("Config");

    // Audited as a high-risk configure action.
    const audit = (await getAdminSql()`
      SELECT action, resource_type FROM awcms_micro_audit_events
      WHERE tenant_id = ${owner.tenantId}
        AND action = 'module_management.navigation.configure'
    `) as { action: string; resource_type: string }[];
    expect(audit.length).toBe(1);
    expect(audit[0]!.resource_type).toBe("sidebar_menu_config");
  });

  test("PUT rejects an unknown entry key", async () => {
    const owner = await bootstrap();
    const result = await invoke<{ error: { code: string } }>(sidebarConfigPut, {
      method: "PUT",
      path: "/api/v1/navigation/sidebar-config",
      headers: { ...headers(owner), "idempotency-key": "sb-bad" },
      body: {
        types: [],
        items: [
          {
            entryKey: "/admin/not-real",
            typeKey: null,
            position: 0,
            labelOverride: null,
            hidden: false
          }
        ]
      }
    });
    expect(result.status).toBe(400);
    expect(result.body.error.code).toBe("VALIDATION_ERROR");
  });

  test("PUT without an Idempotency-Key is rejected", async () => {
    const owner = await bootstrap();
    const result = await invoke<{ error: { code: string } }>(sidebarConfigPut, {
      method: "PUT",
      path: "/api/v1/navigation/sidebar-config",
      headers: headers(owner),
      body: { types: [], items: [] }
    });
    expect(result.status).toBe(400);
    expect(result.body.error.code).toBe("IDEMPOTENCY_REQUIRED");
  });

  test("reset deletes all overrides back to the code default", async () => {
    const owner = await bootstrap();

    await invoke(sidebarConfigPut, {
      method: "PUT",
      path: "/api/v1/navigation/sidebar-config",
      headers: { ...headers(owner), "idempotency-key": "sb-key-2" },
      body: {
        types: [
          { typeKey: "system", labelOverride: "X", position: 0, hidden: false }
        ],
        items: []
      }
    });

    const reset = await invoke(sidebarConfigReset, {
      method: "POST",
      path: "/api/v1/navigation/sidebar-config/reset",
      headers: { ...headers(owner), "idempotency-key": "sb-reset-1" },
      body: {}
    });
    expect(reset.status).toBe(200);

    const rows = (await getAdminSql()`
      SELECT id FROM awcms_micro_sidebar_menu_types WHERE tenant_id = ${owner.tenantId}
    `) as { id: string }[];
    expect(rows.length).toBe(0);
  });

  test("tenant A's overrides are invisible to another tenant under RLS FORCE", async () => {
    const tenantA = await bootstrap("acme", "Acme");
    const tenantB = await seedBareTenant("globex", "Globex");

    await invoke(sidebarConfigPut, {
      method: "PUT",
      path: "/api/v1/navigation/sidebar-config",
      headers: { ...headers(tenantA), "idempotency-key": "a-key" },
      body: {
        types: [
          {
            typeKey: "system",
            labelOverride: "A Only",
            position: 0,
            hidden: false
          }
        ],
        items: []
      }
    });

    // Under tenant B's app-role context, tenant B sees pure defaults (no A override).
    const bConfig = await withTenant(getTestSql(), tenantB, (tx) =>
      fetchSidebarConfigForAdmin(tx, tenantB)
    );
    expect(
      bConfig.types.find((t) => t.typeKey === "system")?.labelOverride
    ).toBeNull();

    // Exactly one override row overall — tenant A's.
    const rows = (await getAdminSql()`
      SELECT tenant_id FROM awcms_micro_sidebar_menu_types
    `) as { tenant_id: string }[];
    expect(rows.length).toBe(1);
    expect(rows[0]!.tenant_id).toBe(tenantA.tenantId);
  });
});
