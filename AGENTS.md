# AGENTS.md

> **CRITICAL: Repository boundary warning.** This repository (`ahliweb/awcms-micro`) is the EmDash-compatible host runtime only.
> - Do **not** add SIKESRA business logic, migrations, seeds, API endpoints, or plugin code here.
> - SIKESRA code belongs in `ahliweb/awcms-micro-sikesra`.
> - Use `git remote -v` and `pwd` to verify the active repository before writing code.

## Core Rule

EmDash upstream is the architectural authority. AWCMS-Micro is the implementation and governance layer.

Do not modify EmDash core unless a missing extension point is proven and documented.

## Required Reading Order

1. `README.md`
2. EmDash docs index: `https://docs.emdashcms.com/llms.txt`
3. EmDash configuration reference
4. EmDash native plugin documentation

## Development Rules

1. Keep platform logic separate from module business logic.
2. Use EmDash plugin patterns (`definePlugin`) for module extensions.
3. Keep Cloudflare D1/R2 binding-based configuration.
4. Never commit secrets or API tokens.
5. Keep commits atomic and reversible.

## Conventions

1. Admin plugin route boundary: `/_emdash/admin/plugins/<plugin-id>/*`
2. Plugin API route boundary: `/_emdash/api/plugins/<plugin-id>/<route-name>`
3. Cloudflare D1 binding name baseline: `DB`
4. Cloudflare R2 binding name baseline: `MEDIA`

## Validation Baseline

Before merge:

1. `pnpm typecheck`
2. `pnpm build`
3. `pnpm test` when tests exist
