import type { APIRoute } from "astro";

import { hashSessionToken } from "../../../../../lib/auth/session-token";
import { getDatabaseClient } from "../../../../../lib/database/client";
import { withTenant } from "../../../../../lib/database/tenant-context";
import {
  bodyTooLargeResponse,
  readJsonBody
} from "../../../../../lib/security/request-body-limit";
import { fail, ok } from "../../../../../modules/_shared/api-response";
import {
  authorizeInTransaction,
  resolveAuthInputs
} from "../../../../../modules/identity-access/application/access-guard";
import { recordAuditEvent } from "../../../../../modules/logging/application/audit-log";
import {
  NEWSLETTER_MODULE_KEY,
  NEWSLETTER_SUPPRESSION_ACTIVITY_CODE
} from "../../../../../modules/newsletter/domain/newsletter-permissions";
import {
  deriveSubscriberEmailParts,
  looksLikeEmail
} from "../../../../../modules/newsletter/domain/subscriber-identity";
import {
  listSuppressions,
  recordSuppression,
  type SuppressionReason
} from "../../../../../modules/newsletter/application/suppression-directory";

/**
 * `GET/POST /api/v1/newsletter/admin/suppression` — read the suppression deny-list
 * / add a manual suppression (Issue #272, ADR-0033). ABAC-guarded
 * (`newsletter.suppression.read` / `.create`). A manual add is high-risk + audited.
 * The admin-supplied email is hashed here — never stored raw.
 */
const READ_GUARD = {
  moduleKey: NEWSLETTER_MODULE_KEY,
  activityCode: NEWSLETTER_SUPPRESSION_ACTIVITY_CODE,
  action: "read" as const
};
const CREATE_GUARD = {
  moduleKey: NEWSLETTER_MODULE_KEY,
  activityCode: NEWSLETTER_SUPPRESSION_ACTIVITY_CODE,
  action: "create" as const
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const GET: APIRoute = async ({ request, cookies, url }) => {
  const { tenantId, token } = resolveAuthInputs(request, cookies);
  if (!tenantId)
    return fail(400, "TENANT_REQUIRED", "Tenant header is required.");
  if (!token) return fail(401, "AUTH_REQUIRED", "Authentication required.");

  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();
  const cursor = url.searchParams.get("cursor");

  return withTenant(sql, tenantId, async (tx) => {
    const auth = await authorizeInTransaction(
      tx,
      tenantId,
      tokenHash,
      now,
      READ_GUARD
    );
    if (!auth.allowed) return auth.denied;
    return ok(
      await listSuppressions(tx, tenantId, { beforeOccurredAt: cursor })
    );
  });
};

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const { tenantId, token } = resolveAuthInputs(request, cookies);
  if (!tenantId)
    return fail(400, "TENANT_REQUIRED", "Tenant header is required.");
  if (!token) return fail(401, "AUTH_REQUIRED", "Authentication required.");

  const bodyRead = await readJsonBody(request);
  if (bodyRead.tooLarge) return bodyTooLargeResponse(bodyRead.limitBytes);
  const body = bodyRead.value;
  if (!isRecord(body) || !looksLikeEmail(body.email)) {
    return fail(400, "VALIDATION_ERROR", "A valid `email` is required.");
  }
  const reason: SuppressionReason =
    body.reason === "bounce" ||
    body.reason === "complaint" ||
    body.reason === "unsubscribe"
      ? body.reason
      : "manual";

  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();
  const correlationId = locals.correlationId;
  const parts = deriveSubscriberEmailParts(body.email as string);

  return withTenant(sql, tenantId, async (tx) => {
    const auth = await authorizeInTransaction(
      tx,
      tenantId,
      tokenHash,
      now,
      CREATE_GUARD
    );
    if (!auth.allowed) return auth.denied;

    await recordSuppression(tx, tenantId, {
      emailHash: parts.hash,
      reason,
      source: "manual_admin",
      evidence:
        isRecord(body) && typeof body.evidence === "string"
          ? body.evidence.slice(0, 2000)
          : null
    });

    await recordAuditEvent(tx, {
      tenantId,
      actorTenantUserId: auth.context.tenantUserId,
      moduleKey: NEWSLETTER_MODULE_KEY,
      action: "newsletter.suppression.create",
      resourceType: "newsletter_suppression",
      resourceId: parts.hash,
      severity: "warning",
      message: "Manual suppression added.",
      attributes: { reason, emailMasked: parts.masked },
      correlationId
    });

    return ok({ status: "suppressed", emailMasked: parts.masked });
  });
};
