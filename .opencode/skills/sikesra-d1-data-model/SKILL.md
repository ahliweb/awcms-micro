---
name: sikesra-d1-data-model
description: SIKESRA D1 data model and repository work. Use when implementing SIKESRA migrations, sikesra_ tables, repositories, field standards, 8 module registry tables, 20-digit IDs, custom attributes, data preservation, or D1 tests.
---

# SIKESRA D1 Data Model

Use this skill for SIKESRA D1 migrations, schema design, repositories, field standards, 8-module registry storage, custom attributes, 20-digit ID sequences, and data-preservation tests.

## Required Sources

Read these before changing SIKESRA database or repository code:

1. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/TECHNICAL_PRD.md`.
2. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/IMPLEMENTATION_GOVERNANCE.md`.
3. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/MERMAID_DIAGRAMS.md`.
4. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/MIGRATIONS.md`.
5. `.opencode/skills/database-d1-postgres/SKILL.md` for general SQL, D1, SQLite, PostgreSQL, and migration guardrails.
6. `awcmsmicro-dev/AGENTS.md` for EmDash database safety rules.

## Naming Boundary

- Every SIKESRA-owned production D1 table and plugin collection must start with `sikesra_`.
- Do not create unprefixed SIKESRA tables.
- Do not store SIKESRA canonical production data in EmDash core tables.
- Do not rely on generic plugin storage as the production source of truth after the related D1 migration work is implemented.
- Keep plugin storage/KV only as compatibility, fallback, migration source, or local prototype where the current issue permits it.

## Required Table Categories

The target D1 model must cover:

- settings and catalogs;
- regions and custom regions;
- data types and subtypes;
- field standards;
- registry entities;
- person profiles;
- 8 module detail tables;
- 20-digit ID sequences and history;
- documents and file metadata;
- verification state and events;
- import batches and staging rows;
- duplicate candidates and decisions;
- export jobs;
- audit events;
- RBAC and ABAC configuration;
- custom attributes and values;
- lifecycle governance records.

## Minimum Business Columns

Every business table must be tenant-ready and site-ready with at least:

```txt
tenant_id
site_id
created_at
updated_at
created_by
updated_by
```

Normal reads must scope by `tenant_id` and `site_id` and exclude `deleted_at IS NOT NULL` unless the workflow explicitly reads archived/deleted records.

## Eight Core Modules

Support these modules:

```txt
rumah_ibadah
lembaga_keagamaan
pendidikan_keagamaan
lks
anak_yatim
lansia_terlantar
```

Personal/sensitive modules should normalize person data into `sikesra_person_profiles` where appropriate.

## Field Standard

Every field must define:

```txt
key
label
module
fieldGroup
dataClass
required
dataType
storageTable
importable
exportable
publicSafe
maskByDefault
validationRules
```

Valid `dataClass` values:

```txt
non_personal
personal
sensitive_personal
restricted
```

Personal modules must distinguish KTP and domicile address fields. KTP and domicile address fields are sensitive personal data and must never be public-safe.

## Custom Attributes

Custom attributes extend fixed fields without replacing them.

Required tables:

```txt
sikesra_custom_attribute_definitions
sikesra_custom_attribute_values
sikesra_custom_attribute_change_events
```

Rules:

- custom attributes must not override protected fields such as `id`, `tenant_id`, `site_id`, `sikesra_id_20`, `verification_stage`, `created_at`, or `updated_at`;
- custom values must stay separate from fixed fields;
- sensitive custom attributes must be masked by default;
- custom attributes must support scope boundaries from the PRD and survive rebuilds.

## Migration And Repository Rules

- Migrations must be forward-safe and data-preserving.
- Prefer `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`.
- Keep the static migration registry updated for Workers bundling compatibility.
- Update `docs/MIGRATIONS.md` when adding migrations.
- Repository functions must be the only direct access point for SIKESRA business tables.
- Route handlers must not scatter raw D1 access.
- Repositories return internal models; serializers return public-safe or admin-safe DTOs.

## Validation

- `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:check-d1-prefix`
- `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:check-data-boundary`
- `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:check-destructive-migrations`
- `pnpm --filter @awcms-micro/plugin-sikesra test`
- `pnpm --filter @awcms-micro/plugin-sikesra typecheck`
- `bash scripts/validate-awcmsmicro-boundaries.sh`
