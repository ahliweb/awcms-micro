import type { APIRoute } from "astro";

import { hashSessionToken } from "../../../../../../../lib/auth/session-token";
import { getDatabaseClient } from "../../../../../../../lib/database/client";
import { withTenant } from "../../../../../../../lib/database/tenant-context";
import {
  bodyTooLargeResponse,
  readJsonBody
} from "../../../../../../../lib/security/request-body-limit";
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
  updateCampaign
} from "../../../../../../../modules/newsletter/application/campaign-service";

/**
 * `GET/PATCH /api/v1/newsletter/admin/campaigns/{id}` — read detail (+ delivery
 * stats) / update a DRAFT campaign (Issue #272, ADR-0033). ABAC-guarded
 * (`newsletter.campaigns.read` / `.update`). Only a draft is editable; update is
 * audited.
 */
const READ_GUARD = {
  moduleKey: NEWSLETTER_MODULE_KEY,
  activityCode: NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
  action: "read" as const
};
const UPDATE_GUARD = {
  moduleKey: NEWSLETTER_MODULE_KEY,
  activityCode: NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
  action: "update" as const
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function parseDate(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
}

export const GET: APIRoute = async ({ request, cookies, params }) => {
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

  return withTenant(sql, tenantId, async (tx) => {
    const auth = await authorizeInTransaction(
      tx,
      tenantId,
      tokenHash,
      now,
      READ_GUARD
    );
    if (!auth.allowed) return auth.denied;
    const campaign = await getCampaign(tx, tenantId, campaignId);
    if (!campaign) return fail(404, "NOT_FOUND", "Campaign not found.");
    return ok(campaign);
  });
};

export const PATCH: APIRoute = async ({ request, cookies, params, locals }) => {
  const campaignId = params.id;
  if (!campaignId)
    return fail(400, "VALIDATION_ERROR", "Campaign id is required.");

  const { tenantId, token } = resolveAuthInputs(request, cookies);
  if (!tenantId)
    return fail(400, "TENANT_REQUIRED", "Tenant header is required.");
  if (!token) return fail(401, "AUTH_REQUIRED", "Authentication required.");

  const bodyRead = await readJsonBody(request);
  if (bodyRead.tooLarge) return bodyTooLargeResponse(bodyRead.limitBytes);
  const body = bodyRead.value;
  if (!isRecord(body)) {
    return fail(400, "VALIDATION_ERROR", "Body must be a JSON object.");
  }

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
      UPDATE_GUARD
    );
    if (!auth.allowed) return auth.denied;

    const current = await getCampaign(tx, tenantId, campaignId);
    if (!current) return fail(404, "NOT_FOUND", "Campaign not found.");

    const subject =
      typeof body.subject === "string" && body.subject.trim().length > 0
        ? body.subject.trim().slice(0, 300)
        : current.subject;
    const bodyText =
      typeof body.bodyText === "string" && body.bodyText.trim().length > 0
        ? body.bodyText.slice(0, 100000)
        : // getCampaign does not return bodyText; re-read is unnecessary — reject an
          // update that omits it to keep the draft body intentional.
          null;

    if (bodyText === null && typeof body.bodyText !== "undefined") {
      return fail(
        400,
        "VALIDATION_ERROR",
        "`bodyText` must be 1-100000 chars."
      );
    }

    const result = await updateCampaign(tx, tenantId, campaignId, {
      subject,
      bodyText: bodyText ?? (await requireBodyText(tx, tenantId, campaignId)),
      bodyHtmlSource:
        typeof body.bodyHtmlSource === "string"
          ? body.bodyHtmlSource.slice(0, 200000)
          : current.bodyHtmlSource,
      topicId:
        typeof body.topicId === "string"
          ? body.topicId
          : body.topicId === null
            ? null
            : current.topicId,
      scheduledAt: parseDate(body.scheduledAt) ?? null
    });

    if ("error" in result) {
      if (result.error === "not_found")
        return fail(404, "NOT_FOUND", "Campaign not found.");
      return fail(409, "NOT_EDITABLE", "Only a draft campaign can be edited.");
    }

    await recordAuditEvent(tx, {
      tenantId,
      actorTenantUserId: auth.context.tenantUserId,
      moduleKey: NEWSLETTER_MODULE_KEY,
      action: "newsletter.campaigns.update",
      resourceType: "newsletter_campaign",
      resourceId: campaignId,
      severity: "info",
      message: "Newsletter campaign/digest draft updated.",
      attributes: { kind: result.kind },
      correlationId
    });

    return ok(result);
  });
};

/** Read the current stored body_text (updateCampaign requires it explicitly). */
async function requireBodyText(
  tx: Bun.SQL,
  tenantId: string,
  campaignId: string
): Promise<string> {
  const rows = (await tx`
    SELECT body_text FROM awcms_micro_newsletter_campaigns
    WHERE tenant_id = ${tenantId} AND id = ${campaignId}
  `) as { body_text: string }[];
  return rows[0]?.body_text ?? "";
}
