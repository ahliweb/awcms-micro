/**
 * Admin subscriber + consent read models (Issue #272, ADR-0033). MASKED email
 * ONLY — never the raw or decrypted address (that lives solely in the AES-GCM
 * column the email dispatcher reads). Every query runs inside a caller-provided
 * tenant transaction (RLS FORCE'd).
 */
import type { SubscriberState } from "../domain/subscriber-state";

export type AdminSubscriberRow = {
  id: string;
  emailMasked: string;
  locale: string;
  state: SubscriberState;
  confirmedAt: string | null;
  unsubscribedAt: string | null;
  createdAt: string;
};

export async function listSubscribers(
  tx: Bun.SQL,
  tenantId: string,
  options: {
    state?: SubscriberState | null;
    limit?: number;
    beforeCreatedAt?: string | null;
  } = {}
): Promise<{ items: AdminSubscriberRow[]; nextCursor: string | null }> {
  const limit = Math.min(Math.max(1, options.limit ?? 50), 100);
  const before = options.beforeCreatedAt ?? null;
  const state = options.state ?? null;

  const rows = (await tx`
    SELECT id, email_masked, locale, state, confirmed_at, unsubscribed_at, created_at
    FROM awcms_micro_newsletter_subscribers
    WHERE tenant_id = ${tenantId}
      AND (${state}::text IS NULL OR state = ${state}::text)
      AND (${before}::timestamptz IS NULL OR created_at < ${before}::timestamptz)
    ORDER BY created_at DESC
    LIMIT ${limit + 1}
  `) as {
    id: string;
    email_masked: string;
    locale: string;
    state: SubscriberState;
    confirmed_at: string | null;
    unsubscribed_at: string | null;
    created_at: string;
  }[];

  const page = rows.slice(0, limit);
  const nextCursor =
    rows.length > limit ? page[page.length - 1]!.created_at : null;
  return {
    items: page.map((row) => ({
      id: row.id,
      emailMasked: row.email_masked,
      locale: row.locale,
      state: row.state,
      confirmedAt: row.confirmed_at,
      unsubscribedAt: row.unsubscribed_at,
      createdAt: row.created_at
    })),
    nextCursor
  };
}

export type ConsentEventRow = {
  id: string;
  source: string;
  purpose: string;
  locale: string | null;
  policyVersion: string | null;
  occurredAt: string;
};

/** Append-only consent evidence for a subscriber (no raw PII — hashed evidence stays server-side). */
export async function listConsentEvents(
  tx: Bun.SQL,
  tenantId: string,
  subscriberId: string,
  options: { limit?: number } = {}
): Promise<ConsentEventRow[]> {
  const limit = Math.min(Math.max(1, options.limit ?? 100), 200);
  const rows = (await tx`
    SELECT id, source, purpose, locale, policy_version, occurred_at
    FROM awcms_micro_newsletter_consent_events
    WHERE tenant_id = ${tenantId} AND subscriber_id = ${subscriberId}
    ORDER BY occurred_at DESC
    LIMIT ${limit}
  `) as {
    id: string;
    source: string;
    purpose: string;
    locale: string | null;
    policy_version: string | null;
    occurred_at: string;
  }[];
  return rows.map((row) => ({
    id: row.id,
    source: row.source,
    purpose: row.purpose,
    locale: row.locale,
    policyVersion: row.policy_version,
    occurredAt: row.occurred_at
  }));
}
