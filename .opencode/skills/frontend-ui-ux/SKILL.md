---
name: frontend-ui-ux
description: Frontend UI/UX for AWCMS-Micro and EmDash admin/public templates. Use when designing or implementing React, Astro, Kumo admin UI, public templates, navigation, accessibility, responsive layouts, i18n UI copy, or visual flows.
---

# Frontend UI/UX

Use this skill for AWCMS-Micro and EmDash frontend work across admin UI, public templates, plugin UI, and UX documentation.

## Priority Sources

Prefer the local Claude/EmDash skill and repository guidance in this order:

1. `awcmsmicro-dev/AGENTS.md` for EmDash frontend rules, Kumo usage, Lingui, RTL-safe Tailwind, and testing expectations.
2. `awcmsmicro-dev/skills/building-emdash-site/SKILL.md` for Astro site structure, content rendering, caching, seed/schema, menus, and public page patterns.
3. `awcmsmicro-dev/skills/creating-plugins/SKILL.md` for plugin admin UI, Block Kit, React admin exports, plugin routes, and sandbox compatibility.
4. Root `AGENTS.md`, `docs/awcms-micro-implementation-boundaries.md`, and `docs/awcms-micro-documentation-workflow.md` for AWCMS-Micro boundaries and documentation rules.
5. Project-specific README, PRD, governance, or design docs for the plugin/template being edited.

## Boundary Rules

- Keep AWCMS-Micro product UI inside approved plugin/template boundaries unless an issue explicitly requires a protected admin overlay.
- Do not modify EmDash core for project-specific UI behavior.
- Preserve protected admin overlay files only when the change is intentionally sync-safe and documented.
- For SIKESRA, read the SIKESRA governance docs before changing UI.

## Admin UI Rules

- Use Kumo components for admin UI. Do not hand-roll buttons, inputs, dialogs, selects, badges, loaders, or toasts when a Kumo component exists.
- Keep all user-facing admin strings localized through Lingui-compatible patterns already used by the target package.
- Use RTL-safe logical Tailwind classes: `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `text-end`.
- Avoid raw Tailwind colors in admin UI; prefer semantic Kumo tokens.
- Never nest `<button>` inside links. Use router-aware button/link components where the project already provides them.

## Public Template Rules

- Public pages that read EmDash content must be server-rendered. Do not add `getStaticPaths()` for CMS content.
- Use EmDash content APIs and components correctly: `entry.id` is the slug, `entry.data.id` is the database ID, and image fields are objects rendered through `Image` where applicable.
- Always handle EmDash cache hints on pages that query content.
- Keep public output public-safe and avoid leaking protected operational or personal data.

## UX Quality Bar

- Preserve the existing visual language of the target template or admin surface.
- Design desktop and mobile states together.
- Include loading, empty, error, permission-denied, and success states for data-driven UI.
- Add Mermaid diagrams when changing UI/UX flows, navigation flows, security decisions, or frontend-backend integration.

## Verification

Use the closest relevant checks:

- `pnpm typecheck`
- `pnpm typecheck:templates`
- package-specific `pnpm test`
- plugin/template locale tests
- `bash scripts/validate-awcmsmicro-boundaries.sh` for protected boundary changes
