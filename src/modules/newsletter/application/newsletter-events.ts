/**
 * Newsletter domain events through the transactional outbox (Issue #272,
 * ADR-0033). `appendDomainEvent` (same-commit, ADR-0006 — no provider call here).
 * Every payload is ADDRESS-FREE: a subscriber event carries only the opaque
 * subscriber id + email HASH; a campaign event carries only the campaign id +
 * counts. The email dispatcher resolves the encrypted recipient from minimized
 * storage at send time, OUTSIDE any DB transaction. NEVER a raw address.
 */
import { appendDomainEvent } from "../../domain-event-runtime/application/append-domain-event";
import {
  CAMPAIGN_DISPATCHED_EVENT_TYPE,
  CAMPAIGN_SCHEDULED_EVENT_TYPE,
  NEWSLETTER_CAMPAIGN_AGGREGATE_TYPE,
  NEWSLETTER_EVENT_VERSION,
  NEWSLETTER_SUBSCRIBER_AGGREGATE_TYPE,
  SUBSCRIBER_CONFIRMED_EVENT_TYPE,
  SUBSCRIBER_UNSUBSCRIBED_EVENT_TYPE,
  SUPPRESSION_RECORDED_EVENT_TYPE
} from "../domain/newsletter-events";

const NEWSLETTER_PRODUCER_MODULE = "newsletter";

export type SubscriberEventInput = {
  eventType:
    | typeof SUBSCRIBER_CONFIRMED_EVENT_TYPE
    | typeof SUBSCRIBER_UNSUBSCRIBED_EVENT_TYPE
    | typeof SUPPRESSION_RECORDED_EVENT_TYPE;
  subscriberId: string;
  /** sha256 email hash (`sha256:<hex>`) — NEVER a raw address. */
  emailHash: string;
  reason?: string | null;
  correlationId?: string | null;
};

export async function appendSubscriberEvent(
  tx: Bun.SQL,
  tenantId: string,
  input: SubscriberEventInput
): Promise<void> {
  await appendDomainEvent(tx, tenantId, {
    eventType: input.eventType,
    eventVersion: NEWSLETTER_EVENT_VERSION,
    aggregateType: NEWSLETTER_SUBSCRIBER_AGGREGATE_TYPE,
    aggregateId: input.subscriberId,
    producerModule: NEWSLETTER_PRODUCER_MODULE,
    correlationId: input.correlationId ?? null,
    payload: {
      subscriberId: input.subscriberId,
      emailHash: input.emailHash,
      reason: input.reason ?? null
    }
  });
}

export type CampaignEventInput = {
  eventType:
    | typeof CAMPAIGN_SCHEDULED_EVENT_TYPE
    | typeof CAMPAIGN_DISPATCHED_EVENT_TYPE;
  campaignId: string;
  kind: string;
  audienceCount?: number | null;
  correlationId?: string | null;
  actorTenantUserId?: string | null;
};

export async function appendCampaignEvent(
  tx: Bun.SQL,
  tenantId: string,
  input: CampaignEventInput
): Promise<void> {
  await appendDomainEvent(tx, tenantId, {
    eventType: input.eventType,
    eventVersion: NEWSLETTER_EVENT_VERSION,
    aggregateType: NEWSLETTER_CAMPAIGN_AGGREGATE_TYPE,
    aggregateId: input.campaignId,
    producerModule: NEWSLETTER_PRODUCER_MODULE,
    correlationId: input.correlationId ?? null,
    actorTenantUserId: input.actorTenantUserId ?? null,
    payload: {
      campaignId: input.campaignId,
      kind: input.kind,
      audienceCount: input.audienceCount ?? null
    }
  });
}
