/**
 * Own-account overview — the currently logged-in identity plus its linked
 * profile, backing the "My Profile" screen (`/admin/profile`).
 *
 * Read-only and strictly self-scoped: the query is filtered to the caller's
 * OWN identity id inside the tenant RLS transaction, so it can only ever
 * return the caller's own row. This is deliberately NOT gated on any
 * `profile_identity.profile_management.*` permission the way the CRM party
 * governance screens under `/admin/profile-identity` are — a user reading
 * their own account is not the same authorization question as reading the
 * tenant's whole party directory. `identity.profile_id` is `NOT NULL`
 * (migration `awcms_micro_identities`), so an active session always has a
 * profile row to join.
 */
export type AccountOverview = {
  identityId: string;
  profileId: string;
  loginIdentifier: string;
  status: string;
  lastLoginAt: Date | null;
  displayName: string;
  profileType: string;
  legalName: string | null;
  verificationStatus: string;
};

type AccountOverviewRow = {
  identity_id: string;
  profile_id: string;
  login_identifier: string;
  status: string;
  last_login_at: Date | null;
  display_name: string;
  profile_type: string;
  legal_name: string | null;
  verification_status: string;
};

export async function fetchAccountOverview(
  tx: Bun.SQL,
  tenantId: string,
  identityId: string
): Promise<AccountOverview | null> {
  const rows = (await tx`
    SELECT
      i.id AS identity_id,
      i.profile_id,
      i.login_identifier,
      i.status,
      i.last_login_at,
      p.display_name,
      p.profile_type,
      p.legal_name,
      p.verification_status
    FROM awcms_micro_identities i
    JOIN awcms_micro_profiles p
      ON p.id = i.profile_id AND p.tenant_id = i.tenant_id
    WHERE i.tenant_id = ${tenantId} AND i.id = ${identityId}
  `) as AccountOverviewRow[];

  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    identityId: row.identity_id,
    profileId: row.profile_id,
    loginIdentifier: row.login_identifier,
    status: row.status,
    lastLoginAt: row.last_login_at,
    displayName: row.display_name,
    profileType: row.profile_type,
    legalName: row.legal_name,
    verificationStatus: row.verification_status
  };
}
