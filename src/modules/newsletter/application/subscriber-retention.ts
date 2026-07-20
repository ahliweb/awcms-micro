/**
 * Newsletter retention / anonymization sweep (Issue #272, ADR-0033). Runs as the
 * least-privilege worker role (`bun run newsletter:retention`). Two bounded passes
 * per tenant:
 *
 *   1. `anonymizeAgedSubscribers` — for UNSUBSCRIBED/SUPPRESSED subscribers older
 *      than the retention cutoff, NULLs the recoverable address ciphertext and
 *      replaces the mask/hash-derived identity with anonymized sentinels, while
 *      RETAINING the row + append-only consent/state history — privacy
 *      minimization, not deletion. SKIPPED for a tenant whose subscribers
 *      descriptor is under an active legal hold (legal hold overrides retention,
 *      issue #745).
 *   2. `purgeExpiredTokens` — hard-deletes expired or consumed double-opt-in
 *      tokens (they can never be used again, so retaining a token pointer serves
 *      no purpose). Legal hold does NOT gate token purge (tokens carry no PII).
 *
 * The `delivery_attempts` / `provider_events` / `tokens` age-based generic purge
 * is also registered in `module.ts` for the data_lifecycle engine; this job owns
 * the subscriber anonymization the generic engine cannot express.
 */
import type { LegalHoldGuardPort } from "../../_shared/ports/legal-hold-guard-port";
import { NEWSLETTER_SUBSCRIBERS_LIFECYCLE_KEY } from "../module";

export const NEWSLETTER_DEFAULT_ANONYMIZE_DAYS = 365;

export type AnonymizeSubscribersResult = {
  anonymizedCount: number;
  skippedForLegalHold: boolean;
  cutoff: Date;
};

/** Anonymize the recoverable address of aged unsubscribed/suppressed subscribers (honor legal hold). */
export async function anonymizeAgedSubscribers(
  tx: Bun.SQL,
  tenantId: string,
  legalHoldGuard: LegalHoldGuardPort,
  options: { retentionDays: number; now?: Date; batchLimit?: number }
): Promise<AnonymizeSubscribersResult> {
  const now = options.now ?? new Date();
  const cutoff = new Date(
    now.getTime() - options.retentionDays * 24 * 60 * 60 * 1000
  );

  const held = await legalHoldGuard.isDescriptorHeld(
    tx,
    tenantId,
    NEWSLETTER_SUBSCRIBERS_LIFECYCLE_KEY
  );
  if (held) {
    return { anonymizedCount: 0, skippedForLegalHold: true, cutoff };
  }

  const batchLimit = Math.min(Math.max(1, options.batchLimit ?? 1000), 5000);
  const rows = (await tx`
    WITH candidates AS (
      SELECT id FROM awcms_micro_newsletter_subscribers
      WHERE tenant_id = ${tenantId}
        AND state IN ('unsubscribed', 'suppressed')
        AND updated_at < ${cutoff}
        AND email_encrypted <> 'anonymized'
      ORDER BY updated_at
      LIMIT ${batchLimit}
    )
    UPDATE awcms_micro_newsletter_subscribers s
    SET email_encrypted = 'anonymized',
        email_masked = '***@***',
        -- M2: also overwrite the sha256 lookup hash — a retained sha256 of a
        -- low-entropy email is dictionary-reversible, so keeping it would leave
        -- this an existence oracle after "anonymization". The per-row sentinel is
        -- non-reversible AND keeps the (tenant_id, email_hash) dedup key unique;
        -- an aged/suppressed row deliberately no longer resolves to any address.
        email_hash = 'anonymized-' || s.id::text,
        updated_at = now()
    FROM candidates
    WHERE s.id = candidates.id AND s.tenant_id = ${tenantId}
    RETURNING s.id
  `) as { id: string }[];

  return { anonymizedCount: rows.length, skippedForLegalHold: false, cutoff };
}

export type PurgeTokensResult = { purgedCount: number };

/** Hard-delete expired or consumed double-opt-in tokens in bounded batches. */
export async function purgeExpiredTokens(
  tx: Bun.SQL,
  tenantId: string,
  options: { now?: Date; batchLimit?: number } = {}
): Promise<PurgeTokensResult> {
  const now = options.now ?? new Date();
  const batchLimit = Math.min(Math.max(1, options.batchLimit ?? 1000), 5000);

  const rows = (await tx`
    WITH candidates AS (
      SELECT id FROM awcms_micro_newsletter_tokens
      WHERE tenant_id = ${tenantId}
        AND (consumed_at IS NOT NULL OR expires_at < ${now})
      ORDER BY created_at
      LIMIT ${batchLimit}
    )
    DELETE FROM awcms_micro_newsletter_tokens t
    USING candidates
    WHERE t.id = candidates.id AND t.tenant_id = ${tenantId}
    RETURNING t.id
  `) as { id: string }[];

  return { purgedCount: rows.length };
}
