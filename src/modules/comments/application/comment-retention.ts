/**
 * Comment retention / anonymization sweep (Issue #271, ADR-0032). Runs as the
 * least-privilege worker role (`bun run comments:retention`). Two bounded passes
 * per tenant:
 *
 *   1. `anonymizeAgedComments` — for comments older than the retention cutoff,
 *      NULLs the author identity fields (display name, email hash/mask, ip/ua
 *      hash, fingerprint) while RETAINING the row + body + moderation history —
 *      soft-privacy minimization, not deletion (append-only history stays
 *      coherent). SKIPPED entirely for a tenant whose comment content descriptor
 *      is under an active legal hold (legal hold overrides retention, issue #745).
 *   2. `purgeUnconfirmedReplySubscriptions` — deletes double-opt-in subscriptions
 *      never confirmed within the confirmation window (they can never be used to
 *      notify, so retaining a recipient reference serves no purpose).
 *
 * The `abuse_events` and confirmed-but-stale `reply_subscriptions` age-based
 * purge is handled by the `data_lifecycle` generic engine via the descriptors in
 * `module.ts` — this job owns only the anonymization + unconfirmed cleanup that
 * the generic engine cannot express.
 */
import type { LegalHoldGuardPort } from "../../_shared/ports/legal-hold-guard-port";
import { COMMENTS_CONTENT_LIFECYCLE_KEY } from "../module";

export const COMMENTS_DEFAULT_ANONYMIZE_DAYS = 365;
export const COMMENTS_UNCONFIRMED_SUBSCRIPTION_DAYS = 7;

export type AnonymizeResult = {
  anonymizedCount: number;
  skippedForLegalHold: boolean;
  cutoff: Date;
};

/** Anonymize author identity on comments older than the cutoff (honor legal hold). */
export async function anonymizeAgedComments(
  tx: Bun.SQL,
  tenantId: string,
  legalHoldGuard: LegalHoldGuardPort,
  options: { retentionDays: number; now?: Date; batchLimit?: number }
): Promise<AnonymizeResult> {
  const now = options.now ?? new Date();
  const cutoff = new Date(
    now.getTime() - options.retentionDays * 24 * 60 * 60 * 1000
  );

  const held = await legalHoldGuard.isDescriptorHeld(
    tx,
    tenantId,
    COMMENTS_CONTENT_LIFECYCLE_KEY
  );
  if (held) {
    return { anonymizedCount: 0, skippedForLegalHold: true, cutoff };
  }

  const batchLimit = Math.min(Math.max(1, options.batchLimit ?? 1000), 5000);
  const rows = (await tx`
    WITH candidates AS (
      SELECT id FROM awcms_micro_comments_comments
      WHERE tenant_id = ${tenantId}
        AND created_at < ${cutoff}
        AND (author_email_hash IS NOT NULL
             OR author_ip_hash IS NOT NULL
             OR author_display_name IS NOT NULL)
      ORDER BY created_at
      LIMIT ${batchLimit}
    )
    UPDATE awcms_micro_comments_comments c
    SET author_display_name = NULL,
        author_email_hash = NULL,
        author_email_masked = NULL,
        author_ip_hash = NULL,
        user_agent_hash = NULL,
        content_fingerprint = NULL,
        updated_at = now()
    FROM candidates
    WHERE c.id = candidates.id AND c.tenant_id = ${tenantId}
    RETURNING c.id
  `) as { id: string }[];

  return {
    anonymizedCount: rows.length,
    skippedForLegalHold: false,
    cutoff
  };
}

export type PurgeSubscriptionsResult = { purgedCount: number; cutoff: Date };

/** Delete unconfirmed reply subscriptions older than the confirmation window. */
export async function purgeUnconfirmedReplySubscriptions(
  tx: Bun.SQL,
  tenantId: string,
  options: { unconfirmedDays?: number; now?: Date; batchLimit?: number } = {}
): Promise<PurgeSubscriptionsResult> {
  const now = options.now ?? new Date();
  const days =
    options.unconfirmedDays ?? COMMENTS_UNCONFIRMED_SUBSCRIPTION_DAYS;
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const batchLimit = Math.min(Math.max(1, options.batchLimit ?? 1000), 5000);

  const rows = (await tx`
    WITH candidates AS (
      SELECT id FROM awcms_micro_comments_reply_subscriptions
      WHERE tenant_id = ${tenantId}
        AND confirmed = false
        AND created_at < ${cutoff}
      ORDER BY created_at
      LIMIT ${batchLimit}
    )
    DELETE FROM awcms_micro_comments_reply_subscriptions s
    USING candidates
    WHERE s.id = candidates.id AND s.tenant_id = ${tenantId}
    RETURNING s.id
  `) as { id: string }[];

  return { purgedCount: rows.length, cutoff };
}
