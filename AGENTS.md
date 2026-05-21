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

## Example Plugin

The `awcms-micro-plugin` under `src/plugins/` demonstrates ALL EmDash native plugin features:

- **Lifecycle hooks**: `plugin:install`, `plugin:activate`, `plugin:deactivate`, `plugin:uninstall`
- **Content hooks**: `content:beforeSave`, `content:afterSave`, `content:beforeDelete`, `content:afterDelete`, `content:afterPublish`, `content:afterUnpublish`
- **Media hooks**: `media:afterUpload`
- **Page hooks**: `page:metadata` (JSON-LD, meta tags), `page:fragments` (inline scripts)
- **Cron hook**: Scheduled cleanup task
- **Storage**: Three collections (`audit`, `analytics`, `notifications`) with composite indexes
- **Settings**: Auto-generated `settingsSchema` with all field types (boolean, number, url, secret, email, select)
- **Routes**: Authenticated and public routes with input validation
- **Admin pages**: Dashboard, Audit Log, Analytics, Settings (React components)
- **Dashboard widgets**: Activity Summary, Quick Stats, Recent Content
- **Portable Text blocks**: Callout Box, Video Embed (with Astro rendering components)
- **Capabilities**: `read:content`, `write:content`, `read:media`, `network:request`, `email:send`, `users:read`, `hooks.page-fragments:register`, `hooks.page-metadata:register`

Register in `astro.config.mjs` under `plugins: []`. Do not modify EmDash core — extend through plugins only.

## Deployment

- **Site URL**: `https://awcms-micro.ahlikoding.com`
- **S3 Storage**: `https://awcms-micro-s3.ahlikoding.com`
- **D1 Database**: `awcms-micro-d1`

## This Repository

AWCMS-Micro is an example EmDash site that fully adopts EmDash 100%. It adds only example plugins that follow AWCMS conventions. It does not act as a host for other repositories.
