# AWCMS-Micro

AWCMS-Micro is an **example EmDash site** that demonstrates how to build and deploy an EmDash CMS on Cloudflare Workers with D1 and R2.

This repository fully adopts EmDash 100% and includes a comprehensive example plugin that showcases all native plugin capabilities. It does not modify any part of EmDash core.

## Scope

- EmDash Cloudflare deployment example (Workers + D1 + R2)
- Comprehensive native plugin demonstrating ALL EmDash plugin features
- Seed file with baseline schema and demo content
- MCP server configuration for AI-assisted development
- Template pages: Home, Posts, Pages, Projects, RSS

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

## Example Plugin

The `awcms-micro-plugin` under `src/plugins/` demonstrates ALL EmDash native plugin features:

| Feature | Implementation |
|---------|---------------|
| **Lifecycle hooks** | `plugin:install`, `plugin:activate`, `plugin:deactivate`, `plugin:uninstall` |
| **Content hooks** | `content:beforeSave`, `content:afterSave`, `content:beforeDelete`, `content:afterDelete`, `content:afterPublish`, `content:afterUnpublish` |
| **Media hooks** | `media:afterUpload` |
| **Page metadata** | `page:metadata` — JSON-LD structured data, generator meta tag |
| **Page fragments** | `page:fragments` — inline script injection for analytics |
| **Cron** | Scheduled audit log cleanup task |
| **Storage** | Three collections: `audit`, `analytics`, `notifications` with composite indexes |
| **Settings** | Auto-generated `settingsSchema` with boolean, number, url, secret, email, select fields |
| **API routes** | Authenticated (`stats`, `audit/recent`, `analytics/summary`, `settings`, `settings/save`, `notifications`) and public (`content/activity`) routes |
| **Admin pages** | Dashboard, Audit Log, Analytics, Settings (React components with `usePluginAPI`) |
| **Dashboard widgets** | Activity Summary (half), Quick Stats (third), Recent Content (third) |
| **Portable Text blocks** | Callout Box (info/warning/error/success variants), Video Embed (YouTube/Vimeo) |
| **Capabilities** | `read:content`, `write:content`, `read:media`, `network:request`, `email:send`, `users:read`, `hooks.page-fragments:register`, `hooks.page-metadata:register` |
| **Sidebar navigation** | Dashboard, Audit Log, Analytics, Settings pages with icons |

## Template

The site includes:

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Hero section + latest posts grid |
| All Posts | `/posts` | Full post listing |
| Post Detail | `/posts/[slug]` | Article with metadata, categories, tags |
| Page Detail | `/pages/[slug]` | Static page content |
| Projects | `/projects` | Project grid listing |
| RSS | `/rss.xml` | Generated feed |

## Schema

- `posts` collection: `title`, `content` (Portable Text), `excerpt`, `featured_image`, `author`, `reading_time`
- `pages` collection: `title`, `content` (Portable Text), `meta_description`
- `projects` collection: `title`, `description` (Portable Text), `cover_image`, `url`, `tech_stack`, `status`
- Taxonomies: `category`, `tag`, `project-type`
- Menus: `primary`, `footer`
- Widget areas: `sidebar`, `footer-widgets`

## Deployment

```bash
wrangler deploy
```

Your site is live at `https://awcms-micro.ahlikoding.com`.

### Configuration

- **Site URL**: `https://awcms-micro.ahlikoding.com`
- **S3 Storage**: `https://awcms-micro-s3.ahlikoding.com`
- **D1 Database**: `awcms-micro-d1`
- **R2 Bucket**: `awcms-micro-media`

## Documentation

- EmDash docs: [docs.emdashcms.com](https://docs.emdashcms.com/)
- EmDash docs MCP: [docs.emdashcms.com/docs-mcp](https://docs.emdashcms.com/docs-mcp)
