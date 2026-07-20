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
import {
  getCampaign,
  runReconciliation
} from "../../../../../../../modules/newsletter/application/campaign-service";

/**
 * `POST /api/v1/newsletter/admin/campaigns/{id}/reconcile` — compare a dispatched
 * campaign's frozen audience against its delivery outcomes and record an evidence
 * run (Issue #272, ADR-0033). ABAC-guarded (`newsletter.campaigns.send` — it can
 * complete a fully-delivered campaign), audited.
 */
const GUARD = {
  moduleKey: NEWSLETTER_MODULE_KEY,
  activityCode: NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
  action: "send" as const
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

    const campaign = await getCampaign(tx, tenantId, campaignId);
    if (!campaign) return fail(404, "NOT_FOUND", "Campaign not found.");

    const result = await runReconciliation(tx, tenantId, campaignId);

    await recordAuditEvent(tx, {
      tenantId,
      actorTenantUserId: auth.context.tenantUserId,
      moduleKey: NEWSLETTER_MODULE_KEY,
      action: "newsletter.campaigns.reconcile",
      resourceType: "newsletter_campaign",
      resourceId: campaignId,
      severity: "info",
      message: "Newsletter campaign reconciliation run recorded.",
      attributes: { discrepancyCount: result.discrepancyCount },
      correlationId
    });

    return ok({
      campaignId,
      runId: result.runId,
      discrepancyCount: result.discrepancyCount
    });
  });
};
