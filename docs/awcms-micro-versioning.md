# AWCMS-Micro Versioning

## Purpose

This document describes the AWCMS-Micro-only automatic versioning and changelog flow for packages under the `@awcms-micro/*` namespace.

## Scope

This flow is intentionally separate from upstream EmDash Changesets.

It covers:

- `@awcms-micro/plugin-example`
- `@awcms-micro/plugin-gallery`
- `@awcms-micro/template-default-example`
- `@awcms-micro/template-default-cloudflare`

## Inputs

AWCMS-Micro release-note inputs live in `awcmsmicro-dev/.awcms-changesets/`.

Each file uses simple frontmatter that maps one or more AWCMS package names to a bump type.

Example:

```md
---
"@awcms-micro/plugin-example": minor
"@awcms-micro/template-default-example": patch
---

Adds plugin-owned navigation exports and updates the Node reference template to consume them.
```

## Automatic Output

When the AWCMS versioning workflow runs, it:

1. reads pending files from `.awcms-changesets/`
2. bumps the versions of affected `@awcms-micro/*` packages and templates
3. prepends `CHANGELOG.md` entries for each affected package
4. removes processed changeset files
5. refreshes the workspace lockfile
6. creates or updates the automated AWCMS release PR

## Workflow

The automation entry points are:

- `awcmsmicro-dev/.github/scripts/awcms-version.mjs`
- `awcmsmicro-dev/.github/workflows/awcms-versioning.yml`

The PR branch used by the workflow is `awcms-release/main`.

## Manual Checks

For a quick local status check:

```bash
node awcmsmicro-dev/.github/scripts/awcms-version.mjs status
```

To apply pending AWCMS version updates locally:

```bash
node awcmsmicro-dev/.github/scripts/awcms-version.mjs version
```

## Boundary Rule

- keep AWCMS-Micro versioning inputs inside `.awcms-changesets/`
- keep AWCMS-Micro-specific release automation logic inside preserved `.github/` boundaries
- do not repurpose upstream EmDash release metadata for downstream AWCMS-Micro package versioning
