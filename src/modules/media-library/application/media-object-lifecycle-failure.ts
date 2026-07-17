/**
 * Explains why a media lifecycle transition affected zero rows (ADR-0026 step 5).
 *
 * ## The problem this exists to solve
 *
 * Every mutation in `media-object-directory.ts` is a single guarded UPDATE —
 * `attach` requires `status = 'verified'`, `detach` requires `'attached'`,
 * `restore` requires `deleted_at IS NOT NULL`, and so on. Each returns
 * `null`/`false` when nothing matched, which conflates two entirely different
 * answers a caller needs to tell apart:
 *
 *   * the object does not exist (or belongs to another tenant) — 404
 *   * the object exists but is in the wrong state — 409
 *
 * Returning 404 for both would tell someone attaching an already-attached object
 * that it "does not exist", which is false and sends them looking in the wrong
 * place entirely.
 *
 * `awcms-mini`'s `document-infrastructure` solves this by having each directory
 * function `SELECT ... FOR UPDATE` first and return a discriminated
 * `{ok: false, reason: "not_found"}`. That is the better shape. It is not what
 * this does, deliberately: those five functions predate any caller
 * (Issue #633 wrote them, #634 wired none of them to HTTP), and changing five
 * signatures plus their existing tests to serve five brand-new routes is churn
 * that buys accuracy only in an error message. If a sixth caller ever needs the
 * distinction inside a transaction, adopt mini's shape then.
 *
 * ## The tradeoff, stated plainly
 *
 * This probes state AFTER the failed UPDATE rather than locking before it. The
 * probe runs in the same transaction, so it reads a consistent snapshot, but a
 * concurrent transaction could in principle change the row between the two
 * statements — making the 409's reported `currentStatus` momentarily stale. That
 * affects only the wording of an error, never whether the mutation happened, so
 * it is an acceptable trade for not reshaping five functions. A `FOR UPDATE`
 * lock would be required if anything ever branched on this result rather than
 * merely reporting it.
 */
import {
  fetchNewsMediaObjectById,
  type NewsMediaObjectStatus
} from "./media-object-directory";

export type MediaLifecycleFailure = {
  status: 404 | 409;
  code: "NOT_FOUND" | "INVALID_MEDIA_STATUS";
  message: string;
};

/**
 * `expectation` is the human-readable precondition the transition required
 * ("a verified media object"), used verbatim in the 409 message so the caller
 * learns what state it needed rather than just that it was wrong.
 */
export async function explainMediaLifecycleFailure(
  tx: Bun.SQL,
  tenantId: string,
  id: string,
  expectation: string
): Promise<MediaLifecycleFailure> {
  // `includeDeleted` on purpose: a soft-deleted object DOES exist, and telling a
  // caller "not found" when the real answer is "you deleted it" is the exact
  // confusion this function exists to prevent.
  const existing = await fetchNewsMediaObjectById(tx, tenantId, id, {
    includeDeleted: true
  });

  if (!existing) {
    // Same answer another tenant's id gets — `fetchNewsMediaObjectById` is
    // tenant-scoped by its own parameter, so a cross-tenant id resolves to null
    // here and never reveals that it exists elsewhere.
    return {
      status: 404,
      code: "NOT_FOUND",
      message: "Media object not found."
    };
  }

  return {
    status: 409,
    code: "INVALID_MEDIA_STATUS",
    message: `This action requires ${expectation}; the media object is currently ${describeState(existing.status, existing.deletedAt)}.`
  };
}

function describeState(
  status: NewsMediaObjectStatus,
  deletedAt: Date | null
): string {
  // A soft-deleted object keeps its last status, so reporting the status alone
  // would say "verified" about something the caller deleted.
  return deletedAt ? `soft-deleted (was ${status})` : status;
}
