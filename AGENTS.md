This repository is a parent maintenance workspace for AWCMS-Micro and EmDash alignment.

## Root Layout

- `emdash-latest/`: latest synchronized EmDash source tree
- `awcmsmicro-dev/`: managed clone of `emdash-latest/` used for AWCMS-Micro development
- `docs/`: parent-repository technical documentation
- `scripts/`: root maintenance scripts

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
- `docs/synchronization-workflow.md`
- `docs/implementation-instructions.md`
- `docs/awcms-micro-implementation-boundaries.md`
- `docs/repository-structure.md`
- `docs/operator-workflow.md`

Before changing the SIKESRA plugin, also read:

- `docs/awcms-micro-sikesra-plugin-governance.md`
- `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/README.md`
- `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/IMPLEMENTATION_GOVERNANCE.md`
- `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/TECHNICAL_PRD.md`

For future plugins and templates, read the matching project README/governance/PRD when present and apply the same GitHub issue system.

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
- Use typed contracts when UI, API routes, backend services, and database models interact.
- Use project-specific storage/table prefixes for project-owned data.
- Keep public output public-safe and avoid exposing protected operational data.
- Add Mermaid diagrams when design, architecture, database, UI/UX, integration, security, deployment, migration, or data preservation behavior changes.
- Add tests or validation scripts whenever a rule is meant to survive rebuilds.
- Keep README, AGENTS, PRD, diagrams, and governance docs aligned with issue order and implemented behavior.

## SIKESRA Plugin Rules

The SIKESRA plugin is a downstream AWCMS-Micro plugin, not an EmDash core feature. Work on it only inside approved downstream boundaries unless an issue explicitly requires a sync-safe root script or root documentation change.

Current SIKESRA implementation backlog is tracked in GitHub issues #119 through #143. These issues are the source of truth for current SIKESRA requirements.

Current starting sequence:

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
- Do not modify EmDash core for SIKESRA-specific behavior.
- Put SIKESRA canonical business data in dedicated `sikesra_` D1 tables once the D1 migration work is implemented.
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
- Active plugins and templates must keep English (`en`) source catalogs and complete, reviewed Indonesian (`id`) translations for key labels and user-facing strings.
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
- `docs/awcms-micro-implementation-boundaries.md`
- `docs/awcms-micro-sikesra-plugin-governance.md`
- `docs/repository-structure.md`
- `docs/synchronization-workflow.md`
- `docs/implementation-instructions.md`
- `docs/awcms-micro-versioning.md`
- `docs/awcms-micro-root-versioning.md`
- `docs/operator-workflow.md`
- `docs/decision-records.md`
- `docs/backup/gitlab-mirror-setup.md`
- `docs/security/backup-restore.md`
