-- Issue #271 (ADR-0032 §6) — permission catalog seed for the `comments`
-- admin/moderation API (moderation queue read, approve/reject/spam, archive,
-- restore, soft-delete, and per-tenant settings read/update). Wires up the
-- constants in `comments/domain/comments-permissions.ts` and this module's own
-- `module.ts` `permissions` declaration.
--
-- Same shape/limitation as every prior permission-seed migration here (see
-- `sql/081`/`sql/088` precedents): this extends the global ABAC catalog only.
-- Existing tenants' `owner` role does NOT retroactively gain these — only tenants
-- created after this migration runs get them via `POST /api/v1/setup/initialize`'s
-- `INSERT INTO awcms_micro_role_permissions ... SELECT ... FROM awcms_micro_permissions`.
--
-- ## Action-literal mapping (identity-access/domain/access-control.ts)
--
-- Every `action` below is an existing valid `AccessAction` literal. The three
-- concrete moderation OUTCOMES (approve | reject | mark-spam) map to two
-- permissions: `approve` gates publishing a comment (high-risk), and `reject`
-- gates BOTH rejecting AND marking-as-spam — spam is a rejection subtype with the
-- same "deny publication" blast radius, distinguished by the audited reason code,
-- so a role that may reject may also spam (no separate `spam` AccessAction is
-- invented, matching the union's "reuse an existing literal, distinguish by
-- activity/reason" precedent). `archive`/`restore`/`delete` are their own valid
-- literals. `read` is the non-mutating queue/config view. `settings.update`
-- follows site_search's split (an update changes the public comment surface;
-- audited + idempotency-keyed regardless of not being classed high-risk).
INSERT INTO awcms_micro_permissions (module_key, activity_code, action, description)
VALUES
  ('comments', 'moderation', 'read', 'Read this tenant''s comment moderation queue (pending/reported/rejected/spam), search and filter by status'),
  ('comments', 'moderation', 'approve', 'Approve a pending comment so it is shown publicly — high-risk, idempotency-keyed, audited'),
  ('comments', 'moderation', 'reject', 'Reject a comment or mark it as spam (deny publication) — reason code required, audited'),
  ('comments', 'moderation', 'archive', 'Archive an approved comment (remove from public view, retain for history) — audited'),
  ('comments', 'moderation', 'restore', 'Restore a rejected/spam/archived comment back to pending review — high-risk, audited'),
  ('comments', 'moderation', 'delete', 'Soft-delete a comment (retain the row, remove content from public view) — high-risk, audited'),
  ('comments', 'settings', 'read', 'Read this tenant''s comment configuration (policy mode, moderation, anti-abuse thresholds, blocked terms)'),
  ('comments', 'settings', 'update', 'Update this tenant''s comment configuration — changes the public comment surface (high-risk, audited)')
ON CONFLICT (module_key, activity_code, action) DO NOTHING;
