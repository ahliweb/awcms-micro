/**
 * Tenant SEO config data access (Issue #266, ADR-0028 §4/§9) over
 * `awcms_micro_seo_tenant_settings` (sql/080). Every query runs inside a
 * caller-provided tenant transaction (`withTenant`, RLS FORCE'd on this table),
 * so tenant isolation holds twice: the explicit `tenant_id` filter here and RLS.
 *
 * `updateSeoTenantSettings` is the ONLY writer and is high-risk (it changes the
 * public metadata/indexability surface — ADR-0028 §9), so it records an audit
 * event on every write via the injected `recordAudit` callback. The audit
 * writer is injected (not imported) so this application service stays testable
 * without wiring the whole logging module, and so the route composition root
 * remains the single place cross-module wiring happens.
 */
import {
  EMPTY_SEO_TENANT_SETTINGS,
  type SeoTenantSettings
} from "../domain/seo-config";

type SeoSettingsRow = {
  site_name: string | null;
  default_meta_description: string | null;
  default_social_media_id: string | null;
  twitter_site_handle: string | null;
  organization_name: string | null;
  organization_logo_media_id: string | null;
  default_robots_noindex: boolean;
};

function toSettings(row: SeoSettingsRow): SeoTenantSettings {
  return {
    siteName: row.site_name,
    defaultMetaDescription: row.default_meta_description,
    defaultSocialMediaId: row.default_social_media_id,
    twitterSiteHandle: row.twitter_site_handle,
    organizationName: row.organization_name,
    organizationLogoMediaId: row.organization_logo_media_id,
    defaultRobotsNoindex: row.default_robots_noindex
  };
}

/**
 * Read this tenant's SEO defaults. Returns `EMPTY_SEO_TENANT_SETTINGS` (not
 * `null`) when no row exists yet — the renderer always wants a usable settings
 * object, and "no config" and "default config" render identically, so there is
 * no reason to make every caller handle a null.
 */
export async function fetchSeoTenantSettings(
  tx: Bun.SQL,
  tenantId: string
): Promise<SeoTenantSettings> {
  const rows = (await tx`
    SELECT site_name, default_meta_description, default_social_media_id,
      twitter_site_handle, organization_name, organization_logo_media_id,
      default_robots_noindex
    FROM awcms_micro_seo_tenant_settings
    WHERE tenant_id = ${tenantId}
  `) as SeoSettingsRow[];

  return rows[0] ? toSettings(rows[0]) : { ...EMPTY_SEO_TENANT_SETTINGS };
}

/** Injected audit hook — the route wires `recordAuditEvent` here; tests pass a spy. */
export type SeoConfigAuditHook = (
  tx: Bun.SQL,
  detail: { previous: SeoTenantSettings; next: SeoTenantSettings }
) => Promise<void>;

/**
 * Upsert this tenant's SEO defaults (full replace of the mutable fields — the
 * PUT semantics the admin API exposes), then record an audit event. Idempotent
 * at the DB level: the same body applied twice converges on the same row.
 * `actorTenantUserId` stamps `created_by`/`updated_by`.
 */
export async function updateSeoTenantSettings(
  tx: Bun.SQL,
  tenantId: string,
  actorTenantUserId: string,
  next: SeoTenantSettings,
  recordAudit: SeoConfigAuditHook
): Promise<SeoTenantSettings> {
  const previous = await fetchSeoTenantSettings(tx, tenantId);

  const rows = (await tx`
    INSERT INTO awcms_micro_seo_tenant_settings
      (tenant_id, site_name, default_meta_description, default_social_media_id,
       twitter_site_handle, organization_name, organization_logo_media_id,
       default_robots_noindex, created_by, updated_by)
    VALUES (
      ${tenantId}, ${next.siteName}, ${next.defaultMetaDescription},
      ${next.defaultSocialMediaId}, ${next.twitterSiteHandle},
      ${next.organizationName}, ${next.organizationLogoMediaId},
      ${next.defaultRobotsNoindex}, ${actorTenantUserId}, ${actorTenantUserId}
    )
    ON CONFLICT (tenant_id) DO UPDATE SET
      site_name = EXCLUDED.site_name,
      default_meta_description = EXCLUDED.default_meta_description,
      default_social_media_id = EXCLUDED.default_social_media_id,
      twitter_site_handle = EXCLUDED.twitter_site_handle,
      organization_name = EXCLUDED.organization_name,
      organization_logo_media_id = EXCLUDED.organization_logo_media_id,
      default_robots_noindex = EXCLUDED.default_robots_noindex,
      updated_by = EXCLUDED.updated_by,
      updated_at = now()
    RETURNING site_name, default_meta_description, default_social_media_id,
      twitter_site_handle, organization_name, organization_logo_media_id,
      default_robots_noindex
  `) as SeoSettingsRow[];

  const saved = toSettings(rows[0]!);
  await recordAudit(tx, { previous, next: saved });
  return saved;
}
