/**
 * Submit-timing token (Issue #271, ADR-0032). A short HMAC-signed token embedded
 * in the public comment form at render time and echoed back on submit, so the
 * server can measure elapsed time WITHOUT trusting a client-supplied number (the
 * anti-abuse timing floor, `anti-abuse.ts`). Contains only an issued-at epoch
 * (ms) + a nonce; no PII. Signed with `COMMENTS_TIMING_SECRET` (falls back to a
 * fixed dev secret so offline/LAN works without configuration — the token only
 * gates a soft anti-abuse heuristic, never authorization).
 */
import { createHmac, timingSafeEqual } from "node:crypto";

const DEV_FALLBACK_SECRET = "awcms-micro-comments-timing-dev-secret";
/** Reject a token older than this (also the practical form-lifetime cap). */
export const TIMING_TOKEN_MAX_AGE_MS = 6 * 60 * 60 * 1000;

function resolveSecret(env: NodeJS.ProcessEnv = process.env): string {
  return env.COMMENTS_TIMING_SECRET || DEV_FALLBACK_SECRET;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Mint a timing token for the current moment. */
export function mintTimingToken(
  now: number = Date.now(),
  env: NodeJS.ProcessEnv = process.env
): string {
  const nonce = createHmac("sha256", resolveSecret(env))
    .update(`${now}:${Math.random()}`)
    .digest("base64url")
    .slice(0, 16);
  const payload = `${now}.${nonce}`;
  return `${payload}.${sign(payload, resolveSecret(env))}`;
}

export type TimingTokenVerification =
  { valid: true; issuedAt: number; elapsedMs: number } | { valid: false };

/** Verify a timing token and compute elapsed ms, or report invalid. */
export function verifyTimingToken(
  token: unknown,
  now: number = Date.now(),
  env: NodeJS.ProcessEnv = process.env
): TimingTokenVerification {
  if (typeof token !== "string") return { valid: false };
  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false };
  const [issuedRaw, nonce, sig] = parts;
  const payload = `${issuedRaw}.${nonce}`;
  const expected = sign(payload, resolveSecret(env));
  const sigBuf = Buffer.from(sig!, "utf8");
  const expBuf = Buffer.from(expected, "utf8");
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false };
  }
  const issuedAt = Number(issuedRaw);
  if (!Number.isFinite(issuedAt)) return { valid: false };
  const elapsedMs = now - issuedAt;
  if (elapsedMs < 0 || elapsedMs > TIMING_TOKEN_MAX_AGE_MS) {
    return { valid: false };
  }
  return { valid: true, issuedAt, elapsedMs };
}
