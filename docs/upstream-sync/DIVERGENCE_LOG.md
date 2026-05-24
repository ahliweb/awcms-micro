# Divergence Log

This log records intentional AWCMS-Micro additions that are not part of upstream EmDash.

## Rules

- Do not log upstream EmDash changes here.
- Log only AWCMS-Micro-specific additions, overlays, or governance changes.
- Keep entries small, factual, and reviewable.

## Entry Template

| Date | Area | Type | Description | Rationale | Impact | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| TBD | TBD | add/adapt/delay/reject | TBD | TBD | TBD | TBD |

## Current Entries

| Date | Area | Type | Description | Rationale | Impact | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-05-22 | Root docs and scripts | add | Added upstream sync tracking, deployment guidance, security baselines, and validation workflow scripts | Keep AWCMS-Micro governance isolated from upstream EmDash | Root-only maintenance layer change | OpenCode / GPT-5.4 |
| 2026-05-22 | `awcmsmicro-dev/templates/awcms-micro-default/` | add | Added an isolated AWCMS-Micro example template | Provide a minimal example without modifying built-in EmDash templates | New example folder only | OpenCode / GPT-5.4 |
| 2026-05-22 | `awcmsmicro-dev/packages/plugins/awcms-micro-example/` | add | Added an isolated AWCMS-Micro example plugin package | Demonstrate tenant-ready plugin conventions without modifying built-in EmDash plugins | New example folder only | OpenCode / GPT-5.4 |
| 2026-05-23 | `awcmsmicro-dev/templates/awcms-micro-default/`, `awcmsmicro-dev/templates/awcms-micro-default-cloudflare/` | adapt | Added recursive public navigation rendering, nested primary menu seeds, and theme-aware shell styling | Keep the public example template aligned with EmDash menus while improving the AWCMS-Micro demo UX | Template-only example surface | OpenCode / GPT-5.4 |
| 2026-05-23 | `awcmsmicro-dev/packages/plugins/awcms-micro-example/`, `awcmsmicro-dev/docs/awcms-micro/`, `awcmsmicro-dev/e2e/awcms-micro/` | add/adapt | Added plugin header submenu rendering, navigation docs, and accessibility smoke coverage | Keep plugin-specific navigation organized without changing the EmDash admin sidebar | Example plugin, docs, and test harness only | OpenCode / GPT-5.4 |
| 2026-05-24 | `.github/workflows/deploy.yml`, `awcmsmicro-dev/.github/dependabot.yml` | adapt | Pinned the root deploy workflow actions and added pnpm Dependabot coverage for the workspace | Reduce workflow supply-chain risk and make dependency update automation cover the actual pnpm tree | Root automation and workspace update config | OpenCode / GPT-5.4 |
| 2026-05-24 | `awcmsmicro-dev/pnpm-workspace.yaml`, `awcmsmicro-dev/docs/package.json`, `awcmsmicro-dev/packages/*/package.json`, `awcmsmicro-dev/templates/awcms-micro-default/package.json`, `awcmsmicro-dev/packages/create-emdash/package.json` | adapt | Raised direct dependency ranges and added transitive overrides for the workspace security audit | Reduce Dependabot and code-scanning findings from vulnerable direct and transitive packages | Workspace-wide dependency refresh | OpenCode / GPT-5.4 |
| 2026-05-24 | `awcmsmicro-dev/.github/workflows/*`, `scripts/manualize-workflows.mjs` | adapt | Rewrote privileged workflow automation into manual/read-only workflows and added a single maintenance script to regenerate them | Remove GitHub App token usage and untrusted privileged checkouts while preserving manual maintenance paths | Workflow maintenance surface only | OpenCode / GPT-5.4 |
