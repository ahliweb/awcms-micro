# AWCMS-Micro Versioning Rollout Summary

## Purpose

This summary records what was added to support AWCMS-Micro-only automatic versioning and changelog generation for the downstream plugin and template surfaces.

It sits alongside the standard workspace package-release flow in `awcmsmicro-dev/.changeset/`, which continues to govern published EmDash packages such as `@emdash-cms/admin`.

## Delivered

- AWCMS-only release-note input boundary: `awcmsmicro-dev/.awcms-changesets/`
- Workspace package-release boundary: `awcmsmicro-dev/.changeset/`
- AWCMS-only versioning script: `awcmsmicro-dev/.github/scripts/awcms-version.mjs`
- AWCMS-only version PR workflow: `awcmsmicro-dev/.github/workflows/awcms-versioning.yml`
- Root workspace snapshot changelog for the current EmDash SHA plus the latest version and changelog entry of every plugin and template in `awcmsmicro-dev/`
- Workspace package releases continue to use the standard Changesets boundary for published workspace packages like `@emdash-cms/admin`
- Root governance updates so the new boundaries survive `awcmsmicro-dev` rebuilds
- Operator and release-readiness docs updated to include the AWCMS versioning flow

## Covered Packages

- `@awcms-micro/plugin-sikesra`
- `@awcms-micro/template-default-example`
- `@awcms-micro/template-default-cloudflare`

## Proven Behavior

Two local simulations were run successfully.

### Simulation 1

- `@awcms-micro/plugin-sikesra`: `0.1.0 -> 0.1.1`
- `@awcms-micro/template-default-example`: `0.0.1 -> 0.0.2`

### Simulation 2

- `@awcms-micro/template-default-cloudflare`: `0.0.1 -> 0.1.0`

In both simulations the script:

1. detected pending AWCMS changesets
2. bumped package versions
3. created per-package `CHANGELOG.md` files
4. removed processed changeset files
5. refreshed the workspace dependency state

## Boundary Notes

- The AWCMS versioning flow is intentionally separate from upstream EmDash Changesets.
- The AWCMS versioning flow is intentionally separate from the workspace package-release flow in `awcmsmicro-dev/.changeset/`.
- The root maintenance changelog now records the current workspace snapshot without changing `emdash-latest/`.
- AWCMS release-note inputs and release automation scripts now live in preserved rebuild-safe boundaries.
- The new flow does not require modifying upstream release metadata for EmDash core packages.

## Recommended Next Use

1. Add a real AWCMS changeset under `.awcms-changesets/` when a plugin or template release is needed.
2. Let the `AWCMS Versioning` workflow create or update the `awcms-release/main` PR.
3. Review the generated package version bumps and `CHANGELOG.md` entries before merging.
