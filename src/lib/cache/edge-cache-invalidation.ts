/**
 * Automatic edge-cache invalidation on a publication change (Issue #359,
 * follow-up to Issue #353 / ADR-0037 §Alternatif, which deliberately
 * deferred this).
 *
 * Three rules govern everything below, and each one exists because of a
 * failure this repository has already lived through:
 *
 * 1. **Never inside a database transaction.** ADR-0030 invariant 4. Holding
 *    a pooled connection open across an HTTP call to the cache is exactly
 *    the shape that saturated the pool in Issue #324. Every caller invokes
 *    this AFTER its `withTenant` has resolved.
 * 2. **Fail-open, absolutely.** A publish that succeeded must never be
 *    reported as failed because a cache could not be reached. Every path
 *    here resolves; nothing throws.
 * 3. **Zero database work when the cache is not configured.** The config
 *    check comes FIRST, before any hostname lookup — a deployment without
 *    an edge cache must not pay a query per publish for a purge it will
 *    never send.
 */
import { log } from "../logging/logger";
import { withTenant } from "../database/tenant-context";
import { getEdgeCacheConfig, type EdgeCacheConfig } from "./edge-cache-config";
import { purgeEdgeCache } from "./edge-cache-purge";

/**
 * Everything under the host is invalidated, not just the changed URL.
 *
 * Publishing one post changes more than its own page: the listing, the
 * tag/category pages it appears on, the sitemap, and the feeds all move
 * together. Enumerating those precisely would mean re-deriving every
 * module's routing rules here and silently missing whichever one a future
 * module adds — so the safe direction is to drop the host's entries and let them
 * refill. The cost is bounded (a cache refill on the next reader) and
 * publications are rare relative to reads.
 */
const PURGE_EVERYTHING = "^/";

export type PublicCacheInvalidationResult = {
  status: "skipped" | "purged" | "partial" | "failed";
  /** Hostnames a BAN was actually sent for. */
  hostsPurged: number;
  /** Hostnames resolved for the tenant. */
  hostsResolved: number;
};

const SKIPPED: PublicCacheInvalidationResult = {
  status: "skipped",
  hostsPurged: 0,
  hostsResolved: 0
};

type TenantHostRow = { hostname: string };

/**
 * Active, non-deleted public hostnames for a tenant — the same
 * `status = 'active'` condition the public host resolver requires before it
 * will map a request to this tenant (`public-host-tenant-resolver.ts`), so
 * a hostname that cannot serve the tenant is never purged for it either.
 */
async function resolveTenantHostnames(
  sql: Bun.SQL,
  tenantId: string
): Promise<string[]> {
  const rows = await withTenant(
    sql,
    tenantId,
    async (tx) =>
      (await tx`
        SELECT hostname
        FROM awcms_micro_tenant_domains
        WHERE tenant_id = ${tenantId}
          AND status = 'active'
          AND deleted_at IS NULL
      `) as TenantHostRow[],
    // Not a `Response` caller (PR #323): without this, a saturated pool
    // hands back a 503 `Response` that would masquerade as a row array.
    { unavailableBehavior: "throw", workClass: "background_sync" }
  );

  return rows.map((row) => row.hostname).filter((host) => host.length > 0);
}

export type InvalidatePublicCacheInput = {
  sql: Bun.SQL;
  tenantId: string;
  /** Code-defined reason, e.g. `blog.post.published` — logged, never used as a metric label. */
  reason: string;
  correlationId?: string;
  config?: EdgeCacheConfig;
};

/**
 * Invalidate a tenant's public edge-cache entries. Safe to call
 * unconditionally: it decides for itself whether there is anything to do.
 */
export async function invalidatePublicCacheForTenant(
  input: InvalidatePublicCacheInput
): Promise<PublicCacheInvalidationResult> {
  const config = input.config ?? getEdgeCacheConfig();

  // Rule 3 — before any database work.
  if (!config.enabled || !config.purgeUrl || !config.purgeToken) {
    return SKIPPED;
  }

  try {
    const hostnames = await resolveTenantHostnames(input.sql, input.tenantId);

    if (hostnames.length === 0) {
      return SKIPPED;
    }

    let purged = 0;

    for (const hostname of hostnames) {
      const result = await purgeEdgeCache(
        { host: hostname, pathPattern: PURGE_EVERYTHING },
        config
      );

      if (result.status === "purged") {
        purged += 1;
      }
    }

    if (purged === hostnames.length) {
      return {
        status: "purged",
        hostsPurged: purged,
        hostsResolved: hostnames.length
      };
    }

    const status = purged === 0 ? "failed" : "partial";

    // Worth a log line even though it is non-fatal: a partial result shows
    // up to readers as stale content on ONE domain only, which is otherwise
    // a baffling symptom to diagnose.
    log("warning", "edge_cache.invalidation.incomplete", {
      correlationId: input.correlationId,
      moduleKey: "deployment",
      reason: input.reason,
      status,
      hostsPurged: purged,
      hostsResolved: hostnames.length
    });

    return {
      status,
      hostsPurged: purged,
      hostsResolved: hostnames.length
    };
  } catch (error) {
    // Rule 2. The publish itself already committed; this is best-effort
    // cleanup and TTL expiry remains the backstop.
    log("warning", "edge_cache.invalidation.failed", {
      correlationId: input.correlationId,
      moduleKey: "deployment",
      reason: input.reason,
      error: error instanceof Error ? error.message : "unknown error"
    });

    return { status: "failed", hostsPurged: 0, hostsResolved: 0 };
  }
}

/**
 * Call-site wrapper for a route handler that has just finished its
 * `withTenant` block:
 *
 * ```ts
 * return withPublicCacheInvalidation(
 *   await withTenant(sql, tenantId, async (tx) => { ... }),
 *   { sql, tenantId, reason: "blog.post.published", correlationId }
 * );
 * ```
 *
 * Two things it guarantees that an inline `await invalidate…()` would leave
 * to each call site to remember: the invalidation happens strictly AFTER
 * the transaction (rule 1), and only when the handler actually succeeded —
 * a `404`/`422`/`503` changed no public content, and `withTenant`'s own
 * pool-saturation fallback is a non-`ok` `Response` too.
 */
export async function withPublicCacheInvalidation(
  response: Response,
  input: InvalidatePublicCacheInput
): Promise<Response> {
  if (!response.ok) {
    return response;
  }

  await invalidatePublicCacheForTenant(input);

  return response;
}
