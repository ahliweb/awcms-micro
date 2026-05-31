# Divergence Log

This log records intentional AWCMS-Micro decisions that diverge from a plain upstream EmDash checkout.

## Current Position

The active divergences in this repository are expected to remain isolated to plugin, template, documentation, demo, validation, and governance surfaces rather than upstream EmDash core locations.

## Rules

- Do not log upstream EmDash changes here.
- Log only AWCMS-Micro-specific additions, overlays, retirements, or governance changes.
- Keep entries small, factual, and reviewable.
- Prefer one decision per row.
- Update the status when a temporary decision is later retired, replaced, or fully adopted into the normal workflow.

## Entry Template

| Date | Area | Decision | Status | Description | Rationale | Review Trigger | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TBD | TBD | add/adapt/retire/delay/reject | active/temporary/completed/retired | TBD | TBD | TBD | TBD |

## Status Meanings

- `active`: current accepted divergence that should remain in place
- `temporary`: accepted for now but expected to change later
- `completed`: implementation or migration finished; keep row as history
- `retired`: no longer active; retained for audit trail only

## Current Entries

| Date | Area | Decision | Status | Description | Rationale | Review Trigger | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-05-22 | Root docs and scripts | add | active | Added upstream sync tracking, deployment guidance, security baselines, and validation workflow scripts | Keep AWCMS-Micro governance isolated from upstream EmDash | If root workflow or operator responsibilities change materially | OpenCode / GPT-5.4 |
| 2026-05-22 | `awcmsmicro-dev/templates/awcms-micro-default/` | add | active | Added an isolated AWCMS-Micro example template | Provide a minimal example without modifying built-in EmDash templates | If the Node/SQLite reference template is replaced or split | OpenCode / GPT-5.4 |
| 2026-05-22 | `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/` | add | active | Added an isolated AWCMS-Micro example plugin package | Demonstrate tenant-ready plugin conventions without modifying built-in EmDash plugins | If plugin scope is split into smaller focused example packages | OpenCode / GPT-5.4 |
| 2026-05-23 | `awcmsmicro-dev/templates/awcms-micro-default/`, `awcmsmicro-dev/templates/awcms-micro-default-cloudflare/` | adapt | active | Added recursive public navigation rendering, nested primary menu seeds, and theme-aware shell styling | Keep the public example template aligned with EmDash menus while improving the AWCMS-Micro demo UX | If upstream EmDash gains equivalent template capabilities | OpenCode / GPT-5.4 |
| 2026-05-23 | `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/`, `awcmsmicro-dev/docs/awcms-micro/`, `awcmsmicro-dev/e2e/awcms-micro/` | add/adapt | active | Added plugin header submenu rendering, navigation docs, and accessibility smoke coverage | Keep plugin-specific navigation organized without changing the EmDash admin sidebar | If upstream EmDash gains a native plugin-local navigation model | OpenCode / GPT-5.4 |
| 2026-05-24 | `.github/workflows/deploy.yml`, `awcmsmicro-dev/.github/dependabot.yml` | adapt | active | Pinned the root deploy workflow actions and added pnpm Dependabot coverage for the workspace | Reduce workflow supply-chain risk and make dependency update automation cover the actual pnpm tree | If automation trust model or package-management layout changes | OpenCode / GPT-5.4 |
| 2026-05-24 | `awcmsmicro-dev/pnpm-workspace.yaml`, `awcmsmicro-dev/docs/package.json`, `awcmsmicro-dev/packages/*/package.json`, `awcmsmicro-dev/templates/awcms-micro-default/package.json`, `awcmsmicro-dev/packages/create-emdash/package.json` | adapt | active | Raised direct dependency ranges and added transitive overrides for the workspace security audit | Reduce Dependabot and code-scanning findings from vulnerable direct and transitive packages | If upstream dependency policy changes or the security baseline is revised | OpenCode / GPT-5.4 |
| 2026-05-24 | `awcmsmicro-dev/.github/workflows/*` | adapt | active | Rewrote privileged workflow automation into manual/read-only workflows | Remove GitHub App token usage and untrusted privileged checkouts while preserving manual maintenance paths | If a safer trusted automation model is later approved | OpenCode / GPT-5.4 |
| 2026-05-27 | `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/`, template admin wrappers, root governance docs | adapt | completed | Moved active navigation and i18n helpers from the retired shared package layer into plugin-owned exports and updated governance docs accordingly | Enforce the plugin-and-template-only development model in code and governance | Re-open only if a future capability cannot live cleanly in plugin or template boundaries | OpenCode / GPT-5.4 |
| 2026-05-28 | `awcmsmicro-dev/packages/admin/src/components/Sidebar.tsx`, `packages/plugins/*` | adapt | active | Implemented individual plugin sidebar grouping, placement below Dashboard, and bilingual English/Indonesian i18n support | Align plugin display and translation capabilities to user-friendly standards | Re-evaluate if upstream EmDash adopts different plugin layout or default i18n mechanisms | Antigravity / DeepMind |
| 2026-05-29 | `awcmsmicro-dev/packages/admin/src/components/Sidebar.tsx`, `awcmsmicro-dev/packages/admin/src/components/AdminCommandPalette.tsx`, `awcmsmicro-dev/packages/admin/src/lib/plugin-navigation.ts` | adapt | active | Unified plugin-first admin navigation ordering so plugin groups render directly below Dashboard and the command palette uses the same plugin ordering | Keep plugin navigation consistent across admin surfaces without modifying upstream EmDash core | If upstream admin navigation adopts a shared ordering model or the downstream shell is replaced | OpenCode / GPT-5.4 |
| 2026-05-31 | `awcmsmicro-dev/packages/marketplace/package.json`, `awcmsmicro-dev/.awcms-patches/0004-marketplace-hono.patch` | adapt | active | Raised the marketplace Worker's direct `hono` dependency to a patched release through a downstream overlay | Reduce Dependabot noise in the rebuilt workspace while keeping the upstream snapshot reproducible | If upstream EmDash publishes the same bump or the marketplace Worker is removed from the downstream rebuild path | OpenCode / GPT-5.4 |
| 2026-05-31 | `awcmsmicro-dev/docs/package.json`, `awcmsmicro-dev/.awcms-patches/0005-docs-astro.patch` | adapt | active | Raised the docs site's `astro` and `@astrojs/cloudflare` dependencies to patched releases through a downstream overlay | Reduce Dependabot noise in the rebuilt workspace while keeping the upstream docs site reproducible | If upstream EmDash publishes the same bump or the docs site is removed from the downstream rebuild path | OpenCode / GPT-5.4 |
| 2026-05-31 | `awcmsmicro-dev/infra/perf-monitor/package.json`, `awcmsmicro-dev/.awcms-patches/0006-perf-monitor-vite.patch` | adapt | active | Raised the perf-monitor site's `vite` dependency to a patched release through a downstream overlay | Reduce Dependabot noise in the rebuilt workspace while keeping the upstream perf monitor reproducible | If upstream EmDash publishes the same bump or the perf monitor is removed from the downstream rebuild path | OpenCode / GPT-5.4 |
| 2026-05-31 | `awcmsmicro-dev/packages/core/package.json`, `awcmsmicro-dev/.awcms-patches/0007-core-vite.patch` | adapt | active | Repointed the core package's `vite` dependency to the workspace catalog so it resolves to the patched Vite 8 line | Reduce Dependabot noise in the rebuilt workspace while keeping the upstream core package reproducible | If upstream EmDash adopts the same catalog pin or the core package is removed from the downstream rebuild path | OpenCode / GPT-5.4 |
| 2026-05-31 | `awcmsmicro-dev/packages/admin/package.json`, `awcmsmicro-dev/.awcms-patches/0008-admin-vite.patch` | adapt | active | Repointed the admin package's `vite` dependency to the workspace catalog so it resolves to the patched Vite 8 line | Reduce Dependabot noise in the rebuilt workspace while keeping the upstream admin package reproducible | If upstream EmDash adopts the same catalog pin or the admin package is removed from the downstream rebuild path | OpenCode / GPT-5.4 |
| 2026-05-31 | `awcmsmicro-dev/docs/package.json`, `awcmsmicro-dev/.awcms-patches/0009-docs-catalog.patch` | adapt | active | Repointed the docs site's `astro`, `@astrojs/cloudflare`, and `vite` resolutions to the workspace catalog / patched Vite 8 line | Reduce Dependabot noise in the rebuilt workspace while keeping the upstream docs site reproducible | If upstream EmDash adopts the same catalog pin or the docs site is removed from the downstream rebuild path | OpenCode / GPT-5.4 |
| 2026-05-31 | `awcmsmicro-dev/packages/blocks/playground/package.json`, `awcmsmicro-dev/.awcms-patches/0010-blocks-playground-vite.patch` | adapt | active | Repointed the blocks playground's `vite` dependency to the workspace catalog so it resolves to the patched Vite 8 line | Reduce Dependabot noise in the rebuilt workspace while keeping the upstream playground reproducible | If upstream EmDash adopts the same catalog pin or the playground is removed from the downstream rebuild path | OpenCode / GPT-5.4 |
| 2026-05-31 | `awcmsmicro-dev/packages/admin/package.json`, `awcmsmicro-dev/.awcms-patches/0011-admin-dompurify.patch` | adapt | active | Raised the admin package's `dompurify` dependency to the patched 3.4.x line through a downstream overlay | Reduce Dependabot noise in the rebuilt workspace while keeping the upstream admin package reproducible | If upstream EmDash publishes the same bump or the admin package is removed from the downstream rebuild path | OpenCode / GPT-5.4 |
| 2026-05-31 | `awcmsmicro-dev/packages/create-emdash/package.json`, `awcmsmicro-dev/.awcms-patches/0012-create-emdash-giget.patch` | adapt | active | Raised the create-emdash CLI's `giget` dependency to the patched 3.2.x line through a downstream overlay | Reduce Dependabot noise in the rebuilt workspace while keeping the upstream CLI reproducible | If upstream EmDash publishes the same bump or create-emdash is removed from the downstream rebuild path | OpenCode / GPT-5.4 |

## Review Reminder

When adding a new row, also check whether `COMPATIBILITY_MATRIX.md`, deployment docs, or security docs should be updated in the same change.
