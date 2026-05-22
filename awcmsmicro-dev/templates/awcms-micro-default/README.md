# AWCMS-Micro Default Example Template

This folder is an AWCMS-Micro example template. It is not a replacement for EmDash built-in templates.

## Purpose

- demonstrate AWCMS-Micro conventions in an isolated example folder
- stay compatible with EmDash without modifying EmDash core
- show an Astro-first public rendering baseline for a single-tenant-first site

## AWCMS-Micro Notes

- Single-tenant-first: the default content and layout are optimized for one site owner.
- Tenant-ready structure: content sections and file layout keep room for future tenant separation.
- EmDash-compatible: the template uses standard Astro and EmDash integration points only.
- No EmDash core modification: manual adoption is documented here instead of changing built-in template registration.

## Key Files

- `package.json`
- `seed/seed.json`
- `astro.config.mjs`
- `src/layouts/BaseLayout.astro`
- `src/components/SiteHeader.astro`
- `src/components/SiteFooter.astro`
- `src/pages/index.astro`
- `src/pages/about.astro`
- `docs/TEMPLATE_NOTES.md`

## Manual Usage

This template is intentionally not registered into EmDash core. It can be copied into a standalone project outside this monorepo.

1. Copy the folder into a new or existing Node.js 22+ project.
2. Install dependencies with `pnpm install`.
3. Review `seed/seed.json` and adjust the starter collections, settings, and content to fit your site.
4. Add AWCMS-Micro-specific plugins through the normal `plugins: []` configuration path.

If you are still working inside this parent workspace and want to attach the example plugin from this repository to a standalone EmDash site, see `../../packages/plugins/awcms-micro-example/docs/STANDALONE_CONSUMPTION.md`.

## Standalone Notes

- `package.json` uses published dependency versions instead of monorepo-only `catalog:` or `workspace:*` specifiers.
- The template still expects the standard EmDash runtime flow and Astro server output.
- The included `seed/seed.json` is intentionally minimal so the folder can bootstrap cleanly outside this repository.
- Review `astro.config.mjs` before production use: `siteUrl`, SQLite database location, and local uploads storage are example defaults.
