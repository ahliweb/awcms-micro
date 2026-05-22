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
| Naming consistency review | Passed | No remaining root-level references to deprecated `awcms-micro-dev` naming were found |
| Validation script execution | Failed | Last recorded run failed before workspace validation completed; rerun after script fixes |
| Divergence review | Passed | Current AWCMS-Micro additions are documented as isolated examples and governance docs |
| Documentation refresh | Passed | Root docs now link sync, deployment, security, template, and plugin additions |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific example additions.
- Any accepted divergence must be logged in `DIVERGENCE_LOG.md`.
