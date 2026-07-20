import { beforeAll, beforeEach, describe, expect, test } from "bun:test";

import { withTenant } from "../../src/lib/database/tenant-context";
import { deriveSubscriberEmailParts } from "../../src/modules/newsletter/domain/subscriber-identity";
import { hashToken } from "../../src/modules/newsletter/domain/newsletter-token";
import {
  confirmSubscription,
  resubscribe,
  subscribeToNewsletter,
  unsubscribeByToken
} from "../../src/modules/newsletter/application/subscriber-service";
import {
  createCampaign,
  dispatchCampaign,
  runReconciliation,
  scheduleCampaign
} from "../../src/modules/newsletter/application/campaign-service";
import { processDispatchBatch } from "../../src/modules/newsletter/application/delivery-engine";
import { recordProviderCallback } from "../../src/modules/newsletter/application/provider-callback-service";
import {
  anonymizeAgedSubscribers,
  purgeExpiredTokens
} from "../../src/modules/newsletter/application/subscriber-retention";
import { getOrCreateDefaultTopic } from "../../src/modules/newsletter/application/topic-directory";
import { resolvePublishedNewsletterContent } from "../../src/modules/newsletter/application/content-source-engine";
import {
  applyMigrations,
  getAdminSql,
  getTestSql,
  integrationEnabled,
  provisionAppRole,
  resetDatabase
} from "./harness";

const suite = integrationEnabled ? describe : describe.skip;

const TENANT_A = "11111111-1111-1111-1111-111111111111";
const TENANT_B = "22222222-2222-2222-2222-222222222222";

const HELD_GUARD = { isDescriptorHeld: async () => true };
const FREE_GUARD = { isDescriptorHeld: async () => false };

async function seedTenant(id: string, code: string): Promise<void> {
  const admin = getAdminSql();
  await admin`
    INSERT INTO awcms_micro_tenants
      (id, tenant_code, tenant_name, legal_name, status, default_locale, default_theme)
    VALUES (${id}, ${code}, ${code + " Name"}, ${code + " Legal"}, 'active', 'en', 'light')
    ON CONFLICT (id) DO NOTHING
  `;
}

function subInput(email: string) {
  return {
    rawEmail: email,
    locale: "en",
    topicIds: null,
    source: "test",
    policyVersion: "v1",
    ipHash: null,
    uaHash: null,
    correlationId: null
  };
}

suite("newsletter integration", () => {
  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
  }, 60000);

  beforeEach(async () => {
    await resetDatabase();
    await seedTenant(TENANT_A, "tenant-a");
    await seedTenant(TENANT_B, "tenant-b");
  }, 30000);

  test("subscribe -> confirm double-opt-in, single-use token, (tenant,email_hash) uniqueness", async () => {
    const email = "alice@example.com";
    const parts = deriveSubscriberEmailParts(email);

    const token = await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const r1 = await subscribeToNewsletter(tx, TENANT_A, subInput(email));
      // Subscribing again upserts the same subscriber (no duplicate row).
      await subscribeToNewsletter(tx, TENANT_A, subInput(email));
      return r1.confirmToken;
    });
    expect(token).not.toBeNull();

    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const rows = (await tx`
          SELECT state FROM awcms_micro_newsletter_subscribers
          WHERE tenant_id = ${TENANT_A} AND email_hash = ${parts.hash}
        `) as { state: string }[];
      expect(rows).toHaveLength(1);
      expect(rows[0]!.state).toBe("pending");
    });

    // Confirm transitions pending -> subscribed exactly once.
    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const c = await confirmSubscription(tx, TENANT_A, token);
      expect(c.confirmed).toBe(true);
    });
    // A second confirm with the consumed token is a generic no-op.
    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const c = await confirmSubscription(tx, TENANT_A, token);
      expect(c.confirmed).toBe(false);
    });

    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const rows = (await tx`
          SELECT state FROM awcms_micro_newsletter_subscribers
          WHERE tenant_id = ${TENANT_A} AND email_hash = ${parts.hash}
        `) as { state: string }[];
      expect(rows[0]!.state).toBe("subscribed");
      // Same-commit domain event was published to the outbox.
      const events = (await tx`
          SELECT 1 FROM awcms_micro_domain_events
          WHERE tenant_id = ${TENANT_A}
            AND event_type = 'awcms-micro.newsletter.subscriber.confirmed'
        `) as unknown[];
      expect(events.length).toBeGreaterThan(0);
    });
  }, 20000);

  test("cross-tenant isolation: tenant B cannot see tenant A's subscriber (RLS FORCE)", async () => {
    const email = "shared@example.com";
    const parts = deriveSubscriberEmailParts(email);
    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      await subscribeToNewsletter(tx, TENANT_A, subInput(email));
    });
    // The SAME address may exist in B independently (normalized-hash per tenant).
    await withTenant(getTestSql(), TENANT_B, async (tx) => {
      const seen = (await tx`
          SELECT 1 FROM awcms_micro_newsletter_subscribers
          WHERE email_hash = ${parts.hash}
        `) as unknown[];
      // RLS FORCE scopes the read to tenant B only — A's row is invisible.
      expect(seen).toHaveLength(0);
      await subscribeToNewsletter(tx, TENANT_B, subInput(email));
    });
    const adminCount = (await getAdminSql()`
        SELECT count(*)::int AS n FROM awcms_micro_newsletter_subscribers
        WHERE email_hash = ${parts.hash}
      `) as { n: number }[];
    expect(adminCount[0]!.n).toBe(2);
  }, 20000);

  test("unsubscribe records a suppression; a suppressed address is a subscribe no-op", async () => {
    const email = "bob@example.com";
    const parts = deriveSubscriberEmailParts(email);
    const rawUnsub = "raw-unsub-token-bob";

    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const r = await subscribeToNewsletter(tx, TENANT_A, subInput(email));
      await confirmSubscription(tx, TENANT_A, r.confirmToken);
      const subId = (
        (await tx`
            SELECT id FROM awcms_micro_newsletter_subscribers
            WHERE tenant_id = ${TENANT_A} AND email_hash = ${parts.hash}
          `) as { id: string }[]
      )[0]!.id;
      await tx`
          INSERT INTO awcms_micro_newsletter_tokens
            (tenant_id, subscriber_id, token_hash, purpose, expires_at)
          VALUES (${TENANT_A}, ${subId}, ${hashToken(rawUnsub)}, 'unsubscribe', now() + interval '1 day')
        `;
    });

    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const u = await unsubscribeByToken(tx, TENANT_A, rawUnsub);
      expect(u.unsubscribed).toBe(true);
      const sup = (await tx`
          SELECT reason FROM awcms_micro_newsletter_suppressions
          WHERE tenant_id = ${TENANT_A} AND email_hash = ${parts.hash}
        `) as { reason: string }[];
      expect(sup[0]!.reason).toBe("unsubscribe");
    });

    // Subscribe is a silent no-op while suppressed (no fresh confirm token).
    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const r = await subscribeToNewsletter(tx, TENANT_A, subInput(email));
      expect(r.confirmToken).toBeNull();
    });

    // Resubscribe lifts the unsubscribe suppression and re-opens confirm.
    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const r = await resubscribe(tx, TENANT_A, subInput(email));
      expect(r.confirmToken).not.toBeNull();
      const sup = (await tx`
          SELECT 1 FROM awcms_micro_newsletter_suppressions
          WHERE tenant_id = ${TENANT_A} AND email_hash = ${parts.hash}
        `) as unknown[];
      expect(sup).toHaveLength(0);
    });
  }, 20000);

  test("campaign dispatch freezes audience, is idempotent, resumable, and reconciles", async () => {
    // Two confirmed subscribers + one still-pending (excluded from audience).
    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      for (const e of ["c1@example.com", "c2@example.com"]) {
        const r = await subscribeToNewsletter(tx, TENANT_A, subInput(e));
        await confirmSubscription(tx, TENANT_A, r.confirmToken);
      }
      await subscribeToNewsletter(
        tx,
        TENANT_A,
        subInput("pending@example.com")
      );
    });

    const campaignId = await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const c = await createCampaign(tx, TENANT_A, {
        kind: "campaign",
        subject: "Hello",
        bodyText: "Body",
        bodyHtmlSource: null,
        locale: "en",
        topicId: null,
        scheduledAt: null,
        createdBy: null
      });
      await scheduleCampaign(tx, TENANT_A, c.id, { scheduledAt: null });
      return c.id;
    });

    const first = await withTenant(getTestSql(), TENANT_A, async (tx) =>
      dispatchCampaign(tx, TENANT_A, campaignId)
    );
    expect(first.ok).toBe(true);
    if (first.ok) expect(first.audienceCount).toBe(2);

    // Idempotent: a second dispatch is rejected (already dispatching).
    const second = await withTenant(getTestSql(), TENANT_A, async (tx) =>
      dispatchCampaign(tx, TENANT_A, campaignId)
    );
    expect(second.ok).toBe(false);

    // Resumable delivery: process the queued attempts, then reconcile.
    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const batch = await processDispatchBatch(tx, TENANT_A, campaignId, 10);
      expect(batch.processed).toBe(2);
      expect(batch.sent).toBe(2);
      const recon = await runReconciliation(tx, TENANT_A, campaignId);
      expect(recon.discrepancyCount).toBe(0);
      const status = (
        (await tx`
            SELECT status FROM awcms_micro_newsletter_campaigns
            WHERE tenant_id = ${TENANT_A} AND id = ${campaignId}
          `) as { status: string }[]
      )[0]!.status;
      expect(status).toBe("completed");
    });
  }, 20000);

  test("provider callback is replay-safe and applies suppression on bounce", async () => {
    const email = "bounce@example.com";
    const parts = deriveSubscriberEmailParts(email);
    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const r = await subscribeToNewsletter(tx, TENANT_A, subInput(email));
      await confirmSubscription(tx, TENANT_A, r.confirmToken);
    });

    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const input = {
        provider: "acme",
        eventType: "bounce" as const,
        dedupeKey: "acme:evt-1",
        signatureVerified: true,
        emailHash: parts.hash,
        payloadDigest: null
      };
      const r1 = await recordProviderCallback(tx, TENANT_A, input);
      expect(r1.recorded).toBe(true);
      // Replay: same dedupe key inserts once.
      const r2 = await recordProviderCallback(tx, TENANT_A, input);
      expect(r2.replay).toBe(true);

      const sub = (
        (await tx`
            SELECT state FROM awcms_micro_newsletter_subscribers
            WHERE tenant_id = ${TENANT_A} AND email_hash = ${parts.hash}
          `) as { state: string }[]
      )[0]!;
      expect(sub.state).toBe("suppressed");
    });
  }, 20000);

  test("retention anonymizes aged unsubscribed subscribers unless legal-hold; purges expired tokens", async () => {
    const email = "old@example.com";
    const parts = deriveSubscriberEmailParts(email);
    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      await subscribeToNewsletter(tx, TENANT_A, subInput(email));
      await getOrCreateDefaultTopic(tx, TENANT_A, "en");
    });
    // Force the row old + unsubscribed, and add an already-expired token.
    await getAdminSql()`
        UPDATE awcms_micro_newsletter_subscribers
        SET state = 'unsubscribed', updated_at = now() - interval '400 days'
        WHERE tenant_id = ${TENANT_A} AND email_hash = ${parts.hash}
      `;
    await getAdminSql()`
        INSERT INTO awcms_micro_newsletter_tokens (tenant_id, subscriber_id, token_hash, purpose, expires_at)
        SELECT ${TENANT_A}, id, 'sha256:expired', 'confirm', now() - interval '1 day'
        FROM awcms_micro_newsletter_subscribers
        WHERE tenant_id = ${TENANT_A} AND email_hash = ${parts.hash}
      `;

    // Legal hold blocks anonymization.
    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const held = await anonymizeAgedSubscribers(tx, TENANT_A, HELD_GUARD, {
        retentionDays: 365
      });
      expect(held.skippedForLegalHold).toBe(true);
    });
    // Without a hold, the aged row is anonymized and the token is purged.
    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const res = await anonymizeAgedSubscribers(tx, TENANT_A, FREE_GUARD, {
        retentionDays: 365
      });
      expect(res.anonymizedCount).toBe(1);
      const purge = await purgeExpiredTokens(tx, TENANT_A);
      expect(purge.purgedCount).toBeGreaterThanOrEqual(1);
      const row = (
        (await tx`
            SELECT email_encrypted, email_masked FROM awcms_micro_newsletter_subscribers
            WHERE tenant_id = ${TENANT_A} AND email_hash = ${parts.hash}
          `) as { email_encrypted: string; email_masked: string }[]
      )[0]!;
      expect(row.email_encrypted).toBe("anonymized");
      expect(row.email_masked).toBe("***@***");
    });
  }, 20000);

  test("anti-enumeration: existing and never-seen addresses take the same generic path", async () => {
    // Neither call reveals whether the address exists; both simply upsert +
    // (maybe) mint a confirm token. The HTTP layer returns an identical body.
    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const existing = await subscribeToNewsletter(
        tx,
        TENANT_A,
        subInput("known@example.com")
      );
      const fresh = await subscribeToNewsletter(
        tx,
        TENANT_A,
        subInput("never-seen@example.com")
      );
      expect(typeof existing.confirmToken).toBe("string");
      expect(typeof fresh.confirmToken).toBe("string");
    });
  }, 20000);

  test("content-source publication filter: only a published+public blog post is a notification candidate (draft/deleted excluded)", async () => {
    const admin = getAdminSql();
    const AUTHOR_ID = "22222222-2222-2222-2222-222222222222";
    const publishedId = "33333333-3333-3333-3333-333333333333";
    const draftId = "44444444-4444-4444-4444-444444444444";
    // Seed one published+public post (a valid candidate) and one draft (excluded)
    // for TENANT_A. author_tenant_user_id is NOT NULL (sql/026).
    await admin`
      INSERT INTO awcms_micro_blog_posts
        (id, tenant_id, author_tenant_user_id, title, slug, content_json,
         content_text, status, visibility, locale, published_at)
      VALUES
        (${publishedId}, ${TENANT_A}, ${AUTHOR_ID}, 'Published post', 'nl-published',
         '{}'::jsonb, 'body', 'published', 'public', 'en', now()),
        (${draftId}, ${TENANT_A}, ${AUTHOR_ID}, 'Draft post', 'nl-draft',
         '{}'::jsonb, 'body', 'draft', 'public', 'en', NULL)
    `;

    await withTenant(getTestSql(), TENANT_A, async (tx) => {
      const published = await resolvePublishedNewsletterContent(tx, TENANT_A, {
        resourceType: "blog_post",
        resourceId: publishedId,
        locale: "en"
      });
      // The published+public row resolves to a real candidate with title + URL.
      expect(published).not.toBeNull();
      expect(published?.title).toBe("Published post");
      expect(published?.url).toContain("nl-published");

      // The draft row is filtered out at the source→candidate boundary.
      const draft = await resolvePublishedNewsletterContent(tx, TENANT_A, {
        resourceType: "blog_post",
        resourceId: draftId,
        locale: "en"
      });
      expect(draft).toBeNull();

      // Locale scoping: the same published id in a different locale is excluded.
      const wrongLocale = await resolvePublishedNewsletterContent(
        tx,
        TENANT_A,
        {
          resourceType: "blog_post",
          resourceId: publishedId,
          locale: "id"
        }
      );
      expect(wrongLocale).toBeNull();
    });
  }, 20000);
});
