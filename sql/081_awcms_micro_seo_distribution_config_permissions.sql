-- Issue #266 (ADR-0028 §9) — permission catalog seed for the `seo_distribution`
-- tenant SEO config admin API (`GET`/`PUT /api/v1/seo/config`), wiring up the
-- constants in `seo-distribution/domain/seo-permissions.ts` and this module's
-- own `module.ts` `permissions` declaration.
--
-- Same shape/limitation as every prior permission-seed migration here (see
-- `sql/079`/`sql/042`): this extends the global ABAC catalog only. Existing
-- tenants' `owner` role does NOT retroactively gain these — only tenants created
-- after this migration runs get them via `POST /api/v1/setup/initialize`'s
-- `INSERT INTO awcms_micro_role_permissions ... SELECT ... FROM awcms_micro_permissions`.
--
-- ## Why `config.read` and `config.update` are separate actions
--
-- Reading the current SEO defaults and CHANGING them have different blast
-- radii: an update rewrites the public metadata surface (canonical site name,
-- default social image, and — decisively — the tenant-wide `noindex` switch that
-- can pull an entire site out of every search index). ADR-0028 §9 keeps them as
-- separately grantable actions so a role that may audit the config need not also
-- hold the power to change what crawlers see. `config.update` is high-risk and
-- audited (`seo-distribution/application/seo-config-directory.ts` records an
-- audit event on every write); `config.read` is not.
--
-- Redirect/sitemap permissions (ADR-0028 §9 also lists
-- `seo_distribution.redirects.*` / `seo_distribution.sitemap.read`) are
-- deliberately NOT seeded here — they belong to #267 (sitemap/feeds) and #268
-- (redirects), whose tables and endpoints do not exist yet. Seeding a permission
-- for a route that cannot be exercised would be the "descriptor claims a
-- capability it cannot implement" anti-pattern ADR-0028 §"Keputusan pendaftaran
-- descriptor" warns against.
INSERT INTO awcms_micro_permissions (module_key, activity_code, action, description)
VALUES
  ('seo_distribution', 'config', 'read', 'Read this tenant''s SEO defaults (site identity, default social image, robots policy)'),
  ('seo_distribution', 'config', 'update', 'Update this tenant''s SEO defaults — changes the public metadata/indexability surface (high-risk, audited)')
ON CONFLICT (module_key, activity_code, action) DO NOTHING;
