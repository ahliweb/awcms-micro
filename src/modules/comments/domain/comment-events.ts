/**
 * `comments` domain-event type/version constants (Issue #271, ADR-0032). Kept in
 * `domain/` (pure, no imports) so the application producers and the AsyncAPI /
 * `domain-event-runtime` registry parity checks reference the same literals. The
 * matching entries live in
 * `domain-event-runtime/domain/event-type-registry.ts` (kept in sync by
 * convention, not cross-module import) and in
 * `asyncapi/awcms-micro-domain-events.asyncapi.yaml`.
 *
 * Recipient addresses are NEVER carried in these events — a reply-notification
 * event references an opaque subscription/thread id + hash only; the email
 * dispatcher resolves the real address from minimized storage at send time.
 */
export const COMMENTS_EVENT_VERSION = "1.0";

export const COMMENT_SUBMITTED_EVENT_TYPE =
  "awcms-micro.comments.comment.submitted";
export const COMMENT_APPROVED_EVENT_TYPE =
  "awcms-micro.comments.comment.approved";
export const REPLY_CREATED_EVENT_TYPE = "awcms-micro.comments.reply.created";

export const COMMENTS_AGGREGATE_TYPE = "comments.comment";
