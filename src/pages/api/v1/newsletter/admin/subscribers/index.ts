import type { APIRoute } from "astro";

import { hashSessionToken } from "../../../../../../lib/auth/session-token";
import { getDatabaseClient } from "../../../../../../lib/database/client";
import { withTenant } from "../../../../../../lib/database/tenant-context";
import { fail, ok } from "../../../../../../modules/_shared/api-response";
import {
  authorizeInTransaction,
  resolveAuthInputs
} from "../../../../../../modules/identity-access/application/access-guard";
import {
  NEWSLETTER_MODULE_KEY,
  NEWSLETTER_SUBSCRIBERS_ACTIVITY_CODE
} from "../../../../../../modules/newsletter/domain/newsletter-permissions";
import { listSubscribers } from "../../../../../../modules/newsletter/application/subscriber-admin-directory";
import type { SubscriberState } from "../../../../../../modules/newsletter/domain/subscriber-state";

/**
 * `GET /api/v1/newsletter/admin/subscribers` — list subscribers with MASKED email
 * ONLY (Issue #272, ADR-0033). ABAC-guarded (`newsletter.subscribers.read`). The
 * raw/decrypted address is NEVER returned by this surface.
 */
const READ_GUARD = {
  moduleKey: NEWSLETTER_MODULE_KEY,
  activityCode: NEWSLETTER_SUBSCRIBERS_ACTIVITY_CODE,
  action: "read" as const
};
const VALID_STATES: ReadonlySet<string> = new Set([
  "pending",
  "subscribed",
  "unsubscribed",
  "suppressed"
]);

export const GET: APIRoute = async ({ request, cookies, url }) => {
  const { tenantId, token } = resolveAuthInputs(request, cookies);
  if (!tenantId)
    return fail(400, "TENANT_REQUIRED", "Tenant header is required.");
  if (!token) return fail(401, "AUTH_REQUIRED", "Authentication required.");

  const sql = getDatabaseClient();
  const tokenHash = hashSessionToken(token);
  const now = new Date();
  const stateParam = url.searchParams.get("state");
  const state =
    stateParam && VALID_STATES.has(stateParam)
      ? (stateParam as SubscriberState)
      : null;
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
      await listSubscribers(tx, tenantId, { state, beforeCreatedAt: cursor })
    );
  });
};
