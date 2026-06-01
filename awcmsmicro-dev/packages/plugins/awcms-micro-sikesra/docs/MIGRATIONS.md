# SIKESRA D1 Migrations

This document tracks the dedicated SIKESRA D1 migration framework from issue #120.

## Location

Migration files live in:

```txt
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/migrations/
```

## Current Migration Set

```txt
0001_sikesra_settings_and_catalog.sql
0002_sikesra_regions.sql
0003_sikesra_registry_core.sql
0004_sikesra_detail_tables.sql
0005_sikesra_documents.sql
0006_sikesra_verification.sql
0007_sikesra_imports.sql
0008_sikesra_deduplication.sql
0009_sikesra_access_abac.sql
0010_sikesra_exports_audit.sql
0011_sikesra_core_region_sources.sql
```

All migration files requested by issue #120 are present. Migration `0011` adds the explicit official/local region source tables requested by issue #123 while preserving the earlier combined `sikesra_regions` compatibility table.

## Seed Files

Seed files live in:

```txt
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/seeds/
```

Current seed files:

```txt
kotawaringin-barat-core.sql
```

Replace `__TENANT_ID__` and `__SITE_ID__` with the target tenant/site values before applying seeds to local or remote D1.

## Migration Rules

- Every SIKESRA table name must start with `sikesra_`.
- Every index name should start with `idx_sikesra_`.
- Every trigger name should start with `trg_sikesra_`.
- Migrations must be forward-only and idempotent.
- Use `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`.
- Do not modify EmDash core tables.
- Do not add destructive SQL without the documented approval marker, backup note, and rollback note from `DATA_PRESERVATION.md`.

## Local D1 Application

Apply a migration to a local D1 database from an app/template that owns the D1 binding:

```bash
wrangler d1 execute <database-name> --local --file awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/migrations/0001_sikesra_settings_and_catalog.sql
```

## Cloudflare D1 Application

Apply to a Cloudflare D1 database after confirming the backup inventory and target environment:

```bash
wrangler d1 execute <database-name> --remote --file awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/migrations/0001_sikesra_settings_and_catalog.sql
```

## Validation

Run from the SIKESRA plugin package:

```bash
pnpm awcms:sikesra:check-d1-prefix
pnpm awcms:sikesra:check-destructive-migrations
pnpm test
pnpm typecheck
```
