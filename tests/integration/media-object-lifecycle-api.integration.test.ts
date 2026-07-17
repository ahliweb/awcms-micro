/**
 * Integration tests for the media object lifecycle API (ADR-0026 step 5):
 * attach, detach, `DELETE` (soft), restore, purge — against a real PostgreSQL.
 *
 * These five routes close the seeded-but-inert permission gap: `attach`,
 * `detach`, `delete`, `restore`, and `purge` were declared and seeded by Issue
 * #634 with working application functions behind them and no route, so granting
 * one conferred nothing. They confer real authority now, which is why the ABAC
 * boundary tests here matter as much as the happy paths.
 *
 * The other thing worth proving against a real database: every transition is a
 * guarded UPDATE, so a wrong-state call must 409 naming the actual state — never
 * 404, which would tell a caller their object does not exist when it is merely
 * already attached.
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
import { DELETE as deleteObject } from "../../src/pages/api/v1/media/objects/[id]";
import { POST as attachObject } from "../../src/pages/api/v1/media/objects/[id]/attach";
import { POST as detachObject } from "../../src/pages/api/v1/media/objects/[id]/detach";
import { POST as restoreObject } from "../../src/pages/api/v1/media/objects/[id]/restore";
import { POST as purgeObject } from "../../src/pages/api/v1/media/objects/[id]/purge";

const OWNER_PASSWORD = "integration-test-owner-password";
const OWNER_RESOURCE_ID = "11111111-1111-4111-8111-111111111111";

type Bootstrap = { tenantId: string; token: string; tenantUserId: string };

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

  const admin = getAdminSql();
  const rows = (await admin`
    SELECT tu.id FROM awcms_micro_tenant_users tu
    JOIN awcms_micro_identities i ON i.id = tu.identity_id
    WHERE tu.tenant_id = ${setup.body.data.tenantId}
      AND i.login_identifier = ${loginIdentifier}
  `) as { id: string }[];

  return {
    tenantId: setup.body.data.tenantId,
    token: login.body.data.token,
    tenantUserId: rows[0]!.id
  };
}

/** A tenant user holding exactly one media permission — for the ABAC boundary tests. */
async function provisionScopedUser(
  tenantId: string,
  loginIdentifier: string,
  action: string
): Promise<Bootstrap> {
  const password = "integration-test-scoped-password";
  const admin = getAdminSql();
  const passwordHash = await Bun.password.hash(password);
  let tenantUserId = "";

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
    tenantUserId = tenantUser[0]!.id;
    const role = (await tx`
      INSERT INTO awcms_micro_roles (tenant_id, role_code, role_name)
      VALUES (${tenantId}, ${`role_${loginIdentifier}`}, ${loginIdentifier}) RETURNING id
    `) as { id: string }[];

    const permission = (await tx`
      SELECT id FROM awcms_micro_permissions
      WHERE module_key = 'media_library' AND activity_code = 'media' AND action = ${action}
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

  return { tenantId, token: login.body.data.token, tenantUserId };
}

type SeedOptions = { status?: string; attached?: boolean; deleted?: boolean };

async function seedMediaObject(
  b: Bootstrap,
  options: SeedOptions = {}
): Promise<string> {
  const admin = getAdminSql();
  const id = crypto.randomUUID();

  await admin`
    INSERT INTO awcms_micro_news_media_objects (
      id, tenant_id, owner_resource_type, owner_resource_id, storage_driver,
      bucket_name, object_key, public_url, mime_type, status,
      created_by_tenant_user_id, deleted_at, deleted_by, delete_reason
    ) VALUES (
      ${id}, ${b.tenantId},
      ${options.attached ? "blog_post" : null},
      ${options.attached ? OWNER_RESOURCE_ID : null},
      'cloudflare_r2', 'test-bucket',
      ${`news-media/${b.tenantId}/2026/01/${crypto.randomUUID()}.jpg`},
      'https://media.example.test/x.jpg', 'image/jpeg',
      ${options.status ?? (options.attached ? "attached" : "verified")},
      ${b.tenantUserId},
      ${options.deleted ? new Date() : null},
      ${options.deleted ? b.tenantUserId : null},
      ${options.deleted ? "seeded as deleted" : null}
    )
  `;

  return id;
}

function headers(
  b: Bootstrap,
  idempotencyKey?: string
): Record<string, string> {
  const h: Record<string, string> = {
    "content-type": "application/json",
    "x-awcms-micro-tenant-id": b.tenantId,
    authorization: `Bearer ${b.token}`
  };
  if (idempotencyKey) h["idempotency-key"] = idempotencyKey;
  return h;
}

async function readStatus(
  id: string
): Promise<{ status: string; deleted: boolean; owner: string | null } | null> {
  const admin = getAdminSql();
  const rows = (await admin`
    SELECT status, deleted_at, owner_resource_id
    FROM awcms_micro_news_media_objects WHERE id = ${id}
  `) as {
    status: string;
    deleted_at: Date | null;
    owner_resource_id: string | null;
  }[];

  const row = rows[0];
  if (!row) return null;
  return {
    status: row.status,
    deleted: row.deleted_at !== null,
    owner: row.owner_resource_id
  };
}

const suite = integrationEnabled ? describe : describe.skip;

suite("media object lifecycle API (ADR-0026 step 5)", () => {
  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  test("attach binds a verified object to an owning resource", async () => {
    const owner = await bootstrap();
    const id = await seedMediaObject(owner);

    const response = await invoke<{ data: { object: { status: string } } }>(
      attachObject,
      {
        method: "POST",
        path: `/api/v1/media/objects/${id}/attach`,
        params: { id },
        headers: headers(owner, crypto.randomUUID()),
        body: {
          ownerResourceType: "blog_post",
          ownerResourceId: OWNER_RESOURCE_ID
        }
      }
    );

    expect(response.status).toBe(200);
    expect(response.body.data.object.status).toBe("attached");
    expect(await readStatus(id)).toEqual({
      status: "attached",
      deleted: false,
      owner: OWNER_RESOURCE_ID
    });
  });

  test("attaching an already-attached object is 409 naming its state — never 404", async () => {
    // The distinction this whole route family's error handling exists for.
    // Telling a caller the object "does not exist" when it is merely already
    // attached sends them looking in entirely the wrong place.
    const owner = await bootstrap();
    const id = await seedMediaObject(owner, { attached: true });

    const response = await invoke<{ error: { code: string; message: string } }>(
      attachObject,
      {
        method: "POST",
        path: `/api/v1/media/objects/${id}/attach`,
        params: { id },
        headers: headers(owner, crypto.randomUUID()),
        body: {
          ownerResourceType: "blog_post",
          ownerResourceId: OWNER_RESOURCE_ID
        }
      }
    );

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("INVALID_MEDIA_STATUS");
    expect(response.body.error.message).toContain("attached");
  });

  test("a nonexistent id is still 404 — the failure explainer distinguishes the two", async () => {
    const owner = await bootstrap();
    const missing = crypto.randomUUID();

    const response = await invoke<{ error: { code: string } }>(attachObject, {
      method: "POST",
      path: `/api/v1/media/objects/${missing}/attach`,
      params: { id: missing },
      headers: headers(owner, crypto.randomUUID()),
      body: {
        ownerResourceType: "blog_post",
        ownerResourceId: OWNER_RESOURCE_ID
      }
    });

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  test("detach releases an attached object back to verified, keeping the bytes", async () => {
    const owner = await bootstrap();
    const id = await seedMediaObject(owner, { attached: true });

    const response = await invoke(detachObject, {
      method: "POST",
      path: `/api/v1/media/objects/${id}/detach`,
      params: { id },
      headers: headers(owner, crypto.randomUUID())
    });

    expect(response.status).toBe(200);
    // Back to `verified`, NOT `orphaned` — orphanhood is the reconciliation
    // job's call, and a detached object is reusable.
    expect(await readStatus(id)).toEqual({
      status: "verified",
      deleted: false,
      owner: null
    });
  });

  test("DELETE soft-deletes with a required reason, and keeps the owner reference so restore can undo it", async () => {
    const owner = await bootstrap();
    const id = await seedMediaObject(owner, { attached: true });

    const noReason = await invoke(deleteObject, {
      method: "DELETE",
      path: `/api/v1/media/objects/${id}`,
      params: { id },
      headers: headers(owner),
      body: {}
    });
    expect(noReason.status).toBe(400);

    const response = await invoke(deleteObject, {
      method: "DELETE",
      path: `/api/v1/media/objects/${id}`,
      params: { id },
      headers: headers(owner),
      body: { reason: "wrong crop" }
    });

    expect(response.status).toBe(200);

    // Owner reference survives the delete on purpose — that is what lets restore
    // genuinely undo it rather than half-undo into a detached state.
    expect(await readStatus(id)).toEqual({
      status: "attached",
      deleted: true,
      owner: OWNER_RESOURCE_ID
    });

    const admin = getAdminSql();
    const rows = (await admin`
      SELECT delete_reason FROM awcms_micro_news_media_objects WHERE id = ${id}
    `) as { delete_reason: string }[];
    expect(rows[0]!.delete_reason).toBe("wrong crop");
  });

  test("restore undoes a soft delete and puts the object back in its prior state", async () => {
    const owner = await bootstrap();
    const id = await seedMediaObject(owner, { attached: true, deleted: true });

    const response = await invoke(restoreObject, {
      method: "POST",
      path: `/api/v1/media/objects/${id}/restore`,
      params: { id },
      headers: headers(owner, crypto.randomUUID())
    });

    expect(response.status).toBe(200);
    expect(await readStatus(id)).toEqual({
      status: "attached",
      deleted: false,
      owner: OWNER_RESOURCE_ID
    });
  });

  test("restoring a live object is 409 — restore is not a no-op for something never deleted", async () => {
    const owner = await bootstrap();
    const id = await seedMediaObject(owner);

    const response = await invoke<{ error: { code: string } }>(restoreObject, {
      method: "POST",
      path: `/api/v1/media/objects/${id}/restore`,
      params: { id },
      headers: headers(owner, crypto.randomUUID())
    });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("INVALID_MEDIA_STATUS");
  });

  test("purge requires a prior soft delete — it is never a shortcut for delete", async () => {
    // Two deliberate acts under two distinct permissions before anything becomes
    // irreversible. A live object must not be purgeable in one call.
    const owner = await bootstrap();
    const live = await seedMediaObject(owner);

    const rejected = await invoke<{ error: { code: string } }>(purgeObject, {
      method: "POST",
      path: `/api/v1/media/objects/${live}/purge`,
      params: { id: live },
      headers: headers(owner, crypto.randomUUID())
    });

    expect(rejected.status).toBe(409);
    expect(await readStatus(live)).not.toBeNull();

    const deleted = await seedMediaObject(owner, { deleted: true });
    const purged = await invoke(purgeObject, {
      method: "POST",
      path: `/api/v1/media/objects/${deleted}/purge`,
      params: { id: deleted },
      headers: headers(owner, crypto.randomUUID())
    });

    expect(purged.status).toBe(200);
    expect(await readStatus(deleted)).toBeNull();
  });

  test("every mutating route requires an Idempotency-Key, and replays rather than repeating", async () => {
    const owner = await bootstrap();
    const id = await seedMediaObject(owner);

    const noKey = await invoke<{ error: { code: string } }>(attachObject, {
      method: "POST",
      path: `/api/v1/media/objects/${id}/attach`,
      params: { id },
      headers: headers(owner),
      body: {
        ownerResourceType: "blog_post",
        ownerResourceId: OWNER_RESOURCE_ID
      }
    });
    expect(noKey.status).toBe(400);
    expect(noKey.body.error.code).toBe("IDEMPOTENCY_REQUIRED");

    const key = crypto.randomUUID();
    const body = {
      ownerResourceType: "blog_post",
      ownerResourceId: OWNER_RESOURCE_ID
    };

    const first = await invoke(attachObject, {
      method: "POST",
      path: `/api/v1/media/objects/${id}/attach`,
      params: { id },
      headers: headers(owner, key),
      body
    });
    expect(first.status).toBe(200);

    // Replayed: returns the stored response instead of hitting the guarded
    // UPDATE again (which would now 409, since the object is already attached).
    const replay = await invoke(attachObject, {
      method: "POST",
      path: `/api/v1/media/objects/${id}/attach`,
      params: { id },
      headers: headers(owner, key),
      body
    });
    expect(replay.status).toBe(200);

    // Same key, different body → conflict, never a silent second attach.
    const conflict = await invoke<{ error: { code: string } }>(attachObject, {
      method: "POST",
      path: `/api/v1/media/objects/${id}/attach`,
      params: { id },
      headers: headers(owner, key),
      body: {
        ownerResourceType: "blog_page",
        ownerResourceId: OWNER_RESOURCE_ID
      }
    });
    expect(conflict.status).toBe(409);
    expect(conflict.body.error.code).toBe("IDEMPOTENCY_CONFLICT");
  });

  test("ABAC default-deny: each lifecycle permission is its own grant", async () => {
    // These five keys were seeded-but-inert until now, so this is the first time
    // holding one means anything. `attach` must not drag `detach` along: a role
    // may add media to an article without being allowed to strip it from one.
    const owner = await bootstrap();
    const attached = await seedMediaObject(owner, { attached: true });
    const attacher = await provisionScopedUser(
      owner.tenantId,
      "attacher@example.com",
      "attach"
    );

    const detachAttempt = await invoke(detachObject, {
      method: "POST",
      path: `/api/v1/media/objects/${attached}/detach`,
      params: { id: attached },
      headers: headers(attacher, crypto.randomUUID())
    });
    expect(detachAttempt.status).toBe(403);

    const deleteAttempt = await invoke(deleteObject, {
      method: "DELETE",
      path: `/api/v1/media/objects/${attached}`,
      params: { id: attached },
      headers: headers(attacher),
      body: { reason: "nope" }
    });
    expect(deleteAttempt.status).toBe(403);

    const purgeAttempt = await invoke(purgeObject, {
      method: "POST",
      path: `/api/v1/media/objects/${attached}/purge`,
      params: { id: attached },
      headers: headers(attacher, crypto.randomUUID())
    });
    expect(purgeAttempt.status).toBe(403);

    // Untouched by any of the denied calls.
    expect(await readStatus(attached)).toEqual({
      status: "attached",
      deleted: false,
      owner: OWNER_RESOURCE_ID
    });
  });

  test("delete does not imply purge — the irreversible step needs its own permission", async () => {
    const owner = await bootstrap();
    const id = await seedMediaObject(owner, { deleted: true });
    const deleter = await provisionScopedUser(
      owner.tenantId,
      "deleter@example.com",
      "delete"
    );

    const purgeAttempt = await invoke(purgeObject, {
      method: "POST",
      path: `/api/v1/media/objects/${id}/purge`,
      params: { id },
      headers: headers(deleter, crypto.randomUUID())
    });

    expect(purgeAttempt.status).toBe(403);
    expect(await readStatus(id)).not.toBeNull();
  });
});
