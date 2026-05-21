# AGENTS.md

This is an **EmDash example repository** built on Astro with a full admin UI.

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
| `astro.config.mjs` | Astro config with `emdash()` integration, Cloudflare database/storage, and plugin registration |
| `src/live.config.ts` | EmDash loader registration (boilerplate — don't modify) |
| `seed/seed.json` | Schema definition + demo content |
| `emdash-env.d.ts` | Generated types for collections (auto-regenerated on dev server start) |
| `src/layouts/Base.astro` | Public-site layout with EmDash page contributions and widgets |
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

The `awcms-micro-plugin` under `src/plugins/` demonstrates the full trusted-plugin surface used by this repository:

- **Lifecycle hooks**: `plugin:install`, `plugin:activate`, `plugin:deactivate`, `plugin:uninstall`
- **Content hooks**: `content:beforeSave`, `content:afterSave`, `content:beforeDelete`, `content:afterDelete`, `content:afterPublish`, `content:afterUnpublish`
- **Media hooks**: `media:beforeUpload`, `media:afterUpload`
- **Comment hooks**: `comment:beforeCreate`, `comment:moderate`, `comment:afterCreate`, `comment:afterModerate`
- **Email hooks**: `email:beforeSend`, `email:afterSend`
- **Page hooks**: `page:metadata` (JSON-LD, meta tags), `page:fragments` (inline scripts)
- **Cron hook**: Scheduled cleanup task
- **Storage**: Four collections (`audit`, `analytics`, `notifications`, `comments`)
- **Settings**: Auto-generated `settingsSchema` with all field types (boolean, number, url, secret, email, select)
- **Routes**: Authenticated and public routes with input validation
- **Admin pages**: Overview, Activity, Comments, Settings (React components)
- **Dashboard widgets**: Activity Summary, Quick Stats, Recent Content
- **Portable Text blocks**: `awcms-callout`, `awcms-video` (with Astro rendering components)
- **Capabilities**: `content:read`, `content:write`, `media:read`, `media:write`, `users:read`, `network:request`, `email:send`, `hooks.email-events:register`, `hooks.page-fragments:register`

Register in `astro.config.mjs` under `plugins: []`. Do not modify EmDash core — extend through plugins only.

## Deployment

- **Site URL**: `https://awcms-micro.ahlikoding.com`
- **S3 Storage**: `https://awcms-micro-s3.ahlikoding.com`
- **D1 Database**: `awcms-micro-d1`

## This Repository

AWCMS-Micro is a standalone EmDash example repository that fully adopts EmDash 100%. It adds only example plugins that follow the AWCMS-Micro conventions. It does not act as a host for other repositories.
