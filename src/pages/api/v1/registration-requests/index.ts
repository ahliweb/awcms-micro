import type { APIRoute } from "astro";

import { fail, ok } from "../../../../modules/_shared/api-response";
import { getDatabaseClient } from "../../../../lib/database/client";
import { withTenant } from "../../../../lib/database/tenant-context";
import { hashSessionToken } from "../../../../lib/auth/session-token";
import {
  authorizeInTransaction,
  resolveAuthInputs
} from "../../../../modules/identity-access/application/access-guard";
import { listPendingRegistrations } from "../../../../modules/identity-access/application/self-registration";

const READ_GUARD = {
  moduleKey: "identity_access",
  activityCode: "user_management",
  action: "read" as const
};

/**
 * `GET /api/v1/registration-requests` (Issue: self-registration). Admin-only
 * (ABAC `identity_access.user_management.read`). Lists the tenant's PENDING
 * self-registration requests for the approval queue in
 * `/admin/access-users`. Not gated by AUTH_SELF_REGISTRATION_ENABLED so an
 * operator can always clear a backlog after disabling public registration.
 */
export const GET: APIRoute = async ({ request, cookies }) => {
  const { tenantId, token } = resolveAuthInputs(request, cookies);

  if (!tenantId) {
    return fail(400, "TENANT_REQUIRED", "Tenant header is required.");
  }

  if (!token) {
    return fail(401, "AUTH_REQUIRED", "Authentication required.");
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
      READ_GUARD
    );

    if (!auth.allowed) {
      return auth.denied;
    }

    const requests = await listPendingRegistrations(tx, tenantId);

    return ok({ requests });
  });
};
