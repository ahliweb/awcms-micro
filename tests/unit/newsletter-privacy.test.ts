import { describe, expect, test } from "bun:test";

import {
  deriveSubscriberEmailParts,
  looksLikeEmail
} from "../../src/modules/newsletter/domain/subscriber-identity";
import {
  decryptSubscriberEmail,
  encryptSubscriberEmail,
  resolveStoredSubscriberRef,
  resolveSubscriberEncryptionKey,
  UNRESOLVABLE_SUBSCRIBER_REF
} from "../../src/modules/newsletter/domain/subscriber-crypto";

const KEY_B64 = Buffer.alloc(32, 7).toString("base64");

describe("subscriber email minimization (no raw PII)", () => {
  test("normalize + hash + mask never expose the raw local part", () => {
    const parts = deriveSubscriberEmailParts("  John.Doe@Example.COM ");
    expect(parts.normalized).toBe("john.doe@example.com");
    expect(parts.hash.startsWith("sha256:")).toBe(true);
    // The mask keeps only the first local char + domain, redacting the rest.
    expect(parts.masked).toBe("j*******@example.com");
    expect(parts.masked).not.toContain("ohn.doe");
    // The hash is deterministic (dedup key) but not reversible to the address.
    expect(parts.hash).not.toContain("john");
    expect(deriveSubscriberEmailParts("john.doe@example.com").hash).toBe(
      parts.hash
    );
  });

  test("looksLikeEmail is a structural guard", () => {
    expect(looksLikeEmail("a@b.co")).toBe(true);
    expect(looksLikeEmail("no-at-sign")).toBe(false);
    expect(looksLikeEmail("@leading")).toBe(false);
    expect(looksLikeEmail("with space@x.co")).toBe(false);
    expect(looksLikeEmail(42)).toBe(false);
    expect(looksLikeEmail(null)).toBe(false);
  });
});

describe("subscriber-crypto (AES-256-GCM, fail-closed)", () => {
  test("round-trips when a key is configured", () => {
    const key = resolveSubscriberEncryptionKey({
      NEWSLETTER_SUBSCRIBER_ENCRYPTION_KEY: KEY_B64
    } as NodeJS.ProcessEnv);
    expect(key).not.toBeNull();
    const ct = encryptSubscriberEmail("subscriber@example.com", key);
    expect(ct).not.toBeNull();
    expect(ct!.startsWith("v1:")).toBe(true);
    // Ciphertext never contains the plaintext address.
    expect(ct).not.toContain("subscriber@example.com");
    expect(decryptSubscriberEmail(ct!, key!)).toBe("subscriber@example.com");
  });

  test("fail-closed: no key -> null ciphertext + unresolvable sentinel", () => {
    const key = resolveSubscriberEncryptionKey({} as NodeJS.ProcessEnv);
    expect(key).toBeNull();
    expect(encryptSubscriberEmail("x@y.co", key)).toBeNull();
    expect(resolveStoredSubscriberRef("x@y.co", {} as NodeJS.ProcessEnv)).toBe(
      UNRESOLVABLE_SUBSCRIBER_REF
    );
  });

  test("an invalid key length resolves to null (never a weak key)", () => {
    expect(
      resolveSubscriberEncryptionKey({
        NEWSLETTER_SUBSCRIBER_ENCRYPTION_KEY: Buffer.alloc(16, 1).toString(
          "base64"
        )
      } as NodeJS.ProcessEnv)
    ).toBeNull();
  });

  test("tampered ciphertext fails authentication (GCM)", () => {
    const key = resolveSubscriberEncryptionKey({
      NEWSLETTER_SUBSCRIBER_ENCRYPTION_KEY: KEY_B64
    } as NodeJS.ProcessEnv)!;
    const ct = encryptSubscriberEmail("a@b.co", key)!;
    const parts = ct.split(":");
    parts[3] = Buffer.from("tampered").toString("base64");
    expect(() => decryptSubscriberEmail(parts.join(":"), key)).toThrow();
  });
});
