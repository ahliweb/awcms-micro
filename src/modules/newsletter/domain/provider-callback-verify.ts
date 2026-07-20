/**
 * Provider-callback signature + replay verification (Issue #272, ADR-0033).
 * Pure domain — no I/O. Provider-neutral: an inbound delivery/bounce/complaint
 * webhook is only trusted once its HMAC signature verifies (constant-time, the
 * same discipline as `sync-hmac`) AND its `dedupe_key` has not been seen (the
 * replay guard is a UNIQUE insert in the application layer). A browser redirect
 * is NEVER trusted — only the signed server-to-server callback body.
 *
 * When no provider secret is configured, verification FAILS CLOSED (returns
 * `false`), so an unconfigured deployment never silently trusts an unsigned
 * callback. A test/dev harness configures `NEWSLETTER_PROVIDER_WEBHOOK_SECRET`.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export function resolveProviderWebhookSecret(
  env: NodeJS.ProcessEnv = process.env
): string | null {
  const raw = env.NEWSLETTER_PROVIDER_WEBHOOK_SECRET;
  return raw && raw.length > 0 ? raw : null;
}

/** HMAC-SHA256 of the raw request body, hex-encoded. */
export function computeCallbackSignature(
  rawBody: string,
  secret: string
): string {
  return createHmac("sha256", secret).update(rawBody).digest("hex");
}

/**
 * Constant-time verify a provider callback signature against the raw body. Returns
 * false for any missing/mismatched/misconfigured input — never throws, never
 * short-circuits on length in a way that leaks a timing signal.
 */
export function verifyCallbackSignature(
  rawBody: string,
  providedSignature: unknown,
  env: NodeJS.ProcessEnv = process.env
): boolean {
  const secret = resolveProviderWebhookSecret(env);
  if (!secret) return false;
  if (typeof providedSignature !== "string" || providedSignature.length === 0) {
    return false;
  }
  const expected = computeCallbackSignature(rawBody, secret);
  const a = Buffer.from(providedSignature, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * A stable, replay-safe dedupe key for a provider callback: `provider:eventId`
 * (or a hash of the body when no stable event id is supplied). Stored UNIQUE per
 * tenant so a re-delivered callback inserts exactly once.
 */
export function buildDedupeKey(input: {
  provider: string;
  eventId: string | null;
  rawBody: string;
}): string {
  if (input.eventId && input.eventId.length > 0) {
    return `${input.provider}:${input.eventId}`.slice(0, 256);
  }
  const digest = createHmac("sha256", "newsletter-provider-dedupe")
    .update(input.rawBody)
    .digest("hex");
  return `${input.provider}:${digest}`.slice(0, 256);
}
