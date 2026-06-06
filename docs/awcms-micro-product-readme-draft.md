# AWCMS-Micro Product README Draft

## Purpose

This draft is a sync-safe source document for the eventual independent `awcms-micro` repository README.

It exists at the parent-repository level so the product-facing README can be refined without placing non-upstream content in `awcmsmicro-dev/README.md`, which is rebuilt from `emdash-latest/`.

## Draft README

```md
# AWCMS-Micro

AWCMS-Micro is an EmDash-based implementation workspace that stays aligned with upstream EmDash while adding AWCMS-Micro-specific behavior only through downstream plugins and templates.

## What AWCMS-Micro Is

- an independent repository built on EmDash
- a reference implementation for plugin-and-template-based customization
- a sync-friendly downstream project that avoids modifying EmDash core
- a place to document and validate AWCMS-Micro conventions for deployment, navigation, media, and governance-style plugin flows

## What AWCMS-Micro Is Not

- not a fork of EmDash core
- not a replacement upstream for EmDash
- not a host for unrelated nested products
- not a second shared core layer parallel to EmDash

## Development Model

AWCMS-Micro development happens in these product boundaries:

- plugins under `packages/plugins/`
- templates under `templates/`

Supporting documentation, demos, and E2E coverage may exist alongside them, but new product behavior should be introduced through plugin and template boundaries rather than direct changes to EmDash core.

## Included AWCMS-Micro Surfaces

- `packages/plugins/awcms-micro-docs/`: documentation plugin with an admin docs page and shared public docs copy
- `packages/plugins/awcms-micro-gallery/`: gallery plugin with settings, public listing, media validation, and audit-ready hooks
- `packages/plugins/awcms-micro-sikesra/`: governance, navigation, access, audit, and ABAC-oriented plugin
- `templates/awcms-micro-default/`: Node/SQLite reference template
- `templates/awcms-micro-default-cloudflare/`: Cloudflare reference template

## Versioning And Changelog

Each plugin and template keeps its own version and changelog.

- plugin releases are tracked per package under `packages/plugins/*`
- template releases are tracked per package under `templates/*`
- release notes should stay package-scoped and product-facing

## Upstream Relationship

AWCMS-Micro adopts EmDash as-is wherever possible.

- upstream EmDash remains the source for core runtime behavior
- AWCMS-Micro keeps its own additions isolated in sync-safe boundaries
- compatibility work is documented and reviewed instead of hidden in core patches

## Getting Started

1. Install dependencies with `pnpm install`.
2. Choose a template that matches your environment.
3. Enable the AWCMS-Micro plugins you need.
4. Run the local development workflow for the selected template.

For Cloudflare-oriented setups, start with `templates/awcms-micro-default-cloudflare/`.

## Repository Principles

- stay synchronized with upstream EmDash
- keep AWCMS-Micro behavior plugin-and-template-only
- avoid long-lived divergence from EmDash core
- keep deployment and security guidance explicit and reviewable
- keep versioning and changelog notes scoped to the relevant plugin or template
```

## Notes For Future Promotion

- When `awcms-micro` is published as its own independent repository, this draft should replace the upstream-style root README in that repository.
- Keep the final README concise and product-facing.
- Link product docs, deployment runbooks, and plugin/template guides from the final README rather than duplicating large operational details there.
