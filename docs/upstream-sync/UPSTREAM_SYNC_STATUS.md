# Upstream Sync Status

## Source

- Upstream repository URL: `https://github.com/emdash-cms/emdash`
- Upstream branch: `main`
- Upstream commit SHA: `283bcf059e8c6889d14292e822953f13eaf6a6b0`
- Sync date: `2026-05-23T21:38:18Z`
- Operator: `Antigravity`
- Target folder: `emdash-latest/`
- Development workspace: `awcmsmicro-dev/`

## Status Summary

Synced to EmDash `283bcf05`. `emdash-latest/` and `awcmsmicro-dev/` both refreshed successfully, and the gallery protected paths were preserved after the allowlist update. Validation now passes after the local workerd port allocation fix. Remaining unresolved items are the upstream-blocked Dependabot alerts tracked in #73 and the CodeQL regex/workflow hotspots tracked in #76.

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
- Any accepted divergence must be logged in `DIVERGENCE_LOG.md`.
