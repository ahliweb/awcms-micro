import type { APIRoute } from "astro";

import { hashSessionToken } from "../../../../../../../lib/auth/session-token";
import { getDatabaseClient } from "../../../../../../../lib/database/client";
import { withTenant } from "../../../../../../../lib/database/tenant-context";
import {
  bodyTooLargeResponse,
  readJsonBody
} from "../../../../../../../lib/security/request-body-limit";
import {
  fail,
  jsonResponse,
  ok
} from "../../../../../../../modules/_shared/api-response";
import {
  computeRequestHash,
  findIdempotencyRecord,
  saveIdempotencyRecord
} from "../../../../../../../modules/_shared/idempotency";
import {
  authorizeInTransaction,
  resolveAuthInputs
} from "../../../../../../../modules/identity-access/application/access-guard";
import { recordAuditEvent } from "../../../../../../../modules/logging/application/audit-log";
import {
  NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
  NEWSLETTER_MODULE_KEY
} from "../../../../../../../modules/newsletter/domain/newsletter-permissions";
import { scheduleCampaign } from "../../../../../../../modules/newsletter/application/campaign-service";

/**
 * `POST /api/v1/newsletter/admin/campaigns/{id}/schedule` — move a draft into the
 * scheduled state (Issue #272, ADR-0033). ABAC-guarded (`newsletter.campaigns.schedule`).
 * Idempotency-Key REQUIRED; audited; publishes `newsletter.campaign.scheduled`.
 */
const GUARD = {
  moduleKey: NEWSLETTER_MODULE_KEY,
  activityCode: NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
  action: "schedule" as const
};
const IDEMPOTENCY_SCOPE = "newsletter_campaign_schedule";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const POST: APIRoute = async ({ request, cookies, params, locals }) => {
  const campaignId = params.id;
  if (!campaignId)
    return fail(400, "VALIDATION_ERROR", "Campaign id is required.");

  const { tenantId, token } = resolveAuthInputs(request, cookies);
  if (!tenantId)
    return fail(400, "TENANT_REQUIRED", "Tenant header is required.");
  if (!token) return fail(401, "AUTH_REQUIRED", "Authentication required.");

  const idempotencyKey = request.headers.get("idempotency-key");
  if (!idempotencyKey)
    return fail(
      400,
      "IDEMPOTENCY_REQUIRED",
      "Idempotency-Key header is required."
    );

  const bodyRead = await readJsonBody(request);
  if (bodyRead.tooLarge) return bodyTooLargeResponse(bodyRead.limitBytes);
  const body = bodyRead.value;
  const scheduledAtRaw =
    isRecord(body) && typeof body.scheduledAt === "string"
      ? body.scheduledAt
      : null;
  const scheduledAt = scheduledAtRaw ? new Date(scheduledAtRaw) : null;
  if (scheduledAt && !Number.isFinite(scheduledAt.getTime())) {
    return fail(
      400,
      "VALIDATION_ERROR",
      "`scheduledAt` must be an ISO datetime."
    );
  }

  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();
  const correlationId = locals.correlationId;
  const requestHash = computeRequestHash({
    campaignId,
    scheduledAt: scheduledAtRaw
  });

  return withTenant(sql, tenantId, async (tx) => {
    const auth = await authorizeInTransaction(
      tx,
      tenantId,
      tokenHash,
      now,
      GUARD
    );
    if (!auth.allowed) return auth.denied;

    const existing = await findIdempotencyRecord(
      tx,
      tenantId,
      IDEMPOTENCY_SCOPE,
      idempotencyKey
    );
    if (existing) {
      if (existing.requestHash !== requestHash) {
        return fail(
          409,
          "IDEMPOTENCY_CONFLICT",
          "Idempotency-Key was already used with a different request."
        );
      }
      return jsonResponse(existing.responseBody, {
        status: existing.responseStatus
      });
    }

    const result = await scheduleCampaign(tx, tenantId, campaignId, {
      scheduledAt,
      correlationId
    });
    if (!result.ok) {
      if (result.reason === "not_found")
        return fail(404, "NOT_FOUND", "Campaign not found.");
      return fail(
        409,
        "ILLEGAL_TRANSITION",
        "This campaign cannot be scheduled from its current status."
      );
    }

    await recordAuditEvent(tx, {
      tenantId,
      actorTenantUserId: auth.context.tenantUserId,
      moduleKey: NEWSLETTER_MODULE_KEY,
      action: "newsletter.campaigns.schedule",
      resourceType: "newsletter_campaign",
      resourceId: campaignId,
      severity: "info",
      message: "Newsletter campaign/digest scheduled.",
      attributes: { scheduledAt: scheduledAtRaw },
      correlationId
    });

    const successResponse = ok({ campaignId, status: result.status });
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
