import { describe, expect, test } from "bun:test";

import {
  loadEdgeCacheConfig,
  validateEdgeCacheConfig,
  type EdgeCacheConfig
} from "../../src/lib/cache/edge-cache-config";
import {
  buildEdgeCacheHeaders,
  decideEdgeCache,
  isPublicCacheableRoute,
  type EdgeCacheDecisionInput
} from "../../src/lib/cache/edge-cache-policy";
import {
  applyEdgeCacheToResponse,
  hasSessionCookie
} from "../../src/lib/cache/edge-cache-response";

const ENABLED_CONFIG: EdgeCacheConfig = {
  enabled: true,
  defaultTtlSeconds: 60,
  boostTtlSeconds: 300,
  browserTtlSeconds: 0,
  staleWhileRevalidateSeconds: 60,
  staleIfErrorSeconds: 600,
  autoEscalation: true,
  pressureThresholdPercent: 70,
  purgeUrl: null,
  purgeToken: null
};

function input(
  overrides: Partial<EdgeCacheDecisionInput> = {}
): EdgeCacheDecisionInput {
  return {
    method: "GET",
    pathname: "/",
    status: 200,
    mode: "normal",
    config: ENABLED_CONFIG,
    hasSessionCookie: false,
    hasAuthorizationHeader: false,
    responseSetsCookie: false,
    existingCacheControl: null,
    ...overrides
  };
}

describe("loadEdgeCacheConfig", () => {
  test("is disabled by default so the flag is a real no-op boundary", () => {
    expect(loadEdgeCacheConfig({}).enabled).toBe(false);
  });

  test("falls back to the documented default instead of throwing on a bad value", () => {
    const config = loadEdgeCacheConfig({
      EDGE_CACHE_ENABLED: "true",
      EDGE_CACHE_DEFAULT_TTL_SECONDS: "not-a-number",
      EDGE_CACHE_PRESSURE_THRESHOLD_PERCENT: "999"
    });

    expect(config.defaultTtlSeconds).toBe(60);
    expect(config.pressureThresholdPercent).toBe(70);
  });

  test("clamps a boost TTL that is shorter than the baseline", () => {
    // A boost below the baseline would weaken caching at exactly the
    // moment the database is struggling.
    const config = loadEdgeCacheConfig({
      EDGE_CACHE_ENABLED: "true",
      EDGE_CACHE_DEFAULT_TTL_SECONDS: "120",
      EDGE_CACHE_BOOST_TTL_SECONDS: "30"
    });

    expect(config.boostTtlSeconds).toBe(120);
  });

  test("warns when a purge URL is configured without a token", () => {
    const findings = validateEdgeCacheConfig({
      EDGE_CACHE_ENABLED: "true",
      EDGE_CACHE_PURGE_URL: "http://varnish:8080"
    });

    expect(findings.map((finding) => finding.code)).toContain(
      "purge_token_missing"
    );
  });

  test("reports no findings at all while the subsystem is disabled", () => {
    expect(
      validateEdgeCacheConfig({ EDGE_CACHE_PURGE_URL: "not-a-url" })
    ).toEqual([]);
  });
});

describe("isPublicCacheableRoute", () => {
  test.each([
    "/",
    "/robots.txt",
    "/sitemap.xml",
    "/sitemap-2.xml",
    "/feed.xml",
    "/atom.xml",
    "/search",
    "/blog/acme/hello-world",
    "/news/some-article",
    "/theming/tokens.css"
  ])("allows the public route %s", (pathname) => {
    expect(isPublicCacheableRoute(pathname)).toBe(true);
  });

  test.each([
    "/admin",
    "/admin/dashboard",
    "/api/v1/health",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/comments/demo",
    "/newsletter/demo",
    "/theming/preview/abc",
    "/theming/preview-tokens/abc.css",
    "/unknown-future-route"
  ])("denies %s", (pathname) => {
    expect(isPublicCacheableRoute(pathname)).toBe(false);
  });

  test("the denylist wins over an allow prefix", () => {
    // Guards the ordering: were the allowlist checked first, a future
    // route nested under an allowed prefix could become cacheable.
    expect(isPublicCacheableRoute("/news/../admin")).toBe(true);
    expect(isPublicCacheableRoute("/admin/news/anything")).toBe(false);
  });
});

describe("decideEdgeCache", () => {
  test("caches an anonymous GET of an allowlisted public route", () => {
    const decision = decideEdgeCache(input());

    expect(decision).toEqual({
      cacheable: true,
      mode: "normal",
      ttlSeconds: 60
    });
  });

  test("uses the boost TTL while escalated", () => {
    const decision = decideEdgeCache(input({ mode: "boost" }));

    expect(decision).toEqual({
      cacheable: true,
      mode: "boost",
      ttlSeconds: 300
    });
  });

  test.each([
    ["a session cookie", { hasSessionCookie: true }, "session_cookie_present"],
    [
      "an Authorization header",
      { hasAuthorizationHeader: true },
      "authorization_header_present"
    ],
    [
      "a Set-Cookie response",
      { responseSetsCookie: true },
      "response_sets_cookie"
    ],
    ["a POST", { method: "POST" }, "method_not_cacheable"],
    ["a non-200 status", { status: 404 }, "status_not_cacheable"],
    ["an admin route", { pathname: "/admin/x" }, "route_denylisted"],
    ["an unknown route", { pathname: "/whatever" }, "route_not_allowlisted"],
    [
      "a handler-declared private response",
      { existingCacheControl: "private, no-store" },
      "handler_declared_private"
    ],
    ["the subsystem being off", { mode: "off" as const }, "disabled"]
  ])("refuses to cache %s", (_label, overrides, reason) => {
    const decision = decideEdgeCache(input(overrides));

    expect(decision.cacheable).toBe(false);
    expect(decision).toHaveProperty("reason", reason);
  });

  test("a session cookie beats an otherwise perfectly cacheable request", () => {
    // The single most damaging failure this layer could have is serving
    // one reader's page to another, so it is asserted on its own.
    const decision = decideEdgeCache(
      input({ pathname: "/", hasSessionCookie: true })
    );

    expect(decision.cacheable).toBe(false);
  });
});

describe("buildEdgeCacheHeaders", () => {
  test("emits the surrogate TTL, stale directives and a revalidating browser policy", () => {
    const headers = new Map(
      buildEdgeCacheHeaders(
        { cacheable: true, mode: "normal", ttlSeconds: 60 },
        ENABLED_CONFIG,
        null
      )
    );

    expect(headers.get("Surrogate-Control")).toBe(
      "max-age=60, stale-while-revalidate=60, stale-if-error=600"
    );
    expect(headers.get("Cache-Control")).toBe(
      "public, max-age=0, must-revalidate"
    );
    expect(headers.get("Vary")).toBe("Accept-Encoding, Cookie");
    expect(headers.get("X-AWCMS-Edge-Cache")).toBe("cacheable");
  });

  test("never overwrites a Cache-Control the handler already chose", () => {
    const headers = new Map(
      buildEdgeCacheHeaders(
        { cacheable: true, mode: "normal", ttlSeconds: 60 },
        ENABLED_CONFIG,
        "public, max-age=3600"
      )
    );

    expect(headers.has("Cache-Control")).toBe(false);
    expect(headers.get("Surrogate-Control")).toContain("max-age=60");
  });

  test("marks a bypass explicitly rather than staying silent", () => {
    const headers = new Map(
      buildEdgeCacheHeaders(
        { cacheable: false, reason: "route_not_allowlisted" },
        ENABLED_CONFIG,
        null
      )
    );

    expect(headers.get("Surrogate-Control")).toBe("no-store");
    expect(headers.get("Cache-Control")).toBe("private, no-store");
  });

  test("adds nothing at all when the subsystem is disabled", () => {
    expect(
      buildEdgeCacheHeaders(
        { cacheable: false, reason: "disabled" },
        ENABLED_CONFIG,
        null
      )
    ).toEqual([]);
  });
});

describe("hasSessionCookie", () => {
  test("matches the real session cookie in any position", () => {
    expect(hasSessionCookie("awcms_micro_session=abc")).toBe(true);
    expect(
      hasSessionCookie("awcms_micro_locale=id; awcms_micro_session=abc")
    ).toBe(true);
  });

  test("does not mistake a differently-named cookie for the session", () => {
    // A false positive here is harmless; a false NEGATIVE would make a
    // logged-in reader's page cacheable, so the parse is anchored.
    expect(hasSessionCookie("not_awcms_micro_session=abc")).toBe(false);
    expect(hasSessionCookie("awcms_micro_session_hint=abc")).toBe(false);
    expect(hasSessionCookie(null)).toBe(false);
  });
});

describe("applyEdgeCacheToResponse", () => {
  test("annotates a cacheable public response", () => {
    const { response, decision } = applyEdgeCacheToResponse(
      new Response("<html></html>", { status: 200 }),
      {
        request: new Request("https://tenant.example/"),
        pathname: "/",
        mode: "normal",
        config: ENABLED_CONFIG
      }
    );

    expect(decision.cacheable).toBe(true);
    expect(response.headers.get("surrogate-control")).toContain("max-age=60");
    expect(response.headers.get("x-awcms-edge-cache")).toBe("cacheable");
  });

  test("bypasses a request that carries a session cookie", () => {
    const { response, decision } = applyEdgeCacheToResponse(
      new Response("<html></html>", { status: 200 }),
      {
        request: new Request("https://tenant.example/", {
          headers: { cookie: "awcms_micro_session=abc" }
        }),
        pathname: "/",
        mode: "normal",
        config: ENABLED_CONFIG
      }
    );

    expect(decision).toEqual({
      cacheable: false,
      reason: "session_cookie_present"
    });
    expect(response.headers.get("surrogate-control")).toBe("no-store");
  });

  test("merges into an existing Vary instead of replacing it", () => {
    const response = new Response("body", {
      status: 200,
      headers: { vary: "Accept-Language" }
    });

    applyEdgeCacheToResponse(response, {
      request: new Request("https://tenant.example/"),
      pathname: "/",
      mode: "normal",
      config: ENABLED_CONFIG
    });

    expect(response.headers.get("vary")).toBe(
      "Accept-Language, Accept-Encoding, Cookie"
    );
  });

  test("does not duplicate a Vary token that is already present", () => {
    const response = new Response("body", {
      status: 200,
      headers: { vary: "accept-encoding" }
    });

    applyEdgeCacheToResponse(response, {
      request: new Request("https://tenant.example/"),
      pathname: "/",
      mode: "normal",
      config: ENABLED_CONFIG
    });

    expect(response.headers.get("vary")).toBe("accept-encoding, Cookie");
  });

  test("leaves the response completely untouched when disabled", () => {
    const response = new Response("body", { status: 200 });
    const before = [...response.headers.keys()].sort();

    applyEdgeCacheToResponse(response, {
      request: new Request("https://tenant.example/"),
      pathname: "/",
      mode: "off",
      config: { ...ENABLED_CONFIG, enabled: false }
    });

    expect([...response.headers.keys()].sort()).toEqual(before);
  });
});
