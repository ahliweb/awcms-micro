/**
 * Subscriber email normalization / hashing / masking (Issue #272, ADR-0033).
 * Pure domain — no I/O. Thin, newsletter-scoped wrapper over profile_identity's
 * canonical identifier helpers so a subscriber address is stored MINIMIZED (never
 * raw): a normalized lowercased value drives a sha256 lookup hash and a display
 * mask; the raw value only ever flows into `subscriber-crypto`'s AES-GCM column.
 *
 * NEVER log/return/eventify the raw or normalized address — hash + mask only.
 */
import {
  hashIdentifier,
  maskIdentifier,
  normalizeIdentifier
} from "../../profile-identity/domain/identifier";

export type SubscriberEmailParts = {
  /** Lowercased/trimmed address — used ONLY to derive the hash/mask/ciphertext, never stored/logged raw. */
  normalized: string;
  /** sha256 lookup hash (`sha256:<hex>`) — the tenant-scoped dedup/lookup key. */
  hash: string;
  /** Display mask (e.g. `j***@e***`) — safe to render to admins. */
  masked: string;
};

/** A minimal, structural email sanity check (a full RFC validation is neither needed nor a leak source). */
export function looksLikeEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 320) return false;
  const at = trimmed.indexOf("@");
  return at > 0 && at < trimmed.length - 1 && !/\s/.test(trimmed);
}

/** Derive the minimized parts of an email. Throws on a non-email input (callers pre-validate). */
export function deriveSubscriberEmailParts(
  rawEmail: string
): SubscriberEmailParts {
  const normalized = normalizeIdentifier("email", rawEmail);
  return {
    normalized,
    hash: hashIdentifier(normalized),
    masked: maskIdentifier("email", normalized)
  };
}
