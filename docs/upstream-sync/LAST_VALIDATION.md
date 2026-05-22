# Last Validation

## Validation Run Metadata

- Date:
  - Started: `2026-05-22T08:56:00Z`
  - Completed: `2026-05-22T09:57:00Z`
- Operator: `OpenCode / GPT-5.4`
- Branch: `chore/awcms-micro-sync-governance`
- Upstream commit SHA: `0d3ed7a^{tree}:emdash-latest snapshot currently checked out in parent repo`
- Validation scope: `awcmsmicro-dev workspace validation after AWCMS-Micro governance, example template, and example plugin additions`

## Commands

```bash
bash scripts/validate-awcmsmicro-dev.sh
bash -n scripts/update-emdash-latest.sh
bash -n scripts/update-awcmsmicro-dev.sh
bash -n scripts/validate-awcmsmicro-dev.sh
bash -n scripts/sync-and-validate-awcmsmicro-dev.sh
pnpm typecheck
pnpm lint:quick
pnpm test
pnpm build
```

## Result Summary

- Overall status: `Failed`
- Notes:
  - `bash scripts/validate-awcmsmicro-dev.sh` timed out twice in the shell tool before it could write a report.
  - The validation was continued manually with split commands inside `awcmsmicro-dev/`.
  - `pnpm typecheck` passed.
  - `pnpm lint:quick` completed with existing upstream warnings.
  - `pnpm test` failed in upstream `packages/plugin-cli`.
  - `pnpm build` completed successfully with existing upstream warnings.
  - `pnpm --filter @awcms-micro/plugin-example test` passed.
  - `pnpm --filter @awcms-micro/template-default-example typecheck` failed because workspace-level Astro checking surfaced existing upstream e2e, infra, and package typing issues before ending with Node heap exhaustion.

## Failure Classification

| Category | Status | Details |
| --- | --- | --- |
| Script failure | Failed | `scripts/validate-awcmsmicro-dev.sh` exceeded shell timeout before writing the report |
| Dependency install failure | Not triggered | `pnpm` was available and install had already progressed before split validation resumed |
| Upstream EmDash test failure | Failed | `packages/plugin-cli` tests failed resolving `@emdash-cms/registry-lexicons` |
| AWCMS-Micro added file failure | Not triggered | No failure was attributed to the new AWCMS-Micro example files during `typecheck` or `build` |

## Detailed Output

```text
Syntax validation:
- bash -n scripts/update-emdash-latest.sh: passed
- bash -n scripts/update-awcmsmicro-dev.sh: passed
- bash -n scripts/validate-awcmsmicro-dev.sh: passed
- bash -n scripts/sync-and-validate-awcmsmicro-dev.sh: passed

Workspace validation:
- pnpm typecheck: passed
- pnpm lint:quick: completed with upstream warnings in packages/core, packages/admin, and e2e tests
- pnpm test: failed in packages/plugin-cli
  Error: Failed to resolve entry for package "@emdash-cms/registry-lexicons".
- pnpm build: passed
  Existing upstream build warnings included unresolved virtual imports in packages/cloudflare and direct eval warnings in packages/plugins/sandboxed-test.
- pnpm --filter @awcms-micro/plugin-example test: passed (3 tests)
- pnpm --filter @awcms-micro/template-default-example typecheck: failed due existing workspace typing issues outside the new template, followed by Node heap exhaustion
```
