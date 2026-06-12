# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `ff5855ab41ef8a5417889ac123a7cbd82c9fa3fa`
- Sync date: `2026-06-12T14:08:17Z`
- Operator: `unggul`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

Synced to EmDash `ff5855ab`. Upstream `main` advanced 20 commits (0.17.2 → 0.18.0) since the previous sync at `1986dd4`; `emdash-latest/` refreshed from upstream, `awcmsmicro-dev/` rebuilt with all downstream patches replayed (0016-cloudflare-astro.patch updated for new peerDependency context), downstream lint errors fixed, all tests pass.

## Key Changes in This Sync

- **EmDash 0.18.0** — 20 new upstream commits including:
  - **Migration 043**: `_emdash_relations` and `_emdash_content_references` tables (content references schema, additive, auto-runs on boot)
  - **Scheduled publishing driver** (`packages/cloudflare/src/worker.ts`): new `@emdash-cms/cloudflare/worker` export for cron-triggered publishing with edge-cache invalidation
  - **D1 batch coalescing** (`packages/cloudflare/src/db/coalescing-d1.ts`): opt-in coalescing of same-turn SELECTs into one D1 `batch()` round trip
  - **Cold-boot parallelization**: plugin context init phases now run concurrently
  - **Init lock reclaimable** (`packages/core/src/utils/init-lock.ts`): prevents isolate-poisoning deadlock on serverless
  - **Stream-end metrics** (`packages/core/src/astro/middleware/stream-end-metrics.ts`)
  - **TaxonomyTerm hydration**: terms now attached directly to entries (`entry.data.terms`)
  - i18n updates: French (~100 keys), zh-CN (82 keys), Indonesian byline schema admin
  - Admin fixes: SEO panel draft flush, taxonomy dialog scroll, prosemirror nested list levels, content edit route locale preservation
  - Image loading hints in demo `[slug].astro` pages
- Downstream patch `0016-cloudflare-astro.patch` updated to match new cloudflare package.json context (added `@astrojs/cloudflare` peerDependency line)
- AWCMS-Micro template `src/worker.ts` updated to adopt `@emdash-cms/cloudflare/worker` (closes #201)
- `wrangler.jsonc` updated with `triggers.crons: ["* * * * *"]` for scheduled publishing
- Both template `emdash-env.d.ts` updated: added `TaxonomyTerm` import and `terms?` field to all collection interfaces
- Lint fixes: `e18e(prefer-array-to-sorted)` and `e18e(prefer-static-regex)` resolved in both templates
- GitHub issues #201 (Cloudflare worker scheduled publishing) and #202 (Content References planning) created
- Production D1 backup completed before sync: `r2://awcms-micro-backups/backups/db/backup-20260612-210105.sql.enc`

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| Upstream fetch into `emdash-latest/` | Passed | Refreshed from upstream EmDash `main` at `ff5855ab` |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | Rebuilt via `update-awcmsmicro-dev.sh`; 0016 patch updated; all overlays replayed |
| Validation script execution | Passed | See `LAST_VALIDATION.md` |
| SIKESRA compatibility validation | Passed | `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:validate-after-emdash-sync` passed |
| AWCMS-Micro Node template validation | Passed | `pnpm test && pnpm build` passed |
| AWCMS-Micro Cloudflare template validation | Passed | `pnpm test && pnpm build` passed |
| Cloudflare credentialed deployment readiness | Pending | Deployment pending after changeset + commit |
| Cloudflare production packaging dry run | Pending | Run after commit and deployment step |
| Cloudflare production deployment | Pending | Scheduled after changeset + release workflow |
| Cloudflare post-deploy smoke checks | Pending | Run after deployment |
| Production D1 migration status | Pending | Migration 043 will auto-apply on next boot (adds `_emdash_relations`, `_emdash_content_references`) |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific plugin and template additions.
- Validation passes on this host with `EMDASH_WORKERD_PLUGIN_PORT_BASE=28000` exported by `scripts/validate-awcmsmicro-dev.sh`.
- Migration 043 is additive (content references schema). It runs automatically on the next app boot. No manual migration step needed.
- The new `@emdash-cms/cloudflare/worker` entry point requires a `"triggers": { "crons": ["* * * * *"] }` in `wrangler.jsonc` (added in this sync).
- Any accepted downstream divergence must be logged in `DIVERGENCE_LOG.md`.
