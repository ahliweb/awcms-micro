# Root AWCMS Versioning

## Purpose

This document describes the root-level AWCMS-Micro versioning and changelog flow for the parent maintenance repository.

It is one of three separate release surfaces in this workspace, alongside plugin-level and template-level package releases.

It is separate from `awcmsmicro-dev/.awcms-changesets/`, which tracks versioning inside the maintained workspace.

## Root Files

- `VERSION`: the current root AWCMS maintenance release version
- `CHANGELOG.md`: the root AWCMS maintenance changelog
- `.awcms-changesets/`: pending root release-note inputs
- `scripts/awcms-version.mjs`: the root versioning script

`CHANGELOG.md` also carries a workspace snapshot section that records the current EmDash upstream revision plus the version and latest changelog entry for every plugin and template in `awcmsmicro-dev/`.

## File Format

Each root changeset is a Markdown file with frontmatter and a required body.

Example:

```md
---
bump: patch
---

Updates root documentation for the maintenance workspace.
```

## Supported Bumps

- `patch`
- `minor`
- `major`

## Workflow

Run:

```bash
node scripts/awcms-version.mjs status
node scripts/awcms-version.mjs version
```

The script reads pending changesets, bumps `VERSION`, prepends `CHANGELOG.md`, and removes processed input files.

For workspace snapshots, keep the EmDash revision in sync with `docs/upstream-sync/LAST_UPSTREAM_FETCH.md` and update the plugin/template inventory when package versions change.

## Boundary Rule

- keep root-level maintenance release notes in the root `.awcms-changesets/` boundary
- keep workspace/package release notes in `awcmsmicro-dev/.awcms-changesets/`
- do not mix the two flows
