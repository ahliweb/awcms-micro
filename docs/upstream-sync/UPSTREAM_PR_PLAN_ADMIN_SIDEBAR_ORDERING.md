# Upstream PR Plan: Global Admin Sidebar Ordering

## Purpose

This note defines a narrow upstream PR plan for making the global EmDash admin sidebar honor downstream plugin group ordering metadata.

It is intentionally scoped smaller than the broader sidebar-tree and menu-sync proposals already discussed upstream.

## Scope

This PR should focus only on:

- consuming plugin-provided `sidebarPlacement`
- consuming plugin-provided `sidebarPriority`
- ordering plugin groups relative to built-in EmDash sidebar sections
- preserving current behavior when plugins do not provide these fields

## Out Of Scope

Do not include these in the same PR:

- public menu sync
- collection reorder UI/API
- arbitrary nested admin sidebar trees beyond the already-agreed plugin-local structure
- general-purpose menu builder work
- unrelated plugin contract validation improvements
- public render query optimizations

## Problem Statement

AWCMS-Micro now has downstream plugin metadata that can express admin group placement and ordering, but the global EmDash admin sidebar does not yet consume that metadata when composing the final sidebar.

That means downstream is metadata-ready, but upstream still controls the actual rendering outcome.

## Existing Downstream-Proven Metadata

The downstream plugin layer already uses:

```ts
sidebarPlacement: "after-dashboard" | "before-emdash-default" | "after-emdash-default" | "plugin-local-only" | "header-only"
sidebarPriority: number
```

Representative downstream usage already proven in AWCMS-Micro:

- dashboard group: `after-dashboard`, `sidebarPriority: 10`
- content group: `before-emdash-default`, `sidebarPriority: 20`
- governance group: `before-emdash-default`, `sidebarPriority: 30`
- settings group: `before-emdash-default`, `sidebarPriority: 40`

## Intended Upstream Behavior

### Placement semantics

- `after-dashboard`
  - render directly below the Dashboard item/group
- `before-emdash-default`
  - render before the standard built-in EmDash admin groups
- `after-emdash-default`
  - render after the standard built-in EmDash admin groups
- `plugin-local-only`
  - do not inject into the global sidebar; keep usable only in plugin-local navigation surfaces
- `header-only`
  - do not inject into the global sidebar; reserve for header/plugin-local surfaces only

### Ordering semantics

- lower `sidebarPriority` renders first within the same placement bucket
- ties fall back to group `sortOrder`
- remaining ties fall back to label or existing deterministic ordering

## Candidate Upstream Touchpoints

Primary likely touchpoint:

- `packages/admin/src/components/Sidebar.tsx`

Potential supporting touchpoints if needed:

- plugin manifest/admin config normalization path in core/admin runtime
- any plugin admin metadata loader that currently discards or ignores placement/order fields

## Backward Compatibility Requirements

- plugins with only current `adminPages` continue to render exactly as they do now
- plugins without placement metadata continue to use current fallback behavior
- no migration is required for existing plugin packages
- no built-in EmDash menu ordering changes occur unless plugin metadata explicitly requests placement

## Suggested Implementation Strategy

1. Read normalized plugin group metadata where available.
2. Partition plugin groups into placement buckets.
3. Merge those buckets into the existing sidebar render order.
4. Keep `plugin-local-only` and `header-only` groups out of the global sidebar.
5. Fall back to current flat `adminPages` grouping when no structured group metadata is present.

## Acceptance Criteria

- plugin groups marked `after-dashboard` render below Dashboard in the global sidebar
- plugin groups marked `before-emdash-default` render above built-in EmDash menu groups
- plugin groups marked `after-emdash-default` render below built-in EmDash menu groups
- plugin groups marked `plugin-local-only` do not appear in the global sidebar
- plugin groups are ordered by `sidebarPriority`, then `sortOrder`
- existing plugins without the new metadata remain unchanged

## Suggested Tests

1. Sidebar render test with a plugin group marked `after-dashboard`
2. Sidebar render test with multiple `before-emdash-default` groups and distinct priorities
3. Sidebar render test proving `plugin-local-only` does not inject into the global sidebar
4. Regression test proving a legacy plugin with only flat `adminPages` still renders correctly

## Related Upstream Context

- Discussion: `https://github.com/emdash-cms/emdash/discussions/1151#discussioncomment-17081862`
- Existing broader sidebar issues already exist, so this PR plan intentionally narrows the work to one compositional behavior.

## Recommended Next Step

Prepare a focused upstream PR that changes only the global sidebar composition logic and its tests.
