/**
 * Edge-cache configuration (Issue #353, ADR-0037).
 *
 * Pure env parsing for the optional HTTP surrogate cache that may sit in
 * front of this application (Varnish is the reference implementation —
 * `deploy/varnish/default.vcl` — but nothing here is Varnish-specific;
 * any RFC 5861 / `Surrogate-Control` capable cache works).
 *
 * Mirrors `src/lib/redis/config.ts`'s shape and discipline on purpose:
 * out-of-range or unparseable values fall back to the documented default
 * rather than throwing, so a typo in one cache tunable can never stop the
 * application from booting. The cache is an accelerator; PostgreSQL stays
 * authoritative (ADR-0030 invariant 2, restated by ADR-0037).
 */
export type EdgeCacheEnvironment = Readonly<Record<string, string | undefined>>;

export type EdgeCacheConfig = {
  /** Master switch. When false this subsystem emits nothing at all. */
  enabled: boolean;
  /** Surrogate TTL (seconds) applied to cacheable responses in `normal` mode. */
  defaultTtlSeconds: number;
  /** Surrogate TTL (seconds) applied while the escalation controller is in `boost`. */
  boostTtlSeconds: number;
  /** Client-facing `max-age`. 0 keeps browsers revalidating while the shared cache absorbs the load. */
  browserTtlSeconds: number;
  /** How long a shared cache may serve stale content while refreshing in the background. */
  staleWhileRevalidateSeconds: number;
  /** How long a shared cache may serve stale content when the origin is failing. */
  staleIfErrorSeconds: number;
  /** Whether TTL rises automatically under database pressure. */
  autoEscalation: boolean;
  /** Work-class utilization (percent) at or above which `boost` engages. */
  pressureThresholdPercent: number;
  /** Base URL of the surrogate cache's invalidation endpoint, e.g. `http://varnish:80`. */
  purgeUrl: string | null;
  /** Shared secret the cache's VCL requires on a BAN/PURGE request. SECRET. */
  purgeToken: string | null;
};

const DEFAULTS = {
  defaultTtlSeconds: 60,
  boostTtlSeconds: 300,
  browserTtlSeconds: 0,
  staleWhileRevalidateSeconds: 60,
  staleIfErrorSeconds: 600,
  pressureThresholdPercent: 70
} as const;

const INTEGER_RULES = {
  EDGE_CACHE_DEFAULT_TTL_SECONDS: { min: 1, max: 86_400 },
  EDGE_CACHE_BOOST_TTL_SECONDS: { min: 1, max: 86_400 },
  EDGE_CACHE_BROWSER_TTL_SECONDS: { min: 0, max: 86_400 },
  EDGE_CACHE_STALE_WHILE_REVALIDATE_SECONDS: { min: 0, max: 86_400 },
  EDGE_CACHE_STALE_IF_ERROR_SECONDS: { min: 0, max: 604_800 },
  EDGE_CACHE_PRESSURE_THRESHOLD_PERCENT: { min: 10, max: 100 }
} as const;

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value.trim() === "") {
    return fallback;
  }

  return value.trim().toLowerCase() === "true";
}

function parseBoundedInteger(
  value: string | undefined,
  fallback: number,
  min: number,
  max: number
): number {
  if (value === undefined || value.trim() === "") {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    return fallback;
  }

  return parsed;
}

export function loadEdgeCacheConfig(
  env: EdgeCacheEnvironment = process.env
): EdgeCacheConfig {
  const defaultTtlSeconds = parseBoundedInteger(
    env.EDGE_CACHE_DEFAULT_TTL_SECONDS,
    DEFAULTS.defaultTtlSeconds,
    INTEGER_RULES.EDGE_CACHE_DEFAULT_TTL_SECONDS.min,
    INTEGER_RULES.EDGE_CACHE_DEFAULT_TTL_SECONDS.max
  );
  const boostTtlSeconds = parseBoundedInteger(
    env.EDGE_CACHE_BOOST_TTL_SECONDS,
    DEFAULTS.boostTtlSeconds,
    INTEGER_RULES.EDGE_CACHE_BOOST_TTL_SECONDS.min,
    INTEGER_RULES.EDGE_CACHE_BOOST_TTL_SECONDS.max
  );

  return {
    enabled: parseBoolean(env.EDGE_CACHE_ENABLED, false),
    defaultTtlSeconds,
    // A boost that is SHORTER than the baseline would make the automatic
    // escalation actively counter-productive at exactly the moment the
    // database is struggling, so a mis-ordered pair is clamped up instead
    // of trusted. Deliberately not a boot failure: the same
    // "never block startup on a cache tunable" rule as the parsers above.
    boostTtlSeconds: Math.max(boostTtlSeconds, defaultTtlSeconds),
    browserTtlSeconds: parseBoundedInteger(
      env.EDGE_CACHE_BROWSER_TTL_SECONDS,
      DEFAULTS.browserTtlSeconds,
      INTEGER_RULES.EDGE_CACHE_BROWSER_TTL_SECONDS.min,
      INTEGER_RULES.EDGE_CACHE_BROWSER_TTL_SECONDS.max
    ),
    staleWhileRevalidateSeconds: parseBoundedInteger(
      env.EDGE_CACHE_STALE_WHILE_REVALIDATE_SECONDS,
      DEFAULTS.staleWhileRevalidateSeconds,
      INTEGER_RULES.EDGE_CACHE_STALE_WHILE_REVALIDATE_SECONDS.min,
      INTEGER_RULES.EDGE_CACHE_STALE_WHILE_REVALIDATE_SECONDS.max
    ),
    staleIfErrorSeconds: parseBoundedInteger(
      env.EDGE_CACHE_STALE_IF_ERROR_SECONDS,
      DEFAULTS.staleIfErrorSeconds,
      INTEGER_RULES.EDGE_CACHE_STALE_IF_ERROR_SECONDS.min,
      INTEGER_RULES.EDGE_CACHE_STALE_IF_ERROR_SECONDS.max
    ),
    autoEscalation: parseBoolean(env.EDGE_CACHE_AUTO_ESCALATION, true),
    pressureThresholdPercent: parseBoundedInteger(
      env.EDGE_CACHE_PRESSURE_THRESHOLD_PERCENT,
      DEFAULTS.pressureThresholdPercent,
      INTEGER_RULES.EDGE_CACHE_PRESSURE_THRESHOLD_PERCENT.min,
      INTEGER_RULES.EDGE_CACHE_PRESSURE_THRESHOLD_PERCENT.max
    ),
    purgeUrl: env.EDGE_CACHE_PURGE_URL?.trim() || null,
    purgeToken: env.EDGE_CACHE_PURGE_TOKEN?.trim() || null
  };
}

let cachedConfig: EdgeCacheConfig | null = null;

/**
 * Process-lifetime memoized view of `loadEdgeCacheConfig(process.env)` —
 * this is read on the response path of every request, and re-parsing ten
 * environment variables per request would be pure waste for values that
 * cannot change without a restart.
 */
export function getEdgeCacheConfig(): EdgeCacheConfig {
  cachedConfig ??= loadEdgeCacheConfig();

  return cachedConfig;
}

/** Test-only: lets a test mutate `process.env` and observe the new config. */
export function resetEdgeCacheConfigForTests(): void {
  cachedConfig = null;
}

export type EdgeCacheValidationFinding = {
  severity: "warning" | "fail";
  code: string;
  message: string;
};

/**
 * Operator-facing findings for `bun run edge-cache:health`. Deliberately
 * NOT wired into `scripts/validate-env.ts`'s boot gate: an edge cache is an
 * accelerator, and a half-configured one must degrade to "no caching",
 * never to "application refuses to start".
 */
export function validateEdgeCacheConfig(
  env: EdgeCacheEnvironment = process.env
): EdgeCacheValidationFinding[] {
  const findings: EdgeCacheValidationFinding[] = [];
  const config = loadEdgeCacheConfig(env);

  if (!config.enabled) {
    return findings;
  }

  if (config.purgeUrl && !config.purgeToken) {
    findings.push({
      severity: "warning",
      code: "purge_token_missing",
      message:
        "EDGE_CACHE_PURGE_URL is set but EDGE_CACHE_PURGE_TOKEN is empty — explicit invalidation is disabled and content staleness is bounded only by TTL."
    });
  }

  if (config.purgeToken && !config.purgeUrl) {
    findings.push({
      severity: "warning",
      code: "purge_url_missing",
      message:
        "EDGE_CACHE_PURGE_TOKEN is set but EDGE_CACHE_PURGE_URL is empty — the token is unused."
    });
  }

  if (config.purgeUrl) {
    try {
      const parsed = new URL(config.purgeUrl);

      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        findings.push({
          severity: "fail",
          code: "purge_url_scheme_unsupported",
          message: `EDGE_CACHE_PURGE_URL must use http:// or https://, received ${parsed.protocol}`
        });
      }
    } catch {
      findings.push({
        severity: "fail",
        code: "purge_url_invalid",
        message: "EDGE_CACHE_PURGE_URL is not a parseable URL."
      });
    }
  }

  if (config.staleIfErrorSeconds === 0) {
    findings.push({
      severity: "warning",
      code: "stale_if_error_disabled",
      message:
        "EDGE_CACHE_STALE_IF_ERROR_SECONDS=0 — the cache will not shield readers during a database outage, which is the failure mode this layer exists for."
    });
  }

  return findings;
}
