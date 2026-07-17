-- ADR-0026 step 5a — permission catalog seed for the managed-media enforcement
-- endpoint (`GET`/`POST /api/v1/media/enforcement`), wiring up the constants in
-- `media-library/domain/media-permissions.ts` (`MEDIA_ENFORCEMENT_PERMISSIONS`)
-- and this module's own `module.ts` `permissions` declaration.
--
-- Same shape/limitation as every prior permission-seed migration here (see
-- `sql/042`'s header): this extends the global ABAC catalog only. Existing
-- tenants' `owner` role does NOT retroactively gain these — only tenants created
-- after this migration runs get them via `POST /api/v1/setup/initialize`'s
-- `INSERT INTO awcms_micro_role_permissions ... SELECT ... FROM awcms_micro_permissions`.
--
-- ## Why a separate activity code from `media`
--
-- `media.*` governs individual media OBJECTS; `enforcement.*` governs a
-- tenant-wide CONTENT POLICY (may content reference media by raw URL at all).
-- Different blast radius, so separately grantable — folding this into
-- `media.create` would hand the policy switch to every editor who uploads
-- images.
--
-- ## Reconciling with sql/078's header — read before adding any media route
--
-- `sql/078` states that `awcms_micro_media_library_tenant_state` has no GENERIC
-- write endpoint and is written only by `markManagedMediaEnforced`. Both remain
-- true after this migration, and the distinction is the whole point:
--
--   * The mechanism `sql/043` rejected as exploitable was the GENERIC
--     `PATCH /api/v1/tenant/modules/{moduleKey}/settings`, gated by the generic
--     `module_management.settings.update` permission that Owner/Admin hold by
--     default for entirely unrelated reasons. A tenant could clear the marker
--     and silently switch its own media validation off.
--   * This endpoint is dedicated, gated by its own dedicated permission, and —
--     decisively — **can only ever turn enforcement ON**. There is no `disable`
--     action here, no "unmark" function in
--     `media-library-tenant-state.ts`, and no code path anywhere that deletes a
--     row from that table.
--
-- So the security property `sql/043`/`sql/078` exist to protect ("a tenant can
-- never switch its own media validation off") is preserved exactly, not
-- weakened. Adding a `disable` action, an "unmark" function, or a DELETE against
-- that table would break it — do not add any of the three.
INSERT INTO awcms_micro_permissions (module_key, activity_code, action, description)
VALUES
  ('media_library', 'enforcement', 'read', 'Read whether managed-media enforcement is active for this tenant, and why it can or cannot be enabled'),
  ('media_library', 'enforcement', 'enable', 'Turn managed-media enforcement ON for this tenant (one-way — there is deliberately no disable)')
ON CONFLICT (module_key, activity_code, action) DO NOTHING;
