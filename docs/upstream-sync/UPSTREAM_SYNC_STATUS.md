# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `d43a3808fbef4e2e0e2881428d57c6336eb33e51`
- Sync date: `2026-06-01T22:26:25Z`
- Operator: `unggul`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

Synced to EmDash `d43a3808`. `emdash-latest/` and `awcmsmicro-dev/` both refreshed successfully, downstream patch overlays replay after context updates for the latest upstream package files, and the downstream workspace validates cleanly on this host.

## Key Changes in This Sync

- Upstream EmDash refreshed to `d43a3808` and was replayed into `awcmsmicro-dev/` through the protected-path rebuild workflow
- Updated downstream patch overlay contexts for `0007-core-vite.patch` and `0008-admin-vite.patch` so the catalog-based Vite security posture still replays against the latest upstream package manifests
- Adapted the preserved admin sidebar overlay to the current Kumo `Sidebar` API while keeping plugin groups positioned directly below Dashboard
- Hoisted SIKESRA validation regexes and guard-script patterns to satisfy the latest upstream lint rules without changing SIKESRA data behavior
- Downstream sync state remains protected by the allowlist, patch overlay workflow, and validation workflow

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| Upstream fetch into `emdash-latest/` | Passed | Refreshed from upstream EmDash `main` at `d43a3808` |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | Rebuilt via `update-awcmsmicro-dev.sh`; approved AWCMS-Micro boundaries preserved |
| Validation script execution | Passed | See `LAST_VALIDATION.md` |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific plugin and template additions.
- Validation passes on this host with `EMDASH_WORKERD_PLUGIN_PORT_BASE=28000` exported by `scripts/validate-awcmsmicro-dev.sh`.
- Dependabot alert counts were not re-queried during this local sync; the downstream marketplace, core, admin, blocks-playground, admin-dompurify, create-emdash-giget, postcss, and template `data.db` persistence changes are recorded separately in `DIVERGENCE_LOG.md`, while `docs/package.json`, `infra/perf-monitor/package.json`, `packages/blocks/playground/package.json`, and `templates/awcms-micro-default/data.db` are preserved through the rebuild allowlist.
- The rebuilt workspace now keeps both `awcmsmicro-dev/.changeset/` and `awcmsmicro-dev/.awcms-changesets/` across syncs.
- Any accepted downstream divergence must be logged in `DIVERGENCE_LOG.md`.
