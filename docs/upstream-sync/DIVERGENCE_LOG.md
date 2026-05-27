# Divergence Log

This log records intentional AWCMS-Micro decisions that diverge from a plain upstream EmDash checkout.

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
| 2026-05-22 | `awcmsmicro-dev/packages/plugins/awcms-micro-example/` | add | active | Added an isolated AWCMS-Micro example plugin package | Demonstrate tenant-ready plugin conventions without modifying built-in EmDash plugins | If plugin scope is split into smaller focused example packages | OpenCode / GPT-5.4 |
| 2026-05-23 | `awcmsmicro-dev/templates/awcms-micro-default/`, `awcmsmicro-dev/templates/awcms-micro-default-cloudflare/` | adapt | active | Added recursive public navigation rendering, nested primary menu seeds, and theme-aware shell styling | Keep the public example template aligned with EmDash menus while improving the AWCMS-Micro demo UX | If upstream EmDash gains equivalent template capabilities | OpenCode / GPT-5.4 |
| 2026-05-23 | `awcmsmicro-dev/packages/plugins/awcms-micro-example/`, `awcmsmicro-dev/docs/awcms-micro/`, `awcmsmicro-dev/e2e/awcms-micro/` | add/adapt | active | Added plugin header submenu rendering, navigation docs, and accessibility smoke coverage | Keep plugin-specific navigation organized without changing the EmDash admin sidebar | If upstream EmDash gains a native plugin-local navigation model | OpenCode / GPT-5.4 |
| 2026-05-24 | `.github/workflows/deploy.yml`, `awcmsmicro-dev/.github/dependabot.yml` | adapt | active | Pinned the root deploy workflow actions and added pnpm Dependabot coverage for the workspace | Reduce workflow supply-chain risk and make dependency update automation cover the actual pnpm tree | If automation trust model or package-management layout changes | OpenCode / GPT-5.4 |
| 2026-05-24 | `awcmsmicro-dev/pnpm-workspace.yaml`, `awcmsmicro-dev/docs/package.json`, `awcmsmicro-dev/packages/*/package.json`, `awcmsmicro-dev/templates/awcms-micro-default/package.json`, `awcmsmicro-dev/packages/create-emdash/package.json` | adapt | active | Raised direct dependency ranges and added transitive overrides for the workspace security audit | Reduce Dependabot and code-scanning findings from vulnerable direct and transitive packages | If upstream dependency policy changes or the security baseline is revised | OpenCode / GPT-5.4 |
| 2026-05-24 | `awcmsmicro-dev/.github/workflows/*` | adapt | active | Rewrote privileged workflow automation into manual/read-only workflows | Remove GitHub App token usage and untrusted privileged checkouts while preserving manual maintenance paths | If a safer trusted automation model is later approved | OpenCode / GPT-5.4 |
| 2026-05-27 | `awcmsmicro-dev/packages/plugins/awcms-micro-example/`, template admin wrappers, root governance docs | adapt | completed | Moved active navigation and i18n helpers from the retired shared package layer into plugin-owned exports and updated governance docs accordingly | Enforce the plugin-and-template-only development model in code and governance | Re-open only if a future capability cannot live cleanly in plugin or template boundaries | OpenCode / GPT-5.4 |

## Review Reminder

When adding a new row, also check whether `COMPATIBILITY_MATRIX.md`, deployment docs, or security docs should be updated in the same change.
