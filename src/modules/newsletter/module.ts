import { defineModule } from "../_shared/module-contract";
import {
  NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
  NEWSLETTER_MODULE_KEY,
  NEWSLETTER_SUBSCRIBERS_ACTIVITY_CODE,
  NEWSLETTER_SUPPRESSION_ACTIVITY_CODE,
  NEWSLETTER_TOPICS_ACTIVITY_CODE
} from "./domain/newsletter-permissions";
import {
  CAMPAIGN_DISPATCHED_EVENT_TYPE,
  CAMPAIGN_SCHEDULED_EVENT_TYPE,
  SUBSCRIBER_CONFIRMED_EVENT_TYPE,
  SUBSCRIBER_UNSUBSCRIBED_EVENT_TYPE,
  SUPPRESSION_RECORDED_EVENT_TYPE
} from "./domain/newsletter-events";

/** data_lifecycle registry keys for `newsletter`'s anonymizable/purgeable tables. */
export const NEWSLETTER_SUBSCRIBERS_LIFECYCLE_KEY = "newsletter.subscribers";
export const NEWSLETTER_DELIVERY_ATTEMPTS_LIFECYCLE_KEY =
  "newsletter.delivery_attempts";
export const NEWSLETTER_PROVIDER_EVENTS_LIFECYCLE_KEY =
  "newsletter.provider_events";
export const NEWSLETTER_TOKENS_LIFECYCLE_KEY = "newsletter.tokens";

/**
 * `newsletter` — Official Optional Module admitted by ADR-0033 (Issue #272, epic
 * #261 Wave 2). Admission + first runtime code land together in this PR, bumping
 * the base registry 21 → 22 (`EXPECTED_BASE_MODULE_COUNT` in
 * scripts/scope-consistency-check.ts, regenerated inventories).
 *
 * ## What this module OWNS
 *
 * A tenant-scoped, CONSENT-FIRST, ANTI-ENUMERATION newsletter / subscription-list
 * system: topics/lists, double-opt-in subscribers (sql/091, RLS FORCE'd, address
 * stored MINIMIZED — sha256 hash + mask + AES-GCM ciphertext, never raw),
 * per-topic subscriptions, append-only consent + state-transition + provider
 * ledgers, single-use expiring tokens, a bounce/complaint/unsubscribe suppression
 * deny-list, and the campaign/digest lifecycle (draft → schedule → dispatch →
 * complete/cancel) with a frozen, explainable audience snapshot, resumable
 * per-recipient delivery attempts, and reconciliation. It serves the PUBLIC
 * subscribe/confirm/preferences/unsubscribe/resubscribe/provider-callback API and
 * the ABAC-guarded, audited admin API under `/api/v1/newsletter/*`.
 *
 * ## Anti-enumeration is a HARD requirement (ADR-0033 §5)
 *
 * Every PUBLIC flow returns an IDENTICAL generic response whether an address is
 * new, pending, subscribed, suppressed, or belongs to another tenant — no
 * existence/suppression/tenant-membership oracle, no timing oracle, no raw PII in
 * any response/log/event (hash + mask only). Confirm/unsubscribe use single-use,
 * sha256-hashed, constant-time-verified tokens.
 *
 * ## Direction of the arrow (ADR-0033 §2) — depends on nothing but Core
 *
 * `newsletter` is the CONSUMER/aggregator: content modules PROVIDE reviewed,
 * pure-data `NewsletterContentSourceDescriptor`s via
 * `ModuleDescriptor.newsletterContentSources` (declarative table/column mapping +
 * publication filter + a declarative publish-event LABEL — never an executable
 * extractor), which this module's generic engine reads through `listModules()`. It
 * does NOT declare a `newsletter_content_source` capability `provides` (that would
 * trip `capability_provider_conflict`) — the descriptor-list riding `listModules()`
 * is the multi-provider, derived-safe seam (`site_search`/`comments` precedent). No
 * existing module depends on `newsletter`, and its lifecycle `dependencies` are
 * ONLY the two Core modules, so the DAG is a clean inward leaf.
 *
 * ## Email is CONSUMED via events/outbox, not a hard dependency (ADR-0033 §4)
 *
 * Campaign/digest delivery is enqueued as per-recipient `delivery_attempts` rows +
 * address-free domain events (`domain_event_runtime` outbox, same-commit,
 * ADR-0006); the email dispatcher (documented follow-up consumer) resolves the
 * ENCRYPTED recipient at send time, OUTSIDE any DB transaction. Recipient addresses
 * are NEVER carried in an event/response/log.
 */
export const newsletterModule = defineModule({
  key: NEWSLETTER_MODULE_KEY,
  name: "Newsletter",
  version: "0.1.0",
  status: "active",
  description:
    "Tenant-scoped, CONSENT-FIRST, ANTI-ENUMERATION newsletter / subscription-list system (ADR-0033, Official Optional Module). Owns topics/lists, double-opt-in subscribers (sql/091 — RLS FORCE'd, address stored MINIMIZED: sha256 hash + mask + AES-GCM ciphertext, never raw; normalized-hash uniqueness), per-topic subscriptions, append-only consent + state-transition + provider ledgers, single-use expiring sha256-hashed tokens (constant-time verified), a bounce/complaint/manual/unsubscribe suppression deny-list enforced BEFORE every send, and the campaign/digest lifecycle (draft → schedule → dispatch → complete/cancel) with a frozen, explainable audience snapshot (criteria + member list + count), resumable/idempotent/bounded per-recipient delivery attempts, and reconciliation. It is the CONSUMER/aggregator of reviewed, pure-data `NewsletterContentSourceDescriptor`s that content modules declare via `ModuleDescriptor.newsletterContentSources` (declarative table/column mapping + publication filter + declarative publish-event label — never an executable extractor or tenant SQL); the generic engine reads them through `listModules()`, so base AND derived content types can seed digests without this module knowing any specific one and without a content module depending on `newsletter`. Every PUBLIC flow (subscribe/confirm/preferences/unsubscribe/resubscribe/provider-callback) returns an IDENTICAL generic response regardless of whether an address exists / is pending / is subscribed / is suppressed / belongs to another tenant — no existence/suppression/tenant/timing oracle, and no raw PII (email) in any response/log/event (hash + mask only). Provider callbacks are signature + replay verified BEFORE being trusted; browser redirects are never trusted. Campaign delivery is enqueued as per-recipient delivery_attempts + address-free domain events through the outbox; the email dispatcher resolves the encrypted recipient at send time OUTSIDE any DB transaction (ADR-0006). The admin API (topics CRUD, masked subscriber list, consent evidence, suppression list + manual add, campaign/digest compose + safe preview + schedule + dispatch + cancel + delivery status + reconciliation) is ABAC-guarded, audited with reason codes, idempotency-keyed on high-risk mutations, and observable. A legal-hold-aware retention sweep (`bun run newsletter:retention`) anonymizes aged unsubscribed/suppressed subscribers and purges expired tokens; a bounded, resumable dispatch sweep (`bun run newsletter:dispatch`) processes queued deliveries + reconciliation. The newsletter surface is never an authorization source for the underlying content.",
  dependencies: ["tenant_admin", "identity_access"],
  type: "domain",
  api: {
    openApiPath: "openapi/awcms-micro-public-api.openapi.yaml",
    basePath: "/api/v1/newsletter"
  },
  events: {
    asyncApiPath: "asyncapi/awcms-micro-domain-events.asyncapi.yaml",
    publishes: [
      SUBSCRIBER_CONFIRMED_EVENT_TYPE,
      SUBSCRIBER_UNSUBSCRIBED_EVENT_TYPE,
      CAMPAIGN_SCHEDULED_EVENT_TYPE,
      CAMPAIGN_DISPATCHED_EVENT_TYPE,
      SUPPRESSION_RECORDED_EVENT_TYPE
    ]
  },
  navigation: [
    {
      labelKey: "admin.newsletter.nav_label",
      path: "/admin/newsletter",
      group: "content",
      order: 62,
      requiredPermission: "newsletter.campaigns.read"
    }
  ],
  permissions: [
    {
      activityCode: NEWSLETTER_SUBSCRIBERS_ACTIVITY_CODE,
      action: "read",
      description:
        "Read this tenant's subscribers with MASKED email only (never raw/decrypted) plus append-only consent evidence"
    },
    {
      activityCode: NEWSLETTER_TOPICS_ACTIVITY_CODE,
      action: "read",
      description: "Read this tenant's newsletter topics / subscription lists"
    },
    {
      activityCode: NEWSLETTER_TOPICS_ACTIVITY_CODE,
      action: "create",
      description: "Create a newsletter topic / subscription list — audited"
    },
    {
      activityCode: NEWSLETTER_TOPICS_ACTIVITY_CODE,
      action: "update",
      description: "Update or deactivate a newsletter topic — audited"
    },
    {
      activityCode: NEWSLETTER_SUPPRESSION_ACTIVITY_CODE,
      action: "read",
      description:
        "Read this tenant's suppression (bounce/complaint/manual/unsubscribe) deny-list"
    },
    {
      activityCode: NEWSLETTER_SUPPRESSION_ACTIVITY_CODE,
      action: "create",
      description: "Add a manual suppression entry — high-risk, audited"
    },
    {
      activityCode: NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
      action: "read",
      description:
        "Read this tenant's campaigns/digests, delivery status, and reconciliation runs"
    },
    {
      activityCode: NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
      action: "create",
      description: "Create/compose a campaign or digest draft — audited"
    },
    {
      activityCode: NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
      action: "update",
      description:
        "Update a draft campaign/digest (subject, body, topic, schedule time) — audited"
    },
    {
      activityCode: NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
      action: "schedule",
      description:
        "Move a draft campaign/digest into the scheduled state — audited"
    },
    {
      activityCode: NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
      action: "send",
      description:
        "Dispatch a scheduled campaign/digest: freeze the audience snapshot and enqueue per-recipient sends — high-risk, idempotency-keyed, audited"
    },
    {
      activityCode: NEWSLETTER_CAMPAIGNS_ACTIVITY_CODE,
      action: "cancel",
      description:
        "Cancel a scheduled or dispatching campaign/digest — high-risk, audited"
    }
  ],
  jobs: [
    {
      command: "bun run newsletter:dispatch",
      purpose:
        "Bounded, resumable per-tenant dispatch sweep: process queued delivery_attempts for dispatching campaigns/digests (re-checking suppression + subscriber state at attempt time, marking sent vs suppressed), then reconcile the frozen audience against outcomes and complete a campaign once no queued rows remain. Enqueues to the email outbox — never calls a provider inside a DB transaction (ADR-0006).",
      recommendedSchedule: "every 1-5 minutes (off-peak batches)",
      safeInOfflineLan: false
    },
    {
      command: "bun run newsletter:retention",
      purpose:
        "Bounded, per-tenant retention sweep: anonymize the recoverable address of aged unsubscribed/suppressed subscribers (retaining the row + append-only consent/state history), and hard-delete expired/consumed double-opt-in tokens. Skips a tenant whose subscribers descriptor is under an active legal hold (legal hold overrides retention).",
      recommendedSchedule: "daily (off-peak)",
      safeInOfflineLan: true
    }
  ],
  dataLifecycle: [
    {
      key: NEWSLETTER_SUBSCRIBERS_LIFECYCLE_KEY,
      tableName: "awcms_micro_newsletter_subscribers",
      ownerModuleKey: NEWSLETTER_MODULE_KEY,
      scope: "tenant",
      cursorColumn: "created_at",
      retentionClass: "communication_log",
      retentionMinDays: 90,
      retentionMaxDays: 3650,
      defaultRetentionDays: 365,
      partition: {
        eligible: false,
        rationale:
          "Consent-bearing subscriber rows updated in place (state transitions, confirm/unsubscribe), so NOT a safe age-based range-partition candidate. Retention here is anonymization (NULL the recoverable address) of aged unsubscribed/suppressed rows, not deletion — owned by the newsletter:retention job."
      },
      archive: {
        archivable: false,
        rationale:
          "Minimized subscriber identity (hash + mask + encrypted ref) — retaining a recipient reference longer via an archive would work against the module's privacy posture; retention minimizes in place."
      },
      deletion: {
        mode: "anonymize",
        rationale:
          "The retention sweep NULLs the recoverable address of aged unsubscribed/suppressed subscribers (retaining the row + append-only consent/state history) — a privacy minimization, never a hard delete, so history stays coherent and re-suppression by hash still holds."
      },
      legalHold: { applicable: true, precedence: "overrides_retention" },
      requiredIndexes: [
        {
          columns: ["tenant_id", "created_at"],
          purpose:
            "awcms_micro_newsletter_subscribers_created_idx (sql/091) — the (tenant, cursor) composite data_lifecycle reads for dry-run counts; the retention job's aged-candidate scan uses the (tenant, state, created_at) index."
        }
      ],
      batchLimit: 5000,
      backupRestoreNotes:
        "Included in ordinary full-database backup/restore; no standalone archive artifact. A restore reinstates subscribers in their last-persisted (possibly anonymized) state.",
      executionMode: "delegated",
      existingAdopter: {
        jobCommand: "bun run newsletter:retention",
        purgeFunctionRef:
          "src/modules/newsletter/application/subscriber-retention.ts#anonymizeAgedSubscribers",
        description:
          "Anonymizes (NULLs the recoverable address of) unsubscribed/suppressed subscribers older than NEWSLETTER_RETENTION_DAYS (default 365d) in bounded batches, skipping a tenant under an active legal hold on this descriptor. data_lifecycle may read this table for dry-run counts (read-only); the retention job owns all mutation."
      }
    },
    {
      key: NEWSLETTER_DELIVERY_ATTEMPTS_LIFECYCLE_KEY,
      tableName: "awcms_micro_newsletter_delivery_attempts",
      ownerModuleKey: NEWSLETTER_MODULE_KEY,
      scope: "tenant",
      cursorColumn: "created_at",
      retentionClass: "communication_log",
      retentionMinDays: 30,
      retentionMaxDays: 1095,
      defaultRetentionDays: 180,
      partition: {
        eligible: false,
        rationale:
          "High-volume per-recipient delivery rows, but bounded per campaign; a moderate retention window plus the (tenant, created_at) index keeps the age-based purge cheap without partitioning."
      },
      archive: {
        archivable: false,
        rationale:
          "Operational delivery telemetry (status + hashes + provider ids) — not a durable archive candidate; simply purged when stale."
      },
      deletion: {
        mode: "hard_delete",
        rationale:
          "An age-based DELETE of stale per-recipient delivery rows — nothing references them once a campaign is long completed and reconciled."
      },
      legalHold: { applicable: false, precedence: "not_applicable" },
      requiredIndexes: [
        {
          columns: ["tenant_id", "created_at"],
          purpose:
            "awcms_micro_newsletter_delivery_attempts_created_idx (sql/091) — the (tenant, cursor) composite the generic purge engine filters + orders by."
        }
      ],
      batchLimit: 5000,
      backupRestoreNotes:
        "No special implications: purgeable delivery telemetry. A restore that omits this table loses only historical per-recipient delivery outcomes.",
      executionMode: "generic"
    },
    {
      key: NEWSLETTER_PROVIDER_EVENTS_LIFECYCLE_KEY,
      tableName: "awcms_micro_newsletter_provider_events",
      ownerModuleKey: NEWSLETTER_MODULE_KEY,
      scope: "tenant",
      cursorColumn: "occurred_at",
      retentionClass: "system_event",
      retentionMinDays: 30,
      retentionMaxDays: 1095,
      defaultRetentionDays: 180,
      partition: {
        eligible: false,
        rationale:
          "Append-only provider callback ledger (provider + type + dedupe + hash), bounded by delivery volume; a moderate retention window plus the (tenant, occurred_at) index keeps the age-based purge cheap without partitioning."
      },
      archive: {
        archivable: false,
        rationale:
          "Minimized provider telemetry (hashes only, no raw PII) — not a durable archive candidate; simply purged when stale."
      },
      deletion: {
        mode: "hard_delete",
        rationale:
          "An age-based DELETE of stale provider callback rows — nothing references them once their suppression effect is applied."
      },
      legalHold: { applicable: false, precedence: "not_applicable" },
      requiredIndexes: [
        {
          columns: ["tenant_id", "occurred_at"],
          purpose:
            "awcms_micro_newsletter_provider_events_occurred_idx (sql/091) — the (tenant, cursor) composite the generic purge engine filters + orders by."
        }
      ],
      batchLimit: 5000,
      backupRestoreNotes:
        "No special implications: minimized, purgeable provider telemetry. A restore that omits this table loses only historical provider callbacks (suppressions themselves persist).",
      executionMode: "generic"
    },
    {
      key: NEWSLETTER_TOKENS_LIFECYCLE_KEY,
      tableName: "awcms_micro_newsletter_tokens",
      ownerModuleKey: NEWSLETTER_MODULE_KEY,
      scope: "tenant",
      cursorColumn: "created_at",
      retentionClass: "operational_queue",
      retentionMinDays: 7,
      retentionMaxDays: 400,
      defaultRetentionDays: 30,
      partition: {
        eligible: false,
        rationale:
          "Short-lived single-use double-opt-in tokens (hash + purpose + expiry), bounded by subscribe activity; a short retention window plus the (tenant, created_at) index keeps the age-based purge cheap without partitioning. The newsletter:retention job separately hard-deletes expired/consumed tokens early; this generic purge ages out any residue."
      },
      archive: {
        archivable: false,
        rationale:
          "Single-use secrets — never a durable archive candidate; retaining a token pointer longer serves no purpose."
      },
      deletion: {
        mode: "hard_delete",
        rationale:
          "An age-based DELETE of stale tokens — deleting one only invalidates an already-expired/consumed secret; nothing references it afterward."
      },
      legalHold: { applicable: false, precedence: "not_applicable" },
      requiredIndexes: [
        {
          columns: ["tenant_id", "created_at"],
          purpose:
            "awcms_micro_newsletter_tokens_created_idx (sql/091) — the (tenant, cursor) composite the generic purge engine filters + orders by."
        }
      ],
      batchLimit: 5000,
      backupRestoreNotes:
        "No special implications: single-use, purgeable secrets. A restore that omits this table loses only pending confirm/preferences/unsubscribe token pointers (a subscriber simply requests a fresh link).",
      executionMode: "generic"
    }
  ]
});
