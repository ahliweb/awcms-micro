# AWCMS-Micro D1 Mirror Sync

## Purpose

This workflow gives DBeaver a local SQLite file that mirrors the production Cloudflare D1 database for `awcms-micro-d1`.

It is a limited two-way sync model, not a live remote connection.

## How It Works

- Production D1 is exported with `wrangler d1 export --remote`.
- The export is loaded into a local SQLite mirror at `awcmsmicro-dev/.local/d1-mirror/awcms-micro-d1.dbeaver.sqlite`.
- DBeaver connects to that SQLite file.
- `pnpm d1:mirror:sync` merges local mirror edits back to D1 and refreshes the mirror.
- `pnpm d1:mirror:reset` discards the local mirror and rebuilds it from production.

## Access Required

- The script reads the parent repository `.env` automatically when present.
- It maps `CLOUDFLARE_WORKER_D1_DATABASE_ID` to the D1 mirror workflow when needed.
- `wrangler` must already be authenticated to the Cloudflare account that owns `awcms-micro-d1`.
- The account/token needs D1 query access.
- If `wrangler` returns `SQLITE_AUTH`, the local mirror cannot be refreshed until the account access issue is resolved.

## Eligibility Rules

Only tables that meet all of these rules are synced:

- primary key is a single `id` column
- table has `updated_at` or `updatedAt`
- table exists in both local mirror and remote export

## Conflict Rules

- If only one side changed since the last sync, that side wins.
- If both sides changed, the row with the newer `updated_at` wins.
- If timestamps tie or cannot be parsed, production D1 wins.
- Hard deletes are ignored. If a row disappears in DBeaver, the next sync restores it unless the row is represented by a soft-delete field such as `deleted_at`.

## DBeaver Setup

1. Run `pnpm d1:mirror:sync` once to create the mirror.
2. In DBeaver, create a new SQLite connection.
3. Point it at `awcmsmicro-dev/.local/d1-mirror/awcms-micro-d1.dbeaver.sqlite`.
4. Disconnect or close the DBeaver connection before running `pnpm d1:mirror:sync`.
5. After editing rows in DBeaver, run `pnpm d1:mirror:sync` again.

## Commands

- `pnpm d1:mirror:status`
- `pnpm d1:mirror:sync`
- `pnpm d1:mirror:reset`
- `pnpm d1:mirror:watch`

## Watch Mode

Use `pnpm d1:mirror:watch` to auto-run the sync loop every 15 seconds by default.

You can override the interval with:

```bash
node scripts/d1-mirror-sync.mjs watch --interval 30000
```

Watch mode still uses the same conflict rules and still requires DBeaver to disconnect before the sync pass writes the mirror file.

## Limits

- No direct D1 driver is involved.
- Schema drift aborts sync and requires a reset.
- Hard deletes are not propagated automatically.
