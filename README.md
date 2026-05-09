# AWCMS-Micro

AWCMS-Micro is an EmDash-compatible host runtime and governance-layer repository.

This repository hosts the core scaffold used to run EmDash with AWCMS conventions and to integrate governed modules/plugins (for example SIKESRA) without modifying EmDash core.

## Scope

- EmDash-compatible host scaffold (Astro + EmDash integration)
- Cloudflare runtime baseline (Workers + D1 + R2 bindings)
- Workspace conventions for AWCMS packages and plugins
- Migration and seed path conventions
- Test and validation script conventions

## Canonical References

1. EmDash docs index: `https://docs.emdashcms.com/llms.txt`
2. EmDash configuration reference
3. EmDash native plugin conventions
4. EmDash Cloudflare deployment conventions

## Repository Layout

- `astro.config.mjs` - host runtime integration
- `src/live.config.ts` - EmDash live collections loader
- `src/worker.ts` - Cloudflare worker entrypoint
- `wrangler.jsonc` - Cloudflare bindings baseline
- `packages/awcms/` - shared AWCMS packages
- `packages/plugins/` - AWCMS plugins/modules
- `migrations/` - migration convention path
- `seeds/` - seed convention path

## Commands

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm typecheck`
- `pnpm deploy`

## Non-Negotiable Rule

Do not modify EmDash core directly in this repository. Extend through configuration, plugins, and AWCMS packages.
