-- Issue #266 (epic #261 Wave 1, ADR-0028) — first runtime code of the
-- `seo_distribution` module: per-tenant SEO defaults that the central metadata
-- renderer applies UNDERNEATH resource-level facts (clear precedence: a
-- resource's own `SeoResourceFacts` always wins; these tenant defaults only
-- fill the gaps and supply site-identity JSON-LD).
--
-- ## Why this table exists (and why it is a genuine schema need, not padding)
--
-- The renderer needs a place to read tenant-authored site identity — site name,
-- default social image, Twitter/X handle, Organization name/logo — plus a
-- tenant-wide "keep this whole site out of the index" switch (staging/preview
-- deployments). None of that is a `SeoResourceFacts` fact (those are DERIVED per
-- resource by the content module); it is tenant CONFIGURATION owned by
-- `seo_distribution` itself. ADR-0028 §4 ("Add tenant SEO defaults and
-- resource-level controlled overrides with clear precedence") calls for exactly
-- this table, so the `bila perlu` condition in the issue is met.
--
-- ## Tenant isolation — RLS FORCE, same construction as every tenant-scoped table
--
-- ENABLE + FORCE ROW LEVEL SECURITY with a tenant_isolation policy keyed on
-- `app.current_tenant_id` (migration 013's convention). One row per tenant
-- (`tenant_id` PRIMARY KEY) — this is upsert-shaped config, not an event log, so
-- there is no soft-delete/version churn here. Tenant A's config can NEVER affect
-- tenant B's rendered output: the row is unreachable cross-tenant by RLS, and
-- the renderer's cache key is tenant-first (`buildSeoCacheKey`, ADR-0028 §7).
--
-- ## Media ids are NOT foreign keys — deliberately (ADR-0028 §3, ADR-0013 §6)
--
-- `default_social_media_id` / `organization_logo_media_id` reference a
-- `media_library` object, but are stored as bare `uuid` with NO cross-module
-- foreign key: a DB-level FK from `seo_distribution`'s table into
-- `media_library`'s `awcms_micro_news_media_objects` would couple the two
-- modules' schemas (an ADR-0013 §6 no-cross-module-write-adjacent coupling), and
-- more importantly a raw id is never TRUSTED here — the renderer resolves it
-- through `MediaLibraryPort.resolveMediaReferences` (same-tenant, verified) at
-- render time, and an id that does not resolve to a safe, same-tenant object is
-- simply dropped (no image emitted). Storing the id without an FK is the correct
-- shape: safety is enforced at resolve time by the port, not by referential
-- integrity that would also leak cross-tenant existence.
--
-- ## Bounds (ADR-0028 threat model — "metadata lengths ... bounded and validated")
--
-- CHECK constraints cap the free-text fields at render-safe lengths as a
-- defense-in-depth floor under the application-layer validation
-- (`domain/seo-config.ts`). A tenant cannot store a 10 MB "site name" that would
-- bloat every rendered `<head>`.
CREATE TABLE IF NOT EXISTS awcms_micro_seo_tenant_settings (
  tenant_id uuid PRIMARY KEY REFERENCES awcms_micro_tenants (id),
  -- Overrides the tenant's display name for `og:site_name` / JSON-LD `WebSite`.
  -- NULL → fall back to `awcms_micro_tenants.tenant_name` at render time.
  site_name text,
  -- Default `<meta name="description">` / `og:description` when a resource has
  -- none of its own. NULL → no site-level default (resource must supply one).
  default_meta_description text,
  -- Default social preview image (media object id, resolved via the port).
  default_social_media_id uuid,
  -- e.g. "@example" — rendered as `twitter:site`. NULL → tag omitted.
  twitter_site_handle text,
  -- schema.org `Organization` identity for the site-level JSON-LD node.
  organization_name text,
  organization_logo_media_id uuid,
  -- Tenant-wide "this whole site is noindex" switch (staging/preview). When
  -- true, EVERY resource of this tenant renders `robots: noindex` and is absent
  -- from discovery surfaces, regardless of a resource's own indexability — the
  -- one place tenant config can only ever make output LESS visible, never more.
  default_robots_noindex boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  CONSTRAINT awcms_micro_seo_tenant_settings_site_name_len
    CHECK (site_name IS NULL OR char_length(site_name) <= 200),
  CONSTRAINT awcms_micro_seo_tenant_settings_meta_description_len
    CHECK (default_meta_description IS NULL OR char_length(default_meta_description) <= 500),
  CONSTRAINT awcms_micro_seo_tenant_settings_twitter_handle_len
    CHECK (twitter_site_handle IS NULL OR char_length(twitter_site_handle) <= 80),
  CONSTRAINT awcms_micro_seo_tenant_settings_org_name_len
    CHECK (organization_name IS NULL OR char_length(organization_name) <= 200)
);

ALTER TABLE awcms_micro_seo_tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_seo_tenant_settings FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_seo_tenant_settings_tenant_isolation
  ON awcms_micro_seo_tenant_settings
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
