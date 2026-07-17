-- Issue (pasca-backlog): enforce RLS for the application DB user.
--
-- FINDING (surfaced by the integration harness): the multi-tenant RLS control
-- (ADR-0003) was inert for the application. Migrations 002-012 only
-- `ENABLE ROW LEVEL SECURITY`; PostgreSQL bypasses RLS for a table's OWNER
-- (unless `FORCE`) and unconditionally for SUPERUSER / BYPASSRLS roles. The app
-- connected as the owning superuser, so a bogus `app.current_tenant_id` still
-- returned rows — tenant isolation rested entirely on application-level
-- `WHERE tenant_id` clauses, with RLS as a non-functioning backstop.
--
-- This migration makes RLS actually enforced, in two parts that must go
-- together (each is necessary, neither is sufficient alone):
--   1. FORCE ROW LEVEL SECURITY on every tenant-scoped table, so policies apply
--      even to the table owner.
--   2. A least-privilege `awcms_micro_app` role (NOT superuser, NOT owner) with
--      only DML grants. Migrations keep running as the privileged owner; the
--      application (and the integration tests) connect as `awcms_micro_app`, for
--      which the policies are enforced. Deployment activates this role's LOGIN +
--      password (docker-compose init script / operator step) — this migration
--      only creates it and grants it, never sets a password (a secret).
--
-- Fail-closed default: `awcms_micro_app` gets a bogus default `app.current_tenant_id`
-- so a query that reaches an RLS table WITHOUT `withTenant` (which issues
-- `SET LOCAL app.current_tenant_id`) matches the all-zero UUID — i.e. no real
-- tenant — returning zero rows instead of erroring on an unset GUC. Every app
-- code path already routes tenant-scoped access through `withTenant`; this is a
-- defense-in-depth backstop.

-- 1. FORCE RLS on every tenant-scoped table (all 31 that ENABLE it in 002-012).
ALTER TABLE awcms_micro_offices FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_physical_locations FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_tenant_settings FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_profile_identifiers FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_profile_channels FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_profile_addresses FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_profile_entity_links FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_profile_merge_requests FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_profile_audit_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_identities FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_tenant_users FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_sessions FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_roles FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_role_permissions FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_access_assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_abac_policies FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_abac_decision_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_sync_nodes FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_sync_outbox FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_sync_inbox FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_sync_push_batches FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_sync_aggregate_versions FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_sync_conflicts FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_object_sync_queue FORCE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_audit_events FORCE ROW LEVEL SECURITY;
-- Upstream AWCMS-Mini also FORCEs RLS on its four `awcms_mini_workflow_*`
-- tables here. AWCMS-Micro does not port the `workflow` module (ADR-0025), so
-- those tables do not exist and the statements are removed — an ALTER TABLE
-- against a missing table is a hard migration failure, not a no-op.
ALTER TABLE awcms_micro_idempotency_keys FORCE ROW LEVEL SECURITY;

-- 2. Least-privilege application role. Created NOLOGIN / passwordless here;
-- deployment activates LOGIN + a secret password (never committed). Idempotent:
-- if a deployment init script already created it (with LOGIN), this is a no-op.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'awcms_micro_app') THEN
    CREATE ROLE awcms_micro_app NOLOGIN;
  END IF;
END
$$;

-- Fail-closed default tenant context (see header). Overridden per-transaction by
-- `withTenant`'s `SET LOCAL app.current_tenant_id`.
ALTER ROLE awcms_micro_app SET app.current_tenant_id = '00000000-0000-0000-0000-000000000000';

-- DML grants (no DDL, no ownership). RLS enforces tenant isolation on top of
-- these on every tenant-scoped table; the RLS-free catalog tables
-- (permissions, tenants, setup_state, modules, schema_migrations) are shared by
-- design.
GRANT USAGE ON SCHEMA public TO awcms_micro_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO awcms_micro_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO awcms_micro_app;

-- Future tables/sequences created by the migration owner auto-grant to the app
-- role, so later migrations need no per-table grant boilerplate.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO awcms_micro_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO awcms_micro_app;
