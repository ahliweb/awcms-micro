# Last Validation

## Validation Run Metadata

- Date:
  - Started: 2026-05-22T02:06:38Z
  - Completed: 2026-05-22T02:06:38Z
- Operator: Placeholder: update manually if needed
- Branch: `chore/awcms-micro-sync-governance`
- Upstream commit SHA: `cb41102154b422f281baf24de6701c9d9f651382`
- Validation scope: `awcmsmicro-dev` workspace validation

## Commands

```bash
bash scripts/validate-awcmsmicro-dev.sh
bash -n scripts/update-emdash-latest.sh
bash -n scripts/update-awcmsmicro-dev.sh
bash -n scripts/validate-awcmsmicro-dev.sh
bash -n scripts/sync-and-validate-awcmsmicro-dev.sh
```

## Result Summary

- Overall status: Failed
- Notes: The recorded run never completed workspace validation and reported root-level `pnpm` manifest errors.

## Failure Classification

| Category | Status | Details |
| --- | --- | --- |
| Script failure | Not triggered | Validation wrapper or shell orchestration failure |
| Dependency install failure | Failed | The recorded attempt reported `ERR_PNPM_NO_PKG_MANIFEST` for `/home/data/dev_react/awcms-micro` instead of the workspace directory |
| Upstream EmDash test failure | Not triggered | `pnpm test` was not reached in the recorded attempt |
| AWCMS-Micro added file failure | Not triggered | `pnpm typecheck`, `pnpm lint:quick`, and `pnpm build` were not reached in the recorded attempt |

## Detailed Output

```text
The previous attempt produced a malformed report and root-level `pnpm` manifest errors.
Rerun `bash scripts/validate-awcmsmicro-dev.sh` after the script fixes in this repository to capture a fresh validation log.
```
