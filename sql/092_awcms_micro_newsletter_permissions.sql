-- Issue #272 (ADR-0033 §6) — permission catalog seed for the `newsletter`
-- admin API (subscriber list read, topic CRUD, suppression read/add, and the
-- campaign/digest compose + schedule + dispatch + cancel lifecycle). Wires up
-- the constants in `newsletter/domain/newsletter-permissions.ts` and this
-- module's own `module.ts` `permissions` declaration.
--
-- Same shape/limitation as every prior permission-seed migration here (see
-- `sql/088`/`sql/090` precedents): this extends the global ABAC catalog only.
-- Existing tenants' `owner` role does NOT retroactively gain these — only tenants
-- created after this migration runs get them via `POST /api/v1/setup/initialize`'s
-- `INSERT INTO awcms_micro_role_permissions ... SELECT ... FROM awcms_micro_permissions`.
--
-- ## Action-literal mapping (identity-access/domain/access-control.ts)
--
-- Every `action` below is an existing valid `AccessAction` literal — no new
-- literal is invented (the union's "reuse an existing literal, distinguish by
-- activity" precedent, exactly as sql/090 mapped comments' spam->reject). The
-- campaign lifecycle maps to distinct literals that already exist in the union:
--   * `schedule` gates moving a draft into the scheduled state.
--   * `send`     gates DISPATCH (freeze audience + enqueue per-recipient sends) —
--                the highest-risk mutation, Idempotency-Key'd + audited.
--   * `cancel`   gates cancelling a scheduled/dispatching campaign.
-- `subscribers.read` is the MASKED subscriber + consent-evidence view (never raw/
-- decrypted email). `suppression.create` adds a manual suppression;
-- `suppression.read` lists the deny-list. `topics.read/create/update` are the
-- topic CRUD (no delete: a topic with historical subscriptions/consent evidence
-- is deactivated via `is_active=false`, an `update`, never hard-deleted — the
-- append-only-evidence posture in sql/091's header).
INSERT INTO awcms_micro_permissions (module_key, activity_code, action, description)
VALUES
  ('newsletter', 'subscribers', 'read', 'Read this tenant''s subscribers with MASKED email only (never raw/decrypted) plus append-only consent evidence'),
  ('newsletter', 'topics', 'read', 'Read this tenant''s newsletter topics / subscription lists'),
  ('newsletter', 'topics', 'create', 'Create a newsletter topic / subscription list — audited'),
  ('newsletter', 'topics', 'update', 'Update or deactivate a newsletter topic — audited'),
  ('newsletter', 'suppression', 'read', 'Read this tenant''s suppression (bounce/complaint/manual/unsubscribe) deny-list'),
  ('newsletter', 'suppression', 'create', 'Add a manual suppression entry — high-risk, audited'),
  ('newsletter', 'campaigns', 'read', 'Read this tenant''s campaigns/digests, delivery status, and reconciliation runs'),
  ('newsletter', 'campaigns', 'create', 'Create/compose a campaign or digest draft — audited'),
  ('newsletter', 'campaigns', 'update', 'Update a draft campaign/digest (subject, body, topic, schedule time) — audited'),
  ('newsletter', 'campaigns', 'schedule', 'Move a draft campaign/digest into the scheduled state — audited'),
  ('newsletter', 'campaigns', 'send', 'Dispatch a scheduled campaign/digest: freeze the audience snapshot and enqueue per-recipient sends — high-risk, Idempotency-Key''d, audited'),
  ('newsletter', 'campaigns', 'cancel', 'Cancel a scheduled or dispatching campaign/digest — high-risk, audited')
ON CONFLICT (module_key, activity_code, action) DO NOTHING;
