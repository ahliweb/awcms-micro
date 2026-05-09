# AWCMS-Micro Host Conventions

This file defines baseline host runtime conventions used by module repositories (including SIKESRA) during discovery and integration.

## Plugin Path Convention

- AWCMS plugin/module packages should live under `packages/plugins/<plugin-id>/`.

## Shared Package Convention

- Shared platform packages should live under `packages/awcms/<package-name>/`.

## Migration Convention

- Platform-level migration artifacts live under `migrations/`.
- Module-owned migrations should use per-module subfolders when introduced.

## Seed Convention

- Seed artifacts live under `seeds/`.
- Runtime bootstrap may use EmDash seed command wiring from package scripts.

## Route Convention

- Admin plugin pages: `/_emdash/admin/plugins/<plugin-id>/*`
- Plugin API routes: `/_emdash/api/plugins/<plugin-id>/<route-name>`
- Module-specific versioning (for example `v1`) should be encoded in route names.

## Test Convention

- Host baseline command names:
  - `pnpm typecheck`
  - `pnpm build`
  - `pnpm test`

As test suites are added, replace placeholder script behavior with real checks.
