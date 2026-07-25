/**
 * The edge-cache invalidation transport, against a REAL Varnish (Issue #359
 * follow-up; the recommendation that came out of #361's post-mortem).
 *
 * ## Why this file has to exist
 *
 * Invalidation was completely dead for two releases while every gate
 * reported health. The unit suite stubs `fetch`; `bun run edge-cache:health`
 * used the same client as the code it was checking; and the client itself
 * concluded "purged" from a status code. All four looked independent and
 * were in fact one assumption — that the request we write is the request
 * that goes out. It was not: Bun's `fetch` silently rewrites a method it
 * does not know (`BAN`) to `GET`, so the request was served as an ordinary
 * page and answered 200.
 *
 * No amount of mocking can catch that class, because the mock replaces the
 * exact layer that breaks. The only assertion that could have caught it is
 * the one below: purge a real cache, then observe that the object is really
 * gone.
 *
 * The two operator CLIs are exercised here too, as real processes. A checker
 * that is itself unchecked is how `edge-cache:health` came to report health
 * for a subsystem that did nothing.
 *
 * Gating and the Docker requirement: see `varnish-fixture.ts`.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import {
  purgeEdgeCache,
  type EdgeCachePurgeResult
} from "../../src/lib/cache/edge-cache-purge";
import type { EdgeCacheConfig } from "../../src/lib/cache/edge-cache-config";
import {
  dockerAvailable,
  startVarnish,
  varnishSuiteRequired,
  type VarnishFixture
} from "./varnish-fixture";

const TEST_HOST = "cache-integration.awcms-micro.test";

let varnish: VarnishFixture | undefined;

beforeAll(async () => {
  if (!dockerAvailable) {
    return;
  }

  varnish = await startVarnish();
}, 120_000);

afterAll(async () => {
  await varnish?.stop();
});

function cacheConfig(
  overrides: Partial<EdgeCacheConfig> = {}
): EdgeCacheConfig {
  return {
    enabled: true,
    defaultTtlSeconds: 60,
    boostTtlSeconds: 300,
    browserTtlSeconds: 0,
    staleWhileRevalidateSeconds: 60,
    staleIfErrorSeconds: 600,
    autoEscalation: true,
    pressureThresholdPercent: 70,
    purgeUrl: varnish?.purgeUrl ?? null,
    purgeToken: varnish?.purgeToken ?? null,
    ...overrides
  };
}

function probe(path = "/", init: RequestInit = {}) {
  if (!varnish) {
    throw new Error("varnish fixture not started");
  }

  return varnish.fetchThroughCache(TEST_HOST, path, init);
}

type CliRun = { exitCode: number; stdout: string };

/**
 * The operator CLIs as real processes — `bun run` them the way an operator
 * does, rather than importing their internals, so the exit code (which is
 * what a deploy pipeline reads) is part of the assertion.
 */
async function runCli(
  script: string,
  args: string[],
  env: Record<string, string>
): Promise<CliRun> {
  const spawned = Bun.spawn(["bun", script, ...args], {
    env: { ...process.env, ...env },
    stdout: "pipe",
    stderr: "pipe"
  });

  const stdout = await new Response(spawned.stdout).text();

  return { exitCode: await spawned.exited, stdout };
}

/**
 * The CLI's own report, isolated from the structured log lines that share
 * stdout with it.
 *
 * `src/lib/logging/logger.ts` writes to `console.log` by deliberate design
 * ("stdout stays the source of truth"), so a run that logs a warning — a
 * rejected purge, for instance — emits log JSON before the report JSON.
 * Parsing the whole stream would fail on exactly the failure paths these
 * tests care about most.
 */
function parseCliReport<T>(script: string, stdout: string): T {
  const marker = `{\n  "check": "${script}"`;
  const start = stdout.lastIndexOf(marker);

  if (start === -1) {
    throw new Error(`no ${script} report in CLI output:\n${stdout}`);
  }

  return JSON.parse(stdout.slice(start)) as T;
}

function cliEnv(
  overrides: Record<string, string> = {}
): Record<string, string> {
  return {
    EDGE_CACHE_ENABLED: "true",
    EDGE_CACHE_PURGE_URL: varnish?.purgeUrl ?? "",
    EDGE_CACHE_PURGE_TOKEN: varnish?.purgeToken ?? "",
    ...overrides
  };
}

describe.skipIf(!varnishSuiteRequired || dockerAvailable)(
  "edge cache integration environment",
  () => {
    test("CI requires Docker for this suite", () => {
      // Reached only when EDGE_CACHE_VARNISH_TEST=1 and Docker is missing:
      // the suite that guards the transport must never pass by being
      // skipped. Silence is the failure mode this whole file exists for.
      throw new Error(
        "EDGE_CACHE_VARNISH_TEST=1 but Docker is unavailable — the real-Varnish suite cannot run."
      );
    });
  }
);

describe.skipIf(!dockerAvailable)("edge cache against a real Varnish", () => {
  test("a purge really removes the object, and the origin is hit again", async () => {
    const first = await probe("/");
    expect(first.status).toBe(200);
    expect(first.cache).toBe("MISS");

    const second = await probe("/");
    expect(second.cache).toBe("HIT");
    expect(second.body).toBe(first.body);

    const hitsBeforePurge = varnish?.originHits() ?? 0;

    const result: EdgeCachePurgeResult = await purgeEdgeCache(
      { host: TEST_HOST },
      cacheConfig()
    );
    expect(result).toEqual({ status: "purged" });

    // The assertion that a stubbed `fetch` structurally cannot make: the
    // cache no longer holds the object, and the ORIGIN sees the next read.
    const afterPurge = await probe("/");
    expect(afterPurge.cache).toBe("MISS");
    expect(afterPurge.body).not.toBe(first.body);
    expect(varnish?.originHits() ?? 0).toBeGreaterThan(hitsBeforePurge);

    expect((await probe("/")).cache).toBe("HIT");
  }, 30_000);

  test("a path pattern bans only the paths it names", async () => {
    await probe("/scoped/one");
    await probe("/other/two");
    expect((await probe("/scoped/one")).cache).toBe("HIT");
    expect((await probe("/other/two")).cache).toBe("HIT");

    const result = await purgeEdgeCache(
      { host: TEST_HOST, pathPattern: "^/scoped" },
      cacheConfig()
    );
    expect(result).toEqual({ status: "purged" });

    expect((await probe("/scoped/one")).cache).toBe("MISS");
    expect((await probe("/other/two")).cache).toBe("HIT");
  }, 30_000);

  test("a ban for another host leaves this host's objects alone", async () => {
    await probe("/tenant-boundary");
    expect((await probe("/tenant-boundary")).cache).toBe("HIT");

    const result = await purgeEdgeCache(
      { host: "someone-else.awcms-micro.test" },
      cacheConfig()
    );
    expect(result).toEqual({ status: "purged" });

    expect((await probe("/tenant-boundary")).cache).toBe("HIT");
  }, 30_000);

  test("a 200 from something that is not the ban handler is reported failed", async () => {
    // The origin answers 200 to every path, including the ban path — which
    // is precisely what happened when the request arrived as a rewritten
    // `GET`. Without the marker check this returns "purged" and the bug is
    // back.
    const result = await purgeEdgeCache(
      { host: TEST_HOST },
      cacheConfig({ purgeUrl: `http://127.0.0.1:${varnish?.backendPort ?? 0}` })
    );

    expect(result).toEqual({ status: "failed", reason: "unmarked_response" });
  }, 30_000);

  test("the wrong token cannot invalidate anything", async () => {
    await probe("/token-guard");
    expect((await probe("/token-guard")).cache).toBe("HIT");

    const result = await purgeEdgeCache(
      { host: TEST_HOST },
      cacheConfig({ purgeToken: "not-the-deployment-secret" })
    );

    expect(result).toEqual({ status: "failed", reason: "http_403" });
    expect((await probe("/token-guard")).cache).toBe("HIT");
  }, 30_000);

  test("the ban path answers only to POST", async () => {
    const viaGet = await probe("/__awcms-edge-cache/ban");

    expect(viaGet.status).toBe(405);
    expect(viaGet.headers.get("x-edge-cache-ban")).toBeNull();
  }, 30_000);

  test("Surrogate-Control never reaches a client, cacheable or not", async () => {
    const cacheable = await probe("/leak-check");
    const uncacheable = await probe("/uncacheable");

    expect(cacheable.headers.get("surrogate-control")).toBeNull();
    expect(uncacheable.headers.get("surrogate-control")).toBeNull();

    // And the response the app marked no-store is genuinely not stored.
    expect((await probe("/uncacheable")).cache).toBe("MISS");
  }, 30_000);

  test("a request carrying a session cookie is never served from the cache", async () => {
    await probe("/session-bypass");
    expect((await probe("/session-bypass")).cache).toBe("HIT");

    const authenticated = await probe("/session-bypass", {
      headers: { Cookie: "awcms_micro_session=opaque-session-token" }
    });

    expect(authenticated.cache).toBe("MISS");
  }, 30_000);
});

describe.skipIf(!dockerAvailable)(
  "operator CLIs against a real Varnish",
  () => {
    test("edge-cache:verify proves the purge by its effect", async () => {
      const url = `http://127.0.0.1:${varnish?.varnishPort ?? 0}/cli-verify`;

      const run = await runCli(
        "scripts/edge-cache-verify.ts",
        [`--url=${url}`, `--host=${TEST_HOST}`],
        cliEnv()
      );

      expect(run.exitCode).toBe(0);

      const report = parseCliReport<{
        verdict: string;
        steps: { ok: boolean }[];
      }>("edge-cache-verify", run.stdout);

      expect(report.verdict).toBe("invalidation_effective");
      expect(report.steps.every((step) => step.ok)).toBe(true);
    }, 30_000);

    test("edge-cache:verify fails when the purge is rejected", async () => {
      const url = `http://127.0.0.1:${varnish?.varnishPort ?? 0}/cli-verify-token`;

      const run = await runCli(
        "scripts/edge-cache-verify.ts",
        [`--url=${url}`, `--host=${TEST_HOST}`],
        cliEnv({ EDGE_CACHE_PURGE_TOKEN: "not-the-deployment-secret" })
      );

      // A non-zero exit is the whole contract: a deploy pipeline reads this,
      // and reporting success for an invalidation that did not happen is the
      // original defect.
      expect(run.exitCode).toBe(1);
      expect(
        parseCliReport<{ verdict: string }>("edge-cache-verify", run.stdout)
          .verdict
      ).toBe("purge_failed");
    }, 30_000);

    test("edge-cache:verify reports when nothing is caching the URL", async () => {
      const url = `http://127.0.0.1:${varnish?.backendPort ?? 0}/no-cache-here`;

      const run = await runCli(
        "scripts/edge-cache-verify.ts",
        [`--url=${url}`, `--host=${TEST_HOST}`],
        cliEnv()
      );

      expect(run.exitCode).toBe(1);
      expect(
        parseCliReport<{ verdict: string }>("edge-cache-verify", run.stdout)
          .verdict
      ).toBe("no_cache_in_front");
    }, 30_000);

    test("edge-cache:health sees the endpoint reject an unauthenticated ban", async () => {
      const run = await runCli("scripts/edge-cache-health.ts", [], cliEnv());

      expect(run.exitCode).toBe(0);

      const report = parseCliReport<{
        purge: { endpoint: { status: string } };
      }>("edge-cache", run.stdout);

      expect(report.purge.endpoint.status).toBe("reachable");
    }, 30_000);

    test("edge-cache:health fails when the ban endpoint accepts anyone", async () => {
      // The origin accepts everything, standing in for a cache whose token
      // check is missing or misconfigured. Exit code 1 is what makes this a
      // gate rather than a report.
      const run = await runCli(
        "scripts/edge-cache-health.ts",
        [],
        cliEnv({
          EDGE_CACHE_PURGE_URL: `http://127.0.0.1:${varnish?.backendPort ?? 0}`
        })
      );

      expect(run.exitCode).toBe(1);
      expect(
        parseCliReport<{ purge: { endpoint: { status: string } } }>(
          "edge-cache",
          run.stdout
        ).purge.endpoint.status
      ).toBe("unprotected");
    }, 30_000);
  }
);
