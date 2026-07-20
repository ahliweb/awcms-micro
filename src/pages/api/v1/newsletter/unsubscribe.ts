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
import { unsubscribeByToken } from "../../../../modules/newsletter/application/subscriber-service";
import { withNewsletterTenant } from "../../../../modules/newsletter/application/public-newsletter-tenant-resolution";

/**
 * `POST /api/v1/newsletter/unsubscribe` — PUBLIC one-step unsubscribe by a raw
 * unsubscribe token (Issue #272, ADR-0033 §5; RFC 8058 one-click semantics). NO
 * login. Marks the subscriber unsubscribed, records an `unsubscribe` suppression,
 * and is idempotent. ANTI-ENUMERATION: always returns the SAME generic body for
 * any valid/invalid/expired token. No raw email in any log/response.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const POST: APIRoute = async ({ request, clientAddress, locals }) => {
  const clientIp = resolveClientIp(request, clientAddress);
  const rate = checkRateLimit(`newsletter:unsubscribe:${clientIp}`, {
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
    await unsubscribeByToken(tx, tenant.tenantId, token, { correlationId });
    return null;
  });

  return ok(GENERIC_ACCEPTED);
};
