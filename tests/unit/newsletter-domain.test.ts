import { describe, expect, test } from "bun:test";

import {
  applyCampaignAction,
  isEditable,
  isLegalCampaignTransition,
  isTerminal
} from "../../src/modules/newsletter/domain/campaign-status";
import {
  canReopt,
  isLegalSubscriberTransition,
  isMailable
} from "../../src/modules/newsletter/domain/subscriber-state";
import {
  isAudienceEligible,
  isLegalSubscriptionTransition
} from "../../src/modules/newsletter/domain/subscription-state";
import {
  hashToken,
  isTokenUsable,
  mintRawToken,
  tokenTtlMs,
  verifyTokenHash
} from "../../src/modules/newsletter/domain/newsletter-token";
import {
  GENERIC_ACCEPTED,
  genericAccepted
} from "../../src/modules/newsletter/domain/generic-response";
import {
  validateNewsletterContentSourceRegistry,
  assertSafeIdentifier,
  assertSafeTableName
} from "../../src/modules/newsletter/domain/content-source-registry";
import type { ModuleDescriptor } from "../../src/modules/_shared/module-contract";

describe("campaign-status state machine", () => {
  test("legal lifecycle transitions", () => {
    expect(isLegalCampaignTransition("draft", "scheduled")).toBe(true);
    expect(isLegalCampaignTransition("scheduled", "dispatching")).toBe(true);
    expect(isLegalCampaignTransition("dispatching", "completed")).toBe(true);
    expect(isLegalCampaignTransition("draft", "dispatching")).toBe(false);
    expect(isLegalCampaignTransition("completed", "dispatching")).toBe(false);
    expect(isLegalCampaignTransition("draft", "draft")).toBe(false);
  });

  test("applyCampaignAction resolves + rejects", () => {
    expect(applyCampaignAction("draft", "schedule")).toEqual({
      ok: true,
      status: "scheduled"
    });
    expect(applyCampaignAction("scheduled", "dispatch")).toEqual({
      ok: true,
      status: "dispatching"
    });
    expect(applyCampaignAction("draft", "dispatch")).toEqual({
      ok: false,
      reason: "illegal_transition"
    });
    expect(applyCampaignAction("completed", "cancel")).toEqual({
      ok: false,
      reason: "illegal_transition"
    });
  });

  test("editable/terminal helpers", () => {
    expect(isEditable("draft")).toBe(true);
    expect(isEditable("scheduled")).toBe(false);
    expect(isTerminal("completed")).toBe(true);
    expect(isTerminal("cancelled")).toBe(true);
    expect(isTerminal("draft")).toBe(false);
  });
});

describe("subscriber-state state machine", () => {
  test("legal transitions + suppression is terminal", () => {
    expect(isLegalSubscriberTransition("pending", "subscribed")).toBe(true);
    expect(isLegalSubscriberTransition("subscribed", "unsubscribed")).toBe(
      true
    );
    expect(isLegalSubscriberTransition("unsubscribed", "pending")).toBe(true);
    expect(isLegalSubscriberTransition("suppressed", "subscribed")).toBe(false);
    expect(isLegalSubscriberTransition("suppressed", "pending")).toBe(false);
  });

  test("mailable + reopt helpers", () => {
    expect(isMailable("subscribed")).toBe(true);
    expect(isMailable("pending")).toBe(false);
    expect(canReopt("unsubscribed")).toBe(true);
    expect(canReopt("suppressed")).toBe(false);
  });
});

describe("subscription-state state machine", () => {
  test("legal transitions + audience eligibility", () => {
    expect(isLegalSubscriptionTransition("pending", "confirmed")).toBe(true);
    expect(isLegalSubscriptionTransition("confirmed", "unsubscribed")).toBe(
      true
    );
    expect(isLegalSubscriptionTransition("unsubscribed", "confirmed")).toBe(
      true
    );
    expect(isAudienceEligible("confirmed")).toBe(true);
    expect(isAudienceEligible("pending")).toBe(false);
  });
});

describe("token lifecycle", () => {
  test("mint/hash/verify constant-time round-trip", () => {
    const raw = mintRawToken();
    const stored = hashToken(raw);
    expect(stored.startsWith("sha256:")).toBe(true);
    expect(verifyTokenHash(raw, stored)).toBe(true);
    expect(verifyTokenHash(raw + "x", stored)).toBe(false);
    expect(verifyTokenHash("", stored)).toBe(false);
    expect(verifyTokenHash(null, stored)).toBe(false);
  });

  test("two mints never collide", () => {
    expect(mintRawToken()).not.toBe(mintRawToken());
  });

  test("usability honors consumed + expiry", () => {
    const now = new Date("2026-07-20T00:00:00Z");
    const future = new Date(now.getTime() + 1000);
    const past = new Date(now.getTime() - 1000);
    expect(isTokenUsable({ consumedAt: null, expiresAt: future }, now)).toBe(
      true
    );
    expect(isTokenUsable({ consumedAt: null, expiresAt: past }, now)).toBe(
      false
    );
    expect(isTokenUsable({ consumedAt: past, expiresAt: future }, now)).toBe(
      false
    );
  });

  test("ttl per purpose is positive + ordered", () => {
    expect(tokenTtlMs("confirm")).toBeGreaterThan(0);
    expect(tokenTtlMs("unsubscribe")).toBeGreaterThan(tokenTtlMs("confirm"));
  });
});

describe("generic anti-enumeration response", () => {
  test("the generic accepted body is fixed + state-free", () => {
    expect(GENERIC_ACCEPTED).toEqual({ status: "accepted" });
    expect(genericAccepted()).toEqual({ status: "accepted" });
    // Never carries any per-address field.
    expect(Object.keys(genericAccepted())).toEqual(["status"]);
  });
});

describe("content-source registry validation", () => {
  const goodModule = {
    key: "blog_content",
    newsletterContentSources: [
      {
        key: "blog_content.post",
        ownerModuleKey: "blog_content",
        resourceType: "blog_post",
        tableName: "awcms_micro_blog_posts",
        localeColumn: "locale",
        slugColumn: "slug",
        titleColumn: "title",
        publishedAtColumn: "published_at",
        urlTemplate: "/news/:slug",
        publicationFilter: { equals: { status: "published" } },
        publishEventType: "awcms-micro.blog-content.post.published",
        digestEligible: true
      }
    ]
  } as unknown as ModuleDescriptor;

  test("a well-formed descriptor validates", () => {
    const result = validateNewsletterContentSourceRegistry([goodModule]);
    expect(result.valid).toBe(true);
    expect(result.descriptors).toHaveLength(1);
  });

  test("ownerModuleKey mismatch is rejected", () => {
    const bad = {
      key: "attacker",
      newsletterContentSources: [
        {
          ...goodModule.newsletterContentSources![0],
          ownerModuleKey: "blog_content"
        }
      ]
    } as unknown as ModuleDescriptor;
    const result = validateNewsletterContentSourceRegistry([bad]);
    expect(result.valid).toBe(false);
  });

  test("assertSafeIdentifier + assertSafeTableName reject injection", () => {
    expect(() => assertSafeIdentifier("id; DROP TABLE x", "id")).toThrow();
    expect(() => assertSafeTableName("public.users")).toThrow();
    expect(() => assertSafeTableName("users")).toThrow();
    expect(assertSafeTableName("awcms_micro_blog_posts")).toBe(
      "awcms_micro_blog_posts"
    );
  });
});
