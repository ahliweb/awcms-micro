# newsletter

Tenant-scoped, **CONSENT-FIRST**, **ANTI-ENUMERATION** newsletter / subscription-list system (Issue #272, epic #261 Wave 2, [ADR-0033](../../../docs/adr/0033-newsletter-module-admission.md)). Official Optional Module, `type: "domain"`, `status: "active"`, default-OFF, depends only on Core (`tenant_admin`, `identity_access`). Admission + first runtime landed together, bumping the base registry 21 → 22 and `MODULE_CONTRACT_VERSION` 1.4.0 → 1.5.0.

## What this module owns

- **Topics / subscription lists** (`awcms_micro_newsletter_topics`), per-topic **subscriptions** (`..._subscriptions`), and **subscribers** (`..._subscribers`) whose address is stored MINIMIZED — sha256 lookup hash + display mask + AES-GCM ciphertext (or the `unresolvable` sentinel), never raw. Uniqueness is `(tenant_id, email_hash)`.
- **Append-only ledgers**: consent evidence (`..._consent_events`), subscription state history (`..._subscription_state_history`), provider callbacks (`..._provider_events`).
- **Single-use tokens** (`..._tokens`) — CSPRNG raw token returned once, only its sha256 hash stored, constant-time verified, expiring, `consumed_at` enforces single-use.
- **Suppression deny-list** (`..._suppressions`, bounce/complaint/manual/unsubscribe) enforced BEFORE every send and at audience-freeze time.
- **Campaign/digest lifecycle** (`..._campaigns`): draft → schedule → dispatch → complete/cancel, with a frozen, explainable **audience snapshot** (`..._audience_snapshots` + `..._audience_members`), resumable/idempotent/bounded per-recipient **delivery attempts** (`..._delivery_attempts`), and **reconciliation** (`..._reconciliation_runs`).

All 13 tables are `awcms_micro_newsletter_*`, RLS FORCE'd, tenant-scoped (sql/091).

## Security spine (ADR-0033)

- **Anti-enumeration** is a HARD requirement: every public flow (`subscribe`/`confirm`/`preferences`/`unsubscribe`/`resubscribe`/`provider-callback`) returns an IDENTICAL generic response (`domain/generic-response.ts`) regardless of whether an address exists / is pending / is subscribed / is suppressed / belongs to another tenant. No timing oracle; no raw email in any response/log/event (hash + mask only).
- **Double-opt-in**: a subscriber starts `pending`; only a confirm token moves it to `subscribed`.
- **Provider callbacks** are signature + replay verified (`domain/provider-callback-verify.ts`, HMAC constant-time + `dedupe_key` UNIQUE) BEFORE being trusted; browser redirects are never trusted.
- **Campaign preview** renders through `domain/campaign-preview.ts` (escape everything, then allow only `<p>`/`<br>`/safe autolinks) — never emitted as stored HTML.

## Direction of the arrow

`newsletter` is the CONSUMER/aggregator of `NewsletterContentSourceDescriptor`s that content modules declare via `ModuleDescriptor.newsletterContentSources` (pure DATA — table/column mapping + publication filter + declarative publish-event label, never an executable extractor). The generic engine (`application/content-source-engine.ts`) reads them via `listModules()` and re-validates identifiers (`assertSafeIdentifier`) before any SQL. `blog_content` contributes the first descriptor (`blog_content.post`). Nothing depends on `newsletter` — DAG-inward leaf.

## Email is consumed via events/outbox, not a hard dependency

Campaign delivery enqueues per-recipient `delivery_attempts` + address-free domain events through the `domain_event_runtime` outbox (same-commit, ADR-0006). The email dispatcher (documented follow-up consumer) resolves the encrypted recipient at send time, OUTSIDE any DB transaction. Recipient addresses are NEVER carried in an event/response/log.

## Jobs

- `bun run newsletter:dispatch` — bounded, resumable per-recipient dispatch + reconciliation (`scripts/newsletter-dispatch.ts`).
- `bun run newsletter:retention` — anonymize aged unsubscribed/suppressed subscribers + purge expired tokens, legal-hold aware (`scripts/newsletter-retention.ts`).

## API

- Public: `/api/v1/newsletter/{subscribe,confirm,preferences,unsubscribe,resubscribe,provider-callback}`.
- Admin (ABAC + audit): `/api/v1/newsletter/admin/{topics,subscribers,suppression,campaigns/...}`.

See `openapi/modules/newsletter.openapi.yaml`, `asyncapi/awcms-micro-domain-events.asyncapi.yaml`, and [docs/awcms-micro/newsletter.md](../../../docs/awcms-micro/newsletter.md) for the full contract, consent/privacy impact assessment, SOPs, and runbooks.
