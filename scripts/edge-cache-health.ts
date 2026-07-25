#!/usr/bin/env bun
/**
 * `bun run edge-cache:health` (Issue #353, ADR-0037).
 *
 * Reports how this process would treat a public request right now: the
 * effective configuration, the current escalation mode, and — when an
 * invalidation endpoint is configured — whether that endpoint is
 * reachable and correctly rejects an unauthenticated BAN.
 *
 * Never prints EDGE_CACHE_PURGE_TOKEN. The endpoint URL is printed because
 * it is an internal service address, not a credential.
 */
import {
  loadEdgeCacheConfig,
  validateEdgeCacheConfig
} from "../src/lib/cache/edge-cache-config";
import {
  computePressureSample,
  nextEscalationState,
  DEFAULT_MIN_BOOST_HOLD_MS
} from "../src/lib/cache/edge-cache-pressure";
import { getDatabaseCircuitBreaker } from "../src/lib/database/circuit-breaker";
import { getWorkClassSaturation } from "../src/lib/database/work-class";

const config = loadEdgeCacheConfig();
const findings = validateEdgeCacheConfig();
const failures = findings.filter((finding) => finding.severity === "fail");

const now = new Date();
const sample = computePressureSample(
  getWorkClassSaturation(),
  getDatabaseCircuitBreaker().getState(now)
);
// A freshly started CLI process has its own (idle) work-class gates, so
// this reflects THIS process, not the serving fleet — stated explicitly in
// the output so the number is never mistaken for a cluster-wide reading.
const mode = nextEscalationState(
  { mode: "normal", enteredAtMs: 0 },
  sample,
  now.getTime(),
  {
    thresholdPercent: config.pressureThresholdPercent,
    minBoostHoldMs: DEFAULT_MIN_BOOST_HOLD_MS
  }
).mode;

type PurgeEndpointProbe = {
  status: "not_configured" | "reachable" | "unreachable" | "unprotected";
  detail?: string;
};

async function probePurgeEndpoint(): Promise<PurgeEndpointProbe> {
  if (!config.purgeUrl) {
    return { status: "not_configured" };
  }

  try {
    // Deliberately WITHOUT the token: a correctly configured cache must
    // answer 4xx here. A 2xx would mean anyone on the network can flush
    // the cache, which is worth failing this check over.
    //
    // POST to the reserved path, matching `edge-cache-purge.ts` — a custom
    // HTTP method does not survive Bun's `fetch` (it is rewritten to
    // `GET`), which is what let a completely non-functional invalidation
    // look healthy before.
    const response = await fetch(
      new URL("/__awcms-edge-cache/ban", config.purgeUrl),
      {
        method: "POST",
        headers: {
          "X-Ban-Host": "edge-cache-health.invalid",
          "X-Ban-Path": "^/"
        },
        signal: AbortSignal.timeout(3_000)
      }
    );

    if (response.ok) {
      return {
        status: "unprotected",
        detail: `An unauthenticated BAN was accepted (HTTP ${response.status}).`
      };
    }

    return {
      status: "reachable",
      detail: `Rejected as expected (HTTP ${response.status}).`
    };
  } catch (probeError) {
    return {
      status: "unreachable",
      detail: probeError instanceof Error ? probeError.message : "unknown error"
    };
  }
}

const purgeEndpoint = config.enabled
  ? await probePurgeEndpoint()
  : ({ status: "not_configured" } as PurgeEndpointProbe);

console.log(
  JSON.stringify(
    {
      check: "edge-cache",
      enabled: config.enabled,
      mode,
      pressure: {
        scope: "this process only",
        utilizationPercent: sample.utilizationPercent,
        circuitState: sample.circuitState,
        thresholdPercent: config.pressureThresholdPercent,
        autoEscalation: config.autoEscalation
      },
      ttlSeconds: {
        surrogateDefault: config.defaultTtlSeconds,
        surrogateBoost: config.boostTtlSeconds,
        browser: config.browserTtlSeconds,
        staleWhileRevalidate: config.staleWhileRevalidateSeconds,
        staleIfError: config.staleIfErrorSeconds
      },
      purge: {
        url: config.purgeUrl,
        tokenConfigured: config.purgeToken !== null,
        endpoint: purgeEndpoint
      },
      findings
    },
    null,
    2
  )
);

if (failures.length > 0 || purgeEndpoint.status === "unprotected") {
  process.exitCode = 1;
}
