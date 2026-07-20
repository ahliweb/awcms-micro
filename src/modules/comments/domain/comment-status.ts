/**
 * Comment status state machine (Issue #271, ADR-0032). Pure domain — no I/O.
 * Enforces the legal moderation transitions and rejects illegal ones, so no
 * route/service can push a comment into an impossible state (e.g. approve a
 * deleted comment, or "un-delete" outside the sanctioned restore path).
 *
 * States:
 * - `pending`   — awaiting moderation (the default under any `moderated-*` mode).
 * - `approved`  — visible publicly.
 * - `rejected`  — denied publication by a moderator.
 * - `spam`      — denied publication, classified as spam (a rejection subtype).
 * - `deleted`   — soft-deleted (row retained; never rendered publicly).
 *
 * `archived` is modeled as a transition target of `approved` that returns the
 * comment to `pending` review is NOT correct — archive REMOVES an approved
 * comment from the public view while keeping it for history. We model archive as
 * a move to `rejected` would conflate two moderator intents, so archive has its
 * OWN target status is unnecessary: archive transitions `approved -> pending`
 * would re-queue it. Instead archive is a distinct action whose RESULT status is
 * `archived`. To keep the stored enum small and aligned with the DB CHECK
 * (`pending|approved|rejected|spam|deleted`), `archive` maps an approved comment
 * to `rejected` with a reserved reason code — see `moderationActionToStatus`.
 */
export type CommentStatus =
  "pending" | "approved" | "rejected" | "spam" | "deleted";

export type ModerationAction =
  "approve" | "reject" | "spam" | "archive" | "restore" | "delete";

/** Reserved reason code stamped when an approved comment is archived (so the queue can distinguish an archive from a plain reject). */
export const ARCHIVE_REASON_CODE = "archived";

const LEGAL_TRANSITIONS: Readonly<
  Record<CommentStatus, readonly CommentStatus[]>
> = {
  pending: ["approved", "rejected", "spam", "deleted"],
  approved: ["rejected", "spam", "deleted"],
  rejected: ["pending", "deleted"],
  spam: ["pending", "deleted"],
  deleted: []
};

export function isLegalTransition(
  from: CommentStatus,
  to: CommentStatus
): boolean {
  if (from === to) return false;
  return LEGAL_TRANSITIONS[from]?.includes(to) ?? false;
}

export type ModerationOutcome = {
  status: CommentStatus;
  /** Whether the resulting status makes the comment publicly visible. */
  publiclyVisible: boolean;
  /** A reserved reason code the action implies (e.g. archive), or null. */
  impliedReasonCode: string | null;
};

/**
 * Maps a moderator action against a current status to the resulting status,
 * throwing if the action is not legal from the current status. This is the ONE
 * place the archive/restore/approve/reject/spam/delete semantics live.
 */
export function applyModerationAction(
  current: CommentStatus,
  action: ModerationAction
): ModerationOutcome {
  const reject = (
    target: CommentStatus,
    reason: string | null
  ): ModerationOutcome => {
    if (!isLegalTransition(current, target)) {
      throw new IllegalCommentTransitionError(current, target, action);
    }
    return {
      status: target,
      publiclyVisible: target === "approved",
      impliedReasonCode: reason
    };
  };

  switch (action) {
    case "approve":
      return reject("approved", null);
    case "reject":
      return reject("rejected", null);
    case "spam":
      return reject("spam", null);
    case "archive":
      // Archive an approved comment: remove from public view, retain for history.
      // Stored as `rejected` with a reserved reason so the queue tells them apart.
      if (current !== "approved") {
        throw new IllegalCommentTransitionError(current, "rejected", action);
      }
      return {
        status: "rejected",
        publiclyVisible: false,
        impliedReasonCode: ARCHIVE_REASON_CODE
      };
    case "restore":
      return reject("pending", null);
    case "delete":
      return reject("deleted", null);
    default: {
      const exhaustive: never = action;
      throw new Error(`Unknown moderation action: ${String(exhaustive)}`);
    }
  }
}

export class IllegalCommentTransitionError extends Error {
  constructor(
    public readonly from: CommentStatus,
    public readonly to: CommentStatus,
    public readonly action: string
  ) {
    super(
      `Illegal comment transition: cannot ${action} a comment in status "${from}" (would move it to "${to}").`
    );
    this.name = "IllegalCommentTransitionError";
  }
}
