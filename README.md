# AWCMS-Micro Parent Repository

This repository is the parent maintenance workspace for keeping AWCMS-Micro aligned with the latest EmDash source.

## Purpose

Analyze `https://github.com/emdash-cms/emdash`, then update `https://github.com/ahliweb/awcms-micro` so it stays fully synchronized with EmDash.

`awcms-micro` is an independent repository. It must not act as a host for other repositories in the product or runtime sense. It should serve as an example implementation that adopts EmDash 100% and includes only example plugins and example templates that follow the AWCMS-Micro standard, without modifying EmDash core.

AWCMS-Micro-specific product development in this maintenance workspace is limited to plugin and template boundaries. Root scripts and root documentation may change to support that workflow, but new product behavior should not be introduced through EmDash core forks or new shared core layers.

## Root Structure

- `emdash-latest/`: latest synchronized snapshot of upstream EmDash
- `awcmsmicro-dev/`: clone of `emdash-latest/` used as the active AWCMS-Micro development workspace
- `docs/`: root-level technical documentation for structure, sync workflow, and implementation rules
- `scripts/`: maintenance scripts for refreshing `emdash-latest/` and rebuilding `awcmsmicro-dev/`

Hidden root files such as `.gitignore` and local-only `.env` support the parent workspace and are not part of the product structure.

## Repository Rules

- Keep `emdash-latest/` as the clean upstream reference tree.
- Rebuild `awcmsmicro-dev/` from `emdash-latest/` before AWCMS-Micro-specific implementation work.
- Do not treat this repository as a runtime host for nested products.
- Keep root documentation synchronized with the actual workflow and folder layout.
- Work step by step using small, atomic changes.
- When a task is too large, split it into smaller follow-up tasks or GitHub issues.

## Official Language

English (US) is the official repository language for root documentation, root scripts, repository instructions, and AWCMS-Micro-specific repository governance text.

Exception:

- `emdash-latest/` must remain as an upstream-faithful EmDash snapshot and should preserve upstream wording as-is, including non-US spelling when present.
- `awcmsmicro-dev/` may mirror upstream wording when it is rebuilt from `emdash-latest/` as part of synchronization work.

## Core Documentation

- `docs/README.md`
- `docs/repository-structure.md`
- `docs/synchronization-workflow.md`
- `docs/implementation-instructions.md`
- `docs/awcms-micro-implementation-boundaries.md`
- `docs/repository-assessment.md`
- `docs/upstream-sync/README.md`
- `docs/deployment/cloudflare.md`
- `docs/security/security-baseline.md`

## Maintenance Scripts

- `bash scripts/update-emdash-latest.sh`
- `bash scripts/update-awcmsmicro-dev.sh`
- `bash scripts/validate-awcmsmicro-boundaries.sh`
- `bash scripts/validate-awcmsmicro-dev.sh`
- `bash scripts/sync-and-validate-awcmsmicro-dev.sh`
- `pnpm test:awcmsmicro:e2e`

## Backup & Recovery

- `bash scripts/backup/encrypt-env.sh` - Encrypt .env files
- `bash scripts/backup/decrypt-env.sh` - Decrypt .env files
- `bash scripts/backup/backup-db.sh` - Backup database to R2
- `bash scripts/backup/backup-dotfiles.sh` - Backup dotfiles
- `bash scripts/backup/restore-dotfiles.sh` - Restore dotfiles
- `bash scripts/backup/recovery-checklist.sh` - Disaster recovery guide

See [scripts/backup/README.md](scripts/backup/README.md) for full documentation.

## Contribution Policy

- CLA enforcement is not active in this workspace.
- Contributions are governed by repository review, issue tracking, and the standard approval flow used by maintainers.

## AWCMS-Micro Example Additions

- Example template: `awcmsmicro-dev/templates/awcms-micro-default/`
- Example Cloudflare template: `awcmsmicro-dev/templates/awcms-micro-default-cloudflare/`
- Example plugin: `awcmsmicro-dev/packages/plugins/awcms-micro-example/`
- Example gallery plugin: `awcmsmicro-dev/packages/plugins/awcms-micro-gallery/`
- Reserved Cloudflare demo boundary: `awcmsmicro-dev/demos/awcms-micro-cloudflare/`
- Reserved docs boundary: `awcmsmicro-dev/docs/awcms-micro/`
- Reserved gallery docs boundary: `awcmsmicro-dev/docs/gallery/`
- Reserved E2E boundary: `awcmsmicro-dev/e2e/awcms-micro/`
- Reserved AWCMS changesets boundary: `awcmsmicro-dev/.awcms-changesets/`
- Preserved workflow boundary: `awcmsmicro-dev/.github/workflows/`
- Preserved workflow scripts boundary: `awcmsmicro-dev/.github/scripts/`
- Preserved Dependabot config: `awcmsmicro-dev/.github/dependabot.yml`
- Approved implementation boundaries: `docs/awcms-micro-implementation-boundaries.md`
- Protected implementation boundary list: `scripts/awcmsmicro-dev-protected-paths.txt`
- Upstream sync tracking: `docs/upstream-sync/`
- Deployment guidance: `docs/deployment/`
- Security and compliance baselines: `docs/security/`

## Standard Workflow

1. Refresh `emdash-latest/` from upstream EmDash.
2. Rebuild `awcmsmicro-dev/` from `emdash-latest/`.
3. Validate `awcmsmicro-dev/` with `bash scripts/validate-awcmsmicro-dev.sh`.
4. Implement AWCMS-Micro-specific product work only in approved plugin and template boundaries inside `awcmsmicro-dev/`.
5. Update root documentation when structure or process changes.

During rebuilds, `bash scripts/update-awcmsmicro-dev.sh` preserves only the explicitly approved AWCMS-Micro paths listed in `scripts/awcmsmicro-dev-protected-paths.txt` and governed by `docs/awcms-micro-implementation-boundaries.md`.
