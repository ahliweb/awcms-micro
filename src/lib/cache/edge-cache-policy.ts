/**
 * Cacheability policy for the optional edge cache (Issue #353, ADR-0037).
 *
 * Default-deny: a response is cacheable ONLY when every one of the
 * conditions below holds. Adding a route to `PUBLIC_CACHEABLE_*` is
 * therefore a deliberate, reviewable act — the opposite of a cache that
 * silently starts storing whatever looks static.
 *
 * The dangerous failure here is not a low hit rate, it is one reader being
 * served another reader's (or another tenant's) page. That risk is closed
 * in three independent places, any one of which is sufficient:
 *
 * 1. this policy (no session cookie, no `Set-Cookie`, allowlisted public
 *    route, 200 only);
 * 2. the cache key, which includes the host — tenants are resolved by host
 *    (`PUBLIC_TENANT_RESOLUTION_MODE`), so two tenants can never collide on
 *    one entry — plus the locale cookie (`Vary: Cookie`, see below);
 * 3. the VCL itself (`deploy/varnish/default.vcl`), which passes any
 *    request carrying a session cookie and refuses to store any response
 *    carrying `Set-Cookie`, regardless of what this policy said.
 *
 * `Vary: Cookie` is emitted on every cacheable response on purpose. In a
 * naive shared cache that yields near-zero hit rate, which is the SAFE
 * direction; the reference VCL normalizes the request's `Cookie` header
 * down to the locale cookie before lookup, so in the intended topology the
 * header collapses to locale granularity and hit rates stay high.
 */
import type { EdgeCacheConfig } from "./edge-cache-config";
import type { EdgeCacheMode } from "./edge-cache-pressure";

/**
 * Never cacheable, checked BEFORE the allowlist so a future public route
 * accidentally nested under one of these can never become cacheable by
 * matching an allow prefix.
 *
 * `/comments` and `/newsletter` are excluded deliberately rather than by
 * omission: both are anti-enumeration surfaces whose responses are
 * intentionally uniform (Issue #271, #272), and caching them would add a
 * timing/consistency oracle to endpoints designed not to have one.
 */
const NEVER_CACHEABLE_PREFIXES = [
  "/admin",
  "/api/",
  "/login",
  "/logout",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/setup",
  "/comments",
  "/newsletter",
  "/theming/preview",
  "/theming/preview-tokens"
] as const;

/** Public, anonymous, identical-for-every-reader routes. */
const PUBLIC_CACHEABLE_EXACT = [
  "/",
  "/robots.txt",
  "/sitemap.xml",
  "/atom.xml",
  "/feed.xml",
  "/feed.json",
  "/search",
  "/theming/tokens.css"
] as const;

const PUBLIC_CACHEABLE_PREFIXES = ["/blog/", "/news/", "/sitemap-"] as const;

export const EDGE_CACHE_DIAGNOSTIC_HEADER = "X-AWCMS-Edge-Cache";
export const SURROGATE_CONTROL_HEADER = "Surrogate-Control";

export type EdgeCacheBypassReason =
  | "disabled"
  | "method_not_cacheable"
  | "status_not_cacheable"
  | "route_denylisted"
  | "route_not_allowlisted"
  | "session_cookie_present"
  | "authorization_header_present"
  | "response_sets_cookie"
  | "handler_declared_private";

export type EdgeCacheDecision =
  | { cacheable: false; reason: EdgeCacheBypassReason }
  | { cacheable: true; ttlSeconds: number; mode: "normal" | "boost" };

export type EdgeCacheDecisionInput = {
  method: string;
  pathname: string;
  status: number;
  mode: EdgeCacheMode;
  config: EdgeCacheConfig;
  hasSessionCookie: boolean;
  hasAuthorizationHeader: boolean;
  /**
   * Only catches cookies a route handler set directly on the `Response`.
   * Cookies queued through Astro's `context.cookies` are merged in AFTER
   * middleware returns and are invisible here by construction — which is
   * exactly why the VCL repeats this check on the response it is about to
   * store (see this file's header, defence 3).
   */
  responseSetsCookie: boolean;
  /** `Cache-Control` the route handler already set, if any. Never overwritten. */
  existingCacheControl: string | null;
};

export function isPublicCacheableRoute(pathname: string): boolean {
  if (NEVER_CACHEABLE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return false;
  }

  if ((PUBLIC_CACHEABLE_EXACT as readonly string[]).includes(pathname)) {
    return true;
  }

  return PUBLIC_CACHEABLE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
}

function declaresPrivate(cacheControl: string): boolean {
  const normalized = cacheControl.toLowerCase();

  return (
    normalized.includes("no-store") ||
    normalized.includes("private") ||
    normalized.includes("no-cache")
  );
}

export function decideEdgeCache(
  input: EdgeCacheDecisionInput
): EdgeCacheDecision {
  if (input.mode === "off" || !input.config.enabled) {
    return { cacheable: false, reason: "disabled" };
  }

  const method = input.method.toUpperCase();

  if (method !== "GET" && method !== "HEAD") {
    return { cacheable: false, reason: "method_not_cacheable" };
  }

  if (input.status !== 200) {
    return { cacheable: false, reason: "status_not_cacheable" };
  }

  if (input.hasSessionCookie) {
    return { cacheable: false, reason: "session_cookie_present" };
  }

  if (input.hasAuthorizationHeader) {
    return { cacheable: false, reason: "authorization_header_present" };
  }

  if (input.responseSetsCookie) {
    return { cacheable: false, reason: "response_sets_cookie" };
  }

  if (
    NEVER_CACHEABLE_PREFIXES.some((prefix) => input.pathname.startsWith(prefix))
  ) {
    return { cacheable: false, reason: "route_denylisted" };
  }

  if (!isPublicCacheableRoute(input.pathname)) {
    return { cacheable: false, reason: "route_not_allowlisted" };
  }

  if (
    input.existingCacheControl &&
    declaresPrivate(input.existingCacheControl)
  ) {
    return { cacheable: false, reason: "handler_declared_private" };
  }

  return {
    cacheable: true,
    mode: input.mode,
    ttlSeconds:
      input.mode === "boost"
        ? input.config.boostTtlSeconds
        : input.config.defaultTtlSeconds
  };
}

export type EdgeCacheHeader = readonly [name: string, value: string];

/**
 * Header set for a decision. `Cache-Control` is omitted entirely when the
 * handler already set one — this layer adds shared-cache instructions, it
 * does not second-guess a route that has thought about its own freshness
 * (`src/lib/seo/discovery-route.ts`, `src/lib/theming/theme-public-css.ts`).
 *
 * `Surrogate-Control` carries the aggressive TTL and is consumed and
 * stripped by the shared cache, so a browser never sees (or caches for)
 * the boosted duration — a reader always revalidates while the edge
 * absorbs the repeat traffic.
 */
export function buildEdgeCacheHeaders(
  decision: EdgeCacheDecision,
  config: EdgeCacheConfig,
  existingCacheControl: string | null
): EdgeCacheHeader[] {
  if (!decision.cacheable) {
    if (decision.reason === "disabled") {
      return [];
    }

    const headers: EdgeCacheHeader[] = [
      [SURROGATE_CONTROL_HEADER, "no-store"],
      [EDGE_CACHE_DIAGNOSTIC_HEADER, "bypass"]
    ];

    if (!existingCacheControl) {
      headers.push(["Cache-Control", "private, no-store"]);
    }

    return headers;
  }

  const surrogateParts = [`max-age=${decision.ttlSeconds}`];

  if (config.staleWhileRevalidateSeconds > 0) {
    surrogateParts.push(
      `stale-while-revalidate=${config.staleWhileRevalidateSeconds}`
    );
  }

  if (config.staleIfErrorSeconds > 0) {
    surrogateParts.push(`stale-if-error=${config.staleIfErrorSeconds}`);
  }

  const headers: EdgeCacheHeader[] = [
    [SURROGATE_CONTROL_HEADER, surrogateParts.join(", ")],
    [EDGE_CACHE_DIAGNOSTIC_HEADER, "cacheable"],
    ["Vary", "Accept-Encoding, Cookie"]
  ];

  if (!existingCacheControl) {
    headers.push([
      "Cache-Control",
      config.browserTtlSeconds > 0
        ? `public, max-age=${config.browserTtlSeconds}`
        : "public, max-age=0, must-revalidate"
    ]);
  }

  return headers;
}
