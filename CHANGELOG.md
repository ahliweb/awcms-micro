# AWCMS-Micro Changelog

## 0.1.2 - 2026-06-01

- Fixes backup workflows to target the current `awcms-micro-d1-20260530` D1 database and route D1 exports through the shared backup script.

## 0.1.1 - 2026-06-01

- Aligns the rebuild-protection documentation and boundary validator with the full AWCMS-Micro protected path allowlist.

## 0.1.0 - 2026-05-28

- Introduces the root-level AWCMS-Micro versioning and changelog system for maintenance-workspace changes.

## Workspace Snapshot - 2026-06-01

- EmDash upstream: `d43a3808fbef4e2e0e2881428d57c6336eb33e51` from `emdash-latest/`
- Root version: `0.1.2`

### Plugins

- `@awcms-micro/plugin-docs` `0.0.1` - (no changelog yet)
- `@awcms-micro/plugin-gallery` `0.0.4` - Fix gallery admin media picking, add media import/listing, and restore paginated gallery management.
- `@awcms-micro/plugin-sikesra` `0.1.1` - Localizes the plugin-local navigation fallback copy, ABAC helper labels, and verification flow notes so the SIKESRA plugin surface stays aligned with the active locale.
- `@emdash-cms/plugin-ai-moderation` `0.2.0` - latest changelog section: 0.2.0
- `@emdash-cms/plugin-api-test` `0.0.3` - latest changelog section: 0.0.3
- `@emdash-cms/plugin-atproto` `0.2.0` - latest changelog section: 0.2.0
- `@emdash-cms/plugin-audit-log` `0.2.0` - latest changelog section: 0.2.0
- `@emdash-cms/plugin-color` `0.2.0` - latest changelog section: 0.2.0
- `@emdash-cms/plugin-embeds` `0.1.18` - latest changelog section: 0.1.18
- `@emdash-cms/plugin-field-kit` `0.1.0` - latest changelog section: 0.1.0
- `@emdash-cms/plugin-forms` `0.2.3` - latest changelog section: 0.2.3
- `@emdash-cms/plugin-marketplace-test` `0.1.2` - latest changelog section: 0.1.2
- `@emdash-cms/plugin-sandboxed-test` `0.0.3` - latest changelog section: 0.0.3
- `@emdash-cms/plugin-webhook-notifier` `0.2.0` - latest changelog section: 0.2.0

### Templates

- `@awcms-micro/template-default-cloudflare` `0.1.0` - Updates the AWCMS-Micro gallery and Cloudflare template release surfaces so the versioning flow covers both plugin-owned media helpers and the Cloudflare-first reference template.
- `@awcms-micro/template-default-example` `0.0.2` - Adds plugin-owned navigation exports for the AWCMS-Micro SIKESRA plugin and updates the default Node template guidance to match the plugin-and-template-only release model.
- `@emdash-cms/template-blank` `0.0.3` - latest changelog section: 0.0.3
- `@emdash-cms/template-blog` `0.0.3` - latest changelog section: 0.0.3
- `@emdash-cms/template-blog-cloudflare` `0.0.3` - latest changelog section: 0.0.3
- `@emdash-cms/template-marketing` `0.0.3` - latest changelog section: 0.0.3
- `@emdash-cms/template-marketing-cloudflare` `0.0.3` - latest changelog section: 0.0.3
- `@emdash-cms/template-portfolio` `0.0.3` - latest changelog section: 0.0.3
- `@emdash-cms/template-portfolio-cloudflare` `0.0.3` - latest changelog section: 0.0.3
- `@emdash-cms/template-starter` `0.0.3` - latest changelog section: 0.0.3
- `@emdash-cms/template-starter-cloudflare` `0.0.3` - latest changelog section: 0.0.3
