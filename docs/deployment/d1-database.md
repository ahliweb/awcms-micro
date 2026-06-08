# D1 Database

## Intended Example Resource

- Database name: `awcms-micro-d1-20260530`
- Database ID: `90a77136-8ad0-4247-bd48-7f728c2c0a0c`
- Binding name in the Cloudflare template: `DB`

## Purpose

- store EmDash application data
- support content, settings, and runtime metadata
- keep database configuration isolated from source-controlled secrets

## Configuration Guidance

- bind the database in `wrangler` as `DB`
- keep committed `database_id` values aligned with the intended example deployment target when the reference template intentionally carries non-secret operational identifiers
- run migrations through the normal EmDash workflow after environment provisioning

## Operational Notes

- document backup strategy before production go-live
- test rollback behavior before changing schema in a live environment
- validate application startup after D1 changes
- latest production sanity check on 2026-06-08 confirmed 41 applied `_emdash_migrations` records
