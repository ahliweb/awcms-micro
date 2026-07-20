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
import { subscribeToNewsletter } from "../../../../modules/newsletter/application/subscriber-service";
import { withNewsletterTenant } from "../../../../modules/newsletter/application/public-newsletter-tenant-resolution";

/**
 * `POST /api/v1/newsletter/subscribe` — PUBLIC, host-resolved double-opt-in
 * subscribe (Issue #272, ADR-0033 §5). ANTI-ENUMERATION: always returns the SAME
 * generic `{ status: "accepted" }` body whether the address is new, pending,
 * already subscribed, suppressed, or belongs to another tenant — and whether the
 * host resolves/module is enabled at all. The confirm token is minted and stored
 * (hash) but NEVER placed in this response; it is delivered via the email path.
 * No raw email in any log/response.
 */
const RATE_WINDOW_MS = 60 * 60 * 1000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const POST: APIRoute = async ({ request, clientAddress, locals }) => {
  const clientIp = resolveClientIp(request, clientAddress);
  const rate = checkRateLimit(`newsletter:subscribe:${clientIp}`, {
    maxAttempts: 30,
    windowMs: RATE_WINDOW_MS
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
  const topicIds = Array.isArray(body.topicIds)
    ? body.topicIds
        .filter((t): t is string => typeof t === "string")
        .slice(0, 50)
    : null;

  await withNewsletterTenant(sql, request, async (tx, tenant) => {
    await subscribeToNewsletter(tx, tenant.tenantId, {
      rawEmail: body.email as string,
      locale:
        typeof body.locale === "string" && body.locale
          ? body.locale
          : tenant.defaultLocale,
      topicIds,
      source: "public_subscribe",
      policyVersion:
        typeof body.policyVersion === "string" ? body.policyVersion : null,
      ipHash: hashRequestSignal(tenant.tenantId, clientIp),
      uaHash: hashRequestSignal(tenant.tenantId, userAgent),
      correlationId
    });
    return null;
  });

  // Identical generic acknowledgement for EVERY outcome (existence/suppression/
  // tenant-membership are never revealed).
  return ok(GENERIC_ACCEPTED);
};
