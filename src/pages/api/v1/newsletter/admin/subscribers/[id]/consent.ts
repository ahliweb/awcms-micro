import type { APIRoute } from "astro";

import { hashSessionToken } from "../../../../../../../lib/auth/session-token";
import { getDatabaseClient } from "../../../../../../../lib/database/client";
import { withTenant } from "../../../../../../../lib/database/tenant-context";
import { fail, ok } from "../../../../../../../modules/_shared/api-response";
import {
  authorizeInTransaction,
  resolveAuthInputs
} from "../../../../../../../modules/identity-access/application/access-guard";
import {
  NEWSLETTER_MODULE_KEY,
  NEWSLETTER_SUBSCRIBERS_ACTIVITY_CODE
} from "../../../../../../../modules/newsletter/domain/newsletter-permissions";
import { listConsentEvents } from "../../../../../../../modules/newsletter/application/subscriber-admin-directory";

/**
 * `GET /api/v1/newsletter/admin/subscribers/{id}/consent` — append-only consent
 * evidence for a subscriber (Issue #272, ADR-0033). ABAC-guarded
 * (`newsletter.subscribers.read`). No raw PII — hashed evidence stays server-side.
 */
const READ_GUARD = {
  moduleKey: NEWSLETTER_MODULE_KEY,
  activityCode: NEWSLETTER_SUBSCRIBERS_ACTIVITY_CODE,
  action: "read" as const
};

export const GET: APIRoute = async ({ request, cookies, params }) => {
  const subscriberId = params.id;
  if (!subscriberId)
    return fail(400, "VALIDATION_ERROR", "Subscriber id is required.");

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
    return ok({ items: await listConsentEvents(tx, tenantId, subscriberId) });
  });
};
