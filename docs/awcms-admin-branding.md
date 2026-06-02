# AWCMS Admin Branding Preservation

## Purpose

Document how the AWCMS admin branding survives EmDash synchronization without requiring manual re-edits after every upstream refresh.

## Branding Surfaces

- Sidebar header logo: configured through template `admin.logo` settings in `awcmsmicro-dev/templates/`
- Sidebar title/site name: configured through template `admin.siteName` settings in `awcmsmicro-dev/templates/`
- Sidebar footer version: applied as a downstream source patch plus protected `Sidebar.tsx` override that renders the current AWCMS admin/manifest version before the EmDash manifest version, while preserving the injected AWCMS build commit when available

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
