import type { APIRoute } from "astro";

import {
  fail,
  jsonResponse,
  ok
} from "../../../../../modules/_shared/api-response";
import { getDatabaseClient } from "../../../../../lib/database/client";
import { withTenant } from "../../../../../lib/database/tenant-context";
import { hashSessionToken } from "../../../../../lib/auth/session-token";
import {
  authorizeInTransaction,
  resolveAuthInputs
} from "../../../../../modules/identity-access/application/access-guard";
import { recordAuditEvent } from "../../../../../modules/logging/application/audit-log";
import {
  computeRequestHash,
  findIdempotencyRecord,
  saveIdempotencyRecord
} from "../../../../../modules/_shared/idempotency";
import { resetSidebarConfig } from "../../../../../modules/module-management/application/sidebar-menu-config";
import {
  MODULE_MANAGEMENT_MODULE_KEY,
  NAVIGATION_ACTIVITY_CODE,
  NAVIGATION_CONFIGURE_ACTION
} from "../../../../../modules/module-management/domain/sidebar-menu";

/**
 * `POST /api/v1/navigation/sidebar-config/reset` (feat/sidebar-menu-management)
 * — delete ALL of this tenant's sidebar override rows, back to the pure code
 * default. High-risk `configure`: Idempotency-Key'd + audited, tenant-scoped
 * (`withTenant` + RLS FORCE), same posture as the `PUT` save.
 */

const CONFIGURE_GUARD = {
  moduleKey: MODULE_MANAGEMENT_MODULE_KEY,
  activityCode: NAVIGATION_ACTIVITY_CODE,
  action: NAVIGATION_CONFIGURE_ACTION as "configure"
};

const IDEMPOTENCY_SCOPE = "module_management_sidebar_config_reset";

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const { tenantId, token } = resolveAuthInputs(request, cookies);

  if (!tenantId) {
    return fail(400, "TENANT_REQUIRED", "Tenant header is required.");
  }

  if (!token) {
    return fail(401, "AUTH_REQUIRED", "Authentication required.");
  }

  const idempotencyKey = request.headers.get("idempotency-key");

  if (!idempotencyKey) {
    return fail(
      400,
      "IDEMPOTENCY_REQUIRED",
      "Idempotency-Key header is required."
    );
  }

  const requestHash = computeRequestHash({ action: "reset" });
  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();
  const correlationId = locals.correlationId;

  return withTenant(sql, tenantId, async (tx) => {
    const auth = await authorizeInTransaction(
      tx,
      tenantId,
      tokenHash,
      now,
      CONFIGURE_GUARD
    );

    if (!auth.allowed) {
      return auth.denied;
    }

    const existingIdempotency = await findIdempotencyRecord(
      tx,
      tenantId,
      IDEMPOTENCY_SCOPE,
      idempotencyKey
    );

    if (existingIdempotency) {
      if (existingIdempotency.requestHash !== requestHash) {
        return fail(
          409,
          "IDEMPOTENCY_CONFLICT",
          "Idempotency-Key was already used with a different request."
        );
      }

      return jsonResponse(existingIdempotency.responseBody, {
        status: existingIdempotency.responseStatus
      });
    }

    const result = await resetSidebarConfig(tx, tenantId, async (auditTx) => {
      await recordAuditEvent(auditTx, {
        tenantId,
        actorTenantUserId: auth.context.tenantUserId,
        moduleKey: MODULE_MANAGEMENT_MODULE_KEY,
        action: "module_management.navigation.configure",
        resourceType: "sidebar_menu_config",
        resourceId: tenantId,
        severity: "info",
        message: "Tenant sidebar menu layout reset to default.",
        attributes: { reset: true },
        correlationId
      });
    });

    const successResponse = ok(result);
    const successBody = await successResponse.clone().json();

    await saveIdempotencyRecord(
      tx,
      tenantId,
      IDEMPOTENCY_SCOPE,
      idempotencyKey,
      requestHash,
      200,
      successBody
    );

    return successResponse;
  });
};
