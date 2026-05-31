# AWCMS-Micro SIKESRA Technical PRD

## 1. Overview

This document describes the technical implementation requirements for `@awcms-micro/plugin-sikesra`.

The plugin is an EmDash-compatible AWCMS-Micro downstream plugin for SIKESRA workflows. It must remain plugin-owned and must not move responsibilities into EmDash core.

SIKESRA covers social, welfare, religious, institutional, document, verification, audit, import/export, RBAC/ABAC, custom attribute, and public-safe aggregate workflows.

### Product Shape

- package: `@awcms-micro/plugin-sikesra`
- plugin id: `awcms-micro-sikesra`
- target name: `AWCMS-Micro SIKESRA Plugin`
- target factory export: `awcmsMicroSikesraPlugin`
- temporary deprecated alias: `awcmsMicroExamplePlugin`
- package version: current package version in `package.json`
- localization: `en` default, `id` supported
- UI system: Kumo components for admin surfaces
- upstream compatibility: EmDash-compatible plugin boundary; no EmDash core fork

```mermaid
flowchart LR
  Admin[Admin UI] --> Plugin[SIKESRA Plugin]
  Plugin --> Registry[Registry]
  Plugin --> Verification[Verification]
  Plugin --> Documents[Documents]
  Plugin --> ImportExport[Import and Export]
  Plugin --> RBAC[SIKESRA RBAC]
  Plugin --> ABAC[SIKESRA ABAC]
  Plugin --> Audit[Audit]
  Plugin --> D1[(sikesra_ D1 Tables)]
  Plugin --> Public[Public Safe Aggregate]
  Documents --> R2[(R2-compatible Storage)]
```

## 2. Issue Backlog Alignment

This PRD is aligned with GitHub issues #119 through #140.

| Issue | Requirement Area |
| ---: | --- |
| #119 | `sikesra_` naming policy |
| #120 | D1 migration framework |
| #121 | table-prefix validation |
| #122 | D1 repository layer |
| #123 | settings, regions, data types |
| #124 | KV/plugin-storage to D1 migration |
| #125 | registry tables for 8 modules |
| #126 | registry routes to D1 |
| #127 | 20-digit ID sequence |
| #128 | verification workflow |
| #129 | documents and R2 metadata |
| #130 | staged import |
| #131 | duplicate detection |
| #132 | EmDash user-linked SIKESRA RBAC/ABAC |
| #133 | audit redaction |
| #134 | export workflow |
| #135 | personal and non-personal field standards |
| #136 | EmDash update/rebuild compatibility |
| #137 | data preservation |
| #138 | dynamic custom attributes |
| #139 | CRUD and permanent delete governance |
| #140 | final plugin identity |

## 3. Functional Requirements

### Core Features

- expose a native plugin entry and a resolved plugin entry;
- provide grouped admin navigation placed above default EmDash menus where supported;
- provide admin pages, widgets, and field widgets;
- manage 8 core SIKESRA data modules;
- support standard personal and non-personal fields;
- support separate KTP and domicile address fields for personal modules;
- support dynamic custom attributes by data type, subtype, entity, and 20-digit SIKESRA ID;
- provide registry CRUD and workflow status management;
- provide 20-digit SIKESRA ID generation;
- provide level-based verification;
- provide document metadata and controlled access workflow;
- provide staged CSV/XLSX import;
- provide controlled export and reporting;
- provide duplicate detection;
- provide access-rights management and ABAC management;
- reference EmDash users for SIKESRA role/scope assignments;
- provide audit management and redaction;
- provide a public-safe aggregate route;
- support install, activate, deactivate, and uninstall lifecycle hooks;
- record SIKESRA-owned data in SIKESRA-owned namespaces/tables.

### Non-Functional Requirements

- all user-facing strings must be localized;
- admin layout must remain RTL-safe;
- sensitive decisions must be auditable;
- validation must be deterministic;
- changes must remain additive unless a breaking package bump is intentional;
- D1 migrations must be data-preserving by default;
- plugin behavior must survive EmDash update/rebuild workflows.

### Security Requirements

- no EmDash core auth fork;
- no duplicate SIKESRA-only user system;
- no secret values in tracked source or docs;
- no unchecked public route exposure beyond explicit public-safe aggregate endpoints;
- no public leakage of personal, sensitive personal, restricted, address, document, or internal storage data;
- no destructive migration without explicit approval, backup, and rollback/recovery notes;
- no permanent delete outside the highest-admin workflow.

## 4. Core Data Modules

The plugin must support these modules:

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

Each module must define:

```txt
entity_type
subtype_code
required fields
optional fields
field classifications
validation rules
list columns
detail sections
import mapping
export policy
public aggregate policy
```

## 5. Field Classification

Every field must be classified as one of:

```txt
non_personal
personal
sensitive_personal
restricted
```

Field metadata must include:

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

### Personal Address Standard

Personal modules must distinguish KTP address and domicile address.

Required KTP address fields:

```txt
alamat_ktp_province_code
alamat_ktp_regency_code
alamat_ktp_district_code
alamat_ktp_village_code
alamat_ktp_detail
alamat_ktp_rt
alamat_ktp_rw
alamat_ktp_postal_code
```

Required domicile address fields:

```txt
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

KTP address and domicile address are sensitive personal data.

## 6. Architecture

### Implementation Files

- `src/index.ts`: plugin descriptor and resolved plugin entry
- `src/admin.tsx`: native admin surface
- `src/runtime.ts`: storage, routes, hooks, and manifest definitions
- `src/navigation.ts`: navigation models and adapters
- `src/permissions.ts`: permission helpers and catalog
- `src/audit.ts`: audit recording helpers
- `src/sandbox.ts`: sandbox-compatible server-side entry
- `src/db/`: target D1 repository layer after issue #122
- `migrations/`: target SIKESRA D1 migration folder after issue #120

### Target Data Flow

```mermaid
flowchart TD
  Config[EmDash plugin config] --> Entry[src/index.ts]
  Entry --> Runtime[src/runtime.ts]
  Runtime --> Admin[src/admin.tsx]
  Runtime --> Repositories[src/db repositories]
  Repositories --> D1[(sikesra_ D1 Tables)]
  Admin --> Routes[Plugin Routes]
  Routes --> Repositories
  Routes --> Audit[sikesra_audit_events]
  Documents[Document Workflow] --> R2[R2-compatible Storage]
  Routes --> Public[Public Safe Aggregate]
```

## 7. Database and Storage

### Current Compatibility Layer

The plugin currently uses plugin-owned storage collections and selected D1 support for audit compatibility. Existing collection names must remain prefixed with `sikesra_`.

### Target Production Source of Truth

Dedicated D1 tables with `sikesra_` prefix are the target production source of truth.

Required table categories:

```txt
settings and catalogs
regions and custom regions
data types and subtypes
field standards
registry entities
person profiles
module detail tables
20-digit ID sequences and history
documents and file metadata
verification state and events
import batches and staging rows
duplicate candidates and decisions
export jobs
audit events
RBAC and ABAC configuration
custom attributes and values
delete requests, snapshots, approvals, and events
```

Minimum business table fields:

```txt
tenant_id
site_id
created_at
updated_at
deleted_at
created_by
updated_by
```

### Storage Rules

- use `sikesra_` prefix for every SIKESRA-owned D1 table and plugin collection;
- do not write SIKESRA canonical business data to EmDash core tables;
- do not depend on generic plugin storage as production source of truth once D1 migration is implemented;
- keep D1 migrations idempotent and data-preserving;
- use R2-compatible storage organization for documents.

Document storage organization:

```txt
tenants/{tenant_id}/sites/{site_id}/modules/sikesra/{classification}/{year}/{month}/{safe_filename}
```

## 8. RBAC and ABAC

SIKESRA must use EmDash users as the trusted identity source.

Rules:

- do not create duplicate SIKESRA users;
- do not mutate or delete EmDash core user records;
- store SIKESRA role/scope assignments in `sikesra_` tables;
- use trusted EmDash auth/session context for production identity;
- client-provided SIKESRA user headers may not be trusted in production.

Route enforcement must include:

```txt
trusted EmDash user identity
SIKESRA role assignment
SIKESRA permission
ABAC region scope
ABAC organization/module scope
data sensitivity/masking rule
audit logging
```

## 9. Custom Attributes

Custom attributes extend fixed field standards without replacing them.

Required tables:

```txt
sikesra_custom_attribute_definitions
sikesra_custom_attribute_values
sikesra_custom_attribute_change_events
```

Supported scopes:

```txt
global
entity_type
subtype
registry_entity
sikesra_id_20
region_scope
organization_scope
program_scope
```

Custom attributes must not override protected system fields.

## 10. CRUD and Delete Governance

Every feature group must define:

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

Permanent delete requires:

```txt
sikesra_super_admin
sikesra.permanent_delete.execute
reason
confirmation
snapshot
audit
integrity check
```

Permanent delete must never delete EmDash core users.

## 11. Public Aggregate

Public aggregate must be public-safe.

Never expose publicly:

```txt
NIK/KIA
nomor_kk
phone/email
KTP address
domicile address
exact residential coordinates
health/disability details
welfare vulnerability notes
raw document metadata
internal storage details
restricted custom attributes
```

Small-cell suppression must be applied to vulnerable groups.

## 12. Update and Rebuild Safety

The plugin must remain safe across:

```txt
EmDash upstream update
dependency reinstall
workspace rebuild
local template rebuild
Cloudflare template rebuild
D1 migration rerun
template regeneration
```

Guardrail scripts planned by issues #136 and #137:

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

## 13. User Flow

### Operator Flow

1. install or enable the package through normal EmDash plugin configuration;
2. assign SIKESRA roles/scopes to EmDash users;
3. configure regions, data types, field standards, and custom attributes;
4. create registry records for the 8 SIKESRA modules;
5. upload or link supporting documents;
6. run staged imports where needed;
7. verify records by level and scope;
8. review duplicate candidates;
9. run reports and controlled exports;
10. review audit logs and public aggregate output.

### Reviewer Flow

1. inspect plugin boundaries and manifests;
2. confirm D1 table names use `sikesra_` prefix;
3. confirm no EmDash core modification is required;
4. confirm public routes expose only aggregate-safe data;
5. confirm trusted EmDash user identity integration;
6. confirm audit, masking, data preservation, and rebuild guardrails.

## 14. Testing Constraints

Tests must cover:

- plugin descriptor and identity;
- `sikesra_` prefix validation;
- route registration;
- admin page registration;
- RBAC and ABAC decision behavior;
- public aggregate safety;
- field standard validation;
- custom attribute validation;
- import staging;
- export policy;
- CRUD soft delete/restore/permanent delete denial;
- data preservation after rebuild where fixtures are available.

## 15. Acceptance Criteria

The plugin is production-ready only when:

- plugin identity is finalized;
- all canonical tables use `sikesra_` prefix;
- D1 migrations and repository layer exist;
- all 8 modules support create, list, detail, update, verification, and reporting;
- EmDash users can receive SIKESRA roles and scopes;
- public aggregate remains privacy-safe;
- import/export/document workflows are controlled and audited;
- custom attributes are supported safely;
- CRUD and permanent delete governance is implemented;
- data preservation and rebuild guardrails pass;
- no SIKESRA-specific EmDash core modification is required.

## 16. Out Of Scope

- replacing EmDash core auth;
- deleting EmDash users from the SIKESRA plugin;
- adding product-wide shared logic outside plugin boundaries;
- exposing detailed personal SIKESRA data publicly;
- storing secrets in tracked files;
- unreviewed AI-based enforcement or automation.
