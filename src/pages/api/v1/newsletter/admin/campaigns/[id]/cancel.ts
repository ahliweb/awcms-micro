import type { APIRoute } from "astro";

import { hashSessionToken } from "../../../../../../../lib/auth/session-token";
import { getDatabaseClient } from "../../../../../../../lib/database/client";
import { withTenant } from "../../../../../../../lib/database/tenant-context";
import { fail, ok } from "../../../../../../../modules/_shared/api-response";
import {
  authorizeInTransaction,
  resolveAuthInputs
} from "../../../../../../../modules/identity-access/application/access-guard";
import { recordAuditEvent } from "../../../../../../../modules/logging/application/audit-log";
import {
  NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
  NEWSLETTER_MODULE_KEY
} from "../../../../../../../modules/newsletter/domain/newsletter-permissions";
import { cancelCampaign } from "../../../../../../../modules/newsletter/application/campaign-service";

/**
 * `POST /api/v1/newsletter/admin/campaigns/{id}/cancel` — cancel a scheduled or
 * dispatching campaign/digest (Issue #272, ADR-0033). ABAC-guarded
 * (`newsletter.campaigns.cancel`), audited.
 */
const GUARD = {
  moduleKey: NEWSLETTER_MODULE_KEY,
  activityCode: NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
  action: "cancel" as const
};

export const POST: APIRoute = async ({ request, cookies, params, locals }) => {
  const campaignId = params.id;
  if (!campaignId)
    return fail(400, "VALIDATION_ERROR", "Campaign id is required.");

  const { tenantId, token } = resolveAuthInputs(request, cookies);
  if (!tenantId)
    return fail(400, "TENANT_REQUIRED", "Tenant header is required.");
  if (!token) return fail(401, "AUTH_REQUIRED", "Authentication required.");

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
      GUARD
    );
    if (!auth.allowed) return auth.denied;

    const result = await cancelCampaign(tx, tenantId, campaignId);
    if (!result.ok) {
      if (result.reason === "not_found")
        return fail(404, "NOT_FOUND", "Campaign not found.");
      return fail(
        409,
        "ILLEGAL_TRANSITION",
        "This campaign cannot be cancelled from its current status."
      );
    }

    await recordAuditEvent(tx, {
      tenantId,
      actorTenantUserId: auth.context.tenantUserId,
      moduleKey: NEWSLETTER_MODULE_KEY,
      action: "newsletter.campaigns.cancel",
      resourceType: "newsletter_campaign",
      resourceId: campaignId,
      severity: "warning",
      message: "Newsletter campaign/digest cancelled.",
      attributes: {},
      correlationId
    });

    return ok({ campaignId, status: result.status });
  });
};
