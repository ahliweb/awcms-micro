-- Per-tenant admin sidebar menu management (feat/sidebar-menu-management).
--
-- The admin sidebar is a code-derived default (core items + every module's
-- declared `navigation` entries, grouped type -> sub-type(module) -> items).
-- These two tables hold ONLY a tenant's OVERRIDE of that default: reordering,
-- show/hide, label renames, moving an item to a different type, and custom
-- types. Absence of a row = "use the code default" for that type/item, so an
-- untouched tenant renders exactly the code-derived model and nothing here is
-- required for the sidebar to work (`composeSidebarArrangement` applies these
-- rows on top of `buildDefaultSidebarModel()`).
--
-- WHY OVERRIDE ROWS (not a full snapshot): the set of menu items is trusted,
-- reviewed, BUILD-TIME data (`listModules()` navigation + the synthetic core
-- entries) — never tenant-writable. Storing only the tenant's delta means a
-- new module's nav entry, or a relabelled core item, appears automatically for
-- every tenant without a data migration, while a tenant's explicit
-- customization survives. `entry_key` = the nav item's stable `path`
-- (module-composition already forbids path conflicts); core items are keyed by
-- their path too.
--
-- Both tables are tenant-scoped: ENABLE + FORCE ROW LEVEL SECURITY with the
-- standard `tenant_isolation` policy (post-013 convention, mirrors sql/093 and
-- sql/080/085). Tenant A can NEVER read/mutate tenant B's sidebar overrides —
-- RLS is the structural floor under the explicit `tenant_id` filter every
-- query also carries. No worker/purge job touches either table, so (like
-- sql/093) there is no `awcms_micro_worker` GRANT here; the least-privilege
-- `awcms_micro_app` role gets its DML via the migration-013 default privileges.
--
-- Numbering: 094 = schema, 095 = permission seed (same schema-then-permissions
-- split sql/080/081, 085/086, 089/090, 091/092 used). Both filenames are added
-- to `tests/foundation.test.ts`'s hardcoded migration list.

-- ===========================================================================
-- 1. awcms_micro_sidebar_menu_types — per-tenant type (top-level category)
--    overrides + custom types
-- ===========================================================================
-- A row exists only when the tenant has customized a type (relabelled it,
-- reordered it, hidden it) or added a CUSTOM type (a `type_key` not present in
-- the code-default taxonomy). `position` orders types; `label_override` renames
-- a default type or names a custom one; `hidden` removes a whole type (and its
-- items) from the rendered sidebar.
CREATE TABLE IF NOT EXISTS awcms_micro_sidebar_menu_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  type_key text NOT NULL,
  label_override text,
  position integer NOT NULL DEFAULT 0,
  hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT awcms_micro_sidebar_menu_types_type_key_len_check
    CHECK (type_key <> '' AND char_length(type_key) <= 64),
  CONSTRAINT awcms_micro_sidebar_menu_types_label_override_len_check
    CHECK (label_override IS NULL OR char_length(label_override) <= 120),
  -- At most one override row per (tenant, type). `saveSidebarConfig` does a
  -- DELETE-all-then-INSERT full replace of this tenant's rows (not ON CONFLICT
  -- upsert), so this constraint guards against duplicate keys WITHIN a single
  -- submitted payload (validation also rejects those) rather than backing an
  -- upsert clause.
  CONSTRAINT awcms_micro_sidebar_menu_types_tenant_type_key
    UNIQUE (tenant_id, type_key)
);

ALTER TABLE awcms_micro_sidebar_menu_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_sidebar_menu_types FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_sidebar_menu_types_tenant_isolation
  ON awcms_micro_sidebar_menu_types
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- ===========================================================================
-- 2. awcms_micro_sidebar_menu_items — per-tenant item (menu link) overrides
-- ===========================================================================
-- A row exists only when the tenant has customized a specific menu item.
-- `entry_key` = the nav item's stable `path`. `type_key` = the type the item is
-- PLACED under (an override; NULL = keep the item's code-default type).
-- `position` orders the item within its type/module; `label_override` renames
-- it; `hidden` removes just this one item.
CREATE TABLE IF NOT EXISTS awcms_micro_sidebar_menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES awcms_micro_tenants (id),
  entry_key text NOT NULL,
  type_key text,
  position integer NOT NULL DEFAULT 0,
  label_override text,
  hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT awcms_micro_sidebar_menu_items_entry_key_len_check
    CHECK (entry_key <> '' AND char_length(entry_key) <= 256),
  CONSTRAINT awcms_micro_sidebar_menu_items_type_key_len_check
    CHECK (type_key IS NULL OR (type_key <> '' AND char_length(type_key) <= 64)),
  CONSTRAINT awcms_micro_sidebar_menu_items_label_override_len_check
    CHECK (label_override IS NULL OR char_length(label_override) <= 120),
  -- At most one override row per (tenant, entry). Same as the types table: the
  -- save path is a full DELETE-then-INSERT replace, not an upsert, so this
  -- guards intra-payload duplicates. NOTE: the admin island currently persists
  -- an item row for every entry (not only changed ones), so "override rows" is
  -- the stored delta only in the sense that untouched TENANTS have zero rows —
  -- a tenant that has saved once has ~one row per menu item. Compose still
  -- merges code defaults for any entry without a row, so a newly-added module's
  -- menu appears automatically regardless.
  CONSTRAINT awcms_micro_sidebar_menu_items_tenant_entry_key
    UNIQUE (tenant_id, entry_key)
);

-- Composition read path filters by tenant then groups by type — the composite
-- keeps the whole-tenant fetch a single index range scan.
CREATE INDEX IF NOT EXISTS awcms_micro_sidebar_menu_items_tenant_type_idx
  ON awcms_micro_sidebar_menu_items (tenant_id, type_key);

ALTER TABLE awcms_micro_sidebar_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE awcms_micro_sidebar_menu_items FORCE ROW LEVEL SECURITY;

CREATE POLICY awcms_micro_sidebar_menu_items_tenant_isolation
  ON awcms_micro_sidebar_menu_items
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
