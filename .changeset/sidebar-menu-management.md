---
"awcms-micro": minor
---

feat(ui): per-tenant admin sidebar menu management

The admin sidebar is now grouped **type → sub-type (module) → items** and is
fully configurable per tenant. A new admin screen (`/admin/sidebar-menu`, gated
on `module_management.navigation.read`, save/reset on the new high-risk
`module_management.navigation.configure`) lets an admin reorder types/modules/
items, show/hide, rename labels (override), move an item to a different type,
add custom types, and reset to the code default. Core items (Dashboard, Access
& Users, Sync, Settings, Profile) are brought into the same model under the
synthetic `core` module / `system` type while preserving their existing
permission gating. Config is per-tenant (RLS FORCE + `tenant_isolation` on the
new `awcms_micro_sidebar_menu_types`/`_items` tables, migrations 094/095). The
sidebar composition (`GET`/`PUT /api/v1/navigation/sidebar-config` +
`.../reset`) replaces the old flat rendering in `AdminLayout`, which falls back
to the previous flat list on any error so an admin is never locked out.
