# SIKESRA Data Preservation

This document tracks issue #137 data-preservation guardrails for the AWCMS-Micro SIKESRA plugin.

## Protected Data Categories

SIKESRA-owned data must remain in dedicated `sikesra_` tables or plugin-owned compatibility collections until the D1 migration issues are implemented.

Protected categories include:

- registry entities and person profiles;
- supporting document metadata and file-object references;
- verification stage state and verification events;
- audit events and actor snapshots;
- import batches, staging rows, and mapping templates;
- export jobs and report decisions;
- RBAC role, permission, matrix, user assignment, and scope data;
- ABAC attribute, subject, resource, and policy data;
- custom attribute definitions and values;
- delete/archive/governance requests.

## Table Ownership

All canonical SIKESRA tables are owned by the plugin. References to EmDash users, external region codes, R2 object keys, or government identifiers are values stored inside SIKESRA-owned tables; they do not transfer ownership to EmDash core or an external system.

| Category              | Tables                                                                                                                                                                                                                                                                                                                                             | Ownership                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Runtime configuration | `sikesra_settings`, `sikesra_data_types`, `sikesra_data_subtypes`, `sikesra_field_standards`                                                                                                                                                                                                                                                       | `owned_by_sikesra`                                                               |
| Region catalogs       | `sikesra_regions`, `sikesra_official_regions`, `sikesra_local_regions`, `sikesra_region_aliases`                                                                                                                                                                                                                                                   | `owned_by_sikesra` with `external_reference` values for official codes           |
| Registry and people   | `sikesra_registry_entities`, `sikesra_person_profiles`, `sikesra_entity_people`, `sikesra_rumah_ibadah_details`, `sikesra_lembaga_keagamaan_details`, `sikesra_pendidikan_keagamaan_details`, `sikesra_lks_details`, `sikesra_guru_agama_details`, `sikesra_anak_yatim_details`, `sikesra_disabilitas_details`, `sikesra_lansia_terlantar_details` | `owned_by_sikesra`                                                               |
| Sequence and history  | `sikesra_code_sequences`, `sikesra_code_history`                                                                                                                                                                                                                                                                                                   | `owned_by_sikesra`                                                               |
| Documents and files   | `sikesra_supporting_documents`, `sikesra_file_objects`                                                                                                                                                                                                                                                                                             | `owned_by_sikesra` with `external_reference` values for R2 object keys/checksums |
| Verification          | `sikesra_verification_stage_state`, `sikesra_verification_events`                                                                                                                                                                                                                                                                                  | `owned_by_sikesra`                                                               |
| Import/export/review  | `sikesra_import_batches`, `sikesra_import_staging_rows`, `sikesra_import_mapping_templates`, `sikesra_duplicate_candidates`, `sikesra_duplicate_decisions`, `sikesra_export_jobs`                                                                                                                                                                  | `owned_by_sikesra`                                                               |
| RBAC and ABAC         | `sikesra_permission_catalog`, `sikesra_role_catalog`, `sikesra_role_permission_assignments`, `sikesra_user_role_assignments`, `sikesra_user_scope_assignments`, `sikesra_abac_attribute_catalog`, `sikesra_abac_subject_assignments`, `sikesra_abac_resource_assignments`, `sikesra_abac_policy_rules`                                             | `owned_by_sikesra`; `emdash_user_id` columns are `reference_to_emdash`           |
| Audit and governance  | `sikesra_audit_events`, `sikesra_custom_attribute_definitions`, `sikesra_custom_attribute_values`, `sikesra_custom_attribute_change_events`, `sikesra_delete_requests`, `sikesra_delete_approvals`, `sikesra_delete_snapshots`, `sikesra_delete_events`                                                                                            | `owned_by_sikesra`                                                               |

## Shared EmDash User References

SIKESRA references EmDash user IDs. It must not duplicate, reset, mutate, or delete EmDash core user records.

Expected user-reference states after rebuild:

```txt
active
inactive
orphaned
unknown
```

Orphaned or inactive references must be reported for review. They must not be deleted automatically.

When an EmDash user role changes, SIKESRA must keep its own role and scope assignments unchanged until an authorized SIKESRA workflow updates them. EmDash global roles may affect authentication or broad admin access, but they must not silently reset `sikesra_user_role_assignments`, `sikesra_user_scope_assignments`, ABAC subject assignments, or historical audit actor snapshots.

## Migration Safety Rules

SIKESRA migrations are data-preserving by default.

## Runtime State D1 Migration

Issue #124 makes dedicated D1 tables the canonical runtime-state storage. Production deployments must provide a D1 binding for these tables and fail closed when the binding is missing:

- `sikesra_settings` stores settings previously held in plugin storage;
- `sikesra_official_regions` stores the official administrative region tree previously held in `custom:regions`;
- `sikesra_local_regions` stores operator-defined local/service region trees previously held in `custom:local-regions`;
- `sikesra_data_types` and `sikesra_data_subtypes` store data type catalogs previously held in `custom:data-types`;
- `sikesra_verification_stage_state` stores verification stage state previously held in plugin storage or `state:sikesraVerificationStages`.

During `plugin:install` and `plugin:activate`, legacy KV/plugin-storage values are copied into the dedicated D1 tables and a `runtime-state.d1-migration` audit event is recorded in `sikesra_audit_events`. KV and plugin storage remain compatibility fallbacks only outside production; production reads and writes for canonical settings, region catalogs, data type catalogs, and verification stage state must use D1 or return a clear D1 binding error instead of writing legacy state.

Required patterns:

```sql
CREATE TABLE IF NOT EXISTS ...
CREATE INDEX IF NOT EXISTS ...
```

Forbidden by default:

```sql
DROP TABLE
DROP COLUMN
DELETE FROM sikesra_...
TRUNCATE
CREATE OR REPLACE TABLE
```

Destructive migration patterns require explicit approval, backup notes, rollback notes, and the marker `awcms-sikesra-allow-destructive-migration` in the migration file.

## Validation Commands

Run from the SIKESRA plugin package:

```bash
pnpm awcms:sikesra:check-d1-prefix
pnpm awcms:sikesra:check-data-boundary
pnpm awcms:sikesra:check-destructive-migrations
pnpm awcms:sikesra:check-user-references
pnpm awcms:sikesra:check-file-links
pnpm awcms:sikesra:backup-inventory
pnpm awcms:sikesra:validate-data-after-rebuild
pnpm test
pnpm typecheck
```

## Implemented Guardrails

- `check-data-boundary` verifies every schema and migration table uses `sikesra_`, every migration table is cataloged, and SIKESRA source does not write to EmDash user tables.
- `check-user-references` verifies role, scope, and ABAC subject tables use `emdash_user_id` references and that SIKESRA does not create duplicate user tables.
- `check-file-links` verifies document metadata tables include file-object links, classification, validation status, checksums, and supporting indexes.
- `backup-inventory` fails if protected SIKESRA D1 tables for registry, documents, verification, import, duplicate review, export, audit, RBAC/ABAC, custom attributes, or delete governance are missing from the schema catalog.
- `validate-data-after-rebuild` runs the data-boundary, destructive-migration, user-reference, file-link, and backup-inventory checks as a post-rebuild safety gate.

These scripts are static/local guards. Production row-count and R2 object checks must use the generated backup inventory plus environment-specific D1/R2 export tooling before high-risk rebuilds.

## Backup Inventory Baseline

Before a migration or rebuild that may affect SIKESRA data, record:

- SIKESRA table list;
- row counts per `sikesra_` table;
- document/file counts;
- user assignment counts;
- audit event counts;
- import batch counts;
- export job counts;
- custom attribute definition, value, and change-event counts;
- permanent-delete request, approval, snapshot, and event counts;
- plugin version;
- EmDash upstream commit/version;
- migration file checksums.

## Snapshot Comparison Baseline

Before and after a high-risk rebuild, compare these values where D1/R2 access is available:

- required table existence;
- row count per protected `sikesra_` table;
- stable-record checksums for representative registry, person, document, verification, audit, RBAC, ABAC, import, export, custom-attribute, and delete-governance rows;
- registry entity count;
- person profile count;
- document metadata count;
- verification event count;
- audit event count;
- user assignment count;
- ABAC policy count;
- import batch count;
- export job count.

## Recovery Rule

If validation detects missing rows, broken references, missing document metadata, or unexpected zero counts after rebuild, stop the migration/rebuild promotion and restore from the latest verified backup before continuing.

Recovery must preserve append-only history. Do not repair audit/history loss by truncating or reseeding `sikesra_audit_events`, `sikesra_verification_events`, `sikesra_code_history`, `sikesra_duplicate_decisions`, or `sikesra_export_jobs`; restore from backup and then apply a forward-only repair migration or administrative correction note.
