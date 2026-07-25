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
 * gone. Everything here therefore runs against `varnish:7.7.3` started from
 * this repo's own `deploy/varnish/default.vcl` — the shipped file, not a
 * fixture — with only the backend address rewritten, exactly as the staging
 * repoint script does.
 *
 * ## Gating
 *
 * Skipped when Docker is unavailable so a laptop without it stays green.
 * That is a real hazard on its own (a silent skip is how ~1000 integration
 * tests can quietly not run), so CI sets `EDGE_CACHE_VARNISH_TEST=1`, which
 * turns "cannot run" into a LOUD FAILURE instead of a skip.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  purgeEdgeCache,
  type EdgeCachePurgeResult
} from "../../src/lib/cache/edge-cache-purge";
import type { EdgeCacheConfig } from "../../src/lib/cache/edge-cache-config";

const VARNISH_IMAGE = "varnish:7.7.3";
const PURGE_TOKEN = "integration-edge-cache-purge-token";
const TEST_HOST = "cache-integration.awcms-micro.test";
const REQUIRED = process.env.EDGE_CACHE_VARNISH_TEST === "1";

async function commandSucceeds(command: string[]): Promise<boolean> {
  try {
    const process = Bun.spawn(command, { stdout: "pipe", stderr: "pipe" });

    return (await process.exited) === 0;
  } catch {
    return false;
  }
}

const dockerAvailable = await commandSucceeds(["docker", "info"]);

/**
 * A free TCP port, obtained by binding and immediately releasing one.
 *
 * Racy in principle; acceptable here because the container claims it
 * milliseconds later and a collision surfaces as an obvious startup failure
 * rather than a wrong assertion.
 */
function reserveEphemeralPort(): number {
  const probe = Bun.serve({
    port: 0,
    hostname: "127.0.0.1",
    fetch: () => new Response("")
  });
  // `port` is optional in Bun's type (a server may be bound to a unix
  // socket instead); it is always present for a TCP listener like this one.
  const port = probe.port ?? 0;

  probe.stop(true);

  if (port === 0) {
    throw new Error("could not reserve a TCP port for the cache container");
  }

  return port;
}

type Backend = {
  port: number;
  /** How many requests actually reached the origin — a cache HIT must not move this. */
  hits: () => number;
  stop: () => void;
};

/**
 * Minimal origin standing in for the app: it speaks the same contract the
 * middleware does (`Surrogate-Control` for the shared cache, `Vary: Cookie`),
 * which is all the VCL consumes.
 */
function startBackend(): Backend {
  let hits = 0;

  const server = Bun.serve({
    port: 0,
    hostname: "127.0.0.1",
    fetch(request) {
      hits += 1;

      const url = new URL(request.url);
      const body = `origin-response ${url.pathname} #${hits}`;

      if (url.pathname === "/uncacheable") {
        return new Response(body, {
          headers: {
            "Content-Type": "text/html",
            "Surrogate-Control": "no-store"
          }
        });
      }

      return new Response(body, {
        headers: {
          "Content-Type": "text/html",
          "Surrogate-Control": "max-age=60, stale-if-error=600",
          "Cache-Control": "public, max-age=0, must-revalidate",
          Vary: "Cookie"
        }
      });
    }
  });

  return {
    port: server.port ?? 0,
    hits: () => hits,
    stop: () => server.stop(true)
  };
}

let backend: Backend | undefined;
let containerId = "";
let varnishPort = 0;
let workDirectory = "";

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
    purgeUrl: `http://127.0.0.1:${varnishPort}`,
    purgeToken: PURGE_TOKEN,
    ...overrides
  };
}

/** One request through the cache, reported as the cache classified it. */
async function fetchThroughCache(
  path = "/",
  init: RequestInit = {}
): Promise<{
  status: number;
  cache: string | null;
  body: string;
  headers: Headers;
}> {
  const response = await fetch(`http://127.0.0.1:${varnishPort}${path}`, {
    ...init,
    headers: { Host: TEST_HOST, ...(init.headers ?? {}) },
    signal: AbortSignal.timeout(5_000)
  });

  return {
    status: response.status,
    cache: response.headers.get("x-cache"),
    body: await response.text(),
    headers: response.headers
  };
}

async function waitForVarnish(): Promise<void> {
  const deadline = Date.now() + 40_000;

  while (Date.now() < deadline) {
    try {
      const probe = await fetchThroughCache("/readiness-probe");

      if (probe.status === 200) {
        return;
      }
    } catch {
      // Not listening yet.
    }

    await Bun.sleep(400);
  }

  throw new Error(`${VARNISH_IMAGE} did not become reachable within 40s`);
}

beforeAll(async () => {
  if (!dockerAvailable) {
    return;
  }

  backend = startBackend();
  varnishPort = reserveEphemeralPort();
  workDirectory = await mkdtemp(join(tmpdir(), "awcms-micro-varnish-"));

  // The SHIPPED VCL, with only the backend address rewritten — the same
  // single substitution the staging repoint script performs. Testing a
  // copy would defeat the purpose: the rules under test live in that file.
  const shippedVcl = await Bun.file("deploy/varnish/default.vcl").text();
  const vcl = shippedVcl
    .replace('.host = "app";', '.host = "127.0.0.1";')
    .replace('.port = "4321";', `.port = "${backend.port}";`);

  expect(vcl).toContain(`.port = "${backend.port}";`);

  const vclPath = join(workDirectory, "default.vcl");
  await writeFile(vclPath, vcl, "utf8");

  // `--network host` so the containerized cache can reach the in-process
  // backend on 127.0.0.1 without a published port.
  const run = Bun.spawn(
    [
      "docker",
      "run",
      "--rm",
      "--detach",
      "--network",
      "host",
      "--env",
      `EDGE_CACHE_PURGE_TOKEN=${PURGE_TOKEN}`,
      "--volume",
      `${vclPath}:/etc/varnish/default.vcl:ro`,
      VARNISH_IMAGE,
      "varnishd",
      "-F",
      "-f",
      "/etc/varnish/default.vcl",
      "-a",
      `:${varnishPort}`,
      "-s",
      "malloc,64M"
    ],
    { stdout: "pipe", stderr: "pipe" }
  );

  const stdout = await new Response(run.stdout).text();
  const stderr = await new Response(run.stderr).text();

  if ((await run.exited) !== 0) {
    throw new Error(`docker run failed: ${stderr || stdout}`);
  }

  containerId = stdout.trim();

  await waitForVarnish();
}, 120_000);

afterAll(async () => {
  if (containerId) {
    Bun.spawnSync(["docker", "rm", "--force", containerId], {
      stdout: "ignore",
      stderr: "ignore"
    });
  }

  backend?.stop();

  if (workDirectory) {
    await rm(workDirectory, { recursive: true, force: true });
  }
});

describe.skipIf(!REQUIRED || dockerAvailable)(
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
    const path = "/";

    const first = await fetchThroughCache(path);
    expect(first.status).toBe(200);
    expect(first.cache).toBe("MISS");

    const second = await fetchThroughCache(path);
    expect(second.cache).toBe("HIT");
    expect(second.body).toBe(first.body);

    const hitsBeforePurge = backend?.hits() ?? 0;

    const result: EdgeCachePurgeResult = await purgeEdgeCache(
      { host: TEST_HOST },
      cacheConfig()
    );
    expect(result).toEqual({ status: "purged" });

    // The assertion that a stubbed `fetch` structurally cannot make: the
    // cache no longer holds the object, and the ORIGIN sees the next read.
    const afterPurge = await fetchThroughCache(path);
    expect(afterPurge.cache).toBe("MISS");
    expect(afterPurge.body).not.toBe(first.body);
    expect(backend?.hits() ?? 0).toBeGreaterThan(hitsBeforePurge);

    expect((await fetchThroughCache(path)).cache).toBe("HIT");
  }, 30_000);

  test("a path pattern bans only the paths it names", async () => {
    await fetchThroughCache("/scoped/one");
    await fetchThroughCache("/other/two");
    expect((await fetchThroughCache("/scoped/one")).cache).toBe("HIT");
    expect((await fetchThroughCache("/other/two")).cache).toBe("HIT");

    const result = await purgeEdgeCache(
      { host: TEST_HOST, pathPattern: "^/scoped" },
      cacheConfig()
    );
    expect(result).toEqual({ status: "purged" });

    expect((await fetchThroughCache("/scoped/one")).cache).toBe("MISS");
    expect((await fetchThroughCache("/other/two")).cache).toBe("HIT");
  }, 30_000);

  test("a ban for another host leaves this host's objects alone", async () => {
    await fetchThroughCache("/tenant-boundary");
    expect((await fetchThroughCache("/tenant-boundary")).cache).toBe("HIT");

    const result = await purgeEdgeCache(
      { host: "someone-else.awcms-micro.test" },
      cacheConfig()
    );
    expect(result).toEqual({ status: "purged" });

    expect((await fetchThroughCache("/tenant-boundary")).cache).toBe("HIT");
  }, 30_000);

  test("a 200 from something that is not the ban handler is reported failed", async () => {
    // The origin answers 200 to every path, including the ban path — which
    // is precisely what happened when the request arrived as a rewritten
    // `GET`. Without the marker check this returns "purged" and the bug is
    // back.
    const result = await purgeEdgeCache(
      { host: TEST_HOST },
      cacheConfig({ purgeUrl: `http://127.0.0.1:${backend?.port ?? 0}` })
    );

    expect(result).toEqual({ status: "failed", reason: "unmarked_response" });
  }, 30_000);

  test("the wrong token cannot invalidate anything", async () => {
    await fetchThroughCache("/token-guard");
    expect((await fetchThroughCache("/token-guard")).cache).toBe("HIT");

    const result = await purgeEdgeCache(
      { host: TEST_HOST },
      cacheConfig({ purgeToken: "not-the-deployment-secret" })
    );

    expect(result).toEqual({ status: "failed", reason: "http_403" });
    expect((await fetchThroughCache("/token-guard")).cache).toBe("HIT");
  }, 30_000);

  test("the ban path answers only to POST", async () => {
    const viaGet = await fetchThroughCache("/__awcms-edge-cache/ban");

    expect(viaGet.status).toBe(405);
    expect(viaGet.headers.get("x-edge-cache-ban")).toBeNull();
  }, 30_000);

  test("Surrogate-Control never reaches a client, cacheable or not", async () => {
    const cacheable = await fetchThroughCache("/leak-check");
    const uncacheable = await fetchThroughCache("/uncacheable");

    expect(cacheable.headers.get("surrogate-control")).toBeNull();
    expect(uncacheable.headers.get("surrogate-control")).toBeNull();

    // And the response the app marked no-store is genuinely not stored.
    expect((await fetchThroughCache("/uncacheable")).cache).toBe("MISS");
  }, 30_000);

  test("a request carrying a session cookie is never served from the cache", async () => {
    await fetchThroughCache("/session-bypass");
    expect((await fetchThroughCache("/session-bypass")).cache).toBe("HIT");

    const authenticated = await fetchThroughCache("/session-bypass", {
      headers: { Cookie: "awcms_micro_session=opaque-session-token" }
    });

    expect(authenticated.cache).toBe("MISS");
  }, 30_000);
});
