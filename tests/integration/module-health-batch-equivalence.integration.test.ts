/**
 * Anti-drift equivalence test for the batched module-health path
 * (`perf/module-health-batch`). The admin module list (`/admin/modules`) and
 * the tenant-module matrix (`/admin/modules/tenants`) stopped calling
 * `fetchModuleHealthReport` once per module (an N+1 over the single
 * `withTenant` connection, now ~22 modules) and call the batched
 * `fetchModuleHealthReports` once instead. Both paths MUST assemble each
 * module's `status` and `signals` from the exact same builders — this test
 * is the safety net that proves they never diverge for ANY registered
 * module, in BOTH the fresh "degraded" state (before any descriptor sync)
 * and the post-sync state.
 *
 * Skipped unless DATABASE_URL is set (see tests/integration/harness.ts).
 */
import { beforeAll, beforeEach, describe, expect, test } from "bun:test";

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
import { getDatabaseClient } from "../../src/lib/database/client";
import { withTenant } from "../../src/lib/database/tenant-context";
import { listModules } from "../../src/modules";
import {
  fetchModuleHealthReport,
  fetchModuleHealthReports
} from "../../src/modules/module-management/application/health-registry";
import { syncModuleDescriptors } from "../../src/modules/module-management/application/descriptor-sync";

const OWNER_LOGIN = "owner@example.com";
const OWNER_PASSWORD = "integration-test-owner-password";

async function bootstrap(): Promise<{ tenantId: string }> {
  const loginIdentifier = `acme-${OWNER_LOGIN}`;
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

  return { tenantId: setup.body.data.tenantId };
}

/**
 * Compares batched-vs-single for every registered module, asserting the
 * `status` and (order-sensitive) `signals` match exactly. `generatedAt` is
 * deliberately excluded — it is a per-call timestamp both paths set
 * independently and is not part of the health verdict.
 */
async function expectBatchedEqualsSingle(tenantId: string): Promise<void> {
  const sql = getDatabaseClient();
  const allKeys = listModules().map((descriptor) => descriptor.key);

  await withTenant(sql, tenantId, async (tx) => {
    const batched = await fetchModuleHealthReports(tx, tenantId, allKeys);

    for (const key of allKeys) {
      const single = await fetchModuleHealthReport(tx, tenantId, key);
      const fromBatch = batched.get(key);

      expect(single).not.toBeNull();
      expect(fromBatch).toBeDefined();
      expect(fromBatch!.status).toBe(single!.status);
      expect(fromBatch!.signals).toEqual(single!.signals);
    }

    // The batch never invents keys the single path would 404 on.
    expect(batched.size).toBe(allKeys.length);
  });
}

const suite = integrationEnabled ? describe : describe.skip;

suite("module health batched-vs-single equivalence", () => {
  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  test("fresh install (pre-sync, mostly degraded): batched matches single for every module", async () => {
    const owner = await bootstrap();
    await expectBatchedEqualsSingle(owner.tenantId);
  }, 30000);

  test("after descriptor sync: batched matches single for every module", async () => {
    const owner = await bootstrap();
    await syncModuleDescriptors(getAdminSql());
    await expectBatchedEqualsSingle(owner.tenantId);
  }, 30000);
});
