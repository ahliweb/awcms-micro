# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `90ffe40a1a31193b2f29ef92202e4f339a2487fa`
- Sync date: `2026-07-02T03:09:00Z`
- Operator: `unggul`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

`emdash-latest/` was refreshed to EmDash `0.26.0` at upstream `main` commit `90ffe40a1a31193b2f29ef92202e4f339a2487fa` after confirming local GitHub state was current and backing up production D1 to `r2://awcms-micro-backups/backups/db/backup-20260702-100524.sql.enc`.

`awcmsmicro-dev/` has been rebuilt from the refreshed EmDash `0.26.0` snapshot with approved AWCMS-Micro overlays replayed. The 0.26.0 rebuild required patch-context updates for dependency/security overlays, retirement of the obsolete Lunaria lockfile integrity overlay, protection of the downstream lockfile, and removal of a stale AT Protocol manifest version hunk from the code-scanning hardening overlay.

Local and development synchronization is complete and validated. Production is intentionally not cut over yet: D1 still records through `043_content_references`, while EmDash 0.26.0 adds migrations 044-048. Complete #221 before applying production migrations or deploying the 0.26.0 worker, and complete #222 before adopting optional Cloudflare architecture features such as Durable Object SQLite, Hyperdrive, KV object cache, or Cloudflare Email Sending.

## Key Changes in This Sync

- **EmDash 0.20.0-0.26.0** — key upstream additions now present in `emdash-latest/` and rebuilt into `awcmsmicro-dev/`:
  - **Migrations 044-048**: comment reactions, taxonomy parent translation-group backfill, media usage index tables, and restored taxonomy indexes. Production D1 currently records through migration `043_content_references` only. See #221.
  - **Cloudflare architecture features**: Durable Object SQLite adapter, Hyperdrive adapter and cached binding, KV-backed object cache, Cloudflare media image endpoint improvements, and Cloudflare Email Sending provider plugin. See #222.
  - **Public/runtime features**: offset pagination, LiveSearch route templates, public search suggestions, CSP-compatible JSON-LD, sitemap hreflang fixes, media LQIP placeholders, content schedule/restore hooks, and text-alignment round-trip rendering.
  - **Admin features**: route-scoped admin CSS, Kumo sidebar updates, repeater field typeahead, byline avatar picker, CJK editor metrics, code block picker focus fix, and additional admin locales.
- **EmDash 0.19.0** — previous deployed workspace baseline:
  - **Scheduled publishing heartbeat fix**: `publishDueContent` sweep replaces `PiggybackScheduler`; scheduled content now actually transitions to `published`. AWCMS-Micro templates already have correct `worker.ts` and `wrangler.jsonc`. See issue #205 for post-deploy verification.
  - **`getEntriesByByline()`**: new helper for author archive pages. `getEmDashCollection` also accepts `where: { byline: translationGroup }`. See issue #204.
  - **Responsive srcset for media**: automatic through Astro image service — no template changes required.
  - **Admin content list filtering**: `authorId`, `dateField`, `dateFrom`, `dateTo` params; new `/authors` endpoint.
  - **`RelationRepository`** data layer for content references (foundation only, no field/API/UI yet).
  - **Bug fixes**: `getTaxonomyTerms()` description for flat taxonomies; seed CLI `defaultLocale`; taxonomy term hydration uses entry's resolved locale.
  - **`create-emdash` scaffold**: HEAD adds `.env` instead of `.dev.vars` for new Cloudflare projects.
- **Patch overlay repair** — refreshed 0.26.0 contexts for `0004`, `0007`, `0011`, `0016`, `0021`, `0023`, and `0030`; retired `0024-lunaria-lockfile-integrity.patch`; removed the stale AT Protocol manifest version hunk from `0028`; restored the documented blocks playground `build.target: "esnext"` compatibility setting.
- **Protected boundary update** — `awcmsmicro-dev/pnpm-lock.yaml` is now a protected downstream path because the workspace-level security overrides intentionally generate a downstream lockfile that differs from upstream.
- Migration 043 (`_emdash_relations` + `_emdash_content_references`) was already applied in production from the previous sync (present at `ff5855ab`). Not a new apply in this sync.
- Production D1 backup completed before this sync: `r2://awcms-micro-backups/backups/db/backup-20260702-100524.sql.enc`
- GitHub issues #221 (production D1 migrations 044-048), #222 (Cloudflare architecture adoption), and #223 (patch overlay repair) created; #223 was completed by this sync.

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| Upstream fetch into `emdash-latest/` | Passed | Refreshed from upstream EmDash `main` at `90ffe40a` |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | `bash scripts/update-awcmsmicro-dev.sh continuation` rebuilt from EmDash 0.26.0 after overlay repair |
| Boundary validation | Passed | `bash scripts/validate-awcmsmicro-boundaries.sh` passed after downstream lockfile protection and patch overlay replay checks |
| Validation script execution | Passed | `bash scripts/validate-awcmsmicro-dev.sh` passed for the rebuilt 0.26.0 workspace |
| SIKESRA compatibility validation | Passed | Included in `validate-awcmsmicro-dev.sh`: `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:validate-after-emdash-sync` |
| AWCMS-Micro Node template validation | Passed | 2026-07-02: `pnpm --dir awcmsmicro-dev/templates/awcms-micro-default typecheck` and `pnpm --dir awcmsmicro-dev/templates/awcms-micro-default test` passed |
| AWCMS-Micro Cloudflare template validation | Passed | 2026-07-02: `pnpm --dir awcmsmicro-dev/templates/awcms-micro-default-cloudflare test`, `build`, and `wrangler deploy --dry-run` passed |
| Cloudflare production deployment | Deferred | Current production remains the 2026-06-13 deployment, Version ID `0ef03174-32c5-46c7-9fbe-51b3adc8fa5b`; deploy 0.26.0 only after #221 migration safety checks |
| Cloudflare post-deploy smoke checks | Passed | `/`, `/posts`, `/news`, `/about`, `/sitemap.xml`, `/id`, `/id/posts`, `/services` all return 200 |
| Scheduled publishing post-deploy verification | Pending | See issue #205 — schedule a test post and confirm it auto-publishes |

## Notes

- `emdash-latest/` remains the upstream reference snapshot, with the documented local `build.target: "esnext"` playground compatibility exception carried in `DIVERGENCE_LOG.md`.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific plugin and template additions.
- Validation passes on this host with `EMDASH_WORKERD_PLUGIN_PORT_BASE=28000` exported by `scripts/validate-awcmsmicro-dev.sh`.
- Migration 043 (`_emdash_content_references` and `_emdash_relations`) is already applied in production from the 0.18.0 sync. The 0.26.0-era deployment will introduce migrations 044-048; see #221 before production deployment.
- The `@emdash-cms/cloudflare/worker` entry point requires `"triggers": { "crons": ["* * * * *"] }` in `wrangler.jsonc` — already present in AWCMS-Micro templates.
- Any accepted downstream divergence must be logged in `DIVERGENCE_LOG.md`.
- 2026-07-02 sync repair aligned active patch overlays with EmDash 0.26.0, protected the downstream lockfile, rebuilt `awcmsmicro-dev/`, verified boundaries and full workspace validation, validated both default templates, and confirmed Cloudflare packaging with a dry-run.
