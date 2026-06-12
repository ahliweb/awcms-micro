---
"@awcms-micro/template-default-cloudflare": minor
"@awcms-micro/template-default-example": minor
---

feat(templates): add human-readable /sitemap page (issue #192)

Adds a locale-aware HTML sitemap page (`src/pages/sitemap.astro`) to both templates. The page lists all public routes grouped by section (Main, Information, Legal, Services, Posts, News) using live CMS data. Page entry slugs are resolved via the top-level `.slug` field to avoid the EN slug being treated as an ID translation identifier.

Footer Resources column now links to `/sitemap` in both templates (done in prior commit; changeset captures the full feature together).
