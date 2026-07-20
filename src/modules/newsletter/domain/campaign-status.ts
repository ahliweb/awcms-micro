/**
 * Campaign / digest lifecycle state machine (Issue #272, ADR-0033). Pure domain —
 * no I/O. Mirrors `comments/domain/comment-status.ts`: one place that enforces the
 * legal transitions and rejects illegal ones, so no route/service can e.g.
 * dispatch a draft, re-dispatch a completed campaign, or edit a sent one.
 *
 * States:
 * - `draft`       — being composed; freely editable.
 * - `scheduled`   — locked for a future/imminent send; audience not yet frozen.
 * - `dispatching` — audience frozen, per-recipient delivery_attempts enqueued and
 *                   being processed in bounded, resumable batches.
 * - `completed`   — every recipient reached a terminal delivery outcome.
 * - `cancelled`   — stopped before completion (from draft/scheduled/dispatching).
 * - `failed`      — dispatch aborted on an unrecoverable error (retryable).
 */
export type CampaignStatus =
  "draft" | "scheduled" | "dispatching" | "completed" | "cancelled" | "failed";

export type CampaignAction =
  "schedule" | "dispatch" | "complete" | "cancel" | "fail" | "revert_to_draft";

const LEGAL_TRANSITIONS: Readonly<
  Record<CampaignStatus, readonly CampaignStatus[]>
> = {
  draft: ["scheduled", "cancelled"],
  scheduled: ["dispatching", "cancelled", "draft"],
  dispatching: ["completed", "failed", "cancelled"],
  completed: [],
  cancelled: [],
  failed: ["dispatching", "cancelled"]
};

export function isLegalCampaignTransition(
  from: CampaignStatus,
  to: CampaignStatus
): boolean {
  if (from === to) return false;
  return LEGAL_TRANSITIONS[from]?.includes(to) ?? false;
}

/** Whether a campaign in this state is still freely editable (draft only). */
export function isEditable(status: CampaignStatus): boolean {
  return status === "draft";
}

/** Whether a campaign in this state is a terminal one (no further transitions except retry-from-failed). */
export function isTerminal(status: CampaignStatus): boolean {
  return status === "completed" || status === "cancelled";
}

const ACTION_TARGET: Readonly<Record<CampaignAction, CampaignStatus>> = {
  schedule: "scheduled",
  dispatch: "dispatching",
  complete: "completed",
  cancel: "cancelled",
  fail: "failed",
  revert_to_draft: "draft"
};

export type CampaignTransitionResult =
  | { ok: true; status: CampaignStatus }
  | { ok: false; reason: "illegal_transition" };

/** Resolve the target status for an action from the current status, or reject it. */
export function applyCampaignAction(
  current: CampaignStatus,
  action: CampaignAction
): CampaignTransitionResult {
  const target = ACTION_TARGET[action];
  if (!isLegalCampaignTransition(current, target)) {
    return { ok: false, reason: "illegal_transition" };
  }
  return { ok: true, status: target };
}
