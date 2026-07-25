#!/usr/bin/env bun
/**
 * `bun run edge-cache:verify -- --url=https://example.test/` (Issue #359
 * follow-up).
 *
 * Proves invalidation by its EFFECT, not by the call it makes.
 *
 * `edge-cache:health` can only report that the ban endpoint answers the way
 * it should; it cannot tell whether a purge actually removes anything —
 * and for two releases it did not, while every signal said healthy. So this
 * command asserts the one thing no transport bug can fake:
 *
 *   1. fetch the URL twice — the second must be a cache HIT;
 *   2. purge that host and path;
 *   3. fetch again — it must now be a MISS.
 *
 * A MISS on step 3 alone would prove nothing (TTL expiry looks identical),
 * which is why step 1 establishes a live HIT immediately beforehand: the
 * whole sequence runs in well under any sane TTL.
 *
 * Exit code 0 only when the full sequence holds. Safe to run against a
 * production URL — the cost is one cache refill.
 */
import {
  isValidPurgeRequest,
  purgeEdgeCache
} from "../src/lib/cache/edge-cache-purge";
import { loadEdgeCacheConfig } from "../src/lib/cache/edge-cache-config";

const PROBE_TIMEOUT_MS = 10_000;

function readFlag(name: string): string | undefined {
  const prefix = `--${name}=`;
  const match = process.argv.find((argument) => argument.startsWith(prefix));

  return match?.slice(prefix.length);
}

const rawUrl = readFlag("url");

if (!rawUrl) {
  console.error(
    "Usage: bun run edge-cache:verify -- --url=<public url> [--host=<fqdn>]"
  );
  process.exit(2);
}

let target: URL;

try {
  target = new URL(rawUrl);
} catch {
  console.error(`--url is not a valid URL: ${rawUrl}`);
  process.exit(2);
}

// The cache keys on the request host; `--host` exists for the case where the
// probe goes to an internal address while the cached object belongs to the
// public hostname.
const host = readFlag("host") ?? target.hostname;

type Probe = { status: number; cache: string | null };

async function probe(): Promise<Probe> {
  const response = await fetch(target, {
    headers: { Host: host },
    redirect: "manual",
    signal: AbortSignal.timeout(PROBE_TIMEOUT_MS)
  });

  // Drain so the connection is released before the next probe.
  await response.arrayBuffer();

  return {
    status: response.status,
    cache: response.headers.get("x-cache")
  };
}

type Step = { step: string; result: string; ok: boolean };

const steps: Step[] = [];
const config = loadEdgeCacheConfig();

function report(exitCode: number, verdict: string): never {
  console.log(
    JSON.stringify(
      {
        check: "edge-cache-verify",
        url: target.toString(),
        host,
        verdict,
        steps
      },
      null,
      2
    )
  );

  process.exit(exitCode);
}

if (!config.enabled || !config.purgeUrl || !config.purgeToken) {
  steps.push({
    step: "config",
    result:
      "EDGE_CACHE_ENABLED / EDGE_CACHE_PURGE_URL / EDGE_CACHE_PURGE_TOKEN incomplete",
    ok: false
  });

  report(2, "not_configured");
}

let warm: Probe;
let hit: Probe;

try {
  warm = await probe();
  hit = await probe();
} catch (error) {
  steps.push({
    step: "probe",
    result: error instanceof Error ? error.message : "unknown error",
    ok: false
  });

  report(1, "unreachable");
}

steps.push({
  step: "1. warm",
  result: `HTTP ${warm.status}, X-Cache: ${warm.cache ?? "(absent)"}`,
  ok: warm.status < 400
});

const cached = hit.cache === "HIT";

steps.push({
  step: "2. second request must be a HIT",
  result: `X-Cache: ${hit.cache ?? "(absent)"}`,
  ok: cached
});

if (!cached) {
  // Not a purge failure: either no cache is in front of this URL, or the
  // route is (correctly) not cacheable. Saying so beats a false alarm.
  report(
    1,
    hit.cache === null
      ? "no_cache_in_front"
      : "url_not_cacheable_or_cache_not_serving"
  );
}

// Scoped to this exact path, so verifying against a production URL costs one
// object rather than the whole host.
const purgeRequest = { host, pathPattern: `^${target.pathname}$` };

if (!isValidPurgeRequest(purgeRequest)) {
  steps.push({
    step: "3. purge",
    result: `path cannot be expressed as a ban pattern: ${target.pathname}`,
    ok: false
  });

  // Widening to the whole host would verify something the operator did not
  // ask for, on a URL they chose deliberately. Better to say so.
  report(2, "path_not_expressible");
}

const purge = await purgeEdgeCache(purgeRequest, config);

steps.push({
  step: "3. purge",
  result: JSON.stringify(purge),
  ok: purge.status === "purged"
});

if (purge.status !== "purged") {
  report(1, "purge_failed");
}

let afterPurge: Probe;

try {
  afterPurge = await probe();
} catch (error) {
  steps.push({
    step: "4. probe after purge",
    result: error instanceof Error ? error.message : "unknown error",
    ok: false
  });

  report(1, "unreachable_after_purge");
}

const evicted = afterPurge.cache === "MISS";

steps.push({
  step: "4. request after purge must be a MISS",
  result: `X-Cache: ${afterPurge.cache ?? "(absent)"}`,
  ok: evicted
});

if (!evicted) {
  // The purge reported success and the object survived — the exact shape of
  // the failure this command exists to detect.
  report(1, "purge_reported_success_but_object_survived");
}

report(0, "invalidation_effective");
