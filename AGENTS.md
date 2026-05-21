# AGENTS.md

This is an **EmDash example site** — a CMS built on Astro with a full admin UI.

## Commands

```bash
pnpm dev        # Start dev server (runs migrations, seeds, generates types)
pnpm typecheck  # Type check
pnpm build      # Build for production
pnpm deploy     # Build and deploy to Cloudflare
```

The admin UI is at `http://localhost:4321/_emdash/admin`.

## Key Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Astro config with `emdash()` integration, database, and storage |
| `src/live.config.ts` | EmDash loader registration (boilerplate — don't modify) |
| `seed/seed.json` | Schema definition + demo content |
| `emdash-env.d.ts` | Generated types for collections (auto-regenerated on dev server start) |
| `src/worker.ts` | Cloudflare Worker entrypoint |
| `wrangler.jsonc` | Cloudflare bindings (D1, R2, Worker Loader) |

## MCP Server

This repository ships with `.mcp.json` so Claude Code, Cursor, and VS Code auto-discover the EmDash docs MCP server at `https://docs.emdashcms.com/mcp`.

When you need to verify an API, hook, config option, field type, or pattern, call `search_docs` against the live documentation rather than relying on training-data recall.

## Rules

- All content pages must be server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- Image fields are objects (`{ src, alt }`), not strings. Use `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID (for API calls).
- Always call `Astro.cache.set(cacheHint)` on pages that query content.
- Taxonomy names in queries must match the seed's `"name"` field exactly.

## Example Plugins

Example plugins live under `src/plugins/`. They demonstrate EmDash native plugin patterns:

- Use `definePlugin()` with `format: "native"`
- Register in `astro.config.mjs` under `plugins: []`
- Do not modify EmDash core — extend through plugins only

## This Repository

AWCMS-Micro is an example EmDash site that fully adopts EmDash 100%. It adds only example plugins that follow AWCMS conventions. It does not act as a host for other repositories.
