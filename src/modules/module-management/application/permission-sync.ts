/**
 * Module permission sync/status service (Issue #517, epic #510). Read-only:
 * reports whether each module-declared permission is `synced`, `missing`,
 * `orphaned`, or has a `mismatched_description` against
 * `awcms_micro_permissions` — never writes to that table (see
 * `domain/permission-sync.ts`'s doc comment for why the issue's optional
 * sync-write action isn't implemented).
 */
import { listModules } from "../..";
import {
  comparePermissions,
  type CatalogPermission,
  type DescriptorPermission,
  type PermissionSyncEntry
} from "../domain/permission-sync";

type CatalogPermissionRow = {
  module_key: string;
  activity_code: string;
  action: string;
  description: string | null;
};

async function fetchCatalogPermissions(
  tx: Bun.SQL,
  moduleKey?: string
): Promise<CatalogPermission[]> {
  const rows = (
    moduleKey
      ? await tx`
          SELECT module_key, activity_code, action, description
          FROM awcms_micro_permissions
          WHERE module_key = ${moduleKey}
        `
      : await tx`
          SELECT module_key, activity_code, action, description
          FROM awcms_micro_permissions
        `
  ) as CatalogPermissionRow[];

  return rows.map((row) => ({
    moduleKey: row.module_key,
    activityCode: row.activity_code,
    action: row.action,
    description: row.description
  }));
}

/**
 * Batched catalog read: ONE no-WHERE query over `awcms_micro_permissions`
 * (the same no-`moduleKey` branch of `fetchCatalogPermissions`), grouped by
 * `module_key`. Callers that need the permission-sync signal for every
 * module at once (the health-registry batch path) use this to avoid a
 * per-module `WHERE module_key = …` round-trip. A module with no catalog
 * rows simply has no map entry — `buildModulePermissionSyncReport` treats a
 * missing entry the same as an empty list.
 */
export async function fetchAllCatalogPermissions(
  tx: Bun.SQL
): Promise<Map<string, CatalogPermission[]>> {
  const all = await fetchCatalogPermissions(tx);
  const byModuleKey = new Map<string, CatalogPermission[]>();

  for (const permission of all) {
    const bucket = byModuleKey.get(permission.moduleKey);
    if (bucket) {
      bucket.push(permission);
    } else {
      byModuleKey.set(permission.moduleKey, [permission]);
    }
  }

  return byModuleKey;
}

function descriptorPermissionsForModule(
  moduleKey: string
): DescriptorPermission[] {
  const descriptor = listModules().find((d) => d.key === moduleKey);

  return (descriptor?.permissions ?? []).map((permission) => ({
    moduleKey,
    activityCode: permission.activityCode,
    action: permission.action,
    description: permission.description
  }));
}

export type ModulePermissionSyncReport = {
  moduleKey: string;
  entries: PermissionSyncEntry[];
};

/**
 * `null` means `moduleKey` is neither a registered descriptor nor present
 * anywhere in the permission catalog — a genuinely unknown key, `404`.
 * A registered module that simply hasn't declared any `permissions` yet
 * (most existing modules — see `module-management/README.md`) still
 * returns a report; every one of its catalog rows shows as `orphaned`,
 * which honestly reflects that its descriptor hasn't been backfilled,
 * not that those permissions are actually abandoned.
 */
export async function fetchModulePermissionSyncReport(
  tx: Bun.SQL,
  moduleKey: string
): Promise<ModulePermissionSyncReport | null> {
  const catalogPermissions = await fetchCatalogPermissions(tx, moduleKey);

  return buildModulePermissionSyncReport(moduleKey, catalogPermissions);
}

/**
 * Pure (no I/O) core of `fetchModulePermissionSyncReport`: given a module
 * key and that module's already-fetched catalog rows, classify each
 * permission. Shared single source of truth between the per-module read
 * (`fetchModulePermissionSyncReport`, which fetches its own rows first) and
 * the batched health path (which pre-fetches every module's rows once via
 * `fetchAllCatalogPermissions`). `catalogPermissions` MUST already be
 * scoped to `moduleKey` — the same shape the `WHERE module_key = …` query
 * and the per-key map bucket both produce. Null/empty behavior is identical
 * to the original: `null` only when the key is neither a registered
 * descriptor nor present anywhere in the catalog.
 */
export function buildModulePermissionSyncReport(
  moduleKey: string,
  catalogPermissions: CatalogPermission[]
): ModulePermissionSyncReport | null {
  const descriptorExists = listModules().some((d) => d.key === moduleKey);

  if (!descriptorExists && catalogPermissions.length === 0) {
    return null;
  }

  const entries = comparePermissions(
    descriptorPermissionsForModule(moduleKey),
    catalogPermissions
  );

  return { moduleKey, entries };
}
