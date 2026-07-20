import type { APIRoute } from "astro";

import { hashSessionToken } from "../../../../../../lib/auth/session-token";
import { getDatabaseClient } from "../../../../../../lib/database/client";
import { withTenant } from "../../../../../../lib/database/tenant-context";
import {
  bodyTooLargeResponse,
  readJsonBody
} from "../../../../../../lib/security/request-body-limit";
import { fail, ok } from "../../../../../../modules/_shared/api-response";
import {
  authorizeInTransaction,
  resolveAuthInputs
} from "../../../../../../modules/identity-access/application/access-guard";
import { recordAuditEvent } from "../../../../../../modules/logging/application/audit-log";
import {
  NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
  NEWSLETTER_MODULE_KEY
} from "../../../../../../modules/newsletter/domain/newsletter-permissions";
import {
  createCampaign,
  listCampaigns,
  type CampaignKind
} from "../../../../../../modules/newsletter/application/campaign-service";

/**
 * `GET/POST /api/v1/newsletter/admin/campaigns` — list / compose a campaign or
 * digest draft (Issue #272, ADR-0033). ABAC-guarded (`newsletter.campaigns.read` /
 * `.create`). Create is audited.
 */
const READ_GUARD = {
  moduleKey: NEWSLETTER_MODULE_KEY,
  activityCode: NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
  action: "read" as const
};
const CREATE_GUARD = {
  moduleKey: NEWSLETTER_MODULE_KEY,
  activityCode: NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
  action: "create" as const
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
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
    return ok(await listCampaigns(tx, tenantId, { beforeCreatedAt: cursor }));
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
  if (
    !isRecord(body) ||
    typeof body.subject !== "string" ||
    body.subject.trim().length === 0 ||
    body.subject.length > 300 ||
    typeof body.bodyText !== "string" ||
    body.bodyText.trim().length === 0 ||
    body.bodyText.length > 100000
  ) {
    return fail(
      400,
      "VALIDATION_ERROR",
      "`subject` (1-300) and `bodyText` (1-100000) are required."
    );
  }
  const kind: CampaignKind = body.kind === "digest" ? "digest" : "campaign";

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
      CREATE_GUARD
    );
    if (!auth.allowed) return auth.denied;

    const created = await createCampaign(tx, tenantId, {
      kind,
      subject: (body.subject as string).trim(),
      bodyText: body.bodyText as string,
      bodyHtmlSource:
        typeof body.bodyHtmlSource === "string"
          ? body.bodyHtmlSource.slice(0, 200000)
          : null,
      locale:
        typeof body.locale === "string" && body.locale ? body.locale : "en",
      topicId: typeof body.topicId === "string" ? body.topicId : null,
      scheduledAt: parseDate(body.scheduledAt),
      createdBy: auth.context.tenantUserId
    });

    await recordAuditEvent(tx, {
      tenantId,
      actorTenantUserId: auth.context.tenantUserId,
      moduleKey: NEWSLETTER_MODULE_KEY,
      action: "newsletter.campaigns.create",
      resourceType: "newsletter_campaign",
      resourceId: created.id,
      severity: "info",
      message: "Newsletter campaign/digest drafted.",
      attributes: { kind: created.kind },
      correlationId
    });

    return ok(created);
  });
};
