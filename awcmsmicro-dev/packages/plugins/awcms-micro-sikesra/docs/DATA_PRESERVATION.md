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
pnpm awcms:sikesra:check-destructive-migrations
pnpm awcms:sikesra:backup-inventory
pnpm test
pnpm typecheck
```

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
