This repository is a parent maintenance workspace for AWCMS-Micro and EmDash alignment.

## Root Layout

- `emdash-latest/`: latest synchronized EmDash source tree
- `awcmsmicro-dev/`: managed working copy used for AWCMS-Micro development
- `docs/`: parent-repository documentation
- `scripts/`: root maintenance scripts

## Core Intent

Analyze `https://github.com/emdash-cms/emdash`, then update `https://github.com/ahliweb/awcms-micro` so it stays fully synchronized with EmDash.

`awcms-micro` is an independent repository. It must not act as a host for other repositories in the product/runtime sense. It should serve as an example implementation that fully adopts EmDash 100% and includes only example plugins that follow the AWCMS-Micro standard, without modifying EmDash core.

Within this parent workspace:

- `emdash-latest/` is the reference source snapshot
- `awcmsmicro-dev/` is the development copy where AWCMS-Micro-specific work should be prepared

## Execution Rules

- Proceed step by step using an atomic strategy.
- Prefer small, reviewable changes.
- When work is too large for a single pass, split it into smaller tracked tasks.
- If useful, create GitHub issues so the work can later be executed by a smaller or lower-cost AI model.
- Keep root documentation in sync with the actual folder structure and workflow.

## Root Documentation

- `docs/README.md`
- `docs/repository-structure.md`
- `docs/synchronization-workflow.md`
- `docs/implementation-instructions.md`
