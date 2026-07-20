/**
 * Opaque one-way hashing of consent-evidence request signals (client IP, user
 * agent) for the `newsletter` module (Issue #272, ADR-0033). These are NEVER
 * stored raw — only as a tenant-salted sha256 so a consent event can carry
 * evidence without ever revealing the original value. Pure — no I/O.
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
