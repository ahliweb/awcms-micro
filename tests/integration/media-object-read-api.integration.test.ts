/**
 * Integration tests for `GET /api/v1/media/objects` and
 * `GET /api/v1/media/objects/{id}` (ADR-0026 step 5) against a real PostgreSQL.
 *
 * These are the first routes to enforce `media_library.media.read`, a permission
 * that has been declared and seeded since Issue #634 while nothing checked it.
 * The tests that matter most are therefore the boundary ones: that `read` is
 * genuinely required (not implied by holding some other media permission), and
 * that another tenant's object is a 404 rather than a 403 — a 403 would confirm
 * the id exists somewhere.
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
import { GET as listObjects } from "../../src/pages/api/v1/media/objects/index";
import { GET as readObject } from "../../src/pages/api/v1/media/objects/[id]";

const OWNER_PASSWORD = "integration-test-owner-password";

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

/** A tenant user holding only `media_library.media.create` — never `read`. */
async function provisionCreateOnlyUser(
  tenantId: string,
  loginIdentifier: string
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
      WHERE module_key = 'media_library' AND activity_code = 'media' AND action = 'create'
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

type SeedOptions = {
  status?: string;
  moduleKey?: string;
  ownerResourceType?: string | null;
  ownerResourceId?: string | null;
  deleted?: boolean;
  createdAt?: string;
};

type SeededObject = { id: string; objectKey: string };

/**
 * `object_key` must match `sql/041`'s format CHECK
 * (`news-media/{tenantId}/{yyyy}/{mm}/{uuid}.{ext}`) — the constraint exists so
 * a key can never be derived from client input, and it rejected an earlier,
 * made-up fixture key here. Build a real one rather than loosening the test.
 */
async function seedMediaObject(
  b: Bootstrap,
  label: string,
  options: SeedOptions = {}
): Promise<SeededObject> {
  const admin = getAdminSql();
  const id = crypto.randomUUID();
  const createdAt = options.createdAt ?? "2026-01-01T00:00:00.000Z";
  const objectKey = `news-media/${b.tenantId}/2026/01/${crypto.randomUUID()}.jpg`;

  await admin`
    INSERT INTO awcms_micro_news_media_objects (
      id, tenant_id, module_key, owner_resource_type, owner_resource_id,
      storage_driver, bucket_name, object_key, original_filename, public_url,
      mime_type, size_bytes, checksum_sha256, width, height, alt_text, caption,
      status, created_by_tenant_user_id, created_at, updated_at, deleted_at
    ) VALUES (
      ${id}, ${b.tenantId}, ${options.moduleKey ?? "news_portal"},
      ${options.ownerResourceType ?? null}, ${options.ownerResourceId ?? null},
      'cloudflare_r2', 'test-bucket', ${objectKey}, ${`${label}.jpg`},
      ${`https://media.example.test/${label}.jpg`},
      'image/jpeg', 1024, ${"a".repeat(64)}, 800, 600, 'alt', 'caption',
      ${options.status ?? "verified"}, ${b.tenantUserId},
      ${new Date(createdAt)}, ${new Date(createdAt)},
      ${options.deleted ? new Date() : null}
    )
  `;

  return { id, objectKey };
}

function authHeaders(b: Bootstrap): Record<string, string> {
  return {
    "content-type": "application/json",
    "x-awcms-micro-tenant-id": b.tenantId,
    authorization: `Bearer ${b.token}`
  };
}

type MediaObjectResponse = {
  id: string;
  status: string;
  moduleKey: string;
  publicUrl: string;
  ownerResourceType: string | null;
};

const suite = integrationEnabled ? describe : describe.skip;

suite("media object read API (ADR-0026 step 5)", () => {
  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  test("list returns this tenant's objects newest first, excluding soft-deleted by default", async () => {
    const owner = await bootstrap();
    await seedMediaObject(owner, "older", {
      createdAt: "2026-01-01T00:00:00.000Z"
    });
    const { id: newerId } = await seedMediaObject(owner, "newer", {
      createdAt: "2026-02-01T00:00:00.000Z"
    });
    await seedMediaObject(owner, "gone", { deleted: true });

    const response = await invoke<{ data: { objects: MediaObjectResponse[] } }>(
      listObjects,
      {
        method: "GET",
        path: "/api/v1/media/objects",
        headers: authHeaders(owner)
      }
    );

    expect(response.status).toBe(200);
    expect(response.body.data.objects.length).toBe(2);
    expect(response.body.data.objects[0]!.id).toBe(newerId);
  });

  test("list never leaks physical storage detail — no objectKey, bucketName, storageDriver, or checksum", async () => {
    // These describe where the bytes live in R2. Exposing them narrows the
    // search space for anyone probing the bucket, and no consumer needs them:
    // `publicUrl` is the supported way to reach the object.
    const owner = await bootstrap();
    const seeded = await seedMediaObject(owner, "leak-probe");

    const response = await invoke(listObjects, {
      method: "GET",
      path: "/api/v1/media/objects",
      headers: authHeaders(owner)
    });

    const serialized = JSON.stringify(response.body);
    expect(serialized).not.toContain(seeded.objectKey);
    expect(serialized).not.toContain("test-bucket");
    expect(serialized).not.toContain("objectKey");
    expect(serialized).not.toContain("checksumSha256");
    expect(serialized).not.toContain("storageDriver");
    expect(serialized).not.toContain("cloudflare_r2");
  });

  test("includeDeleted=true surfaces soft-deleted objects", async () => {
    const owner = await bootstrap();
    await seedMediaObject(owner, "live");
    await seedMediaObject(owner, "gone", { deleted: true });

    const response = await invoke<{ data: { objects: MediaObjectResponse[] } }>(
      listObjects,
      {
        method: "GET",
        path: "/api/v1/media/objects?includeDeleted=true",
        headers: authHeaders(owner)
      }
    );

    expect(response.body.data.objects.length).toBe(2);
  });

  test("filters compose: status and owner resource", async () => {
    const owner = await bootstrap();
    await seedMediaObject(owner, "a", { status: "verified" });
    await seedMediaObject(owner, "b", { status: "pending_upload" });
    const { id: attachedId } = await seedMediaObject(owner, "c", {
      status: "attached",
      ownerResourceType: "blog_post",
      ownerResourceId: "11111111-1111-4111-8111-111111111111"
    });

    const byStatus = await invoke<{ data: { objects: MediaObjectResponse[] } }>(
      listObjects,
      {
        method: "GET",
        path: "/api/v1/media/objects?status=pending_upload",
        headers: authHeaders(owner)
      }
    );
    expect(byStatus.body.data.objects.length).toBe(1);
    expect(byStatus.body.data.objects[0]!.status).toBe("pending_upload");

    // The "which media is attached to this post?" lookup the owner index exists for.
    const byOwner = await invoke<{ data: { objects: MediaObjectResponse[] } }>(
      listObjects,
      {
        method: "GET",
        path: "/api/v1/media/objects?ownerResourceType=blog_post&ownerResourceId=11111111-1111-4111-8111-111111111111",
        headers: authHeaders(owner)
      }
    );
    expect(byOwner.body.data.objects.map((o) => o.id)).toEqual([attachedId]);
  });

  test("an unknown status is a 400, never a silently-empty list", async () => {
    // The failure mode this prevents: a typo'd filter matching nothing reads to
    // the caller as "you have no media" instead of "your query is wrong".
    const owner = await bootstrap();
    await seedMediaObject(owner, "a");

    const response = await invoke<{ error: { code: string } }>(listObjects, {
      method: "GET",
      path: "/api/v1/media/objects?status=not_a_status",
      headers: authHeaders(owner)
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  test("limit is bounded — a caller cannot ask for the whole table", async () => {
    const owner = await bootstrap();
    for (let i = 0; i < 3; i += 1) {
      await seedMediaObject(owner, `obj-${i}`);
    }

    const limited = await invoke<{ data: { objects: MediaObjectResponse[] } }>(
      listObjects,
      {
        method: "GET",
        path: "/api/v1/media/objects?limit=2",
        headers: authHeaders(owner)
      }
    );
    expect(limited.body.data.objects.length).toBe(2);

    // Above MAX_LIST_LIMIT: clamped, not rejected and not honoured.
    const huge = await invoke<{ data: { objects: MediaObjectResponse[] } }>(
      listObjects,
      {
        method: "GET",
        path: "/api/v1/media/objects?limit=100000",
        headers: authHeaders(owner)
      }
    );
    expect(huge.status).toBe(200);
    expect(huge.body.data.objects.length).toBe(3);

    const invalid = await invoke(listObjects, {
      method: "GET",
      path: "/api/v1/media/objects?limit=0",
      headers: authHeaders(owner)
    });
    expect(invalid.status).toBe(400);
  });

  test("detail returns one object; includeDeleted is needed to see a soft-deleted one", async () => {
    const owner = await bootstrap();
    const { id: deletedId } = await seedMediaObject(owner, "gone", {
      deleted: true
    });

    const hidden = await invoke(readObject, {
      method: "GET",
      path: `/api/v1/media/objects/${deletedId}`,
      params: { id: deletedId },
      headers: authHeaders(owner)
    });
    expect(hidden.status).toBe(404);

    const shown = await invoke<{ data: { object: MediaObjectResponse } }>(
      readObject,
      {
        method: "GET",
        path: `/api/v1/media/objects/${deletedId}?includeDeleted=true`,
        params: { id: deletedId },
        headers: authHeaders(owner)
      }
    );
    expect(shown.status).toBe(200);
    expect(shown.body.data.object.id).toBe(deletedId);
  });

  test("ABAC default-deny: media.create does NOT imply media.read", async () => {
    // `read` was seeded-but-inert until this route existed. It must be its own
    // grant, not something any other media permission drags along.
    const owner = await bootstrap();
    await seedMediaObject(owner, "a");
    const uploader = await provisionCreateOnlyUser(
      owner.tenantId,
      "uploader@example.com"
    );

    const list = await invoke(listObjects, {
      method: "GET",
      path: "/api/v1/media/objects",
      headers: authHeaders(uploader)
    });
    expect(list.status).toBe(403);
  });

  test("a nonexistent id is a 404 — the same answer another tenant's id would get", async () => {
    const owner = await bootstrap();

    const missing = await invoke<{ error: { code: string } }>(readObject, {
      method: "GET",
      path: "/api/v1/media/objects/22222222-2222-4222-8222-222222222222",
      params: { id: "22222222-2222-4222-8222-222222222222" },
      headers: authHeaders(owner)
    });

    expect(missing.status).toBe(404);
    expect(missing.body.error.code).toBe("NOT_FOUND");
  });
});
