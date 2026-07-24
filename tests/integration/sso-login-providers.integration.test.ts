/**
 * Integration tests for the public login-page SSO provider discovery
 * (`GET /api/v1/auth/sso/providers`, Issue #591 follow-up) against the REAL
 * route handler + real PostgreSQL (least-privilege `awcms_micro_app` role, so
 * FORCE'd RLS is genuinely enforced). Complements the pure-shape unit test
 * (`tests/unit/auth-provider-directory-login.test.ts`) and the SSO flow suite.
 *
 * Proves the anti-enumeration contract end to end: an active tenant with an
 * enabled + a disabled provider returns ONLY the enabled one (and only
 * `{ providerKey, displayName }`, never issuer/client id/secret); and an
 * unknown tenant, a suspended tenant that still HAS an enabled provider row,
 * and an active tenant with no enabled providers all collapse to the SAME empty
 * `{ providers: [] }`. Also proves the deployment gate (`isSsoRequired()` off)
 * returns empty without touching the database.
 *
 * Skipped unless DATABASE_URL is set (see tests/integration/harness.ts).
 */
import { beforeAll, beforeEach, describe, expect, test } from "bun:test";

import {
  applyMigrations,
  getAdminSql,
  integrationEnabled,
  invoke,
  provisionAppRole,
  resetDatabase
} from "./harness";

import { GET as ssoLoginProviders } from "../../src/pages/api/v1/auth/sso/providers";
import { resetRateLimitStoreForTests } from "../../src/lib/security/rate-limit";

const TENANT_ACTIVE = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const TENANT_ACTIVE_EMPTY = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
const TENANT_SUSPENDED = "cccccccc-cccc-cccc-cccc-cccccccccccc";
const TENANT_UNKNOWN = "dddddddd-dddd-dddd-dddd-dddddddddddd";

const FULL_ONLINE_SSO_ENV: Record<string, string> = {
  AUTH_ONLINE_SECURITY_ENABLED: "true",
  AUTH_ONLINE_SECURITY_PROFILE: "full_online",
  AUTH_SSO_ENABLED: "true"
};

async function withEnvOverride<T>(
  overrides: Record<string, string | undefined>,
  fn: () => Promise<T>
): Promise<T> {
  const previous: Record<string, string | undefined> = {};

  for (const key of Object.keys(overrides)) {
    previous[key] = process.env[key];
    const value = overrides[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  try {
    return await fn();
  } finally {
    for (const key of Object.keys(overrides)) {
      const value = previous[key];
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

type ProvidersBody = {
  success: boolean;
  data: { providers: { providerKey: string; displayName: string }[] };
};

async function fetchProviders(tenantId: string) {
  return invoke<ProvidersBody>(ssoLoginProviders, {
    method: "GET",
    path: `/api/v1/auth/sso/providers?tenantId=${tenantId}`
  });
}

async function seed(): Promise<void> {
  const admin = getAdminSql();
  await admin`
    INSERT INTO awcms_micro_tenants
      (id, tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
    VALUES
      (${TENANT_ACTIVE}, 'active-t', 'Active Tenant', 'Active Legal', 'active', 'en', 'light'),
      (${TENANT_ACTIVE_EMPTY}, 'empty-t', 'Empty Tenant', 'Empty Legal', 'active', 'en', 'light'),
      (${TENANT_SUSPENDED}, 'susp-t', 'Suspended Tenant', 'Suspended Legal', 'suspended', 'en', 'light')
  `;

  // Active tenant: one ENABLED provider (must be returned) + one DISABLED
  // provider (must be filtered out).
  await admin`
    INSERT INTO awcms_micro_auth_providers
      (tenant_id, provider_key, display_name, issuer_url, client_id, client_secret_env_var, enabled)
    VALUES
      (${TENANT_ACTIVE}, 'okta', 'Okta SSO', 'https://a.okta.com', 'client-a', 'A_SECRET', true),
      (${TENANT_ACTIVE}, 'azure-ad', 'Azure AD', 'https://login.microsoftonline.com', 'client-az', 'AZ_SECRET', false)
  `;

  // Suspended tenant that STILL has an enabled provider row — the EXISTS
  // (status = 'active') guard must suppress it so the suspended-tenant response
  // is identical to the unknown/empty cases (RLS + enabled alone would leak).
  await admin`
    INSERT INTO awcms_micro_auth_providers
      (tenant_id, provider_key, display_name, issuer_url, client_id, client_secret_env_var, enabled)
    VALUES
      (${TENANT_SUSPENDED}, 'okta', 'Okta Suspended', 'https://s.okta.com', 'client-s', 'S_SECRET', true)
  `;
}

const suite = integrationEnabled ? describe : describe.skip;

suite("Public login SSO provider discovery (Issue #591)", () => {
  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
  });

  beforeEach(async () => {
    await resetDatabase();
    resetRateLimitStoreForTests();
    await seed();
  });

  test("active tenant returns ONLY its enabled provider, with just {providerKey, displayName}", async () => {
    await withEnvOverride(FULL_ONLINE_SSO_ENV, async () => {
      const res = await fetchProviders(TENANT_ACTIVE);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.providers).toHaveLength(1);

      const provider = res.body.data.providers[0]!;
      expect(provider.providerKey).toBe("okta");
      expect(provider.displayName).toBe("Okta SSO");
      // Exactly the two public keys — no issuer/client id/secret/type leak.
      expect(Object.keys(provider).sort()).toEqual([
        "displayName",
        "providerKey"
      ]);

      const raw = JSON.stringify(res.body);
      expect(raw).not.toContain("A_SECRET");
      expect(raw).not.toContain("client-a");
      expect(raw).not.toContain("okta.com");
      // The disabled provider must not appear at all.
      expect(raw).not.toContain("azure-ad");
    });
  });

  test("ANTI-ENUMERATION: unknown, suspended (with an enabled provider), and active-but-empty tenants all return an IDENTICAL empty list", async () => {
    await withEnvOverride(FULL_ONLINE_SSO_ENV, async () => {
      const unknown = await fetchProviders(TENANT_UNKNOWN);
      const suspended = await fetchProviders(TENANT_SUSPENDED);
      const empty = await fetchProviders(TENANT_ACTIVE_EMPTY);

      for (const res of [unknown, suspended, empty]) {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.providers).toEqual([]);
      }

      // Byte-identical bodies — the property that makes this a real oracle-free
      // control, not just three separately-empty responses.
      expect(JSON.stringify(unknown.body)).toBe(JSON.stringify(empty.body));
      expect(JSON.stringify(suspended.body)).toBe(JSON.stringify(empty.body));
    });
  });

  test("gate off (isSsoRequired() false) returns an empty list even for a tenant that HAS an enabled provider", async () => {
    // No FULL_ONLINE_SSO_ENV override → the deployment gate is inactive.
    const res = await fetchProviders(TENANT_ACTIVE);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.providers).toEqual([]);
  });

  test("a non-UUID tenant id returns an empty list (never a 500), same as any unknown tenant", async () => {
    await withEnvOverride(FULL_ONLINE_SSO_ENV, async () => {
      const res = await invoke<ProvidersBody>(ssoLoginProviders, {
        method: "GET",
        path: `/api/v1/auth/sso/providers?tenantId=not-a-uuid`
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.providers).toEqual([]);
    });
  });
});
