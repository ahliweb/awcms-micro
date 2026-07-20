/**
 * Subscriber state machine (Issue #272, ADR-0033). Pure domain — no I/O. Enforces
 * the legal subscriber-lifecycle transitions so no route/service can push a
 * subscriber into an impossible state.
 *
 * States:
 * - `pending`      — created, awaiting double-opt-in confirmation.
 * - `subscribed`   — confirmed, receives mail.
 * - `unsubscribed` — opted out (an `unsubscribe` suppression row is also written).
 * - `suppressed`   — hard deny (bounce/complaint/manual) — TERMINAL for public
 *                    flows; only a manual admin action could ever lift it.
 *
 * Re-opt-in after `unsubscribed` returns to `pending` and requires a fresh
 * confirm; a `suppressed` bounce/complaint address can NOT be re-opted-in.
 */
export type SubscriberState =
  "pending" | "subscribed" | "unsubscribed" | "suppressed";

const LEGAL_TRANSITIONS: Readonly<
  Record<SubscriberState, readonly SubscriberState[]>
> = {
  pending: ["subscribed", "unsubscribed", "suppressed"],
  subscribed: ["unsubscribed", "suppressed"],
  unsubscribed: ["pending", "suppressed"],
  suppressed: []
};

export function isLegalSubscriberTransition(
  from: SubscriberState,
  to: SubscriberState
): boolean {
  if (from === to) return false;
  return LEGAL_TRANSITIONS[from]?.includes(to) ?? false;
}

/** Whether a subscriber in this state may be mailed a campaign. */
export function isMailable(state: SubscriberState): boolean {
  return state === "subscribed";
}

/** Whether a subscriber in this state may be re-opted-in by a public resubscribe. */
export function canReopt(state: SubscriberState): boolean {
  return state === "unsubscribed" || state === "pending";
}
