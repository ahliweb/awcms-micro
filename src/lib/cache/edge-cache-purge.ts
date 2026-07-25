/**
 * Explicit invalidation for the optional edge cache (Issue #353, ADR-0037).
 *
 * TTL expiry is the PRIMARY freshness contract — a deployment that never
 * calls this still bounds staleness at `EDGE_CACHE_DEFAULT_TTL_SECONDS`
 * (or the boost TTL while escalated). This path exists for the cases where
 * that bound is not good enough: an operator retracting a published page,
 * or a future per-publish hook (deliberately out of this first landing,
 * see ADR-0037 §Konsekuensi).
 *
 * Fail-open and outside any database transaction, for the same reason the
 * Redis foundation is (ADR-0030 invariants 3 and 4): the cache is an
 * accelerator, and a cache that is down must never turn a successful
 * publish into a failed one.
 */
import { log } from "../logging/logger";
import { recordCounter } from "../observability/metrics-port";
import { loadEdgeCacheConfig, type EdgeCacheConfig } from "./edge-cache-config";

const PURGE_TIMEOUT_MS = 2_000;

/**
 * Reserved path the cache intercepts, and the marker header its synthetic
 * response carries.
 *
 * A POST to a reserved path, NOT a custom `BAN` method: Bun's `fetch`
 * silently rewrites an unknown method to `GET` (verified on Bun 1.3.14
 * against a live Varnish — the request arrived as `GET`, was served as an
 * ordinary page, and returned 200). The old code read that 200 as a
 * successful purge, so invalidation was a silent no-op that reported
 * success. Checking the marker below is what makes that class of failure
 * impossible to repeat: a 200 from anything that is not the cache's own ban
 * handler is now a failure, not a pass.
 */
const BAN_PATH = "/__awcms-edge-cache/ban";
const BAN_MARKER_HEADER = "x-edge-cache-ban";

/** Hostnames only — no scheme, port, path, or wildcard. */
const HOST_PATTERN = /^[A-Za-z0-9.-]{1,253}$/;

/**
 * The path argument is used as a REGEX inside the cache's ban expression,
 * so the accepted character set is restricted on purpose: it permits the
 * anchors and quantifiers a real invalidation needs while excluding the
 * characters that would let a caller reshape the surrounding expression.
 */
const PATH_PATTERN_ALLOWED = /^[A-Za-z0-9/_.^$*+?()[\]|-]{1,512}$/;

export type EdgeCachePurgeRequest = {
  /** Public hostname whose entries should be invalidated — the tenant boundary in the cache key. */
  host: string;
  /** Regex matched against the cached request path. Defaults to everything under the host. */
  pathPattern?: string;
};

export type EdgeCachePurgeResult =
  | { status: "purged" }
  | { status: "skipped"; reason: "not_configured" | "invalid_request" }
  | { status: "failed"; reason: string };

export function isValidPurgeRequest(request: EdgeCachePurgeRequest): boolean {
  if (!HOST_PATTERN.test(request.host)) {
    return false;
  }

  if (request.pathPattern === undefined) {
    return true;
  }

  return PATH_PATTERN_ALLOWED.test(request.pathPattern);
}

export async function purgeEdgeCache(
  request: EdgeCachePurgeRequest,
  config: EdgeCacheConfig = loadEdgeCacheConfig()
): Promise<EdgeCachePurgeResult> {
  if (!config.enabled || !config.purgeUrl || !config.purgeToken) {
    return { status: "skipped", reason: "not_configured" };
  }

  if (!isValidPurgeRequest(request)) {
    // Never forwarded: an unvalidated pattern reaches the cache's own
    // regex engine, and a caller must not be able to shape that.
    log("warning", "edge_cache.purge.rejected", {
      moduleKey: "deployment",
      host: request.host
    });

    return { status: "skipped", reason: "invalid_request" };
  }

  const pathPattern = request.pathPattern ?? "^/";

  try {
    const endpoint = new URL(BAN_PATH, config.purgeUrl);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "X-Ban-Host": request.host,
        "X-Ban-Path": pathPattern,
        "X-Purge-Token": config.purgeToken
      },
      signal: AbortSignal.timeout(PURGE_TIMEOUT_MS)
    });

    if (response.ok && response.headers.get(BAN_MARKER_HEADER) !== "ok") {
      recordCounter("edge_cache_purge_total", { outcome: "failed" });

      // A 200 without the marker means something OTHER than the cache's ban
      // handler answered — most likely the request reached the application
      // itself. Reporting that as success is what hid a completely
      // non-functional invalidation before.
      log("warning", "edge_cache.purge.unmarked_response", {
        moduleKey: "deployment",
        host: request.host,
        statusCode: response.status
      });

      return { status: "failed", reason: "unmarked_response" };
    }

    if (!response.ok) {
      recordCounter("edge_cache_purge_total", { outcome: "failed" });

      // Status only — a purge failure must never echo a cache's response
      // body into this application's logs.
      log("warning", "edge_cache.purge.rejected_by_cache", {
        moduleKey: "deployment",
        host: request.host,
        statusCode: response.status
      });

      return { status: "failed", reason: `http_${response.status}` };
    }

    recordCounter("edge_cache_purge_total", { outcome: "purged" });

    return { status: "purged" };
  } catch (error) {
    recordCounter("edge_cache_purge_total", { outcome: "failed" });

    log("warning", "edge_cache.purge.failed", {
      moduleKey: "deployment",
      host: request.host,
      error: error instanceof Error ? error.message : "unknown error"
    });

    return {
      status: "failed",
      reason: error instanceof Error ? error.name : "unknown_error"
    };
  }
}
