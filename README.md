# AWCMS-Micro

AWCMS-Micro is a standalone **EmDash example repository** based on the upstream `blog-cloudflare` template patterns.

It fully adopts EmDash as-is, does not host or modify EmDash core, and adds a single trusted example plugin that demonstrates the public extension surface.

## Scope

- EmDash Cloudflare site example (Workers + D1 + R2)
- Blog-style template pages aligned with the upstream EmDash site architecture
- Trusted example plugin covering hooks, routes, widgets, admin pages, settings, storage, comments, page contributions, and custom Portable Text blocks
- Seed file with demo schema and content
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

## Example Plugin

The `awcms-micro-plugin` under `src/plugins/` is a trusted plugin example. It demonstrates:

- Lifecycle hooks: `plugin:install`, `plugin:activate`, `plugin:deactivate`, `plugin:uninstall`
- Content hooks: `content:beforeSave`, `content:afterSave`, `content:beforeDelete`, `content:afterDelete`, `content:afterPublish`, `content:afterUnpublish`
- Media hooks: `media:beforeUpload`, `media:afterUpload`
- Comment hooks: `comment:beforeCreate`, `comment:moderate`, `comment:afterCreate`, `comment:afterModerate`
- Email hooks: `email:beforeSend`, `email:afterSend`
- Page hooks: `page:metadata`, `page:fragments`
- Cron scheduling and cleanup
- Storage collections: `audit`, `analytics`, `notifications`, `comments`
- Auto-generated settings with `boolean`, `number`, `url`, `secret`, `email`, and `select` field types
- Admin pages and sidebar integration: Overview, Activity, Comments, Settings
- Dashboard widgets: Activity Summary, Quick Stats, Recent Content
- Public and authenticated plugin API routes with validation
- Custom Portable Text blocks rendered on the public site: `awcms-callout`, `awcms-video`

Declared capabilities use the current EmDash names:

- `content:read`
- `content:write`
- `media:read`
- `media:write`
- `users:read`
- `network:request`
- `email:send`
- `hooks.email-events:register`
- `hooks.page-fragments:register`

## Template

The repository follows the EmDash blog template structure:

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Featured post + latest post grid |
| All Posts | `/posts` | Full post listing |
| Post Detail | `/posts/[slug]` | Portable Text article, comments, widgets |
| Page Detail | `/pages/[slug]` | Static page content |
| Category | `/category/[slug]` | Category archive |
| Tag | `/tag/[slug]` | Tag archive |
| Search | `/search` | Full-text search |
| RSS | `/rss.xml` | Generated feed |

## Schema

- `posts` collection: `title`, `featured_image`, `content`, `excerpt`
- `pages` collection: `title`, `content`
- Taxonomies: `category`, `tag`
- Bylines enabled in seeded content
- Menus: `primary`, `social`
- Widget areas: `sidebar`, `footer`

## Deployment

```bash
wrangler deploy
```

Target deployment domain: `https://awcms-micro.ahlikoding.com`

### Configuration

- **Site URL**: `https://awcms-micro.ahlikoding.com`
- **S3 Storage**: `https://awcms-micro-s3.ahlikoding.com`
- **D1 Database**: `awcms-micro-d1`
- **R2 Bucket**: `awcms-micro-s3`

## Documentation

- EmDash docs: [docs.emdashcms.com](https://docs.emdashcms.com/)
- EmDash docs MCP: [docs.emdashcms.com/docs-mcp](https://docs.emdashcms.com/docs-mcp)
