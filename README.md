# AWCMS-Micro

AWCMS-Micro is an **example EmDash site** that demonstrates how to build and deploy an EmDash CMS on Cloudflare Workers with D1 and R2.

This repository fully adopts EmDash 100% and adds only example plugins that follow AWCMS conventions. It does not modify any part of EmDash core.

## Scope

- EmDash Cloudflare deployment example (Workers + D1 + R2)
- Example native plugins demonstrating `definePlugin()` patterns
- Seed file with baseline schema and demo content
- MCP server configuration for AI-assisted development

## Getting Started

```bash
pnpm install
pnpm dev
```

Open the admin at [http://localhost:4321/_emdash/admin](http://localhost:4321/_emdash/admin).

## Commands

- `pnpm dev` — Start dev server (runs migrations, seeds, generates types)
- `pnpm build` — Build for production
- `pnpm preview` — Preview production build
- `pnpm deploy` — Build and deploy to Cloudflare Workers
- `pnpm typecheck` — Type check with Astro check

## Key Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Astro config with `emdash()` integration, D1, R2, and sandbox runner |
| `src/live.config.ts` | EmDash loader registration (boilerplate) |
| `src/worker.ts` | Cloudflare Worker entrypoint (delegates to Astro handler) |
| `seed/seed.json` | Schema definition + demo content |
| `emdash-env.d.ts` | Generated TypeScript types for collections |
| `wrangler.jsonc` | Cloudflare bindings (D1, R2, Worker Loader) |

## Example Plugins

This repository includes example native plugins under `src/plugins/`:

- **`awcms-example-plugin`** — Demonstrates native plugin patterns: hooks, storage, settings, API routes, and admin pages.

## Documentation

- EmDash docs: [docs.emdashcms.com](https://docs.emdashcms.com/)
- EmDash docs MCP: [docs.emdashcms.com/docs-mcp](https://docs.emdashcms.com/docs-mcp)

## Deploy

```bash
wrangler deploy
```

Your site is live at `https://awcms-micro.<your-subdomain>.workers.dev`.
