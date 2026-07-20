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
  NEWSLETTER_MODULE_KEY,
  NEWSLETTER_TOPICS_ACTIVITY_CODE
} from "../../../../../../modules/newsletter/domain/newsletter-permissions";
import {
  findTopicById,
  updateTopic
} from "../../../../../../modules/newsletter/application/topic-directory";

/**
 * `PUT /api/v1/newsletter/admin/topics/{id}` — update/deactivate a topic (Issue
 * #272, ADR-0033). ABAC-guarded (`newsletter.topics.update`). Audited. A topic is
 * never hard-deleted (append-only-evidence posture) — deactivate via isActive.
 */
const UPDATE_GUARD = {
  moduleKey: NEWSLETTER_MODULE_KEY,
  activityCode: NEWSLETTER_TOPICS_ACTIVITY_CODE,
  action: "update" as const
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const PUT: APIRoute = async ({ request, cookies, params, locals }) => {
  const topicId = params.id;
  if (!topicId) return fail(400, "VALIDATION_ERROR", "Topic id is required.");

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

    const current = await findTopicById(tx, tenantId, topicId);
    if (!current) return fail(404, "NOT_FOUND", "Topic not found.");

    const name =
      typeof body.name === "string" && body.name.trim().length > 0
        ? body.name.trim().slice(0, 200)
        : current.name;

    const saved = await updateTopic(tx, tenantId, topicId, {
      name,
      description:
        typeof body.description === "string"
          ? body.description.slice(0, 2000)
          : current.description,
      isDefault:
        typeof body.isDefault === "boolean"
          ? body.isDefault
          : current.isDefault,
      isActive:
        typeof body.isActive === "boolean" ? body.isActive : current.isActive
    });
    if (!saved) return fail(404, "NOT_FOUND", "Topic not found.");

    await recordAuditEvent(tx, {
      tenantId,
      actorTenantUserId: auth.context.tenantUserId,
      moduleKey: NEWSLETTER_MODULE_KEY,
      action: "newsletter.topics.update",
      resourceType: "newsletter_topic",
      resourceId: topicId,
      severity: "info",
      message: "Newsletter topic updated.",
      attributes: { isActive: saved.isActive, isDefault: saved.isDefault },
      correlationId
    });

    return ok(saved);
  });
};
