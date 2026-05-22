# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `b70df0d8047583b2ee781223dae2a31fcb9a6784`
- Sync date: `2026-05-22T12:45:46Z`
- Operator: `TBD`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

The latest sync refresh and rebuild completed, but full validation remains blocked by an upstream `packages/workerd` test failure.

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| Upstream fetch into `emdash-latest/` | Passed | Refreshed from upstream EmDash `main` at `b70df0d8047583b2ee781223dae2a31fcb9a6784` |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | Rebuilt while preserving approved AWCMS-Micro paths |
| Naming consistency review | Passed | No remaining root-level references to deprecated `awcms-micro-dev` naming were found |
| Validation script execution | Failed | Sync-time validation now reaches upstream tests but stops at `packages/workerd` with `Address already in use` on plugin port `127.0.0.1:18789` |
| Boundary validation | Passed | `bash scripts/validate-awcmsmicro-boundaries.sh` completed successfully after excluding tracked `.env.example` fixtures from secret-path false positives |
| Divergence review | Passed | Current AWCMS-Micro additions are documented as isolated examples and governance docs |
| Documentation refresh | Passed | Root docs now link sync, deployment, security, template, and plugin additions |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific example additions.
- The current blocker is upstream test infrastructure in `packages/workerd`, not an AWCMS-Micro protected-path conflict.
- Any accepted divergence must be logged in `DIVERGENCE_LOG.md`.
