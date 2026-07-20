/**
 * `newsletter` domain-event type/version constants (Issue #272, ADR-0033). Kept in
 * `domain/` (pure, no imports) so the application producers and the AsyncAPI /
 * `domain-event-runtime` registry parity checks reference the same literals. The
 * matching entries live in `domain-event-runtime/domain/event-type-registry.ts`
 * (kept in sync by convention, not cross-module import) and in
 * `asyncapi/awcms-micro-domain-events.asyncapi.yaml`.
 *
 * Recipient addresses are NEVER carried in these events — a subscriber event
 * references an opaque subscriber id + email HASH only; the email dispatcher
 * resolves the real address from minimized storage at send time. No raw PII.
 */
export const NEWSLETTER_EVENT_VERSION = "1.0";

export const SUBSCRIBER_CONFIRMED_EVENT_TYPE =
  "awcms-micro.newsletter.subscriber.confirmed";
export const SUBSCRIBER_UNSUBSCRIBED_EVENT_TYPE =
  "awcms-micro.newsletter.subscriber.unsubscribed";
export const CAMPAIGN_SCHEDULED_EVENT_TYPE =
  "awcms-micro.newsletter.campaign.scheduled";
export const CAMPAIGN_DISPATCHED_EVENT_TYPE =
  "awcms-micro.newsletter.campaign.dispatched";
export const SUPPRESSION_RECORDED_EVENT_TYPE =
  "awcms-micro.newsletter.suppression.recorded";

export const NEWSLETTER_SUBSCRIBER_AGGREGATE_TYPE = "newsletter.subscriber";
export const NEWSLETTER_CAMPAIGN_AGGREGATE_TYPE = "newsletter.campaign";
