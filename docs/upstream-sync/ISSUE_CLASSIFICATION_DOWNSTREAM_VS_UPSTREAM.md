# Issue Classification: Downstream vs Upstream

## Purpose

This note classifies the public-site issues found during AWCMS-Micro validation by where they can be fixed safely.

Use it to avoid spending downstream effort on bottlenecks that actually belong in upstream EmDash core.

## Categories

### Downstream-fixable

These issues can be fixed inside approved AWCMS-Micro plugin/template boundaries without modifying EmDash core.

| Issue | Current status | Why it is downstream-fixable |
| --- | --- | --- |
| Public links used entry `id` instead of `slug` | Fixed downstream | Link construction lived in AWCMS-Micro template files |
| Locale switcher generated locale-prefixed paths that did not resolve | Fixed downstream | Locale path generation and routing workaround lived in the Cloudflare template |
| Public navigation lacked prefetch | Fixed downstream | Link behavior is template-owned |
| Homepage rendered a second demo navigation tree | Fixed downstream | Duplicate render lived entirely in `templates/awcms-micro-default-cloudflare/src/pages/index.astro` |
| Homepage collection queries were serial | Fixed downstream | Fetch ordering lived in the template page |
| Footer widgets duplicated content summaries on list/index pages | Fixed downstream | Footer widget usage was a template layout choice |
| Locale-aware public links across `/`, `/posts`, `/news`, `/gallery`, and content pages | Fixed downstream | URL generation lived in AWCMS-Micro template code |
| Perceived navigation latency from lack of speculative loading | Partially fixed downstream | Prefetch and lighter page composition are template-owned |

### Upstream-required

These issues now appear to depend on upstream-owned EmDash core behavior.

| Issue | Current status | Why it requires upstream EmDash |
| --- | --- | --- |
| High query count on menu-heavy public pages | Open | Remaining hotspot lives in `packages/core/src/menus/index.ts` |
| Per-menu-item content URL resolution (`resolveContentUrl`) | Open | Query strategy is implemented in EmDash core |
| Per-menu-item taxonomy URL resolution (`resolveTaxonomyUrl`) | Open | Query strategy is implemented in EmDash core |
| Residual public render cost after downstream cleanup | Open | Remaining cost is driven by runtime/core request paths rather than template duplication |
| Runtime initialization overhead on public requests | Open | Lives in EmDash runtime setup, plugin-state loading, and related core code |
| Potential metadata/fragment contribution overhead | Open | Collection path lives in `packages/core/src/components/EmDashHead.astro` and runtime collectors |
| Stable reduction of homepage `db.count` after downstream fixes | Open | Query-count ceiling is now dominated by core-owned data access paths |

### Workaround-only

These items can sometimes be softened downstream, but not truly solved without upstream work or a product-level tradeoff.

| Issue | Current status | Why it is only a workaround downstream |
| --- | --- | --- |
| Slow-feeling first navigation on cold or less warm edge/runtime state | Mitigated | Prefetch helps, but cold runtime/init and D1 latency still remain |
| Homepage query count spikes that fluctuate by cache warmth | Mitigated | Template cleanup can reduce duplication, but cannot stabilize core query strategy |
| Public route TTFB variance across edge locations | Mitigated | Downstream can reduce payload/query duplication, but not control upstream runtime cost or platform variance |
| Keeping feature parity while avoiding core query hotspots | Tradeoff | Downstream can hide or remove features, but that is a workaround rather than a real fix |

## Practical Rule

When a public issue is found:

1. Check whether it lives in `templates/`, `packages/plugins/`, docs, or other approved AWCMS-Micro boundaries.
2. If yes, fix it downstream.
3. If the hotspot remains in `packages/core/` after downstream duplication is removed, document it and escalate upstream.
4. Avoid local core forks unless there is an explicit decision to accept long-term sync cost.

## Current Recommendation

- Continue using downstream fixes for correctness, routing, and perceived UX issues.
- Track remaining public-render query hotspots as upstream EmDash performance work.
- Use `docs/upstream-sync/UPSTREAM_ISSUE_PUBLIC_RENDER_QUERY_BOTTLENECK.md` as the detailed escalation note for the current core bottleneck.
