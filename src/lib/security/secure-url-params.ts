/**
 * Authenticated encryption for sensitive URL query parameters (Issue:
 * secure auth URLs). Packs a set of `{name: value}` params into ONE opaque,
 * tamper-evident token so a link carries `?p=<ciphertext>` instead of exposing
 * structured `?token=…&tenantId=…`. Uses AES-256-GCM with a random 96-bit IV
 * per seal (so the same input never yields the same output — "enkripsi acak"),
 * mirroring `src/lib/auth/sso-credential-crypto.ts` /
 * `src/lib/auth/mfa-secret-crypto.ts` exactly (versioned format, fail-closed
 * key resolution). Output is base64url + `.`-joined so it is URL-safe with no
 * percent-encoding.
 *
 * SCOPE — auth/admin surfaces only. Do NOT wrap PUBLIC SEO URLs (blog/news
 * routes, `feed.xml`, `sitemap-*.xml`): those must stay clean, human-readable,
 * and crawlable. This helper is for token-bearing / private links
 * (password-reset link, OIDC hand-off), where opacity is defense-in-depth
 * against parameter tampering and structure-guessing.
 *
 * THREAT MODEL — this is a HARDENING layer, not the primary control. The
 * secrets it wraps (e.g. the reset token) are already cryptographically random
 * and unguessable on their own; sealing them additionally hides the tenant,
 * removes the guessable parameter structure, and makes any tampering fail
 * closed (GCM auth tag). When the key is unset the callers fall back to plain
 * params (the underlying token stays strong), so enabling this never breaks a
 * deployment — it only tightens one that sets the key.
 */
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_BYTE_LENGTH = 32;
const IV_BYTE_LENGTH = 12;
const FORMAT_VERSION = "v1";

/**
 * Decodes `AUTH_URL_PARAM_ENCRYPTION_KEY` from env. Returns `null` — never
 * throws — if unset or not exactly 32 bytes once base64-decoded, so callers
 * fail closed (treat "no key" as "seal/open unavailable", falling back to
 * plain params rather than crashing).
 */
export function resolveUrlParamKey(
  env: NodeJS.ProcessEnv = process.env
): Buffer | null {
  const raw = env.AUTH_URL_PARAM_ENCRYPTION_KEY;
  if (!raw) {
    return null;
  }
  let key: Buffer;
  try {
    key = Buffer.from(raw, "base64");
  } catch {
    return null;
  }
  return key.length === KEY_BYTE_LENGTH ? key : null;
}

/**
 * Seals a flat `{name: value}` map into `v1.<iv>.<tag>.<ciphertext>` (all
 * base64url). Returns `null` when no usable key is configured — the caller
 * then falls back to plain query params.
 */
export function sealUrlParams(
  params: Record<string, string>,
  key: Buffer | null = resolveUrlParamKey()
): string | null {
  if (!key) {
    return null;
  }
  const iv = randomBytes(IV_BYTE_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(Buffer.from(JSON.stringify(params), "utf8")),
    cipher.final()
  ]);
  const authTag = cipher.getAuthTag();
  return [
    FORMAT_VERSION,
    iv.toString("base64url"),
    authTag.toString("base64url"),
    ciphertext.toString("base64url")
  ].join(".");
}

/**
 * Opens a token produced by `sealUrlParams`. Returns `null` on ANY problem —
 * no key, malformed token, failed authentication (tampering), or a payload
 * that is not a flat string→string object. Callers MUST treat `null` as
 * "invalid link", never as "empty params".
 */
export function openUrlParams(
  sealed: string,
  key: Buffer | null = resolveUrlParamKey()
): Record<string, string> | null {
  if (!key) {
    return null;
  }
  const parts = sealed.split(".");
  if (parts.length !== 4 || parts[0] !== FORMAT_VERSION) {
    return null;
  }
  const [, ivPart, tagPart, ciphertextPart] = parts;
  try {
    const decipher = createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(ivPart!, "base64url")
    );
    decipher.setAuthTag(Buffer.from(tagPart!, "base64url"));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(ciphertextPart!, "base64url")),
      decipher.final()
    ]).toString("utf8");
    const parsed: unknown = JSON.parse(plaintext);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return null;
    }
    const out: Record<string, string> = {};
    for (const [name, value] of Object.entries(parsed)) {
      if (typeof value !== "string") {
        return null;
      }
      out[name] = value;
    }
    return out;
  } catch {
    return null;
  }
}
