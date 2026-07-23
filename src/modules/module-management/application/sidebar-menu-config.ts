/**
 * Per-tenant sidebar menu configuration data access
 * (feat/sidebar-menu-management) over `awcms_micro_sidebar_menu_types` +
 * `awcms_micro_sidebar_menu_items` (sql/094). Every query runs inside a
 * caller-provided tenant transaction (`withTenant`, RLS FORCE'd on both
 * tables), so tenant isolation holds twice: the explicit `tenant_id` filter
 * here and RLS.
 *
 * Three surfaces:
 *   - `fetchSidebarArrangement` — the RENDER model AdminLayout uses (composed,
 *     permission/visibility filtered).
 *   - `fetchSidebarConfigForAdmin` — the full EDITABLE model the management
 *     page uses (every entry + its override state, nothing permission-filtered).
 *   - `saveSidebarConfig` / `resetSidebarConfig` — the writers (high-risk
 *     `configure`, so the route wires idempotency + an audit hook, mirroring
 *     `seo-config-directory.ts`).
 */
import { listModules } from "../..";
import { fetchTenantDisabledModuleKeys } from "./navigation-registry";
import {
  buildDefaultSidebarModel,
  composeSidebarArrangement,
  defaultTypeLabelKey,
  DEFAULT_MENU_TYPES,
  type ComposedSidebar,
  type SidebarItemOverride,
  type SidebarSavePayload,
  type SidebarTypeOverride
} from "../domain/sidebar-menu";

type TypeOverrideDbRow = {
  type_key: string;
  label_override: string | null;
  position: number;
  hidden: boolean;
};

type ItemOverrideDbRow = {
  entry_key: string;
  type_key: string | null;
  position: number;
  label_override: string | null;
  hidden: boolean;
};

async function fetchTypeOverrides(
  tx: Bun.SQL,
  tenantId: string
): Promise<SidebarTypeOverride[]> {
  const rows = (await tx`
    SELECT type_key, label_override, position, hidden
    FROM awcms_micro_sidebar_menu_types
    WHERE tenant_id = ${tenantId}
  `) as TypeOverrideDbRow[];
  return rows.map((row) => ({
    typeKey: row.type_key,
    labelOverride: row.label_override,
    position: row.position,
    hidden: row.hidden
  }));
}

async function fetchItemOverrides(
  tx: Bun.SQL,
  tenantId: string
): Promise<SidebarItemOverride[]> {
  const rows = (await tx`
    SELECT entry_key, type_key, position, label_override, hidden
    FROM awcms_micro_sidebar_menu_items
    WHERE tenant_id = ${tenantId}
  `) as ItemOverrideDbRow[];
  return rows.map((row) => ({
    entryKey: row.entry_key,
    typeKey: row.type_key,
    position: row.position,
    labelOverride: row.label_override,
    hidden: row.hidden
  }));
}

/**
 * The composed, permission/visibility-filtered sidebar tree AdminLayout
 * renders. REPLACES the flat `fetchVisibleModuleNavigationEntries` +
 * hardcoded-core rendering (the old service is kept only as the layout's
 * graceful-degradation fallback).
 */
export async function fetchSidebarArrangement(
  tx: Bun.SQL,
  tenantId: string,
  grantedPermissionKeys: ReadonlySet<string>
): Promise<ComposedSidebar> {
  const [typeOverrides, itemOverrides, tenantDisabledModuleKeys] =
    await Promise.all([
      fetchTypeOverrides(tx, tenantId),
      fetchItemOverrides(tx, tenantId),
      fetchTenantDisabledModuleKeys(tx, tenantId)
    ]);

  return composeSidebarArrangement(
    buildDefaultSidebarModel(listModules()),
    typeOverrides,
    itemOverrides,
    { grantedPermissionKeys, tenantDisabledModuleKeys }
  );
}

// ---------------------------------------------------------------------------
// Admin editable model
// ---------------------------------------------------------------------------

/** One editable menu item row, with its current override state exposed. */
export interface AdminSidebarItem {
  entryKey: string;
  path: string;
  labelKey: string;
  labelOverride: string | null;
  icon?: string;
  hidden: boolean;
  position: number;
  /** The type it currently sits under (override or default). */
  typeKey: string;
  moduleKey: string;
  moduleName: string;
  /** Exposed so the UI can note "only visible to those with permission". */
  requiredPermission?: string;
  requiredPermissionPrefix?: string;
}

/** One editable type section, grouped by module (sub-type). */
export interface AdminSidebarModuleGroup {
  moduleKey: string;
  moduleName: string;
  items: AdminSidebarItem[];
}

export interface AdminSidebarType {
  typeKey: string;
  labelKey?: string;
  labelOverride: string | null;
  position: number;
  hidden: boolean;
  isCustom: boolean;
  modules: AdminSidebarModuleGroup[];
}

export interface AdminSidebarConfig {
  types: AdminSidebarType[];
  /** All type keys (default + custom) for the "move to type" control. */
  availableTypeKeys: {
    typeKey: string;
    labelKey?: string;
    isCustom: boolean;
  }[];
}

/**
 * The FULL editable model for the management page — every default entry plus
 * its current override state, grouped by CURRENT type -> module. Deliberately
 * NOT permission-filtered (the admin arranges everything, including items only
 * some users will ultimately see) but each item still carries its
 * `requiredPermission`/prefix so the UI can flag it.
 */
export async function fetchSidebarConfigForAdmin(
  tx: Bun.SQL,
  tenantId: string
): Promise<AdminSidebarConfig> {
  const defaults = buildDefaultSidebarModel(listModules());
  const [typeOverrides, itemOverrides] = await Promise.all([
    fetchTypeOverrides(tx, tenantId),
    fetchItemOverrides(tx, tenantId)
  ]);

  const typeOverrideMap = new Map(typeOverrides.map((t) => [t.typeKey, t]));
  const itemOverrideMap = new Map(itemOverrides.map((i) => [i.entryKey, i]));

  // Effective, sorted entries with resolved (type, position).
  const entries = defaults
    .map((entry) => {
      const override = itemOverrideMap.get(entry.entryKey);
      return {
        entry,
        override,
        typeKey: override?.typeKey ?? entry.typeKey,
        position: override?.position ?? entry.defaultOrder
      };
    })
    .sort(
      (a, b) =>
        a.position - b.position ||
        a.entry.defaultOrder - b.entry.defaultOrder ||
        a.entry.path.localeCompare(b.entry.path)
    );

  // Every type that either exists by default, has an override, or is a
  // placement target of some entry.
  const typeKeys = new Set<string>();
  for (const type of DEFAULT_MENU_TYPES) typeKeys.add(type.typeKey);
  for (const override of typeOverrides) typeKeys.add(override.typeKey);
  for (const entry of entries) typeKeys.add(entry.typeKey);

  const defaultTypeKeySet = new Set(DEFAULT_MENU_TYPES.map((t) => t.typeKey));
  const defaultTypeIndex = new Map(
    DEFAULT_MENU_TYPES.map((t, i) => [t.typeKey, i])
  );

  const typeSortKey = (typeKey: string): number => {
    const override = typeOverrideMap.get(typeKey);
    if (override) return override.position;
    return defaultTypeIndex.get(typeKey) ?? DEFAULT_MENU_TYPES.length;
  };

  const orderedTypeKeys = Array.from(typeKeys).sort(
    (a, b) => typeSortKey(a) - typeSortKey(b) || a.localeCompare(b)
  );

  const types: AdminSidebarType[] = orderedTypeKeys.map((typeKey, index) => {
    const override = typeOverrideMap.get(typeKey);
    const typeEntries = entries.filter((e) => e.typeKey === typeKey);

    // Group by module preserving item order (already globally sorted above).
    const byModule = new Map<string, AdminSidebarItem[]>();
    for (const e of typeEntries) {
      const item: AdminSidebarItem = {
        entryKey: e.entry.entryKey,
        path: e.entry.path,
        labelKey: e.entry.labelKey,
        labelOverride: e.override?.labelOverride ?? null,
        icon: e.entry.icon,
        hidden: e.override?.hidden ?? false,
        position: e.position,
        typeKey,
        moduleKey: e.entry.moduleKey,
        moduleName: e.entry.moduleName,
        requiredPermission: e.entry.requiredPermission,
        requiredPermissionPrefix: e.entry.requiredPermissionPrefix
      };
      const group = byModule.get(e.entry.moduleKey);
      if (group) group.push(item);
      else byModule.set(e.entry.moduleKey, [item]);
    }

    const modules: AdminSidebarModuleGroup[] = Array.from(byModule.entries())
      .map(([moduleKey, items]) => ({
        moduleKey,
        moduleName: items[0]!.moduleName,
        minPosition: Math.min(...items.map((i) => i.position)),
        items
      }))
      .sort(
        (a, b) =>
          a.minPosition - b.minPosition ||
          a.moduleKey.localeCompare(b.moduleKey)
      )
      .map(({ moduleKey, moduleName, items }) => ({
        moduleKey,
        moduleName,
        items
      }));

    return {
      typeKey,
      labelKey: defaultTypeLabelKey(typeKey),
      labelOverride: override?.labelOverride ?? null,
      position: override?.position ?? index,
      hidden: override?.hidden ?? false,
      isCustom: !defaultTypeKeySet.has(typeKey),
      modules
    };
  });

  const availableTypeKeys = orderedTypeKeys.map((typeKey) => ({
    typeKey,
    labelKey: defaultTypeLabelKey(typeKey),
    isCustom: !defaultTypeKeySet.has(typeKey)
  }));

  return { types, availableTypeKeys };
}

// ---------------------------------------------------------------------------
// Writers
// ---------------------------------------------------------------------------

/** Injected audit hook — the route wires `recordAuditEvent`; tests pass a spy. */
export type SidebarConfigAuditHook = (
  tx: Bun.SQL,
  detail: { typeCount: number; itemCount: number }
) => Promise<void>;

/**
 * Replace this tenant's sidebar override rows to match the submitted
 * arrangement (full replace, not a merge — the payload is the complete
 * override set the admin arranged). Idempotent: the same payload applied twice
 * converges on the same rows. Runs entirely inside the caller's tenant
 * transaction, so RLS + the delete/insert are atomic.
 */
export async function saveSidebarConfig(
  tx: Bun.SQL,
  tenantId: string,
  payload: SidebarSavePayload,
  recordAudit: SidebarConfigAuditHook
): Promise<{ typeCount: number; itemCount: number }> {
  await tx`DELETE FROM awcms_micro_sidebar_menu_types WHERE tenant_id = ${tenantId}`;
  await tx`DELETE FROM awcms_micro_sidebar_menu_items WHERE tenant_id = ${tenantId}`;

  for (const type of payload.types) {
    await tx`
      INSERT INTO awcms_micro_sidebar_menu_types
        (tenant_id, type_key, label_override, position, hidden)
      VALUES (${tenantId}, ${type.typeKey}, ${type.labelOverride}, ${type.position}, ${type.hidden})
    `;
  }

  for (const item of payload.items) {
    await tx`
      INSERT INTO awcms_micro_sidebar_menu_items
        (tenant_id, entry_key, type_key, position, label_override, hidden)
      VALUES (${tenantId}, ${item.entryKey}, ${item.typeKey}, ${item.position}, ${item.labelOverride}, ${item.hidden})
    `;
  }

  const detail = {
    typeCount: payload.types.length,
    itemCount: payload.items.length
  };
  await recordAudit(tx, detail);
  return detail;
}

/**
 * Delete ALL of this tenant's sidebar override rows — back to the pure code
 * default. Idempotent (deleting nothing is fine).
 */
export async function resetSidebarConfig(
  tx: Bun.SQL,
  tenantId: string,
  recordAudit: SidebarConfigAuditHook
): Promise<{ typeCount: number; itemCount: number }> {
  await tx`DELETE FROM awcms_micro_sidebar_menu_types WHERE tenant_id = ${tenantId}`;
  await tx`DELETE FROM awcms_micro_sidebar_menu_items WHERE tenant_id = ${tenantId}`;
  const detail = { typeCount: 0, itemCount: 0 };
  await recordAudit(tx, detail);
  return detail;
}

/** Re-export so the route composes the whole flow from one import. */
export {
  buildDefaultSidebarModel,
  validateSidebarMenuInput
} from "../domain/sidebar-menu";
export type { SidebarDefaultEntry } from "../domain/sidebar-menu";
