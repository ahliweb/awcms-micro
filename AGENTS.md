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

## Required Reading For Agents

Before changing code, docs, scripts, or generated outputs in this workspace, read:

- `README.md`
- `AGENTS.md`
- `docs/README.md`
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

Use `docs/awcms-micro-implementation-boundaries.md` as the source of truth for the list of paths and change categories that must be preserved during `bash scripts/update-awcmsmicro-dev.sh` rebuilds.

## Language Policy

- English (US) is the official language for this repository's root-level documentation, instructions, scripts, and governance text.
- Preserve `emdash-latest/` exactly as upstream EmDash provides it, including non-US spelling or wording.
- Allow `awcmsmicro-dev/` to inherit upstream wording when it is synchronized from `emdash-latest/`, unless there is a separate AWCMS-Micro-specific reason to change it.
- All active plugins must default to English (`en`) and contain complete, ready-to-use Indonesian (`id`) translations for all key/label definitions.

## SIKESRA Plugin Rules

The SIKESRA plugin is a downstream AWCMS-Micro plugin, not an EmDash core feature. Work on it only inside approved downstream boundaries unless an issue explicitly requires a sync-safe root script or root documentation change.

Current SIKESRA implementation backlog is tracked in GitHub issues #119 through #140. These issues are the source of truth for current SIKESRA requirements.

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
- Treat personal addresses as two distinct address groups: KTP address and domicile address.
- Public APIs must expose aggregate-only, public-safe data and must not leak personal, sensitive personal, restricted, KTP address, domicile address, or raw document metadata.
- Use soft delete by default. Permanent delete belongs only to the `sikesra_super_admin` workflow with reason, confirmation, snapshot, audit, and integrity check.
- Preserve SIKESRA data across EmDash updates, dependency reinstalls, workspace rebuilds, local template rebuilds, and Cloudflare rebuilds.
- Add tests or validation scripts whenever a rule is meant to survive rebuilds.

## Plugin Admin Sidebar Policy

- When any downstream plugin is active, its admin sidebar menu must be positioned at the top, directly below the Dashboard and before default EmDash menus.
- Each plugin's menu items must be grouped into their own distinct collapsible menu group to prevent mixing or cluttering sidebar navigation between different plugins.

## Root Documentation

- `README.md`
- `docs/README.md`
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
