# Last Validation

## Validation Run Metadata

- Date:
  - Started: 2026-05-22T22:51:00Z
  - Completed: 2026-05-22T22:51:00Z
- Operator: Placeholder: update manually if needed
- Branch: `main`
- Upstream commit SHA: `ae4e0a893ba87241e7ae602eb1e2f8e58a35d1de`
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

- Overall status: Running
- Notes: Current step: Not started

## Failure Classification

| Category | Status | Details |
| --- | --- | --- |
| Script failure | Not triggered | Validation wrapper or shell orchestration failure |
| Dependency install failure | Not triggered | `pnpm install` failed |
| Upstream EmDash test failure | Not triggered | `pnpm --filter @emdash-cms/admin exec node --run locale:compile` or `pnpm test` failed |
| AWCMS-Micro added file failure | Not triggered | `pnpm --filter emdash build`, `pnpm typecheck`, `pnpm lint:quick`, or `pnpm build` failed |

## Detailed Output

```text

```
