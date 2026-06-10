# AWCMS-Micro Product Docs Map

This document maps the main AWCMS-Micro product-facing documentation that lives inside the sync-safe `awcmsmicro-dev/docs/awcms-micro/` boundary.

## Core Documents

- `README.md`: boundary entry point for AWCMS-Micro-owned docs
- `cloudflare-deployment.md`: Cloudflare-specific template guidance, smoke tests, and rollback
- `public-landing-page-standard.md`: standard sections and patterns for public landing pages derived from reference repos
- `navigation-standard.md`: public and plugin navigation rules
- `navigation-release-notes.md`: concise navigation-related change notes
- `admin-navigation.md`: plugin-owned admin navigation compatibility guidance
- `plugin-i18n.md`: label resolution and plugin i18n behavior
- `i18n-po-translation-standard.md`: Lingui-compatible PO catalog standard for plugins and templates
- `upstream-sync.md`: SIKESRA-specific upstream sync checks
- `divergence-log.md`: downstream divergence notes that must survive sync work
- `sikesra-reference-prd.md`: product and backlog framing for the reference example
- `sikesra-reference-standard.md`: implementation scope and guardrails for the reference example

## How To Use This Map

1. Start with `README.md` for the boundary overview.
2. Read `public-landing-page-standard.md` when building or extending the public landing page.
3. Read `navigation-standard.md` and `admin-navigation.md` for plugin/template UI behavior.
4. Read `cloudflare-deployment.md` when preparing Cloudflare delivery.
5. Read the SIKESRA reference documents when planning governance-style plugin or template work.
6. Read `i18n-po-translation-standard.md` before adding or modifying user-facing copy.

## Plugin-Specific Notes

Plugin packages carry their own `README.md`. No separate product doc is required unless a plugin has AWCMS-Micro-specific integration constraints that must survive future syncs. Current notes:

- `awcms-micro-email-mailketing` — see `divergence-log.md` for API integration specifics (endpoint, auth, field names).
- `awcms-micro-sikesra` — governed by `sikesra-reference-prd.md` and `sikesra-reference-standard.md`.

## Ownership Rule

Documents in this boundary should describe AWCMS-Micro-owned plugin, template, deployment, and validation behavior. They should not restate upstream EmDash core documentation unless needed for a direct AWCMS-Micro decision or compatibility note.
