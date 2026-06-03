# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `cd2dcc6a56d19f38d6e13ba55e8563ceaab90ef8`
- Sync date: `2026-06-03T05:31:45Z`
- Operator: `unggul`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

Synced to EmDash `cd2dcc6`. Upstream `main` moved from `47c445b` to `cd2dcc6`; `emdash-latest/` and `awcmsmicro-dev/` both refreshed successfully, downstream patch overlays replay cleanly under pnpm `11.5.0`, and the downstream workspace validates cleanly on this host.

## Key Changes in This Sync

- Upstream EmDash refreshed to `cd2dcc6`, including upstream content/media search improvements, HTML block editor support, SEO loader hydration fixes, byline avatar storage keys, and related performance fixture updates
- Rebuilt `awcmsmicro-dev/` from `emdash-latest/` through the protected-path rebuild workflow
- Replayed all active downstream patch overlays after the rebuild, including the pnpm `11.5.0` package-manager overlay
- Refreshed `awcmsmicro-dev/pnpm-lock.yaml` to match the rebuilt workspace under pnpm `11.5.0`
- Downstream sync state remains protected by the allowlist, patch overlay workflow, and validation workflow
- Current open Dependabot alerts after this refresh: 63 total, all under `emdash-latest/`; `awcmsmicro-dev/` has 0 open Dependabot alerts as of `2026-06-03T05:31:45Z`
- Locally remediated the downstream lockfile resolutions for the active `awcmsmicro-dev/` alert set: `@hono/node-server@1.19.13`, `ajv@8.20.0`, `defu@6.1.7`, `h3@1.15.11`, `markdown-it@14.2.0`, `rollup@4.61.0`, `simple-git@3.36.0`, and `yaml@2.9.0`

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| Upstream fetch into `emdash-latest/` | Passed | Refreshed from upstream EmDash `main` at `cd2dcc6` |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | Rebuilt via `update-awcmsmicro-dev.sh`; approved AWCMS-Micro boundaries preserved; 19 downstream overlays replayed |
| Validation script execution | Passed | See `LAST_VALIDATION.md` |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific plugin and template additions.
- Validation passes on this host with `EMDASH_WORKERD_PLUGIN_PORT_BASE=28000` exported by `scripts/validate-awcmsmicro-dev.sh`.
- Dependabot alert counts were re-queried after this sync: 63 open alerts total, all under `emdash-latest/`, with 0 under `awcmsmicro-dev/`. The `awcmsmicro-dev/pnpm-lock.yaml` package keys resolve the downstream alert packages to patched versions, and the previously reported downstream alerts are no longer open.
- The rebuilt workspace now keeps both `awcmsmicro-dev/.changeset/` and `awcmsmicro-dev/.awcms-changesets/` across syncs.
- Any accepted downstream divergence must be logged in `DIVERGENCE_LOG.md`.
