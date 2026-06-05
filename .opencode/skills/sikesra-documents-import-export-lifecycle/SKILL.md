---
name: sikesra-documents-import-export-lifecycle
description: SIKESRA documents, R2 metadata, staged import, duplicate review, export/report safety, CRUD, soft delete, permanent delete, and lifecycle governance. Use when implementing document workflows, CSV/XLSX import, duplicate detection, export jobs, archive/restore/delete, or highest-admin governance.
---

# SIKESRA Documents, Import, Export, And Lifecycle

Use this skill for SIKESRA document metadata, R2-compatible storage, staged import, duplicate detection, controlled export/report jobs, CRUD policies, soft delete, archive/restore, permanent delete, and highest-admin governance.

## Required Sources

Read these before changing document, import/export, or lifecycle code:

1. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/TECHNICAL_PRD.md`.
2. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/IMPLEMENTATION_GOVERNANCE.md`.
3. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/MERMAID_DIAGRAMS.md`.
4. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/UI_UX_DESIGN_STANDARD.md`.
5. `.opencode/skills/sikesra-rbac-abac-audit/SKILL.md`.
6. `.opencode/skills/sikesra-d1-data-model/SKILL.md`.

## Document And R2 Metadata Rules

Documents use SIKESRA-specific D1 metadata and R2-compatible storage organization.

Target object organization:

```txt
tenants/{tenant_id}/sites/{site_id}/modules/sikesra/{classification}/{year}/{month}/{safe_filename}
```

Rules:

- Public responses must not expose internal storage details.
- File metadata must include classification, checksum, file type, file size, linked registry entity, tenant/site scope, and audit-relevant actor/timestamp fields.
- Restricted document access requires RBAC/ABAC and audit.
- Use controlled preview/download flows rather than leaking raw object keys or storage locations.
- Validate file type, size, classification, and linked entity before metadata is accepted.

## Staged Import Rules

Import must be staged:

```txt
Upload -> Preview -> Map columns -> Validate -> Duplicate review -> Promote valid rows -> Summary
```

Rules:

- Do not insert imported rows directly into registry tables.
- Save raw rows to staging tables.
- Validate before promotion.
- Require duplicate review where needed.
- Unknown columns remain unmapped until approved.
- Import mapping must support fixed fields and custom attributes.
- Promotion must be blocked while validation errors remain.
- Promotion must be auditable.

## Duplicate Detection Rules

- Store duplicate candidates and decisions in `sikesra_` tables.
- Preserve review decisions, reason, actor, timestamp, and linked import/registry records.
- Do not silently merge or overwrite canonical registry rows without a governed decision.

## Export And Report Rules

Export must be controlled:

- Restricted export requires permission, reason, and audit.
- Export must obey field classification and masking policy.
- Public reports may use only public-safe non-personal aggregate fields.
- Export jobs must be recorded in `sikesra_export_jobs` or the current canonical export job table.
- KTP address, domicile address, raw document metadata, internal storage paths, and restricted custom attributes require explicit restricted-export policy and audit.

## CRUD Policy

Every feature group must define behavior for:

```txt
create
read_list
read_detail
update
soft_delete
restore
archive
permanent_delete
```

Use `src/contracts/crud-contracts.ts` when updating machine-readable CRUD policies.

Current governed feature groups include registry, person, module detail, file metadata, import, export, verification, settings, region, data type, field standard, custom attribute, custom attribute value, RBAC, ABAC, user assignment, and audit.

## Lifecycle Governance

Soft delete is the default.

Permanent delete requires:

```txt
sikesra_super_admin
explicit permanent-delete permission
reason
confirmation
snapshot
integrity check
```

Rules:

- Permanent delete must be request-first, snapshot-first, approval-gated, and reference-checked.
- Target tables must be SIKESRA-owned `sikesra_` tables.
- EmDash core user tables must never be permanent-delete targets from SIKESRA.
- Audit events require a separate retention-purge workflow.
- Registry permanent delete must be blocked when supporting documents or verification events reference the entity.

## Validation

- `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:check-file-links`
- `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:backup-inventory`
- `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:check-data-boundary`
- `pnpm --filter @awcms-micro/plugin-sikesra test`
- `pnpm --filter @awcms-micro/plugin-sikesra typecheck`
- `bash scripts/validate-awcmsmicro-boundaries.sh`
