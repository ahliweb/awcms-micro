# SIKESRA Implementation Governance

This document is the plugin-local implementation guide for the AWCMS-Micro SIKESRA plugin.

It reflects the current GitHub issue backlog #119 through #143 and the repository issue standard in `docs/awcms-micro-github-issue-system.md`.

## 1. Identity

Target plugin identity:

```txt
Package: @awcms-micro/plugin-sikesra
Plugin ID: awcms-micro-sikesra
Name: AWCMS-Micro SIKESRA Plugin
Primary export: awcmsMicroSikesraPlugin
Temporary deprecated alias: awcmsMicroExamplePlugin
```

Rules:

- Keep the plugin slug stable as `awcms-micro-sikesra`.
- New code must use `awcmsMicroSikesraPlugin`.
- `awcmsMicroExamplePlugin` may remain only as a temporary deprecated compatibility alias.
- Do not introduce new `Example Plugin` wording except inside explicit migration/deprecation notes.

## 2. GitHub Issue System

SIKESRA issues are execution contracts.

Issue title pattern:

```txt
[SIKESRA][SEQ-XX][TYPE][PRIORITY] Title
```

Rules:

- `SEQ` controls execution order.
- `P0/P1/P2/P3` controls risk and urgency.
- Suffixes such as `SEQ-01A` or `SEQ-07A` insert dependency work without renumbering the whole backlog.
- Before executing an issue, read the issue body, related issues, and current sequence order.
- When issue order changes, update `docs/awcms-micro-github-issue-system.md`, root docs, and this document.

## 3. Boundary

Allowed plugin boundary:

```txt
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/
```

Allowed integration boundaries:

```txt
awcmsmicro-dev/templates/awcms-micro-default/
awcmsmicro-dev/templates/awcms-micro-default-cloudflare/
awcmsmicro-dev/docs/awcms-micro/
awcmsmicro-dev/e2e/awcms-micro/
awcmsmicro-dev/.awcms-changesets/
```

Do not move SIKESRA-specific logic into EmDash core packages.

## 4. Required Execution Order

Recommended issue order:

| Order | Issue | Purpose |
| ---: | ---: | --- |
| 1 | #140 | Final plugin identity and export name |
| 2 | #141 | Admin dashboard route bug fix |
| 3 | #142 | End-to-end admin UI/UX design system |
| 4 | #119 | Dedicated `sikesra_` D1 table and collection naming policy |
| 5 | #121 | D1 table prefix validation test |
| 6 | #136 | EmDash update/rebuild compatibility guardrails |
| 7 | #137 | Data preservation guardrails |
| 8 | #120 | SIKESRA D1 migration framework |
| 9 | #122 | D1 repository layer |
| 10 | #143 | Typed frontend-backend-D1 integration contract |
| 11 | #123 | Core D1 tables |
| 12 | #135 | Field standards |
| 13 | #124 | Migration from KV/plugin storage to D1 |
| 14 | #125 | Registry D1 tables |
| 15 | #132 | SIKESRA RBAC/ABAC with EmDash user assignment |
| 16 | #133 | Canonical D1 audit table and redaction policy |
| 17 | #126 | Registry list/save route refactor to D1 |
| 18 | #127 | D1-backed 20-digit SIKESRA ID sequence service |
| 19 | #128 | Verification D1 tables and routes |
| 20 | #129 | Document D1 tables and secure R2 metadata workflow |
| 21 | #130 | D1-backed staged CSV/XLSX import workflow |
| 22 | #131 | Duplicate detection and duplicate decisions |
| 23 | #134 | D1 export job and controlled report/export workflow |
| 24 | #138 | Dynamic custom attributes |
| 25 | #139 | Full CRUD and highest-admin governance |

Do not start later workflow work before earlier identity, admin route safety, UI/UX, naming, guardrail, migration, repository, integration contract, field-standard, RBAC/ABAC, and audit foundations are ready.

## 5. D1 Naming and Storage Rule

All SIKESRA-owned production tables and plugin collections must start with `sikesra_`.

Examples:

```txt
sikesra_settings
sikesra_data_types
sikesra_registry_entities
sikesra_person_profiles
sikesra_supporting_documents
sikesra_verification_events
sikesra_audit_events
sikesra_user_role_assignments
sikesra_abac_policy_rules
sikesra_custom_attribute_values
sikesra_delete_requests
```

Rules:

- Do not create SIKESRA production tables without `sikesra_` prefix.
- Do not store SIKESRA canonical production data in generic EmDash tables.
- Do not write SIKESRA canonical production data only to `_plugin_storage` once D1 migration is implemented.
- Use plugin storage/KV only as compatibility, fallback, migration source, or local prototype until the related D1 issues are implemented.

## 6. D1 Migration Rules

SIKESRA migrations must be forward-safe and data-preserving.

Required:

```sql
CREATE TABLE IF NOT EXISTS ...
CREATE INDEX IF NOT EXISTS ...
```

High-risk migration patterns require explicit issue discussion, maintainer approval, backup note, recovery note, and validation.

## 7. Repository Layer

Do not scatter raw D1 access across route handlers.

Target structure:

```txt
src/db/
  connection.ts
  schema.ts
  migrations.ts
  repositories/
    settings-repository.ts
    regions-repository.ts
    registry-repository.ts
    verification-repository.ts
    documents-repository.ts
    import-repository.ts
    access-repository.ts
    abac-repository.ts
    audit-repository.ts
```

Repository rules:

- every query must scope by `tenant_id` and `site_id` when business data is involved;
- normal reads must exclude `deleted_at IS NOT NULL` by default;
- repository functions must access only `sikesra_` tables for SIKESRA-owned data;
- route handlers must enforce authorization before mutation.

## 8. Typed Frontend-Backend-D1 Contract

Issue #143 defines the integration contract.

Target flow:

```txt
Admin UI → typed API client → plugin route → trusted EmDash user → SIKESRA RBAC/ABAC guard → service layer → repository layer → sikesra_ D1 tables → serializer/masking → Admin UI
```

Target structure:

```txt
src/contracts/
src/admin/api/
src/services/
src/serializers/
src/db/
```

Rules:

- do not scatter raw `fetch()` calls across admin UI components;
- do not return raw D1 rows directly to the UI;
- keep public DTOs separate from admin DTOs;
- serializers must mask sensitive fields by default;
- route handlers must validate typed request payloads before service/repository calls.

## 9. EmDash User Reference Rule

SIKESRA uses EmDash users as the shared identity source.

Rules:

- Do not create a duplicate SIKESRA user system.
- Do not delete or mutate EmDash core user records from this plugin.
- Store SIKESRA user-role and user-scope assignments in `sikesra_` tables.
- Reference EmDash user IDs from SIKESRA assignment rows.
- If an EmDash user becomes inactive or missing, preserve assignment history and mark/report the reference as inactive or orphaned.
- Do not trust client-provided `X-Sikesra-User-*` headers in production.

## 10. RBAC and ABAC

SIKESRA route enforcement must check:

```txt
trusted EmDash user identity
SIKESRA role assignment
SIKESRA permission
ABAC region scope
ABAC organization or module scope
data sensitivity/masking rule
audit requirement
```

Explicit deny must override allow.

Required SIKESRA role examples:

```txt
sikesra_super_admin
sikesra_admin
sikesra_operator_kabupaten
sikesra_verifikator_kabupaten
sikesra_verifikator_sopd
sikesra_verifikator_kecamatan
sikesra_verifikator_desa_kelurahan
sikesra_operator_desa_kelurahan
sikesra_viewer_laporan
sikesra_viewer_publikasi
sikesra_auditor
```

## 11. Field Standards

Fixed fields from issue #135 are canonical.

Every field must define:

```txt
key
label
module
fieldGroup
dataClass
required
dataType
storageTable
importable
exportable
publicSafe
maskByDefault
validationRules
```

Valid classifications:

```txt
non_personal
personal
sensitive_personal
restricted
```

Personal modules must support separate KTP and domicile addresses:

```txt
alamat_ktp_province_code
alamat_ktp_regency_code
alamat_ktp_district_code
alamat_ktp_village_code
alamat_ktp_detail
alamat_ktp_rt
alamat_ktp_rw
alamat_ktp_postal_code
alamat_domisili_sama_dengan_ktp
alamat_domisili_province_code
alamat_domisili_regency_code
alamat_domisili_district_code
alamat_domisili_village_code
alamat_domisili_detail
alamat_domisili_rt
alamat_domisili_rw
alamat_domisili_postal_code
```

KTP and domicile address fields are sensitive personal data.

## 12. Eight Core Data Modules

The plugin must support these SIKESRA modules:

```txt
rumah_ibadah
lembaga_keagamaan
pendidikan_keagamaan
lks
guru_agama
anak_yatim
disabilitas
lansia_terlantar
```

Personal/sensitive modules should normalize person data into `sikesra_person_profiles` where appropriate.

## 13. Admin UI/UX Standard

Issue #142 defines the SIKESRA admin UI/UX standard.

The source of truth is:

```txt
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/UI_UX_DESIGN_STANDARD.md
```

Rules:

- keep all admin actions inside `/_emdash/admin/plugins/awcms-micro-sikesra/...`;
- use one operator journey: configure, input or import, validate, verify, publish aggregate, report or export, audit or govern;
- show privacy and masking states before exposing sensitive data;
- keep high-risk actions permission-aware and audit-ready;
- add tests when UI links, workflow steppers, masking, reveal controls, or governance actions are implemented.

## 14. Dynamic Custom Attributes

Custom attributes from issue #138 extend fixed fields without replacing them.

Required tables:

```txt
sikesra_custom_attribute_definitions
sikesra_custom_attribute_values
sikesra_custom_attribute_change_events
```

Rules:

- custom attributes must not override protected fields like `id`, `tenant_id`, `site_id`, `sikesra_id_20`, `verification_stage`, `created_at`, or `updated_at`;
- custom values must be stored separately from fixed fields;
- custom attributes may apply to global, entity type, subtype, registry entity, SIKESRA ID, region scope, organization scope, or program scope;
- sensitive custom attributes must be masked by default;
- custom attributes must survive rebuilds.

## 15. Public Aggregate Safety

Public routes must return only public-safe aggregate data.

Never expose publicly:

```txt
NIK/KIA
nomor_kk
phone/email
KTP address
domicile address
exact residential coordinates
welfare vulnerability details
health/disability details
raw document metadata
internal storage locations
restricted custom attribute values
```

Small-cell suppression must remain enabled for vulnerable categories.

## 16. Documents and File Metadata

Documents use SIKESRA-specific D1 metadata and R2-compatible storage organization.

Target storage organization:

```txt
tenants/{tenant_id}/sites/{site_id}/modules/sikesra/{classification}/{year}/{month}/{safe_filename}
```

Rules:

- public responses must not expose internal storage details;
- file metadata must include classification, checksum, file type, file size, and linked registry entity;
- restricted document access requires RBAC/ABAC and audit.

## 17. Import and Export

Import must be staged.

Rules:

- do not insert import rows directly into registry;
- save raw rows to staging tables;
- validate before promotion;
- require duplicate review where needed;
- unknown columns must remain unmapped until approved;
- import mapping must support fixed fields and custom attributes.

Export must be controlled.

Rules:

- restricted export requires permission, reason, and audit;
- export must obey field classification;
- public reports may use only public-safe non-personal aggregate fields;
- export jobs must be recorded in `sikesra_export_jobs`.

## 18. CRUD and Lifecycle Governance

All features must define:

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

Soft delete is default.

High-impact lifecycle actions require:

```txt
sikesra_super_admin
reason
confirmation
snapshot
audit
integrity check
```

Lifecycle governance must never affect EmDash core users.

## 19. Update and Rebuild Safety

SIKESRA must remain safe across:

```txt
EmDash update
workspace rebuild
dependency reinstall
local template rebuild
Cloudflare rebuild
D1 migration rerun
```

Guardrail scripts planned by #136 and #137:

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

## 20. Validation

Baseline validation:

```bash
pnpm typecheck
pnpm test
pnpm build
```

Template validation:

```bash
cd ../../templates/awcms-micro-default
pnpm typecheck
pnpm build
```

```bash
cd ../../templates/awcms-micro-default-cloudflare
pnpm validate:cloudflare-env
pnpm typecheck
pnpm build
```

## 21. Final Rule

SIKESRA must remain an EmDash-compatible AWCMS-Micro plugin. Custom behavior belongs in plugin, template, docs, scripts, tests, and approved downstream boundaries, not in EmDash core.
