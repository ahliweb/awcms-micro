/**
 * The versioned catalog of event types this runtime is aware of (Issue
 * #742 acceptance criterion: "Runtime registry and AsyncAPI event
 * types/versions pass bidirectional parity checks"). `appendDomainEvent`
 * (`application/append-domain-event.ts`) REFUSES to persist an event whose
 * `(eventType, eventVersion)` is not listed here — this is the mechanism
 * (not just documentation) that stops "event types/versions silently
 * drifting" from the published AsyncAPI contract: a new/changed event type
 * must be added HERE first (reviewed source code), which
 * `tests/unit/domain-event-registry-parity.test.ts` then cross-checks
 * against `asyncapi/awcms-micro-domain-events.asyncapi.yaml` in both
 * directions (registry entry without a channel = fail; a channel this
 * runtime's own consumer registry subscribes to without a matching entry
 * here = fail). `module.ts`'s `events.publishes` array (checked by the
 * existing generic `checkModuleEventChannels`,
 * `scripts/api-spec-check.ts`, already part of `bun run check`) covers the
 * SAME direction for the module-descriptor surface every other module
 * already uses — this registry is the finer-grained, runtime-specific
 * complement scoped to events that actually flow through THIS dispatcher.
 *
 * Scope note: this issue ships exactly one registered event type — a
 * self-contained reference/example (`sample.recorded`) used to exercise
 * and prove the outbox/dispatcher/ordering/retry/DLQ/replay mechanism
 * end-to-end, mirroring the accepted "foundation issue ships zero real
 * business integrations" precedent (#643 shipped zero real provider
 * adapters; PR #713 migrated 2 of 8 scripts as proof-of-concept). Future
 * producer modules add their OWN entries here (and their own
 * `module.ts` `events.publishes` entries, and their own AsyncAPI
 * channels) when they start calling `appendDomainEvent` — deliberately
 * NOT done in this PR to keep this foundation issue's blast radius
 * confined to its own module (AGENTS.md rule #1, Atomic).
 */
export type RegisteredDomainEventType = {
  eventType: string;
  eventVersion: string;
  description: string;
};

export const SAMPLE_RECORDED_EVENT_TYPE =
  "awcms-micro.domain-event-runtime.sample.recorded";
export const SAMPLE_RECORDED_EVENT_VERSION = "1.0";

/**
 * Upstream AWCMS-Mini registers further producers here — `workflow_approval`
 * (#747), `organization_structure` (#749), `reference_data` (#750),
 * `document_infrastructure` (#751), `data_exchange` (#752), and
 * `integration_hub` (#754). AWCMS-Micro ports none of those ERP-scope modules
 * (ADR-0025), so their event types are removed rather than left in a catalog
 * no module in this registry can ever publish — which is exactly what
 * `tests/unit/domain-event-registry-parity.test.ts` enforces in both
 * directions against `asyncapi/awcms-micro-domain-events.asyncapi.yaml`.
 *
 * The website modules (`blog_content`, `news_portal`, `social_publishing`,
 * `visitor_analytics`) do not yet publish through this dispatcher; they
 * declare their own `events.publishes` surface in their `module.ts`. When one
 * starts calling `appendDomainEvent`, its entry is added HERE first, together
 * with its AsyncAPI channel.
 */

export const DOMAIN_EVENT_TYPE_REGISTRY: readonly RegisteredDomainEventType[] =
  [
    {
      eventType: SAMPLE_RECORDED_EVENT_TYPE,
      eventVersion: SAMPLE_RECORDED_EVENT_VERSION,
      description:
        "Reference/example event type used to exercise the domain-event-runtime outbox, dispatcher, ordering, retry/backoff, dead-letter, and replay mechanism end-to-end (Issue #742). Real producer modules publish their OWN event types the same way, via appendDomainEvent — this one is intentionally self-contained rather than tied to another module's business logic in this foundation issue."
    },
    // Issue #748 (profile_identity, epic #738 platform-evolution Wave 2) —
    // another real (non-reference) producer registered here. Literal
    // strings match `profile-identity/domain/merge-event.ts`'s
    // `PROFILE_MERGED_EVENT_TYPE`/`PROFILE_MERGED_EVENT_VERSION` constants
    // (kept in sync by convention, not by cross-module import — see that
    // file's own header comment).
    {
      eventType: "awcms-micro.profile-identity.profile.merged",
      eventVersion: "1.0",
      description:
        "Published when a profile merge request is executed: the loser profile is soft-deleted (merged_into_profile_id set) and its awcms_micro_profile_entity_links rows are repointed to the survivor. Lets domain modules react to the merge mapping without importing profile-identity tables directly (see _shared/ports/party-directory-port.ts for the pull-based equivalent)."
    },
    // Issue #271 (comments, ADR-0032) — real (non-reference) producer. Literal
    // strings match `comments/domain/comment-events.ts`'s
    // `COMMENT_SUBMITTED_EVENT_TYPE`/`COMMENT_APPROVED_EVENT_TYPE`/
    // `REPLY_CREATED_EVENT_TYPE` + `COMMENTS_EVENT_VERSION` constants (kept in sync
    // by convention, not cross-module import). Payloads are ADDRESS-FREE (opaque
    // comment/thread ids + resource url + status only); the email dispatcher
    // resolves the encrypted recipient from minimized storage at send time.
    {
      eventType: "awcms-micro.comments.comment.submitted",
      eventVersion: "1.0",
      description:
        "Published when a comment (or reply) is submitted to a thread, whether it starts pending moderation or auto-approves. Lets a reply-notification/email consumer react without reading comments' tables directly. Carries no recipient address."
    },
    {
      eventType: "awcms-micro.comments.comment.approved",
      eventVersion: "1.0",
      description:
        "Published when a comment becomes publicly visible (auto-approved on submit, or approved by a moderator). Drives reply-notification dispatch and read-model updates. Carries no recipient address."
    },
    {
      eventType: "awcms-micro.comments.reply.created",
      eventVersion: "1.0",
      description:
        "Published when a bounded-depth reply to an existing comment is created. Lets a consumer notify subscribers of the parent comment/thread. Carries no recipient address."
    },
    // Issue #272 (newsletter, ADR-0033) — real (non-reference) producer. Literal
    // strings match `newsletter/domain/newsletter-events.ts`'s
    // `SUBSCRIBER_CONFIRMED_EVENT_TYPE`/`SUBSCRIBER_UNSUBSCRIBED_EVENT_TYPE`/
    // `CAMPAIGN_SCHEDULED_EVENT_TYPE`/`CAMPAIGN_DISPATCHED_EVENT_TYPE`/
    // `SUPPRESSION_RECORDED_EVENT_TYPE` + `NEWSLETTER_EVENT_VERSION` constants (kept
    // in sync by convention, not cross-module import). Payloads are ADDRESS-FREE
    // (opaque subscriber/campaign ids + email HASH + counts only); the email
    // dispatcher resolves the encrypted recipient from minimized storage at send
    // time.
    {
      eventType: "awcms-micro.newsletter.subscriber.confirmed",
      eventVersion: "1.0",
      description:
        "Published when a subscriber completes double-opt-in confirmation (pending -> subscribed). Lets a welcome-email/CRM consumer react without reading newsletter's tables directly. Carries no recipient address (subscriber id + email hash only)."
    },
    {
      eventType: "awcms-micro.newsletter.subscriber.unsubscribed",
      eventVersion: "1.0",
      description:
        "Published when a subscriber unsubscribes (one-click/token). Lets a consumer stop future sends and reconcile downstream lists. Carries no recipient address (subscriber id + email hash only)."
    },
    {
      eventType: "awcms-micro.newsletter.campaign.scheduled",
      eventVersion: "1.0",
      description:
        "Published when a campaign/digest draft is moved into the scheduled state. Lets a scheduling/observability consumer react. Carries the campaign id + kind only."
    },
    {
      eventType: "awcms-micro.newsletter.campaign.dispatched",
      eventVersion: "1.0",
      description:
        "Published when a scheduled campaign/digest is dispatched: its audience snapshot is frozen and per-recipient sends are enqueued. Drives the email outbox consumer that performs the actual sends OUTSIDE any DB transaction. Carries the campaign id + kind + audience count (no addresses)."
    },
    {
      eventType: "awcms-micro.newsletter.suppression.recorded",
      eventVersion: "1.0",
      description:
        "Published when a verified provider bounce/complaint records a suppression against a subscriber. Lets a deliverability/consumer react. Carries subscriber id + email hash + reason only (no recipient address)."
    }
  ];

export function isRegisteredDomainEventType(
  eventType: string,
  eventVersion: string
): boolean {
  return DOMAIN_EVENT_TYPE_REGISTRY.some(
    (entry) =>
      entry.eventType === eventType && entry.eventVersion === eventVersion
  );
}
