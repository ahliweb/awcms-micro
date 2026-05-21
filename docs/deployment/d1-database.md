# D1 Database

## Intended Example Resource

- Database name: `awcms-micro-d1`

## Purpose

- store EmDash application data
- support content, settings, and runtime metadata
- keep database configuration isolated from source-controlled secrets

## Configuration Guidance

- bind the database in `wrangler` as `DB`
- keep production `database_id` values outside committed docs when possible
- run migrations through the normal EmDash workflow after environment provisioning

## Operational Notes

- document backup strategy before production go-live
- test rollback behavior before changing schema in a live environment
- validate application startup after D1 changes
