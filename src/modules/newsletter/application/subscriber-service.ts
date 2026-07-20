/**
 * Public subscriber flows (Issue #272, ADR-0033 — ANTI-ENUMERATION SPINE):
 * subscribe, confirm (double-opt-in), preferences (view/update), unsubscribe
 * (one-step, token), resubscribe (re-opt-in). Every query runs inside a
 * caller-provided tenant transaction (RLS FORCE'd).
 *
 * These functions do the real work but RETURN nothing a caller could use to
 * distinguish "address exists / is pending / is subscribed / is suppressed /
 * belongs to another tenant" — the calling route ALWAYS emits the same generic
 * body (`domain/generic-response.ts`). No raw email is ever logged, returned, or
 * eventified: only sha256 hashes + masks + AES-GCM ciphertext leave this layer.
 *
 * A raw single-use token is returned in the service RESULT (for the email
 * dispatch follow-up / direct-call tests) but is NEVER placed in an HTTP response
 * by the route.
 */
import { resolveStoredSubscriberRef } from "../domain/subscriber-crypto";
import {
  deriveSubscriberEmailParts,
  type SubscriberEmailParts
} from "../domain/subscriber-identity";
import {
  hashToken,
  mintRawToken,
  tokenTtlMs,
  type NewsletterTokenPurpose
} from "../domain/newsletter-token";
import type { SubscriberState } from "../domain/subscriber-state";
import {
  SUBSCRIBER_CONFIRMED_EVENT_TYPE,
  SUBSCRIBER_UNSUBSCRIBED_EVENT_TYPE,
  SUPPRESSION_RECORDED_EVENT_TYPE
} from "../domain/newsletter-events";
import { appendSubscriberEvent } from "./newsletter-events";
import {
  isSuppressed,
  recordSuppression,
  removeSuppression
} from "./suppression-directory";
import { getOrCreateDefaultTopic } from "./topic-directory";

type SubscriberRow = {
  id: string;
  state: SubscriberState;
  email_hash: string;
  locale: string;
};

/** Mint + persist a single-use token for a subscriber, returning the RAW token once. */
async function mintToken(
  tx: Bun.SQL,
  tenantId: string,
  subscriberId: string,
  purpose: NewsletterTokenPurpose,
  now: Date = new Date()
): Promise<string> {
  const raw = mintRawToken();
  const expiresAt = new Date(now.getTime() + tokenTtlMs(purpose));
  await tx`
    INSERT INTO awcms_micro_newsletter_tokens
      (tenant_id, subscriber_id, token_hash, purpose, expires_at)
    VALUES (${tenantId}, ${subscriberId}, ${hashToken(raw)}, ${purpose}, ${expiresAt})
  `;
  return raw;
}

/** Upsert a subscriber row by (tenant, email_hash), keeping any existing state. Returns the row. */
async function upsertSubscriber(
  tx: Bun.SQL,
  tenantId: string,
  parts: SubscriberEmailParts,
  locale: string,
  env: NodeJS.ProcessEnv
): Promise<SubscriberRow> {
  const encrypted = resolveStoredSubscriberRef(parts.normalized, env);
  const rows = (await tx`
    INSERT INTO awcms_micro_newsletter_subscribers
      (tenant_id, email_hash, email_masked, email_encrypted, locale, state)
    VALUES (${tenantId}, ${parts.hash}, ${parts.masked}, ${encrypted}, ${locale}, 'pending')
    ON CONFLICT (tenant_id, email_hash) DO UPDATE SET
      email_masked = EXCLUDED.email_masked,
      email_encrypted = EXCLUDED.email_encrypted,
      updated_at = now()
    RETURNING id, state, email_hash, locale
  `) as SubscriberRow[];
  return rows[0]!;
}

/** Ensure a pending subscription exists for (subscriber, topic). */
async function ensureSubscription(
  tx: Bun.SQL,
  tenantId: string,
  subscriberId: string,
  topicId: string,
  source: string | null
): Promise<void> {
  await tx`
    INSERT INTO awcms_micro_newsletter_subscriptions
      (tenant_id, subscriber_id, topic_id, state, source)
    VALUES (${tenantId}, ${subscriberId}, ${topicId}, 'pending', ${source})
    ON CONFLICT (tenant_id, subscriber_id, topic_id) DO UPDATE SET updated_at = now()
  `;
}

async function recordConsent(
  tx: Bun.SQL,
  tenantId: string,
  subscriberId: string,
  input: {
    source: string;
    purpose: string;
    locale: string | null;
    policyVersion: string | null;
    ipHash: string | null;
    uaHash: string | null;
  }
): Promise<void> {
  await tx`
    INSERT INTO awcms_micro_newsletter_consent_events
      (tenant_id, subscriber_id, source, purpose, locale, policy_version,
       evidence_ip_hash, evidence_ua_hash)
    VALUES (${tenantId}, ${subscriberId}, ${input.source}, ${input.purpose},
            ${input.locale}, ${input.policyVersion}, ${input.ipHash}, ${input.uaHash})
  `;
}

export type SubscribeInput = {
  rawEmail: string;
  locale: string;
  topicIds: string[] | null;
  source: string;
  policyVersion: string | null;
  ipHash: string | null;
  uaHash: string | null;
  correlationId?: string | null;
};

export type SubscribeResult = {
  /** Internal only — the route NEVER exposes this. Null when suppressed/no-op. */
  confirmToken: string | null;
};

/**
 * Anti-enumeration timing pad (security audit M1). The suppressed / hard-suppressed
 * early-return does far fewer round-trips than the full write path (upsert +
 * consent + subscriptions + token), which a timing attacker could use as a
 * suppression/existence oracle — the exact thing this module forbids. Run a
 * comparable number of tenant-scoped, no-op round-trips so the suppressed branch's
 * wall-clock matches the write path's dominant cost (query round-trips). Read-only
 * (LIMIT 0 / FALSE predicates) so nothing is persisted. Combined with the per-IP
 * rate limit this closes the practical signal.
 */
async function padSuppressedSubscribeLatency(
  tx: Bun.SQL,
  tenantId: string
): Promise<void> {
  await tx`SELECT 1 FROM awcms_micro_newsletter_subscribers WHERE tenant_id = ${tenantId} LIMIT 0`;
  await tx`SELECT 1 FROM awcms_micro_newsletter_consent_events WHERE tenant_id = ${tenantId} LIMIT 0`;
  await tx`SELECT 1 FROM awcms_micro_newsletter_subscriptions WHERE tenant_id = ${tenantId} LIMIT 0`;
  await tx`SELECT 1 FROM awcms_micro_newsletter_topics WHERE tenant_id = ${tenantId} LIMIT 0`;
  await tx`SELECT 1 FROM awcms_micro_newsletter_tokens WHERE tenant_id = ${tenantId} LIMIT 0`;
}

/**
 * Subscribe (double-opt-in). Upserts a pending subscriber, records consent, opens
 * pending subscriptions, and mints a confirm token — UNLESS the address is
 * suppressed (bounce/complaint/manual/unsubscribe), in which case it is a silent
 * no-op. Either way the caller returns the same generic response.
 */
export async function subscribeToNewsletter(
  tx: Bun.SQL,
  tenantId: string,
  input: SubscribeInput,
  env: NodeJS.ProcessEnv = process.env
): Promise<SubscribeResult> {
  const parts = deriveSubscriberEmailParts(input.rawEmail);

  if (await isSuppressed(tx, tenantId, parts.hash)) {
    // Suppressed addresses are never re-opted-in via subscribe (resubscribe owns
    // the narrow unsubscribe-only re-opt-in). Silent no-op — same generic reply.
    await padSuppressedSubscribeLatency(tx, tenantId); // M1: flatten timing oracle
    return { confirmToken: null };
  }

  const subscriber = await upsertSubscriber(
    tx,
    tenantId,
    parts,
    input.locale,
    env
  );
  await recordConsent(tx, tenantId, subscriber.id, {
    source: input.source,
    purpose: "subscribe",
    locale: input.locale,
    policyVersion: input.policyVersion,
    ipHash: input.ipHash,
    uaHash: input.uaHash
  });

  const topicIds =
    input.topicIds && input.topicIds.length > 0
      ? input.topicIds
      : [(await getOrCreateDefaultTopic(tx, tenantId, input.locale)).id];
  for (const topicId of topicIds) {
    await ensureSubscription(
      tx,
      tenantId,
      subscriber.id,
      topicId,
      input.source
    );
  }

  // Already confirmed subscribers do not need another confirm token (idempotent).
  const confirmToken =
    subscriber.state === "subscribed"
      ? null
      : await mintToken(tx, tenantId, subscriber.id, "confirm");
  return { confirmToken };
}

export type ConfirmResult = {
  /** Internal only. Whether a state change actually happened. */
  confirmed: boolean;
  subscriberId: string | null;
  emailHash: string | null;
};

/**
 * Confirm a subscription by its raw confirm token. Constant-time hash lookup +
 * atomic single-use consume; transitions the subscriber pending->subscribed and
 * its subscriptions pending->confirmed exactly once, then publishes
 * `newsletter.subscriber.confirmed`. Any invalid/expired/consumed/forged token is
 * a silent no-op — the route returns the same generic body regardless.
 */
export async function confirmSubscription(
  tx: Bun.SQL,
  tenantId: string,
  rawToken: unknown,
  options: { correlationId?: string | null } = {}
): Promise<ConfirmResult> {
  if (typeof rawToken !== "string" || rawToken.length === 0) {
    return { confirmed: false, subscriberId: null, emailHash: null };
  }
  const tokenHash = hashToken(rawToken);

  // Atomic single-use consume: only the first valid, unexpired, unconsumed token wins.
  const consumed = (await tx`
    UPDATE awcms_micro_newsletter_tokens
    SET consumed_at = now()
    WHERE tenant_id = ${tenantId}
      AND token_hash = ${tokenHash}
      AND purpose = 'confirm'
      AND consumed_at IS NULL
      AND expires_at > now()
    RETURNING subscriber_id
  `) as { subscriber_id: string }[];
  if (!consumed[0]) {
    return { confirmed: false, subscriberId: null, emailHash: null };
  }
  const subscriberId = consumed[0].subscriber_id;

  const subRows = (await tx`
    UPDATE awcms_micro_newsletter_subscribers
    SET state = 'subscribed', confirmed_at = now(), updated_at = now()
    WHERE tenant_id = ${tenantId} AND id = ${subscriberId} AND state = 'pending'
    RETURNING id, email_hash
  `) as { id: string; email_hash: string }[];

  // Resolve email hash even if the subscriber was already subscribed (idempotent).
  const emailHash =
    subRows[0]?.email_hash ??
    (
      (await tx`
        SELECT email_hash FROM awcms_micro_newsletter_subscribers
        WHERE tenant_id = ${tenantId} AND id = ${subscriberId}
      `) as { email_hash: string }[]
    )[0]?.email_hash ??
    null;

  // Confirm the subscriber's pending subscriptions.
  const confirmedSubs = (await tx`
    UPDATE awcms_micro_newsletter_subscriptions
    SET state = 'confirmed', updated_at = now()
    WHERE tenant_id = ${tenantId} AND subscriber_id = ${subscriberId} AND state = 'pending'
    RETURNING id
  `) as { id: string }[];
  for (const row of confirmedSubs) {
    await tx`
      INSERT INTO awcms_micro_newsletter_subscription_state_history
        (tenant_id, subscription_id, from_state, to_state, reason)
      VALUES (${tenantId}, ${row.id}, 'pending', 'confirmed', 'double-opt-in confirmed')
    `;
  }

  if (emailHash) {
    await appendSubscriberEvent(tx, tenantId, {
      eventType: SUBSCRIBER_CONFIRMED_EVENT_TYPE,
      subscriberId,
      emailHash,
      correlationId: options.correlationId ?? null
    });
  }

  return { confirmed: subRows.length > 0, subscriberId, emailHash };
}

/** Resolve a subscriber by a reusable (non-consuming) token of a given purpose. */
async function resolveSubscriberByToken(
  tx: Bun.SQL,
  tenantId: string,
  rawToken: unknown,
  purpose: NewsletterTokenPurpose
): Promise<string | null> {
  if (typeof rawToken !== "string" || rawToken.length === 0) return null;
  const tokenHash = hashToken(rawToken);
  const rows = (await tx`
    SELECT subscriber_id FROM awcms_micro_newsletter_tokens
    WHERE tenant_id = ${tenantId}
      AND token_hash = ${tokenHash}
      AND purpose = ${purpose}
      AND expires_at > now()
    LIMIT 1
  `) as { subscriber_id: string }[];
  return rows[0]?.subscriber_id ?? null;
}

export type PreferencesView = {
  locale: string;
  topics: { topicId: string; subscribed: boolean }[];
};

/** View a subscriber's topic preferences by a reusable preferences token, or null on a bad token. */
export async function getPreferences(
  tx: Bun.SQL,
  tenantId: string,
  rawToken: unknown
): Promise<PreferencesView | null> {
  const subscriberId = await resolveSubscriberByToken(
    tx,
    tenantId,
    rawToken,
    "preferences"
  );
  if (!subscriberId) return null;

  const subRows = (await tx`
    SELECT locale FROM awcms_micro_newsletter_subscribers
    WHERE tenant_id = ${tenantId} AND id = ${subscriberId}
  `) as { locale: string }[];
  if (!subRows[0]) return null;

  const topicRows = (await tx`
    SELECT t.id AS topic_id,
           COALESCE(s.state = 'confirmed', false) AS subscribed
    FROM awcms_micro_newsletter_topics t
    LEFT JOIN awcms_micro_newsletter_subscriptions s
      ON s.tenant_id = t.tenant_id AND s.topic_id = t.id AND s.subscriber_id = ${subscriberId}
    WHERE t.tenant_id = ${tenantId} AND t.is_active = true
    ORDER BY t.is_default DESC, t.name ASC
  `) as { topic_id: string; subscribed: boolean }[];

  return {
    locale: subRows[0].locale,
    topics: topicRows.map((r) => ({
      topicId: r.topic_id,
      subscribed: r.subscribed
    }))
  };
}

/** Update a subscriber's topic preferences + locale by a reusable preferences token. Silent no-op on a bad token. */
export async function updatePreferences(
  tx: Bun.SQL,
  tenantId: string,
  rawToken: unknown,
  input: {
    locale: string | null;
    topics: { topicId: string; subscribed: boolean }[];
  }
): Promise<{ updated: boolean }> {
  const subscriberId = await resolveSubscriberByToken(
    tx,
    tenantId,
    rawToken,
    "preferences"
  );
  if (!subscriberId) return { updated: false };

  if (input.locale) {
    await tx`
      UPDATE awcms_micro_newsletter_subscribers
      SET locale = ${input.locale}, updated_at = now()
      WHERE tenant_id = ${tenantId} AND id = ${subscriberId}
    `;
  }

  for (const topic of input.topics) {
    const target = topic.subscribed ? "confirmed" : "unsubscribed";
    await tx`
      INSERT INTO awcms_micro_newsletter_subscriptions
        (tenant_id, subscriber_id, topic_id, state, source)
      VALUES (${tenantId}, ${subscriberId}, ${topic.topicId}, ${target}, 'preferences')
      ON CONFLICT (tenant_id, subscriber_id, topic_id) DO UPDATE SET
        state = EXCLUDED.state, updated_at = now()
    `;
  }
  return { updated: true };
}

export type UnsubscribeResult = { unsubscribed: boolean };

/**
 * One-step unsubscribe by a reusable unsubscribe token (RFC 8058 one-click
 * semantics): marks the subscriber unsubscribed, unsubscribes its subscriptions,
 * records an `unsubscribe` suppression, and publishes
 * `newsletter.subscriber.unsubscribed`. Idempotent + generic on any bad token.
 */
export async function unsubscribeByToken(
  tx: Bun.SQL,
  tenantId: string,
  rawToken: unknown,
  options: { correlationId?: string | null } = {}
): Promise<UnsubscribeResult> {
  const subscriberId = await resolveSubscriberByToken(
    tx,
    tenantId,
    rawToken,
    "unsubscribe"
  );
  if (!subscriberId) return { unsubscribed: false };

  const rows = (await tx`
    UPDATE awcms_micro_newsletter_subscribers
    SET state = 'unsubscribed', unsubscribed_at = now(), updated_at = now()
    WHERE tenant_id = ${tenantId} AND id = ${subscriberId}
      AND state IN ('pending', 'subscribed')
    RETURNING id, email_hash
  `) as { id: string; email_hash: string }[];

  // Resolve the hash even if already unsubscribed (idempotent path).
  const emailHash =
    rows[0]?.email_hash ??
    (
      (await tx`
        SELECT email_hash FROM awcms_micro_newsletter_subscribers
        WHERE tenant_id = ${tenantId} AND id = ${subscriberId}
      `) as { email_hash: string }[]
    )[0]?.email_hash ??
    null;
  if (!emailHash) return { unsubscribed: false };

  const changedSubs = (await tx`
    UPDATE awcms_micro_newsletter_subscriptions
    SET state = 'unsubscribed', updated_at = now()
    WHERE tenant_id = ${tenantId} AND subscriber_id = ${subscriberId}
      AND state IN ('pending', 'confirmed')
    RETURNING id
  `) as { id: string }[];
  for (const row of changedSubs) {
    await tx`
      INSERT INTO awcms_micro_newsletter_subscription_state_history
        (tenant_id, subscription_id, from_state, to_state, reason)
      VALUES (${tenantId}, ${row.id}, NULL, 'unsubscribed', 'one-click unsubscribe')
    `;
  }

  await recordSuppression(tx, tenantId, {
    emailHash,
    reason: "unsubscribe",
    source: "one-click",
    evidence: null
  });

  await appendSubscriberEvent(tx, tenantId, {
    eventType: SUBSCRIBER_UNSUBSCRIBED_EVENT_TYPE,
    subscriberId,
    emailHash,
    reason: "unsubscribe",
    correlationId: options.correlationId ?? null
  });

  return { unsubscribed: rows.length > 0 };
}

/**
 * Re-opt-in by address. Only lifts an `unsubscribe`-reason suppression (a
 * bounce/complaint stays suppressed forever); requires a fresh confirm. New
 * addresses behave like a subscribe. Generic on every path.
 */
export async function resubscribe(
  tx: Bun.SQL,
  tenantId: string,
  input: SubscribeInput,
  env: NodeJS.ProcessEnv = process.env
): Promise<SubscribeResult> {
  const parts = deriveSubscriberEmailParts(input.rawEmail);

  const existing = (await tx`
    SELECT id, state FROM awcms_micro_newsletter_subscribers
    WHERE tenant_id = ${tenantId} AND email_hash = ${parts.hash}
  `) as { id: string; state: SubscriberState }[];

  // A hard suppression (bounce/complaint/manual) that is NOT an unsubscribe blocks
  // re-opt-in entirely — silent no-op.
  const hardSuppressed = (await tx`
    SELECT 1 FROM awcms_micro_newsletter_suppressions
    WHERE tenant_id = ${tenantId} AND email_hash = ${parts.hash}
      AND reason IN ('bounce', 'complaint', 'manual')
    LIMIT 1
  `) as unknown[];
  if (hardSuppressed.length > 0) {
    await padSuppressedSubscribeLatency(tx, tenantId); // M1: flatten timing oracle
    return { confirmToken: null };
  }

  // Lift only the unsubscribe suppression, then re-open a pending double-opt-in.
  await removeSuppression(tx, tenantId, parts.hash, "unsubscribe");

  const subscriber = await upsertSubscriber(
    tx,
    tenantId,
    parts,
    input.locale,
    env
  );
  if (existing[0] && existing[0].state === "unsubscribed") {
    await tx`
      UPDATE awcms_micro_newsletter_subscribers
      SET state = 'pending', unsubscribed_at = NULL, updated_at = now()
      WHERE tenant_id = ${tenantId} AND id = ${subscriber.id}
    `;
  }
  await recordConsent(tx, tenantId, subscriber.id, {
    source: input.source,
    purpose: "resubscribe",
    locale: input.locale,
    policyVersion: input.policyVersion,
    ipHash: input.ipHash,
    uaHash: input.uaHash
  });

  const topicIds =
    input.topicIds && input.topicIds.length > 0
      ? input.topicIds
      : [(await getOrCreateDefaultTopic(tx, tenantId, input.locale)).id];
  for (const topicId of topicIds) {
    await ensureSubscription(
      tx,
      tenantId,
      subscriber.id,
      topicId,
      input.source
    );
  }

  const confirmToken = await mintToken(tx, tenantId, subscriber.id, "confirm");
  return { confirmToken };
}

export type ProviderSuppressionResult = { suppressed: boolean };

/**
 * Apply a verified provider bounce/complaint to the matching subscriber: mark it
 * `suppressed`, add a suppression row, and publish
 * `newsletter.suppression.recorded`. The provider-callback service calls this only
 * AFTER signature + replay verification. `emailHash` is resolved from the provider
 * payload's hashed address; a non-matching hash is a silent no-op.
 */
export async function applyProviderSuppression(
  tx: Bun.SQL,
  tenantId: string,
  input: {
    emailHash: string;
    reason: "bounce" | "complaint";
    provider: string;
    correlationId?: string | null;
  }
): Promise<ProviderSuppressionResult> {
  await recordSuppression(tx, tenantId, {
    emailHash: input.emailHash,
    reason: input.reason,
    source: input.provider,
    evidence: null
  });

  const rows = (await tx`
    UPDATE awcms_micro_newsletter_subscribers
    SET state = 'suppressed', updated_at = now()
    WHERE tenant_id = ${tenantId} AND email_hash = ${input.emailHash}
      AND state IN ('pending', 'subscribed', 'unsubscribed')
    RETURNING id
  `) as { id: string }[];

  const subscriberId =
    rows[0]?.id ??
    (
      (await tx`
        SELECT id FROM awcms_micro_newsletter_subscribers
        WHERE tenant_id = ${tenantId} AND email_hash = ${input.emailHash}
      `) as { id: string }[]
    )[0]?.id ??
    null;

  if (subscriberId) {
    await appendSubscriberEvent(tx, tenantId, {
      eventType: SUPPRESSION_RECORDED_EVENT_TYPE,
      subscriberId,
      emailHash: input.emailHash,
      reason: input.reason,
      correlationId: input.correlationId ?? null
    });
  }
  return { suppressed: true };
}
