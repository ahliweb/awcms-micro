# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `a6e8a9185fb1f7aa98078ba2f03ec6df8883f90d`
- Sync date: `2026-06-04T23:14:42Z`
- Operator: `unggul`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

Synced to EmDash `a6e8a91`. Upstream `main` moved from `73b5cf4` to `a6e8a91`; `emdash-latest/` and `awcmsmicro-dev/` both refreshed successfully, downstream patch overlays replay cleanly under pnpm `11.5.0`, and the downstream workspace validates cleanly on this host.

## Key Changes in This Sync

- Upstream EmDash refreshed to `a6e8a91`, including EmDash `0.17.1` package updates, admin locale additions, seed export improvements, query pagination coverage, Cloudflare/E2E test updates, workflow action version updates, and related package changelog/version updates
- Rebuilt `awcmsmicro-dev/` from `emdash-latest/` through the protected-path rebuild workflow
- Replayed all 20 active downstream patch overlays after the rebuild, including the pnpm `11.5.0` package-manager overlay
- Refreshed `awcmsmicro-dev/pnpm-lock.yaml` to match the rebuilt workspace under pnpm `11.5.0`
- Preserved approved AWCMS-Micro plugin, template, admin branding/navigation, changeset, workflow, protected local-state, and patch-overlay boundaries during rebuild
- Downstream sync state remains protected by the allowlist, patch overlay workflow, and validation workflow
- Dependabot alert counts were not re-queried during this local sync because GitHub access was not required for the update or validation path

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| Upstream fetch into `emdash-latest/` | Passed | Refreshed from upstream EmDash `main` at `a6e8a91` |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | Rebuilt via `update-awcmsmicro-dev.sh`; approved AWCMS-Micro boundaries preserved; 20 downstream overlays replayed |
| Validation script execution | Passed | See `LAST_VALIDATION.md` |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific plugin and template additions.
- Validation passes on this host with `EMDASH_WORKERD_PLUGIN_PORT_BASE=28000` exported by `scripts/validate-awcmsmicro-dev.sh`.
- Dependabot alert counts were not re-queried in this pass; use the GitHub alert workflow only when GitHub access is explicitly needed.
- The rebuilt workspace now keeps both `awcmsmicro-dev/.changeset/` and `awcmsmicro-dev/.awcms-changesets/` across syncs.
- Any accepted downstream divergence must be logged in `DIVERGENCE_LOG.md`.
