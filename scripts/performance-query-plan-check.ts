/**
 * performance-query-plan-check.ts — `bun run performance:query-plan:check`.
 *
 * Issue #744 (epic #738, platform-evolution, Wave 1). The query-plan half
 * of the performance suite: seeds the `safe` synthetic fixture scale, then
 * runs `EXPLAIN (FORMAT JSON, ANALYZE, BUFFERS)` for every registered
 * budget (`src/lib/performance/query-plan-budgets.ts`) against a real,
 * RLS-enforced connection (`query-plan-runner.ts`), failing the process if
 * any budget's plan shape or cost/time regresses. This is the "Critical
 * query-plan budgets are versioned and fail on a deliberately introduced
 * regression fixture" acceptance criterion's PRODUCTION-facing half — the
 * adversarial proof that the checker genuinely fires on a bad plan lives
 * in `tests/integration/performance-query-plan-check.integration.test.ts`
 * (this script intentionally does not exercise the regression fixture
 * itself, so a normal run's exit code only ever reflects real, currently-
 * registered budgets).
 *
 * Reuses the SAME target guard as `dr-drill.ts`/`performance-suite.ts`
 * (`authorizeDrDrill`) — never a separate/weaker safety check.
 *
 * Usage:
 *   APP_ENV=test DATABASE_URL=postgres://...@localhost:.../db \
 *   bun run performance:query-plan:check -- --confirm-non-production=test \
 *     [--seed=<string>] [--json-output=<path>]
 */
import { getDatabaseClient } from "../src/lib/database/client";
import { buildFixturePlan } from "../src/lib/performance/fixture-generator";
import {
  resetPerformanceFixtureRows,
  seedPerformanceFixtures
} from "../src/lib/performance/fixture-seeder";
import { runAllQueryPlanChecks } from "../src/lib/performance/query-plan-runner";
import { SAFE_SCALE_PROFILE } from "../src/lib/performance/scale-profiles";
import { authorizeDrDrill } from "../src/lib/resilience/target-guard";

function flagValue(argv: string[], prefix: string): string | null {
  const flag = argv.find((arg) => arg.startsWith(prefix));
  return flag ? flag.slice(prefix.length) : null;
}

export type QueryPlanCheckOptions = {
  confirmNonProduction: string | null;
  seed: string;
  jsonOutputPath: string | null;
};

export function parseArgs(argv: string[]): QueryPlanCheckOptions {
  return {
    confirmNonProduction: flagValue(argv, "--confirm-non-production="),
    seed: flagValue(argv, "--seed=") ?? "awcms-micro-query-plan-check",
    jsonOutputPath: flagValue(argv, "--json-output=")
  };
}

/**
 * Makes the plan the budgets judge a function of the live fixture rows alone,
 * not of how much residue earlier steps left in the tables or of whether
 * autovacuum happened to run first.
 *
 * The least-privilege `awcms_micro_app` role this script runs as can neither
 * VACUUM nor ANALYZE (it does not own the tables), and the fixture reset can
 * only `DELETE`, which leaves dead space behind. Heap-bound plans are costed by
 * page count, and the wide `awcms_micro_audit_events` rows interleave tenants,
 * so on the bloated heap the same query planned as Seq Scan (cost 740 in CI,
 * 1646 locally), Bitmap Heap Scan (171, 1584, 2642, 3688) or Index Only Scan,
 * depending on autovacuum timing alone. `VACUUM (FULL, ANALYZE)` rewrites the
 * heap compactly and refreshes statistics, after which the cost is identical
 * run after run (554.2 for the reporting aggregate across three consecutive
 * runs). FULL takes an ACCESS EXCLUSIVE lock, acceptable only because this
 * path sits behind the non-production target guard.
 *
 * Opt-in: set `QUERY_PLAN_MAINTENANCE_DATABASE_URL` to a role that owns the
 * tables (CI passes the migration owner). It is held to the same
 * non-production guard as `DATABASE_URL`, used for exactly this one statement,
 * and never for the budgeted queries, which keep running as the RLS-bound app
 * role. Unset, the step is skipped and the budgets are judged on whatever
 * statistics exist (the pre-existing behaviour).
 */
async function refreshPlannerStatistics(
  confirmNonProduction: string | null
): Promise<void> {
  const maintenanceUrl = process.env.QUERY_PLAN_MAINTENANCE_DATABASE_URL;

  if (!maintenanceUrl) {
    console.log(
      "performance-query-plan-check: QUERY_PLAN_MAINTENANCE_DATABASE_URL not set — skipping VACUUM (FULL, ANALYZE); plans reflect whatever statistics autovacuum has produced.\n"
    );
    return;
  }

  const authorization = authorizeDrDrill({
    appEnv: process.env.APP_ENV,
    databaseUrl: maintenanceUrl,
    confirmNonProduction
  });

  if (!authorization.ok) {
    throw new Error(
      `performance-query-plan-check: maintenance URL BLOCKED — ${authorization.reason}`
    );
  }

  const maintenance = new Bun.SQL(maintenanceUrl);

  try {
    await maintenance.unsafe("VACUUM (FULL, ANALYZE)");
    console.log(
      "performance-query-plan-check: VACUUM (FULL, ANALYZE) done as the maintenance role.\n"
    );
  } finally {
    await maintenance.close();
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const appEnv = process.env.APP_ENV;
  const databaseUrl = process.env.DATABASE_URL;

  const authorization = authorizeDrDrill({
    appEnv,
    databaseUrl,
    confirmNonProduction: options.confirmNonProduction
  });

  if (!authorization.ok) {
    console.error(
      `\nperformance-query-plan-check: BLOCKED — ${authorization.reason}\n`
    );
    process.exitCode = 1;
    return;
  }

  if (!databaseUrl) {
    console.error(
      "performance-query-plan-check: DATABASE_URL is unexpectedly unset after authorization."
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `performance-query-plan-check: target acknowledged (APP_ENV="${appEnv}"). ` +
      `Resetting any prior performance-fixture rows, then seeding "safe" ` +
      `scale fixtures (seed="${options.seed}")...`
  );

  const sql = getDatabaseClient();

  // Issue #782: this step runs in the same CI job/database right after
  // `performance-suite.ts` (its own independent "safe"-scale seed) and
  // `bun test` — with no reset in between, `awcms_micro_audit_events`
  // (and the other driving tables below) accumulate well beyond the
  // single-seed row count every registered budget's `maxTotalCost` was
  // calibrated against, making the EXPLAIN cost this script evaluates
  // depend on PostgreSQL autovacuum's background ANALYZE timing rather
  // than a deterministic, reproducible measurement. Resetting first
  // (scoped to ONLY synthetic `perf-*` fixture tenants — see
  // `resetPerformanceFixtureRows`'s own comment) restores the clean,
  // single-seed baseline every run, every time.
  await resetPerformanceFixtureRows(sql);

  const plan = buildFixturePlan(SAFE_SCALE_PROFILE, options.seed);
  const seedSummary = await seedPerformanceFixtures(sql, plan);

  console.log(
    `performance-query-plan-check: seeded ${plan.tenants.length} tenants in ${seedSummary.durationMs.toFixed(0)}ms.\n`
  );

  await refreshPlannerStatistics(options.confirmNonProduction);

  // A deterministic, non-noisy-neighbor tenant — representative of ordinary
  // per-tenant query volume rather than the deliberately skewed tenant.
  const tenantId = plan.tenants[0]!.tenantId;
  const results = await runAllQueryPlanChecks(sql, tenantId);

  console.log("=== performance-query-plan-check — results ===");
  for (const result of results) {
    const label = result.ok ? "PASS" : "FAIL";
    console.log(
      `[${label}] ${result.budgetId} — cost=${result.rootTotalCost.toFixed(1)}, ` +
        `execTime=${result.executionTimeMs?.toFixed(1) ?? "n/a"}ms, ` +
        `plan=${result.observedNodeTypes.join(" -> ")}`
    );
    for (const finding of result.findings) {
      console.log(`         ${finding}`);
    }
  }

  const overallOk = results.every((result) => result.ok);
  console.log(`\noverall = ${overallOk ? "PASS" : "FAIL"}`);

  if (options.jsonOutputPath) {
    await Bun.write(
      options.jsonOutputPath,
      JSON.stringify({ seedSummary, results }, null, 2)
    );
    console.log(`Report written to ${options.jsonOutputPath}`);
  }

  if (!overallOk) {
    console.error(
      "\nperformance-query-plan-check: FAIL — one or more query-plan budgets " +
        "regressed (see [FAIL] finding(s) above). If this is an INTENTIONAL " +
        "threshold change, update src/lib/performance/query-plan-budgets.ts's " +
        "`approval` record as part of the same reviewed change."
    );
    process.exitCode = 1;
  }
}

if (import.meta.main) {
  await main();
}
