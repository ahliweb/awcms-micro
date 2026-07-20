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
import { looksLikeEmail } from "../../../../modules/newsletter/domain/subscriber-identity";
import { hashRequestSignal } from "../../../../modules/newsletter/domain/request-hashing";
import { resubscribe } from "../../../../modules/newsletter/application/subscriber-service";
import { withNewsletterTenant } from "../../../../modules/newsletter/application/public-newsletter-tenant-resolution";

/**
 * `POST /api/v1/newsletter/resubscribe` — PUBLIC re-opt-in by address (Issue #272,
 * ADR-0033 §5). Only lifts an `unsubscribe`-reason suppression (a bounce/complaint
 * stays suppressed) and re-opens a fresh double-opt-in confirm. ANTI-ENUMERATION:
 * always returns the SAME generic `{ status: "accepted" }` body regardless of
 * whether the address exists / is suppressed / belongs to another tenant. No raw
 * email in any log/response.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const POST: APIRoute = async ({ request, clientAddress, locals }) => {
  const clientIp = resolveClientIp(request, clientAddress);
  const rate = checkRateLimit(`newsletter:resubscribe:${clientIp}`, {
    maxAttempts: 30,
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
  if (!isRecord(body) || !looksLikeEmail(body.email)) {
    return fail(400, "VALIDATION_ERROR", "A valid `email` is required.");
  }

  const sql = getDatabaseClient();
  const userAgent = request.headers.get("user-agent");
  const correlationId = locals.correlationId;

  await withNewsletterTenant(sql, request, async (tx, tenant) => {
    await resubscribe(tx, tenant.tenantId, {
      rawEmail: body.email as string,
      locale:
        typeof body.locale === "string" && body.locale
          ? body.locale
          : tenant.defaultLocale,
      topicIds: null,
      source: "public_resubscribe",
      policyVersion:
        typeof body.policyVersion === "string" ? body.policyVersion : null,
      ipHash: hashRequestSignal(tenant.tenantId, clientIp),
      uaHash: hashRequestSignal(tenant.tenantId, userAgent),
      correlationId
    });
    return null;
  });

  return ok(GENERIC_ACCEPTED);
};
