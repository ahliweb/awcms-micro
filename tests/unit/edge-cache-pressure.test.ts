import { describe, expect, test } from "bun:test";

import type { WorkClassSaturation } from "../../src/lib/database/work-class";
import {
  computePressureSample,
  computeReleaseThresholdPercent,
  computeWorkClassUtilizationPercent,
  nextEscalationState,
  type EscalationState
} from "../../src/lib/cache/edge-cache-pressure";
import {
  isValidPurgeRequest,
  purgeEdgeCache
} from "../../src/lib/cache/edge-cache-purge";
import type { EdgeCacheConfig } from "../../src/lib/cache/edge-cache-config";

function saturation(
  workClass: WorkClassSaturation["workClass"],
  active: number,
  queued: number,
  max = 8
): WorkClassSaturation {
  return { workClass, active, queued, max, maxQueueDepth: max * 4 };
}

const OPTIONS = { thresholdPercent: 70, minBoostHoldMs: 30_000 };
const NORMAL: EscalationState = { mode: "normal", enteredAtMs: 0 };

describe("computeWorkClassUtilizationPercent", () => {
  test("counts queued callers as unserved demand, so it can exceed 100", () => {
    expect(
      computeWorkClassUtilizationPercent(saturation("interactive", 8, 4))
    ).toBe(150);
  });

  test("reports zero for an unconfigured class instead of dividing by zero", () => {
    expect(
      computeWorkClassUtilizationPercent(saturation("maintenance", 0, 0, 0))
    ).toBe(0);
  });
});

describe("computePressureSample", () => {
  test("takes the highest foreground class", () => {
    const sample = computePressureSample(
      [
        saturation("interactive", 2, 0),
        saturation("critical_transaction", 9, 0, 10),
        saturation("reporting", 1, 0, 4)
      ],
      "closed"
    );

    expect(sample.utilizationPercent).toBe(90);
  });

  test("ignores background and maintenance work", () => {
    // A long maintenance job legitimately parks its only slot; letting
    // that trip a site-wide TTL boost would fire escalation on a schedule
    // rather than on reader-visible pressure.
    const sample = computePressureSample(
      [
        saturation("interactive", 1, 0),
        saturation("maintenance", 1, 0, 1),
        saturation("background_sync", 4, 8, 4)
      ],
      "closed"
    );

    expect(sample.utilizationPercent).toBe(13);
  });
});

describe("nextEscalationState", () => {
  test("stays normal below the threshold", () => {
    expect(
      nextEscalationState(
        NORMAL,
        { utilizationPercent: 40, circuitState: "closed" },
        1_000,
        OPTIONS
      )
    ).toEqual(NORMAL);
  });

  test("escalates at the threshold", () => {
    expect(
      nextEscalationState(
        NORMAL,
        { utilizationPercent: 70, circuitState: "closed" },
        1_000,
        OPTIONS
      )
    ).toEqual({ mode: "boost", enteredAtMs: 1_000 });
  });

  test("escalates immediately on a non-closed circuit breaker, whatever the utilization", () => {
    // Utilization is LOW here precisely because the database is refusing
    // work — the signal that must not be read as "healthy".
    expect(
      nextEscalationState(
        NORMAL,
        { utilizationPercent: 0, circuitState: "open" },
        1_000,
        OPTIONS
      ).mode
    ).toBe("boost");

    expect(
      nextEscalationState(
        NORMAL,
        { utilizationPercent: 0, circuitState: "half_open" },
        1_000,
        OPTIONS
      ).mode
    ).toBe("boost");
  });

  test("holds the boost for the minimum duration even once pressure is gone", () => {
    const boosted: EscalationState = { mode: "boost", enteredAtMs: 1_000 };

    expect(
      nextEscalationState(
        boosted,
        { utilizationPercent: 0, circuitState: "closed" },
        5_000,
        OPTIONS
      )
    ).toEqual(boosted);
  });

  test("releases once the hold has elapsed and pressure is below the release threshold", () => {
    const boosted: EscalationState = { mode: "boost", enteredAtMs: 1_000 };

    expect(
      nextEscalationState(
        boosted,
        { utilizationPercent: 10, circuitState: "closed" },
        40_000,
        OPTIONS
      )
    ).toEqual({ mode: "normal", enteredAtMs: 40_000 });
  });

  test("does not release while pressure sits in the hysteresis band", () => {
    // 60% is below the 70% entry threshold but above the 50% release
    // threshold: releasing here would make the mode oscillate on every
    // request and fragment the cache instead of protecting the database.
    const boosted: EscalationState = { mode: "boost", enteredAtMs: 1_000 };

    expect(
      nextEscalationState(
        boosted,
        { utilizationPercent: 60, circuitState: "closed" },
        400_000,
        OPTIONS
      )
    ).toEqual(boosted);
  });

  test("keeps the boost while the circuit breaker is still not closed", () => {
    const boosted: EscalationState = { mode: "boost", enteredAtMs: 1_000 };

    expect(
      nextEscalationState(
        boosted,
        { utilizationPercent: 0, circuitState: "half_open" },
        400_000,
        OPTIONS
      )
    ).toEqual(boosted);
  });

  test("keeps the release threshold positive for a very low entry threshold", () => {
    expect(computeReleaseThresholdPercent(70)).toBe(50);
    expect(computeReleaseThresholdPercent(10)).toBe(5);
  });
});

describe("purgeEdgeCache", () => {
  const CONFIG: EdgeCacheConfig = {
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

  test("accepts a plain host and a bounded path regex", () => {
    expect(isValidPurgeRequest({ host: "tenant.example.com" })).toBe(true);
    expect(
      isValidPurgeRequest({
        host: "tenant.example.com",
        pathPattern: "^/blog/"
      })
    ).toBe(true);
  });

  test.each([
    ["a scheme", { host: "https://tenant.example.com" }],
    ["a port", { host: "tenant.example.com:8080" }],
    ["a space", { host: "tenant example.com" }],
    ["an empty host", { host: "" }],
    [
      "expression-shaping characters in the path",
      {
        host: "tenant.example.com",
        pathPattern: '^/ && obj.http.X-Ban-Host == "x"'
      }
    ]
  ])("rejects %s", (_label, request) => {
    expect(isValidPurgeRequest(request)).toBe(false);
  });

  test("skips instead of throwing when nothing is configured", async () => {
    await expect(
      purgeEdgeCache(
        { host: "tenant.example.com" },
        { ...CONFIG, purgeUrl: null }
      )
    ).resolves.toEqual({ status: "skipped", reason: "not_configured" });
  });

  test("never forwards an invalid request to the cache's regex engine", async () => {
    await expect(
      purgeEdgeCache({ host: "not a host" }, CONFIG)
    ).resolves.toEqual({ status: "skipped", reason: "invalid_request" });
  });

  test("POSTs to the reserved ban path, never a custom HTTP method", async () => {
    // Bun's fetch silently rewrites an unknown method (e.g. `BAN`) to
    // `GET`, which made invalidation a silent no-op that still reported
    // success. Verified against a live Varnish on Bun 1.3.14.
    const seen: { method?: string; url?: string } = {};
    const originalFetch = globalThis.fetch;

    globalThis.fetch = (async (url: URL | string, init?: RequestInit) => {
      seen.method = init?.method;
      seen.url = String(url);

      return new Response(null, {
        status: 200,
        headers: { "X-Edge-Cache-Ban": "ok" }
      });
    }) as unknown as typeof fetch;

    try {
      const result = await purgeEdgeCache(
        { host: "tenant.example.com" },
        CONFIG
      );

      expect(result).toEqual({ status: "purged" });
      expect(seen.method).toBe("POST");
      expect(seen.url).toBe(
        "http://varnish.invalid:8080/__awcms-edge-cache/ban"
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("treats a 200 WITHOUT the cache's marker header as a failure", async () => {
    // The exact regression: an ordinary page answered 200 because the
    // request never reached the ban handler at all. Without this check that
    // reads as a successful purge.
    const originalFetch = globalThis.fetch;

    globalThis.fetch = (async () =>
      new Response("<html>a normal page</html>", {
        status: 200
      })) as unknown as typeof fetch;

    try {
      const result = await purgeEdgeCache(
        { host: "tenant.example.com" },
        CONFIG
      );

      expect(result).toEqual({ status: "failed", reason: "unmarked_response" });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("fails open when the cache is unreachable", async () => {
    const result = await purgeEdgeCache({ host: "tenant.example.com" }, CONFIG);

    expect(result.status).toBe("failed");
  });
});
