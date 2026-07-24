/**
 * E2E smoke spec (Playwright + Bun) — the public login-page SSO provider
 * discovery (`GET /api/v1/auth/sso/providers`) and the login-page picker
 * (Issue #591 follow-up). Pure HTTP via Bun's native `fetch` (deliberately NOT
 * Playwright's `request` fixture — same reasoning as
 * `seo-discovery-smoke.e2e.ts`: that fixture throws on `Set-Cookie`); `fetch`
 * needs an ABSOLUTE URL, resolved against the `baseURL` fixture.
 *
 * ADAPTIVE to the server's deployment gate (`isSsoRequired()`), which the test
 * cannot control: it detects the gate state from whether `/login` renders the
 * `#sso-providers` picker container, then asserts the endpoint + page are
 * consistent with that state. The anti-enumeration property (unknown tenant ==
 * active-but-no-provider tenant == identical empty `{ providers: [] }`) holds
 * in BOTH gate states and is asserted unconditionally.
 *
 * Requires (same as `seo-discovery-smoke.e2e.ts`):
 *   - `E2E_SEED_DATABASE_URL` — PRIVILEGED Postgres role, seeds a tenant with
 *     no providers and a tenant with one enabled provider.
 *   - The dev server under `E2E_BASE_URL` (default `http://localhost:4321`)
 *     running against the SAME database.
 *
 * Run: `bun run dev` (with DATABASE_URL set) in one terminal, then
 * `bun run test:e2e tests/e2e/sso-login-picker-smoke.e2e.ts` in another.
 */
import { test, expect } from "@playwright/test";

const SEED_URL = process.env.E2E_SEED_DATABASE_URL ?? "";

test.describe.configure({ mode: "serial" });

let emptyTenantId = "";
let providerTenantId = "";
let runTag = "";

test.beforeAll(async () => {
  if (SEED_URL.length === 0) {
    throw new Error(
      "E2E_SEED_DATABASE_URL must be set for the SSO login picker smoke spec."
    );
  }
  runTag = crypto.randomUUID().slice(0, 12);
  const sql = new Bun.SQL(SEED_URL);
  try {
    const emptyRows = await sql`
      INSERT INTO awcms_micro_tenants
        (tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
      VALUES (${`sso-e2e-empty-${runTag}`}, 'SSO E2E Empty', 'SSO E2E Empty Legal',
        'active', 'en', 'light')
      RETURNING id
    `;
    emptyTenantId = emptyRows[0]!.id as string;

    const providerRows = await sql`
      INSERT INTO awcms_micro_tenants
        (tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
      VALUES (${`sso-e2e-prov-${runTag}`}, 'SSO E2E Provider', 'SSO E2E Provider Legal',
        'active', 'en', 'light')
      RETURNING id
    `;
    providerTenantId = providerRows[0]!.id as string;

    await sql`
      INSERT INTO awcms_micro_auth_providers
        (tenant_id, provider_key, display_name, issuer_url, client_id,
         client_secret_env_var, enabled)
      VALUES (${providerTenantId}, 'okta', 'Okta SSO', 'https://e2e.okta.example',
        'e2e-client', 'E2E_OKTA_SECRET', true)
    `;
  } finally {
    await sql.end();
  }
});

test.afterAll(async () => {
  if (SEED_URL.length === 0) return;
  const sql = new Bun.SQL(SEED_URL);
  try {
    for (const tenantId of [emptyTenantId, providerTenantId]) {
      if (!tenantId) continue;
      await sql`DELETE FROM awcms_micro_auth_providers WHERE tenant_id = ${tenantId}`;
      await sql`DELETE FROM awcms_micro_tenants WHERE id = ${tenantId}`;
    }
  } finally {
    await sql.end();
  }
});

function apiUrl(tenantId: string, baseURL: string | undefined): string {
  return new URL(
    `/api/v1/auth/sso/providers?tenantId=${encodeURIComponent(tenantId)}`,
    baseURL
  ).toString();
}

type ProvidersBody = {
  success: boolean;
  data: { providers: { providerKey: string; displayName: string }[] };
};

test.describe("SSO login picker smoke (#591)", () => {
  test("ANTI-ENUMERATION: unknown tenant and an active tenant with no providers return an IDENTICAL empty list", async ({
    baseURL
  }) => {
    const unknownId = crypto.randomUUID();

    const unknown = await fetch(apiUrl(unknownId, baseURL));
    const empty = await fetch(apiUrl(emptyTenantId, baseURL));

    expect(unknown.status).toBe(200);
    expect(empty.status).toBe(200);

    const unknownBody = (await unknown.json()) as ProvidersBody;
    const emptyBody = (await empty.json()) as ProvidersBody;

    expect(unknownBody.data.providers).toEqual([]);
    expect(emptyBody.data.providers).toEqual([]);
    // Byte-identical DATA payload — an attacker cannot tell an unknown tenant
    // apart from a real active tenant that simply has no enabled providers.
    // (The envelope's `meta.correlationId` is a per-request random UUID injected
    // by middleware over the real HTTP path and is deliberately NOT part of the
    // anti-enumeration surface, so the guarantee is asserted on `data`.)
    expect(JSON.stringify(unknownBody.data)).toBe(
      JSON.stringify(emptyBody.data)
    );
  });

  test("the endpoint + login page agree with the deployment gate for a tenant that HAS an enabled provider", async ({
    baseURL
  }) => {
    // Gate state is server-controlled — detect it from the login page.
    const loginRes = await fetch(new URL("/login", baseURL).toString());
    expect(loginRes.status).toBe(200);
    const loginHtml = await loginRes.text();
    const pickerRendered = loginHtml.includes('id="sso-providers"');

    const res = await fetch(apiUrl(providerTenantId, baseURL));
    expect(res.status).toBe(200);
    const body = (await res.json()) as ProvidersBody;

    if (pickerRendered) {
      // Gate ON: discovery works — the enabled provider is returned, with ONLY
      // the two public fields (no issuer/client id/secret leak).
      expect(body.data.providers).toHaveLength(1);
      const provider = body.data.providers[0]!;
      expect(provider.providerKey).toBe("okta");
      expect(provider.displayName).toBe("Okta SSO");
      expect(Object.keys(provider).sort()).toEqual([
        "displayName",
        "providerKey"
      ]);
      const raw = JSON.stringify(body);
      expect(raw).not.toContain("okta.example");
      expect(raw).not.toContain("e2e-client");
    } else {
      // Gate OFF (isSsoRequired() false): the picker is omitted from the page
      // AND the endpoint returns empty even for a tenant that has an enabled
      // provider configured — the deployment-wide gate suppresses discovery.
      expect(loginHtml).not.toContain('id="sso-providers"');
      expect(body.data.providers).toEqual([]);
    }
  });
});
