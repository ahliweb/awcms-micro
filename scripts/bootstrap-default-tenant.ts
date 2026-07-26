#!/usr/bin/env bun
/**
 * `bun run bootstrap:default-tenant` — make every phase (development,
 * staging, production) start from the SAME default tenant and the same
 * full-access owner, instead of whatever each operator happened to type
 * into the setup wizard.
 *
 * ## Why this exists
 *
 * An audit of the three live phases found them agreeing only by luck:
 * production had tenant `default` + `admin@ahlikoding.com`, staging had
 * `staging` + `owner@staging.ahlikoding.com`, and development had nothing
 * at all — there was no seed path, so a developer's local instance was
 * whatever they typed. The full-access part was never at risk (the
 * bootstrap grants the owner role EVERY row of `awcms_micro_permissions`,
 * so new permissions are included automatically), but the identity and the
 * tenant code were pure convention. This turns that convention into a
 * command.
 *
 * ## Behaviour
 *
 * Idempotent and non-destructive by default:
 *
 * - fresh database → runs the same `bootstrapPlatformTenant()` composition
 *   root the setup wizard uses, so there is exactly one code path that can
 *   create a tenant/owner (no second, drifting implementation);
 * - already initialized and conformant → reports and changes nothing;
 * - already initialized but the expected owner is missing → reports it, and
 *   with `--repair` adds that identity and assigns it the full-access owner
 *   role;
 * - tenant code differs → REPORTED, never rewritten. `/blog/{tenantCode}`
 *   (ADR-0009) puts the code in public URLs, so renaming is a routing
 *   change an operator must make deliberately, not a side effect of a
 *   bootstrap command.
 *
 * The password is read only from `BOOTSTRAP_OWNER_PASSWORD` — never a CLI
 * flag, which would put it in the process list where any local process can
 * read it.
 */
import { getDatabaseClient } from "../src/lib/database/client";
import { withTenant } from "../src/lib/database/tenant-context";
import { hashPassword } from "../src/lib/auth/password";
import { bootstrapPlatformTenant } from "../src/modules/tenant-admin/application/platform-bootstrap";

export type BootstrapTarget = {
  tenantCode: string;
  tenantName: string;
  ownerLogin: string;
  ownerDisplayName: string;
  officeCode: string;
  officeName: string;
};

/** What the database currently holds, as far as this command cares. */
export type BootstrapObservation = {
  initialized: boolean;
  /** Tenant code of the tenant `awcms_micro_setup_state` points at. */
  actualTenantCode?: string;
  ownerIdentityExists: boolean;
  /** Whether that identity holds a role granting every permission. */
  ownerHasFullAccess: boolean;
};

export type BootstrapVerdict =
  | { action: "bootstrap"; reason: string }
  | { action: "none"; reason: string }
  | { action: "add_owner"; reason: string }
  | { action: "grant_full_access"; reason: string }
  | { action: "report_only"; reason: string };

/**
 * The decision, separated from all I/O so it can be tested exhaustively
 * without a database — the actual SQL below is then a straight-line
 * application of this verdict.
 */
export function decideBootstrapAction(
  observation: BootstrapObservation,
  target: BootstrapTarget
): BootstrapVerdict {
  if (!observation.initialized) {
    return {
      action: "bootstrap",
      reason: `no tenant yet — creating '${target.tenantCode}' with owner ${target.ownerLogin}`
    };
  }

  if (
    observation.actualTenantCode !== undefined &&
    observation.actualTenantCode !== target.tenantCode
  ) {
    // Deliberately not an automatic rename: the tenant code appears in
    // public URLs (`/blog/{tenantCode}`), so changing it breaks links.
    return {
      action: "report_only",
      reason: `tenant code is '${observation.actualTenantCode}', expected '${target.tenantCode}' — rename is a routing change, do it deliberately`
    };
  }

  if (!observation.ownerIdentityExists) {
    return {
      action: "add_owner",
      reason: `tenant exists but ${target.ownerLogin} does not`
    };
  }

  if (!observation.ownerHasFullAccess) {
    return {
      action: "grant_full_access",
      reason: `${target.ownerLogin} exists but holds no role with every permission`
    };
  }

  return {
    action: "none",
    reason: `tenant '${target.tenantCode}' and owner ${target.ownerLogin} already conform`
  };
}

/**
 * CLI body. Guarded so the decision table above can be imported by tests
 * without this file connecting to a database or calling `process.exit`.
 */
if (import.meta.main) {
  function readFlag(name: string, fallback: string): string {
    const prefix = `--${name}=`;
    const match = process.argv.find((argument) => argument.startsWith(prefix));

    return match?.slice(prefix.length) ?? fallback;
  }

  const target: BootstrapTarget = {
    tenantCode: readFlag("tenant-code", "default"),
    tenantName: readFlag("tenant-name", "Default"),
    ownerLogin: readFlag("owner-login", "admin@ahlikoding.com"),
    ownerDisplayName: readFlag("owner-name", "Owner"),
    officeCode: readFlag("office-code", "hq"),
    officeName: readFlag("office-name", "Head Office")
  };

  const repair = process.argv.includes("--repair");
  const password = process.env.BOOTSTRAP_OWNER_PASSWORD ?? "";

  function report(exitCode: number, result: Record<string, unknown>): never {
    console.log(
      JSON.stringify({ check: "bootstrap-default-tenant", ...result }, null, 2)
    );

    process.exit(exitCode);
  }

  if (password.length < 8) {
    report(2, {
      outcome: "misconfigured",
      detail:
        "BOOTSTRAP_OWNER_PASSWORD must be set and at least 8 characters (same minimum the setup wizard enforces)."
    });
  }

  const sql = getDatabaseClient();

  type SetupRow = { tenant_id: string | null };
  type CodeRow = { tenant_code: string };
  type CountRow = { count: string };

  const setupRows = (await sql`
    SELECT tenant_id FROM awcms_micro_setup_state WHERE id = true
  `) as SetupRow[];

  const setupTenantId = setupRows[0]?.tenant_id ?? null;

  let observation: BootstrapObservation = {
    initialized: setupTenantId !== null,
    ownerIdentityExists: false,
    ownerHasFullAccess: false
  };

  if (setupTenantId !== null) {
    observation = await withTenant(
      sql,
      setupTenantId,
      async (tx) => {
        const codeRows = (await tx`
          SELECT tenant_code FROM awcms_micro_tenants WHERE id = ${setupTenantId}
        `) as CodeRow[];

        const identityRows = (await tx`
          SELECT count(*)::text AS count
          FROM awcms_micro_identities
          WHERE tenant_id = ${setupTenantId}
            AND login_identifier = ${target.ownerLogin}
        `) as CountRow[];

        // "Full access" is defined as holding a role whose permission count
        // equals the catalogue's — the same property the wizard's
        // `SELECT ... FROM awcms_micro_permissions` grant produces, so a
        // permission added by a future migration makes this false until the
        // role is re-granted.
        const fullAccessRows = (await tx`
          SELECT count(*)::text AS count
          FROM awcms_micro_identities i
          JOIN awcms_micro_tenant_users tu ON tu.identity_id = i.id
          JOIN awcms_micro_access_assignments aa ON aa.tenant_user_id = tu.id
          JOIN awcms_micro_roles r ON r.id = aa.role_id
          WHERE i.tenant_id = ${setupTenantId}
            AND i.login_identifier = ${target.ownerLogin}
            AND (
              SELECT count(*) FROM awcms_micro_role_permissions rp WHERE rp.role_id = r.id
            ) = (SELECT count(*) FROM awcms_micro_permissions)
        `) as CountRow[];

        return {
          initialized: true,
          actualTenantCode: codeRows[0]?.tenant_code,
          ownerIdentityExists: Number(identityRows[0]?.count ?? "0") > 0,
          ownerHasFullAccess: Number(fullAccessRows[0]?.count ?? "0") > 0
        };
      },
      { unavailableBehavior: "throw", workClass: "maintenance" }
    );
  }

  const verdict = decideBootstrapAction(observation, target);

  if (verdict.action === "none") {
    report(0, {
      outcome: "already_conformant",
      detail: verdict.reason,
      target
    });
  }

  if (verdict.action === "report_only") {
    report(1, {
      outcome: "needs_operator_decision",
      detail: verdict.reason,
      target
    });
  }

  if (verdict.action === "bootstrap") {
    const result = await sql.begin(async (tx) =>
      bootstrapPlatformTenant(tx as unknown as Bun.SQL, {
        tenantName: target.tenantName,
        tenantCode: target.tenantCode,
        officeCode: target.officeCode,
        officeName: target.officeName,
        ownerLoginIdentifier: target.ownerLogin,
        ownerPassword: password,
        ownerDisplayName: target.ownerDisplayName
      })
    );

    report(0, { outcome: result.outcome, detail: verdict.reason, target });
  }

  if (!repair) {
    report(1, {
      outcome: "needs_repair",
      detail: `${verdict.reason} — re-run with --repair to fix it`,
      target
    });
  }

  const tenantId = setupTenantId as string;

  await withTenant(
    sql,
    tenantId,
    async (tx) => {
      let roleId: string;

      const existingRole = (await tx`
        SELECT id FROM awcms_micro_roles
        WHERE tenant_id = ${tenantId} AND role_code = 'owner'
      `) as { id: string }[];

      if (existingRole[0]) {
        roleId = existingRole[0].id;
      } else {
        const created = (await tx`
          INSERT INTO awcms_micro_roles (tenant_id, role_code, role_name, is_system)
          VALUES (${tenantId}, 'owner', 'Owner', true)
          RETURNING id
        `) as { id: string }[];
        roleId = created[0]!.id;
      }

      // Re-grant is a set difference, so this both creates a complete grant
      // and tops up a role that a later migration left short.
      await tx`
        INSERT INTO awcms_micro_role_permissions (tenant_id, role_id, permission_id)
        SELECT ${tenantId}, ${roleId}, p.id
        FROM awcms_micro_permissions p
        WHERE NOT EXISTS (
          SELECT 1 FROM awcms_micro_role_permissions rp
          WHERE rp.role_id = ${roleId} AND rp.permission_id = p.id
        )
      `;

      if (verdict.action === "grant_full_access") {
        return;
      }

      const profile = (await tx`
        INSERT INTO awcms_micro_profiles (tenant_id, profile_type, display_name)
        VALUES (${tenantId}, 'person', ${target.ownerDisplayName})
        RETURNING id
      `) as { id: string }[];

      const identity = (await tx`
        INSERT INTO awcms_micro_identities (tenant_id, profile_id, login_identifier, password_hash)
        VALUES (${tenantId}, ${profile[0]!.id}, ${target.ownerLogin}, ${await hashPassword(password)})
        RETURNING id
      `) as { id: string }[];

      const tenantUser = (await tx`
        INSERT INTO awcms_micro_tenant_users (tenant_id, identity_id)
        VALUES (${tenantId}, ${identity[0]!.id})
        RETURNING id
      `) as { id: string }[];

      await tx`
        INSERT INTO awcms_micro_access_assignments (tenant_id, tenant_user_id, role_id, assigned_by)
        VALUES (${tenantId}, ${tenantUser[0]!.id}, ${roleId}, ${tenantUser[0]!.id})
      `;
    },
    { unavailableBehavior: "throw", workClass: "maintenance" }
  );

  report(0, { outcome: "repaired", detail: verdict.reason, target });
}
