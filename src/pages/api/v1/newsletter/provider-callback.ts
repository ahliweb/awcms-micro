import type { APIRoute } from "astro";

import { getDatabaseClient } from "../../../../lib/database/client";
import {
  checkRateLimit,
  resolveClientIp
} from "../../../../lib/security/rate-limit";
import { fail, ok } from "../../../../modules/_shared/api-response";
import { GENERIC_CALLBACK_OK } from "../../../../modules/newsletter/domain/generic-response";
import {
  buildDedupeKey,
  verifyCallbackSignature
} from "../../../../modules/newsletter/domain/provider-callback-verify";
import {
  deriveSubscriberEmailParts,
  looksLikeEmail
} from "../../../../modules/newsletter/domain/subscriber-identity";
import { recordProviderCallback } from "../../../../modules/newsletter/application/provider-callback-service";
import { withNewsletterTenant } from "../../../../modules/newsletter/application/public-newsletter-tenant-resolution";

/**
 * `POST /api/v1/newsletter/provider-callback` — PUBLIC, provider-neutral webhook
 * receiver (Issue #272, ADR-0033 §5). Signature + replay verified BEFORE anything
 * is trusted: the HMAC over the RAW body must verify (constant-time), and the
 * callback is recorded ONCE per `dedupe_key` (replay-safe). A bounce/complaint
 * applies a suppression. Browser redirects are NEVER trusted — only the signed
 * server-to-server body. NEVER stores a raw address (the provider-supplied email is
 * hashed here). Generic 200 on accept/replay; 400 on a bad/forged signature.
 */
const MAX_BODY_BYTES = 64 * 1024;
const VALID_EVENT_TYPES = new Set([
  "delivered",
  "bounce",
  "complaint",
  "failed"
]);

export const POST: APIRoute = async ({ request, clientAddress, locals }) => {
  const clientIp = resolveClientIp(request, clientAddress);
  const rate = checkRateLimit(`newsletter:provider:${clientIp}`, {
    maxAttempts: 300,
    windowMs: 60 * 1000
  });
  if (!rate.allowed) {
    return fail(429, "RATE_LIMITED", "Too many requests.", {}, undefined, {
      "retry-after": String(rate.retryAfterSec)
    });
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return fail(413, "BODY_TOO_LARGE", "Request body is too large.");
  }

  const signature = request.headers.get("x-newsletter-signature");
  if (!verifyCallbackSignature(rawBody, signature)) {
    // A forged/unsigned callback is rejected (signature validity does not depend
    // on any address, so this is not an enumeration oracle).
    return fail(
      400,
      "SIGNATURE_INVALID",
      "Callback signature verification failed."
    );
  }

  let parsed: Record<string, unknown>;
  try {
    const value = JSON.parse(rawBody) as unknown;
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return fail(
        400,
        "VALIDATION_ERROR",
        "Callback body must be a JSON object."
      );
    }
    parsed = value as Record<string, unknown>;
  } catch {
    return fail(400, "VALIDATION_ERROR", "Callback body is not valid JSON.");
  }

  const provider =
    typeof parsed.provider === "string"
      ? parsed.provider.slice(0, 64)
      : "unknown";
  const eventType =
    typeof parsed.eventType === "string" ? parsed.eventType : "";
  if (!VALID_EVENT_TYPES.has(eventType)) {
    return fail(400, "VALIDATION_ERROR", "Unknown callback eventType.");
  }
  const eventId = typeof parsed.eventId === "string" ? parsed.eventId : null;
  const emailHash = looksLikeEmail(parsed.email)
    ? deriveSubscriberEmailParts(parsed.email).hash
    : null;
  const dedupeKey = buildDedupeKey({ provider, eventId, rawBody });
  const correlationId = locals.correlationId;

  const sql = getDatabaseClient();
  await withNewsletterTenant(sql, request, async (tx, tenant) => {
    await recordProviderCallback(tx, tenant.tenantId, {
      provider,
      eventType: eventType as "delivered" | "bounce" | "complaint" | "failed",
      dedupeKey,
      signatureVerified: true,
      emailHash,
      payloadDigest: null,
      correlationId
    });
    return null;
  });

  // Generic OK whether newly recorded, a replay, or the host did not resolve.
  return ok(GENERIC_CALLBACK_OK);
};
