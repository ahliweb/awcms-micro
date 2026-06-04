# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `73b5cf486cabecd496c96c6a5322eae634f3c652`
- Sync date: `2026-06-04T01:47:19Z`
- Operator: `unggul`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

Synced to EmDash `73b5cf4`. Upstream `main` moved from `cd2dcc6` to `73b5cf4`; `emdash-latest/` and `awcmsmicro-dev/` both refreshed successfully, downstream patch overlays replay cleanly under pnpm `11.5.0`, and the downstream workspace validates cleanly on this host after adding the missing protected admin sidebar exports required by the latest upstream byline schema UI.

## Key Changes in This Sync

- Upstream EmDash refreshed to `73b5cf4`, including the EmDash `0.17.0` package updates, byline custom field/schema admin work, maintainer-reply automation updates, Cloudflare E2E fixture additions, and related query-count snapshot updates
- Rebuilt `awcmsmicro-dev/` from `emdash-latest/` through the protected-path rebuild workflow
- Replayed all 20 active downstream patch overlays after the rebuild, including the pnpm `11.5.0` package-manager overlay
- Refreshed `awcmsmicro-dev/pnpm-lock.yaml` to match the rebuilt workspace under pnpm `11.5.0`
- Added the upstream-compatible `BYLINE_SCHEMA_NAV_ITEM` and `filterNavItemsByRole` exports back into the protected downstream admin sidebar override so the new upstream byline routes typecheck and test cleanly
- Downstream sync state remains protected by the allowlist, patch overlay workflow, and validation workflow
- Dependabot alert counts were not re-queried during this local sync because GitHub access was not required for the update or validation path

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| Upstream fetch into `emdash-latest/` | Passed | Refreshed from upstream EmDash `main` at `73b5cf4` |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | Rebuilt via `update-awcmsmicro-dev.sh`; approved AWCMS-Micro boundaries preserved; 20 downstream overlays replayed |
| Validation script execution | Passed | See `LAST_VALIDATION.md` |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific plugin and template additions.
- Validation passes on this host with `EMDASH_WORKERD_PLUGIN_PORT_BASE=28000` exported by `scripts/validate-awcmsmicro-dev.sh`.
- Dependabot alert counts were not re-queried in this pass; use the GitHub alert workflow only when GitHub access is explicitly needed.
- The rebuilt workspace now keeps both `awcmsmicro-dev/.changeset/` and `awcmsmicro-dev/.awcms-changesets/` across syncs.
- Any accepted downstream divergence must be logged in `DIVERGENCE_LOG.md`.
