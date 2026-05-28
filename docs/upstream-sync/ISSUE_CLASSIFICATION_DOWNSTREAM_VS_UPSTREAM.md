# Issue Classification: Downstream vs Upstream

## Purpose

This note classifies the public-site and admin issues found during AWCMS-Micro validation by where they can be fixed safely.

Use it to avoid spending downstream effort on bottlenecks that actually belong in upstream EmDash core.

## Categories

## Admin Issues Found So Far

The entries below classify the admin-side issues that were directly observed during validation and debugging work.

### Admin: Downstream-fixable

| Issue | Current status | Why it is downstream-fixable |
| --- | --- | --- |
| `awcms-micro-gallery` admin page crashed with `Cannot read properties of undefined (reading 'map')` | Fixed downstream | The plugin emitted a `stats` block with `stats` instead of the renderer's expected `items`, and the faulty payload lived in `packages/plugins/awcms-micro-gallery/` |
| Gallery plugin sandbox admin route used the same incorrect `stats` block shape | Fixed downstream | The mismatch lived in the downstream gallery plugin sandbox entry, not EmDash core |
| Plugin admin pages needed locale-aware and boundary-safe navigation fixes after AWCMS-Micro public/admin routing changes | Fixed downstream | The affected links and route behavior lived in the isolated AWCMS-Micro template/plugin boundaries |
| Plugin group ordering metadata for admin navigation | Fixed downstream | The downstream plugin manifest/navigation layer can already declare `sidebarPlacement` and `sidebarPriority` values, and `awcmsmicro-dev/packages/admin` now consumes them to render plugin groups immediately below Dashboard without changing EmDash core |

### Admin: Upstream-required

| Issue | Current status | Why it requires upstream EmDash |
| --- | --- | --- |
| Block-renderer contract ambiguity for plugin-authored admin blocks is only weakly guarded at runtime | Open | EmDash core/admin would need stronger validation or clearer runtime errors for malformed plugin block payloads before render |
| Admin-side diagnosis of malformed plugin blocks still depends on a generic React crash path instead of a targeted plugin-contract failure path | Open | The renderer, registry, and error-reporting flow live in upstream-owned admin/core paths |
| Global admin sidebar rendering must honor downstream plugin group ordering metadata to place plugin groups above built-in EmDash menus | Open | The final sidebar composition and rendering path still lives in upstream-owned EmDash code; AWCMS-Micro now mirrors the behavior downstream, but plain EmDash still needs native support |

Related upstream discussion:

- discussion follow-up comment: `https://github.com/emdash-cms/emdash/discussions/1151#discussioncomment-17081862`
- focused upstream PR plan: `docs/upstream-sync/UPSTREAM_PR_PLAN_ADMIN_SIDEBAR_ORDERING.md`

### Admin: Workaround-only

| Issue | Current status | Why it is only a workaround downstream |
| --- | --- | --- |
| Cloudflare Insights beacon CSP violation in admin (`beacon.min.js` blocked by `script-src 'self' 'unsafe-inline'`) | Not fixed in code | This is a deployment/CSP/Cloudflare integration choice rather than an EmDash admin rendering bug |
| `Unchecked runtime.lastError: The message port closed before a response was received.` in browser console | Not actionable in repo code | This is commonly caused by browser extensions or browser-side tooling and is not a stable EmDash application error |

### Downstream-fixable

These issues can be fixed inside approved AWCMS-Micro plugin/template boundaries without modifying EmDash core.

| Issue | Current status | Why it is downstream-fixable |
| --- | --- | --- |
| Public links used entry `id` instead of `slug` | Fixed downstream | Link construction lived in AWCMS-Micro template files |
| Locale switcher generated locale-prefixed paths that did not resolve | Fixed downstream | Locale path generation and routing workaround lived in the Cloudflare template |
| Public navigation lacked prefetch | Fixed downstream | Link behavior is template-owned |
| Homepage rendered a second demo navigation tree | Fixed downstream | Duplicate render was removed from both downstream reference templates in `templates/awcms-micro-default*/src/pages/index.astro` |
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

#### Detailed Upstream Escalation: Public Render Query Bottleneck

##### Suggested Upstream Issue Title

`perf(core): reduce public render query count for menu resolution and page metadata paths`

Tracked upstream issue:

- `https://github.com/emdash-cms/emdash/issues/1189`

##### Short Problem Statement

Public pages render correctly, but homepage and localized homepage requests still show a relatively high database query count and measurable server-side render latency even after downstream template duplication was removed.

The strongest remaining hotspot is menu URL resolution in `packages/core/src/menus/index.ts`, which currently resolves referenced content and taxonomy URLs per menu item. The public page metadata and fragment collection path should also be reviewed as part of the same investigation.

##### Why This Is Upstream Work

- The remaining hotspot lives in `awcmsmicro-dev/packages/core/`, which is upstream-owned and not an approved downstream implementation boundary.
- AWCMS-Micro already removed the template-owned duplicate menu render and other downstream inefficiencies.
- Further meaningful reduction now requires changes to EmDash core query strategy rather than downstream template behavior.

##### Evidence Collected

Observed on `https://awcms-micro.ahlikoding.com` after downstream template cleanup and locale fixes:

- `/` commonly reports `db.count=23`
- `/id` commonly reports `db.count=23`
- `/posts` commonly reports `db.count=13`
- `/news` commonly reports `db.count=13`

Representative timing snapshots collected during validation:

| Route | Status | Representative `db.count` | Representative notes |
| --- | --- | --- | --- |
| `/` | 200 | 23 | Higher query count, slower than simple pages |
| `/id` | 200 | 23 | Same query shape as `/`, locale path working |
| `/posts` | 200 | 13 | Lower query count than homepage |
| `/news` | 200 | 13 | Lower query count than homepage |
| `/about` | 200 | 4 | Much cheaper content route |

##### Downstream Cleanup Already Performed

The following downstream-only optimizations were already applied before escalating upstream:

- removed incorrect public links that used entry `id` instead of `slug`
- enabled locale-prefixed public routing through template middleware rewrite
- added public link prefetching for hover navigation
- parallelized homepage collection fetches
- removed a duplicate homepage menu render used only for demo presentation
- disabled footer widget rendering on non-detail public pages that already render their own content summaries

These changes improved correctness and reduced some cache misses, but they did not materially remove the homepage query-count ceiling.

##### Primary Suspected Bottleneck

1. Menu item URL resolution is effectively per-item

File:

- `packages/core/src/menus/index.ts`

Relevant flow:

1. `getMenu()` fetches the menu row
2. it fetches all menu items for the menu
3. it fetches collection URL patterns
4. `buildMenuTree()` calls `resolveMenuItem()` for every item
5. `resolveMenuItem()` calls `resolveContentUrl()` or `resolveTaxonomyUrl()` per item

Current hotspots:

- `resolveContentUrl()` performs locale lookup by `translation_group` per referenced item
- `resolveTaxonomyUrl()` performs locale lookup by `translation_group` per referenced taxonomy item
- fallback lookups add more queries when locale-specific rows are missing

This is a classic candidate for batch resolution.

2. Public metadata/fragments path should be reviewed

Files:

- `packages/core/src/components/EmDashHead.astro`
- `packages/core/src/page/index.ts`
- `packages/core/src/emdash-runtime.ts`

Notes:

- `EmDashHead.astro` already parallelizes site settings, plugin metadata, and fragments.
- `getSiteSettings()` is request-cached and not the main concern.
- The runtime contribution collectors should still be profiled to confirm they are not adding avoidable query work on public requests.

This is a secondary review item. The menu path remains the clearest query-count suspect.

##### Proposed Upstream Fix Direction

A. Batch-resolve menu content references

In `packages/core/src/menus/index.ts`:

- collect all content references by collection before per-item resolution
- fetch all referenced `translation_group` rows for the requested locale in one query per collection
- fetch fallback rows for unresolved groups in one follow-up query per collection
- build an in-memory map `{ collection -> translation_group -> { id, slug } }`
- make `resolveMenuItem()` read from the preloaded map instead of querying per item

B. Batch-resolve taxonomy references

- collect all taxonomy `translation_group` references first
- resolve requested-locale rows in one query
- resolve fallback rows for misses in one follow-up query
- build an in-memory taxonomy map for URL generation

C. Re-profile page metadata contribution path

- verify whether `collectPageMetadata()` or `collectPageFragments()` triggers extra plugin or settings work on public routes
- keep this review additive and measured; do not assume it is the dominant hotspot before profiling confirms it

##### Acceptance Criteria For Upstream Fix

- homepage public requests no longer perform per-menu-item content/taxonomy lookups
- query count for menu-heavy public routes decreases measurably
- no behavior regression for:
  - locale-aware menu links
  - translation fallback behavior
  - custom menu URLs
  - collection and taxonomy menu items
- existing request-cache semantics remain intact
- public route timing improves on D1-backed deployments under cold and warm cache conditions

##### Suggested Validation For Upstream Maintainers

1. Add or update a unit/integration test around `getMenu()` for a menu containing multiple page/post/taxonomy references across locales.
2. Measure query count before and after on a public route that renders a menu with mixed item types.
3. Confirm localized menu links still point to the locale row when it exists and fall back deterministically when it does not.

##### Suggested Upstream Issue Body

```md
## Summary

Public menu-heavy routes still show a relatively high query count on render even after downstream template duplication is removed.

The likely hotspot is `packages/core/src/menus/index.ts`, where menu item URLs are resolved per item via `resolveContentUrl()` / `resolveTaxonomyUrl()`.

## Evidence

- homepage-like public routes commonly show higher `db.count` than simpler pages
- locale-prefixed homepages show the same pattern
- simpler pages such as content detail routes are noticeably cheaper

## Suspected Cause

- menu rows and menu items are fetched once, but referenced content/taxonomy URLs are then resolved one item at a time
- locale fallback logic can add additional queries for misses

## Proposed Fix

- batch-resolve referenced content rows per collection
- batch-resolve taxonomy references
- keep fallback behavior deterministic
- then re-profile `collectPageMetadata()` / `collectPageFragments()` to confirm whether they add meaningful residual overhead

## Acceptance Criteria

- fewer queries for menu-heavy public routes
- no regression in locale-aware menu URLs or fallback behavior
- tests cover mixed menu item types and locale fallback
```

### Workaround-only

These items can sometimes be softened downstream, but not truly solved without upstream work or a product-level tradeoff.

| Issue | Current status | Why it is only a workaround downstream |
| --- | --- | --- |
| Slow-feeling first navigation on cold or less warm edge/runtime state | Mitigated | Prefetch helps, but cold runtime/init and D1 latency still remain |
| Homepage query count spikes that fluctuate by cache warmth | Mitigated | Template cleanup can reduce duplication, but cannot stabilize core query strategy |
| Public route TTFB variance across edge locations | Mitigated | Downstream can reduce payload/query duplication, but not control upstream runtime cost or platform variance |
| Keeping feature parity while avoiding core query hotspots | Tradeoff | Downstream can hide or remove features, but that is a workaround rather than a real fix |

## Practical Rule

When a public or admin issue is found:

1. Check whether it lives in `templates/`, `packages/plugins/`, docs, or other approved AWCMS-Micro boundaries.
2. If yes, fix it downstream.
3. If the hotspot remains in `packages/core/` after downstream duplication is removed, document it and escalate upstream.
4. Avoid local core forks unless there is an explicit decision to accept long-term sync cost.

## Current Recommendation

- Continue using downstream fixes for correctness, routing, and perceived UX issues.
- Track remaining public-render query hotspots as upstream EmDash performance work.
- Use the `Upstream-required` section in this document as the detailed escalation note for the current core bottleneck.

## External References

- upstream discussion: `https://github.com/emdash-cms/emdash/discussions/1151`
- sidebar follow-up comment: `https://github.com/emdash-cms/emdash/discussions/1151#discussioncomment-17081862`
- public render performance issue: `https://github.com/emdash-cms/emdash/issues/1189`
