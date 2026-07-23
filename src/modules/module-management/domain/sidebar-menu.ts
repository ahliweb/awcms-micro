/**
 * Per-tenant sidebar menu model (feat/sidebar-menu-management). Pure
 * composition/validation logic — no I/O. The application layer
 * (`application/sidebar-menu-config.ts`) reads the override rows + the tenant's
 * disabled-module set and hands them here alongside `buildDefaultSidebarModel()`.
 *
 * The admin sidebar is grouped THREE levels deep:
 *   type (top-level category, e.g. "content") ->
 *     sub-type (the owning MODULE, e.g. "blog_content") ->
 *       items (that module's nav links, ordered)
 *
 * The set of items is trusted BUILD-TIME data — the synthetic core entries
 * below plus every module's declared `navigation` (`listModules()`). A tenant
 * can only OVERRIDE this default (reorder, hide, relabel, move an item to a
 * different type, add a custom type); it can never inject an arbitrary link.
 * `entryKey` = the nav item's stable `path` (module-composition forbids path
 * conflicts). Core items are keyed by their path too and share the synthetic
 * module key `"core"`, default type `"system"`.
 *
 * Like `domain/navigation-registry.ts`, navigation filtering here is NOT
 * authorization — every target page/API still enforces its own server-side
 * guard regardless of whether a link to it is visible.
 */
import type {
  ModuleDescriptor,
  ModuleLifecycleStatus
} from "../../_shared/module-contract";

export const MODULE_MANAGEMENT_MODULE_KEY = "module_management";
export const NAVIGATION_ACTIVITY_CODE = "navigation";
export const NAVIGATION_READ_ACTION = "read";
export const NAVIGATION_CONFIGURE_ACTION = "configure";

/** Synthetic module key for the core (always-present, non-module) admin items. */
export const CORE_MODULE_KEY = "core";
/** Fallback type for any entry whose module isn't in `DEFAULT_MODULE_TYPE` and whose nav entry declares no `group`. */
export const DEFAULT_FALLBACK_TYPE = "general";

/** Bounds mirrored from sql/094's CHECK constraints — validated before a write ever reaches the DB. */
export const MAX_TYPE_KEY_LENGTH = 64;
export const MAX_ENTRY_KEY_LENGTH = 256;
export const MAX_LABEL_OVERRIDE_LENGTH = 120;
/** Coarse ceiling on how many rows a single save may submit (defense against a pathological payload). */
export const MAX_SIDEBAR_ROWS = 500;

/** A valid custom type key: lowercase slug (letters/digits/underscore), so it can never collide structurally with a code type or smuggle markup. */
const TYPE_KEY_RE = /^[a-z0-9_]+$/;

/**
 * The ordered default type taxonomy. Order here IS the default type ordering
 * (a type with no override renders at its index below). `system` holds the
 * core items; `general` is the fallback bucket. `commerce` is reserved for the
 * in-scope online-store extension direction (ADR-0034) — it simply renders
 * empty until a commerce module declares nav.
 */
export const DEFAULT_MENU_TYPES: readonly {
  typeKey: string;
  labelKey: string;
}[] = [
  { typeKey: "system", labelKey: "admin.menu_type.system" },
  { typeKey: "content", labelKey: "admin.menu_type.content" },
  { typeKey: "commerce", labelKey: "admin.menu_type.commerce" },
  { typeKey: "engagement", labelKey: "admin.menu_type.engagement" },
  { typeKey: "operations", labelKey: "admin.menu_type.operations" },
  { typeKey: "identity", labelKey: "admin.menu_type.identity" },
  { typeKey: "general", labelKey: "admin.menu_type.general" }
];

const DEFAULT_TYPE_INDEX = new Map(
  DEFAULT_MENU_TYPES.map((type, index) => [type.typeKey, index])
);

/** i18n label key for a default type, or `undefined` for a custom type (its label is the override). */
export function defaultTypeLabelKey(typeKey: string): string | undefined {
  return DEFAULT_MENU_TYPES.find((type) => type.typeKey === typeKey)?.labelKey;
}

/**
 * Default type placement per module key — so modules land in sensible types
 * WITHOUT editing every module.ts. A module absent here falls back to the nav
 * entry's own `group`, then `general`. Keys are the live `listModules()` keys.
 */
export const DEFAULT_MODULE_TYPE: Readonly<Record<string, string>> = {
  // System / platform administration.
  module_management: "system",
  tenant_admin: "system",
  tenant_domain: "system",
  theming: "system",
  seo_distribution: "system",
  site_search: "system",
  email: "system",
  form_drafts: "system",
  logging: "system",
  // Content authoring & media.
  blog_content: "content",
  news_portal: "content",
  media_library: "content",
  // Audience engagement.
  comments: "engagement",
  newsletter: "engagement",
  social_publishing: "engagement",
  // Operations / observability.
  reporting: "operations",
  visitor_analytics: "operations",
  sync_storage: "operations",
  data_lifecycle: "operations",
  domain_event_runtime: "operations",
  // Identity.
  identity_access: "identity",
  profile_identity: "identity"
};

/**
 * The synthetic core admin items — always present, not owned by any module.
 * Their permission gating is a PREFIX match preserved from `AdminLayout.astro`
 * (Access & Users needs any `identity_access.*`, Sync needs any
 * `sync_storage.*`); Dashboard/Settings/Profile are ungated.
 */
export const CORE_NAV_ENTRIES: readonly {
  entryKey: string;
  path: string;
  labelKey: string;
  defaultOrder: number;
  requiredPermissionPrefix?: string;
}[] = [
  {
    entryKey: "/admin",
    path: "/admin",
    labelKey: "admin.layout.nav_dashboard",
    defaultOrder: 0
  },
  {
    entryKey: "/admin/access-users",
    path: "/admin/access-users",
    labelKey: "admin.layout.nav_access_users",
    defaultOrder: 10,
    requiredPermissionPrefix: "identity_access."
  },
  {
    entryKey: "/admin/sync",
    path: "/admin/sync",
    labelKey: "admin.layout.nav_sync",
    defaultOrder: 20,
    requiredPermissionPrefix: "sync_storage."
  },
  {
    entryKey: "/admin/settings",
    path: "/admin/settings",
    labelKey: "admin.layout.nav_settings",
    defaultOrder: 30
  },
  {
    entryKey: "/admin/profile",
    path: "/admin/profile",
    labelKey: "admin.layout.nav_profile",
    defaultOrder: 40
  }
];

/** A single default (code-derived) menu entry, before any tenant override. */
export interface SidebarDefaultEntry {
  entryKey: string;
  path: string;
  /** Sub-type = owning module key; `"core"` for the synthetic core items. */
  moduleKey: string;
  /** Human module name (from the descriptor), or a fixed label for core. */
  moduleName: string;
  /** Default type (top-level category) this entry lands under. */
  typeKey: string;
  labelKey: string;
  icon?: string;
  defaultOrder: number;
  /** Exact permission key required (module nav entries). */
  requiredPermission?: string;
  /** Prefix permission gate (core items only — any granted key starting with this). */
  requiredPermissionPrefix?: string;
}

export interface SidebarTypeOverride {
  typeKey: string;
  labelOverride: string | null;
  position: number;
  hidden: boolean;
}

export interface SidebarItemOverride {
  entryKey: string;
  /** Type the item is placed under; `null` = keep the entry's default type. */
  typeKey: string | null;
  position: number;
  labelOverride: string | null;
  hidden: boolean;
}

export interface ComposeOptions {
  grantedPermissionKeys: ReadonlySet<string>;
  tenantDisabledModuleKeys: ReadonlySet<string>;
}

/** A composed, render-ready entry (already permission/visibility filtered). */
export interface ComposedEntry {
  entryKey: string;
  path: string;
  labelKey: string;
  labelOverride?: string;
  icon?: string;
  requiredPermission?: string;
}

/** A module (sub-type) group within a type. */
export interface ComposedModuleGroup {
  moduleKey: string;
  moduleName: string;
  entries: ComposedEntry[];
}

/** A top-level type section. Label = `labelOverride ?? t(labelKey) ?? typeKey` (caller resolves). */
export interface ComposedType {
  typeKey: string;
  labelKey?: string;
  labelOverride?: string;
  items: ComposedModuleGroup[];
}

export interface ComposedSidebar {
  types: ComposedType[];
}

/**
 * Build the ordered default sidebar model from the trusted code registry: the
 * synthetic core items first, then every module's declared `navigation`
 * entries. Globally `disabled` module nav is dropped entirely (same rule as
 * `filterVisibleNavigationEntries`); the tenant-level disable is applied later
 * in `composeSidebarArrangement`.
 */
export function buildDefaultSidebarModel(
  modules: readonly ModuleDescriptor[]
): SidebarDefaultEntry[] {
  const entries: SidebarDefaultEntry[] = CORE_NAV_ENTRIES.map((core) => ({
    entryKey: core.entryKey,
    path: core.path,
    moduleKey: CORE_MODULE_KEY,
    moduleName: CORE_MODULE_KEY,
    typeKey: "system",
    labelKey: core.labelKey,
    defaultOrder: core.defaultOrder,
    requiredPermissionPrefix: core.requiredPermissionPrefix
  }));

  for (const descriptor of modules) {
    const disabledStatus: ModuleLifecycleStatus = "disabled";
    if (descriptor.status === disabledStatus) {
      continue;
    }
    for (const nav of descriptor.navigation ?? []) {
      entries.push({
        entryKey: nav.path,
        path: nav.path,
        moduleKey: descriptor.key,
        moduleName: descriptor.name,
        typeKey:
          DEFAULT_MODULE_TYPE[descriptor.key] ??
          nav.group ??
          DEFAULT_FALLBACK_TYPE,
        labelKey: nav.labelKey,
        icon: nav.icon,
        defaultOrder: nav.order ?? 0,
        requiredPermission: nav.requiredPermission
      });
    }
  }

  return entries;
}

function itemPassesPermission(
  entry: SidebarDefaultEntry,
  granted: ReadonlySet<string>
): boolean {
  if (entry.requiredPermission && !granted.has(entry.requiredPermission)) {
    return false;
  }
  if (entry.requiredPermissionPrefix) {
    for (const key of granted) {
      if (key.startsWith(entry.requiredPermissionPrefix)) return true;
    }
    return false;
  }
  return true;
}

/**
 * Apply the tenant's item + type overrides on top of the default model, filter
 * out everything the caller must not see (hidden items/types, permission-gated
 * items the caller lacks, tenant-disabled modules), then GROUP into the
 * type -> module -> items tree. The core module (`"core"`) is never
 * tenant-disabled and never permission-prefix-hidden as a whole.
 */
export function composeSidebarArrangement(
  defaultEntries: readonly SidebarDefaultEntry[],
  typeOverrideRows: readonly SidebarTypeOverride[],
  itemOverrideRows: readonly SidebarItemOverride[],
  options: ComposeOptions
): ComposedSidebar {
  const itemOverrides = new Map(
    itemOverrideRows.map((row) => [row.entryKey, row])
  );
  const typeOverrides = new Map(
    typeOverrideRows.map((row) => [row.typeKey, row])
  );

  // 1. Effective, visible entries with their resolved (type, position, label).
  type Effective = {
    entry: SidebarDefaultEntry;
    typeKey: string;
    position: number;
    labelOverride?: string;
  };
  const effective: Effective[] = [];

  for (const entry of defaultEntries) {
    const override = itemOverrides.get(entry.entryKey);
    if (override?.hidden) continue;
    if (!itemPassesPermission(entry, options.grantedPermissionKeys)) continue;
    if (
      entry.moduleKey !== CORE_MODULE_KEY &&
      options.tenantDisabledModuleKeys.has(entry.moduleKey)
    ) {
      continue;
    }

    const typeKey = override?.typeKey ?? entry.typeKey;
    // A type hidden by override removes all its items from the rendered tree.
    if (typeOverrides.get(typeKey)?.hidden) continue;

    effective.push({
      entry,
      typeKey,
      position: override?.position ?? entry.defaultOrder,
      labelOverride: override?.labelOverride ?? undefined
    });
  }

  // 2. Bucket by type, then by module (sub-type).
  const byType = new Map<string, Effective[]>();
  for (const eff of effective) {
    const bucket = byType.get(eff.typeKey);
    if (bucket) bucket.push(eff);
    else byType.set(eff.typeKey, [eff]);
  }

  const typeSortKey = (typeKey: string): number => {
    const override = typeOverrides.get(typeKey);
    if (override) return override.position;
    const idx = DEFAULT_TYPE_INDEX.get(typeKey);
    return idx ?? DEFAULT_MENU_TYPES.length;
  };

  const orderedTypeKeys = Array.from(byType.keys()).sort((a, b) => {
    const diff = typeSortKey(a) - typeSortKey(b);
    return diff !== 0 ? diff : a.localeCompare(b);
  });

  const types: ComposedType[] = [];
  for (const typeKey of orderedTypeKeys) {
    const bucket = byType.get(typeKey)!;

    // Group by module, ordered by the module's minimum item position.
    const byModule = new Map<string, Effective[]>();
    for (const eff of bucket) {
      const group = byModule.get(eff.entry.moduleKey);
      if (group) group.push(eff);
      else byModule.set(eff.entry.moduleKey, [eff]);
    }

    const moduleGroups: ComposedModuleGroup[] = Array.from(byModule.entries())
      .map(([moduleKey, groupEntries]) => {
        const sorted = [...groupEntries].sort(
          (a, b) =>
            a.position - b.position ||
            a.entry.defaultOrder - b.entry.defaultOrder ||
            a.entry.path.localeCompare(b.entry.path)
        );
        return {
          moduleKey,
          moduleName: sorted[0]!.entry.moduleName,
          minPosition: Math.min(...sorted.map((eff) => eff.position)),
          entries: sorted.map<ComposedEntry>((eff) => ({
            entryKey: eff.entry.entryKey,
            path: eff.entry.path,
            labelKey: eff.entry.labelKey,
            labelOverride: eff.labelOverride,
            icon: eff.entry.icon,
            requiredPermission: eff.entry.requiredPermission
          }))
        };
      })
      .sort(
        (a, b) =>
          a.minPosition - b.minPosition ||
          a.moduleKey.localeCompare(b.moduleKey)
      )
      .map(({ moduleKey, moduleName, entries }) => ({
        moduleKey,
        moduleName,
        entries
      }));

    const typeOverride = typeOverrides.get(typeKey);
    types.push({
      typeKey,
      labelKey: defaultTypeLabelKey(typeKey),
      labelOverride: typeOverride?.labelOverride ?? undefined,
      items: moduleGroups
    });
  }

  return { types };
}

// ---------------------------------------------------------------------------
// Save-payload validation
// ---------------------------------------------------------------------------

export interface SidebarSavePayload {
  types: SidebarTypeOverride[];
  items: SidebarItemOverride[];
}

export type ValidationResult =
  { ok: true; value: SidebarSavePayload } | { ok: false; errors: string[] };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeLabelOverride(
  value: unknown,
  errors: string[],
  label: string
): string | null | undefined {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") {
    errors.push(`${label} must be a string.`);
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length > MAX_LABEL_OVERRIDE_LENGTH) {
    errors.push(
      `${label} exceeds the ${MAX_LABEL_OVERRIDE_LENGTH}-character limit.`
    );
    return undefined;
  }
  return trimmed;
}

function normalizePosition(
  value: unknown,
  errors: string[],
  label: string
): number | undefined {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    errors.push(`${label} must be a non-negative integer.`);
    return undefined;
  }
  return value;
}

/**
 * Validate a save payload against the default model. Rejects: unknown entry
 * keys (an item override may only target an entry that exists in the code
 * model — a custom TYPE row is fine, a custom ITEM is not), malformed/oversized
 * custom type keys, oversized label overrides, non-integer positions,
 * duplicate type/entry keys, item type_keys that reference neither a default
 * nor a submitted custom type, and pathologically large payloads.
 */
export function validateSidebarMenuInput(
  raw: unknown,
  defaultEntries: readonly SidebarDefaultEntry[]
): ValidationResult {
  const errors: string[] = [];

  if (!isPlainObject(raw)) {
    return { ok: false, errors: ["Payload must be an object."] };
  }

  const rawTypes = raw.types;
  const rawItems = raw.items;
  if (!Array.isArray(rawTypes) || !Array.isArray(rawItems)) {
    return {
      ok: false,
      errors: ["Payload must have `types` and `items` arrays."]
    };
  }
  if (rawTypes.length + rawItems.length > MAX_SIDEBAR_ROWS) {
    return { ok: false, errors: ["Too many rows in a single save."] };
  }

  const knownEntryKeys = new Set(defaultEntries.map((e) => e.entryKey));
  const defaultTypeKeys = new Set(DEFAULT_MENU_TYPES.map((t) => t.typeKey));

  const types: SidebarTypeOverride[] = [];
  const seenTypeKeys = new Set<string>();
  const submittedTypeKeys = new Set<string>();

  for (const [index, rawType] of rawTypes.entries()) {
    if (!isPlainObject(rawType)) {
      errors.push(`types[${index}] must be an object.`);
      continue;
    }
    const typeKey = rawType.typeKey;
    if (typeof typeKey !== "string" || !TYPE_KEY_RE.test(typeKey)) {
      errors.push(
        `types[${index}].typeKey must be a lowercase slug (a-z, 0-9, _).`
      );
      continue;
    }
    if (typeKey.length > MAX_TYPE_KEY_LENGTH) {
      errors.push(`types[${index}].typeKey exceeds the length limit.`);
      continue;
    }
    if (seenTypeKeys.has(typeKey)) {
      errors.push(`Duplicate type key "${typeKey}".`);
      continue;
    }
    seenTypeKeys.add(typeKey);
    submittedTypeKeys.add(typeKey);

    const labelOverride = normalizeLabelOverride(
      rawType.labelOverride,
      errors,
      `types[${index}].labelOverride`
    );
    const position = normalizePosition(
      rawType.position,
      errors,
      `types[${index}].position`
    );
    if (typeof rawType.hidden !== "boolean") {
      errors.push(`types[${index}].hidden must be a boolean.`);
    }
    if (labelOverride === undefined || position === undefined) continue;

    types.push({
      typeKey,
      labelOverride,
      position,
      hidden: rawType.hidden === true
    });
  }

  const items: SidebarItemOverride[] = [];
  const seenEntryKeys = new Set<string>();

  for (const [index, rawItem] of rawItems.entries()) {
    if (!isPlainObject(rawItem)) {
      errors.push(`items[${index}] must be an object.`);
      continue;
    }
    const entryKey = rawItem.entryKey;
    if (typeof entryKey !== "string" || entryKey.length === 0) {
      errors.push(`items[${index}].entryKey is required.`);
      continue;
    }
    if (!knownEntryKeys.has(entryKey)) {
      errors.push(`Unknown menu entry "${entryKey}".`);
      continue;
    }
    if (seenEntryKeys.has(entryKey)) {
      errors.push(`Duplicate entry key "${entryKey}".`);
      continue;
    }
    seenEntryKeys.add(entryKey);

    let typeKey: string | null = null;
    if (rawItem.typeKey !== undefined && rawItem.typeKey !== null) {
      if (
        typeof rawItem.typeKey !== "string" ||
        !TYPE_KEY_RE.test(rawItem.typeKey) ||
        rawItem.typeKey.length > MAX_TYPE_KEY_LENGTH
      ) {
        errors.push(
          `items[${index}].typeKey must be a lowercase slug (a-z, 0-9, _).`
        );
        continue;
      }
      if (
        !defaultTypeKeys.has(rawItem.typeKey) &&
        !submittedTypeKeys.has(rawItem.typeKey)
      ) {
        errors.push(
          `items[${index}].typeKey "${rawItem.typeKey}" is neither a default nor a submitted custom type.`
        );
        continue;
      }
      typeKey = rawItem.typeKey;
    }

    const labelOverride = normalizeLabelOverride(
      rawItem.labelOverride,
      errors,
      `items[${index}].labelOverride`
    );
    const position = normalizePosition(
      rawItem.position,
      errors,
      `items[${index}].position`
    );
    if (typeof rawItem.hidden !== "boolean") {
      errors.push(`items[${index}].hidden must be a boolean.`);
    }
    if (labelOverride === undefined || position === undefined) continue;

    items.push({
      entryKey,
      typeKey,
      position,
      labelOverride,
      hidden: rawItem.hidden === true
    });
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, value: { types, items } };
}
