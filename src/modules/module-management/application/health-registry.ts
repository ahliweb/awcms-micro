/**
 * Module health/readiness service (Issue #520, epic #510). Every signal is
 * cheap and bounded (a handful of lightweight queries + a couple of small
 * file reads, all already cached-friendly at this scale) — this is meant
 * to be safe to call from an admin request, never a long-running or
 * business-transaction-blocking operation. For lists of modules use
 * `fetchModuleHealthReports` (or `buildModuleHealthBatchContext` directly):
 * it fetches the instance-global facts (`migrations_applied`, the module
 * registry scan, the permission catalog) plus this tenant's settings rows
 * ONCE for the whole registry instead of once per module, so the cost no
 * longer scales with the (now 22-module) registry — see
 * `ModuleHealthBatchContext`. The one exception —
 * `checkEmailProviderHealth`'s real network call — is only ever invoked
 * from the explicit `POST .../health/check` action (Issue #520's own
 * "provider checks are explicit" requirement), never from the passive
 * `GET .../health` read.
 *
 * Every catch below logs the real error server-side (via `log()`, doc 10
 * §Logger redaction) but only ever puts a fixed, generic string in the
 * signal `detail` returned to the caller — never a raw error message,
 * stack trace, or `DATABASE_URL`.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parseDocument } from "yaml";

import { log } from "../../../lib/logging/logger";
import { listModules } from "../..";
import type { ModuleDescriptor } from "../../_shared/module-contract";
import {
  buildModulePermissionSyncReport,
  fetchAllCatalogPermissions
} from "./permission-sync";
import {
  buildModuleSettingsView,
  fetchModuleSettingsRows,
  type ModuleSettingsRow
} from "./module-settings";
import type { CatalogPermission } from "../domain/permission-sync";
import { fetchModuleJobs } from "./job-registry";
import { syncModuleDescriptors } from "./descriptor-sync";
import { validateJobDescriptor } from "../domain/job-registry";
import {
  classifyHealthStatus,
  type HealthStatus,
  type ReadinessSignal
} from "../domain/health-registry";
import { resolveEmailProvider } from "../../email/infrastructure/email-provider-resolver";

export type ModuleHealthReport = {
  moduleKey: string;
  status: HealthStatus;
  signals: ReadinessSignal[];
  generatedAt: string;
};

function findDescriptor(moduleKey: string): ModuleDescriptor | null {
  return listModules().find((d) => d.key === moduleKey) ?? null;
}

/**
 * Deliberately a minimal, local re-listing of `sql/*.sql` filenames — not
 * an import of `scripts/db-migrate.ts`'s own `discoverMigrationFiles`
 * (that would be a backwards dependency, `src/` on `scripts/`, and drags
 * in checksum/transaction-control validation this read-only check doesn't
 * need). Just enough to compare "files on disk" vs. "rows already applied".
 */
async function listMigrationFileNames(): Promise<string[]> {
  const migrationsDir = path.resolve(process.cwd(), "sql");
  const entries = await readdir(migrationsDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name);
}

async function migrationsAppliedSignal(
  tx: Bun.SQL,
  correlationId?: string
): Promise<ReadinessSignal> {
  try {
    const fileNames = await listMigrationFileNames();
    const appliedRows = (await tx`
      SELECT migration_name FROM awcms_micro_schema_migrations
    `) as { migration_name: string }[];
    const appliedNames = new Set(appliedRows.map((row) => row.migration_name));
    const pending = fileNames.filter((name) => !appliedNames.has(name));

    return {
      name: "migrations_applied",
      status: pending.length === 0 ? "pass" : "fail",
      detail:
        pending.length > 0
          ? `${pending.length} migration file(s) not yet applied.`
          : undefined
    };
  } catch (error) {
    log("error", "health-registry: migrations_applied check failed", {
      moduleKey: "module_management",
      correlationId,
      error: error instanceof Error ? error.message : String(error)
    });

    return {
      name: "migrations_applied",
      status: "fail",
      detail: "Could not check migration state."
    };
  }
}

/**
 * Pure `db_registry_synced` builder — takes the module's already-fetched
 * `lifecycle_status` (or `undefined` if it has no `awcms_micro_modules` row
 * yet) instead of running its own `WHERE module_key = …` query. The DB read
 * moved up to `buildModuleHealthBatchContext`, which fetches every module's
 * lifecycle in one scan; the pass/fail/detail decision here is byte-identical
 * to the previous per-module version.
 */
function dbRegistrySyncedSignal(
  descriptor: ModuleDescriptor,
  lifecycleStatus: string | undefined
): ReadinessSignal {
  if (lifecycleStatus === undefined) {
    return {
      name: "db_registry_synced",
      status: "fail",
      detail: "No database registry row yet — run the descriptor sync."
    };
  }

  return {
    name: "db_registry_synced",
    status: lifecycleStatus === descriptor.status ? "pass" : "fail",
    detail:
      lifecycleStatus === descriptor.status
        ? undefined
        : "Database registry status is stale — run the descriptor sync."
  };
}

/**
 * Pure `permission_catalog_synced` builder — takes this module's
 * already-fetched catalog rows (from `fetchAllCatalogPermissions`, one scan
 * for every module) instead of running its own `WHERE module_key = …` query.
 * Delegates to the same `buildModulePermissionSyncReport` the per-module read
 * uses, so the missing/mismatched count and detail string are identical.
 */
function permissionCatalogSyncedSignal(
  moduleKey: string,
  catalogPermissions: CatalogPermission[]
): ReadinessSignal {
  const report = buildModulePermissionSyncReport(moduleKey, catalogPermissions);
  const unsynced = (report?.entries ?? []).filter(
    (entry) =>
      entry.status === "missing" || entry.status === "mismatched_description"
  );

  return {
    name: "permission_catalog_synced",
    status: unsynced.length === 0 ? "pass" : "fail",
    detail:
      unsynced.length > 0
        ? `${unsynced.length} declared permission(s) missing or mismatched in the catalog.`
        : undefined
  };
}

/**
 * Pure `settings_valid` builder — takes this module's already-fetched
 * settings row (from `fetchModuleSettingsRows`, one query for the whole
 * tenant) and rebuilds the view via `buildModuleSettingsView` in a try/catch,
 * exactly as before: the signal only cares whether building the effective
 * view throws (a malformed override), never its contents.
 */
function settingsValidSignal(
  descriptor: ModuleDescriptor,
  row: ModuleSettingsRow | null,
  correlationId?: string
): ReadinessSignal {
  try {
    buildModuleSettingsView(descriptor, row);
    return { name: "settings_valid", status: "pass" };
  } catch (error) {
    log("error", "health-registry: settings_valid check failed", {
      moduleKey: descriptor.key,
      correlationId,
      error: error instanceof Error ? error.message : String(error)
    });

    return {
      name: "settings_valid",
      status: "fail",
      detail: "Could not resolve effective module settings."
    };
  }
}

function jobsDocumentedSignal(moduleKey: string): ReadinessSignal {
  const jobs = fetchModuleJobs(moduleKey) ?? [];

  if (jobs.length === 0) {
    return { name: "jobs_documented", status: "not_applicable" };
  }

  const invalid = jobs.filter((job) => !validateJobDescriptor(job).valid);

  return {
    name: "jobs_documented",
    status: invalid.length === 0 ? "pass" : "fail",
    detail:
      invalid.length > 0
        ? `${invalid.length} job descriptor(s) have an invalid shape.`
        : undefined
  };
}

const yamlDocumentCache = new Map<string, unknown>();

async function readYamlCached(relativePath: string): Promise<unknown | null> {
  if (yamlDocumentCache.has(relativePath)) {
    return yamlDocumentCache.get(relativePath) ?? null;
  }

  try {
    const source = await readFile(
      path.resolve(process.cwd(), relativePath),
      "utf8"
    );
    const document = parseDocument(source).toJSON();
    yamlDocumentCache.set(relativePath, document);
    return document;
  } catch {
    yamlDocumentCache.set(relativePath, null);
    return null;
  }
}

async function openApiDocumentedSignal(
  descriptor: ModuleDescriptor
): Promise<ReadinessSignal> {
  if (!descriptor.api) {
    return { name: "openapi_documented", status: "not_applicable" };
  }

  const document = (await readYamlCached(descriptor.api.openApiPath)) as {
    paths?: Record<string, unknown>;
  } | null;
  const paths = document?.paths ? Object.keys(document.paths) : [];
  const hasBasePathEntry = paths.some((p) =>
    p.startsWith(descriptor.api!.basePath)
  );

  return {
    name: "openapi_documented",
    status: document && hasBasePathEntry ? "pass" : "fail",
    detail:
      document && hasBasePathEntry
        ? undefined
        : "No OpenAPI path found under the module's declared basePath."
  };
}

async function asyncApiDocumentedSignal(
  descriptor: ModuleDescriptor
): Promise<ReadinessSignal> {
  const publishes = descriptor.events?.publishes ?? [];

  if (publishes.length === 0) {
    return { name: "asyncapi_documented", status: "not_applicable" };
  }

  const document = (await readYamlCached(
    descriptor.events!.asyncApiPath ?? ""
  )) as { channels?: Record<string, unknown> } | null;
  const channels = document?.channels ?? {};
  const missing = publishes.filter((eventName) => !channels[eventName]);

  return {
    name: "asyncapi_documented",
    status: missing.length === 0 ? "pass" : "fail",
    detail:
      missing.length > 0
        ? `${missing.length} published event(s) missing an AsyncAPI channel.`
        : undefined
  };
}

/**
 * Instance-wide, tenant-scoped data that every per-module health signal
 * needs, fetched ONCE instead of once per module. The three instance-global
 * facts — `migrations_applied` (identical for every module), the module
 * registry lifecycle scan, and the permission catalog — plus this tenant's
 * settings rows are all read here in a fixed, small number of queries (four
 * queries + one `sql/` readdir total, regardless of how many modules the
 * registry holds), then handed to the pure per-module signal builders. Every
 * query stays on the caller's own tenant-scoped `withTenant` connection, so
 * RLS applies exactly as it did per-module; this only reduces the NUMBER of
 * queries, never widens their scope.
 */
export type ModuleHealthBatchContext = {
  migrationsSignal: ReadinessSignal;
  registryLifecycleByKey: Map<string, string>;
  catalogPermissionsByKey: Map<string, CatalogPermission[]>;
  settingsRowByKey: Map<string, ModuleSettingsRow>;
};

export async function buildModuleHealthBatchContext(
  tx: Bun.SQL,
  tenantId: string,
  correlationId?: string
): Promise<ModuleHealthBatchContext> {
  // Sequential (not `Promise.all`) on purpose: `tx` is a single reserved
  // `withTenant` connection, so these serialize regardless — issuing them
  // concurrently on one connection buys nothing and risks a
  // connection-busy error. Four small queries + one readdir for the WHOLE
  // registry replaces the previous ~4 queries + readdir PER module.
  const migrationsSignal = await migrationsAppliedSignal(tx, correlationId);

  const registryRows = (await tx`
    SELECT module_key, lifecycle_status FROM awcms_micro_modules
  `) as { module_key: string; lifecycle_status: string }[];
  const registryLifecycleByKey = new Map(
    registryRows.map((row) => [row.module_key, row.lifecycle_status])
  );

  const catalogPermissionsByKey = await fetchAllCatalogPermissions(tx);
  const settingsRowByKey = await fetchModuleSettingsRows(tx, tenantId);

  return {
    migrationsSignal,
    registryLifecycleByKey,
    catalogPermissionsByKey,
    settingsRowByKey
  };
}

/**
 * Single source of truth for the generic signal list — used by BOTH the
 * batched `fetchModuleHealthReports` and the single-module
 * `computeGenericSignals`, so the signal set/order/logic can never drift
 * between the two paths. Signal order is identical to the previous
 * `computeGenericSignals`.
 */
async function buildGenericSignalsFromContext(
  context: ModuleHealthBatchContext,
  descriptor: ModuleDescriptor,
  correlationId?: string
): Promise<ReadinessSignal[]> {
  return [
    { name: "descriptor_registered", status: "pass" },
    dbRegistrySyncedSignal(
      descriptor,
      context.registryLifecycleByKey.get(descriptor.key)
    ),
    context.migrationsSignal,
    permissionCatalogSyncedSignal(
      descriptor.key,
      context.catalogPermissionsByKey.get(descriptor.key) ?? []
    ),
    settingsValidSignal(
      descriptor,
      context.settingsRowByKey.get(descriptor.key) ?? null,
      correlationId
    ),
    jobsDocumentedSignal(descriptor.key),
    await openApiDocumentedSignal(descriptor),
    await asyncApiDocumentedSignal(descriptor)
  ];
}

async function computeGenericSignals(
  tx: Bun.SQL,
  tenantId: string,
  descriptor: ModuleDescriptor,
  correlationId?: string
): Promise<ReadinessSignal[]> {
  const context = await buildModuleHealthBatchContext(
    tx,
    tenantId,
    correlationId
  );

  return buildGenericSignalsFromContext(context, descriptor, correlationId);
}

/** `null` means `moduleKey` isn't a registered descriptor — `404`. */
export async function fetchModuleHealthReport(
  tx: Bun.SQL,
  tenantId: string,
  moduleKey: string,
  correlationId?: string
): Promise<ModuleHealthReport | null> {
  const descriptor = findDescriptor(moduleKey);

  if (!descriptor) {
    return null;
  }

  const signals = await computeGenericSignals(
    tx,
    tenantId,
    descriptor,
    correlationId
  );

  return {
    moduleKey,
    status: classifyHealthStatus(signals),
    signals,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Batched variant of `fetchModuleHealthReport` for callers that need the
 * health report of MANY modules at once (the `/admin/modules` list and the
 * `/admin/modules/tenants` matrix). Builds the shared
 * `ModuleHealthBatchContext` ONCE, then assembles each module's report from
 * pre-fetched data with no additional per-module query. Output per module is
 * byte-identical to calling `fetchModuleHealthReport` for that key. Unknown
 * keys (no registered descriptor) are omitted from the result map, mirroring
 * the single variant's `null` for a `404`.
 */
export async function fetchModuleHealthReports(
  tx: Bun.SQL,
  tenantId: string,
  moduleKeys: string[],
  correlationId?: string
): Promise<Map<string, ModuleHealthReport>> {
  const context = await buildModuleHealthBatchContext(
    tx,
    tenantId,
    correlationId
  );

  const reports = new Map<string, ModuleHealthReport>();

  for (const moduleKey of moduleKeys) {
    const descriptor = findDescriptor(moduleKey);
    if (!descriptor) {
      continue;
    }

    const signals = await buildGenericSignalsFromContext(
      context,
      descriptor,
      correlationId
    );

    reports.set(moduleKey, {
      moduleKey,
      status: classifyHealthStatus(signals),
      signals,
      generatedAt: new Date().toISOString()
    });
  }

  return reports;
}

/**
 * Only `email` has a real, bounded, network-calling provider health check
 * today (`resolveEmailProvider().healthCheck()`, Issue #495 — already
 * timeout-bounded and error-truncating, the same function
 * `bun run email:provider:health` calls). Every other module has no
 * provider to check, so this signal is `not_applicable` for them — this is
 * the one deliberately module-specific check in this otherwise-generic
 * service (same precedent `scripts/security-readiness.ts` already
 * established: a shared operational script naming one specific module's
 * check, not a generic port every module must implement).
 */
async function providerHealthCheckSignal(
  moduleKey: string,
  correlationId?: string
): Promise<ReadinessSignal> {
  if (moduleKey !== "email") {
    return { name: "provider_health_check", status: "not_applicable" };
  }

  try {
    const result = await resolveEmailProvider().healthCheck();

    return {
      name: "provider_health_check",
      status: result.ok ? "pass" : "fail",
      detail: result.ok ? undefined : "Email provider health check failed."
    };
  } catch (error) {
    log("error", "health-registry: provider_health_check failed", {
      moduleKey,
      correlationId,
      error: error instanceof Error ? error.message : String(error)
    });

    return {
      name: "provider_health_check",
      status: "fail",
      detail: "Could not run the provider health check."
    };
  }
}

/**
 * `awcms_micro_module_health_checks` (migration 025) — instance-level
 * history, RLS-free (a health result is a fact about the deployed
 * instance, not about any one tenant), written only by the explicit
 * `POST .../health/check` action (never the passive `GET`, which would
 * otherwise turn every admin page view into a write). `message` is a
 * fixed, safe summary of which signal names failed — never a signal's
 * own `detail` text, keeping the same "generic strings only" guarantee
 * the signals themselves already provide.
 */
async function recordHealthCheckHistory(
  tx: Bun.SQL,
  moduleKey: string,
  report: ModuleHealthReport
): Promise<void> {
  const failedNames = report.signals
    .filter((signal) => signal.status === "fail")
    .map((signal) => signal.name);
  const message =
    failedNames.length > 0
      ? `Failed signals: ${failedNames.join(", ")}.`
      : null;

  await tx`
    INSERT INTO awcms_micro_module_health_checks (module_key, status, message)
    VALUES (${moduleKey}, ${report.status}, ${message})
  `;
}

/**
 * The explicit, on-demand variant (`POST .../health/check`) — same
 * generic signals as `fetchModuleHealthReport`, plus the one live
 * provider check where applicable. Never called from `GET .../health`,
 * which stays fast/cheap on every call. Records its result into
 * `awcms_micro_module_health_checks` as a history entry — that table has
 * an FK to `awcms_micro_modules`, so this syncs the registry first (same
 * "sync first" reasoning as `tenant-module-lifecycle.ts`/
 * `module-settings.ts`). This is the one place `db_registry_synced` can
 * genuinely read differently between `GET` and `POST` for the same
 * module — `POST` self-heals the registry as a side effect of writing
 * history, `GET` never does (stays a pure read).
 */
export async function runModuleHealthCheck(
  tx: Bun.SQL,
  tenantId: string,
  moduleKey: string,
  correlationId?: string
): Promise<ModuleHealthReport | null> {
  const descriptor = findDescriptor(moduleKey);

  if (!descriptor) {
    return null;
  }

  await syncModuleDescriptors(tx);

  const signals = await computeGenericSignals(
    tx,
    tenantId,
    descriptor,
    correlationId
  );
  signals.push(await providerHealthCheckSignal(moduleKey, correlationId));

  const report: ModuleHealthReport = {
    moduleKey,
    status: classifyHealthStatus(signals),
    signals,
    generatedAt: new Date().toISOString()
  };

  await recordHealthCheckHistory(tx, moduleKey, report);

  return report;
}
