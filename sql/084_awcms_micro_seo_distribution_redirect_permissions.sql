-- Issue #268 (ADR-0028 §9) — permission catalog seed for the `seo_distribution`
-- redirect-management + 404-governance admin API (`/api/v1/seo/redirects/*` and
-- `/api/v1/seo/not-found/*`). Wires up the constants in
-- `seo-distribution/domain/seo-permissions.ts` and this module's `module.ts`
-- `permissions` declaration.
--
-- Same shape/limitation as every prior permission-seed migration here (sql/081,
-- sql/079, sql/042): this extends the global ABAC catalog only. Existing tenants'
-- `owner` role does NOT retroactively gain these — only tenants created after this
-- migration runs get them via `POST /api/v1/setup/initialize`'s
-- `INSERT INTO awcms_micro_role_permissions ... SELECT ... FROM awcms_micro_permissions`.
-- Backfilling existing tenants is a separate operator concern (documented in the
-- module README), not silently done here.
--
-- ## Why read / create / update / delete are separate `redirect` actions
--
-- A redirect rule rewrites what a public URL resolves to — its blast radius is the
-- tenant's inbound-link/search surface. The four actions have distinct risk:
--   - `read`   — list/search rules, preview chains, and explain conflicts (low risk,
--                auditor-friendly). The privacy-minimized 404 governance data is a
--                SEPARATE `not_found.read` activity below, not part of `redirect.read`.
--   - `create` — add a rule / import in bulk / capture a URL change into a rule
--                (starts redirecting live traffic; idempotency-keyed + audited).
--   - `update` — edit / activate / deactivate / archive a rule, and change the
--                per-tenant redirect policy (legacy-blog toggle, auto-capture mode).
--   - `delete` — soft-delete / restore / purge a rule.
-- Keeping them separate lets a role audit or preview redirects without holding the
-- power to change what visitors are sent to.
--
-- `not_found` is its own activity (privacy-minimized broken-link governance):
--   - `read`   — view the 404 dashboard / top unresolved paths.
--   - `update` — mark an observation resolved / attach a suggested redirect / dismiss.
INSERT INTO awcms_micro_permissions (module_key, activity_code, action, description)
VALUES
  ('seo_distribution', 'redirect', 'read', 'List/search redirect rules, preview redirect chains, and explain conflicts (404 governance data requires not_found.read)'),
  ('seo_distribution', 'redirect', 'create', 'Create redirect rules, bulk-import, and capture URL changes into rules (high-risk, idempotency-keyed, audited)'),
  ('seo_distribution', 'redirect', 'update', 'Edit/activate/deactivate/archive redirect rules and change per-tenant redirect policy (high-risk, audited)'),
  ('seo_distribution', 'redirect', 'delete', 'Soft-delete, restore, or purge redirect rules (audited)'),
  ('seo_distribution', 'not_found', 'read', 'Read the privacy-minimized 404/broken-link governance dashboard'),
  ('seo_distribution', 'not_found', 'update', 'Resolve, dismiss, or attach a suggested redirect to a 404 observation (audited)')
ON CONFLICT (module_key, activity_code, action) DO NOTHING;
