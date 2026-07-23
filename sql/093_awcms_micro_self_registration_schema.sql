-- Self-registration (admin-approval-gated). A public visitor submits a
-- registration request via `POST /api/v1/auth/register`; the request lands
-- here as `status='pending'` and is NOT a login-eligible identity yet. An
-- admin later approves it from `/admin/access-users`, which materializes the
-- real profile/identity/tenant_user rows (`sql/004`) — only then can the user
-- log in (`evaluateLoginAttempt` needs identity.status='active' AND
-- tenant_user.status='active', neither of which exists until approval).
--
-- WHY A SEPARATE TABLE (not a pending identity): keeping unapproved requests
-- out of `awcms_micro_identities` means public spam never collides with the
-- `(tenant_id, login_identifier)` uniqueness of real accounts, never pollutes
-- the identity table, and can be rejected/pruned without touching auth state.
-- The password is stored already argon2id-hashed (same at-rest posture as
-- `awcms_micro_identities.password_hash`) so approval needs no re-entry.
--
-- FORCE RLS + tenant-isolation policy per the post-013 convention (mirrors
-- `sql/022` password-reset tokens).
CREATE TABLE IF NOT EXISTS awcms_micro_registration_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  login_identifier text NOT NULL,
  password_hash text NOT NULL,
  display_name text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES awcms_micro_tenant_users (id),
  created_identity_id uuid REFERENCES awcms_micro_identities (id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Admin list path: WHERE tenant_id = ? AND status = 'pending'
-- ORDER BY requested_at.
CREATE INDEX IF NOT EXISTS awcms_micro_registration_requests_pending_idx
  ON awcms_micro_registration_requests (tenant_id, status, requested_at);

-- At most one OUTSTANDING request per identifier per tenant. A second submit
-- for the same identifier while one is still pending hits this constraint;
-- the endpoint catches it and still returns the generic success response
-- (anti-enumeration — the caller cannot tell a duplicate from a fresh
-- request). Approved/rejected rows are excluded so a rejected applicant can
-- re-apply later.
CREATE UNIQUE INDEX IF NOT EXISTS awcms_micro_registration_requests_pending_key
  ON awcms_micro_registration_requests (tenant_id, login_identifier)
  WHERE status = 'pending';

ALTER TABLE awcms_micro_registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_registration_requests FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_registration_requests_tenant_isolation
  ON awcms_micro_registration_requests
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
