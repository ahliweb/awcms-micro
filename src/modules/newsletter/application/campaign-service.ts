/**
 * Campaign / digest lifecycle (Issue #272, ADR-0033): compose -> validate ->
 * schedule -> dispatch -> complete/cancel. Every query runs inside a caller-
 * provided tenant transaction (RLS FORCE'd). Dispatch FREEZES an explainable
 * audience snapshot (criteria + frozen member list + count) BEFORE delivery, and
 * enqueues per-recipient `delivery_attempts` rows so the actual send (a documented
 * follow-up outbox consumer, ADR-0006 — never called inside a DB transaction) is
 * resumable, idempotent, and bounded. Suppression is enforced at freeze time AND
 * again at attempt time (`delivery-engine.ts`). No raw address ever appears here.
 */
import {
  applyCampaignAction,
  type CampaignStatus
} from "../domain/campaign-status";
import {
  CAMPAIGN_DISPATCHED_EVENT_TYPE,
  CAMPAIGN_SCHEDULED_EVENT_TYPE
} from "../domain/newsletter-events";
import { appendCampaignEvent } from "./newsletter-events";

export type CampaignKind = "campaign" | "digest";

export type CampaignSummary = {
  id: string;
  kind: CampaignKind;
  status: CampaignStatus;
  subject: string;
  locale: string;
  topicId: string | null;
  scheduledAt: string | null;
  audienceSnapshotId: string | null;
  createdAt: string;
  updatedAt: string;
};

type CampaignRow = {
  id: string;
  kind: CampaignKind;
  status: CampaignStatus;
  subject: string;
  body_text: string;
  body_html_source: string | null;
  locale: string;
  topic_id: string | null;
  scheduled_at: string | null;
  audience_snapshot_id: string | null;
  created_at: string;
  updated_at: string;
};

const CAMPAIGN_COLUMNS =
  "id, kind, status, subject, body_text, body_html_source, locale, topic_id, " +
  "scheduled_at, audience_snapshot_id, created_at, updated_at";

function toSummary(row: CampaignRow): CampaignSummary {
  return {
    id: row.id,
    kind: row.kind,
    status: row.status,
    subject: row.subject,
    locale: row.locale,
    topicId: row.topic_id,
    scheduledAt: row.scheduled_at,
    audienceSnapshotId: row.audience_snapshot_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function createCampaign(
  tx: Bun.SQL,
  tenantId: string,
  input: {
    kind: CampaignKind;
    subject: string;
    bodyText: string;
    bodyHtmlSource: string | null;
    locale: string;
    topicId: string | null;
    scheduledAt: Date | null;
    createdBy: string | null;
  }
): Promise<CampaignSummary> {
  const rows = (await tx`
    INSERT INTO awcms_micro_newsletter_campaigns
      (tenant_id, kind, status, subject, body_text, body_html_source, locale,
       topic_id, scheduled_at, created_by)
    VALUES (${tenantId}, ${input.kind}, 'draft', ${input.subject}, ${input.bodyText},
            ${input.bodyHtmlSource}, ${input.locale}, ${input.topicId},
            ${input.scheduledAt}, ${input.createdBy})
    RETURNING ${tx.unsafe(CAMPAIGN_COLUMNS)}
  `) as CampaignRow[];
  return toSummary(rows[0]!);
}

export async function updateCampaign(
  tx: Bun.SQL,
  tenantId: string,
  campaignId: string,
  input: {
    subject: string;
    bodyText: string;
    bodyHtmlSource: string | null;
    topicId: string | null;
    scheduledAt: Date | null;
  }
): Promise<CampaignSummary | { error: "not_found" | "not_editable" }> {
  const current = (await tx`
    SELECT status FROM awcms_micro_newsletter_campaigns
    WHERE tenant_id = ${tenantId} AND id = ${campaignId}
  `) as { status: CampaignStatus }[];
  if (!current[0]) return { error: "not_found" };
  if (current[0].status !== "draft") return { error: "not_editable" };

  const rows = (await tx`
    UPDATE awcms_micro_newsletter_campaigns
    SET subject = ${input.subject},
        body_text = ${input.bodyText},
        body_html_source = ${input.bodyHtmlSource},
        topic_id = ${input.topicId},
        scheduled_at = ${input.scheduledAt},
        updated_at = now()
    WHERE tenant_id = ${tenantId} AND id = ${campaignId}
    RETURNING ${tx.unsafe(CAMPAIGN_COLUMNS)}
  `) as CampaignRow[];
  return toSummary(rows[0]!);
}

export async function getCampaign(
  tx: Bun.SQL,
  tenantId: string,
  campaignId: string
): Promise<
  | (CampaignSummary & {
      deliveryStats: Record<string, number>;
      bodyHtmlSource: string | null;
    })
  | null
> {
  const rows = (await tx`
    SELECT ${tx.unsafe(CAMPAIGN_COLUMNS)}
    FROM awcms_micro_newsletter_campaigns
    WHERE tenant_id = ${tenantId} AND id = ${campaignId}
  `) as CampaignRow[];
  if (!rows[0]) return null;

  const statRows = (await tx`
    SELECT status, count(*)::int AS n
    FROM awcms_micro_newsletter_delivery_attempts
    WHERE tenant_id = ${tenantId} AND campaign_id = ${campaignId}
    GROUP BY status
  `) as { status: string; n: number }[];
  const deliveryStats: Record<string, number> = {};
  for (const s of statRows) deliveryStats[s.status] = s.n;

  return {
    ...toSummary(rows[0]),
    bodyHtmlSource: rows[0].body_html_source,
    deliveryStats
  };
}

export async function listCampaigns(
  tx: Bun.SQL,
  tenantId: string,
  options: { limit?: number; beforeCreatedAt?: string | null } = {}
): Promise<{ items: CampaignSummary[]; nextCursor: string | null }> {
  const limit = Math.min(Math.max(1, options.limit ?? 25), 100);
  const before = options.beforeCreatedAt ?? null;
  const rows = (await tx`
    SELECT ${tx.unsafe(CAMPAIGN_COLUMNS)}
    FROM awcms_micro_newsletter_campaigns
    WHERE tenant_id = ${tenantId}
      AND (${before}::timestamptz IS NULL OR created_at < ${before}::timestamptz)
    ORDER BY created_at DESC
    LIMIT ${limit + 1}
  `) as CampaignRow[];
  const page = rows.slice(0, limit);
  const nextCursor =
    rows.length > limit ? page[page.length - 1]!.created_at : null;
  return { items: page.map(toSummary), nextCursor };
}

export type CampaignTransitionOutcome =
  | { ok: true; status: CampaignStatus }
  | { ok: false; reason: "not_found" | "illegal_transition" };

export async function scheduleCampaign(
  tx: Bun.SQL,
  tenantId: string,
  campaignId: string,
  input: { scheduledAt: Date | null; correlationId?: string | null }
): Promise<CampaignTransitionOutcome> {
  const rows = (await tx`
    SELECT status, kind FROM awcms_micro_newsletter_campaigns
    WHERE tenant_id = ${tenantId} AND id = ${campaignId}
  `) as { status: CampaignStatus; kind: string }[];
  if (!rows[0]) return { ok: false, reason: "not_found" };

  const transition = applyCampaignAction(rows[0].status, "schedule");
  if (!transition.ok) return { ok: false, reason: "illegal_transition" };

  await tx`
    UPDATE awcms_micro_newsletter_campaigns
    SET status = 'scheduled', scheduled_at = ${input.scheduledAt}, updated_at = now()
    WHERE tenant_id = ${tenantId} AND id = ${campaignId}
  `;
  await appendCampaignEvent(tx, tenantId, {
    eventType: CAMPAIGN_SCHEDULED_EVENT_TYPE,
    campaignId,
    kind: rows[0].kind,
    correlationId: input.correlationId ?? null
  });
  return { ok: true, status: "scheduled" };
}

export async function cancelCampaign(
  tx: Bun.SQL,
  tenantId: string,
  campaignId: string
): Promise<CampaignTransitionOutcome> {
  const rows = (await tx`
    SELECT status FROM awcms_micro_newsletter_campaigns
    WHERE tenant_id = ${tenantId} AND id = ${campaignId}
  `) as { status: CampaignStatus }[];
  if (!rows[0]) return { ok: false, reason: "not_found" };

  const transition = applyCampaignAction(rows[0].status, "cancel");
  if (!transition.ok) return { ok: false, reason: "illegal_transition" };

  await tx`
    UPDATE awcms_micro_newsletter_campaigns
    SET status = 'cancelled', updated_at = now()
    WHERE tenant_id = ${tenantId} AND id = ${campaignId}
  `;
  return { ok: true, status: "cancelled" };
}

export type DispatchOutcome =
  | {
      ok: true;
      status: CampaignStatus;
      audienceSnapshotId: string;
      audienceCount: number;
    }
  | { ok: false; reason: "not_found" | "illegal_transition" };

/**
 * Move a scheduled campaign into dispatching: FREEZE an explainable audience
 * snapshot (confirmed + mailable + not-suppressed recipients of the campaign's
 * topic), materialize the frozen member list + count, and enqueue one queued
 * `delivery_attempts` row per member (dedup-bounded, so a re-run is resumable).
 * Publishes `newsletter.campaign.dispatched`. The actual per-recipient send is the
 * `newsletter:dispatch` job / email outbox consumer, OUTSIDE any DB transaction.
 */
export async function dispatchCampaign(
  tx: Bun.SQL,
  tenantId: string,
  campaignId: string,
  options: { correlationId?: string | null } = {}
): Promise<DispatchOutcome> {
  const rows = (await tx`
    SELECT status, kind, topic_id, locale FROM awcms_micro_newsletter_campaigns
    WHERE tenant_id = ${tenantId} AND id = ${campaignId}
  `) as {
    status: CampaignStatus;
    kind: string;
    topic_id: string | null;
    locale: string;
  }[];
  if (!rows[0]) return { ok: false, reason: "not_found" };

  const transition = applyCampaignAction(rows[0].status, "dispatch");
  if (!transition.ok) return { ok: false, reason: "illegal_transition" };
  const topicId = rows[0].topic_id;

  // Freeze the audience: confirmed subscriptions of mailable subscribers, minus
  // anyone on the suppression list. Topic-scoped when the campaign targets one.
  const members = (await tx`
    SELECT DISTINCT sub.id AS subscriber_id, sub.email_hash
    FROM awcms_micro_newsletter_subscriptions s
    JOIN awcms_micro_newsletter_subscribers sub
      ON sub.tenant_id = s.tenant_id AND sub.id = s.subscriber_id
    WHERE s.tenant_id = ${tenantId}
      AND s.state = 'confirmed'
      AND sub.state = 'subscribed'
      AND (${topicId}::uuid IS NULL OR s.topic_id = ${topicId}::uuid)
      AND NOT EXISTS (
        SELECT 1 FROM awcms_micro_newsletter_suppressions sup
        WHERE sup.tenant_id = s.tenant_id AND sup.email_hash = sub.email_hash
      )
  `) as { subscriber_id: string; email_hash: string }[];

  const snapshotRows = (await tx`
    INSERT INTO awcms_micro_newsletter_audience_snapshots
      (tenant_id, campaign_id, criteria, subscriber_count, evidence)
    VALUES (${tenantId}, ${campaignId},
            ${{ topicId, mailableOnly: true, suppressionExcluded: true }}::jsonb,
            ${members.length}, 'Frozen at dispatch: confirmed + subscribed + not suppressed')
    RETURNING id
  `) as { id: string }[];
  const snapshotId = snapshotRows[0]!.id;

  for (const m of members) {
    await tx`
      INSERT INTO awcms_micro_newsletter_audience_members
        (tenant_id, snapshot_id, subscriber_id, email_hash)
      VALUES (${tenantId}, ${snapshotId}, ${m.subscriber_id}, ${m.email_hash})
    `;
    await tx`
      INSERT INTO awcms_micro_newsletter_delivery_attempts
        (tenant_id, campaign_id, subscriber_id, email_hash, status)
      VALUES (${tenantId}, ${campaignId}, ${m.subscriber_id}, ${m.email_hash}, 'queued')
      ON CONFLICT (tenant_id, campaign_id, subscriber_id) DO NOTHING
    `;
  }

  await tx`
    UPDATE awcms_micro_newsletter_campaigns
    SET status = 'dispatching', audience_snapshot_id = ${snapshotId}, updated_at = now()
    WHERE tenant_id = ${tenantId} AND id = ${campaignId}
  `;

  await appendCampaignEvent(tx, tenantId, {
    eventType: CAMPAIGN_DISPATCHED_EVENT_TYPE,
    campaignId,
    kind: rows[0].kind,
    audienceCount: members.length,
    correlationId: options.correlationId ?? null
  });

  return {
    ok: true,
    status: "dispatching",
    audienceSnapshotId: snapshotId,
    audienceCount: members.length
  };
}

export type ReconciliationResult = {
  discrepancyCount: number;
  runId: string;
};

/**
 * Compare a dispatched campaign's frozen audience against its delivery outcomes
 * and record an evidence row. A discrepancy = a frozen member without a terminal
 * delivery outcome (still queued). When zero remain, the caller marks the campaign
 * completed.
 */
export async function runReconciliation(
  tx: Bun.SQL,
  tenantId: string,
  campaignId: string
): Promise<ReconciliationResult> {
  const rows = (await tx`
    SELECT
      (SELECT count(*)::int FROM awcms_micro_newsletter_delivery_attempts
        WHERE tenant_id = ${tenantId} AND campaign_id = ${campaignId}) AS total,
      (SELECT count(*)::int FROM awcms_micro_newsletter_delivery_attempts
        WHERE tenant_id = ${tenantId} AND campaign_id = ${campaignId} AND status = 'queued') AS pending
  `) as { total: number; pending: number }[];
  const total = rows[0]?.total ?? 0;
  const pending = rows[0]?.pending ?? 0;

  const runRows = (await tx`
    INSERT INTO awcms_micro_newsletter_reconciliation_runs
      (tenant_id, campaign_id, evidence, discrepancy_count)
    VALUES (${tenantId}, ${campaignId},
            ${{ total, pending }}::jsonb, ${pending})
    RETURNING id
  `) as { id: string }[];

  if (pending === 0 && total > 0) {
    await tx`
      UPDATE awcms_micro_newsletter_campaigns
      SET status = 'completed', updated_at = now()
      WHERE tenant_id = ${tenantId} AND id = ${campaignId} AND status = 'dispatching'
    `;
  }

  return { discrepancyCount: pending, runId: runRows[0]!.id };
}
