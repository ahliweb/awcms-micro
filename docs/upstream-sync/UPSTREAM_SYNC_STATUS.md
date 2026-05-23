# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `cf3c706a65087696eb6cca5844b7668a50e4a090`
- Sync date: `2026-05-23T00:44:00Z`
- Operator: `Antigravity`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

Synced to EmDash `cf3c706a` (post-0.14.0, 13 commits). `emdash-latest/` and `awcmsmicro-dev/` both refreshed successfully. All AWCMS-Micro protected paths were preserved. Install, build, typecheck, and lint all passed. Validation is blocked only by an upstream `packages/workerd` environment-level port conflict (`127.0.0.1:18789 Address already in use`), which is a persistent test infrastructure issue, not an AWCMS-Micro regression.

## Key Changes in This Sync (since v0.14.0)

- `feat(plugin-cli): add update-package command` — lets publishers edit package profiles post-publish
- `feat: Node.js plugin isolation via workerd sandbox` — sandbox runner for Node.js deployments
- `feat(registry): uninstall, update, update-check handlers + admin lifecycle`
- `chore: gate lint warnings in CI, clear the existing pile` (adds `--deny-warnings` to lint)
- `refactor(plugin-cli): validate probed plugin shape with Zod`
- `chore: switch kysely to workspace catalog`
- i18n improvements (Indonesian translation, locale catalog extraction)
- Dependency bumps: kysely 0.29.0, oxlint ^1.66.0, oxlint-tsgolint ^0.23.0

## Validation Status

| Check | Status | Notes |
| --- | --- | --- |
| Upstream fetch into `emdash-latest/` | Passed | Refreshed from local mirror of EmDash `main` at `cf3c706a` |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | Rebuilt via `update-awcmsmicro-dev.sh`; all 6 protected paths preserved |
| `pnpm install` | Passed | Completed in ~1m 18s; example plugin built via `prepare` script |
| `pnpm --filter emdash build` | Passed | Core build clean |
| `pnpm typecheck` | Passed | Fixed stale `registry-client` dist after `swapRecord` was added upstream |
| `pnpm lint:quick` | Passed | No lint errors |
| `pnpm --filter @emdash-cms/admin exec node --run locale:compile` | Passed | Locale compile clean |
| `pnpm test` | Partial | AWCMS-Micro tests pass; upstream `packages/workerd` fails with `127.0.0.1:18789 Address already in use` (persistent environment port conflict, not a regression) |
| `pnpm build` | Skipped | Skipped due to test failure above |
| Boundary validation | Not re-run | No boundary changes this cycle |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific example additions.
- The `packages/workerd` test failure is a persistent environment-level port conflict (`127.0.0.1:18789`). It is an upstream EmDash test infrastructure issue reproducible on this host, not an AWCMS-Micro regression.
- The `registry-client` dist was stale after the upstream `swapRecord` parameter was added. It was rebuilt in-workspace before typecheck.
- Any accepted divergence must be logged in `DIVERGENCE_LOG.md`.
