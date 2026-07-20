/**
 * Opaque one-way hashing of abuse-correlation request signals (client IP, user
 * agent, reporter email) for the `comments` module (Issue #271, ADR-0032). These
 * are NEVER stored raw — only as a salted-by-tenant sha256 so a row can be
 * correlated for abuse without ever revealing the original value. Pure — no I/O.
 */
import { createHash } from "node:crypto";

/** sha256(tenantId + ":" + value), tenant-scoped so hashes never collide/leak across tenants. Returns null for a null/empty value. */
export function hashRequestSignal(
  tenantId: string,
  value: string | null | undefined
): string | null {
  if (!value) return null;
  return createHash("sha256").update(`${tenantId}:${value}`).digest("hex");
}
