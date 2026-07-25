import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import { resetDatabaseCircuitBreakerForTests } from "../../src/lib/database/circuit-breaker";

import type { EdgeCacheConfig } from "../../src/lib/cache/edge-cache-config";
import {
  invalidatePublicCacheForTenant,
  withPublicCacheInvalidation
} from "../../src/lib/cache/edge-cache-invalidation";

const TENANT_ID = "11111111-2222-3333-4444-555555555555";

const CONFIGURED: EdgeCacheConfig = {
  enabled: true,
  defaultTtlSeconds: 60,
  boostTtlSeconds: 300,
  browserTtlSeconds: 0,
  staleWhileRevalidateSeconds: 60,
  staleIfErrorSeconds: 600,
  autoEscalation: true,
  pressureThresholdPercent: 70,
  purgeUrl: "http://varnish.invalid:8080",
  purgeToken: "token"
};

/**
 * A `Bun.SQL` stand-in that records whether it was used at all. The
 * "unconfigured deployments do zero database work" rule is the one that is
 * easiest to regress silently and impossible to notice in production, so it
 * is asserted directly rather than inferred.
 */
function createSqlSpy(rows: Array<{ hostname: string }> = []) {
  const state = { calls: 0 };

  const tagged = Object.assign(
    (..._args: unknown[]) => {
      state.calls += 1;
      return Promise.resolve(rows);
    },
    // `withTenant` sets the tenant GUC through `tx.unsafe(...)` before it
    // runs the callback — the spy has to honour that, not just the
    // tagged-template call.
    { unsafe: (_sql: string) => Promise.resolve([]) }
  );

  // `withTenant` calls `sql.begin(fn)` internally in this codebase; the spy
  // hands the same tagged-template function back as the transaction handle.
  const sql = Object.assign(tagged, {
    begin: async (fn: (tx: unknown) => Promise<unknown>) => fn(tagged)
  });

  return { sql: sql as unknown as Bun.SQL, state };
}

const originalFetch = globalThis.fetch;

beforeEach(() => {
  // These cases deliberately drive failures through `withTenant`, which
  // shares one process-wide database circuit breaker — without this reset a
  // later test inherits an open breaker from an earlier one.
  resetDatabaseCircuitBreakerForTests();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  resetDatabaseCircuitBreakerForTests();
});

describe("invalidatePublicCacheForTenant — not configured", () => {
  test.each([
    ["disabled", { ...CONFIGURED, enabled: false }],
    ["no purge URL", { ...CONFIGURED, purgeUrl: null }],
    ["no purge token", { ...CONFIGURED, purgeToken: null }]
  ])(
    "skips and touches the database zero times when %s",
    async (_l, config) => {
      const { sql, state } = createSqlSpy([{ hostname: "tenant.example.com" }]);

      const result = await invalidatePublicCacheForTenant({
        sql,
        tenantId: TENANT_ID,
        reason: "blog.post.published",
        config
      });

      expect(result).toEqual({
        status: "skipped",
        hostsPurged: 0,
        hostsResolved: 0
      });
      // The point of the test: no hostname lookup for a purge never sent.
      expect(state.calls).toBe(0);
    }
  );
});

describe("invalidatePublicCacheForTenant — configured", () => {
  test("purges every active hostname of the tenant", async () => {
    const seen: Array<{ host: string; path: string }> = [];

    globalThis.fetch = (async (_url: string, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      seen.push({
        host: headers.get("x-ban-host") ?? "",
        path: headers.get("x-ban-path") ?? ""
      });

      return new Response(null, {
        status: 200,
        headers: { "X-Edge-Cache-Ban": "ok" }
      });
    }) as typeof fetch;

    const { sql } = createSqlSpy([
      { hostname: "tenant.example.com" },
      { hostname: "www.tenant.example.com" }
    ]);

    const result = await invalidatePublicCacheForTenant({
      sql,
      tenantId: TENANT_ID,
      reason: "blog.post.published",
      config: CONFIGURED
    });

    expect(result).toEqual({
      status: "purged",
      hostsPurged: 2,
      hostsResolved: 2
    });
    expect(seen.map((entry) => entry.host)).toEqual([
      "tenant.example.com",
      "www.tenant.example.com"
    ]);
    // Host-wide: publishing one post also changes listings, sitemap and feeds.
    expect(seen.every((entry) => entry.path === "^/")).toBe(true);
  });

  test("skips when the tenant has no active hostname", async () => {
    const { sql } = createSqlSpy([]);

    const result = await invalidatePublicCacheForTenant({
      sql,
      tenantId: TENANT_ID,
      reason: "blog.post.published",
      config: CONFIGURED
    });

    expect(result.status).toBe("skipped");
  });

  test("reports partial when only some hostnames could be purged", async () => {
    let call = 0;

    globalThis.fetch = (async () => {
      call += 1;
      return call === 1
        ? new Response(null, {
            status: 200,
            headers: { "X-Edge-Cache-Ban": "ok" }
          })
        : new Response(null, { status: 500 });
    }) as unknown as typeof fetch;

    const { sql } = createSqlSpy([
      { hostname: "a.example.com" },
      { hostname: "b.example.com" }
    ]);

    const result = await invalidatePublicCacheForTenant({
      sql,
      tenantId: TENANT_ID,
      reason: "blog.post.published",
      config: CONFIGURED
    });

    expect(result).toEqual({
      status: "partial",
      hostsPurged: 1,
      hostsResolved: 2
    });
  });

  test("fails open when the cache is unreachable — never throws", async () => {
    globalThis.fetch = (async () => {
      throw new Error("connection refused");
    }) as unknown as typeof fetch;

    const { sql } = createSqlSpy([{ hostname: "tenant.example.com" }]);

    const result = await invalidatePublicCacheForTenant({
      sql,
      tenantId: TENANT_ID,
      reason: "blog.post.published",
      config: CONFIGURED
    });

    expect(result.status).toBe("failed");
  });

  test("fails open when the hostname lookup itself throws", async () => {
    // A saturated pool makes `withTenant` throw here (unavailableBehavior
    // "throw"). A publish that already committed must not surface as an
    // error because of it.
    const failing = Object.assign(
      () => {
        throw new Error("DATABASE_BUSY");
      },
      { unsafe: () => Promise.resolve([]) }
    );
    const sql = Object.assign(failing, {
      begin: async (fn: (tx: unknown) => Promise<unknown>) => fn(failing)
    }) as unknown as Bun.SQL;

    const result = await invalidatePublicCacheForTenant({
      sql,
      tenantId: TENANT_ID,
      reason: "blog.post.published",
      config: CONFIGURED
    });

    expect(result).toEqual({
      status: "failed",
      hostsPurged: 0,
      hostsResolved: 0
    });
  });
});

describe("withPublicCacheInvalidation", () => {
  test("does not invalidate when the handler did not succeed", async () => {
    const { sql, state } = createSqlSpy([{ hostname: "tenant.example.com" }]);
    const failure = new Response("nope", { status: 404 });

    const returned = await withPublicCacheInvalidation(failure, {
      sql,
      tenantId: TENANT_ID,
      reason: "blog.post.published",
      config: CONFIGURED
    });

    expect(returned).toBe(failure);
    expect(state.calls).toBe(0);
  });

  test("does not invalidate on withTenant's own 503 pool fallback", async () => {
    // That fallback is a non-ok Response, not an exception — the case a
    // naive `try/catch` around the handler would miss entirely.
    const { sql, state } = createSqlSpy([{ hostname: "tenant.example.com" }]);
    const busy = new Response("busy", { status: 503 });

    await withPublicCacheInvalidation(busy, {
      sql,
      tenantId: TENANT_ID,
      reason: "blog.post.published",
      config: CONFIGURED
    });

    expect(state.calls).toBe(0);
  });

  test("returns the original response object untouched on success", async () => {
    globalThis.fetch = (async () =>
      new Response(null, {
        status: 200,
        headers: { "X-Edge-Cache-Ban": "ok" }
      })) as unknown as typeof fetch;

    const { sql } = createSqlSpy([{ hostname: "tenant.example.com" }]);
    const success = new Response(JSON.stringify({ ok: true }), { status: 200 });

    const returned = await withPublicCacheInvalidation(success, {
      sql,
      tenantId: TENANT_ID,
      reason: "blog.post.published",
      config: CONFIGURED
    });

    expect(returned).toBe(success);
    expect(await returned.json()).toEqual({ ok: true });
  });
});
