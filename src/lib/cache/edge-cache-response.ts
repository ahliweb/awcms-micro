/**
 * Applies the edge-cache policy to a real `Response` (Issue #353,
 * ADR-0037).
 *
 * Lives apart from `src/middleware.ts` so it is unit-testable: the
 * middleware module imports `astro:middleware`, a virtual module `bun test`
 * cannot resolve outside Astro's own pipeline (see the note above
 * `collectRequestAnalytics` in that file), so anything left there is
 * effectively untestable. Everything below works on plain
 * `Request`/`Response` objects.
 */
import { SESSION_COOKIE_NAME } from "../auth/ssr-session";
import type { EdgeCacheConfig } from "./edge-cache-config";
import type { EdgeCacheMode } from "./edge-cache-pressure";
import {
  buildEdgeCacheHeaders,
  decideEdgeCache,
  type EdgeCacheDecision
} from "./edge-cache-policy";

/**
 * Cookie-name match on a raw `Cookie` header. Anchored to a delimiter on
 * the left so a cookie merely ENDING in the session name (e.g.
 * `not_awcms_micro_session`) cannot be mistaken for the real one — the
 * mistake would fail OPEN (a logged-in reader's page becoming cacheable),
 * so it is worth the explicit parse rather than a substring test.
 */
export function hasSessionCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) {
    return false;
  }

  return cookieHeader
    .split(";")
    .some((pair) => pair.trim().split("=")[0] === SESSION_COOKIE_NAME);
}

function mergeVary(existing: string | null, addition: string): string {
  if (!existing) {
    return addition;
  }

  const present = new Set(
    existing
      .split(",")
      .map((token) => token.trim().toLowerCase())
      .filter((token) => token.length > 0)
  );

  if (present.has("*")) {
    return existing;
  }

  const merged = [existing.trim()];

  for (const token of addition.split(",")) {
    const trimmed = token.trim();

    if (trimmed.length > 0 && !present.has(trimmed.toLowerCase())) {
      merged.push(trimmed);
      present.add(trimmed.toLowerCase());
    }
  }

  return merged.join(", ");
}

export type ApplyEdgeCacheInput = {
  request: Request;
  pathname: string;
  mode: EdgeCacheMode;
  config: EdgeCacheConfig;
};

/**
 * Mutates and returns `response`. Returns it untouched when the subsystem
 * is disabled, so enabling and disabling `EDGE_CACHE_ENABLED` is a true
 * no-op boundary rather than a behaviour change on every route.
 */
export function applyEdgeCacheToResponse(
  response: Response,
  input: ApplyEdgeCacheInput
): { response: Response; decision: EdgeCacheDecision } {
  const existingCacheControl = response.headers.get("cache-control");
  const decision = decideEdgeCache({
    method: input.request.method,
    pathname: input.pathname,
    status: response.status,
    mode: input.mode,
    config: input.config,
    hasSessionCookie: hasSessionCookie(input.request.headers.get("cookie")),
    hasAuthorizationHeader: response.headers.has("www-authenticate")
      ? true
      : input.request.headers.has("authorization"),
    responseSetsCookie: response.headers.has("set-cookie"),
    existingCacheControl
  });

  for (const [name, value] of buildEdgeCacheHeaders(
    decision,
    input.config,
    existingCacheControl
  )) {
    if (name === "Vary") {
      response.headers.set(
        "Vary",
        mergeVary(response.headers.get("vary"), value)
      );
      continue;
    }

    response.headers.set(name, value);
  }

  return { response, decision };
}
