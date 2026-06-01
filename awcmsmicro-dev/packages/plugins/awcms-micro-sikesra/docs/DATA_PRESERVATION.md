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

## Migration Safety Rules

SIKESRA migrations are data-preserving by default.

## Runtime State D1 Migration

Issue #124 makes dedicated D1 tables the canonical runtime-state storage when a D1 binding is available:

- `sikesra_settings` stores settings previously held in plugin storage;
- `sikesra_official_regions` stores the official administrative region tree previously held in `custom:regions`;
- `sikesra_local_regions` stores operator-defined local/service region trees previously held in `custom:local-regions`;
- `sikesra_data_types` and `sikesra_data_subtypes` store data type catalogs previously held in `custom:data-types`;
- `sikesra_verification_stage_state` stores verification stage state previously held in plugin storage or `state:sikesraVerificationStages`.

During `plugin:install` and `plugin:activate`, legacy KV/plugin-storage values are copied into the dedicated D1 tables and a `runtime-state.d1-migration` audit event is recorded in `sikesra_audit_events`. KV and plugin storage remain compatibility fallbacks only when D1 access is unavailable; new canonical writes use D1 first and do not write KV when D1 persistence succeeds.

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
- plugin version;
- EmDash upstream commit/version;
- migration file checksums.

## Recovery Rule

If validation detects missing rows, broken references, missing document metadata, or unexpected zero counts after rebuild, stop the migration/rebuild promotion and restore from the latest verified backup before continuing.
