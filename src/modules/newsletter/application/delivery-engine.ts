/**
 * Bounded, resumable per-recipient dispatch (Issue #272, ADR-0033). Runs as the
 * `newsletter:dispatch` worker over `awcms_micro_newsletter_delivery_attempts`
 * (sql/091). Each pass claims up to `batchLimit` queued attempts and, for each,
 * RE-CHECKS suppression + subscriber state at attempt time (belt-and-braces on top
 * of the audience-freeze filter): a still-mailable recipient is marked `sent`
 * (representing hand-off to the email outbox — the actual provider send is a
 * documented follow-up consumer OUTSIDE any DB transaction, ADR-0006); a
 * now-suppressed/unsubscribed one is marked `suppressed` and never mailed.
 *
 * The pass is idempotent + re-entrant: only `queued` rows are claimed, so a crash
 * mid-pass simply resumes on the next run. It NEVER calls a provider inside the DB
 * transaction and NEVER touches a raw address (only email hashes).
 */
export type DispatchBatchResult = {
  processed: number;
  sent: number;
  suppressed: number;
};

export async function processDispatchBatch(
  tx: Bun.SQL,
  tenantId: string,
  campaignId: string,
  batchLimit = 500
): Promise<DispatchBatchResult> {
  const limit = Math.min(Math.max(1, batchLimit), 2000);

  const rows = (await tx`
    WITH batch AS (
      SELECT da.id,
             (sub.state = 'subscribed'
              AND NOT EXISTS (
                SELECT 1 FROM awcms_micro_newsletter_suppressions sup
                WHERE sup.tenant_id = da.tenant_id AND sup.email_hash = da.email_hash
              )) AS mailable
      FROM awcms_micro_newsletter_delivery_attempts da
      JOIN awcms_micro_newsletter_subscribers sub
        ON sub.tenant_id = da.tenant_id AND sub.id = da.subscriber_id
      WHERE da.tenant_id = ${tenantId}
        AND da.campaign_id = ${campaignId}
        AND da.status = 'queued'
      ORDER BY da.created_at
      LIMIT ${limit}
      -- L1: standard outbox-claim — lock only the target rows and skip any a
      -- concurrent dispatch worker already holds, so two workers never claim the
      -- same attempt (no double-send / double-count).
      FOR UPDATE OF da SKIP LOCKED
    )
    UPDATE awcms_micro_newsletter_delivery_attempts d
    SET status = CASE WHEN b.mailable THEN 'sent' ELSE 'suppressed' END,
        attempt_count = d.attempt_count + 1,
        last_attempt_at = now(),
        updated_at = now()
    FROM batch b
    -- Re-assert status='queued' so a row already transitioned by another worker
    -- between select and update is never re-touched.
    WHERE d.id = b.id AND d.tenant_id = ${tenantId} AND d.status = 'queued'
    RETURNING d.status
  `) as { status: string }[];

  let sent = 0;
  let suppressed = 0;
  for (const row of rows) {
    if (row.status === "sent") sent += 1;
    else if (row.status === "suppressed") suppressed += 1;
  }
  return { processed: rows.length, sent, suppressed };
}
