# AWCMS-Micro SIKESRA Plugin

This package is the AWCMS-Micro SIKESRA plugin for EmDash-compatible projects.

SIKESRA is a downstream AWCMS-Micro plugin for social, welfare, religious, institutional, document, verification, audit, import/export, RBAC/ABAC, and public-safe aggregate workflows. It must remain isolated from EmDash core.

## Current Implementation Status

This package currently contains the SIKESRA plugin boundary, admin UI, routes, hooks, storage declarations, fixtures, and reference workflows. The production-grade implementation backlog is tracked through GitHub issues #119 through #140.

The plugin is moving from an earlier example/demo identity into the dedicated SIKESRA identity. New code should use `awcmsMicroSikesraPlugin` once issue #140 is implemented. The old `awcmsMicroExamplePlugin` export may remain only as a temporary deprecated compatibility alias.

## Purpose

- keep SIKESRA-specific governance, registry, verification, access, audit, import/export, document, and ABAC behavior inside an isolated plugin boundary;
- provide an EmDash-compatible SIKESRA plugin without forking or modifying EmDash core;
- use dedicated SIKESRA data boundaries with `sikesra_` table and collection prefixes;
- support future production D1 tables and Cloudflare R2-compatible document metadata;
- preserve SIKESRA data across EmDash updates, dependency reinstalls, workspace rebuilds, local template rebuilds, and Cloudflare rebuilds.

## Source of Truth

Before changing this plugin, read:

```txt
README.md
AGENTS.md
docs/awcms-micro-sikesra-plugin-governance.md
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/IMPLEMENTATION_GOVERNANCE.md
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/TECHNICAL_PRD.md
```

Implementation backlog:

| Issue | Purpose |
| ---: | --- |
| #119 | Dedicated `sikesra_` D1 table and collection naming policy |
| #120 | SIKESRA D1 migration framework |
| #121 | D1 table prefix validation test |
| #122 | D1 repository layer |
| #123 | Core D1 tables for settings, data types, and regions |
| #124 | Migration from KV/plugin storage to dedicated D1 tables |
| #125 | Registry D1 tables for all 8 data modules |
| #126 | Registry list/save route refactor to D1 |
| #127 | D1-backed 20-digit SIKESRA ID sequence service |
| #128 | Verification D1 tables and routes |
| #129 | Document D1 tables and secure R2 metadata workflow |
| #130 | D1-backed staged CSV/XLSX import workflow |
| #131 | Duplicate detection and duplicate decisions |
| #132 | SIKESRA RBAC/ABAC with EmDash user assignment |
| #133 | Canonical D1 audit table and redaction policy |
| #134 | D1 export job and controlled report/export workflow |
| #135 | Standard personal and non-personal fields for all 8 modules |
| #136 | EmDash update/rebuild compatibility guardrails |
| #137 | Data preservation guardrails for update/rebuild safety |
| #138 | Dynamic custom attributes by data type, subtype, entity, or SIKESRA ID |
| #139 | Full CRUD and highest-admin permanent delete governance |
| #140 | Final SIKESRA plugin identity and export name |

## What It Provides Now

- plugin descriptor factory and plugin identity/versioning;
- EmDash registry manifest scaffolding in `emdash-plugin.jsonc`;
- capabilities, allowed hosts, storage declarations, and KV/plugin-storage compatibility conventions;
- plugin-owned storage names prefixed with `sikesra_`;
- audit events stored in the physical D1 table `sikesra_audit_events` where available;
- protected routes plus a public-safe status route;
- lifecycle hooks: install, activate, deactivate, uninstall;
- content hooks: before/after save, before/after delete, after publish, after unpublish;
- media hooks: before upload and after upload;
- cron hook scheduling and state recording;
- page metadata contribution;
- admin pages, dashboard widgets, settings schema, and field widget contribution;
- SIKESRA-grade reference admin screens for registry, verification, documents, import, reports, access, ABAC, and audit;
- admin UI styling using Kumo semantic tokens for readable light/dark mode;
- Portable Text block contribution;
- audit logging and content snapshot examples;
- access-rights catalog with role matrix and effective access preview;
- ABAC policy management with attribute catalogs, policy simulation, and protected demo route;
- SIKESRA-inspired registry fixtures for reference data modeling and public-safe aggregate examples;
- sandbox-compatible server-side entry in `src/sandbox.ts`.

## Core Governance Rules

### Plugin boundary

Keep plugin-owned behavior in this package. Do not move SIKESRA behavior into EmDash core packages.

### D1 table and collection prefix

All SIKESRA-owned D1 tables and plugin storage collections must use the `sikesra_` prefix.

Examples:

```txt
sikesra_registry_entities
sikesra_person_profiles
sikesra_supporting_documents
sikesra_verification_events
sikesra_audit_events
sikesra_user_role_assignments
sikesra_abac_policy_rules
sikesra_custom_attribute_definitions
sikesra_delete_requests
```

### Production data source

Dedicated D1 tables are the target production source of truth once the D1 migration issues are implemented. Plugin storage/KV may be used only as the current compatibility layer, migration source, or temporary fallback.

### EmDash user identity

SIKESRA must reference trusted EmDash users. It must not create a duplicate user system and must not delete or mutate EmDash core user records.

SIKESRA-specific data belongs in SIKESRA tables:

```txt
sikesra_role_catalog
sikesra_permission_catalog
sikesra_user_role_assignments
sikesra_user_scope_assignments
sikesra_abac_policy_rules
```

### Field standards

All personal modules must distinguish KTP address and domicile address:

```txt
alamat_ktp_*
alamat_domisili_*
alamat_domisili_sama_dengan_ktp
```

KTP address and domicile address are sensitive personal data. Public routes must not expose them.

### Public aggregate

Public routes may expose only public-safe aggregate data. Personal, sensitive personal, restricted, raw document, and internal storage data must never be returned from public APIs.

### Delete policy

Soft delete is the default. Permanent delete is exceptional and belongs only to the highest SIKESRA admin workflow defined in issue #139.

### Update/rebuild safety

SIKESRA files, data, D1 tables, R2 metadata, EmDash user references, assignments, ABAC policies, audit events, import staging, custom attributes, and delete governance data must survive EmDash update/rebuild workflows.

## Native And Sandbox Boundaries

- `src/index.ts`: trusted/native plugin entry used when the plugin needs React admin pages, widgets, and field widgets.
- `src/sandbox.ts`: server-side hooks and routes in the standard sandbox-compatible format.
- `src/admin.tsx`: native-only admin UI features.
- `src/runtime.ts`: storage, routes, hooks, manifest, and route wiring.
- `src/navigation.ts`: navigation model and EmDash adaptation.
- `src/permissions.ts`: permission constants and catalog surface.

This separation keeps the server-side behavior portable while making native-only surfaces explicit.

## Safe Enablement

This plugin is intentionally not registered globally in EmDash core. Enable it from project-level configuration through the normal `plugins: []` configuration path.

Local template example after issue #140:

```ts
import { awcmsMicroSikesraPlugin } from "@awcms-micro/plugin-sikesra";

plugins: [
  awcmsMicroSikesraPlugin({ tenantId: "t-local-dev" }),
]
```

During the transition, the old `awcmsMicroExamplePlugin` alias may still exist but should not be used in new code.

## Standalone Usage

1. Copy this folder into its own repository or into a local packages directory in your project.
2. Run `pnpm install` in the plugin repository, or from the workspace root if you placed it inside a pnpm workspace.
3. Run `pnpm build` to produce the `dist/` output.
4. Review `emdash-plugin.jsonc` and ensure production SIKESRA metadata is set before publishing.
5. If you want repository or security metadata in the published manifest, add your own `repo` and `security` fields to `emdash-plugin.jsonc` before publishing.
6. Set `repository` and `homepage` metadata in `package.json` to match the real source location before publishing, including monorepo subdirectory metadata when applicable.
7. Reference the plugin from your EmDash project as a local package or publish it to your own registry.

For an end-to-end standalone site integration example, see `docs/STANDALONE_CONSUMPTION.md`.
For a technical implementation PRD, see `docs/TECHNICAL_PRD.md`.
For release-oriented checks, see `docs/INTERNAL_PUBLISH_CHECKLIST.md`.
For the SIKESRA reference data model and fixtures, see `docs/SIKESRA_REFERENCE_DATA_MODEL.md`.

## Demonstrated Routes And Hooks

- Public route: `public/status`
- Registry routes: `registry/list`, `registry/save`
- Documents routes: `documents/list`, `documents/save`
- Import route: `import/promote`
- Verification routes: `verification/list`, `verification/advance`, `verification/reject`
- Settings routes: `settings/get`, `settings/save`, `regions/get`, `regions/save`, `data-types/get`, `data-types/save`
- Audit routes: `audit/list`
- Access-rights routes: `access/permissions/list`, `access/permissions/save`, `access/roles/list`, `access/roles/save`, `access/users/save`, `access/matrix/get`, `access/matrix/save`, `access/preview`, `access/health`
- ABAC routes: `abac/attributes/list`, `abac/attributes/save`, `abac/subjects/list`, `abac/subjects/save`, `abac/resources/list`, `abac/resources/save`, `abac/policies/list`, `abac/policies/save`, `abac/preview`, `abac/enforce-demo`, `abac/health`
- Dashboard compatibility alias: `dashboard/summary`
- Hooks: lifecycle, content, media, cron, and `page:metadata`

## Access and ABAC Boundaries

The current access-rights and ABAC surfaces are plugin-owned. They must be integrated with trusted EmDash user identity according to issue #132 before being considered production-grade.

Rules:

- do not replace EmDash core authorization globally;
- enforce SIKESRA RBAC/ABAC inside SIKESRA routes;
- store SIKESRA role/scope/ABAC data in `sikesra_` tables;
- audit sensitive decisions;
- explicit deny wins.

## Testing

From this package directory:

```bash
pnpm typecheck
pnpm test
pnpm build
```

After issues #136 and #137 are implemented, also run the SIKESRA guardrail scripts documented in `docs/IMPLEMENTATION_GOVERNANCE.md`.

## License

This package is licensed under the AW Non-Commercial License 1.0. See `LICENSE.md`.
