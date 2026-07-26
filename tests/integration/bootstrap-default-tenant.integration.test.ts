/**
 * `bun run bootstrap:default-tenant` against a real PostgreSQL.
 *
 * The unit suite pins the decision table; this pins what the decisions
 * actually DO — the SQL, the idempotency, and the two paths that must
 * refuse to write. Run as a real process so the exit code, which is what an
 * operator and a deploy pipeline read, is part of the assertion.
 *
 * Skipped unless DATABASE_URL is set (see tests/integration/harness.ts).
 */
import { beforeAll, beforeEach, describe, expect, test } from "bun:test";

import {
  applyMigrations,
  getAdminSql,
  integrationEnabled,
  provisionAppRole,
  resetDatabase
} from "./harness";

const OWNER_LOGIN = "admin@bootstrap.test";
const OWNER_PASSWORD = "integration-bootstrap-password";

type CliRun = { exitCode: number; outcome: string; detail: string };

async function runBootstrap(...args: string[]): Promise<CliRun> {
  // The CLI reads the FIRST matching flag, so the default must not be
  // prepended when the caller supplies its own — otherwise a test that
  // means "bootstrap under a different owner" silently gets this one.
  const ownerFlag = args.some((argument) =>
    argument.startsWith("--owner-login=")
  )
    ? []
    : [`--owner-login=${OWNER_LOGIN}`];

  const spawned = Bun.spawn(
    ["bun", "scripts/bootstrap-default-tenant.ts", ...ownerFlag, ...args],
    {
      env: { ...process.env, BOOTSTRAP_OWNER_PASSWORD: OWNER_PASSWORD },
      stdout: "pipe",
      stderr: "pipe"
    }
  );

  const stdout = await new Response(spawned.stdout).text();
  const exitCode = await spawned.exited;

  const start = stdout.lastIndexOf('{\n  "check": "bootstrap-default-tenant"');

  if (start === -1) {
    throw new Error(`no report in CLI output (exit ${exitCode}):\n${stdout}`);
  }

  const report = JSON.parse(stdout.slice(start)) as {
    outcome: string;
    detail?: string;
  };

  return { exitCode, outcome: report.outcome, detail: report.detail ?? "" };
}

async function countRows(sql: string): Promise<number> {
  const rows = (await getAdminSql().unsafe(sql)) as { count: string }[];

  return Number(rows[0]?.count ?? "0");
}

/** Owner identities holding a role that grants every catalogued permission. */
function fullAccessOwnerCountSql(login: string): string {
  return `
    SELECT count(*)::text AS count
    FROM awcms_micro_identities i
    JOIN awcms_micro_tenant_users tu ON tu.identity_id = i.id
    JOIN awcms_micro_access_assignments aa ON aa.tenant_user_id = tu.id
    JOIN awcms_micro_roles r ON r.id = aa.role_id
    WHERE i.login_identifier = '${login}'
      AND (SELECT count(*) FROM awcms_micro_role_permissions rp WHERE rp.role_id = r.id)
        = (SELECT count(*) FROM awcms_micro_permissions)
  `;
}

describe.skipIf(!integrationEnabled)("bootstrap:default-tenant", () => {
  beforeAll(async () => {
    await applyMigrations();
    await provisionAppRole();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  test("an empty database gets the default tenant and a full-access owner", async () => {
    const run = await runBootstrap();

    expect(run.exitCode).toBe(0);
    expect(run.outcome).toBe("initialized");

    expect(
      await countRows(
        "SELECT count(*)::text AS count FROM awcms_micro_tenants WHERE tenant_code = 'default'"
      )
    ).toBe(1);

    // The point of the whole command: not just "an owner exists" but "an
    // owner holding every permission there is".
    expect(await countRows(fullAccessOwnerCountSql(OWNER_LOGIN))).toBe(1);
  }, 60_000);

  test("running it twice changes nothing the second time", async () => {
    expect((await runBootstrap()).outcome).toBe("initialized");

    const second = await runBootstrap();

    expect(second.exitCode).toBe(0);
    expect(second.outcome).toBe("already_conformant");

    expect(
      await countRows("SELECT count(*)::text AS count FROM awcms_micro_tenants")
    ).toBe(1);
    expect(
      await countRows(
        `SELECT count(*)::text AS count FROM awcms_micro_identities WHERE login_identifier = '${OWNER_LOGIN}'`
      )
    ).toBe(1);
  }, 60_000);

  test("a missing owner is reported, and only added when repair is asked for", async () => {
    // A tenant bootstrapped under a DIFFERENT owner login — the exact shape
    // staging was in when the audit found it.
    await runBootstrap("--owner-login=someone-else@bootstrap.test");

    const withoutRepair = await runBootstrap();
    expect(withoutRepair.exitCode).toBe(1);
    expect(withoutRepair.outcome).toBe("needs_repair");
    expect(
      await countRows(
        `SELECT count(*)::text AS count FROM awcms_micro_identities WHERE login_identifier = '${OWNER_LOGIN}'`
      )
    ).toBe(0);

    const repaired = await runBootstrap("--repair");
    expect(repaired.exitCode).toBe(0);
    expect(repaired.outcome).toBe("repaired");
    expect(await countRows(fullAccessOwnerCountSql(OWNER_LOGIN))).toBe(1);

    // The pre-existing owner is untouched: repair adds, it does not replace.
    expect(
      await countRows(fullAccessOwnerCountSql("someone-else@bootstrap.test"))
    ).toBe(1);
  }, 90_000);

  test("a different tenant code is refused, even with --repair", async () => {
    await runBootstrap("--tenant-code=staging");

    const run = await runBootstrap("--repair");

    expect(run.exitCode).toBe(1);
    expect(run.outcome).toBe("needs_operator_decision");
    expect(run.detail).toContain("staging");

    // Nothing written: a rename would change `/blog/{tenantCode}` URLs, so
    // this path must stay read-only however convenient a fix would be.
    expect(
      await countRows(
        "SELECT count(*)::text AS count FROM awcms_micro_tenants WHERE tenant_code = 'default'"
      )
    ).toBe(0);
  }, 90_000);

  test("an owner short of some permissions is topped up", async () => {
    await runBootstrap();

    // Simulate the drift a later migration causes: a new permission lands
    // in the catalogue and the existing owner role does not hold it.
    await getAdminSql().unsafe(`
      DELETE FROM awcms_micro_role_permissions
      WHERE permission_id IN (SELECT id FROM awcms_micro_permissions LIMIT 3)
    `);
    expect(await countRows(fullAccessOwnerCountSql(OWNER_LOGIN))).toBe(0);

    const run = await runBootstrap("--repair");

    expect(run.exitCode).toBe(0);
    expect(run.outcome).toBe("repaired");
    expect(await countRows(fullAccessOwnerCountSql(OWNER_LOGIN))).toBe(1);
  }, 90_000);

  test("it refuses to run without a usable password", async () => {
    const spawned = Bun.spawn(["bun", "scripts/bootstrap-default-tenant.ts"], {
      env: { ...process.env, BOOTSTRAP_OWNER_PASSWORD: "short" },
      stdout: "pipe",
      stderr: "pipe"
    });

    const stdout = await new Response(spawned.stdout).text();

    expect(await spawned.exited).toBe(2);
    expect(stdout).toContain("misconfigured");
    expect(
      await countRows("SELECT count(*)::text AS count FROM awcms_micro_tenants")
    ).toBe(0);
  }, 60_000);
});
