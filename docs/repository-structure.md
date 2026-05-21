# Repository Structure

## Overview

The parent repository is intentionally structured around three main folders:

## Folders

- `emdash-latest/`
  Contains the latest updated EmDash source tree. This is the local reference baseline copied from the upstream `emdash-cms/emdash` repository.

- `awcmsmicro-dev/`
  Contains a working copy derived from `emdash-latest/`. This is the active development workspace for adapting and validating AWCMS-Micro against the latest EmDash source.

- `docs/`
  Contains the technical documentation for this parent repository, including structure, synchronization workflow, and implementation instructions.

- `scripts/`
  Contains root-level maintenance scripts used to refresh `emdash-latest/` and rebuild `awcmsmicro-dev/`.

## Design Principle

The root repository is a maintenance and documentation layer. Product/runtime behavior should be implemented inside `awcmsmicro-dev/`, while `emdash-latest/` remains the reference copy used for synchronization and comparison.
