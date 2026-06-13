# AWCMS-Micro Changelog

## 0.1.40 - 2026-06-13

- Fix plugin admin 404 errors for `awcms-micro-website-social` and `awcms-micro-docs`: both used `export default { pages: { "/": <Component /> } }` (rendered JSX, default export) which EmDash's `virtual:emdash/admin-registry` cannot reach via `import * as admin0` — pages were at `admin0.default.pages` (undefined at `admin0.pages`), causing `usePluginPage()` → null → `SandboxedPluginPage` → POST 404. Fixed to `export const pages: PluginAdminExports["pages"] = { "/": ComponentRef }` (named export, component reference). Author archive pages (`/authors`, `/authors/[slug]`) added to both default templates with TypeScript-in-JSX fix (data pre-processed in Astro frontmatter as `PostRow[]` to avoid esbuild misreading `Record<string, unknown>` generics as JSX). Deployed to production (Version ID: f0c5fbc4-66a8-47be-adf4-66e3f20bb6a2).

## 0.1.39 - 2026-06-13

- Implement GitHub issues #202, #204, #205: (1) `awcmsmicro-dev/docs/awcms-micro/content-references.md` — documents the EmDash 0.18.0+ content references schema (`_emdash_relations` + `_emdash_content_references`) with ER and data-flow Mermaid diagrams, planned AWCMS-Micro relation types, and implementation checklist; docs/awcms-micro/README.md index updated. (2) Author archive pages added to both default templates (`/authors` and `/authors/[slug]`) using `getEntriesByByline()` (EmDash 0.19.0), bilingual EN/ID strings in messages.ts and all 4 PO catalogs, sitemap.astro updated; all 5 locale tests pass. (3) Issue #205 verified: production Cron Trigger `* * * * *` confirmed live via Cloudflare API, worker.ts and wrangler.jsonc configuration confirmed correct; verification comment posted on GitHub issue.

## 0.1.38 - 2026-06-12

- Sync emdash-latest and awcmsmicro-dev to EmDash 0.19.0 (upstream HEAD 34dd430b35). Key changes: scheduled publishing heartbeat fix (publishDueContent sweep replaces PiggybackScheduler), migration 043 (_emdash_relations + _emdash_content_references tables, first-time apply in production), getEntriesByByline() helper for author archive pages, responsive srcset via Astro image service, status/author/date-range filtering in admin content list, getTaxonomyTerms() description fix for flat taxonomies, seed CLI locale fix. Patch 0007-core-vite context updated for @vitest/ui ^4.1.8 bump. GitHub issues #204 (author archive pages) and #205 (scheduled publishing verification) created.
## 0.1.37 - 2026-06-12

- chore(sync): sync emdash-latest and awcmsmicro-dev to EmDash 0.18.0 - `emdash-latest/` refreshed to upstream EmDash `ff5855ab` (version 0.18.0) - `awcmsmicro-dev/` rebuilt with all downstream patches; patch `0016-cloudflare-astro.patch` updated for new cloudflare package.json context (added `@astrojs/cloudflare` peerDependency line) - Production D1 backed up to R2 before sync (`backup-20260612-210105.sql.enc`) - GitHub issues #201 (Cloudflare scheduled publishing worker) and #202 (content references planning) created - `docs/upstream-sync/UPSTREAM_SYNC_STATUS.md` and `LAST_UPSTREAM_FETCH.md` updated - `docs/synchronization-workflow.md` Mermaid diagram expanded with DB backup, patch-fix, and deploy steps - `awcmsmicro-dev/docs/awcms-micro/scheduled-publishing.md` created — architecture doc with Mermaid diagrams for scheduled publishing, D1 coalescing, content references schema, and Node.js scheduler state machine - `README.md` root structure Mermaid diagram improved; EmDash version reference updated to 0.18.0
## 0.1.36 - 2026-06-12

- Document the ahliweb.com (ahliwebcom) public-page architecture adopted by both default templates: a shared CMS-sourced public design system, ported public components, a client-side Mermaid initializer, and an admin-editable `services` collection with `/services` routes seeded with ten bilingual services. Updates root `README.md` and `AGENTS.md` with a templates public-architecture reading reference, and adds `docs/PUBLIC_ARCHITECTURE.md` to each default template. Downstream template version bumps are tracked via `awcmsmicro-dev/.awcms-changesets/`.
## 0.1.35 - 2026-06-12

- Formalizes the Cloudflare D1 table and storage collection prefix standard across all project documentation. Expands the one-line storage rule in `docs/awcms-micro-implementation-boundaries.md` into a full "D1 Table and Storage Collection Prefix Standard" section with a Mermaid isolation diagram, the active prefix registry for all current and planned plugins, and step-by-step guidance for registering a new plugin prefix. Updates `AGENTS.md` General Rules and `README.md` Repository Rules to explicitly require unique `{prefix}_` naming for all plugin-owned D1 tables and storage collections.
## 0.1.34 - 2026-06-12

- Adds `docs/IMPLEMENTATION_GOVERNANCE.md`, `docs/TECHNICAL_PRD.md`, and `docs/SECURITY.md` to the `awcms-micro-email-mailketing` plugin; updates root `AGENTS.md` to require reading all three governance documents before changing the plugin. Closes #187.
## 0.1.33 - 2026-06-12

- Adds `awcms-micro-email-mailketing` to the protected-path documentation and all plugin inventory lists that were missing it; adds the email-mailketing scope to the versioning doc and release-readiness checklist; adds Mermaid diagrams to `implementation-instructions.md`, `decision-records.md`, and `awcms-micro-d1-mirror-sync.md`; adds the email-mailketing Required References entry to `implementation-instructions.md`; fixes a pre-existing blank-line lint issue in `README.md`.
## 0.1.32 - 2026-06-08

- Record the production redeploy that aligned the Cloudflare template D1 database name with the current production D1 resource.
## 0.1.31 - 2026-06-08

- Align root deployment, D1, backup, and repository inventory documentation with the current production Worker, D1 database, and Wrangler validation state.
## 0.1.30 - 2026-06-08

- Align the protected-path documentation and boundary validation contract with the existing `awcms-micro-website-social` downstream plugin boundary.
- Wire SIKESRA data-safety guardrails into root workspace validation and expand static migration/data-boundary checks.
## 0.1.29 - 2026-06-06

- Updates root documentation to match the current AWCMS-Micro plugin inventory, downstream boundary wording, maintenance scripts, and release-readiness guidance.
## 0.1.28 - 2026-06-05

- Adds the official AWCMS-Micro mobile services plugin standard covering Android, iOS, Flutter, native mobile, API authentication, authorization, database, admin UI, deployment, monitoring, notifications, offline sync, app versioning, and governance requirements.
## 0.1.27 - 2026-06-05

- Adds Mermaid diagrams to AWCMS-Micro root and downstream documentation for repository structure, synchronization, deployment, security, versioning, backup, and plugin/template workflows.
## 0.1.26 - 2026-06-05

- Records the production Cloudflare deployment of the synchronized AWCMS-Micro workspace and the successful post-deploy smoke checks.
## 0.1.25 - 2026-06-05

- Refreshes the parent workspace to upstream EmDash 0.17.2, records the new upstream sync status, and validates downstream AWCMS-Micro plugin and template compatibility.
## 0.1.24 - 2026-06-04

- Adds SIKESRA-specific OpenCode skills for plugin governance, admin workflows, D1 data modeling, RBAC/ABAC audit controls, and document/import/export lifecycle work.
## 0.1.23 - 2026-06-04

- Adds project OpenCode skills for frontend UI/UX, backend services, and D1/PostgreSQL database work so future agents apply AWCMS-Micro and EmDash guardrails consistently.
## 0.1.22 - 2026-06-04

- Updates the downstream workspace toolchain to `pnpm` 11.5.1 and the sync-safe Wrangler catalog baseline to 4.97.0.
## 0.1.21 - 2026-06-04

- Refreshes `emdash-latest` and `awcmsmicro-dev` to upstream EmDash `a6e8a91`, preserves approved downstream boundaries, and records the successful downstream validation.
## 0.1.20 - 2026-06-04

- Adds validation that every Markdown document under `docs/` is indexed from `docs/README.md`.
## 0.1.19 - 2026-06-04

- Completes the root documentation index coverage so every Markdown document under `docs/` is discoverable from `docs/README.md`.
## 0.1.18 - 2026-06-04

- Adds the root documentation workflow standard for deciding when to update docs, create docs, add Mermaid diagrams, refresh README indexes, and update agent rules.
## 0.1.17 - 2026-06-04

- Adds boundary validation for tracked temporary artifacts and removes committed scratch files from the SIKESRA protected boundary.
## 0.1.16 - 2026-06-04

- Refreshes the parent workspace snapshot to EmDash 73b5cf4 and records the downstream admin sidebar compatibility guard needed for the latest upstream byline schema UI.
## 0.1.15 - 2026-06-04

- Adds boundary validation coverage for the protected admin welcome modal branding files so their rebuild-safe status is checked with the other admin persistence surfaces.
## 0.1.14 - 2026-06-03

- Preserve the AWCMS admin welcome modal after successful login by adding a sync-safe downstream overlay and divergence record.
## 0.1.13 - 2026-06-03

- Marks downstream patch overlays as generated patch files so source whitespace checks do not fail on patch hunk content.
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

## Workspace Snapshot - 2026-06-12

- EmDash upstream: `34dd430b35032535a972e9ed718c0eacaeae2029` from `emdash-latest/`
- Root version: `0.1.38`

### Plugins

- `@awcms-micro/plugin-docs` `0.0.1` - (no changelog yet)
- `@awcms-micro/plugin-email-mailketing` `0.2.0` - Fixes Mailketing API integration: corrects base URL to `api.mailketing.co.id` subdomain, switches authentication from `Authorization: Bearer` header to `api_token` form field, changes content type to `application/x-www-form-urlencoded`, and aligns request field names (`recipient`, `from_email`, `content`) with the Mailketing API spec. - `testConnection` now correctly detects HTTP 5xx server errors and invalid-token strings in the API response body instead of only checking for HTTP 401. - Send error messages now include the API response body (truncated) so failed entries in the Send Log show the actual rejection reason. - Send Log table shows a new `Error` column for failed entries. - Adds `EmailStatusWidget` and `SendStatsWidget` dashboard widget components as a named `widgets` export from `admin.tsx`, fixing 404 errors shown for the "Email Status" and "Send Statistics" cards on the EmDash admin dashboard.
- `@awcms-micro/plugin-gallery` `0.0.4` - Fix gallery admin media picking, add media import/listing, and restore paginated gallery management.
- `@awcms-micro/plugin-sikesra` `0.1.1` - Allows trusted EmDash admins to bootstrap SIKESRA admin access and safely falls back when production D1 SIKESRA tables are missing or still use transition-state schemas, preventing protected admin and public status pages from failing during the current transition state.
- `@awcms-micro/plugin-website-social` `0.0.1` - (no changelog yet)
- `@emdash-cms/plugin-ai-moderation` `0.2.0` - latest changelog section: 0.2.0
- `@emdash-cms/plugin-api-test` `0.0.3` - latest changelog section: 0.0.3
- `@emdash-cms/plugin-atproto` `0.2.0` - latest changelog section: 0.2.0
- `@emdash-cms/plugin-audit-log` `0.2.0` - latest changelog section: 0.2.0
- `@emdash-cms/plugin-color` `0.2.0` - latest changelog section: 0.2.0
- `@emdash-cms/plugin-embeds` `0.1.23` - latest changelog section: 0.1.23
- `@emdash-cms/plugin-field-kit` `0.1.0` - latest changelog section: 0.1.0
- `@emdash-cms/plugin-forms` `0.2.4` - latest changelog section: 0.2.4
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
