/**
 * Automatic cache escalation (Issue #353, ADR-0037).
 *
 * This is the "diaktifkan otomatis apabila diperlukan" half of the edge
 * cache: the Varnish container itself is an operator-level toggle, but how
 * hard the application asks that cache to work is decided here, per
 * request, from signals the application already measures.
 *
 * The signals are the ones that were actually implicated in this repo's
 * two production incidents — work-class saturation (Issue #324's leaked
 * slots, Issue #743's bounded queues) and the database circuit breaker.
 * When either says the database is under strain, cacheable public
 * responses switch from the baseline TTL to the boost TTL, which converts
 * repeat readers into cache hits and hands the freed pool slots back to
 * the transactional work that genuinely cannot be served from a cache.
 *
 * Deliberately a pure state machine plus a thin singleton wrapper: every
 * threshold/hysteresis decision below is unit-testable with an injected
 * clock, and nothing here reads the environment or touches I/O.
 */
import type { CircuitState } from "../database/circuit-breaker";
import { getDatabaseCircuitBreaker } from "../database/circuit-breaker";
import type { WorkClassSaturation } from "../database/work-class";
import { getWorkClassSaturation } from "../database/work-class";
import { recordCounter, recordGauge } from "../observability/metrics-port";

/**
 * `off` is not a pressure level — it is what every response gets when the
 * subsystem is disabled, kept in the same union so callers have one
 * exhaustive switch instead of a boolean plus an enum.
 */
export type EdgeCacheMode = "off" | "normal" | "boost";

/**
 * Work classes that serve (or directly compete with) a foreground request.
 * `background_sync`/`maintenance` are excluded on purpose: a long
 * maintenance job legitimately parks its slot for minutes, and letting
 * that alone trip a site-wide TTL boost would make escalation fire on a
 * schedule rather than on real reader-visible pressure.
 */
const FOREGROUND_WORK_CLASSES = [
  "critical_transaction",
  "interactive",
  "reporting"
] as const;

export type PressureSample = {
  /** Highest foreground work-class utilization, in percent. May exceed 100 when callers are queued. */
  utilizationPercent: number;
  circuitState: CircuitState;
};

export type EscalationState = {
  mode: "normal" | "boost";
  /** Epoch ms at which the current `mode` was entered. */
  enteredAtMs: number;
};

export type EscalationOptions = {
  /** Utilization percent at or above which `boost` engages. */
  thresholdPercent: number;
  /**
   * Minimum time to stay in `boost` before releasing, so a load spike that
   * oscillates around the threshold does not flip TTLs on every request
   * (which would fragment the cache instead of protecting the database).
   */
  minBoostHoldMs: number;
};

export const DEFAULT_MIN_BOOST_HOLD_MS = 30_000;

/**
 * Release hysteresis: pressure must fall this many points BELOW the entry
 * threshold before `boost` is given up. Without a gap, utilization sitting
 * exactly at the threshold would toggle the mode continuously.
 */
const RELEASE_MARGIN_POINTS = 20;
const MIN_RELEASE_PERCENT = 5;

export function computeReleaseThresholdPercent(
  thresholdPercent: number
): number {
  return Math.max(
    MIN_RELEASE_PERCENT,
    thresholdPercent - RELEASE_MARGIN_POINTS
  );
}

/**
 * Utilization of one work class as a percentage of its configured
 * concurrency. Queued callers count as demand that the class cannot
 * currently serve, which is precisely the condition worth caching around —
 * so a full class with a queue reports above 100 rather than saturating
 * at it.
 */
export function computeWorkClassUtilizationPercent(
  saturation: WorkClassSaturation
): number {
  if (saturation.max <= 0) {
    return 0;
  }

  return Math.round(
    ((saturation.active + saturation.queued) / saturation.max) * 100
  );
}

export function computePressureSample(
  saturations: readonly WorkClassSaturation[],
  circuitState: CircuitState
): PressureSample {
  const foreground = saturations.filter((entry) =>
    (FOREGROUND_WORK_CLASSES as readonly string[]).includes(entry.workClass)
  );

  const utilizationPercent = foreground.reduce(
    (highest, entry) =>
      Math.max(highest, computeWorkClassUtilizationPercent(entry)),
    0
  );

  return { utilizationPercent, circuitState };
}

/**
 * Pure transition. A non-closed circuit breaker escalates immediately and
 * unconditionally: at that point the database is already failing calls, and
 * serving a slightly stale page from cache is strictly better for a reader
 * than a 503 — this is the same degradation philosophy as `withTenant`'s
 * `DATABASE_BUSY` fallback, one layer further out.
 */
export function nextEscalationState(
  previous: EscalationState,
  sample: PressureSample,
  nowMs: number,
  options: EscalationOptions
): EscalationState {
  const underPressure =
    sample.circuitState !== "closed" ||
    sample.utilizationPercent >= options.thresholdPercent;

  if (previous.mode === "normal") {
    return underPressure ? { mode: "boost", enteredAtMs: nowMs } : previous;
  }

  if (underPressure) {
    return previous;
  }

  const heldLongEnough = nowMs - previous.enteredAtMs >= options.minBoostHoldMs;
  const releasedByHysteresis =
    sample.utilizationPercent <=
    computeReleaseThresholdPercent(options.thresholdPercent);

  if (heldLongEnough && releasedByHysteresis) {
    return { mode: "normal", enteredAtMs: nowMs };
  }

  return previous;
}

let currentState: EscalationState = { mode: "normal", enteredAtMs: 0 };

/**
 * Resolves the mode for the response being built right now.
 *
 * `autoEscalation: false` pins the result to `normal` but still evaluates
 * nothing else — an operator who has turned automation off gets exactly
 * the baseline TTL they configured, with no hidden behaviour.
 */
export function resolveEdgeCacheMode(input: {
  enabled: boolean;
  autoEscalation: boolean;
  thresholdPercent: number;
  now: Date;
  minBoostHoldMs?: number;
}): EdgeCacheMode {
  if (!input.enabled) {
    return "off";
  }

  if (!input.autoEscalation) {
    return "normal";
  }

  const sample = computePressureSample(
    getWorkClassSaturation(),
    getDatabaseCircuitBreaker().getState(input.now)
  );

  const nowMs = input.now.getTime();
  const previous = currentState;
  const next = nextEscalationState(previous, sample, nowMs, {
    thresholdPercent: input.thresholdPercent,
    minBoostHoldMs: input.minBoostHoldMs ?? DEFAULT_MIN_BOOST_HOLD_MS
  });

  if (next.mode !== previous.mode) {
    recordCounter("edge_cache_escalation_transitions_total", {
      from: previous.mode,
      to: next.mode
    });
  }

  currentState = next;

  recordGauge("edge_cache_boost_active", next.mode === "boost" ? 1 : 0);
  recordGauge("edge_cache_pressure_percent", sample.utilizationPercent);

  return next.mode;
}

/** Test-only: the escalation state is process-global by design (it tracks one process's own pool). */
export function resetEdgeCacheEscalationForTests(): void {
  currentState = { mode: "normal", enteredAtMs: 0 };
}

/** Read-only view for `bun run edge-cache:health` and diagnostics. */
export function getEdgeCacheEscalationState(): EscalationState {
  return { ...currentState };
}
