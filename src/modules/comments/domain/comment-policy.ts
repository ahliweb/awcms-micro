/**
 * Comment submission policy (Issue #271, ADR-0032). Pure domain — no I/O.
 * Given the thread's policy mode + the tenant settings + the author kind, decide
 * whether a submission is ACCEPTED (and whether it needs moderation) or REJECTED.
 *
 * Policy modes:
 * - `disabled`             — no submissions accepted at all.
 * - `authenticated-only`   — only registered (logged-in) authors; anonymous denied.
 * - `moderated-anonymous`  — anyone may submit; every submission starts `pending`.
 * - `moderated-registered` — only registered authors; every submission `pending`.
 *
 * Moderation-first: in this base every accepted submission starts `pending`
 * (require_moderation defaults true). A tenant that turns `require_moderation`
 * off in an `authenticated-only` thread lets a registered author's comment
 * auto-approve; anonymous submissions ALWAYS require moderation regardless.
 */
export type CommentPolicyMode =
  | "disabled"
  | "authenticated-only"
  | "moderated-anonymous"
  | "moderated-registered";

export type CommentAuthorKind = "anonymous" | "registered";

export type CommentPolicySettings = {
  requireModeration: boolean;
  allowAnonymous: boolean;
};

export type CommentPolicyDecision =
  | { accepted: true; initialStatus: "pending" | "approved" }
  | { accepted: false; reason: CommentPolicyRejectionReason };

export type CommentPolicyRejectionReason =
  | "comments_disabled"
  | "authentication_required"
  | "anonymous_not_allowed"
  | "thread_closed";

export function decideCommentPolicy(input: {
  policyMode: CommentPolicyMode;
  authorKind: CommentAuthorKind;
  threadClosed: boolean;
  settings: CommentPolicySettings;
}): CommentPolicyDecision {
  const { policyMode, authorKind, threadClosed, settings } = input;

  if (threadClosed) {
    return { accepted: false, reason: "thread_closed" };
  }

  if (policyMode === "disabled") {
    return { accepted: false, reason: "comments_disabled" };
  }

  const anonymous = authorKind === "anonymous";

  if (
    policyMode === "authenticated-only" ||
    policyMode === "moderated-registered"
  ) {
    if (anonymous) {
      return { accepted: false, reason: "authentication_required" };
    }
  }

  if (anonymous && !settings.allowAnonymous) {
    return { accepted: false, reason: "anonymous_not_allowed" };
  }

  // Moderation gate. Anonymous authors ALWAYS require moderation. A registered
  // author under a `*-registered`/`authenticated-only` thread may auto-approve
  // ONLY when the tenant has explicitly disabled require_moderation.
  const alwaysModerate =
    policyMode === "moderated-anonymous" ||
    policyMode === "moderated-registered" ||
    anonymous ||
    settings.requireModeration;

  return {
    accepted: true,
    initialStatus: alwaysModerate ? "pending" : "approved"
  };
}
