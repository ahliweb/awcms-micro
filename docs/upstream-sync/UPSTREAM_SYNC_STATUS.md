# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `90ebf8a7af2004f24af58c88d7570a4a43af4a7b`
- Sync date: `2026-05-31T01:24:36Z`
- Operator: `unggul`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

Synced to EmDash `90ebf8a7`. `emdash-latest/` and `awcmsmicro-dev/` both refreshed successfully, the downstream workspace validates cleanly on this host, and the rebuild allowlist continues to preserve `awcmsmicro-dev/.changeset/` so workspace package-release metadata survives future upstream rebuilds.

## Key Changes in This Sync

- Upstream dependency catalog refresh touched `docs/package.json`, `infra/cache-demo/package.json`, `infra/perf-monitor/package.json`, `packages/admin/package.json`, `packages/blocks/playground/package.json`, `packages/core/package.json`, `packages/plugins/embeds/package.json`, `packages/workerd/package.json`, and `pnpm-workspace.yaml`
- The same catalog refresh was replayed into `awcmsmicro-dev/` during the rebuild
- Downstream sync state remains protected by the allowlist and validation workflow

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| Upstream fetch into `emdash-latest/` | Passed | Refreshed from upstream EmDash `main` at `90ebf8a7` |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | Rebuilt via `update-awcmsmicro-dev.sh`; approved AWCMS-Micro boundaries preserved |
| Validation script execution | Passed | See `LAST_VALIDATION.md` |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific plugin and template additions.
- Validation passes on this host with `EMDASH_WORKERD_PLUGIN_PORT_BASE=28000` exported by `scripts/validate-awcmsmicro-dev.sh`.
- Dependabot open alerts remain at 65 in `emdash-latest/` and 35 in `awcmsmicro-dev/`; the downstream marketplace, docs, perf-monitor, core, admin, docs-catalog, blocks-playground, admin-dompurify, and create-emdash-giget overlays are recorded separately in `DIVERGENCE_LOG.md`.
- The rebuilt workspace now keeps both `awcmsmicro-dev/.changeset/` and `awcmsmicro-dev/.awcms-changesets/` across syncs.
- Any accepted downstream divergence must be logged in `DIVERGENCE_LOG.md`.
