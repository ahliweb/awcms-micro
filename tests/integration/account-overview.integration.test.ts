/**
 * Integration tests for `fetchAccountOverview` — the self-scoped account
 * lookup backing the "My Profile" screen (`/admin/profile`). Verifies it
 * returns the caller's own identity+profile, returns null for an unknown
 * identity, and never leaks another tenant's identity across the RLS
 * boundary (querying tenant A's identity under tenant B's context → null).
 *
 * Skipped unless DATABASE_URL is set (see tests/integration/harness.ts).
 */
import { beforeAll, beforeEach, describe, expect, test } from "bun:test";

import {
  applyMigrations,
  getTestSql,
  integrationEnabled,
  invoke,
  provisionAppRole,
  resetDatabase
} from "./harness";
import { withTenant } from "../../src/lib/database/tenant-context";
import { fetchAccountOverview } from "../../src/modules/identity-access/application/account-overview";

import { POST as setupInitialize } from "../../src/pages/api/v1/setup/initialize";

const OWNER_PASSWORD = "integration-test-owner-password";

type Tenant = { tenantId: string; identityId: string; loginIdentifier: string };

async function provisionTenant(params: {
  tenantCode: string;
  ownerLogin: string;
  ownerDisplayName: string;
}): Promise<Tenant> {
  const setup = await invoke<{ data: { tenantId: string } }>(setupInitialize, {
    method: "POST",
    path: "/api/v1/setup/initialize",
    headers: { "content-type": "application/json" },
    body: {
      tenantName: params.tenantCode.toUpperCase(),
      tenantCode: params.tenantCode,
      officeCode: "hq",
      officeName: "HQ",
      ownerLoginIdentifier: params.ownerLogin,
      ownerPassword: OWNER_PASSWORD,
      ownerDisplayName: params.ownerDisplayName
    }
  });
  expect(setup.status).toBe(200);
  const tenantId = setup.body.data.tenantId;

  const identityId = await withTenant(getTestSql(), tenantId, async (tx) => {
    const rows = (await tx`
      SELECT id FROM awcms_micro_identities
      WHERE tenant_id = ${tenantId} AND login_identifier = ${params.ownerLogin}
    `) as Array<{ id: string }>;
    return rows[0]!.id;
  });

  return { tenantId, identityId, loginIdentifier: params.ownerLogin };
}

const suite = integrationEnabled ? describe : describe.skip;

suite("fetchAccountOverview", () => {
  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  test("returns the caller's own identity + linked profile", async () => {
    const tenant = await provisionTenant({
      tenantCode: "acme",
      ownerLogin: "owner@example.com",
      ownerDisplayName: "Acme Owner"
    });

    const overview = await withTenant(getTestSql(), tenant.tenantId, (tx) =>
      fetchAccountOverview(tx, tenant.tenantId, tenant.identityId)
    );

    expect(overview).not.toBeNull();
    expect(overview!.identityId).toBe(tenant.identityId);
    expect(overview!.loginIdentifier).toBe(tenant.loginIdentifier);
    expect(overview!.displayName).toBe("Acme Owner");
    expect(overview!.status).toBe("active");
    expect(overview!.profileId).toBeTruthy();
    expect(overview!.profileType).toBe("person");
  });

  test("returns null for an unknown identity id", async () => {
    const tenant = await provisionTenant({
      tenantCode: "acme",
      ownerLogin: "owner@example.com",
      ownerDisplayName: "Acme Owner"
    });

    const overview = await withTenant(getTestSql(), tenant.tenantId, (tx) =>
      fetchAccountOverview(
        tx,
        tenant.tenantId,
        "00000000-0000-0000-0000-000000000000"
      )
    );

    expect(overview).toBeNull();
  });

  test("never returns another tenant's identity across the RLS boundary", async () => {
    // The setup wizard is a single-tenant singleton (a second
    // /setup/initialize returns 403 SETUP_LOCKED), so we can't bootstrap two
    // tenants that way. We don't need to: a real identity from tenant A,
    // queried under a DIFFERENT tenant's context, must return null — that is
    // exactly the cross-tenant threat (a session for tenant B holding a valid
    // identity id that belongs to tenant A). `withTenant` sets
    // `app.current_tenant_id` to the other tenant, so RLS on
    // identities/profiles hides tenant A's row, and the query's own
    // `WHERE i.tenant_id = ${tenantId}` filter never matches either.
    const tenantA = await provisionTenant({
      tenantCode: "acme",
      ownerLogin: "owner@example.com",
      ownerDisplayName: "Acme Owner"
    });

    const otherTenantId = "99999999-9999-9999-9999-999999999999";
    const leaked = await withTenant(getTestSql(), otherTenantId, (tx) =>
      fetchAccountOverview(tx, otherTenantId, tenantA.identityId)
    );

    expect(leaked).toBeNull();
  });
});
