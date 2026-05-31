# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `01ce941672bbc55b1d290e83583fc9041eb5302c`
- Sync date: `2026-05-31T01:07:43Z`
- Operator: `unggul`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

Synced to EmDash `01ce9416`. `emdash-latest/` and `awcmsmicro-dev/` both refreshed successfully, the downstream workspace validates cleanly on this host, and the rebuild allowlist continues to preserve `awcmsmicro-dev/.changeset/` so workspace package-release metadata survives future upstream rebuilds.

## Key Changes in This Sync

- `chore: update dependencies and migrate packages to version catalog` across the upstream workspace and lockfile
- Dependency catalog refresh touched `packages/admin`, `packages/core`, `packages/plugins/embeds`, and `templates/awcms-micro-default`
- Downstream sync state remains protected by the allowlist and validation workflow

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| Upstream fetch into `emdash-latest/` | Passed | Refreshed from upstream EmDash `main` at `01ce9416` |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | Rebuilt via `update-awcmsmicro-dev.sh`; approved AWCMS-Micro boundaries preserved |
| Validation script execution | Passed | See `LAST_VALIDATION.md` |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific plugin and template additions.
- Validation passes on this host with `EMDASH_WORKERD_PLUGIN_PORT_BASE=28000` exported by `scripts/validate-awcmsmicro-dev.sh`.
- The rebuilt workspace now keeps both `awcmsmicro-dev/.changeset/` and `awcmsmicro-dev/.awcms-changesets/` across syncs.
- Any accepted downstream divergence must be logged in `DIVERGENCE_LOG.md`.
