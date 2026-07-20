/**
 * Newsletter double-opt-in tokens (Issue #272, ADR-0033). Pure domain — no I/O.
 * A CSPRNG raw token is minted and returned to the caller EXACTLY ONCE (embedded
 * in the dispatched confirm/preferences/unsubscribe link); only its sha256 HASH
 * is persisted (`awcms_micro_newsletter_tokens.token_hash`) and it is verified in
 * CONSTANT TIME. Single-use + expiry are enforced by the storage layer
 * (`consumed_at`/`expires_at`); this file owns the crypto + the pure predicates.
 */
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export type NewsletterTokenPurpose = "confirm" | "unsubscribe" | "preferences";

/** Default token lifetimes (ms) per purpose — confirm/preferences expire; unsubscribe links are long-lived (RFC 8058 one-click). */
export const CONFIRM_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const PREFERENCES_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const UNSUBSCRIBE_TOKEN_TTL_MS = 365 * 24 * 60 * 60 * 1000;

export function tokenTtlMs(purpose: NewsletterTokenPurpose): number {
  switch (purpose) {
    case "confirm":
      return CONFIRM_TOKEN_TTL_MS;
    case "preferences":
      return PREFERENCES_TOKEN_TTL_MS;
    case "unsubscribe":
      return UNSUBSCRIBE_TOKEN_TTL_MS;
    default: {
      const exhaustive: never = purpose;
      throw new Error(`Unknown token purpose: ${String(exhaustive)}`);
    }
  }
}

/** A high-entropy, URL-safe raw token (returned once). */
export function mintRawToken(): string {
  return randomBytes(32).toString("base64url");
}

/** sha256 hash (`sha256:<hex>`) of a raw token — the only value persisted. */
export function hashToken(rawToken: string): string {
  return `sha256:${createHash("sha256").update(rawToken).digest("hex")}`;
}

/**
 * Constant-time comparison of a candidate raw token against a stored hash. Never
 * short-circuits on length via string compare — hashes both sides and compares
 * fixed-width buffers, so it leaks no timing signal about how much matched.
 */
export function verifyTokenHash(
  candidateRawToken: unknown,
  storedHash: string
): boolean {
  if (typeof candidateRawToken !== "string" || candidateRawToken.length === 0) {
    return false;
  }
  const candidateHash = hashToken(candidateRawToken);
  const a = Buffer.from(candidateHash, "utf8");
  const b = Buffer.from(storedHash, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Whether a token is still usable: not consumed and not past its expiry. */
export function isTokenUsable(
  token: { consumedAt: Date | string | null; expiresAt: Date | string },
  now: Date = new Date()
): boolean {
  if (token.consumedAt !== null && token.consumedAt !== undefined) return false;
  const expires = new Date(token.expiresAt).getTime();
  return Number.isFinite(expires) && expires > now.getTime();
}
