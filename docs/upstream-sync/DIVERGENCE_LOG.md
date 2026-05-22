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
