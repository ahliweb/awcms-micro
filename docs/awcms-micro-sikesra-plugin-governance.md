# AWCMS-Micro SIKESRA Plugin Governance

This document summarizes the repository-level governance rules for the AWCMS-Micro SIKESRA plugin.

The detailed implementation backlog is tracked in GitHub issues #119 through #140.

## 1. Plugin Boundary

SIKESRA is a downstream AWCMS-Micro plugin.

Canonical location:

```txt
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/
```

Allowed supporting locations:

```txt
awcmsmicro-dev/templates/awcms-micro-default/
awcmsmicro-dev/templates/awcms-micro-default-cloudflare/
awcmsmicro-dev/docs/awcms-micro/
awcmsmicro-dev/e2e/awcms-micro/
awcmsmicro-dev/.awcms-changesets/
awcmsmicro-dev/.awcms-patches/
docs/
scripts/
```

Do not place SIKESRA-specific canonical logic inside EmDash core packages.

Forbidden locations for SIKESRA canonical business behavior:

```txt
emdash-latest/packages/core/
emdash-latest/packages/admin/
emdash-latest/packages/*
```

Exception: an explicit upstream EmDash contribution may touch EmDash core, but it must be tracked as upstream work and must not be required for SIKESRA data safety.

## 2. Issue Backlog Source of Truth

The current SIKESRA roadmap is split into atomic GitHub issues:

| Issue | Purpose |
| ---: | --- |
| #119 | Dedicated `sikesra_` D1 table and collection naming policy |
| #120 | SIKESRA D1 migration framework |
| #121 | D1 table prefix validation test |
| #122 | D1 repository layer |
| #123 | Core D1 tables for settings, data types, and regions |
| #124 | Migration from KV/plugin storage to dedicated D1 tables |
| #125 | Registry D1 tables for all 8 data modules |
| #126 | Registry list/save route refactor to D1 |
| #127 | D1-backed 20-digit SIKESRA ID sequence service |
| #128 | Verification D1 tables and routes |
| #129 | Document D1 tables and secure R2 metadata workflow |
| #130 | D1-backed staged CSV/XLSX import workflow |
| #131 | Duplicate detection and duplicate decisions |
| #132 | SIKESRA RBAC/ABAC with EmDash user assignment |
| #133 | Canonical D1 audit table and redaction policy |
| #134 | D1 export job and controlled report/export workflow |
| #135 | Standard personal and non-personal fields for all 8 modules |
| #136 | EmDash update/rebuild compatibility guardrails |
| #137 | Data preservation guardrails for update/rebuild safety |
| #138 | Dynamic custom attributes by data type, subtype, entity, or SIKESRA ID |
| #139 | Full CRUD and highest-admin permanent delete governance |
| #140 | Final SIKESRA plugin identity and export name |

## 3. Implementation Order

Preferred execution order:

1. #140: finalize plugin identity.
2. #119 and #121: enforce `sikesra_` naming guardrails.
3. #136 and #137: protect source compatibility and data preservation.
4. #120 and #122: add D1 migrations and repository layer.
5. #123, #124, and #125: create and migrate core D1 data.
6. #126, #127, and #128: implement registry, ID generation, and verification.
7. #129, #130, #131, #133, and #134: implement documents, import, duplicate detection, audit, and export.
8. #132 and #135: align RBAC/ABAC and field standards.
9. #138 and #139: implement custom attributes and CRUD/permanent delete governance.

Field standards from #135 should inform D1 table design in #125 and route refactoring in #126.

## 4. D1 Data Boundary

All canonical SIKESRA production tables must use the `sikesra_` prefix.

Examples:

```txt
sikesra_registry_entities
sikesra_person_profiles
sikesra_supporting_documents
sikesra_verification_events
sikesra_audit_events
sikesra_user_role_assignments
sikesra_abac_policy_rules
sikesra_custom_attribute_definitions
sikesra_delete_requests
```

Rules:

- Do not create unprefixed SIKESRA tables.
- Do not store SIKESRA canonical business data in EmDash core tables.
- Do not store SIKESRA canonical production data only in generic plugin storage once D1 migration is implemented.
- Every business table must be tenant-ready and site-ready.
- Every normal read must be tenant/site scoped.
- Soft-deleted rows must be excluded by default.

Minimum business-table columns:

```txt
tenant_id
site_id
created_at
updated_at
deleted_at
created_by
updated_by
```

## 5. EmDash User Reference Rule

SIKESRA must not create a separate user system.

Rules:

- Use trusted EmDash user/session identity as the source of user identity.
- Reference EmDash user IDs from SIKESRA assignment tables.
- Store SIKESRA role, permission, scope, and ABAC data in `sikesra_` tables.
- Do not mutate EmDash core user tables from the SIKESRA plugin.
- Do not delete EmDash users from the SIKESRA plugin.
- If an EmDash user is removed or deactivated, preserve SIKESRA assignment history and mark/report the reference as inactive or orphaned.

## 6. Field Standards

Every SIKESRA field must have a clear classification:

```txt
non_personal
personal
sensitive_personal
restricted
```

Personal modules must distinguish between:

```txt
alamat_ktp_*
alamat_domisili_*
alamat_domisili_sama_dengan_ktp
```

Rules:

- KTP address and domicile address are sensitive personal data.
- Public APIs must never expose KTP or domicile address details.
- Export of KTP or domicile address requires restricted export permission, reason, and audit.
- Import mapping must distinguish KTP address fields and domicile address fields.

## 7. Public Aggregate Rule

SIKESRA public output must be aggregate-only and public-safe.

Rules:

- Public routes may expose only approved aggregate counts or public-safe non-personal aggregate attributes.
- Public output must not expose names, NIK/KIA, KK, phone numbers, emails, KTP addresses, domicile addresses, exact residential coordinates, sensitive welfare data, raw document metadata, or internal storage details.
- Small-cell suppression must remain enabled for vulnerable groups.

## 8. RBAC, ABAC, and CRUD

SIKESRA authorization must enforce:

```txt
trusted EmDash user identity
SIKESRA role assignment
SIKESRA permission
ABAC region scope
ABAC organization/module scope
data sensitivity and masking policy
audit logging for sensitive or mutating actions
```

Delete policy:

- soft delete is the default;
- restore is allowed where applicable;
- permanent delete is exceptional;
- permanent delete belongs only to the `sikesra_super_admin` workflow;
- permanent delete must require reason, confirmation, snapshot, audit, and integrity check;
- permanent delete must not delete EmDash users.

## 9. Update/Rebuild Safety

SIKESRA must remain safe across:

```txt
EmDash upstream update
dependency reinstall
workspace rebuild
local template rebuild
Cloudflare template rebuild
D1 migration rerun
template regeneration
```

Guardrails required by #136 and #137 include:

```txt
awcms:sikesra:check-boundary
awcms:sikesra:check-d1-prefix
awcms:sikesra:check-routes
awcms:sikesra:check-admin-pages
awcms:sikesra:check-data-boundary
awcms:sikesra:check-destructive-migrations
awcms:sikesra:check-user-references
awcms:sikesra:check-file-links
awcms:sikesra:backup-inventory
awcms:sikesra:validate-data-after-rebuild
```

These scripts may be introduced incrementally, but every implemented script must be documented and testable.

## 10. Validation Baseline

Plugin validation:

```bash
cd awcmsmicro-dev/packages/plugins/awcms-micro-sikesra
pnpm typecheck
pnpm test
pnpm build
```

Local template validation:

```bash
cd awcmsmicro-dev/templates/awcms-micro-default
pnpm typecheck
pnpm build
```

Cloudflare template validation:

```bash
cd awcmsmicro-dev/templates/awcms-micro-default-cloudflare
pnpm validate:cloudflare-env
pnpm typecheck
pnpm build
```

Root validation:

```bash
bash scripts/validate-awcmsmicro-boundaries.sh
bash scripts/validate-awcmsmicro-dev.sh
```

## 11. Non-Negotiable Rules

- Do not modify EmDash core for SIKESRA-specific behavior.
- Do not store SIKESRA production data in unprefixed tables.
- Do not expose personal or sensitive SIKESRA data publicly.
- Do not trust client-provided SIKESRA user headers in production.
- Do not use destructive migrations by default.
- Do not delete EmDash core users from SIKESRA.
- Do not let rebuilds silently destroy, reset, expose, or corrupt SIKESRA data.
