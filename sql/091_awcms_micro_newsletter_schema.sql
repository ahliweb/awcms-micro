-- Issue #272 (epic #261 Wave 2, ADR-0033) — first runtime schema of the
-- `newsletter` module: a tenant-scoped, CONSENT-FIRST, anti-enumeration
-- newsletter / subscription-list system over PUBLISHED, PUBLIC content sources
-- (blog posts today; any module's `NewsletterContentSourceDescriptor` tomorrow).
--
-- ## Consent-first, privacy-minimized, anti-enumeration by construction (ADR-0033 threat model)
--
-- A subscriber address is NEVER stored raw — only a sha256 lookup hash
-- (`email_hash`), a display mask (`email_masked`, e.g. `j***@e***`), and an
-- AES-GCM ciphertext (`email_encrypted`, or the `unresolvable` sentinel when no
-- key is configured). Uniqueness is on `(tenant_id, email_hash)`, so the same
-- address can exist in two tenants without either learning about the other.
-- Every PUBLIC flow (subscribe/confirm/preferences/unsubscribe/resubscribe/
-- provider-callback) is written to be an ANTI-ENUMERATION oracle: the HTTP layer
-- returns an IDENTICAL generic response whether an address is new, pending,
-- already subscribed, suppressed, or belongs to another tenant, and no raw email
-- ever appears in a response/log/event. Double-opt-in is enforced: a fresh
-- subscriber starts `pending`; only a confirm token (single-use, sha256-hashed,
-- constant-time verified, expiring) moves it to `subscribed`.
--
-- ## Consent + state history are APPEND-ONLY evidence
--
-- `awcms_micro_newsletter_consent_events` (why/when/how consent was given) and
-- `awcms_micro_newsletter_subscription_state_history` (every state transition)
-- and `awcms_micro_newsletter_provider_events` (every provider callback) are
-- append-only ledgers — never mutated to rewrite the past. Suppressions
-- (bounce/complaint/manual/unsubscribe) are enforced BEFORE every send and at
-- audience-freeze time, so a suppressed address can never be re-mailed even if
-- re-subscribed.
--
-- ## Campaigns freeze an explainable audience BEFORE delivery
--
-- A campaign/digest freezes an `audience_snapshot` (criteria jsonb + frozen
-- member list + count) before dispatch; per-recipient `delivery_attempts` rows
-- make dispatch resumable/idempotent/bounded; the actual provider send is a
-- documented follow-up outbox consumer OUTSIDE any DB transaction (ADR-0006).
-- `reconciliation_runs` compare the frozen snapshot against delivery outcomes.
--
-- ## Publication-state is enforced at the content-source boundary, NOT here
--
-- A digest candidate is only ever selected for a content row the newsletter
-- engine has confirmed is PUBLISHED & PUBLIC via the owning module's declarative
-- `NewsletterContentSourcePublicationFilter` (re-validated identifiers, bound
-- filter VALUES). This schema stores no authorization state for the underlying
-- content; the newsletter surface is never an authorization source for it.

-- ---------------------------------------------------------------------------
-- 1. Topics — subscription lists / topics
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS awcms_micro_newsletter_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  topic_key text NOT NULL,
  name text NOT NULL,
  description text,
  locale text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT awcms_micro_newsletter_topics_key_len
    CHECK (char_length(topic_key) BETWEEN 1 AND 120),
  CONSTRAINT awcms_micro_newsletter_topics_name_len
    CHECK (char_length(name) BETWEEN 1 AND 200),
  CONSTRAINT awcms_micro_newsletter_topics_desc_len
    CHECK (description IS NULL OR char_length(description) <= 2000)
);

CREATE UNIQUE INDEX IF NOT EXISTS awcms_micro_newsletter_topics_key_dedup
  ON awcms_micro_newsletter_topics (tenant_id, topic_key);

ALTER TABLE awcms_micro_newsletter_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_newsletter_topics FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_newsletter_topics_tenant_isolation
  ON awcms_micro_newsletter_topics
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- ---------------------------------------------------------------------------
-- 2. Subscribers — normalized-hash uniqueness, NEVER raw email
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS awcms_micro_newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  -- sha256 lookup hash of the normalized email — NEVER the raw address.
  email_hash text NOT NULL,
  -- Display mask only, e.g. `j***@e***` — safe to render to admins.
  email_masked text NOT NULL,
  -- AES-GCM ciphertext (`v1:iv:tag:ct`) or the `unresolvable` sentinel; only the
  -- email dispatcher decrypts it at send time. Never returned in any response.
  email_encrypted text NOT NULL,
  locale text NOT NULL,
  state text NOT NULL DEFAULT 'pending',
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT awcms_micro_newsletter_subscribers_state_check
    CHECK (state IN ('pending', 'subscribed', 'unsubscribed', 'suppressed')),
  CONSTRAINT awcms_micro_newsletter_subscribers_hash_len
    CHECK (char_length(email_hash) <= 128),
  CONSTRAINT awcms_micro_newsletter_subscribers_masked_len
    CHECK (char_length(email_masked) <= 320)
);

-- Normalized-hash uniqueness per tenant — the anti-enumeration dedup key.
CREATE UNIQUE INDEX IF NOT EXISTS awcms_micro_newsletter_subscribers_email_dedup
  ON awcms_micro_newsletter_subscribers (tenant_id, email_hash);

-- Retention (delegated anonymize) aged-candidate scan + admin listing.
CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_subscribers_state_created_idx
  ON awcms_micro_newsletter_subscribers (tenant_id, state, created_at);

CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_subscribers_created_idx
  ON awcms_micro_newsletter_subscribers (tenant_id, created_at);

ALTER TABLE awcms_micro_newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_newsletter_subscribers FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_newsletter_subscribers_tenant_isolation
  ON awcms_micro_newsletter_subscribers
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- ---------------------------------------------------------------------------
-- 3. Subscriptions — per (subscriber, topic) opt-in
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS awcms_micro_newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  subscriber_id uuid NOT NULL REFERENCES awcms_micro_newsletter_subscribers (id),
  topic_id uuid NOT NULL REFERENCES awcms_micro_newsletter_topics (id),
  state text NOT NULL DEFAULT 'pending',
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT awcms_micro_newsletter_subscriptions_state_check
    CHECK (state IN ('pending', 'confirmed', 'unsubscribed')),
  CONSTRAINT awcms_micro_newsletter_subscriptions_source_len
    CHECK (source IS NULL OR char_length(source) <= 64)
);

CREATE UNIQUE INDEX IF NOT EXISTS awcms_micro_newsletter_subscriptions_dedup
  ON awcms_micro_newsletter_subscriptions (tenant_id, subscriber_id, topic_id);

CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_subscriptions_topic_idx
  ON awcms_micro_newsletter_subscriptions (tenant_id, topic_id, state);

ALTER TABLE awcms_micro_newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_newsletter_subscriptions FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_newsletter_subscriptions_tenant_isolation
  ON awcms_micro_newsletter_subscriptions
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- ---------------------------------------------------------------------------
-- 4. Consent events — APPEND-ONLY consent evidence
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS awcms_micro_newsletter_consent_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  subscriber_id uuid NOT NULL REFERENCES awcms_micro_newsletter_subscribers (id),
  source text NOT NULL,
  purpose text NOT NULL,
  locale text,
  policy_version text,
  -- Hashed abuse/consent-evidence signals only (never raw IP / UA).
  evidence_ip_hash text,
  evidence_ua_hash text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT awcms_micro_newsletter_consent_events_source_len
    CHECK (char_length(source) <= 64),
  CONSTRAINT awcms_micro_newsletter_consent_events_purpose_len
    CHECK (char_length(purpose) <= 64)
);

CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_consent_events_subscriber_idx
  ON awcms_micro_newsletter_consent_events (tenant_id, subscriber_id, occurred_at);

ALTER TABLE awcms_micro_newsletter_consent_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_newsletter_consent_events FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_newsletter_consent_events_tenant_isolation
  ON awcms_micro_newsletter_consent_events
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- ---------------------------------------------------------------------------
-- 5. Subscription state history — APPEND-ONLY transition ledger
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS awcms_micro_newsletter_subscription_state_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  subscription_id uuid NOT NULL REFERENCES awcms_micro_newsletter_subscriptions (id),
  from_state text,
  to_state text NOT NULL,
  reason text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT awcms_micro_newsletter_state_history_reason_len
    CHECK (reason IS NULL OR char_length(reason) <= 200)
);

CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_state_history_subscription_idx
  ON awcms_micro_newsletter_subscription_state_history (tenant_id, subscription_id, occurred_at);

ALTER TABLE awcms_micro_newsletter_subscription_state_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_newsletter_subscription_state_history FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_newsletter_state_history_tenant_isolation
  ON awcms_micro_newsletter_subscription_state_history
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- ---------------------------------------------------------------------------
-- 6. Tokens — single-use, sha256-hashed, expiring double-opt-in secrets
-- ---------------------------------------------------------------------------
-- A CSPRNG raw token is returned to the caller EXACTLY ONCE (embedded in the
-- dispatched confirm/preferences/unsubscribe link); only its sha256 hash is
-- stored and it is constant-time verified. `consumed_at` enforces single-use.
CREATE TABLE IF NOT EXISTS awcms_micro_newsletter_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  subscriber_id uuid NOT NULL REFERENCES awcms_micro_newsletter_subscribers (id),
  token_hash text NOT NULL,
  purpose text NOT NULL,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT awcms_micro_newsletter_tokens_purpose_check
    CHECK (purpose IN ('confirm', 'unsubscribe', 'preferences')),
  CONSTRAINT awcms_micro_newsletter_tokens_hash_len
    CHECK (char_length(token_hash) <= 128)
);

-- sha256 token hashes are globally unique (constant-time lookup by hash).
CREATE UNIQUE INDEX IF NOT EXISTS awcms_micro_newsletter_tokens_hash_dedup
  ON awcms_micro_newsletter_tokens (token_hash);

CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_tokens_subscriber_idx
  ON awcms_micro_newsletter_tokens (tenant_id, subscriber_id, purpose);

-- (tenant, cursor) composite the generic data_lifecycle purge filters + orders by.
CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_tokens_created_idx
  ON awcms_micro_newsletter_tokens (tenant_id, created_at);

ALTER TABLE awcms_micro_newsletter_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_newsletter_tokens FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_newsletter_tokens_tenant_isolation
  ON awcms_micro_newsletter_tokens
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- ---------------------------------------------------------------------------
-- 7. Suppressions — bounce/complaint/manual/unsubscribe deny-list
-- ---------------------------------------------------------------------------
-- Enforced BEFORE every send and at audience-freeze time. Keyed by email_hash
-- so a suppressed address can never be re-mailed even if re-subscribed later.
CREATE TABLE IF NOT EXISTS awcms_micro_newsletter_suppressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  email_hash text NOT NULL,
  reason text NOT NULL,
  source text,
  evidence text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT awcms_micro_newsletter_suppressions_reason_check
    CHECK (reason IN ('bounce', 'complaint', 'manual', 'unsubscribe')),
  CONSTRAINT awcms_micro_newsletter_suppressions_source_len
    CHECK (source IS NULL OR char_length(source) <= 64),
  CONSTRAINT awcms_micro_newsletter_suppressions_evidence_len
    CHECK (evidence IS NULL OR char_length(evidence) <= 2000)
);

CREATE UNIQUE INDEX IF NOT EXISTS awcms_micro_newsletter_suppressions_dedup
  ON awcms_micro_newsletter_suppressions (tenant_id, email_hash);

ALTER TABLE awcms_micro_newsletter_suppressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_newsletter_suppressions FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_newsletter_suppressions_tenant_isolation
  ON awcms_micro_newsletter_suppressions
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- ---------------------------------------------------------------------------
-- 8. Campaigns — campaign / digest lifecycle
-- ---------------------------------------------------------------------------
-- body_html_source is the RAW author source; it is rendered SAFELY on preview
-- (escape-then-allow-only-safe-constructs, never emitted as stored HTML).
CREATE TABLE IF NOT EXISTS awcms_micro_newsletter_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  kind text NOT NULL DEFAULT 'campaign',
  status text NOT NULL DEFAULT 'draft',
  subject text NOT NULL,
  body_text text NOT NULL,
  body_html_source text,
  locale text NOT NULL,
  topic_id uuid REFERENCES awcms_micro_newsletter_topics (id),
  scheduled_at timestamptz,
  -- Frozen recipient list pointer; FK added after audience_snapshots exists
  -- (circular reference resolved by the ALTER below).
  audience_snapshot_id uuid,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT awcms_micro_newsletter_campaigns_kind_check
    CHECK (kind IN ('campaign', 'digest')),
  CONSTRAINT awcms_micro_newsletter_campaigns_status_check
    CHECK (status IN ('draft', 'scheduled', 'dispatching', 'completed', 'cancelled', 'failed')),
  CONSTRAINT awcms_micro_newsletter_campaigns_subject_len
    CHECK (char_length(subject) BETWEEN 1 AND 300),
  CONSTRAINT awcms_micro_newsletter_campaigns_body_len
    CHECK (char_length(body_text) BETWEEN 1 AND 100000),
  CONSTRAINT awcms_micro_newsletter_campaigns_html_len
    CHECK (body_html_source IS NULL OR char_length(body_html_source) <= 200000)
);

CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_campaigns_status_idx
  ON awcms_micro_newsletter_campaigns (tenant_id, status, scheduled_at);

CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_campaigns_topic_idx
  ON awcms_micro_newsletter_campaigns (tenant_id, topic_id);

ALTER TABLE awcms_micro_newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_newsletter_campaigns FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_newsletter_campaigns_tenant_isolation
  ON awcms_micro_newsletter_campaigns
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- ---------------------------------------------------------------------------
-- 9. Audience snapshots — frozen, explainable recipient criteria + count
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS awcms_micro_newsletter_audience_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  campaign_id uuid NOT NULL REFERENCES awcms_micro_newsletter_campaigns (id),
  frozen_at timestamptz NOT NULL DEFAULT now(),
  criteria jsonb NOT NULL DEFAULT '{}'::jsonb,
  subscriber_count integer NOT NULL DEFAULT 0,
  evidence text,
  CONSTRAINT awcms_micro_newsletter_audience_snapshots_count_nonneg
    CHECK (subscriber_count >= 0),
  CONSTRAINT awcms_micro_newsletter_audience_snapshots_evidence_len
    CHECK (evidence IS NULL OR char_length(evidence) <= 2000)
);

CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_audience_snapshots_campaign_idx
  ON awcms_micro_newsletter_audience_snapshots (tenant_id, campaign_id);

ALTER TABLE awcms_micro_newsletter_audience_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_newsletter_audience_snapshots FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_newsletter_audience_snapshots_tenant_isolation
  ON awcms_micro_newsletter_audience_snapshots
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Resolve the campaigns <-> audience_snapshots circular reference now that both
-- tables exist (a campaign points at its most-recent frozen snapshot).
ALTER TABLE awcms_micro_newsletter_campaigns
  ADD CONSTRAINT awcms_micro_newsletter_campaigns_snapshot_fk
  FOREIGN KEY (audience_snapshot_id)
  REFERENCES awcms_micro_newsletter_audience_snapshots (id);

CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_campaigns_snapshot_idx
  ON awcms_micro_newsletter_campaigns (tenant_id, audience_snapshot_id);

-- ---------------------------------------------------------------------------
-- 10. Audience members — frozen recipient list (high volume)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS awcms_micro_newsletter_audience_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  snapshot_id uuid NOT NULL REFERENCES awcms_micro_newsletter_audience_snapshots (id),
  subscriber_id uuid NOT NULL REFERENCES awcms_micro_newsletter_subscribers (id),
  email_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT awcms_micro_newsletter_audience_members_hash_len
    CHECK (char_length(email_hash) <= 128)
);

CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_audience_members_snapshot_idx
  ON awcms_micro_newsletter_audience_members (tenant_id, snapshot_id);

CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_audience_members_subscriber_idx
  ON awcms_micro_newsletter_audience_members (tenant_id, subscriber_id);

ALTER TABLE awcms_micro_newsletter_audience_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_newsletter_audience_members FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_newsletter_audience_members_tenant_isolation
  ON awcms_micro_newsletter_audience_members
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- ---------------------------------------------------------------------------
-- 11. Delivery attempts — per-recipient, resumable, high volume (generic purge)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS awcms_micro_newsletter_delivery_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  campaign_id uuid NOT NULL REFERENCES awcms_micro_newsletter_campaigns (id),
  subscriber_id uuid NOT NULL REFERENCES awcms_micro_newsletter_subscribers (id),
  email_hash text NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  attempt_count integer NOT NULL DEFAULT 0,
  last_attempt_at timestamptz,
  provider_message_id text,
  error_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT awcms_micro_newsletter_delivery_attempts_status_check
    CHECK (status IN ('queued', 'sent', 'delivered', 'bounced', 'complained', 'failed', 'suppressed')),
  CONSTRAINT awcms_micro_newsletter_delivery_attempts_count_nonneg
    CHECK (attempt_count >= 0),
  CONSTRAINT awcms_micro_newsletter_delivery_attempts_error_len
    CHECK (error_code IS NULL OR char_length(error_code) <= 200)
);

-- One attempt row per (campaign, subscriber) — makes dispatch re-entrant.
CREATE UNIQUE INDEX IF NOT EXISTS awcms_micro_newsletter_delivery_attempts_dedup
  ON awcms_micro_newsletter_delivery_attempts (tenant_id, campaign_id, subscriber_id);

CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_delivery_attempts_campaign_status_idx
  ON awcms_micro_newsletter_delivery_attempts (tenant_id, campaign_id, status);

-- (tenant, cursor) composite the generic data_lifecycle purge filters + orders by.
CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_delivery_attempts_created_idx
  ON awcms_micro_newsletter_delivery_attempts (tenant_id, created_at);

ALTER TABLE awcms_micro_newsletter_delivery_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_newsletter_delivery_attempts FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_newsletter_delivery_attempts_tenant_isolation
  ON awcms_micro_newsletter_delivery_attempts
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- ---------------------------------------------------------------------------
-- 12. Provider events — APPEND-ONLY provider callback ledger (generic purge)
-- ---------------------------------------------------------------------------
-- Every inbound provider callback (delivered/bounce/complaint/failed) is
-- verified (signature/account/tenant + replay via `dedupe_key` unique insert)
-- BEFORE being trusted, then recorded here. Never a raw address — only a hash.
CREATE TABLE IF NOT EXISTS awcms_micro_newsletter_provider_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  provider text NOT NULL,
  event_type text NOT NULL,
  dedupe_key text NOT NULL,
  signature_verified boolean NOT NULL DEFAULT false,
  subscriber_email_hash text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  payload_digest text,
  CONSTRAINT awcms_micro_newsletter_provider_events_type_check
    CHECK (event_type IN ('delivered', 'bounce', 'complaint', 'failed')),
  CONSTRAINT awcms_micro_newsletter_provider_events_provider_len
    CHECK (char_length(provider) <= 64),
  CONSTRAINT awcms_micro_newsletter_provider_events_dedupe_len
    CHECK (char_length(dedupe_key) <= 256)
);

-- Replay-safety: a repeated provider callback with the same dedupe_key inserts once.
CREATE UNIQUE INDEX IF NOT EXISTS awcms_micro_newsletter_provider_events_dedup
  ON awcms_micro_newsletter_provider_events (tenant_id, dedupe_key);

-- (tenant, cursor) composite the generic data_lifecycle purge filters + orders by.
CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_provider_events_occurred_idx
  ON awcms_micro_newsletter_provider_events (tenant_id, occurred_at);

ALTER TABLE awcms_micro_newsletter_provider_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_newsletter_provider_events FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_newsletter_provider_events_tenant_isolation
  ON awcms_micro_newsletter_provider_events
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- ---------------------------------------------------------------------------
-- 13. Reconciliation runs — snapshot vs delivery-outcome evidence
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS awcms_micro_newsletter_reconciliation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  campaign_id uuid NOT NULL REFERENCES awcms_micro_newsletter_campaigns (id),
  ran_at timestamptz NOT NULL DEFAULT now(),
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  discrepancy_count integer NOT NULL DEFAULT 0,
  CONSTRAINT awcms_micro_newsletter_reconciliation_runs_count_nonneg
    CHECK (discrepancy_count >= 0)
);

CREATE INDEX IF NOT EXISTS awcms_micro_newsletter_reconciliation_runs_campaign_idx
  ON awcms_micro_newsletter_reconciliation_runs (tenant_id, campaign_id, ran_at);

ALTER TABLE awcms_micro_newsletter_reconciliation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_newsletter_reconciliation_runs FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_newsletter_reconciliation_runs_tenant_isolation
  ON awcms_micro_newsletter_reconciliation_runs
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- ---------------------------------------------------------------------------
-- Least-privilege `awcms_micro_worker` grants (migration 045/089 pattern)
-- ---------------------------------------------------------------------------
-- `awcms_micro_app` needs no explicit grant (ALTER DEFAULT PRIVILEGES, migration
-- 013). The worker role runs (a) `newsletter:retention` — anonymize aged
-- subscribers (UPDATE) + purge expired/consumed tokens (DELETE), reading topics/
-- subscriptions/suppressions; and (b) `newsletter:dispatch` — the bounded,
-- resumable per-recipient dispatch + reconciliation sweep (SELECT campaigns/
-- audience/subscribers/suppressions, UPDATE campaigns/delivery_attempts, INSERT
-- reconciliation_runs); and (c) the data_lifecycle GENERIC purge engine over
-- `..._delivery_attempts` + `..._provider_events` + `..._tokens`, which needs
-- SELECT + DELETE (same pattern as `awcms_micro_visit_events`, migration 045, and
-- `awcms_micro_comments_abuse_events`, migration 089). The dispatch/retention
-- jobs NEVER call a provider inside a DB transaction (ADR-0006) and NEVER append
-- domain events (worker has only SELECT on `awcms_micro_domain_events`); campaign
-- lifecycle events are emitted by the app-role admin routes at request time. RLS
-- FORCE still applies to the worker role, so every withTenant-scoped pass sees
-- only its own tenant.
GRANT SELECT, UPDATE ON awcms_micro_newsletter_subscribers TO awcms_micro_worker;
GRANT SELECT ON awcms_micro_newsletter_topics TO awcms_micro_worker;
GRANT SELECT ON awcms_micro_newsletter_subscriptions TO awcms_micro_worker;
GRANT SELECT ON awcms_micro_newsletter_suppressions TO awcms_micro_worker;
GRANT SELECT, DELETE ON awcms_micro_newsletter_tokens TO awcms_micro_worker;
GRANT SELECT, UPDATE ON awcms_micro_newsletter_campaigns TO awcms_micro_worker;
GRANT SELECT ON awcms_micro_newsletter_audience_snapshots TO awcms_micro_worker;
GRANT SELECT ON awcms_micro_newsletter_audience_members TO awcms_micro_worker;
GRANT SELECT, UPDATE, DELETE ON awcms_micro_newsletter_delivery_attempts TO awcms_micro_worker;
GRANT SELECT, DELETE ON awcms_micro_newsletter_provider_events TO awcms_micro_worker;
GRANT SELECT, INSERT ON awcms_micro_newsletter_reconciliation_runs TO awcms_micro_worker;
