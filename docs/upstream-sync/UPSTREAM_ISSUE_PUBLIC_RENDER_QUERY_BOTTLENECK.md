# Upstream Issue Note: Public Render Query Bottleneck

## Purpose

This note captures a performance bottleneck observed while validating the AWCMS-Micro public templates against upstream EmDash.

The bottleneck appears to live in upstream-owned EmDash core paths rather than in AWCMS-Micro plugin or template boundaries. It should therefore be raised and resolved upstream instead of patched downstream.

## Suggested Upstream Issue Title

`perf(core): reduce public render query count for menu resolution and page metadata paths`

## Short Problem Statement

Public pages render correctly, but homepage and localized homepage requests still show a relatively high database query count and measurable server-side render latency even after downstream template duplication was removed.

The strongest remaining hotspot is menu URL resolution in `packages/core/src/menus/index.ts`, which currently resolves referenced content and taxonomy URLs per menu item. The public page metadata and fragment collection path should also be reviewed as part of the same investigation.

## Why This Is Upstream Work

- The remaining hotspot lives in `awcmsmicro-dev/packages/core/`, which is upstream-owned and not an approved downstream implementation boundary.
- AWCMS-Micro already removed the template-owned duplicate menu render and other downstream inefficiencies.
- Further meaningful reduction now requires changes to EmDash core query strategy rather than downstream template behavior.

## Observed Symptoms

- Public navigation feels slower than expected on the homepage compared with simpler content pages.
- `server-timing` for live public routes shows homepage query counts significantly above simpler pages.
- Query counts fluctuate with cache warmth, but the homepage still trends higher than list/detail pages.

## Evidence Collected

### Live route observations

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

### Downstream cleanup already performed

The following downstream-only optimizations were already applied before escalating upstream:

- removed incorrect public links that used entry `id` instead of `slug`
- enabled locale-prefixed public routing through template middleware rewrite
- added public link prefetching for hover navigation
- parallelized homepage collection fetches
- removed a duplicate homepage menu render used only for demo presentation
- disabled footer widget rendering on non-detail public pages that already render their own content summaries

These changes improved correctness and reduced some cache misses, but they did not materially remove the homepage query-count ceiling.

## Primary Suspected Bottleneck

### 1. Menu item URL resolution is effectively per-item

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

### 2. Public metadata/fragments path should be reviewed

Files:

- `packages/core/src/components/EmDashHead.astro`
- `packages/core/src/page/index.ts`
- `packages/core/src/emdash-runtime.ts`

Notes:

- `EmDashHead.astro` already parallelizes site settings, plugin metadata, and fragments.
- `getSiteSettings()` is request-cached and not the main concern.
- The runtime contribution collectors should still be profiled to confirm they are not adding avoidable query work on public requests.

This is a secondary review item. The menu path remains the clearest query-count suspect.

## Proposed Upstream Fix Direction

### A. Batch-resolve menu content references

In `packages/core/src/menus/index.ts`:

- collect all content references by collection before per-item resolution
- fetch all referenced `translation_group` rows for the requested locale in one query per collection
- fetch fallback rows for unresolved groups in one follow-up query per collection
- build an in-memory map `{ collection -> translation_group -> { id, slug } }`
- make `resolveMenuItem()` read from the preloaded map instead of querying per item

### B. Batch-resolve taxonomy references

- collect all taxonomy `translation_group` references first
- resolve requested-locale rows in one query
- resolve fallback rows for misses in one follow-up query
- build an in-memory taxonomy map for URL generation

### C. Re-profile page metadata contribution path

- verify whether `collectPageMetadata()` or `collectPageFragments()` triggers extra plugin or settings work on public routes
- keep this review additive and measured; do not assume it is the dominant hotspot before profiling confirms it

## Acceptance Criteria For Upstream Fix

- homepage public requests no longer perform per-menu-item content/taxonomy lookups
- query count for menu-heavy public routes decreases measurably
- no behavior regression for:
  - locale-aware menu links
  - translation fallback behavior
  - custom menu URLs
  - collection and taxonomy menu items
- existing request-cache semantics remain intact
- public route timing improves on D1-backed deployments under cold and warm cache conditions

## Suggested Validation For Upstream Maintainers

1. Add or update a unit/integration test around `getMenu()` for a menu containing multiple page/post/taxonomy references across locales.
2. Measure query count before and after on a public route that renders a menu with mixed item types.
3. Confirm localized menu links still point to the locale row when it exists and fall back deterministically when it does not.

## Suggested Upstream Issue Body

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

## Repository Use

Use this note as:

- the basis for a GitHub issue in upstream EmDash
- a reminder that this bottleneck is known and should not be worked around by growing downstream template complexity
