/**
 * Anti-enumeration generic responses (Issue #272, ADR-0033 — SECURITY SPINE).
 * Pure domain — no I/O. Every PUBLIC newsletter flow (subscribe/confirm/
 * preferences/unsubscribe/resubscribe/provider-callback) MUST return an IDENTICAL
 * generic body regardless of whether an address exists / is pending / is already
 * subscribed / is suppressed / belongs to another tenant. This module is the ONE
 * place those bodies are defined, so no route can accidentally diverge into an
 * existence/suppression oracle.
 *
 * The bodies carry NO raw PII and NO per-address state — only a fixed
 * acknowledgement the caller cannot use to distinguish outcomes.
 */

/** The single generic acknowledgement returned by every mutating public flow. */
export const GENERIC_ACCEPTED = Object.freeze({ status: "accepted" as const });

/** The single generic acknowledgement returned by the public preferences GET when the token is bad/unknown. */
export const GENERIC_PREFERENCES_EMPTY = Object.freeze({
  topics: [] as ReadonlyArray<never>,
  locale: null as string | null
});

/** The single generic acknowledgement returned by the provider callback (accepted OR rejected-but-recorded). */
export const GENERIC_CALLBACK_OK = Object.freeze({ status: "ok" as const });

/** A fresh copy of the generic accepted body (routes serialize it; a frozen shared object is fine but callers may want a plain object). */
export function genericAccepted(): { status: "accepted" } {
  return { status: "accepted" };
}
