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
  bodyTooLargeResponse,
  readJsonBody
} from "../../../../../lib/security/request-body-limit";
import {
  computeRequestHash,
  findIdempotencyRecord,
  saveIdempotencyRecord
} from "../../../../../modules/_shared/idempotency";
import { listModules } from "../../../../../modules";
import {
  buildDefaultSidebarModel,
  fetchSidebarConfigForAdmin,
  saveSidebarConfig,
  validateSidebarMenuInput
} from "../../../../../modules/module-management/application/sidebar-menu-config";
import {
  MODULE_MANAGEMENT_MODULE_KEY,
  NAVIGATION_ACTIVITY_CODE,
  NAVIGATION_CONFIGURE_ACTION,
  NAVIGATION_READ_ACTION
} from "../../../../../modules/module-management/domain/sidebar-menu";

/**
 * `GET`/`PUT /api/v1/navigation/sidebar-config` (feat/sidebar-menu-management)
 * — the tenant's admin sidebar layout: grouping (type -> module -> items),
 * order, visibility, and label overrides.
 *
 * `GET` returns the FULL editable model (every entry + override state, nothing
 * permission-filtered) gated on `module_management.navigation.read`.
 *
 * `PUT` is high-risk (`configure`): it rewrites how every admin sees the
 * sidebar, so it requires an `Idempotency-Key` and is audited on every write.
 * Both verbs are ABAC-gated and tenant-scoped (`withTenant` + RLS FORCE on the
 * two override tables), so tenant A can never read or change tenant B's config.
 */

const READ_GUARD = {
  moduleKey: MODULE_MANAGEMENT_MODULE_KEY,
  activityCode: NAVIGATION_ACTIVITY_CODE,
  action: NAVIGATION_READ_ACTION as "read"
};

const CONFIGURE_GUARD = {
  moduleKey: MODULE_MANAGEMENT_MODULE_KEY,
  activityCode: NAVIGATION_ACTIVITY_CODE,
  action: NAVIGATION_CONFIGURE_ACTION as "configure"
};

const IDEMPOTENCY_SCOPE = "module_management_sidebar_config_save";

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

    const config = await fetchSidebarConfigForAdmin(tx, tenantId);
    return ok(config);
  });
};

export const PUT: APIRoute = async ({ request, cookies, locals }) => {
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

  const bodyRead = await readJsonBody(request);

  if (bodyRead.tooLarge) {
    return bodyTooLargeResponse(bodyRead.limitBytes);
  }

  const validation = validateSidebarMenuInput(
    bodyRead.value,
    buildDefaultSidebarModel(listModules())
  );

  if (!validation.ok) {
    return fail(
      400,
      "VALIDATION_ERROR",
      "Sidebar menu configuration is invalid.",
      {},
      validation.errors
    );
  }

  const next = validation.value;
  const requestHash = computeRequestHash(next);
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

    const saved = await saveSidebarConfig(
      tx,
      tenantId,
      next,
      async (auditTx, detail) => {
        await recordAuditEvent(auditTx, {
          tenantId,
          actorTenantUserId: auth.context.tenantUserId,
          moduleKey: MODULE_MANAGEMENT_MODULE_KEY,
          action: "module_management.navigation.configure",
          resourceType: "sidebar_menu_config",
          resourceId: tenantId,
          severity: "info",
          message: "Tenant sidebar menu layout updated.",
          attributes: {
            typeCount: detail.typeCount,
            itemCount: detail.itemCount
          },
          correlationId
        });
      }
    );

    const successResponse = ok(saved);
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
