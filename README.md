# AWCMS-Micro Parent Repository

This repository is the parent workspace for maintaining AWCMS-Micro against the latest EmDash source.

## Purpose

- `emdash-latest` stores the latest synchronized EmDash source tree.
- `awcmsmicro-dev` is a working copy derived from `emdash-latest` for AWCMS-Micro development.
- `docs` contains the root-level technical documentation for how this repository is structured and operated.

This repository keeps both trees inside a single git repository so AWCMS-Micro work can be performed against a known EmDash baseline while preserving parent-level documentation and workflow guidance.

## Main Folders

- `emdash-latest/`: latest updated EmDash source tree
- `awcmsmicro-dev/`: development workspace copied from `emdash-latest/`
- `docs/`: technical documentation for this parent repository
- `scripts/`: root-level maintenance scripts for refreshing `emdash-latest/` and `awcmsmicro-dev/`

## Technical Documentation

- `docs/README.md`: documentation index
- `docs/repository-structure.md`: root structure and responsibilities
- `docs/synchronization-workflow.md`: sync/update workflow for EmDash and AWCMS-Micro
- `docs/implementation-instructions.md`: implementation mandate and atomic execution guidance

## Maintenance Scripts

- `bash scripts/update-emdash-latest.sh`: refresh `emdash-latest` from upstream EmDash
- `bash scripts/update-awcmsmicro-dev.sh`: rebuild `awcmsmicro-dev` from `emdash-latest`

## Operating Model

`awcms-micro` is still treated as an independent repository. The AWCMS-Micro implementation should fully adopt EmDash and should not modify EmDash core directly. Changes specific to AWCMS-Micro should be developed inside `awcmsmicro-dev` on top of the `emdash-latest` baseline.
