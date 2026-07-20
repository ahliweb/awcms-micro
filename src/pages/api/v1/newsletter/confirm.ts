import type { APIRoute } from "astro";

import { getDatabaseClient } from "../../../../lib/database/client";
import {
  checkRateLimit,
  resolveClientIp
} from "../../../../lib/security/rate-limit";
import {
  bodyTooLargeResponse,
  readJsonBody
} from "../../../../lib/security/request-body-limit";
import { fail, ok } from "../../../../modules/_shared/api-response";
import { GENERIC_ACCEPTED } from "../../../../modules/newsletter/domain/generic-response";
import { confirmSubscription } from "../../../../modules/newsletter/application/subscriber-service";
import { withNewsletterTenant } from "../../../../modules/newsletter/application/public-newsletter-tenant-resolution";

/**
 * `POST /api/v1/newsletter/confirm` — PUBLIC double-opt-in confirmation by a raw
 * confirm token (Issue #272, ADR-0033 §5). The token is sha256-hashed + looked up
 * (constant-time), consumed atomically (single-use), and must be unexpired. ANY
 * invalid/expired/consumed/forged token returns the SAME generic `{ status:
 * "accepted" }` body as a valid one (no reason is ever distinguished). Confirming
 * twice is a generic no-op (idempotent). No raw email in any log/response.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const POST: APIRoute = async ({ request, clientAddress, locals }) => {
  const clientIp = resolveClientIp(request, clientAddress);
  const rate = checkRateLimit(`newsletter:confirm:${clientIp}`, {
    maxAttempts: 60,
    windowMs: 60 * 60 * 1000
  });
  if (!rate.allowed) {
    return fail(429, "RATE_LIMITED", "Too many requests.", {}, undefined, {
      "retry-after": String(rate.retryAfterSec)
    });
  }

  const bodyRead = await readJsonBody(request);
  if (bodyRead.tooLarge) return bodyTooLargeResponse(bodyRead.limitBytes);
  const body = bodyRead.value;
  const token =
    isRecord(body) && typeof body.token === "string" ? body.token : null;

  const sql = getDatabaseClient();
  const correlationId = locals.correlationId;

  await withNewsletterTenant(sql, request, async (tx, tenant) => {
    await confirmSubscription(tx, tenant.tenantId, token, { correlationId });
    return null;
  });

  return ok(GENERIC_ACCEPTED);
};
