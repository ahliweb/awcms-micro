-- Generic idempotency store (doc 16 §Idempotency store, doc 10 §Idempotency
-- wrapper rules).
--
-- Provenance (ADR-0025): upstream AWCMS-Mini introduces this table inside its
-- `012_awcms_mini_workflow_approval_schema.sql`, because "workflow decision"
-- happened to be the first endpoint in that repo needing an Idempotency-Key.
-- AWCMS-Micro does not port the `workflow` module, but the idempotency store is
-- NOT workflow-specific — it is shared cross-module infrastructure that
-- `_shared/idempotency.ts` exposes to every high-risk mutation, and this repo's
-- kept modules (`blog_content`, `domain_event_runtime`, `identity_access`'s
-- business-scope mutations, ...) already depend on it. So the table is carried
-- over on its own, under a name that says what it actually is, while the four
-- workflow tables and the `workflow.approval.*` permission seeds stay behind.
--
-- The migration NUMBER is deliberately reused (012 = mini's 012) rather than
-- appended at the end: this repository has never been deployed, no database has
-- an `awcms_micro_schema_migrations` row for the old file, and keeping the
-- number aligned with upstream keeps the two repos' migration histories
-- readable side by side when porting future changes. Numbering gaps elsewhere
-- in `sql/` (012 aside, see 048/054/060/063-068/071-076) are the intentional
-- footprint of modules this repo does not port — `scripts/db-migrate.ts` orders
-- lexicographically and never requires contiguity.
--
-- `request_scope` disambiguates concurrent uses of the same Idempotency-Key
-- value across different mutation endpoints — two endpoints may legitimately
-- receive the same client-supplied key.

CREATE TABLE IF NOT EXISTS awcms_micro_idempotency_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  request_scope text NOT NULL,
  idempotency_key text NOT NULL,
  request_hash text NOT NULL,
  response_status integer NOT NULL,
  response_body jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS awcms_micro_idempotency_keys_scope_key
  ON awcms_micro_idempotency_keys (tenant_id, request_scope, idempotency_key);

CREATE INDEX IF NOT EXISTS awcms_micro_idempotency_keys_tenant_created_idx
  ON awcms_micro_idempotency_keys (tenant_id, created_at DESC);

ALTER TABLE awcms_micro_idempotency_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_idempotency_keys_tenant_isolation
  ON awcms_micro_idempotency_keys
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
