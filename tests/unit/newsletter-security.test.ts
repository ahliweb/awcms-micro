import { describe, expect, test } from "bun:test";

import {
  buildDedupeKey,
  computeCallbackSignature,
  resolveProviderWebhookSecret,
  verifyCallbackSignature
} from "../../src/modules/newsletter/domain/provider-callback-verify";
import { renderCampaignPreview } from "../../src/modules/newsletter/domain/campaign-preview";
import {
  hashToken,
  verifyTokenHash
} from "../../src/modules/newsletter/domain/newsletter-token";
import { assertSafeIdentifier } from "../../src/modules/newsletter/domain/content-source-registry";

const SECRET = "test-provider-secret";
const env = {
  NEWSLETTER_PROVIDER_WEBHOOK_SECRET: SECRET
} as NodeJS.ProcessEnv;

describe("provider-callback forgery + replay", () => {
  test("a correctly signed body verifies; a forged/tampered one does not", () => {
    const body = JSON.stringify({ provider: "acme", eventType: "bounce" });
    const sig = computeCallbackSignature(body, SECRET);
    expect(verifyCallbackSignature(body, sig, env)).toBe(true);
    // Tampered body -> signature no longer matches.
    expect(verifyCallbackSignature(body + " ", sig, env)).toBe(false);
    // Forged signature.
    expect(verifyCallbackSignature(body, "deadbeef", env)).toBe(false);
    expect(verifyCallbackSignature(body, "", env)).toBe(false);
    expect(verifyCallbackSignature(body, null, env)).toBe(false);
  });

  test("fail-closed when no secret is configured", () => {
    const body = JSON.stringify({ x: 1 });
    expect(resolveProviderWebhookSecret({} as NodeJS.ProcessEnv)).toBeNull();
    expect(
      verifyCallbackSignature(body, "anything", {} as NodeJS.ProcessEnv)
    ).toBe(false);
  });

  test("dedupe key is stable per (provider,eventId) and replay-safe", () => {
    const a = buildDedupeKey({
      provider: "acme",
      eventId: "evt-1",
      rawBody: "{}"
    });
    const b = buildDedupeKey({
      provider: "acme",
      eventId: "evt-1",
      rawBody: "{}"
    });
    expect(a).toBe(b);
    // Different event id -> different key.
    expect(
      buildDedupeKey({ provider: "acme", eventId: "evt-2", rawBody: "{}" })
    ).not.toBe(a);
    // No event id -> falls back to a body digest, still bounded in length.
    const bodyKeyed = buildDedupeKey({
      provider: "acme",
      eventId: null,
      rawBody: '{"n":1}'
    });
    expect(bodyKeyed.length).toBeLessThanOrEqual(256);
  });
});

describe("token replay/timing", () => {
  test("verifyTokenHash is length-guarded + constant-time-shaped", () => {
    const stored = hashToken("real-token");
    expect(verifyTokenHash("real-token", stored)).toBe(true);
    // A candidate of a different length can never match.
    expect(verifyTokenHash("x", stored)).toBe(false);
    // A same-length-but-wrong candidate does not match.
    expect(verifyTokenHash("reol-token", stored)).toBe(false);
  });
});

describe("campaign preview safe rendering (no stored XSS)", () => {
  test("script/img/on* and dangerous schemes never survive", () => {
    const html = renderCampaignPreview(
      "<script>alert(1)</script>\n<img src=x onerror=alert(2)>\njavascript:alert(3)\nhttps://ok.example/p"
    );
    // No live tag survives — every attacker `<...>` is escaped to `&lt;...&gt;`,
    // so `onerror`/`src` can only appear as INERT escaped text, never as a real
    // attribute of a real element.
    expect(html).not.toContain("<script");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("javascript:alert(3)</a>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;img src=x onerror=alert(2)&gt;");
    // A safe http(s) URL IS autolinked with a hardened rel.
    expect(html).toContain('rel="nofollow noopener noreferrer"');
    expect(html).toContain("https://ok.example/p");
  });

  test("only <p>/<br>/<a> tags are ever emitted", () => {
    const html = renderCampaignPreview("line one\nline two\n\npara two");
    const tags = html.match(/<[a-z]+/gi) ?? [];
    for (const tag of tags) {
      expect(["<p", "<br", "<a"]).toContain(tag.toLowerCase());
    }
  });
});

describe("identifier interpolation safety", () => {
  test("descriptor identifiers are strictly validated before any SQL", () => {
    expect(() => assertSafeIdentifier("id", "x")).not.toThrow();
    expect(() => assertSafeIdentifier("published_at", "x")).not.toThrow();
    for (const bad of [
      "id;DROP TABLE t",
      "a b",
      "1col",
      "col--",
      "col)",
      "'col'"
    ]) {
      expect(() => assertSafeIdentifier(bad, "x")).toThrow();
    }
  });
});
