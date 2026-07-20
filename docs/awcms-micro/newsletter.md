# Newsletter module — consent, privacy, operations

Issue #272, [ADR-0033](../adr/0033-newsletter-module-admission.md). Tenant-scoped, CONSENT-FIRST, ANTI-ENUMERATION newsletter / subscription-list system. This document is the consent/privacy impact assessment plus the subscriber, admin, provider, campaign, suppression, retention, and incident-response guides.

## 1. Consent & privacy impact assessment

- **Lawful basis:** explicit opt-in (double-opt-in). A subscriber row starts `pending`; only a single-use, sha256-hashed, constant-time-verified, expiring confirm token transitions it to `subscribed`. Every consent event is recorded append-only in `awcms_micro_newsletter_consent_events` (source, purpose, locale, policy version, hashed IP/UA evidence).
- **Data minimization:** an email address is NEVER stored raw. It is normalized (lowercased/trimmed), then reduced to a sha256 lookup hash (`email_hash`, the tenant-scoped dedup/lookup key), a display mask (`email_masked`, e.g. `j***@example.com`), and an AES-256-GCM ciphertext (`email_encrypted`, versioned `v1:iv:tag:ct`, or the `unresolvable` sentinel when `NEWSLETTER_SUBSCRIBER_ENCRYPTION_KEY` is not configured). Only the email dispatcher decrypts the ciphertext at send time.
- **Anti-enumeration:** every public flow returns an IDENTICAL generic response regardless of address state or tenant membership, with no timing oracle and no raw PII in any response/log/event. This is the newsletter analogue of the comments verdict-oracle finding.
- **Right to erasure / retention:** the `newsletter:retention` job anonymizes the recoverable address of aged unsubscribed/suppressed subscribers (NULLs the ciphertext, replaces the mask with `***@***`) while retaining the row + append-only evidence, and purges expired/consumed tokens. It is legal-hold aware (a hold on the `newsletter.subscribers` descriptor overrides retention).

## 2. Subscriber guide (public flows)

| Flow        | Endpoint                                    | Behavior                                                                                                                                                                                                                                        |
| ----------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Subscribe   | `POST /api/v1/newsletter/subscribe`         | Upserts a pending subscriber, records consent, opens pending subscriptions, mints a confirm token (delivered via email, NEVER returned in the HTTP response). Suppressed addresses are a silent no-op. Always returns `{ status: "accepted" }`. |
| Confirm     | `POST /api/v1/newsletter/confirm`           | Verifies + atomically consumes the confirm token, transitions pending → subscribed, publishes `newsletter.subscriber.confirmed`. Generic on any bad/expired/consumed token; confirming twice is a no-op.                                        |
| Preferences | `GET`/`POST /api/v1/newsletter/preferences` | Token-scoped view/update of topic subscriptions + locale. Generic empty/accepted on a bad token.                                                                                                                                                |
| Unsubscribe | `POST /api/v1/newsletter/unsubscribe`       | One-click (RFC 8058-style), token, no login. Marks unsubscribed + records an `unsubscribe` suppression, publishes `newsletter.subscriber.unsubscribed`. Idempotent + generic.                                                                   |
| Resubscribe | `POST /api/v1/newsletter/resubscribe`       | Re-opt-in by address. Only lifts an `unsubscribe`-reason suppression (bounce/complaint stays suppressed); requires a fresh confirm. Generic on every path.                                                                                      |

## 3. Admin guide

ABAC-guarded under `/api/v1/newsletter/admin/*` (default-deny, audited, Idempotency-Key on schedule/dispatch). Permissions: `newsletter.subscribers.read`, `newsletter.topics.{read,create,update}`, `newsletter.suppression.{read,create}`, `newsletter.campaigns.{read,create,update,schedule,send,cancel}`.

- **Topics**: `GET/POST /admin/topics`, `PUT /admin/topics/{id}`. Topics are never hard-deleted — deactivate via `isActive` (append-only-evidence posture).
- **Subscribers (MASKED)**: `GET /admin/subscribers` returns masked email only; `GET /admin/subscribers/{id}/consent` returns the append-only consent evidence.
- **Suppression**: `GET /admin/suppression`, `POST /admin/suppression` (manual add — the admin-supplied email is hashed, never stored raw).
- **Campaigns/digests**: `GET/POST /admin/campaigns`, `GET/PATCH /admin/campaigns/{id}`, `GET /admin/campaigns/{id}/preview` (safe HTML), `POST /admin/campaigns/{id}/{schedule,dispatch,cancel,reconcile}`.

## 4. Provider adapter / callback guide

- Configure `NEWSLETTER_PROVIDER_WEBHOOK_SECRET`. The provider posts delivery/bounce/complaint/failed callbacks to `POST /api/v1/newsletter/provider-callback` with an HMAC-SHA256 of the RAW body in the `x-newsletter-signature` header.
- The callback is verified (signature constant-time + replay via `dedupe_key` UNIQUE) BEFORE it is trusted. Browser redirects are NEVER trusted — only the signed server-to-server body. A bounce/complaint applies a suppression against the matching (hashed) address.
- Responses are generic: 200 on accept/replay, 400 on a bad/forged signature or malformed body.

## 5. Campaign / digest SOP

1. Compose a draft (`POST /admin/campaigns`) — subject, body text, optional safe HTML source, locale, optional topic.
2. Preview (`GET /admin/campaigns/{id}/preview`) — the source is rendered through the escape-then-allow-only-safe-constructs renderer.
3. Schedule (`POST /admin/campaigns/{id}/schedule`, Idempotency-Key) — draft → scheduled, publishes `newsletter.campaign.scheduled`.
4. Dispatch (`POST /admin/campaigns/{id}/dispatch`, Idempotency-Key) — freezes an explainable audience snapshot (confirmed + subscribed + not-suppressed recipients of the topic) + enqueues per-recipient queued delivery attempts, publishes `newsletter.campaign.dispatched`. The actual provider send is the `newsletter:dispatch` job / email outbox consumer, OUTSIDE any DB transaction.
5. The `newsletter:dispatch` job processes queued attempts in bounded batches (re-checking suppression + subscriber state at attempt time), then reconciles and completes the campaign.

## 6. Suppression / bounce / complaint runbook

- A verified provider bounce/complaint auto-suppresses the address and sets the subscriber `suppressed`.
- A manual suppression (`POST /admin/suppression`) is high-risk + audited.
- A suppressed address can never be re-mailed; `resubscribe` only lifts an `unsubscribe`-reason suppression, never a bounce/complaint.

## 7. Retention / export / deletion matrix

| Table                                      | Class             | Mode                  | Owner                                     |
| ------------------------------------------ | ----------------- | --------------------- | ----------------------------------------- |
| `awcms_micro_newsletter_subscribers`       | communication_log | anonymize (delegated) | `newsletter:retention` (legal-hold aware) |
| `awcms_micro_newsletter_delivery_attempts` | communication_log | hard_delete (generic) | data_lifecycle                            |
| `awcms_micro_newsletter_provider_events`   | system_event      | hard_delete (generic) | data_lifecycle                            |
| `awcms_micro_newsletter_tokens`            | operational_queue | hard_delete (generic) | data_lifecycle + `newsletter:retention`   |

## 8. Incident response

- **Suspected enumeration probing:** all public responses are already generic; check per-IP rate-limit counters and the (masked) suppression list. No response body reveals existence, so probing yields no signal.
- **Provider callback forgery:** a bad signature is rejected (400) and never recorded; a replayed callback inserts once (dedupe). Rotate `NEWSLETTER_PROVIDER_WEBHOOK_SECRET` if compromise is suspected.
- **Accidental over-send:** cancel the campaign (`POST /admin/campaigns/{id}/cancel`); queued attempts stop being processed. Suppression is enforced at every attempt.

## 9. Accessibility notes

The admin screen (`/admin/newsletter`) and the public demo (`/newsletter/demo`) use the shared design tokens, labelled form controls, `aria-live` status regions, and semantic headings, meeting the AA baseline (doc 14/15). Subscriber emails are shown masked only.

## 10. Security review follow-ups (PR #290 audit)

The admission review (reviewer + `awcms-micro-security-auditor`) returned **no Critical/High** findings. Fixed in the admission PR: **M1** (subscribe/resubscribe suppressed-address early-return now runs a round-trip-count timing pad, `padSuppressedSubscribeLatency`, so latency no longer distinguishes a suppressed from a new address — closing the enumeration/suppression oracle together with the per-IP rate limit), **M2** (retention anonymization now also overwrites the reversible `email_hash` with a per-row non-reversible sentinel, so an aged/suppressed row can no longer be re-linked to a low-entropy address by dictionary), and **L1** (`processDispatchBatch` now claims queued attempts with `FOR UPDATE ... SKIP LOCKED` + a re-asserted `status='queued'` guard, so two dispatch workers never double-claim).

Accepted/deferred LOW items (tracked):

- **Provider callback trust boundary (L2)** — HMAC uses one deployment-wide `NEWSLETTER_PROVIDER_WEBHOOK_SECRET`; the tenant is derived from the request Host after verification and cross-tenant replay is contained by the UNIQUE `(tenant_id, dedupe_key)`. Safe for the current single-provider deployment. If a derived deployment ever issues per-tenant provider secrets, bind the tenant/account inside the signed payload and revisit.
- **Provider callback freshness (L3)** — replay is prevented by `dedupe_key`, but there is no ≤300s timestamp window like `sync-hmac`. Adding a freshness bound is a future hardening.
