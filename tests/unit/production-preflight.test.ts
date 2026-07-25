import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import {
  authorizeApply,
  checkDatabaseCapacity,
  computeMigrationPlan,
  computeVerdict,
  parseArgs,
  planTestStage,
  type PreflightOptions,
  type StageResult
} from "../../scripts/production-preflight";
import type { AppliedMigration, MigrationFile } from "../../scripts/db-migrate";

function migrationFile(
  name: string,
  checksum = `sha256:${name}`
): MigrationFile {
  return { name, path: `sql/${name}`, sql: "-- noop", checksum };
}

function stageResult(
  name: string,
  status: StageResult["status"],
  detail?: string
): StageResult {
  return { name, status, detail, durationMs: 1 };
}

describe("parseArgs", () => {
  test("defaults to no flags set", () => {
    expect(parseArgs([])).toEqual({
      applyMigrations: false,
      backupVerified: false,
      acknowledgeTarget: null,
      jsonOutputPath: null
    });
  });

  test("parses --apply-migrations and --backup-verified as booleans", () => {
    const options = parseArgs(["--apply-migrations", "--backup-verified"]);
    expect(options.applyMigrations).toBe(true);
    expect(options.backupVerified).toBe(true);
  });

  test("parses --acknowledge-target=<value>", () => {
    const options = parseArgs(["--acknowledge-target=production"]);
    expect(options.acknowledgeTarget).toBe("production");
  });

  test("parses --json-output=<path>", () => {
    const options = parseArgs(["--json-output=/tmp/result.json"]);
    expect(options.jsonOutputPath).toBe("/tmp/result.json");
  });

  test("parses every flag together", () => {
    const options = parseArgs([
      "--apply-migrations",
      "--backup-verified",
      "--acknowledge-target=staging",
      "--json-output=out.json"
    ]);
    expect(options).toEqual({
      applyMigrations: true,
      backupVerified: true,
      acknowledgeTarget: "staging",
      jsonOutputPath: "out.json"
    });
  });
});

describe("authorizeApply (mutation guard)", () => {
  const fullyAuthorizedOptions: PreflightOptions = {
    applyMigrations: true,
    backupVerified: true,
    acknowledgeTarget: "production",
    jsonOutputPath: null
  };

  test("refuses to apply when an earlier stage failed, even with every flag set (acceptance criterion: failed quality gates never apply migrations)", () => {
    const result = authorizeApply(
      false /* go */,
      fullyAuthorizedOptions,
      "production"
    );
    expect(result.ok).toBe(false);
  });

  test("refuses when --apply-migrations was not passed, even if everything else passed", () => {
    const result = authorizeApply(
      true,
      { ...fullyAuthorizedOptions, applyMigrations: false },
      "production"
    );
    expect(result.ok).toBe(false);
  });

  test("refuses when --backup-verified is missing", () => {
    const result = authorizeApply(
      true,
      { ...fullyAuthorizedOptions, backupVerified: false },
      "production"
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain("backup-verified");
    }
  });

  test("refuses when --acknowledge-target is missing", () => {
    const result = authorizeApply(
      true,
      { ...fullyAuthorizedOptions, acknowledgeTarget: null },
      "production"
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain("acknowledge-target");
    }
  });

  test("refuses when --acknowledge-target does not match APP_ENV (typo-catcher)", () => {
    const result = authorizeApply(
      true,
      { ...fullyAuthorizedOptions, acknowledgeTarget: "staging" },
      "production"
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain("staging");
      expect(result.reason).toContain("production");
    }
  });

  test("authorizes only when go=true AND all three flags are set AND acknowledge-target matches APP_ENV exactly", () => {
    const result = authorizeApply(true, fullyAuthorizedOptions, "production");
    expect(result.ok).toBe(true);
  });
});

describe("computeVerdict", () => {
  test("all-pass results in go=true", () => {
    const verdict = computeVerdict(
      [stageResult("config:validate", "pass"), stageResult("test", "pass")],
      "staging"
    );
    expect(verdict.go).toBe(true);
    expect(verdict.failedStages).toEqual([]);
    expect(verdict.blockingSkips).toEqual([]);
  });

  test("any failed stage results in go=false and is listed", () => {
    const verdict = computeVerdict(
      [stageResult("test", "fail", "exit code 1")],
      "staging"
    );
    expect(verdict.go).toBe(false);
    expect(verdict.failedStages).toEqual(["test"]);
  });

  test("a skipped db:pool:health is non-blocking outside production", () => {
    const verdict = computeVerdict(
      [stageResult("db:pool:health", "skipped", "no server reachable")],
      "staging"
    );
    expect(verdict.go).toBe(true);
    expect(verdict.blockingSkips).toEqual([]);
  });

  test("a skipped db:pool:health BLOCKS go-live when APP_ENV=production", () => {
    const verdict = computeVerdict(
      [stageResult("db:pool:health", "skipped", "no server reachable")],
      "production"
    );
    expect(verdict.go).toBe(false);
    expect(verdict.blockingSkips).toEqual(["db:pool:health"]);
  });

  test("a skipped stage NOT in the mandatory-in-production set never blocks, even in production", () => {
    const verdict = computeVerdict(
      [stageResult("some-future-optional-stage", "skipped")],
      "production"
    );
    expect(verdict.go).toBe(true);
    expect(verdict.blockingSkips).toEqual([]);
  });

  test("a unit-only (skipped) test stage BLOCKS go-live when APP_ENV=production", () => {
    const verdict = computeVerdict(
      [stageResult("test", "skipped", "integration suite not run")],
      "production"
    );
    expect(verdict.go).toBe(false);
    expect(verdict.blockingSkips).toEqual(["test"]);
  });

  test("a unit-only (skipped) test stage is non-blocking outside production", () => {
    const verdict = computeVerdict(
      [stageResult("test", "skipped", "integration suite not run")],
      "staging"
    );
    expect(verdict.go).toBe(true);
    expect(verdict.blockingSkips).toEqual([]);
  });
});

describe("planTestStage (never truncate the deployment target)", () => {
  const TARGET = "postgres://app:pw@prod-db.internal:5432/awcms_micro";
  const DISPOSABLE = "postgres://app:pw@127.0.0.1:5433/awcms_micro_preflight";

  test("the deployment target's DATABASE_URL is NEVER forwarded to bun test", () => {
    // The regression this whole gate exists for: the documented invocation
    // `APP_ENV=production DATABASE_URL=<target> bun run production:preflight`
    // used to hand <target> straight to the integration suite, which
    // TRUNCATEs every awcms_micro_* table and ALTERs three login roles.
    const plan = planTestStage({ DATABASE_URL: TARGET });
    expect(plan.mode).toBe("unit-only");
    expect(JSON.stringify(plan)).not.toContain("prod-db.internal");
  });

  test("runs the integration suite when PREFLIGHT_TEST_DATABASE_URL is a distinct, disposable database", () => {
    const plan = planTestStage({
      DATABASE_URL: TARGET,
      PREFLIGHT_TEST_DATABASE_URL: DISPOSABLE
    });
    expect(plan).toEqual({ mode: "integration", databaseUrl: DISPOSABLE });
  });

  test("refuses when PREFLIGHT_TEST_DATABASE_URL is the deployment target itself", () => {
    const plan = planTestStage({
      DATABASE_URL: TARGET,
      PREFLIGHT_TEST_DATABASE_URL: TARGET
    });
    expect(plan.mode).toBe("unit-only");
    expect(plan.mode === "unit-only" && plan.reason).toContain(
      "identical to the deployment target"
    );
  });

  test("whitespace-only PREFLIGHT_TEST_DATABASE_URL is treated as unset, not as a DSN", () => {
    const plan = planTestStage({
      DATABASE_URL: TARGET,
      PREFLIGHT_TEST_DATABASE_URL: "   "
    });
    expect(plan.mode).toBe("unit-only");
  });

  test("trailing whitespace does not defeat the same-as-target refusal", () => {
    const plan = planTestStage({
      DATABASE_URL: TARGET,
      PREFLIGHT_TEST_DATABASE_URL: `${TARGET}  `
    });
    expect(plan.mode).toBe("unit-only");
  });

  test("unit-only with no database configured at all", () => {
    const plan = planTestStage({});
    expect(plan.mode).toBe("unit-only");
  });
});

describe("computeMigrationPlan", () => {
  test("reports every local migration as pending when the ledger is empty", () => {
    const plan = computeMigrationPlan(
      [migrationFile("001_a.sql"), migrationFile("002_b.sql")],
      []
    );
    expect(plan.pending).toEqual(["001_a.sql", "002_b.sql"]);
    expect(plan.appliedCount).toBe(0);
  });

  test("excludes already-applied migrations from the pending list", () => {
    const plan = computeMigrationPlan(
      [migrationFile("001_a.sql"), migrationFile("002_b.sql")],
      [{ migration_name: "001_a.sql", checksum: "sha256:001_a.sql" }]
    );
    expect(plan.pending).toEqual(["002_b.sql"]);
    expect(plan.appliedCount).toBe(1);
  });

  test("reports zero pending when everything local is already applied", () => {
    const plan = computeMigrationPlan(
      [migrationFile("001_a.sql")],
      [{ migration_name: "001_a.sql", checksum: "sha256:001_a.sql" }]
    );
    expect(plan.pending).toEqual([]);
    expect(plan.appliedCount).toBe(1);
  });

  test("throws (never silently proceeds) when an applied migration's checksum no longer matches its local file — same guard the real apply uses", () => {
    const appliedRows: AppliedMigration[] = [
      { migration_name: "001_a.sql", checksum: "sha256:tampered" }
    ];
    expect(() =>
      computeMigrationPlan([migrationFile("001_a.sql")], appliedRows)
    ).toThrow("Checksum mismatch");
  });
});

describe("checkDatabaseCapacity stage (Issue #743)", () => {
  const ENV_KEYS = [
    "DATABASE_CAPACITY_APP_INSTANCES_MIN",
    "DATABASE_CAPACITY_APP_INSTANCES_EXPECTED",
    "DATABASE_CAPACITY_APP_INSTANCES_MAX",
    "DATABASE_CAPACITY_APPROVED_CONNECTIONS",
    "DATABASE_CAPACITY_RESERVED_ADMIN_CONNECTIONS",
    "DATABASE_POOL_MAX"
  ] as const;

  let originalValues: Partial<Record<(typeof ENV_KEYS)[number], string>>;

  beforeEach(() => {
    originalValues = Object.fromEntries(
      ENV_KEYS.map((key) => [key, process.env[key]])
    );
    for (const key of ENV_KEYS) {
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of ENV_KEYS) {
      const original = originalValues[key];
      if (original === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = original;
      }
    }
  });

  test("this is a pure, read-only, no-database stage: 'database:capacity' is its name and it never touches the network", async () => {
    const result = await checkDatabaseCapacity();
    expect(result.name).toBe("database:capacity");
  });

  test("passes with no DATABASE_CAPACITY_* env vars set (the single-instance offline/LAN default)", async () => {
    const result = await checkDatabaseCapacity();
    expect(result.status).toBe("pass");
    expect(result.detail).toBeUndefined();
  });

  test("fails when the configured max instance count would exceed the approved connection budget (the issue's own connection-storm example)", async () => {
    process.env.DATABASE_CAPACITY_APP_INSTANCES_MAX = "10";
    process.env.DATABASE_POOL_MAX = "20";
    process.env.DATABASE_CAPACITY_APPROVED_CONNECTIONS = "80";
    process.env.DATABASE_CAPACITY_RESERVED_ADMIN_CONNECTIONS = "0";

    const result = await checkDatabaseCapacity();

    expect(result.status).toBe("fail");
    expect(result.detail).toContain("finding");
  });

  test("fails when instance-count configuration is internally inconsistent (min > max)", async () => {
    process.env.DATABASE_CAPACITY_APP_INSTANCES_MIN = "5";
    process.env.DATABASE_CAPACITY_APP_INSTANCES_MAX = "1";

    const result = await checkDatabaseCapacity();

    expect(result.status).toBe("fail");
  });
});
