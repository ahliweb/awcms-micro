/**
 * Suppression deny-list data access (Issue #272, ADR-0033) over
 * `awcms_micro_newsletter_suppressions` (sql/091). Enforced BEFORE every send and
 * at audience-freeze time so a suppressed address is never mailed. Keyed by
 * `email_hash` (never a raw address). Every query runs inside a caller-provided
 * tenant transaction (RLS FORCE'd).
 */
export type SuppressionReason =
  "bounce" | "complaint" | "manual" | "unsubscribe";

export type SuppressionRow = {
  id: string;
  emailMasked: string | null;
  reason: SuppressionReason;
  source: string | null;
  occurredAt: string;
};

/** Whether an address (by hash) is on the tenant's suppression list. */
export async function isSuppressed(
  tx: Bun.SQL,
  tenantId: string,
  emailHash: string
): Promise<boolean> {
  const rows = (await tx`
    SELECT 1 FROM awcms_micro_newsletter_suppressions
    WHERE tenant_id = ${tenantId} AND email_hash = ${emailHash}
    LIMIT 1
  `) as unknown[];
  return rows.length > 0;
}

/** Upsert a suppression (dedup-bounded by the DB unique index on (tenant, email_hash)). */
export async function recordSuppression(
  tx: Bun.SQL,
  tenantId: string,
  input: {
    emailHash: string;
    reason: SuppressionReason;
    source: string | null;
    evidence: string | null;
  }
): Promise<void> {
  await tx`
    INSERT INTO awcms_micro_newsletter_suppressions
      (tenant_id, email_hash, reason, source, evidence)
    VALUES (${tenantId}, ${input.emailHash}, ${input.reason}, ${input.source}, ${input.evidence})
    ON CONFLICT (tenant_id, email_hash) DO UPDATE SET
      reason = EXCLUDED.reason,
      source = EXCLUDED.source,
      evidence = EXCLUDED.evidence,
      occurred_at = now()
  `;
}

/** Remove a suppression by hash + reason (used by re-opt-in to lift an `unsubscribe`-reason suppression only). */
export async function removeSuppression(
  tx: Bun.SQL,
  tenantId: string,
  emailHash: string,
  reason: SuppressionReason
): Promise<void> {
  await tx`
    DELETE FROM awcms_micro_newsletter_suppressions
    WHERE tenant_id = ${tenantId} AND email_hash = ${emailHash} AND reason = ${reason}
  `;
}

/** Admin list of suppressions (masked join to subscribers), keyset by occurred_at. */
export async function listSuppressions(
  tx: Bun.SQL,
  tenantId: string,
  options: { limit?: number; beforeOccurredAt?: string | null } = {}
): Promise<{ items: SuppressionRow[]; nextCursor: string | null }> {
  const limit = Math.min(Math.max(1, options.limit ?? 50), 100);
  const before = options.beforeOccurredAt ?? null;
  const rows = (await tx`
    SELECT s.id, s.reason, s.source, s.occurred_at,
           sub.email_masked AS email_masked
    FROM awcms_micro_newsletter_suppressions s
    LEFT JOIN awcms_micro_newsletter_subscribers sub
      ON sub.tenant_id = s.tenant_id AND sub.email_hash = s.email_hash
    WHERE s.tenant_id = ${tenantId}
      AND (${before}::timestamptz IS NULL OR s.occurred_at < ${before}::timestamptz)
    ORDER BY s.occurred_at DESC
    LIMIT ${limit + 1}
  `) as {
    id: string;
    reason: SuppressionReason;
    source: string | null;
    occurred_at: string;
    email_masked: string | null;
  }[];

  const page = rows.slice(0, limit);
  const nextCursor =
    rows.length > limit ? page[page.length - 1]!.occurred_at : null;
  return {
    items: page.map((row) => ({
      id: row.id,
      emailMasked: row.email_masked,
      reason: row.reason,
      source: row.source,
      occurredAt: row.occurred_at
    })),
    nextCursor
  };
}
