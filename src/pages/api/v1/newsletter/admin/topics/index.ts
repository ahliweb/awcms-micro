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
  createTopic,
  listTopics
} from "../../../../../../modules/newsletter/application/topic-directory";

/**
 * `GET/POST /api/v1/newsletter/admin/topics` — list / create topics (Issue #272,
 * ADR-0033). ABAC-guarded (`newsletter.topics.read` / `.create`). Create is audited.
 */
const READ_GUARD = {
  moduleKey: NEWSLETTER_MODULE_KEY,
  activityCode: NEWSLETTER_TOPICS_ACTIVITY_CODE,
  action: "read" as const
};
const CREATE_GUARD = {
  moduleKey: NEWSLETTER_MODULE_KEY,
  activityCode: NEWSLETTER_TOPICS_ACTIVITY_CODE,
  action: "create" as const
};
const TOPIC_KEY_PATTERN = /^[a-z][a-z0-9_-]{0,119}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const GET: APIRoute = async ({ request, cookies }) => {
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
    return ok({ items: await listTopics(tx, tenantId) });
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
    typeof body.topicKey !== "string" ||
    !TOPIC_KEY_PATTERN.test(body.topicKey) ||
    typeof body.name !== "string" ||
    body.name.trim().length === 0 ||
    body.name.length > 200
  ) {
    return fail(
      400,
      "VALIDATION_ERROR",
      "`topicKey` (slug) and `name` (1-200 chars) are required."
    );
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
      CREATE_GUARD
    );
    if (!auth.allowed) return auth.denied;

    const created = await createTopic(tx, tenantId, {
      topicKey: body.topicKey as string,
      name: (body.name as string).trim(),
      description:
        typeof body.description === "string"
          ? body.description.slice(0, 2000)
          : null,
      locale:
        typeof body.locale === "string" && body.locale ? body.locale : "en",
      isDefault: body.isDefault === true
    });

    await recordAuditEvent(tx, {
      tenantId,
      actorTenantUserId: auth.context.tenantUserId,
      moduleKey: NEWSLETTER_MODULE_KEY,
      action: "newsletter.topics.create",
      resourceType: "newsletter_topic",
      resourceId: created.id,
      severity: "info",
      message: "Newsletter topic created.",
      attributes: { topicKey: created.topicKey },
      correlationId
    });

    return ok(created);
  });
};
