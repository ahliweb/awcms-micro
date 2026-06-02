# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `8712b7efa5bbb061c0083956623c454c97f4e894`
- Sync date: `2026-06-02T08:11:07Z`
- Operator: `unggul`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

Synced to EmDash `8712b7e`. Upstream `main` moved from `d43a3808` to `8712b7e`; `emdash-latest/` and `awcmsmicro-dev/` both refreshed successfully, downstream patch overlays replay cleanly under pnpm `11.5.0`, and the downstream workspace validates cleanly on this host after the locale guardrail lint fix.

## Key Changes in This Sync

- Upstream EmDash refreshed to `8712b7e`, including the upstream Thai admin locale changeset and locale catalog
- Rebuilt `awcmsmicro-dev/` from `emdash-latest/` through the protected-path rebuild workflow
- Replayed all active downstream patch overlays after the rebuild, including the pnpm `11.5.0` package-manager overlay
- Refreshed `awcmsmicro-dev/pnpm-lock.yaml` to match the rebuilt workspace under pnpm `11.5.0`
- Downstream sync state remains protected by the allowlist, patch overlay workflow, and validation workflow
- Current open Dependabot alerts after this refresh: 75 total, with 63 under `emdash-latest/` and 12 under `awcmsmicro-dev/`; GitHub had not recalculated the downstream alert list yet as of `2026-06-02T08:19:41Z`
- Locally remediated the downstream lockfile resolutions for the active `awcmsmicro-dev/` alert set: `@hono/node-server@1.19.13`, `ajv@8.20.0`, `defu@6.1.7`, `h3@1.15.11`, `markdown-it@14.2.0`, `rollup@4.61.0`, `simple-git@3.36.0`, and `yaml@2.9.0`

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| Upstream fetch into `emdash-latest/` | Passed | Refreshed from upstream EmDash `main` at `8712b7e` |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | Rebuilt via `update-awcmsmicro-dev.sh`; approved AWCMS-Micro boundaries preserved; 16 downstream overlays replayed |
| Validation script execution | Passed | See `LAST_VALIDATION.md` |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific plugin and template additions.
- Validation passes on this host with `EMDASH_WORKERD_PLUGIN_PORT_BASE=28000` exported by `scripts/validate-awcmsmicro-dev.sh`.
- Dependabot alert counts were re-queried after this sync and after downstream lockfile remediation: 75 open alerts total, with 63 under `emdash-latest/` and 12 still reported under `awcmsmicro-dev/`. The `awcmsmicro-dev/pnpm-lock.yaml` package keys now resolve the downstream alert packages to patched versions, so the remaining downstream count is expected to be a GitHub recalculation delay unless Dependabot reports a new manifest state later.
- The rebuilt workspace now keeps both `awcmsmicro-dev/.changeset/` and `awcmsmicro-dev/.awcms-changesets/` across syncs.
- Any accepted downstream divergence must be logged in `DIVERGENCE_LOG.md`.
