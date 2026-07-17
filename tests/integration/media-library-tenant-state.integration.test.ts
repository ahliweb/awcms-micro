/**
 * Integration tests for `media_library`'s own per-tenant managed-media
 * enforcement signal (ADR-0026 steps 3-4, migration `078`) against a real
 * PostgreSQL.
 *
 * These exist because the three claims that matter here are all claims about
 * the DATABASE, and every one of them is invisible to a typecheck:
 *
 *   1. The sql/078 backfill genuinely copies rows ACROSS tenants. Its own header
 *      argues it works because migrations run as a superuser that bypasses RLS
 *      regardless of FORCE. That reasoning is only as good as the role the
 *      runner actually connects as — so this asserts the rows move, rather than
 *      trusting the comment.
 *   2. The flag is tenant-isolated. It gates media validation, so one tenant
 *      reading another's flag would be a real cross-tenant defect.
 *   3. Enforcement works with NO `news_portal` state whatsoever — the brochure
 *      site case. This is the entire product gap ADR-0026 was written to close,
 *      and nothing else in the suite proves it.
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

import { getDatabaseClient } from "../../src/lib/database/client";
import { withTenant } from "../../src/lib/database/tenant-context";
import {
  isManagedMediaEnforcedForTenant,
  markManagedMediaEnforced
} from "../../src/modules/media-library/application/media-library-tenant-state";
import { mediaLibraryPortAdapter } from "../../src/modules/media-library/application/media-library-port-adapter";

/** Media R2 configured and separated from sync-storage's own R2 vars — deliberately WITHOUT any NEWS_PORTAL_* var. */
const MEDIA_READY_ENV_WITHOUT_NEWS_PORTAL = {
  NEWS_MEDIA_R2_ENABLED: "true",
  NEWS_MEDIA_R2_ACCOUNT_ID: "acct",
  NEWS_MEDIA_R2_ACCESS_KEY_ID: "news-key",
  NEWS_MEDIA_R2_SECRET_ACCESS_KEY: "news-secret",
  NEWS_MEDIA_R2_BUCKET: "news-media-bucket",
  NEWS_MEDIA_R2_PUBLIC_BASE_URL: "https://media.example.test"
} as NodeJS.ProcessEnv;

/**
 * A bare `active` tenant row — all these tests need, since every assertion below
 * goes through `withTenant`/admin SQL rather than an authenticated HTTP route.
 * Deliberately NOT `POST /api/v1/setup/initialize`: that endpoint is a one-time
 * bootstrap and rejects a second call with 403, so it cannot provision the two
 * tenants the isolation and backfill tests need. Same shape as
 * `blog-content-public-routes`'s own `provisionSecondActiveTenant`.
 */
async function provisionTenant(tenantCode: string): Promise<string> {
  const admin = getAdminSql();
  const tenantId = crypto.randomUUID();

  await admin`
    INSERT INTO awcms_micro_tenants (id, tenant_code, tenant_name, status)
    VALUES (${tenantId}, ${tenantCode}, ${tenantCode}, 'active')
  `;

  return tenantId;
}

const suite = integrationEnabled ? describe : describe.skip;

suite("media_library tenant state (ADR-0026 steps 3-4)", () => {
  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  test("markManagedMediaEnforced round-trips inside a tenant-scoped transaction", async () => {
    const tenantId = await provisionTenant("acme");

    await withTenant(getDatabaseClient(), tenantId, async (tx) => {
      expect(await isManagedMediaEnforcedForTenant(tx, tenantId)).toBe(false);
      await markManagedMediaEnforced(tx, tenantId);
      expect(await isManagedMediaEnforcedForTenant(tx, tenantId)).toBe(true);
    });
  });

  test("one tenant's enforcement flag is invisible to another — RLS holds on the table that gates media validation", async () => {
    const enforcedTenantId = await provisionTenant("acme");
    const otherTenantId = await provisionTenant("globex");

    await withTenant(getDatabaseClient(), enforcedTenantId, async (tx) => {
      await markManagedMediaEnforced(tx, enforcedTenantId);
    });

    await withTenant(getDatabaseClient(), otherTenantId, async (tx) => {
      // Fail-closed for the tenant that never opted in — and, critically, asking
      // about ANOTHER tenant's id from inside this tenant's context must not
      // leak that tenant's state either.
      expect(await isManagedMediaEnforcedForTenant(tx, otherTenantId)).toBe(
        false
      );
      expect(await isManagedMediaEnforcedForTenant(tx, enforcedTenantId)).toBe(
        false
      );
    });
  });

  test("the sql/078 backfill copies news_portal preset state across tenants — the migration role really does bypass RLS", async () => {
    // sql/078's backfill runs at migration time, when no tenant exists yet, so it
    // can never be observed by simply migrating. This re-runs the EXACT statement
    // the migration carries, against real rows, to prove the claim its header
    // makes: that an INSERT...SELECT reading a FORCE'd RLS table sees every
    // tenant's rows rather than silently copying nothing.
    //
    // If this ever fails, sql/078 is silently a no-op and every tenant that
    // applied the R2 preset LOSES media enforcement on deploy — a security
    // regression disguised as a refactor.
    const tenantA = await provisionTenant("acme");
    const tenantB = await provisionTenant("globex");

    const admin = getAdminSql();
    const appliedAt = new Date("2026-01-15T10:00:00.000Z");

    for (const tenantId of [tenantA, tenantB]) {
      await admin`
        INSERT INTO awcms_micro_news_portal_tenant_state
          (tenant_id, full_online_r2_mode_applied_at, updated_at)
        VALUES (${tenantId}, ${appliedAt}, now())
      `;
    }

    // Start from empty so the assertion is about the backfill, not the fixture.
    await admin`DELETE FROM awcms_micro_media_library_tenant_state`;

    await admin`
      INSERT INTO awcms_micro_media_library_tenant_state
        (tenant_id, managed_media_enforced_at, updated_at)
      SELECT tenant_id, full_online_r2_mode_applied_at, now()
      FROM awcms_micro_news_portal_tenant_state
      ON CONFLICT (tenant_id) DO NOTHING
    `;

    const rows = (await admin`
      SELECT tenant_id, managed_media_enforced_at
      FROM awcms_micro_media_library_tenant_state
      ORDER BY tenant_id
    `) as { tenant_id: string; managed_media_enforced_at: Date }[];

    expect(rows.length).toBe(2);
    expect(new Set(rows.map((r) => r.tenant_id))).toEqual(
      new Set([tenantA, tenantB])
    );

    // Carried over verbatim, not stamped with now() — the flag records when
    // enforcement genuinely began, not when the migration happened to run.
    for (const row of rows) {
      expect(new Date(row.managed_media_enforced_at).toISOString()).toBe(
        appliedAt.toISOString()
      );
    }
  });

  test("a brochure-site tenant gets managed media with NO news_portal state at all — the product gap ADR-0026 closes", async () => {
    const tenantId = await provisionTenant("acme");

    await withTenant(getDatabaseClient(), tenantId, async (tx) => {
      // Before opting in: enforcement off, even though the deployment's media R2
      // is fully configured. Deployment readiness alone must never opt a tenant in.
      expect(
        await mediaLibraryPortAdapter.isManagedMediaEnforcementActiveForTenant(
          tx,
          tenantId,
          MEDIA_READY_ENV_WITHOUT_NEWS_PORTAL
        )
      ).toBe(false);

      await markManagedMediaEnforced(tx, tenantId);

      // After opting in: enforcement ON. Note the env has no NEWS_PORTAL_ENABLED
      // and no NEWS_PORTAL_PROFILE, and no row exists in
      // `awcms_micro_news_portal_tenant_state`. Under the old `NewsMediaPort`
      // this combination was unreachable by construction: the gate required
      // news_portal's preset, so a site with no news portal could never have
      // managed media. That is the whole point of the split.
      expect(
        await mediaLibraryPortAdapter.isManagedMediaEnforcementActiveForTenant(
          tx,
          tenantId,
          MEDIA_READY_ENV_WITHOUT_NEWS_PORTAL
        )
      ).toBe(true);
    });

    const admin = getAdminSql();
    const newsPortalRows = (await admin`
      SELECT tenant_id FROM awcms_micro_news_portal_tenant_state
    `) as { tenant_id: string }[];
    expect(newsPortalRows).toEqual([]);
  });

  test("enforcement fails closed when the deployment's media R2 is not configured, even for an opted-in tenant", async () => {
    const tenantId = await provisionTenant("acme");

    await withTenant(getDatabaseClient(), tenantId, async (tx) => {
      await markManagedMediaEnforced(tx, tenantId);

      // The tenant flag alone must never enforce registry-backed references on a
      // deployment with no working media storage to back them — that would make
      // content unwritable rather than safer.
      expect(
        await mediaLibraryPortAdapter.isManagedMediaEnforcementActiveForTenant(
          tx,
          tenantId,
          { NEWS_MEDIA_R2_ENABLED: "false" } as NodeJS.ProcessEnv
        )
      ).toBe(false);

      // Enabled but incompletely configured — also fail-closed, never "enabled
      // enough".
      expect(
        await mediaLibraryPortAdapter.isManagedMediaEnforcementActiveForTenant(
          tx,
          tenantId,
          { NEWS_MEDIA_R2_ENABLED: "true" } as NodeJS.ProcessEnv
        )
      ).toBe(false);
    });
  });
});
