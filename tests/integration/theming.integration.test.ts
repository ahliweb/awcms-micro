/**
 * Integration tests for the `theming` module (Issue #269, ADR-0029) against a
 * real PostgreSQL. Covers the wiring the unit suite cannot see: ABAC + tenant
 * transaction + RLS FORCE, the draft→publish→rollback→retire lifecycle, PUBLISHED
 * VERSION IMMUTABILITY (the sql/085 trigger), version numbering/concurrency,
 * audit events, cross-tenant isolation, preview-session create/lookup/expiry, and
 * CSS-injection rejection at the API boundary.
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
  integrationEnabled,
  invoke,
  provisionAppRole,
  resetDatabase
} from "./harness";

import { POST as setupInitialize } from "../../src/pages/api/v1/setup/initialize";
import { POST as authLogin } from "../../src/pages/api/v1/auth/login";
import { GET as themingGet } from "../../src/pages/api/v1/theming/index";
import { PUT as themingDraftPut } from "../../src/pages/api/v1/theming/draft";
import { POST as themingValidate } from "../../src/pages/api/v1/theming/validate";
import { POST as themingPreview } from "../../src/pages/api/v1/theming/preview";
import { POST as themingPublish } from "../../src/pages/api/v1/theming/publish";
import { POST as themingRollback } from "../../src/pages/api/v1/theming/rollback";
import { POST as themingRetire } from "../../src/pages/api/v1/theming/retire";
import { getDatabaseClient } from "../../src/lib/database/client";
import { withTenant } from "../../src/lib/database/tenant-context";
import { resolvePreviewContext } from "../../src/lib/theming/theme-preview";
import { hashPreviewToken } from "../../src/modules/theming/domain/preview-token";

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

function headers(
  b: Bootstrap,
  extra: Record<string, string> = {}
): Record<string, string> {
  return {
    "content-type": "application/json",
    "x-awcms-micro-tenant-id": b.tenantId,
    authorization: `Bearer ${b.token}`,
    ...extra
  };
}

const VALID_DRAFT = {
  themeKey: "aria",
  tokenOverrides: { color_primary: "#123456", font_body: "serif" },
  slotSelections: { header: "split" },
  sectionOrder: ["cta", "hero"],
  navPlacement: "side"
};

async function saveDraft(
  owner: Bootstrap,
  key = "draft-1",
  body: unknown = VALID_DRAFT
) {
  return invoke(themingDraftPut, {
    method: "PUT",
    path: "/api/v1/theming/draft",
    headers: headers(owner, { "idempotency-key": key }),
    body
  });
}

const suite = integrationEnabled ? describe : describe.skip;

suite("theming module (integration)", () => {
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

  test("GET returns available themes + neutral state before any config", async () => {
    const owner = await bootstrap();
    const res = await invoke<{
      data: {
        themes: unknown[];
        state: { activeThemeKey: string | null };
        draft: unknown;
      };
    }>(themingGet, {
      method: "GET",
      path: "/api/v1/theming",
      headers: headers(owner)
    });
    expect(res.status).toBe(200);
    expect(res.body.data.themes.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.state.activeThemeKey).toBeNull();
    expect(res.body.data.draft).toBeNull();
  });

  test("draft save is validated + audited, GET reads it back", async () => {
    const owner = await bootstrap();
    const put = await saveDraft(owner);
    expect(put.status).toBe(200);

    const get = await invoke<{
      data: {
        draft: {
          themeKey: string;
          config: { tokenOverrides: Record<string, string> };
        } | null;
      };
    }>(themingGet, {
      method: "GET",
      path: "/api/v1/theming",
      headers: headers(owner)
    });
    expect(get.body.data.draft?.themeKey).toBe("aria");
    expect(get.body.data.draft?.config.tokenOverrides.color_primary).toBe(
      "#123456"
    );

    const audit = (await getAdminSql()`
      SELECT action FROM awcms_micro_audit_events
      WHERE tenant_id = ${owner.tenantId} AND action = 'theming.config.update'
    `) as { action: string }[];
    expect(audit.length).toBe(1);
  });

  test("draft with an unsafe CSS token value is rejected at the API boundary (the spine)", async () => {
    const owner = await bootstrap();
    const put = await saveDraft(owner, "bad-1", {
      themeKey: "aria",
      tokenOverrides: { color_primary: "url(javascript:alert(1))" }
    });
    expect(put.status).toBe(400);

    // validate endpoint agrees, writing nothing.
    const val = await invoke<{ data: { valid: boolean } }>(themingValidate, {
      method: "POST",
      path: "/api/v1/theming/validate",
      headers: headers(owner),
      body: {
        themeKey: "aria",
        tokenOverrides: { color_primary: "expression(alert(1))" }
      }
    });
    expect(val.status).toBe(200);
    expect(val.body.data.valid).toBe(false);
  });

  test("publish creates version 1 + sets the active pointer; a second publish is version 2", async () => {
    const owner = await bootstrap();
    await saveDraft(owner, "d1");
    const pub1 = await invoke<{
      data: { versionNumber: number; versionId: string };
    }>(themingPublish, {
      method: "POST",
      path: "/api/v1/theming/publish",
      headers: headers(owner, { "idempotency-key": "pub-1" })
    });
    expect(pub1.status).toBe(200);
    expect(pub1.body.data.versionNumber).toBe(1);

    await saveDraft(owner, "d2", {
      ...VALID_DRAFT,
      tokenOverrides: { color_primary: "#abcdef" }
    });
    const pub2 = await invoke<{ data: { versionNumber: number } }>(
      themingPublish,
      {
        method: "POST",
        path: "/api/v1/theming/publish",
        headers: headers(owner, { "idempotency-key": "pub-2" })
      }
    );
    expect(pub2.body.data.versionNumber).toBe(2);

    const state = (await getAdminSql()`
      SELECT active_version_id, active_theme_key FROM awcms_micro_theming_tenant_state
      WHERE tenant_id = ${owner.tenantId}
    `) as { active_version_id: string; active_theme_key: string }[];
    expect(state[0]?.active_theme_key).toBe("aria");
  });

  test("a PUBLISHED version row is IMMUTABLE — UPDATE and DELETE both raise (sql/085 trigger)", async () => {
    const owner = await bootstrap();
    await saveDraft(owner, "d1");
    const pub = await invoke<{ data: { versionId: string } }>(themingPublish, {
      method: "POST",
      path: "/api/v1/theming/publish",
      headers: headers(owner, { "idempotency-key": "pub-1" })
    });
    const versionId = pub.body.data.versionId;
    const sql = getDatabaseClient();

    await expect(
      withTenant(
        sql,
        owner.tenantId,
        (tx) => tx`
        UPDATE awcms_micro_theming_config_versions SET config_hash = 'tampered' WHERE id = ${versionId}
      `
      )
    ).rejects.toThrow();

    await expect(
      withTenant(
        sql,
        owner.tenantId,
        (tx) => tx`
        DELETE FROM awcms_micro_theming_config_versions WHERE id = ${versionId}
      `
      )
    ).rejects.toThrow();

    // The row is untouched.
    const rows = (await getAdminSql()`
      SELECT config_hash FROM awcms_micro_theming_config_versions WHERE id = ${versionId}
    `) as { config_hash: string }[];
    expect(rows[0]?.config_hash).not.toBe("tampered");
  });

  test("rollback moves the active pointer to an earlier version; retire clears it", async () => {
    const owner = await bootstrap();
    await saveDraft(owner, "d1");
    const pub1 = await invoke<{ data: { versionId: string } }>(themingPublish, {
      method: "POST",
      path: "/api/v1/theming/publish",
      headers: headers(owner, { "idempotency-key": "p1" })
    });
    const v1 = pub1.body.data.versionId;
    await saveDraft(owner, "d2", {
      ...VALID_DRAFT,
      tokenOverrides: { color_primary: "#abcdef" }
    });
    await invoke(themingPublish, {
      method: "POST",
      path: "/api/v1/theming/publish",
      headers: headers(owner, { "idempotency-key": "p2" })
    });

    const roll = await invoke<{ data: { versionId: string } }>(
      themingRollback,
      {
        method: "POST",
        path: "/api/v1/theming/rollback",
        headers: headers(owner, { "idempotency-key": "r1" }),
        body: { versionId: v1 }
      }
    );
    expect(roll.status).toBe(200);
    expect(roll.body.data.versionId).toBe(v1);

    // rollback to a foreign/nonexistent id is rejected.
    const bad = await invoke(themingRollback, {
      method: "POST",
      path: "/api/v1/theming/rollback",
      headers: headers(owner, { "idempotency-key": "r2" }),
      body: { versionId: "99999999-9999-9999-9999-999999999999" }
    });
    expect(bad.status).toBe(404);

    const retire = await invoke<{ data: { previousThemeKey: string | null } }>(
      themingRetire,
      {
        method: "POST",
        path: "/api/v1/theming/retire",
        headers: headers(owner, { "idempotency-key": "ret1" })
      }
    );
    expect(retire.status).toBe(200);
    expect(retire.body.data.previousThemeKey).toBe("aria");

    const state = (await getAdminSql()`
      SELECT active_version_id FROM awcms_micro_theming_tenant_state WHERE tenant_id = ${owner.tenantId}
    `) as { active_version_id: string | null }[];
    expect(state[0]?.active_version_id).toBeNull();

    // publish/restore/archive are all audited.
    const actions = (await getAdminSql()`
      SELECT DISTINCT action FROM awcms_micro_audit_events
      WHERE tenant_id = ${owner.tenantId} AND action LIKE 'theming.version.%'
    `) as { action: string }[];
    const set = new Set(actions.map((a) => a.action));
    expect(set.has("theming.version.publish")).toBe(true);
    expect(set.has("theming.version.restore")).toBe(true);
    expect(set.has("theming.version.archive")).toBe(true);
  });

  test("cross-tenant: tenant A's config is invisible under tenant B's context (RLS)", async () => {
    // Only ONE tenant can run the one-time setup wizard; tenant B is seeded bare
    // (it needs to exist only as an RLS scope, not to call the API).
    const a = await bootstrap("tenant-a", "Tenant A");
    const tenantBId = crypto.randomUUID();
    await getAdminSql()`
      INSERT INTO awcms_micro_tenants (id, tenant_code, tenant_name, status)
      VALUES (${tenantBId}, 'tenant-b', 'Tenant B', 'active')
    `;

    await saveDraft(a, "a-d1");
    await invoke(themingPublish, {
      method: "POST",
      path: "/api/v1/theming/publish",
      headers: headers(a, { "idempotency-key": "a-p1" })
    });

    // A really did write its own rows.
    const sql = getDatabaseClient();
    const aVisible = (await withTenant(
      sql,
      a.tenantId,
      (tx) => tx`
      SELECT count(*)::int AS c FROM awcms_micro_theming_config_versions
    `
    )) as { c: number }[];
    expect(aVisible[0]!.c).toBeGreaterThan(0);

    // Under B's tenant context, A's version + state rows are simply not visible.
    const bVersions = (await withTenant(
      sql,
      tenantBId,
      (tx) => tx`
      SELECT count(*)::int AS c FROM awcms_micro_theming_config_versions
    `
    )) as { c: number }[];
    expect(bVersions[0]!.c).toBe(0);
    const bState = (await withTenant(
      sql,
      tenantBId,
      (tx) => tx`
      SELECT count(*)::int AS c FROM awcms_micro_theming_tenant_state
    `
    )) as { c: number }[];
    expect(bState[0]!.c).toBe(0);
  });

  test("preview session resolves the draft; a wrong-tenant token and an expired session both fail", async () => {
    const owner = await bootstrap();
    await saveDraft(owner, "d1");
    const prev = await invoke<{ data: { previewUrl: string } }>(
      themingPreview,
      {
        method: "POST",
        path: "/api/v1/theming/preview",
        headers: headers(owner),
        body: { ttlMinutes: 30 }
      }
    );
    expect(prev.status).toBe(200);
    const urlToken = prev.body.data.previewUrl.replace("/theming/preview/", "");

    const ctx = await resolvePreviewContext(urlToken);
    expect(ctx?.descriptor.themeKey).toBe("aria");

    // A token with the right raw value but a different (wrong) tenant id in the
    // composite cannot resolve — the lookup is scoped to that tenant.
    const rawToken = urlToken.split("~")[1]!;
    const wrong = await resolvePreviewContext(
      `99999999-9999-9999-9999-999999999999~${rawToken}`
    );
    expect(wrong).toBeNull();

    // An expired session does not resolve.
    const sql = getDatabaseClient();
    const draftId = (await getAdminSql()`
      SELECT id FROM awcms_micro_theming_config_versions WHERE tenant_id = ${owner.tenantId} AND status = 'draft'
    `) as { id: string }[];
    const expiredRaw = "a".repeat(64);
    await withTenant(
      sql,
      owner.tenantId,
      (tx) => tx`
      INSERT INTO awcms_micro_theming_preview_sessions (tenant_id, token_hash, version_id, expires_at)
      VALUES (${owner.tenantId}, ${hashPreviewToken(expiredRaw)}, ${draftId[0]!.id}, now() - interval '1 hour')
    `
    );
    const expired = await resolvePreviewContext(
      `${owner.tenantId}~${expiredRaw}`
    );
    expect(expired).toBeNull();
  });
});
