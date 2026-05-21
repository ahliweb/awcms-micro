# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `TBD`
- Sync date: `TBD`
- Operator: `TBD`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

This document should be updated after `scripts/sync-and-validate-awcmsmicro-dev.sh` completes.

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| Upstream fetch into `emdash-latest/` | Pending | Update after sync |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Pending | Update after sync |
| Naming consistency review | Pending | Use `awcmsmicro-dev` naming only |
| Validation script execution | Pending | See `LAST_VALIDATION.md` |
| Divergence review | Pending | See `DIVERGENCE_LOG.md` |
| Documentation refresh | Pending | Update root docs when workflow changes |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific example additions.
- Any accepted divergence must be logged in `DIVERGENCE_LOG.md`.
