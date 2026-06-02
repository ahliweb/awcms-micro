# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `d43a3808fbef4e2e0e2881428d57c6336eb33e51`
- Sync date: `2026-06-02T03:26:15Z`
- Operator: `unggul`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

Synced to EmDash `d43a3808`. Upstream `main` still resolves to the previously recorded commit, `emdash-latest/` and `awcmsmicro-dev/` both refreshed successfully, downstream patch overlays replay cleanly under pnpm `11.5.0`, and the downstream workspace validates cleanly on this host.

## Key Changes in This Sync

- Upstream EmDash refreshed to `d43a3808`; no newer upstream commit was available during this pass
- Rebuilt `awcmsmicro-dev/` from `emdash-latest/` through the protected-path rebuild workflow
- Replayed all active downstream patch overlays after the rebuild, including the pnpm `11.5.0` package-manager overlay
- Added a downstream lockfile-integrity overlay for upstream `pkg.pr.new` URL dependencies so pnpm `11.5.0` can refresh the lockfile repeatably
- Refreshed `awcmsmicro-dev/pnpm-lock.yaml` to match the rebuilt workspace under pnpm `11.5.0`
- Downstream sync state remains protected by the allowlist, patch overlay workflow, and validation workflow

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| Upstream fetch into `emdash-latest/` | Passed | Refreshed from upstream EmDash `main` at `d43a3808`; no newer commit was available |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | Rebuilt via `update-awcmsmicro-dev.sh`; approved AWCMS-Micro boundaries preserved; 16 downstream overlays replayed |
| Validation script execution | Passed | See `LAST_VALIDATION.md` |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific plugin and template additions.
- Validation passes on this host with `EMDASH_WORKERD_PLUGIN_PORT_BASE=28000` exported by `scripts/validate-awcmsmicro-dev.sh`.
- Dependabot alert counts were not re-queried during this local sync; the downstream marketplace, core, admin, blocks-playground, admin-dompurify, create-emdash-giget, postcss, and template `data.db` persistence changes are recorded separately in `DIVERGENCE_LOG.md`, while `docs/package.json`, `infra/perf-monitor/package.json`, `packages/blocks/playground/package.json`, and `templates/awcms-micro-default/data.db` are preserved through the rebuild allowlist.
- The rebuilt workspace now keeps both `awcmsmicro-dev/.changeset/` and `awcmsmicro-dev/.awcms-changesets/` across syncs.
- Any accepted downstream divergence must be logged in `DIVERGENCE_LOG.md`.
