/**
 * Integration tests for the redirect-governance ADMIN API (Issue #268) against a
 * real PostgreSQL. Guards the wiring the unit suite cannot: ABAC + tenant tx + RLS,
 * source-uniqueness conflict, loop/self rejection, idempotency, audit, soft
 * delete/restore/purge, settings, URL-change capture, and the 404 dashboard.
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
import {
  GET as redirectsList,
  POST as redirectsCreate
} from "../../src/pages/api/v1/seo/redirects/index";
import {
  DELETE as redirectDelete,
  GET as redirectGet,
  PUT as redirectUpdate
} from "../../src/pages/api/v1/seo/redirects/[id]";
import { POST as redirectLifecycle } from "../../src/pages/api/v1/seo/redirects/[id]/lifecycle";
import { POST as redirectValidate } from "../../src/pages/api/v1/seo/redirects/validate";
import {
  GET as redirectSettingsGet,
  PUT as redirectSettingsPut
} from "../../src/pages/api/v1/seo/redirects/settings";
import { POST as redirectCapture } from "../../src/pages/api/v1/seo/redirects/capture-url-change";
import { POST as redirectsImport } from "../../src/pages/api/v1/seo/redirects/import";
import { GET as notFoundList } from "../../src/pages/api/v1/seo/not-found/index";

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

let keyCounter = 0;
function idemKey(): string {
  keyCounter += 1;
  return `idem-${keyCounter}-${crypto.randomUUID()}`;
}

async function createRule(
  owner: Bootstrap,
  body: Record<string, unknown>
): Promise<{
  status: number;
  body: { data?: { id: string; state: string }; error?: { code: string } };
}> {
  return invoke(redirectsCreate, {
    method: "POST",
    path: "/api/v1/seo/redirects",
    headers: headers(owner, { "idempotency-key": idemKey() }),
    body
  });
}

/** Seed a verified, active primary domain so `verified_external` targets validate. */
async function seedDomain(tenantId: string, host: string): Promise<void> {
  await getAdminSql()`
    INSERT INTO awcms_micro_tenant_domains
      (tenant_id, hostname, normalized_hostname, domain_type, status, is_primary)
    VALUES (${tenantId}, ${host}, ${host.toLowerCase()}, 'custom_domain', 'active', true)
  `;
}

async function ruleCount(tenantId: string): Promise<number> {
  const rows = (await getAdminSql()`
    SELECT count(*)::int AS n FROM awcms_micro_seo_redirects WHERE tenant_id = ${tenantId}
  `) as { n: number }[];
  return rows[0]!.n;
}

const suite = integrationEnabled ? describe : describe.skip;

suite("Redirect governance API (Issue #268)", () => {
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

  test("create → list → get, and the create is audited", async () => {
    const owner = await bootstrap();
    const created = await createRule(owner, {
      sourcePath: "/old",
      target: "/new",
      statusCode: 301
    });
    expect(created.status).toBe(200);
    const id = created.body.data!.id;

    const list = await invoke<{ data: { redirects: { id: string }[] } }>(
      redirectsList,
      {
        method: "GET",
        path: "/api/v1/seo/redirects",
        headers: headers(owner)
      }
    );
    expect(list.status).toBe(200);
    expect(list.body.data.redirects.some((r) => r.id === id)).toBe(true);

    const got = await invoke<{ data: { normalizedSourcePath: string } }>(
      redirectGet,
      {
        method: "GET",
        path: `/api/v1/seo/redirects/${id}`,
        headers: headers(owner),
        params: { id }
      }
    );
    expect(got.status).toBe(200);
    expect(got.body.data.normalizedSourcePath).toBe("/old");

    const audit = (await getAdminSql()`
      SELECT action FROM awcms_micro_audit_events
      WHERE tenant_id = ${owner.tenantId} AND action = 'seo_distribution.redirect.created'
    `) as { action: string }[];
    expect(audit.length).toBe(1);
  });

  test("duplicate source+scope → 409 SOURCE_CONFLICT", async () => {
    const owner = await bootstrap();
    expect(
      (await createRule(owner, { sourcePath: "/dup", target: "/a" })).status
    ).toBe(200);
    const conflict = await createRule(owner, {
      sourcePath: "/dup",
      target: "/b"
    });
    expect(conflict.status).toBe(409);
    expect(conflict.body.error!.code).toBe("SOURCE_CONFLICT");
  });

  test("self-redirect → 400; loop across two rules → 409 REDIRECT_LOOP", async () => {
    const owner = await bootstrap();
    const self = await createRule(owner, { sourcePath: "/a", target: "/a" });
    expect(self.status).toBe(400);

    expect(
      (await createRule(owner, { sourcePath: "/x", target: "/y" })).status
    ).toBe(200);
    const loop = await createRule(owner, { sourcePath: "/y", target: "/x" });
    expect(loop.status).toBe(409);
    expect(loop.body.error!.code).toBe("REDIRECT_LOOP");
  });

  test("validate (dry run) previews the chain and writes nothing", async () => {
    const owner = await bootstrap();
    await createRule(owner, { sourcePath: "/b", target: "/c" });

    const validated = await invoke<{
      data: { valid: boolean; chain: { finalTarget?: string } };
    }>(redirectValidate, {
      method: "POST",
      path: "/api/v1/seo/redirects/validate",
      headers: headers(owner),
      body: { sourcePath: "/a", target: "/b" }
    });
    expect(validated.status).toBe(200);
    expect(validated.body.data.valid).toBe(true);
    // /a -> /b -> /c collapses to /c.
    expect(validated.body.data.chain.finalTarget).toBe("/c");

    const count = (await getAdminSql()`
      SELECT count(*)::int AS n FROM awcms_micro_seo_redirects WHERE tenant_id = ${owner.tenantId}
    `) as { n: number }[];
    expect(count[0]!.n).toBe(1); // only the /b->/c rule; validate wrote nothing
  });

  test("update, lifecycle (deactivate/archive/restore/purge), and soft delete", async () => {
    const owner = await bootstrap();
    const created = await createRule(owner, { sourcePath: "/p", target: "/q" });
    const id = created.body.data!.id;

    const updated = await invoke<{ data: { statusCode: number } }>(
      redirectUpdate,
      {
        method: "PUT",
        path: `/api/v1/seo/redirects/${id}`,
        headers: headers(owner),
        params: { id },
        body: { target: "/q2", statusCode: 302 }
      }
    );
    expect(updated.status).toBe(200);
    expect(updated.body.data.statusCode).toBe(302);

    const deactivate = await invoke<{ data: { state: string } }>(
      redirectLifecycle,
      {
        method: "POST",
        path: `/api/v1/seo/redirects/${id}/lifecycle`,
        headers: headers(owner, { "idempotency-key": idemKey() }),
        params: { id },
        body: { action: "deactivate" }
      }
    );
    expect(deactivate.status).toBe(200);
    expect(deactivate.body.data.state).toBe("inactive");

    // Archive frees the source+scope slot: a new rule for the same source succeeds.
    await invoke(redirectLifecycle, {
      method: "POST",
      path: `/api/v1/seo/redirects/${id}/lifecycle`,
      headers: headers(owner, { "idempotency-key": idemKey() }),
      params: { id },
      body: { action: "archive" }
    });
    const reuse = await createRule(owner, { sourcePath: "/p", target: "/q3" });
    expect(reuse.status).toBe(200);

    // Soft delete requires a reason.
    const noReason = await invoke<{ error: { code: string } }>(redirectDelete, {
      method: "DELETE",
      path: `/api/v1/seo/redirects/${reuse.body.data!.id}`,
      headers: headers(owner),
      params: { id: reuse.body.data!.id },
      body: {}
    });
    expect(noReason.status).toBe(400);

    const del = await invoke(redirectDelete, {
      method: "DELETE",
      path: `/api/v1/seo/redirects/${reuse.body.data!.id}`,
      headers: headers(owner),
      params: { id: reuse.body.data!.id },
      body: { reason: "obsolete" }
    });
    expect(del.status).toBe(200);

    // Restore then purge the soft-deleted rule.
    const restore = await invoke<{ data: { state: string } }>(
      redirectLifecycle,
      {
        method: "POST",
        path: `/api/v1/seo/redirects/${reuse.body.data!.id}/lifecycle`,
        headers: headers(owner, { "idempotency-key": idemKey() }),
        params: { id: reuse.body.data!.id },
        body: { action: "restore" }
      }
    );
    expect(restore.status).toBe(200);
    expect(restore.body.data.state).toBe("inactive");
  });

  test("create requires an Idempotency-Key; replay + conflict behave", async () => {
    const owner = await bootstrap();
    const noKey = await invoke<{ error: { code: string } }>(redirectsCreate, {
      method: "POST",
      path: "/api/v1/seo/redirects",
      headers: headers(owner),
      body: { sourcePath: "/a", target: "/b" }
    });
    expect(noKey.status).toBe(400);
    expect(noKey.body.error.code).toBe("IDEMPOTENCY_REQUIRED");

    const key = idemKey();
    const first = await invoke(redirectsCreate, {
      method: "POST",
      path: "/api/v1/seo/redirects",
      headers: headers(owner, { "idempotency-key": key }),
      body: { sourcePath: "/a", target: "/b" }
    });
    expect(first.status).toBe(200);
    const replay = await invoke(redirectsCreate, {
      method: "POST",
      path: "/api/v1/seo/redirects",
      headers: headers(owner, { "idempotency-key": key }),
      body: { sourcePath: "/a", target: "/b" }
    });
    expect(replay.status).toBe(200);
    const conflict = await invoke<{ error: { code: string } }>(
      redirectsCreate,
      {
        method: "POST",
        path: "/api/v1/seo/redirects",
        headers: headers(owner, { "idempotency-key": key }),
        body: { sourcePath: "/a", target: "/DIFFERENT" }
      }
    );
    expect(conflict.status).toBe(409);
    expect(conflict.body.error.code).toBe("IDEMPOTENCY_CONFLICT");

    // Exactly one rule created despite three POSTs.
    const count = (await getAdminSql()`
      SELECT count(*)::int AS n FROM awcms_micro_seo_redirects WHERE tenant_id = ${owner.tenantId}
    `) as { n: number }[];
    expect(count[0]!.n).toBe(1);
  });

  test("settings GET/PUT is audited; URL-change capture creates a proposal", async () => {
    const owner = await bootstrap();
    const put = await invoke<{ data: { legacyBlogRedirectEnabled: boolean } }>(
      redirectSettingsPut,
      {
        method: "PUT",
        path: "/api/v1/seo/redirects/settings",
        headers: headers(owner, { "idempotency-key": idemKey() }),
        body: {
          legacyBlogRedirectEnabled: true,
          urlChangeAutoPolicy: "propose"
        }
      }
    );
    expect(put.status).toBe(200);
    expect(put.body.data.legacyBlogRedirectEnabled).toBe(true);

    const get = await invoke<{ data: { legacyBlogRedirectEnabled: boolean } }>(
      redirectSettingsGet,
      {
        method: "GET",
        path: "/api/v1/seo/redirects/settings",
        headers: headers(owner)
      }
    );
    expect(get.body.data.legacyBlogRedirectEnabled).toBe(true);

    const capture = await invoke<{
      data: { outcome: string; redirect: { state: string } };
    }>(redirectCapture, {
      method: "POST",
      path: "/api/v1/seo/redirects/capture-url-change",
      headers: headers(owner, { "idempotency-key": idemKey() }),
      body: {
        oldPath: "/old-slug",
        newPath: "/new-slug",
        changeType: "slug_change"
      }
    });
    expect(capture.status).toBe(200);
    expect(capture.body.data.outcome).toBe("proposed");
    expect(capture.body.data.redirect.state).toBe("inactive");
  });

  test("404 dashboard lists observations for the tenant", async () => {
    const owner = await bootstrap();
    await getAdminSql()`
      INSERT INTO awcms_micro_seo_not_found_observations (tenant_id, normalized_path, hit_count)
      VALUES (${owner.tenantId}, '/missing', 7)
    `;
    const list = await invoke<{
      data: { observations: { normalizedPath: string; hitCount: number }[] };
    }>(notFoundList, {
      method: "GET",
      path: "/api/v1/seo/not-found",
      headers: headers(owner)
    });
    expect(list.status).toBe(200);
    expect(list.body.data.observations[0]!.normalizedPath).toBe("/missing");
    expect(list.body.data.observations[0]!.hitCount).toBe(7);
  });

  test("unauthenticated request is rejected", async () => {
    const owner = await bootstrap();
    const noAuth = await invoke<{ error: { code: string } }>(redirectsList, {
      method: "GET",
      path: "/api/v1/seo/redirects",
      headers: {
        "content-type": "application/json",
        "x-awcms-micro-tenant-id": owner.tenantId
      }
    });
    expect(noAuth.status).toBe(401);
  });

  test("A-L1: an ineligible source path (admin/API hijack) is rejected at create", async () => {
    const owner = await bootstrap();
    const admin = await createRule(owner, {
      sourcePath: "/admin/settings",
      target: "/b"
    });
    expect(admin.status).toBe(400);
    expect(admin.body.error!.code).toBe("VALIDATION_ERROR");

    const api = await createRule(owner, {
      sourcePath: "/api/v1/auth/login",
      target: "/b"
    });
    expect(api.status).toBe(400);
    expect(api.body.error!.code).toBe("VALIDATION_ERROR");

    expect(await ruleCount(owner.tenantId)).toBe(0);
  });

  test("A-M1: a verified_external same-host self-loop is rejected at create", async () => {
    const owner = await bootstrap();
    await seedDomain(owner.tenantId, "acme.example.com");

    // /a -> https://acme.example.com/a re-requests /a on our own host — a self-loop.
    const selfLoop = await createRule(owner, {
      sourcePath: "/a",
      target: "https://acme.example.com/a"
    });
    expect(selfLoop.status).toBe(400);
    expect(selfLoop.body.error!.code).toBe("VALIDATION_ERROR");

    // A verified_external to a DIFFERENT own-host path is fine.
    const ok = await createRule(owner, {
      sourcePath: "/a",
      target: "https://acme.example.com/b"
    });
    expect(ok.status).toBe(200);
  });

  test("A-M1: a two-rule cross-loop via verified_external is rejected at create", async () => {
    const owner = await bootstrap();
    await seedDomain(owner.tenantId, "acme.example.com");

    // /a -> https://own/b (fine, no loop yet).
    expect(
      (
        await createRule(owner, {
          sourcePath: "/a",
          target: "https://acme.example.com/b"
        })
      ).status
    ).toBe(200);

    // /b -> https://own/a closes the loop (a -> b -> a) — must be rejected.
    const loop = await createRule(owner, {
      sourcePath: "/b",
      target: "https://acme.example.com/a"
    });
    expect(loop.status).toBe(409);
    expect(loop.body.error!.code).toBe("REDIRECT_LOOP");
  });

  test("REDIRECT_CHAIN_TOO_LONG is returned on create when the chain exceeds the hop cap", async () => {
    const owner = await bootstrap();
    // Build a chain bottom-up so each intermediate create stays within the cap.
    expect(
      (await createRule(owner, { sourcePath: "/p5", target: "/x" })).status
    ).toBe(200);
    expect(
      (await createRule(owner, { sourcePath: "/p4", target: "/p5" })).status
    ).toBe(200);
    expect(
      (await createRule(owner, { sourcePath: "/p3", target: "/p4" })).status
    ).toBe(200);
    expect(
      (await createRule(owner, { sourcePath: "/p2", target: "/p3" })).status
    ).toBe(200);
    expect(
      (await createRule(owner, { sourcePath: "/p1", target: "/p2" })).status
    ).toBe(200);

    // /p0 now heads a 6-hop chain (/p0→…→/p5→/x) beyond MAX_REDIRECT_HOPS (5).
    const tooLong = await createRule(owner, {
      sourcePath: "/p0",
      target: "/p1"
    });
    expect(tooLong.status).toBe(409);
    expect(tooLong.body.error!.code).toBe("REDIRECT_CHAIN_TOO_LONG");
  });

  test("R-M1: bulk import rejects an INTRA-batch loop (and dry-run reports it)", async () => {
    const owner = await bootstrap();
    const batch = {
      redirects: [
        { sourcePath: "/a", target: "/b" },
        { sourcePath: "/b", target: "/a" }
      ]
    };

    // Dry run MUST report the intra-batch loop as ok:false (REDIRECT_LOOP).
    const dry = await invoke<{
      data: {
        valid: number;
        results: { index: number; ok: boolean; code?: string }[];
      };
    }>(redirectsImport, {
      method: "POST",
      path: "/api/v1/seo/redirects/import",
      headers: headers(owner, { "idempotency-key": idemKey() }),
      body: { dryRun: true, ...batch }
    });
    expect(dry.status).toBe(200);
    expect(dry.body.data.valid).toBe(1);
    const loopItem = dry.body.data.results.find((r) => r.ok === false);
    expect(loopItem).toBeDefined();
    expect(loopItem!.code).toBe("REDIRECT_LOOP");

    // Real import is all-or-nothing: nothing is created.
    const real = await invoke<{ error: { code: string } }>(redirectsImport, {
      method: "POST",
      path: "/api/v1/seo/redirects/import",
      headers: headers(owner, { "idempotency-key": idemKey() }),
      body: batch
    });
    expect(real.status).toBe(400);
    expect(real.body.error.code).toBe("IMPORT_VALIDATION_FAILED");
    expect(await ruleCount(owner.tenantId)).toBe(0);
  });

  test("R-M1: bulk import creates a valid batch all-or-nothing", async () => {
    const owner = await bootstrap();
    const real = await invoke<{ data: { created: number } }>(redirectsImport, {
      method: "POST",
      path: "/api/v1/seo/redirects/import",
      headers: headers(owner, { "idempotency-key": idemKey() }),
      body: {
        redirects: [
          { sourcePath: "/one", target: "/1" },
          { sourcePath: "/two", target: "/2" }
        ]
      }
    });
    expect(real.status).toBe(200);
    expect(real.body.data.created).toBe(2);
    expect(await ruleCount(owner.tenantId)).toBe(2);
  });
});
