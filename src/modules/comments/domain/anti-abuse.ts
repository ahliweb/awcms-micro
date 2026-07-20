/**
 * Anti-abuse domain checks (Issue #271, ADR-0032). Pure domain — no I/O. The
 * application layer combines these with DB-backed rate limiting + abuse_events
 * telemetry; this file holds the deterministic, unit-testable decisions.
 *
 * Signals (all server-side; a client can never disable them):
 * - honeypot field: a hidden form field a human never fills; any value = bot.
 * - min-submit time: a form submitted faster than `minSubmitSeconds` after render
 *   is almost certainly automated.
 * - blocked terms: case-insensitive substring match against the tenant's list.
 * - duplicate fingerprint: sha256 of the normalized body + author within a window
 *   (computed here as a stable string; the caller checks recency in the DB).
 */
import { createHash } from "node:crypto";

export type AntiAbuseSettings = {
  minSubmitSeconds: number;
  blockedTerms: readonly string[];
};

export type AntiAbuseInput = {
  /** The hidden honeypot field value (should be empty). */
  honeypotValue: string | null | undefined;
  /** Milliseconds elapsed between form render and submit (from the signed timing token). */
  elapsedMs: number | null;
  /** The normalized comment body. */
  body: string;
};

export type AntiAbuseDecision =
  { blocked: false } | { blocked: true; reason: AntiAbuseReason };

export type AntiAbuseReason = "honeypot" | "too_fast" | "blocked_term";

export function evaluateAntiAbuse(
  input: AntiAbuseInput,
  settings: AntiAbuseSettings
): AntiAbuseDecision {
  // Honeypot: any non-empty value means an automated agent filled a hidden field.
  if (
    typeof input.honeypotValue === "string" &&
    input.honeypotValue.trim() !== ""
  ) {
    return { blocked: true, reason: "honeypot" };
  }

  // Timing floor: only enforce when we actually have an elapsed measurement and a
  // positive floor. A missing/negative token is handled as "too_fast" (fail
  // closed) ONLY when a floor is configured.
  if (settings.minSubmitSeconds > 0) {
    if (
      input.elapsedMs === null ||
      input.elapsedMs < settings.minSubmitSeconds * 1000
    ) {
      return { blocked: true, reason: "too_fast" };
    }
  }

  if (containsBlockedTerm(input.body, settings.blockedTerms)) {
    return { blocked: true, reason: "blocked_term" };
  }

  return { blocked: false };
}

/** Case-insensitive substring match against the tenant's blocked-terms list. */
export function containsBlockedTerm(
  body: string,
  blockedTerms: readonly string[]
): boolean {
  if (blockedTerms.length === 0) return false;
  const haystack = body.toLowerCase();
  return blockedTerms.some((term) => {
    const needle = term.trim().toLowerCase();
    return needle.length > 0 && haystack.includes(needle);
  });
}

/**
 * A stable duplicate-detection fingerprint over the normalized body + a coarse
 * author key (email hash or user id or ip hash). The caller looks this up in
 * `awcms_micro_comments_comments.content_fingerprint` within a recency window to
 * detect a repeated submission.
 */
export function computeContentFingerprint(input: {
  body: string;
  authorKey: string;
}): string {
  const normalized = input.body.replace(/\s+/g, " ").trim().toLowerCase();
  return createHash("sha256")
    .update(`${input.authorKey}\u0000${normalized}`)
    .digest("hex");
}
