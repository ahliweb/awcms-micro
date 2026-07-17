/**
 * Pins what `awcms_micro_news_media_objects.module_key` can actually hold.
 *
 * ## Why this test exists — it corrects ADR-0026's own evidence
 *
 * ADR-0026 argued the media registry was "already generic" and cited the column
 * itself as proof:
 *
 * > `module_key text NOT NULL DEFAULT 'news_portal'` ... a column with no reason
 * > to exist unless designed to serve multiple modules
 *
 * That reading missed `sql/041`'s `CHECK (module_key = 'news_portal')`, which
 * forbids every other value. The column exists, the default exists — and the
 * constraint makes the multi-module use it hints at impossible. The README's
 * claim that "`module_key` is the real owner discriminator" was false for the
 * same reason.
 *
 * The extraction ADR-0026 performed is still right, and the registry genuinely
 * does serve `blog_content` today — but through `owner_resource_type`
 * (`blog_post`, `blog_page`, ...), not `module_key`. A media object created for a
 * blog post is stamped `news_portal` regardless, because
 * `createPendingNewsMediaObject` never sets the column and falls through to the
 * default.
 *
 * (`awcms-mini` carries the identical CHECK, so this is inherited shape.)
 *
 * This test asserts the constraint against a real PostgreSQL rather than trusting
 * a reading of the DDL — the same discipline that caught it in the first place.
 * When a future migration relaxes the CHECK to make the registry genuinely
 * multi-module, this fails and whoever does it must state the new allowed set.
 *
 * Skipped unless DATABASE_URL is set (see tests/integration/harness.ts).
 */
import { beforeAll, beforeEach, describe, expect, test } from "bun:test";

import {
  applyMigrations,
  getAdminSql,
  integrationEnabled,
  provisionAppRole,
  resetDatabase
} from "./harness";

const suite = integrationEnabled ? describe : describe.skip;

async function insertMediaObject(
  tenantId: string,
  tenantUserId: string,
  moduleKey: string
): Promise<void> {
  const admin = getAdminSql();
  await admin`
    INSERT INTO awcms_micro_news_media_objects (
      id, tenant_id, module_key, storage_driver, bucket_name, object_key,
      public_url, mime_type, status, created_by_tenant_user_id
    ) VALUES (
      ${crypto.randomUUID()}, ${tenantId}, ${moduleKey}, 'cloudflare_r2',
      'test-bucket',
      ${`news-media/${tenantId}/2026/01/${crypto.randomUUID()}.jpg`},
      'https://media.example.test/x.jpg', 'image/jpeg', 'verified',
      ${tenantUserId}
    )
  `;
}

suite("media registry module_key constraint (ADR-0026 correction)", () => {
  let tenantId: string;
  let tenantUserId: string;

  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
  });

  beforeEach(async () => {
    await resetDatabase();
    const admin = getAdminSql();
    tenantId = crypto.randomUUID();
    tenantUserId = crypto.randomUUID();

    await admin`
      INSERT INTO awcms_micro_tenants (id, tenant_code, tenant_name, status)
      VALUES (${tenantId}, 'acme', 'Acme', 'active')
    `;
    const profile = (await admin`
      INSERT INTO awcms_micro_profiles (tenant_id, profile_type, display_name)
      VALUES (${tenantId}, 'person', 'Owner') RETURNING id
    `) as { id: string }[];
    const identity = (await admin`
      INSERT INTO awcms_micro_identities (tenant_id, profile_id, login_identifier, password_hash)
      VALUES (${tenantId}, ${profile[0]!.id}, 'owner@example.com', 'x') RETURNING id
    `) as { id: string }[];
    const tenantUser = (await admin`
      INSERT INTO awcms_micro_tenant_users (id, tenant_id, identity_id)
      VALUES (${tenantUserId}, ${tenantId}, ${identity[0]!.id}) RETURNING id
    `) as { id: string }[];
    tenantUserId = tenantUser[0]!.id;
  });

  test("module_key accepts 'news_portal' — the only value sql/041's CHECK permits", async () => {
    await insertMediaObject(tenantId, tenantUserId, "news_portal");

    const admin = getAdminSql();
    const rows = (await admin`
      SELECT module_key FROM awcms_micro_news_media_objects
    `) as { module_key: string }[];

    expect(rows.map((r) => r.module_key)).toEqual(["news_portal"]);
  });

  test("module_key REJECTS every other module — the registry is not multi-module today, whatever the column suggests", async () => {
    // If this ever stops throwing, the CHECK was relaxed: update ADR-0026 §3 and
    // the media_library README, which now say the registry is single-valued
    // here, and give `GET /api/v1/media/objects` its `moduleKey` filter back
    // (dropped because it could only ever match one value).
    for (const moduleKey of ["media_library", "blog_content", "anything"]) {
      let threw = false;

      try {
        await insertMediaObject(tenantId, tenantUserId, moduleKey);
      } catch (error) {
        threw = true;
        expect(String(error)).toContain("module_key_check");
      }

      expect({ moduleKey, rejected: threw }).toEqual({
        moduleKey,
        rejected: true
      });
    }
  });

  test("a media object created for a blog post is still stamped news_portal — owner_resource_type is the real discriminator", async () => {
    const admin = getAdminSql();
    await admin`
      INSERT INTO awcms_micro_news_media_objects (
        id, tenant_id, owner_resource_type, owner_resource_id, storage_driver,
        bucket_name, object_key, public_url, mime_type, status,
        created_by_tenant_user_id
      ) VALUES (
        ${crypto.randomUUID()}, ${tenantId}, 'blog_post',
        ${crypto.randomUUID()}, 'cloudflare_r2', 'test-bucket',
        ${`news-media/${tenantId}/2026/01/${crypto.randomUUID()}.jpg`},
        'https://media.example.test/x.jpg', 'image/jpeg', 'attached',
        ${tenantUserId}
      )
    `;

    const rows = (await admin`
      SELECT module_key, owner_resource_type
      FROM awcms_micro_news_media_objects
    `) as { module_key: string; owner_resource_type: string }[];

    // `module_key` was never supplied and fell through to the default — which is
    // exactly what `createPendingNewsMediaObject` does in production. So the
    // column carries no information about which module the object serves.
    expect(rows).toEqual([
      { module_key: "news_portal", owner_resource_type: "blog_post" }
    ]);
  });
});
