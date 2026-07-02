# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `34dd430b35032535a972e9ed718c0eacaeae2029`
- Sync date: `2026-06-12T21:58:33Z`
- Operator: `unggul`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

Synced to EmDash `34dd430b` (HEAD, includes 0.19.0 release + `feat(create-emdash): scaffold .env instead of .dev.vars`). Upstream `main` advanced from `ff5855ab` (previous sync, ~0.18.0 era) to `34dd430b` (0.19.0 + 1 commit); `emdash-latest/` refreshed, `awcmsmicro-dev/` rebuilt with all 20 downstream patches replayed (patch `0007-core-vite.patch` context updated for `@vitest/ui` `^4.1.7` → `^4.1.8` bump). All tests pass.

2026-07-02 audit update: the local synchronized snapshot remains EmDash `0.19.0` at `34dd430b35032535a972e9ed718c0eacaeae2029`; upstream `emdash-cms/emdash` currently reports `main` at `90ffe40a1a31193b2f29ef92202e4f339a2487fa` and latest visible tag `emdash@0.26.0` (`8eff4d578a4c03d57f5039b1709790464eafffe7`). This is a pending upstream-sync gap tracked in GitHub issue #220. Do not deploy a new production version as "fully synchronized" until the 0.26.0-era sync has been planned, rebuilt, validated, and smoke-tested.

## Key Changes in This Sync

- **EmDash 0.19.0** — key upstream changes:
  - **Scheduled publishing heartbeat fix**: `publishDueContent` sweep replaces `PiggybackScheduler`; scheduled content now actually transitions to `published`. AWCMS-Micro templates already have correct `worker.ts` and `wrangler.jsonc`. See issue #205 for post-deploy verification.
  - **`getEntriesByByline()`**: new helper for author archive pages. `getEmDashCollection` also accepts `where: { byline: translationGroup }`. See issue #204.
  - **Responsive srcset for media**: automatic through Astro image service — no template changes required.
  - **Admin content list filtering**: `authorId`, `dateField`, `dateFrom`, `dateTo` params; new `/authors` endpoint.
  - **`RelationRepository`** data layer for content references (foundation only, no field/API/UI yet).
  - **Bug fixes**: `getTaxonomyTerms()` description for flat taxonomies; seed CLI `defaultLocale`; taxonomy term hydration uses entry's resolved locale.
  - **`create-emdash` scaffold**: HEAD adds `.env` instead of `.dev.vars` for new Cloudflare projects.
- **Patch 0007-core-vite.patch** context updated: `@vitest/ui` bump `^4.1.7` → `^4.1.8` required context line update.
- Migration 043 (`_emdash_relations` + `_emdash_content_references`) was already applied in production from the previous sync (present at `ff5855ab`). Not a new apply in this sync.
- Production D1 backup completed before sync: `r2://awcms-micro-backups/backups/db/pre-0.19.0-sync/backup-20260613-045751.sql.enc`
- GitHub issues #204 (author archive pages) and #205 (scheduled publishing verification) created.

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| Upstream fetch into `emdash-latest/` | Passed | Refreshed from upstream EmDash `main` at `34dd430b` |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | Rebuilt via `update-awcmsmicro-dev.sh`; 20 patches replayed; 0007 context updated |
| Validation script execution | Passed | See `LAST_VALIDATION.md` |
| SIKESRA compatibility validation | Passed | `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:validate-after-emdash-sync` passed |
| AWCMS-Micro Node template validation | Passed | 2026-07-02: `pnpm --dir awcmsmicro-dev/templates/awcms-micro-default typecheck` and `pnpm --dir awcmsmicro-dev/templates/awcms-micro-default test` passed |
| AWCMS-Micro Cloudflare template validation | Passed | 2026-07-02: `pnpm --dir awcmsmicro-dev/templates/awcms-micro-default-cloudflare test`, `build`, and `wrangler deploy --dry-run` passed |
| Cloudflare production deployment | Passed | Deployed 2026-06-13; Version ID `0ef03174-32c5-46c7-9fbe-51b3adc8fa5b`; route `awcms-micro.ahlikoding.com/*`; schedule `* * * * *` active |
| Cloudflare post-deploy smoke checks | Passed | `/`, `/posts`, `/news`, `/about`, `/sitemap.xml`, `/id`, `/id/posts`, `/services` all return 200 |
| Scheduled publishing post-deploy verification | Pending | See issue #205 — schedule a test post and confirm it auto-publishes |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific plugin and template additions.
- Validation passes on this host with `EMDASH_WORKERD_PLUGIN_PORT_BASE=28000` exported by `scripts/validate-awcmsmicro-dev.sh`.
- Migration 043 (`_emdash_content_references` and `_emdash_relations`) is already applied in production from the 0.18.0 sync. No migration action needed for this deploy.
- The `@emdash-cms/cloudflare/worker` entry point requires `"triggers": { "crons": ["* * * * *"] }` in `wrangler.jsonc` — already present in AWCMS-Micro templates.
- Any accepted downstream divergence must be logged in `DIVERGENCE_LOG.md`.
- 2026-07-02 protection audit added patch overlays for Forms admin search/pagination and Flue review Hono, aligned protected-path docs with the active allowlist, removed committed Vitest screenshot artifacts, fixed default-template author/sitemap type compatibility, and verified `bash scripts/validate-awcmsmicro-boundaries.sh` plus `bash scripts/validate-awcmsmicro-dev.sh`.
