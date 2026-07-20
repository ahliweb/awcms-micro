import type { APIRoute } from "astro";

import { hashSessionToken } from "../../../../../../../lib/auth/session-token";
import { getDatabaseClient } from "../../../../../../../lib/database/client";
import { withTenant } from "../../../../../../../lib/database/tenant-context";
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
import { dispatchCampaign } from "../../../../../../../modules/newsletter/application/campaign-service";

/**
 * `POST /api/v1/newsletter/admin/campaigns/{id}/dispatch` — freeze the audience
 * snapshot and enqueue per-recipient sends (Issue #272, ADR-0033). The HIGHEST-risk
 * mutation: ABAC-guarded (`newsletter.campaigns.send`), Idempotency-Key REQUIRED
 * (double-submit safe), audited; publishes `newsletter.campaign.dispatched`. The
 * actual provider send happens in the `newsletter:dispatch` job / email outbox
 * consumer, OUTSIDE any DB transaction (ADR-0006).
 */
const GUARD = {
  moduleKey: NEWSLETTER_MODULE_KEY,
  activityCode: NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
  action: "send" as const
};
const IDEMPOTENCY_SCOPE = "newsletter_campaign_dispatch";

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

  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();
  const correlationId = locals.correlationId;
  const requestHash = computeRequestHash({ campaignId });

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

    const result = await dispatchCampaign(tx, tenantId, campaignId, {
      correlationId
    });
    if (!result.ok) {
      if (result.reason === "not_found")
        return fail(404, "NOT_FOUND", "Campaign not found.");
      return fail(
        409,
        "ILLEGAL_TRANSITION",
        "This campaign cannot be dispatched from its current status."
      );
    }

    await recordAuditEvent(tx, {
      tenantId,
      actorTenantUserId: auth.context.tenantUserId,
      moduleKey: NEWSLETTER_MODULE_KEY,
      action: "newsletter.campaigns.dispatch",
      resourceType: "newsletter_campaign",
      resourceId: campaignId,
      severity: "warning",
      message:
        "Newsletter campaign/digest dispatched (audience frozen, sends enqueued).",
      attributes: {
        audienceSnapshotId: result.audienceSnapshotId,
        audienceCount: result.audienceCount
      },
      correlationId
    });

    const successResponse = ok({
      campaignId,
      status: result.status,
      audienceCount: result.audienceCount
    });
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
