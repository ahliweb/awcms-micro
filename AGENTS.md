This repository is a parent maintenance workspace for AWCMS-Micro and EmDash alignment.

## Root Layout

- `emdash-latest/`: latest synchronized EmDash source tree
- `awcmsmicro-dev/`: managed clone of `emdash-latest/` used for AWCMS-Micro development
- `docs/`: parent-repository technical documentation
- `scripts/`: root maintenance scripts

## Current EmDash Version

- **Upstream snapshot (`emdash-latest/`):** EmDash `0.26.0` at `90ffe40a1a31193b2f29ef92202e4f339a2487fa`, fetched 2026-07-02.
- **Development workspace (`awcmsmicro-dev/`):** rebuilt from EmDash `0.26.0` at `90ffe40a1a31193b2f29ef92202e4f339a2487fa` with approved AWCMS-Micro overlays replayed; full validation passed 2026-07-02.
- **Production status:** observed on Worker version `5be81778-b5ba-45e5-aa1c-164655845a5d`, deployed 2026-07-02T04:14:49Z; smoke checks passed; D1 migrations 044-048 are applied and verified; scheduled publishing was verified end to end on 2026-07-02. Previous 0.19.0 production reference was version `0ef03174-32c5-46c7-9fbe-51b3adc8fa5b` from 2026-06-13.
- **2026-07-02 sync status:** GitHub was current, production D1 was backed up to `r2://awcms-micro-backups/backups/db/backup-20260702-100524.sql.enc`, `emdash-latest/` was refreshed to `0.26.0`, `awcmsmicro-dev/` was rebuilt and validated, production D1 migration 044-048 verification was recorded in `docs/upstream-sync/EMDASH_0_26_D1_MIGRATION_VERIFICATION.md`, Cloudflare architecture adoption decisions were recorded in `docs/upstream-sync/EMDASH_0_26_CLOUDFLARE_ARCHITECTURE_DECISIONS.md`, and GitHub issues #220-#223 were closed.

### Key 0.19.0 Features

- **Scheduled publishing heartbeat fix** (`publishDueContent` sweep): content scheduled via the admin now actually transitions to `published` when its time arrives. The `PiggybackScheduler` (request-side-effect based) is removed; a real Cron Trigger drives the sweep. AWCMS-Micro templates already have the required `src/worker.ts` and `wrangler.jsonc` from the 0.18.0 sync — no additional template changes needed. Production Cron Trigger `* * * * *` confirmed live via Cloudflare API (2026-06-13), and end-to-end production scheduling verified on 2026-07-02: a temporary scheduled post published within the next cron tick, `published_at` matched `scheduled_at`, the unscheduled guard row stayed draft, Worker logs recorded `[scheduled] Published 1 scheduled item(s)`, and test rows were removed.
- **Migration 043** (already applied in production): adds `_emdash_relations` (relationship-type definitions, row-per-locale) and `_emdash_content_references` (directed edges between content entries) tables. Applied to production at the 0.18.0 sync. Documented in `awcmsmicro-dev/docs/awcms-micro/content-references.md` with ER Mermaid diagram and planned AWCMS-Micro relation types (see issue #202).
- **`getEntriesByByline()`**: new helper returning all entries credited to a byline in any position (including co-authored). Author archive pages (`/authors`, `/authors/[slug]`) implemented in both default templates (issue #204 closed). `getEmDashCollection` also accepts `where: { byline: translationGroup }` to filter by byline credit.
- **Responsive srcset for media**: EmDash routes media through Astro's configured image service (Cloudflare Images on Workers, sharp on Node), producing width-appropriate candidates and modern formats. Automatic — no template changes required.
- **Admin content list filtering**: `authorId`, `dateField`, `dateFrom`, `dateTo` query params added to the content list API. New `GET /_emdash/api/content/{collection}/authors` endpoint lists distinct content authors. Server-side filtering across the full collection.
- **`RelationRepository`** (`packages/core/src/database/repositories/relation.ts`): data layer for content references. Groundwork only — no field type, API, or admin UI yet.
- **Bug fixes**: `getTaxonomyTerms()` now returns `description` for flat (non-hierarchical) taxonomies; seed CLI `export-seed`/`seed` preserves non-`en` default locales; taxonomy terms are hydrated in the entry's resolved locale (not the request-context locale).
- **`create-emdash` scaffold**: new Cloudflare projects now scaffold `.env` instead of `.dev.vars` for secrets (landed in HEAD after 0.19.0 tag).
- **TaxonomyTerm hydration** (carried from 0.18.0): taxonomy terms are attached directly to entries as `entry.data.terms?: Record<string, TaxonomyTerm[]>`. No separate `getEntryTerms()` call needed.
- **D1 batch coalescing** (carried from 0.18.0): same-turn SELECT queries are batched into one `D1.batch()` round trip, reducing per-request query counts automatically.
- **`emdash-env.d.ts`**: this file is tracked in git and must be updated manually when EmDash adds new exported types. It does not regenerate automatically without a dev server restart.

### Key 0.20.0-0.26.0 Upstream Additions

- **Migrations 044-048:** comment reactions, taxonomy parent translation-group backfill, media usage index tables, and restored taxonomy indexes. Present in the synchronized local/dev workspaces and verified in production D1 on 2026-07-02.
- **Cloudflare architecture options:** Durable Object SQLite adapter, Hyperdrive adapter with optional cached binding, KV-backed object cache, Cloudflare media image endpoint improvements, and Cloudflare Email Sending provider plugin. #222 keeps the AWCMS-Micro Cloudflare template on D1 + R2 + session KV + Images + Worker Loader, adopts additive media/search improvements from upstream, and defers new DO/Hyperdrive/cache/email bindings to focused future issues.
- **Public/runtime improvements:** offset pagination for `getEmDashCollection`, LiveSearch route templates, public search suggestions, CSP-compatible JSON-LD, sitemap hreflang fixes, text alignment round-trip rendering, media LQIP placeholders, and content schedule/restore hooks.
- **Admin improvements:** Kumo sidebar behavior updates, repeater select typeahead, byline avatar picker, route-scoped admin CSS, CJK editor metrics, code block picker focus fix, and additional admin locales. Downstream AWCMS-Micro admin/sidebar overlays replay cleanly after the 0.26.0 rebuild.

For detailed architecture documentation and Mermaid diagrams, read `awcmsmicro-dev/docs/awcms-micro/scheduled-publishing.md`.

## Core Intent

Analyze `https://github.com/emdash-cms/emdash`, then update `https://github.com/ahliweb/awcms-micro` so it stays fully synchronized with EmDash.

`awcms-micro` is an independent repository. It must not act as a host for other repositories in the product or runtime sense. It should serve as an implementation workspace that fully adopts EmDash 100% and includes only AWCMS-Micro plugins and templates that follow the AWCMS-Micro standard, without modifying EmDash core.

Within this parent workspace:

- `emdash-latest/` is the upstream reference snapshot
- `awcmsmicro-dev/` is the development workspace where AWCMS-Micro-specific work is prepared

## Execution Rules

- Proceed step by step using an atomic strategy.
- Always analyze the current upstream/downstream state before starting an update or sync pass.
- If analysis shows `scripts/` or validation workflow changes are required to preserve a downstream change, stop the update and adjust those scripts/docs first.
- Prefer small, reviewable changes.
- Rebuild `awcmsmicro-dev/` from `emdash-latest/` before starting new implementation work when synchronization is required.
- Keep AWCMS-Micro release-note inputs and release automation inside preserved downstream boundaries such as `.awcms-changesets/` and `.github/scripts/`.
- Keep any persistent source-level downstream tweaks as patch overlays in `awcmsmicro-dev/.awcms-patches/` and replay them through `scripts/update-awcmsmicro-dev.sh`; also update the sync/validation scripts and protected-path rules so those changes survive future rebuilds instead of being lost.
- Keep the root workspace snapshot in `CHANGELOG.md` aligned with the current EmDash upstream SHA and the latest versions/changelog entries for every plugin and template in `awcmsmicro-dev/`; keep workspace package releases like `awcmsmicro-dev/packages/admin/` aligned with `awcmsmicro-dev/.changeset/`.
- Keep root documentation in sync with the actual folder structure and workflow.
- Keep backup and mirror documentation aligned with the current PAT-based GitLab flow and the safe `.env` overlay used by `scripts/backup/load-config.sh`.
- Check `docs/operator-workflow.md` for `continuation` vs `fresh-clone` update mode guidance before sync work, especially when fresh-clone bootstrap values must be captured locally.
- When work is too large for one pass, split it into smaller tracked tasks.
- If useful, create GitHub issues so work can later be executed by a smaller or lower-cost AI model.

## GitHub Issue System For Agents

GitHub issues in this repository are implementation contracts for all AWCMS-Micro projects.

This standard applies to:

- plugins;
- templates;
- database and D1 work;
- UI/UX;
- frontend;
- backend;
- API and integration contracts;
- security and compliance;
- Cloudflare deployment;
- tests and QA;
- documentation;
- upstream sync and rebuild safety.

Before creating, updating, or executing issue-driven work, read:

```txt
docs/awcms-micro-github-issue-system.md
docs/awcms-micro-mermaid-diagram-standard.md
```

Required behavior:

- Follow `SEQ` order before issue creation order.
- Treat `SEQ-XXA` as an inserted dependency between two existing sequence steps.
- Treat `P0` as foundation, security, data safety, compatibility, or build-critical work.
- Do not start later workflow issues before earlier identity, route, UI/UX, naming, guardrail, migration, repository, integration-contract, field-standard, RBAC/ABAC, audit, and required diagram foundations are ready.
- Read related issues before implementation.
- Check whether Mermaid diagrams are required before creating or executing an issue.
- Add or update Mermaid diagrams when work changes architecture, database schema, UI/UX flow, frontend-backend integration, security decision flow, deployment topology, migration, or data preservation.
- Keep changes atomic and aligned with the issue acceptance criteria.
- If a behavior change makes docs stale, update docs in the same PR or a focused follow-up docs PR.
- Do not silently implement behavior that contradicts the current issue sequence.
- For every large plugin/template/database/UI/API/security/deployment project, keep a project-specific ordered backlog in a README, governance doc, PRD, or issue index.

## Required Reading For Agents

Before changing code, docs, scripts, or generated outputs in this workspace, read:

- `README.md`
- `AGENTS.md`
- `docs/README.md`
- `docs/awcms-micro-github-issue-system.md`
- `docs/awcms-micro-mermaid-diagram-standard.md`
- `docs/awcms-micro-documentation-workflow.md`
- `docs/synchronization-workflow.md`
- `docs/implementation-instructions.md`
- `docs/awcms-micro-implementation-boundaries.md`
- `docs/ahliweb-architecture-decisions.md`
- `docs/repository-structure.md`
- `docs/operator-workflow.md`

Before changing the SIKESRA plugin, also read:

- `docs/awcms-micro-sikesra-plugin-governance.md`
- `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/README.md`
- `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/IMPLEMENTATION_GOVERNANCE.md`
- `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/TECHNICAL_PRD.md`

Before changing the AWCMS-Micro docs plugin, also read:

- `awcmsmicro-dev/packages/plugins/awcms-micro-docs/README.md`

Before changing the AWCMS-Micro gallery plugin, also read:

- `awcmsmicro-dev/packages/plugins/awcms-micro-gallery/README.md`
- `awcmsmicro-dev/packages/plugins/awcms-micro-gallery/docs/TECHNICAL_PRD.md`
- `awcmsmicro-dev/packages/plugins/awcms-micro-gallery/docs/SECURITY.md`

Before changing the AWCMS-Micro Email Mailketing plugin, also read:

- `awcmsmicro-dev/packages/plugins/awcms-micro-email-mailketing/README.md`
- `awcmsmicro-dev/packages/plugins/awcms-micro-email-mailketing/docs/IMPLEMENTATION_GOVERNANCE.md`
- `awcmsmicro-dev/packages/plugins/awcms-micro-email-mailketing/docs/TECHNICAL_PRD.md`
- `awcmsmicro-dev/packages/plugins/awcms-micro-email-mailketing/docs/SECURITY.md`

Before changing the default templates' public pages, also read:

- `awcmsmicro-dev/templates/awcms-micro-default-cloudflare/docs/PUBLIC_ARCHITECTURE.md`
- `awcmsmicro-dev/templates/awcms-micro-default/docs/PUBLIC_ARCHITECTURE.md`

Before changing the Cloudflare worker entry point, cron triggers, or scheduled publishing behavior, also read:

- `awcmsmicro-dev/docs/awcms-micro/scheduled-publishing.md`

Before implementing content-to-content relationships or seeding `_emdash_relations` / `_emdash_content_references`, read:

- `awcmsmicro-dev/docs/awcms-micro/content-references.md`

The default templates' public pages follow the ahliweb.com (ahliwebcom) section architecture while staying CMS-sourced and admin-integrated. Keep both templates consistent, source content from EmDash collections (not hardcoded), and use the shared `src/styles/public.css` and `src/components/public/` instead of duplicating styles. New public page types should be admin-editable EmDash collections with EN/ID content and `seo` support so they flow into the auto-injected sitemap.

Current public route inventory (both default templates):
`/`, `/posts`, `/posts/[slug]`, `/news`, `/news/[slug]`, `/services`, `/services/[slug]`, `/gallery`, `/gallery/[slug]`, `/portfolio`, `/portfolio/[slug]`, `/testimonials`, `/authors`, `/authors/[slug]`, `/[slug]` (CMS pages), `/sitemap`, `/aggregate`, `/sikesra`, `/docs`.

When adding new i18n strings to a template's `src/locales/messages.ts`, also add matching `msgctxt` entries to all four PO catalogs (`en/messages.po` and `id/messages.po` in both templates) and run `node --test templates/awcms-micro-default/tests/locales.test.mjs templates/awcms-micro-default-cloudflare/tests/locales.test.mjs` to verify all 5 locale tests pass.

For future plugins and templates, read the matching project README/governance/PRD when present and apply the same GitHub issue system.

Before planning, designing, or implementing a mobile services plugin for Android, iOS, Flutter, native Java/Kotlin, Swift, API authentication, mobile app versioning, push notifications, or offline sync, read:

- `docs/awcms-micro-mobile-services-plugin-standard.md`

Use `docs/awcms-micro-implementation-boundaries.md` as the source of truth for the list of paths and change categories that must be preserved during `bash scripts/update-awcmsmicro-dev.sh` rebuilds.

## Language Policy

- English (US) is the official language for this repository's root-level documentation, instructions, scripts, and governance text.
- Preserve `emdash-latest/` exactly as upstream EmDash provides it, including non-US spelling or wording.
- Allow `awcmsmicro-dev/` to inherit upstream wording when it is synchronized from `emdash-latest/`, unless there is a separate AWCMS-Micro-specific reason to change it.
- All active plugins must default to English (`en`) and contain complete, ready-to-use Indonesian (`id`) translations for all key/label definitions.

## General AWCMS-Micro Project Rules

These rules apply to every plugin, template, database, UI/UX, API, integration, security, deployment, and documentation project:

- Keep custom behavior inside approved AWCMS-Micro boundaries.
- Do not modify EmDash core for project-specific behavior unless an issue explicitly justifies it as upstream work.
- Do not implement `highly_restricted` production workloads in AWCMS-Micro/D1. SIKESRA/SatuSehatKobar-style production systems belong in AWCMS-Mini with PostgreSQL, mandatory RLS, and stronger audit controls.
- Use typed contracts when UI, API routes, backend services, and database models interact.
- **Plugin admin export pattern (critical):** Every plugin `admin.tsx` must use named exports, not `export default`. EmDash's `virtual:emdash/admin-registry` does `import * as admin0 from adminEntry` — pages must be at `admin0.pages`, not `admin0.default.pages`. Use `export const pages: PluginAdminExports["pages"] = { "/": ComponentRef }` where `ComponentRef` is a React component reference (not rendered JSX `<Component />`). Wrong pattern: `export default { pages: { "/": <Component /> } }`.
- Every plugin that owns Cloudflare D1 tables or EmDash plugin storage collections must use a dedicated `{prefix}_` for all table and collection names. The prefix must be unique to the plugin and consistent across all its tables. Register the prefix in `docs/awcms-micro-implementation-boundaries.md` before adding migrations. Do not share a prefix between plugins, and do not store plugin data in unprefixed or `ec_*` tables.
- Keep public output public-safe and avoid exposing protected operational data.
- **Supply-chain security overrides:** When Dependabot alerts are open for a transitive dependency, add a `pnpm overrides` entry to the relevant `pnpm-workspace.yaml` (with a comment citing the GHSA IDs and vulnerability description) and run `pnpm install` to update the lockfile. Apply to all four affected workspaces when the same package is flagged in `awcmsmicro-dev/`, `awcmsmicro-dev/.flue/`, `emdash-latest/`, and `emdash-latest/.flue/`. The `emdash-latest/` override must carry a note to re-check on next upstream sync.
- Add Mermaid diagrams when design, architecture, database, UI/UX, integration, security, deployment, migration, or data preservation behavior changes.
- For documentation changes, follow `docs/awcms-micro-documentation-workflow.md`: decide whether to update or create a document, add Mermaid diagrams when required, update README indexes, update `AGENTS.md` when agent rules change, and review status/diff before finalizing.
- Add tests or validation scripts whenever a rule is meant to survive rebuilds.
- Keep README, AGENTS, PRD, diagrams, and governance docs aligned with issue order and implemented behavior.

## SIKESRA Plugin Rules

The SIKESRA plugin is a downstream AWCMS-Micro plugin, not an EmDash core feature. Work on it only inside approved downstream boundaries unless an issue explicitly requires a sync-safe root script or root documentation change.

Current SIKESRA production development has moved to AWCMS-Mini. In this repository, `awcms-micro-sikesra` is deprecated and frozen under issue #210. GitHub issues #119 through #143 remain historical design contracts and compatibility references only; do not use them to add new Micro production features unless a later issue explicitly reopens maintenance-only work.

Frozen historical starting sequence:

```txt
#140 plugin identity
#141 admin dashboard route bug fix
#142 admin UI/UX design system
#119 sikesra_ naming policy
#121 prefix validation test
#136 EmDash update/rebuild compatibility
#137 data preservation guardrails
#120 D1 migration framework
#122 D1 repository layer
#143 typed frontend-backend-D1 integration contract
```

Required rules for agents:

- Finalize plugin identity as `AWCMS-Micro SIKESRA Plugin`; do not introduce new `example plugin` naming.
- Keep the plugin slug stable as `awcms-micro-sikesra`.
- Prefer `awcmsMicroSikesraPlugin`; keep `awcmsMicroExamplePlugin` only as a temporary deprecated alias while migration is required.
- Do not add new SIKESRA production features to AWCMS-Micro; production SIKESRA belongs in AWCMS-Mini.
- Do not modify EmDash core for SIKESRA-specific behavior.
- Treat any existing Micro `sikesra_` data as compatibility, historical, or migration-source data; canonical production data belongs in AWCMS-Mini.
- Keep any plugin storage collection under the `sikesra_` prefix.
- Do not store SIKESRA canonical production data in generic EmDash core tables or unprefixed plugin collections.
- Use EmDash users as shared identity references; do not duplicate, reset, or delete EmDash core user accounts from the SIKESRA plugin.
- Store SIKESRA roles, permissions, scopes, user assignments, ABAC attributes, ABAC policies, and audit data in `sikesra_` tables.
- Integrate admin UI, API routes, service layer, repository layer, serializers, and D1 tables through typed contracts.
- Treat personal addresses as two distinct address groups: KTP address and domicile address.
- Public APIs must expose aggregate-only, public-safe data and must not leak personal, sensitive personal, restricted, KTP address, domicile address, or raw document metadata.
- Use soft delete by default. Permanent delete belongs only to the `sikesra_super_admin` workflow with reason, confirmation, snapshot, audit, and integrity check.
- Preserve SIKESRA data across EmDash updates, dependency reinstalls, workspace rebuilds, local template rebuilds, and Cloudflare rebuilds.
- Add tests or validation scripts whenever a rule is meant to survive rebuilds.

## AWCMS-Micro I18N Rules

- AWCMS-Micro plugins and templates must use Lingui-compatible gettext PO catalogs for user-facing translation work; follow `awcmsmicro-dev/docs/awcms-micro/i18n-po-translation-standard.md`.
- Plugin catalogs must live at `awcmsmicro-dev/packages/plugins/<plugin-id>/src/locales/{en,id}/messages.po`; template catalogs must live at `awcmsmicro-dev/templates/<template-id>/src/locales/{en,id}/messages.po`.
- Active plugins and templates must keep English (`en`) source catalogs and complete, reviewed Indonesian (`id`) translations for navigation, settings, validation messages, accessibility text, public template copy, key labels, and other user-facing strings.
- Do not add new plugin or template translations only as inline manifest `i18n.messages` maps or code-level copy objects unless they are temporary compatibility adapters during migration.
- Preserve placeholders such as `{error}` and XML-style tags such as `<0>` and `</0>` exactly in translations.
- AI-assisted translations require fluent or native speaker review and UI preview before they are treated as ready.

## Plugin Admin Sidebar Policy

- When any downstream plugin is active, its admin sidebar menu must be positioned at the top, directly below the Dashboard and before default EmDash menus.
- Each plugin's menu items must be grouped into their own distinct collapsible menu group to prevent mixing or cluttering sidebar navigation between different plugins.

## Root Documentation

- `README.md`
- `docs/README.md`
- `docs/awcms-micro-github-issue-system.md`
- `docs/awcms-micro-mermaid-diagram-standard.md`
- `docs/awcms-micro-documentation-workflow.md`
- `docs/awcms-micro-implementation-boundaries.md`
- `docs/ahliweb-architecture-decisions.md`
- `docs/awcms-micro-sikesra-plugin-governance.md`
- `docs/awcms-micro-mobile-services-plugin-standard.md`
- `docs/repository-structure.md`
- `docs/synchronization-workflow.md`
- `docs/implementation-instructions.md`
- `docs/awcms-micro-versioning.md`
- `docs/awcms-micro-root-versioning.md`
- `docs/operator-workflow.md`
- `docs/decision-records.md`
- `docs/backup/gitlab-mirror-setup.md`
- `docs/security/backup-restore.md`
- `awcmsmicro-dev/docs/awcms-micro/scheduled-publishing.md`
