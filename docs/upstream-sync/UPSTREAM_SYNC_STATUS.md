# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `62f89fecd57be8774d71a911113671c59b599de2`
- Sync date: `2026-05-26T21:24:18Z`
- Operator: `Antigravity`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

Synced to EmDash `62f89fec`. `emdash-latest/` and `awcmsmicro-dev/` both refreshed successfully, and the gallery protected paths were preserved after the allowlist update. Validation now passes after the local workerd port allocation fix. Root deploy workflow actions are now pinned, Dependabot now covers the pnpm workspace in addition to GitHub Actions, and the workspace dependency graph has been lifted to newer patched releases where possible. Remaining unresolved items are the upstream-blocked transitive dependency alerts tracked in #73 and the residual CodeQL / supply-chain hotspots tracked in #76. The remaining security hardening pass has intentionally converted privileged GitHub Action automation into manual/read-only workflows.

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
| Upstream fetch into `emdash-latest/` | Passed | Refreshed from upstream EmDash `main` |
| Rebuild `awcmsmicro-dev/` from `emdash-latest/` | Passed | Rebuilt via `update-awcmsmicro-dev.sh`; gallery paths preserved |
| Validation script execution | Passed | See `LAST_VALIDATION.md` |

## Notes

- `emdash-latest/` remains the clean upstream snapshot.
- `awcmsmicro-dev/` is the workspace for AWCMS-Micro-specific example additions.
- Validation passes on this host after the local workerd port allocation fix.
- The `registry-client` dist was stale after the upstream `swapRecord` parameter was added. It was rebuilt in-workspace before typecheck.
- CodeQL and workflow hardening work is in progress in `awcmsmicro-dev/` and tracked separately from upstream sync.
- Manual workflow rewrites live in the corresponding `awcmsmicro-dev/.github/workflows/*` files.
- Any accepted divergence must be logged in `DIVERGENCE_LOG.md`.
