/**
 * Unit tests for `listEnabledAuthProvidersForLogin` (Issue #591 follow-up) —
 * the login-facing projection that feeds the anonymous login-page SSO picker.
 * Pure-shape: `tx` is stubbed as a tagged-template that returns canned rows, so
 * this asserts the row -> view mapping (and that it NEVER carries provider
 * internals) without a database. The RLS/anti-enumeration behavior is covered
 * by `tests/integration/sso-login-providers.integration.test.ts`.
 */
import { describe, expect, test } from "bun:test";

import { listEnabledAuthProvidersForLogin } from "../../src/modules/identity-access/application/auth-provider-directory";

const TENANT_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

/** A tagged-template stub that ignores the SQL and resolves to `rows`. */
function stubTx(rows: unknown[]): Bun.SQL {
  return ((..._args: unknown[]) => Promise.resolve(rows)) as unknown as Bun.SQL;
}

describe("listEnabledAuthProvidersForLogin — public login shape", () => {
  test("maps DB rows to exactly { providerKey, displayName }", async () => {
    const tx = stubTx([
      { provider_key: "okta", display_name: "Okta SSO" },
      { provider_key: "azure-ad", display_name: "Azure AD" }
    ]);

    const result = await listEnabledAuthProvidersForLogin(tx, TENANT_ID);

    expect(result).toEqual([
      { providerKey: "okta", displayName: "Okta SSO" },
      { providerKey: "azure-ad", displayName: "Azure AD" }
    ]);
    for (const provider of result) {
      expect(Object.keys(provider).sort()).toEqual([
        "displayName",
        "providerKey"
      ]);
    }
  });

  test("returns an empty array when no rows match", async () => {
    const result = await listEnabledAuthProvidersForLogin(
      stubTx([]),
      TENANT_ID
    );
    expect(result).toEqual([]);
  });

  test("projects away issuer/client id/secret/type even if a row carries them", async () => {
    const tx = stubTx([
      {
        provider_key: "okta",
        display_name: "Okta SSO",
        issuer_url: "https://a.okta.com",
        client_id: "client-a",
        client_secret_ciphertext: "v1:super-secret",
        provider_type: "oidc"
      }
    ]);

    const result = await listEnabledAuthProvidersForLogin(tx, TENANT_ID);

    expect(result).toEqual([{ providerKey: "okta", displayName: "Okta SSO" }]);
    const raw = JSON.stringify(result);
    expect(raw).not.toContain("okta.com");
    expect(raw).not.toContain("client-a");
    expect(raw).not.toContain("super-secret");
    expect(raw).not.toContain("oidc");
  });
});
