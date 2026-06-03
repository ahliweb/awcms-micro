# AWCMS Admin Branding Preservation

## Purpose

Document how the AWCMS admin branding survives EmDash synchronization without requiring manual re-edits after every upstream refresh.

## Branding Surfaces

- Sidebar header logo: configured through template `admin.logo` settings in `awcmsmicro-dev/templates/`
- Sidebar title/site name: configured through template `admin.siteName` settings in `awcmsmicro-dev/templates/`
- Sidebar footer version: applied as a downstream source patch plus protected `Sidebar.tsx` override that renders two lines: `AWCMS` with the root maintenance version and root repository commit hash from `VERSION`/`CHANGELOG.md` plus git metadata, then the EmDash manifest version with the upstream EmDash commit hash from `docs/upstream-sync/LAST_UPSTREAM_FETCH.md`
- Login page lockup: applied as a downstream source patch that uses `/awcms-logo.png`, `AWCMS`, and `AWCMS by AhliWeb.com & EmDash` for the standalone admin login surface

## Preservation Model

Persistent downstream source tweaks that must survive `bash scripts/update-awcmsmicro-dev.sh` belong in `awcmsmicro-dev/.awcms-patches/`.

The rebuild script restores the approved custom paths and then replays every `*.patch` file in that directory against the refreshed `awcmsmicro-dev/` tree.

That means the branding change does not need to be recreated after each sync.

## Operational Rule

When a future AWCMS-Micro customization must persist across syncs, prefer one of these paths:

1. keep it in a protected plugin or template boundary
2. encode the source-level delta as a patch in `awcmsmicro-dev/.awcms-patches/`
3. update the sync workflow docs if the preservation model changes

Do not rely on unprotected, ad hoc edits inside `awcmsmicro-dev/` source files.

## Version Update Rule

Every root-level documentation, script, governance, or protected admin branding change must add a root `.awcms-changesets/*.md` entry and run `bash scripts/awcms-root-versioning.sh version` before final validation so `VERSION`, `CHANGELOG.md`, and the workspace snapshot stay current automatically.
