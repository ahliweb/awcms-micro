# SIKESRA Mermaid Diagram Recommendations

This document defines the recommended Mermaid diagrams for implementing the AWCMS-Micro SIKESRA plugin.

It follows the repository-wide standard in:

```txt
docs/awcms-micro-mermaid-diagram-standard.md
```

## 1. Plugin Boundary and EmDash Compatibility

```mermaid
flowchart LR
  EmDash[EmDash Upstream] --> AWCMS[AWCMS-Micro Workspace]
  AWCMS --> Plugin[SIKESRA Plugin]
  AWCMS --> Template[AWCMS-Micro Templates]
  Plugin --> Admin[Plugin Admin UI]
  Plugin --> Routes[Plugin API Routes]
  Plugin --> D1[(sikesra_ D1 Tables)]
  Plugin --> R2[(R2-compatible Storage)]
```

Purpose:

- show that SIKESRA remains downstream;
- show that custom logic belongs in plugin/template boundaries;
- prevent EmDash core modification for SIKESRA-specific behavior.

## 2. Admin UI to Backend to D1 Flow

```mermaid
sequenceDiagram
  participant UI as Admin UI
  participant Client as Typed API Client
  participant Route as Plugin Route
  participant Guard as RBAC/ABAC Guard
  participant Service as Service Layer
  participant Repo as Repository Layer
  participant D1 as sikesra_ D1 Tables
  participant Audit as Audit Table

  UI->>Client: submit typed request
  Client->>Route: call plugin API
  Route->>Guard: check identity and access
  Guard->>Service: allowed request
  Service->>Repo: read or write data
  Repo->>D1: query tables
  D1-->>Repo: rows
  Repo-->>Service: internal model
  Service->>Audit: write audit if required
  Service-->>Route: safe DTO
  Route-->>Client: response envelope
  Client-->>UI: update UI state
```

Purpose:

- support issue #143;
- prevent raw D1 rows from being returned directly to UI;
- keep authorization and serialization clear.

## 3. Logical SIKESRA D1 ERD

```mermaid
erDiagram
  sikesra_registry_entities ||--o{ sikesra_person_profiles : links
  sikesra_registry_entities ||--o{ sikesra_supporting_documents : has
  sikesra_registry_entities ||--o{ sikesra_verification_events : verifies
  sikesra_registry_entities ||--o{ sikesra_custom_attribute_values : extends
  sikesra_registry_entities ||--o{ sikesra_audit_events : audits

  sikesra_permission_catalog ||--o{ sikesra_role_permission_assignments : grants
  sikesra_role_catalog ||--o{ sikesra_role_permission_assignments : has
  sikesra_role_catalog ||--o{ sikesra_user_role_assignments : assigned
  sikesra_user_role_assignments }o--|| emdash_users : references
  sikesra_abac_policy_rules ||--o{ sikesra_audit_events : evaluated
```

Purpose:

- guide issues #120, #122, #123, #125, #132, #133, and #138;
- show SIKESRA-owned tables versus EmDash user references.

## 4. Registry Create/Edit Wizard Flow

```mermaid
flowchart TD
  Start[Start create or edit] --> Module[Select module and subtype]
  Module --> Region[Select official or custom region]
  Region --> Identity[Fill core identity]
  Identity --> Details[Fill module details]
  Details --> Address{Personal module?}
  Address -->|Yes| Personal[Fill KTP and domicile address]
  Address -->|No| Custom[Fill custom attributes]
  Personal --> Custom
  Custom --> Documents[Attach document metadata]
  Documents --> Review[Review validation and privacy]
  Review --> Save[Save draft or submit]
```

Purpose:

- guide UI/UX issue #142;
- ensure field standard #135 is visible in the form flow.

## 5. Verification State Flow

```mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> Submitted
  Submitted --> VillageReview
  VillageReview --> DistrictReview
  DistrictReview --> SopdReview
  SopdReview --> RegencyReview
  RegencyReview --> Verified
  VillageReview --> NeedsRevision
  DistrictReview --> NeedsRevision
  SopdReview --> NeedsRevision
  RegencyReview --> NeedsRevision
  NeedsRevision --> Submitted
  Submitted --> Rejected
```

Purpose:

- guide issue #128;
- show how verification stages should be represented in UI and D1.

## 6. RBAC and ABAC Decision Flow

```mermaid
flowchart TD
  Request[Request] --> Identity[Trusted EmDash identity]
  Identity --> Role[SIKESRA role assignment]
  Role --> Permission[Permission check]
  Permission --> Scope[Region and organization scope]
  Scope --> Sensitivity[Data sensitivity rule]
  Sensitivity --> Decision{Allowed?}
  Decision -->|Yes| Allow[Return allowed response]
  Decision -->|No| Deny[Return safe denial]
  Allow --> Audit[Audit if required]
  Deny --> Audit
```

Purpose:

- guide issue #132;
- keep user assignment tied to EmDash identity;
- support audit/redaction issue #133.

## 7. Import Staging Workflow

```mermaid
flowchart TD
  Upload[Upload CSV or XLSX] --> Preview[Preview rows]
  Preview --> Mapping[Map columns]
  Mapping --> Validate[Validate rows]
  Validate --> Duplicates{Duplicate candidates?}
  Duplicates -->|Yes| Review[Review duplicates]
  Duplicates -->|No| Promote[Promote valid rows]
  Review --> Promote
  Promote --> Summary[Import summary]
```

Purpose:

- guide issue #130;
- prevent direct import into registry without staging.

## 8. Export and Report Safety Workflow

```mermaid
flowchart TD
  Request[Export request] --> Permission[Check export permission]
  Permission --> Sensitivity[Check field sensitivity]
  Sensitivity --> Reason{Restricted fields?}
  Reason -->|Yes| RequireReason[Require reason]
  Reason -->|No| Build[Build safe export]
  RequireReason --> Build
  Build --> Audit[Write export audit]
  Audit --> Result[Return export job result]
```

Purpose:

- guide issue #134;
- ensure sensitive field handling is explicit.

## 9. Data Preservation After Rebuild

```mermaid
flowchart TD
  Before[Before rebuild] --> Snapshot[Create data inventory]
  Snapshot --> Rebuild[Run update or rebuild]
  Rebuild --> Validate[Validate sikesra_ tables]
  Validate --> Links[Check user and file references]
  Links --> Compare[Compare key counts]
  Compare --> Report[Report safe or needs review]
```

Purpose:

- guide issue #137;
- keep data safety visible during EmDash update and rebuild.

## 10. Cloudflare D1/R2 Topology

```mermaid
flowchart LR
  Repo[GitHub Repository] --> Build[Cloudflare Build]
  Build --> App[Cloudflare Pages or Worker]
  App --> Admin[EmDash Admin]
  App --> Public[Public SIKESRA Page]
  App --> D1[(Cloudflare D1)]
  App --> R2[(Cloudflare R2)]
```

Purpose:

- guide Cloudflare template validation;
- show how admin, public, D1, and R2 connect.

## 11. Maintenance Rule

When a SIKESRA issue changes architecture, database, UI/UX, integration, security, deployment, migration, or data preservation behavior, update the relevant diagram in this document or explain why no diagram update is required.
