---
name: sikesra-admin-ui-workflows
description: SIKESRA admin UI/UX workflows. Use when building or reviewing SIKESRA admin pages, route safety, registry wizard, verification queues, access screens, audit screens, Kumo components, privacy states, accessibility, i18n, or UI tests.
---

# SIKESRA Admin UI Workflows

Use this skill for SIKESRA admin UI, UX flows, React components, route safety, accessibility, privacy states, page contracts, and UI tests.

## Required Sources

Read these before changing SIKESRA admin UI:

1. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/UI_UX_DESIGN_STANDARD.md`.
2. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/TECHNICAL_PRD.md`.
3. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/IMPLEMENTATION_GOVERNANCE.md`.
4. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/MERMAID_DIAGRAMS.md`.
5. `awcmsmicro-dev/AGENTS.md` for Kumo, Lingui, RTL-safe Tailwind, and testing rules.
6. `.opencode/skills/frontend-ui-ux/SKILL.md` for general frontend guardrails.

## Route Safety

- All admin links, module cards, shortcuts, and action buttons must stay under `/_emdash/admin/plugins/awcms-micro-sikesra/`.
- Never use public root-relative paths for admin actions.
- Normalize plugin-local paths before rendering links.
- Keep public links visually distinct from admin actions.
- Add or update tests when link generation, dashboard shortcuts, or route aliases change.

## Operator Journey

All pages should fit this journey:

```txt
Configure -> Input or Import -> Validate -> Verify -> Publish Aggregate -> Report or Export -> Audit or Govern
```

Every page should define the relevant part of that journey and show where the operator is in the flow.

## Page Anatomy

Prefer this structure unless the page has no matching workflow need:

```txt
Page header
Purpose description
Primary action area
Filters or search
Status summary
Main content table, card, or form
Context panel or detail drawer
Audit or status footer
Empty, loading, and error states
```

Use `SIKESRA_PAGE_PATTERN_CONTRACTS` in `src/admin/ui-standards.ts` when page contracts exist or must be extended.

## Workflow-Specific UI Rules

- Overview: readiness banner, KPIs, shortcuts, 8 module cards, public aggregate preview, recent audit/lifecycle activity.
- Registry: module selector, filters, masked sensitive columns, detail drawer, create/edit wizard, entity audit trail.
- Wizard: module/subtype, region, identity, personal/institution detail, KTP and domicile address when applicable, module fields, custom attributes, documents, privacy review, save or submit.
- Verification: queue-based workflow with level, region, module, document completeness, and pending-age filters; reject/revision require reason and audit impact.
- Documents: completeness, linked entity, classification, validation, restricted access, controlled preview/download, audit history.
- Import: upload, preview, mapping, validation, duplicate review, promotion, summary; block promotion while validation errors remain.
- Access and ABAC: separate users, roles, permissions, scopes, matrix, ABAC policies, access preview, and ABAC preview; EmDash users are references only.
- Audit: default to redacted metadata and expose sensitive details only through permission-aware reveal workflows.
- Custom attributes: controlled form-builder model with protected-key checks, masking, impact preview, and audit.
- CRUD governance: archive, restore, permanent delete, restricted export, and sensitive reveal require high-friction confirmation when required.

## Privacy And Safety States

Represent sensitive data as state without exposing the value. Use stable labels such as:

```txt
Masked
Sensitive
Restricted
Public Safe
Suppressed
Needs Review
Permission Denied
ABAC Denied
Audit Required
```

Public aggregate UI must explain suppression and small-cell protection.

## Component And Accessibility Rules

- Use Kumo components instead of hand-rolled buttons, inputs, dialogs, selects, badges, loaders, toasts, popovers, or tooltips.
- Use Lingui-compatible localization for every user-facing string.
- Keep English (`en`) and Indonesian (`id`) plugin PO catalogs aligned for changed user-facing copy.
- Use RTL-safe Tailwind logical classes.
- Provide keyboard navigation, visible focus, labels, ARIA labels for icon-only actions, field-level error text, and status text not color alone.
- Use or extend `SIKESRA_ACCESSIBILITY_CHECKLIST` where tests can enforce it.

## Validation

- `pnpm --filter @awcms-micro/plugin-sikesra typecheck`
- `pnpm --filter @awcms-micro/plugin-sikesra test`
- `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:check-routes`
- `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:check-admin-pages`
- `bash scripts/validate-awcmsmicro-boundaries.sh`
