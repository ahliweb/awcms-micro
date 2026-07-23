-- Permission catalog seed for per-tenant sidebar menu configuration
-- (feat/sidebar-menu-management). Adds the single new
-- `module_management.navigation.configure` permission that gates the
-- PUT/reset mutations on `/api/v1/navigation/sidebar-config` (the passive read
-- reuses the pre-existing `module_management.navigation.read`, seeded with the
-- rest of module_management's catalog — not re-added here). Wires up this
-- module's own `module.ts` `permissions` declaration.
--
-- Same shape/limitation as every prior permission-seed migration here (see
-- sql/090/sql/092 precedents): this extends the GLOBAL ABAC catalog only.
-- Existing tenants' `owner` role does NOT retroactively gain this — only
-- tenants created after this migration runs get it via
-- `POST /api/v1/setup/initialize`'s
-- `INSERT INTO awcms_micro_role_permissions ... SELECT ... FROM awcms_micro_permissions`.
--
-- `configure` is an EXISTING `AccessAction` literal (identity-access/domain/
-- access-control.ts) and is already in `HIGH_RISK_ACTIONS` — so the save/reset
-- endpoints require an `Idempotency-Key` and record an audit event, exactly
-- like every other high-risk configure/update surface (mirrors sql/081's
-- `seo_distribution.config.update`). No new action literal is invented.
INSERT INTO awcms_micro_permissions (module_key, activity_code, action, description)
VALUES
  ('module_management', 'navigation', 'configure', 'Configure the per-tenant sidebar menu layout (grouping, order, visibility, labels) — high-risk, Idempotency-Key''d, audited')
ON CONFLICT (module_key, activity_code, action) DO NOTHING;
