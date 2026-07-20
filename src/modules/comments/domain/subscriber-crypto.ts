/**
 * Encryption-at-rest for reply-notification subscriber addresses (Issue #271,
 * ADR-0032). Identical shape/rationale to `lib/auth/sso-credential-crypto.ts`
 * (AES-256-GCM, versioned `v1:<iv>:<tag>:<ciphertext>`, fail-closed key
 * resolution) — a SEPARATE key (`COMMENTS_SUBSCRIBER_ENCRYPTION_KEY`) so its
 * blast radius stays scoped to the one column it protects
 * (`awcms_micro_comments_reply_subscriptions.subscriber_email_encrypted`).
 *
 * The recipient address must be RECOVERABLE (the email dispatcher needs the
 * literal value to send), but is NEVER exposed in any API response/event/log —
 * only the email dispatcher decrypts it at send time. When no key is configured
 * (offline/LAN by default), `encryptSubscriberEmail` returns `null` and the
 * caller stores an unresolvable marker: reply-notify simply degrades to
 * "cannot notify" (provider-optional, ADR-0006), never a plaintext leak.
 */
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_BYTE_LENGTH = 32;
const IV_BYTE_LENGTH = 12;
const FORMAT_VERSION = "v1";

/** Sentinel stored when no encryption key is configured — never resolvable to an address. */
export const UNRESOLVABLE_SUBSCRIBER_REF = "unresolvable";

export function resolveSubscriberEncryptionKey(
  env: NodeJS.ProcessEnv = process.env
): Buffer | null {
  const raw = env.COMMENTS_SUBSCRIBER_ENCRYPTION_KEY;
  if (!raw) return null;
  let key: Buffer;
  try {
    key = Buffer.from(raw, "base64");
  } catch {
    return null;
  }
  return key.length === KEY_BYTE_LENGTH ? key : null;
}

/** Returns the versioned ciphertext, or `null` when no usable key is configured. */
export function encryptSubscriberEmail(
  plaintext: string,
  key: Buffer | null
): string | null {
  if (!key) return null;
  const iv = randomBytes(IV_BYTE_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(Buffer.from(plaintext, "utf8")),
    cipher.final()
  ]);
  const authTag = cipher.getAuthTag();
  return [
    FORMAT_VERSION,
    iv.toString("base64"),
    authTag.toString("base64"),
    ciphertext.toString("base64")
  ].join(":");
}

/** Throws on any malformed/unauthenticated ciphertext — callers treat any throw as "cannot decrypt". */
export function decryptSubscriberEmail(encoded: string, key: Buffer): string {
  const parts = encoded.split(":");
  if (parts.length !== 4 || parts[0] !== FORMAT_VERSION) {
    throw new Error("Unrecognized subscriber email ciphertext format.");
  }
  const [, ivPart, tagPart, ciphertextPart] = parts;
  const iv = Buffer.from(ivPart!, "base64");
  const authTag = Buffer.from(tagPart!, "base64");
  const ciphertext = Buffer.from(ciphertextPart!, "base64");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final()
  ]).toString("utf8");
}
