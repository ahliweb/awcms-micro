/**
 * Per-topic subscription state machine (Issue #272, ADR-0033). Pure domain — no
 * I/O. A subscription is the (subscriber, topic) opt-in that a campaign/digest
 * mails against.
 *
 * States:
 * - `pending`      — created on subscribe, awaiting the subscriber's confirm.
 * - `confirmed`    — active; included in a campaign's audience.
 * - `unsubscribed` — opted out of this topic.
 */
export type SubscriptionState = "pending" | "confirmed" | "unsubscribed";

const LEGAL_TRANSITIONS: Readonly<
  Record<SubscriptionState, readonly SubscriptionState[]>
> = {
  pending: ["confirmed", "unsubscribed"],
  confirmed: ["unsubscribed"],
  unsubscribed: ["pending", "confirmed"]
};

export function isLegalSubscriptionTransition(
  from: SubscriptionState,
  to: SubscriptionState
): boolean {
  if (from === to) return false;
  return LEGAL_TRANSITIONS[from]?.includes(to) ?? false;
}

/** Whether a subscription in this state is part of a campaign audience. */
export function isAudienceEligible(state: SubscriptionState): boolean {
  return state === "confirmed";
}
