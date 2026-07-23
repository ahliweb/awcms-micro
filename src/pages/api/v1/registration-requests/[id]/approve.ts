import type { APIRoute } from "astro";

import { fail, ok } from "../../../../../modules/_shared/api-response";
import { getDatabaseClient } from "../../../../../lib/database/client";
import { withTenant } from "../../../../../lib/database/tenant-context";
import { hashSessionToken } from "../../../../../lib/auth/session-token";
import {
  bodyTooLargeResponse,
  readJsonBody
} from "../../../../../lib/security/request-body-limit";
import {
  authorizeInTransaction,
  resolveAuthInputs
} from "../../../../../modules/identity-access/application/access-guard";
import { recordAuditEvent } from "../../../../../modules/logging/application/audit-log";
import { approveRegistrationRequest } from "../../../../../modules/identity-access/application/self-registration";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Approving materializes a real user (profile/identity/tenant_user), so it is
// authorized exactly like creating one via POST /api/v1/users.
const APPROVE_GUARD = {
  moduleKey: "identity_access",
  activityCode: "user_management",
  action: "create" as const
};

/** Parses an optional `roleIds` array of UUID strings from the body. */
function parseRoleIds(body: unknown): string[] | null {
  const record = (body ?? {}) as Record<string, unknown>;
  if (record.roleIds === undefined || record.roleIds === null) {
    return [];
  }
  if (!Array.isArray(record.roleIds)) {
    return null;
  }
  const ids: string[] = [];
  for (const entry of record.roleIds) {
    if (typeof entry !== "string" || !UUID_PATTERN.test(entry.trim())) {
      return null;
    }
    ids.push(entry.trim());
  }
  return Array.from(new Set(ids));
}

/**
 * `POST /api/v1/registration-requests/{id}/approve` (Issue: self-registration).
 * Admin-only (ABAC `identity_access.user_management.create`). Materializes the
 * pending request into an active profile/identity/tenant_user — the single
 * point where a self-registered user becomes able to log in — and optionally
 * assigns roles (`roleIds`, validated to exist for the tenant, exactly like
 * POST /users). Idempotent against an already-reviewed request (acts only on a
 * `pending` row → a repeat approve is a 404).
 */
export const POST: APIRoute = async ({ request, cookies, params }) => {
  const { tenantId, token } = resolveAuthInputs(request, cookies);

  if (!tenantId) {
    return fail(400, "TENANT_REQUIRED", "Tenant header is required.");
  }

  if (!token) {
    return fail(401, "AUTH_REQUIRED", "Authentication required.");
  }

  const requestId = params.id;
  if (!requestId || !UUID_PATTERN.test(requestId)) {
    return fail(400, "VALIDATION_ERROR", "A valid request id is required.");
  }

  const bodyRead = await readJsonBody(request);

  if (bodyRead.tooLarge) {
    return bodyTooLargeResponse(bodyRead.limitBytes);
  }

  const roleIds = parseRoleIds(bodyRead.value);
  if (roleIds === null) {
    return fail(400, "VALIDATION_ERROR", "roleIds must be an array of UUIDs.");
  }

  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();

  return withTenant(sql, tenantId, async (tx) => {
    const auth = await authorizeInTransaction(
      tx,
      tenantId,
      tokenHash,
      now,
      APPROVE_GUARD
    );

    if (!auth.allowed) {
      return auth.denied;
    }

    const result = await approveRegistrationRequest(
      tx,
      tenantId,
      requestId,
      auth.context.tenantUserId,
      roleIds,
      now
    );

    if (!result.ok) {
      if (result.reason === "not_found") {
        return fail(
          404,
          "NOT_FOUND",
          "No pending registration request with that id."
        );
      }
      if (result.reason === "identifier_taken") {
        return fail(
          409,
          "RESOURCE_CONFLICT",
          "A user with that login identifier already exists."
        );
      }
      return fail(400, "VALIDATION_ERROR", "One or more roleIds are unknown.");
    }

    await recordAuditEvent(tx, {
      tenantId,
      actorTenantUserId: auth.context.tenantUserId,
      moduleKey: "identity_access",
      action: "user_registration_approved",
      resourceType: "tenant_user",
      resourceId: result.tenantUserId,
      severity: "warning",
      message: "Self-registration request approved; tenant user created.",
      attributes: {
        requestId,
        loginIdentifier: result.loginIdentifier,
        roleIds
      }
    });

    return ok({
      approved: true,
      tenantUserId: result.tenantUserId,
      identityId: result.identityId,
      profileId: result.profileId
    });
  });
};
