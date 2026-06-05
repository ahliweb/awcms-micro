---
name: sikesra-plugin-governance
description: SIKESRA plugin governance and implementation sequencing. Use when planning, reviewing, or implementing AWCMS-Micro SIKESRA plugin work, GitHub issues #119-#143, plugin identity, boundaries, PRD alignment, rebuild safety, or acceptance criteria.
---

# SIKESRA Plugin Governance

Use this skill for any work on `@awcms-micro/plugin-sikesra`, especially when the task mentions SIKESRA, issue #119 through #143, plugin identity, PRD alignment, implementation order, rebuild safety, or production readiness.

## Required Reading

Read these before changing SIKESRA code, docs, scripts, tests, generated outputs, or tracked config:

1. Root `README.md`.
2. Root `AGENTS.md`.
3. `docs/awcms-micro-github-issue-system.md`.
4. `docs/awcms-micro-mermaid-diagram-standard.md`.
5. `docs/awcms-micro-sikesra-plugin-governance.md`.
6. `docs/awcms-micro-implementation-boundaries.md`.
7. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/README.md`.
8. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/IMPLEMENTATION_GOVERNANCE.md`.
9. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/TECHNICAL_PRD.md`.
10. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/MERMAID_DIAGRAMS.md`.

## Canonical Identity

- Package: `@awcms-micro/plugin-sikesra`.
- Plugin ID: `awcms-micro-sikesra`.
- Name: `AWCMS-Micro SIKESRA Plugin`.
- Primary export: `awcmsMicroSikesraPlugin`.
- Deprecated compatibility alias: `awcmsMicroExamplePlugin` only while migration requires it.
- Do not introduce new `Example Plugin` identity or wording except in explicit migration/deprecation notes.

## Boundary Rules

- Keep SIKESRA product behavior inside `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/` unless the issue explicitly requires approved template, docs, E2E, script, workflow, or patch-overlay support.
- Do not modify `emdash-latest/` for SIKESRA behavior.
- Do not move SIKESRA canonical behavior into EmDash core packages.
- If a persistent source-level downstream override outside the plugin/template boundary is required, encode it as an `awcmsmicro-dev/.awcms-patches/` overlay and record it in `docs/upstream-sync/DIVERGENCE_LOG.md`.
- Keep plugin and template translations in PO catalogs under `src/locales/{en,id}/messages.po`.

## Required Issue Order

Follow this order before starting later workflows:

1. #140 plugin identity.
2. #141 admin dashboard route bug fix.
3. #142 admin UI/UX design system.
4. #119 `sikesra_` naming policy.
5. #121 D1 prefix validation test.
6. #136 EmDash update/rebuild compatibility.
7. #137 data preservation guardrails.
8. #120 D1 migration framework.
9. #122 D1 repository layer.
10. #143 typed frontend-backend-D1 integration contract.
11. #123 settings, regions, data types.
12. #135 field standards.
13. #124 migration from KV/plugin storage to D1.
14. #125 registry D1 tables for all 8 modules.
15. #132 RBAC/ABAC with EmDash user assignment.
16. #133 audit table and redaction policy.
17. #126 registry routes to D1.
18. #127 20-digit SIKESRA ID service.
19. #128 verification tables and routes.
20. #129 documents and R2 metadata.
21. #130 staged CSV/XLSX import.
22. #131 duplicate detection and decisions.
23. #134 controlled export/report workflow.
24. #138 dynamic custom attributes.
25. #139 full CRUD and highest-admin governance.

Do not implement later workflow features before earlier identity, route, UI/UX, naming, guardrail, migration, repository, typed integration, field-standard, RBAC/ABAC, and audit foundations are ready.

## Core Product Requirements

- Support 8 modules: `rumah_ibadah`, `lembaga_keagamaan`, `pendidikan_keagamaan`, `lks`, `guru_agama`, `anak_yatim`, `disabilitas`, and `lansia_terlantar`.
- Integrate admin UI, typed API client, plugin route, trusted EmDash user, SIKESRA RBAC/ABAC guard, service layer, repository layer, `sikesra_` D1 tables, serializers, masking, and audit.
- Use dedicated `sikesra_` D1 tables as the target production source of truth.
- Use EmDash users as identity references; do not create, mutate, reset, or delete EmDash users from SIKESRA.
- Keep public routes aggregate-only and public-safe.
- Use soft delete by default; permanent delete belongs only to the highest-admin governance workflow.

## Diagram Rules

Update `docs/MERMAID_DIAGRAMS.md` when work changes:

- plugin boundary or EmDash compatibility;
- D1 schema, repositories, or data preservation;
- admin UI flow or wizard flow;
- frontend-backend-D1 integration;
- RBAC/ABAC, audit, masking, import, export, or lifecycle governance;
- Cloudflare D1/R2 topology.

## Validation

Use targeted validation first, then broaden if needed:

- `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:validate-after-emdash-sync`
- `pnpm --filter @awcms-micro/plugin-sikesra typecheck`
- `pnpm --filter @awcms-micro/plugin-sikesra test`
- `pnpm --filter @awcms-micro/plugin-sikesra build`
- `bash scripts/validate-awcmsmicro-boundaries.sh`
