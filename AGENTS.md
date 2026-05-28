This repository is a parent maintenance workspace for AWCMS-Micro and EmDash alignment.

## Root Layout

- `emdash-latest/`: latest synchronized EmDash source tree
- `awcmsmicro-dev/`: managed clone of `emdash-latest/` used for AWCMS-Micro development
- `docs/`: parent-repository technical documentation
- `scripts/`: root maintenance scripts

## Core Intent

Analyze `https://github.com/emdash-cms/emdash`, then update `https://github.com/ahliweb/awcms-micro` so it stays fully synchronized with EmDash.

`awcms-micro` is an independent repository. It must not act as a host for other repositories in the product or runtime sense. It should serve as an example implementation that fully adopts EmDash 100% and includes only example plugins and example templates that follow the AWCMS-Micro standard, without modifying EmDash core.

Within this parent workspace:

- `emdash-latest/` is the upstream reference snapshot
- `awcmsmicro-dev/` is the development workspace where AWCMS-Micro-specific work is prepared

## Execution Rules

- Proceed step by step using an atomic strategy.
- Prefer small, reviewable changes.
- Rebuild `awcmsmicro-dev/` from `emdash-latest/` before starting new implementation work when synchronization is required.
- Keep AWCMS-Micro release-note inputs and release automation inside preserved downstream boundaries such as `.awcms-changesets/` and `.github/scripts/`.
- Keep the root workspace snapshot in `CHANGELOG.md` aligned with the current EmDash upstream SHA and the latest versions/changelog entries for every plugin and template in `awcmsmicro-dev/`; keep workspace package releases like `awcmsmicro-dev/packages/admin/` aligned with `awcmsmicro-dev/.changeset/`.
- Keep root documentation in sync with the actual folder structure and workflow.
- Keep backup and mirror documentation aligned with the current PAT-based GitLab flow and the safe `.env` overlay used by `scripts/backup/load-config.sh`.
- When work is too large for one pass, split it into smaller tracked tasks.
- If useful, create GitHub issues so work can later be executed by a smaller or lower-cost AI model.

## Language Policy

- English (US) is the official language for this repository's root-level documentation, instructions, scripts, and governance text.
- Preserve `emdash-latest/` exactly as upstream EmDash provides it, including non-US spelling or wording.
- Allow `awcmsmicro-dev/` to inherit upstream wording when it is synchronized from `emdash-latest/`, unless there is a separate AWCMS-Micro-specific reason to change it.
- All active plugins must default to English (`en`) and contain complete, ready-to-use Indonesian (`id`) translations for all key/label definitions.

## Plugin Admin Sidebar Policy

- When any downstream plugin is active, its admin sidebar menu must be positioned at the top, directly below the Dashboard and before default EmDash menus.
- Each plugin's menu items must be grouped into their own distinct collapsible menu group to prevent mixing or cluttering sidebar navigation between different plugins.

## Root Documentation

- `README.md`
- `docs/README.md`
- `docs/awcms-micro-implementation-boundaries.md`
- `docs/repository-structure.md`
- `docs/synchronization-workflow.md`
- `docs/implementation-instructions.md`
- `docs/awcms-micro-versioning.md`
- `docs/awcms-micro-root-versioning.md`
- `docs/operator-workflow.md`
- `docs/decision-records.md`
- `docs/backup/gitlab-mirror-setup.md`
- `docs/security/backup-restore.md`
