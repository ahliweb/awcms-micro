# AWCMS-Micro Changelog

## 0.1.12 - 2026-06-03

- Scopes root code-scanning workflow inputs away from upstream-only snapshots and hardens SIKESRA custom attribute email validation.
## 0.1.11 - 2026-06-03

- Adds the admin welcome modal branding files to the rebuild protected path allowlist.
## 0.1.10 - 2026-06-03

- Brands the admin first-login welcome modal with the AWCMS-Micro logo and AWCMS by AhliWeb.com & EmDash text.
## 0.1.9 - 2026-06-03

- Refreshes the parent workspace snapshot to EmDash cd2dcc6 and records the validated upstream-only Dependabot alert state.
## 0.1.8 - 2026-06-03

- Compact admin sidebar section spacing further, prevent adjacent duplicate separators, and apply AWCMS branding to the standalone admin login page.
## 0.1.7 - 2026-06-03

- Compact the protected admin sidebar group spacing so section groups use professional spacing closer to regular menu item rhythm.
## 0.1.6 - 2026-06-03

- Validate downstream patch overlays against a temporary EmDash snapshot so stale or corrupt rebuild-preservation patches fail before sync.
## 0.1.5 - 2026-06-02

- Separate AWCMS root and EmDash upstream hashes in the admin sidebar footer and normalize sidebar menu group spacing.

## 0.1.4 - 2026-06-02

- Render the admin sidebar footer as separate AWCMS root and EmDash version lines, and document the required automatic root version/changelog update rule for future root-level changes.

## 0.1.3 - 2026-06-01

- Re-encrypts the backup configuration with the current D1 database name and fixes non-interactive backup config encryption.

## 0.1.2 - 2026-06-01

- Fixes backup workflows to target the current `awcms-micro-d1-20260530` D1 database and route D1 exports through the shared backup script.

## 0.1.1 - 2026-06-01

- Aligns the rebuild-protection documentation and boundary validator with the full AWCMS-Micro protected path allowlist.

## 0.1.0 - 2026-05-28

- Introduces the root-level AWCMS-Micro versioning and changelog system for maintenance-workspace changes.

## Workspace Snapshot - 2026-06-03

- EmDash upstream: `cd2dcc6a56d19f38d6e13ba55e8563ceaab90ef8` from `emdash-latest/`
- Root version: `0.1.12`

### Plugins

- `@awcms-micro/plugin-docs` `0.0.1` - (no changelog yet)
- `@awcms-micro/plugin-gallery` `0.0.4` - Fix gallery admin media picking, add media import/listing, and restore paginated gallery management.
- `@awcms-micro/plugin-sikesra` `0.1.1` - Allows trusted EmDash admins to bootstrap SIKESRA admin access and safely falls back when production D1 SIKESRA tables are missing or still use transition-state schemas, preventing protected admin and public status pages from failing during the current transition state.
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
