import type { APIRoute } from "astro";

import { fail, ok } from "../../../../../modules/_shared/api-response";
import { getDatabaseClient } from "../../../../../lib/database/client";
import { withTenant } from "../../../../../lib/database/tenant-context";
import { hashSessionToken } from "../../../../../lib/auth/session-token";
import {
  authorizeInTransaction,
  resolveAuthInputs
} from "../../../../../modules/identity-access/application/access-guard";
import { recordAuditEvent } from "../../../../../modules/logging/application/audit-log";
import { rejectRegistrationRequest } from "../../../../../modules/identity-access/application/self-registration";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Rejecting only updates the request's status (no identity is created), so it
// is authorized as an update, not a create.
const REJECT_GUARD = {
  moduleKey: "identity_access",
  activityCode: "user_management",
  action: "update" as const
};

/**
 * `POST /api/v1/registration-requests/{id}/reject` (Issue: self-registration).
 * Admin-only (ABAC `identity_access.user_management.update`). Marks a pending
 * request `rejected`; no identity is ever created. Idempotent against an
 * already-reviewed request (acts only on a `pending` row → a repeat is a 404).
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

  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();

  return withTenant(sql, tenantId, async (tx) => {
    const auth = await authorizeInTransaction(
      tx,
      tenantId,
      tokenHash,
      now,
      REJECT_GUARD
    );

    if (!auth.allowed) {
      return auth.denied;
    }

    const result = await rejectRegistrationRequest(
      tx,
      tenantId,
      requestId,
      auth.context.tenantUserId,
      now
    );

    if (!result.ok) {
      return fail(
        404,
        "NOT_FOUND",
        "No pending registration request with that id."
      );
    }

    await recordAuditEvent(tx, {
      tenantId,
      actorTenantUserId: auth.context.tenantUserId,
      moduleKey: "identity_access",
      action: "user_registration_rejected",
      resourceType: "registration_request",
      resourceId: requestId,
      severity: "info",
      message: "Self-registration request rejected.",
      attributes: {
        requestId,
        loginIdentifier: result.loginIdentifier
      }
    });

    return ok({ rejected: true });
  });
};
