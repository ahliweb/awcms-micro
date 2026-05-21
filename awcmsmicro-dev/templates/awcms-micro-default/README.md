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

## Included Files

- `package.json`
- `astro.config.mjs`
- `src/layouts/BaseLayout.astro`
- `src/components/SiteHeader.astro`
- `src/components/SiteFooter.astro`
- `src/pages/index.astro`
- `src/pages/about.astro`
- `docs/TEMPLATE_NOTES.md`

## Manual Usage

This template is intentionally not registered into EmDash core. To use it safely:

1. Copy the folder into a working EmDash project.
2. Install dependencies with `pnpm install`.
3. Adjust the placeholder content, theme, and schema to fit your site.
4. Add AWCMS-Micro-specific plugins through the normal `plugins: []` configuration path.
