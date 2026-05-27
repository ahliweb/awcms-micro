# AWCMS-Micro Product README Source

## Purpose

This document is the product-facing README source for the eventual independent `awcms-micro` repository.

Unlike `awcmsmicro-dev/README.md`, this file is sync-safe at the parent-repository level and will not be overwritten during rebuilds from `emdash-latest/`.

## Final README Source

```md
# AWCMS-Micro

AWCMS-Micro is an example implementation of EmDash that stays aligned with upstream EmDash while introducing AWCMS-Micro-specific behavior only through plugins and templates.

## Overview

AWCMS-Micro is intended to show how an EmDash-based project can remain sync-friendly with upstream EmDash while still defining its own conventions for navigation, governance-style plugin flows, media handling, deployment, and operational guidance.

## What AWCMS-Micro Is

- an independent repository built on EmDash
- a reference implementation for plugin-and-template-based customization
- a downstream project that avoids modifying EmDash core
- a place to validate AWCMS-Micro conventions in isolated, reviewable boundaries

## What AWCMS-Micro Is Not

- not a fork of EmDash core
- not a replacement upstream for EmDash
- not a host for unrelated nested products
- not a second shared core layer parallel to EmDash

## Development Model

AWCMS-Micro product development happens in these boundaries:

- `packages/plugins/`
- `templates/`

Supporting documentation, demos, and E2E coverage may exist alongside them, but new product behavior should be added through plugin and template boundaries rather than direct changes to EmDash core.

## Included Example Surfaces

- `packages/plugins/awcms-micro-example/`: governance, navigation, access, audit, and ABAC-oriented example plugin
- `packages/plugins/awcms-micro-gallery/`: gallery and media example plugin
- `templates/awcms-micro-default/`: Node/SQLite reference template
- `templates/awcms-micro-default-cloudflare/`: Cloudflare reference template

## Relationship To EmDash

AWCMS-Micro adopts EmDash as-is wherever practical.

- upstream EmDash remains the source for core runtime behavior
- AWCMS-Micro keeps its own additions in isolated sync-safe boundaries
- compatibility work is documented and reviewed instead of hidden in core patches

## Getting Started

1. Install dependencies with `pnpm install`.
2. Choose a template that matches your target environment.
3. Enable the example plugins you need.
4. Run the local development workflow for the selected template.

If you want a Cloudflare-oriented setup, start with `templates/awcms-micro-default-cloudflare/`.

## Repository Principles

- stay synchronized with upstream EmDash
- keep AWCMS-Micro behavior plugin-and-template-only
- avoid long-lived divergence from EmDash core
- keep deployment and security guidance explicit and reviewable

## Documentation

The repository should link to:

- plugin-specific usage guides
- template-specific setup instructions
- deployment runbooks
- security and operational guidance

Keep the root README product-facing and concise. Put long operational details in linked docs.
```

## Promotion Notes

- Use this source when replacing the upstream-style README in the independent `awcms-micro` repository.
- If the product scope changes, update this file first before editing any downstream README copy.
