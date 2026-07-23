/**
 * Self-registration application service (admin-approval-gated). Mirrors
 * `password-reset.ts`'s posture: every public-facing path is
 * anti-enumeration by construction (returns the SAME shape whether or not the
 * identifier is already taken / a request is already pending), and the caller
 * (route) always responds generically + records the real outcome only in the
 * internal audit trail.
 *
 * Trust model:
 * - `submitRegistrationRequest` is reachable by anonymous public callers. It
 *   NEVER creates a login-eligible identity — only a `pending` row in
 *   `awcms_micro_registration_requests`. It accepts NO privilege input.
 * - `approve`/`reject`/`listPending` are reachable only behind the admin ABAC
 *   guard (`identity_access.user_management.{read,create,update}`). Approval is
 *   the ONLY path that materializes a real profile/identity/tenant_user and is
 *   therefore the single point where a self-registered user becomes able to
 *   log in (`evaluateLoginAttempt` needs both rows `active`).
 *
 * The password is already argon2id-hashed by the caller (CPU-bound work kept
 * out of the transaction, same as `users/index.ts`), so it is stored and later
 * copied into the identity without re-entry.
 */
export type SubmitOutcome = {
  /** Whether a fresh pending request row was actually written. */
  created: boolean;
  /**
   * Internal-only reason — for the audit event, NEVER the HTTP response
   * (that stays generic to prevent account/tenant enumeration).
   */
  reason:
    "created" | "tenant_inactive" | "identifier_taken" | "duplicate_pending";
};

export type PendingRegistration = {
  id: string;
  loginIdentifier: string;
  displayName: string | null;
  requestedAt: string;
};

export type ApproveOutcome =
  | {
      ok: true;
      identityId: string;
      tenantUserId: string;
      profileId: string;
      loginIdentifier: string;
    }
  | { ok: false; reason: "not_found" | "identifier_taken" | "unknown_role" };

export type RejectOutcome =
  { ok: true; loginIdentifier: string } | { ok: false; reason: "not_found" };

/**
 * Records a public registration request as `pending`. Anti-enumeration: an
 * inactive tenant, an already-taken identifier, or an already-pending request
 * all resolve to `created:false` with a distinct internal reason — the caller
 * returns the same generic success either way.
 */
export async function submitRegistrationRequest(
  tx: Bun.SQL,
  tenantId: string,
  input: { loginIdentifier: string; displayName: string },
  passwordHash: string
): Promise<SubmitOutcome> {
  const tenantRows = await tx`
    SELECT status FROM awcms_micro_tenants WHERE id = ${tenantId}
  `;
  const tenantStatus = (tenantRows[0]?.status as string | undefined) ?? null;
  if (tenantStatus !== "active") {
    return { created: false, reason: "tenant_inactive" };
  }

  // An account already exists → do not create a request, but DO NOT leak that
  // (the route responds generically). Recorded as an internal reason only.
  const existing = await tx`
    SELECT 1 FROM awcms_micro_identities
    WHERE tenant_id = ${tenantId} AND login_identifier = ${input.loginIdentifier}
  `;
  if (existing[0]) {
    return { created: false, reason: "identifier_taken" };
  }

  // At most one outstanding request per identifier (partial unique index).
  // ON CONFLICT on that predicate → no row inserted → treat as duplicate.
  const inserted = await tx`
    INSERT INTO awcms_micro_registration_requests
      (tenant_id, login_identifier, password_hash, display_name)
    VALUES (${tenantId}, ${input.loginIdentifier}, ${passwordHash}, ${input.displayName})
    ON CONFLICT (tenant_id, login_identifier) WHERE status = 'pending'
      DO NOTHING
    RETURNING id
  `;

  if (!inserted[0]) {
    return { created: false, reason: "duplicate_pending" };
  }

  return { created: true, reason: "created" };
}

/** Pending requests for the admin approval queue, oldest first. */
export async function listPendingRegistrations(
  tx: Bun.SQL,
  tenantId: string
): Promise<PendingRegistration[]> {
  const rows = (await tx`
    SELECT id, login_identifier, display_name, requested_at
    FROM awcms_micro_registration_requests
    WHERE tenant_id = ${tenantId} AND status = 'pending'
    ORDER BY requested_at ASC
  `) as Array<{
    id: string;
    login_identifier: string;
    display_name: string | null;
    requested_at: string | Date;
  }>;

  return rows.map((row) => ({
    id: row.id,
    loginIdentifier: row.login_identifier,
    displayName: row.display_name,
    requestedAt:
      row.requested_at instanceof Date
        ? row.requested_at.toISOString()
        : String(row.requested_at)
  }));
}

/**
 * Approves a pending request: materializes profile → identity → tenant_user
 * (both `active`, so the user can now log in) and optionally assigns roles,
 * then marks the request approved. Idempotency-safe against a request already
 * reviewed (only a `pending` row is acted on). `roleIds` are validated to
 * exist for the tenant, exactly like `POST /api/v1/users`.
 */
export async function approveRegistrationRequest(
  tx: Bun.SQL,
  tenantId: string,
  requestId: string,
  reviewerTenantUserId: string,
  roleIds: string[],
  now: Date
): Promise<ApproveOutcome> {
  const requestRows = (await tx`
    SELECT id, login_identifier, password_hash, display_name
    FROM awcms_micro_registration_requests
    WHERE tenant_id = ${tenantId} AND id = ${requestId} AND status = 'pending'
    FOR UPDATE
  `) as Array<{
    id: string;
    login_identifier: string;
    password_hash: string;
    display_name: string | null;
  }>;

  const req = requestRows[0];
  if (!req) {
    return { ok: false, reason: "not_found" };
  }

  // Guard the identity uniqueness: an admin may have created this user
  // manually in the meantime.
  const duplicate = await tx`
    SELECT 1 FROM awcms_micro_identities
    WHERE tenant_id = ${tenantId} AND login_identifier = ${req.login_identifier}
  `;
  if (duplicate[0]) {
    return { ok: false, reason: "identifier_taken" };
  }

  if (roleIds.length > 0) {
    const foundRoles = (await tx`
      SELECT id FROM awcms_micro_roles
      WHERE tenant_id = ${tenantId} AND id = ANY(${tx.array(roleIds, "uuid")})
        AND deleted_at IS NULL
    `) as { id: string }[];
    if (foundRoles.length !== roleIds.length) {
      return { ok: false, reason: "unknown_role" };
    }
  }

  const profileRows = await tx`
    INSERT INTO awcms_micro_profiles (tenant_id, profile_type, display_name)
    VALUES (${tenantId}, 'person', ${req.display_name})
    RETURNING id
  `;
  const profileId = profileRows[0]!.id as string;

  const identityRows = await tx`
    INSERT INTO awcms_micro_identities (tenant_id, profile_id, login_identifier, password_hash)
    VALUES (${tenantId}, ${profileId}, ${req.login_identifier}, ${req.password_hash})
    RETURNING id
  `;
  const identityId = identityRows[0]!.id as string;

  const tenantUserRows = await tx`
    INSERT INTO awcms_micro_tenant_users (tenant_id, identity_id)
    VALUES (${tenantId}, ${identityId})
    RETURNING id
  `;
  const tenantUserId = tenantUserRows[0]!.id as string;

  if (roleIds.length > 0) {
    await tx`
      INSERT INTO awcms_micro_access_assignments (tenant_id, tenant_user_id, role_id, assigned_by)
      SELECT ${tenantId}, ${tenantUserId}, role_id, ${reviewerTenantUserId}
      FROM unnest(${tx.array(roleIds, "uuid")}) AS role_id
      ON CONFLICT (tenant_id, tenant_user_id, role_id) DO NOTHING
    `;
  }

  await tx`
    UPDATE awcms_micro_registration_requests
    SET status = 'approved',
        reviewed_at = ${now},
        reviewed_by = ${reviewerTenantUserId},
        created_identity_id = ${identityId},
        updated_at = ${now}
    WHERE tenant_id = ${tenantId} AND id = ${requestId}
  `;

  return {
    ok: true,
    identityId,
    tenantUserId,
    profileId,
    loginIdentifier: req.login_identifier
  };
}

/** Rejects a pending request (no identity is ever created). */
export async function rejectRegistrationRequest(
  tx: Bun.SQL,
  tenantId: string,
  requestId: string,
  reviewerTenantUserId: string,
  now: Date
): Promise<RejectOutcome> {
  const rows = (await tx`
    UPDATE awcms_micro_registration_requests
    SET status = 'rejected',
        reviewed_at = ${now},
        reviewed_by = ${reviewerTenantUserId},
        updated_at = ${now}
    WHERE tenant_id = ${tenantId} AND id = ${requestId} AND status = 'pending'
    RETURNING login_identifier
  `) as Array<{ login_identifier: string }>;

  if (!rows[0]) {
    return { ok: false, reason: "not_found" };
  }

  return { ok: true, loginIdentifier: rows[0].login_identifier };
}
