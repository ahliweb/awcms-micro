# AWCMS-Micro GitHub Issue Execution System

This document defines the issue-management standard used in the AWCMS-Micro repository.

It applies to all AWCMS-Micro work, including:

- plugins;
- templates;
- database and D1 work;
- UI/UX;
- frontend;
- backend;
- API and typed integration;
- security and compliance;
- Cloudflare deployment;
- testing and QA;
- documentation;
- upstream sync and rebuild safety;
- product roadmap and governance.

SIKESRA is currently the most detailed example of this system, but the same standard must be used for every AWCMS-Micro project.

For diagram requirements, also read:

```txt
docs/awcms-micro-mermaid-diagram-standard.md
```

## 1. Purpose

GitHub issues in this repository are not only reminders. They are implementation contracts used by maintainers, developers, and AI coding agents.

Issues must be:

- atomic enough to be executed safely;
- ordered when they depend on earlier architecture work;
- specific about files, expected behavior, acceptance criteria, and validation commands;
- explicit about EmDash compatibility and AWCMS-Micro boundaries;
- safe for junior developers or lower-cost AI agents to execute without guessing architecture;
- clear enough to connect product, UI/UX, frontend, backend, database, security, tests, and documentation work;
- diagram-backed when the issue changes architecture, data model, UI/UX flow, integration, security, deployment, migration, or data preservation behavior.

## 2. Standard Issue Title Format

Use this pattern for sequenced AWCMS-Micro work:

```txt
[PROJECT][SEQ-XX][TYPE][PRIORITY] Title
```

Examples:

```txt
[SIKESRA][SEQ-07A][P0] Add typed frontend-backend-D1 integration contract for SIKESRA admin workflows
[TEMPLATE-DEFAULT][SEQ-03][UX][P1] Standardize public homepage section layout
[CLOUDFLARE][SEQ-02][P0] Validate D1 and R2 bindings for production deployment
[SECURITY][SEQ-01][P0] Add upload validation baseline for all media-enabled plugins
[DOCS][SEQ-01][DOCS][P1] Add Mermaid diagram standards for PRD, database, UI/UX, integration, and deployment issues
```

Allowed segments:

```txt
PROJECT  = SIKESRA, TEMPLATE-DEFAULT, TEMPLATE-CLOUDFLARE, PLUGIN-GALLERY, DB, SECURITY, CLOUDFLARE, DOCS, TEST, etc.
SEQ      = SEQ-01, SEQ-01A, SEQ-07A, etc.
TYPE     = BUG, DOCS, SECURITY, UX, UI, DB, API, TEST, INTEGRATION, DEPLOYMENT, optional when priority is enough
PRIORITY = P0, P1, P2, P3
```

## 3. Sequence Standard

`SEQ` defines execution order, not issue creation order.

Rules:

- lower sequence must be considered first;
- `SEQ-01A` means an urgent or parallel issue inserted after `SEQ-01` but before `SEQ-02`;
- `SEQ-07A` means an issue inserted after `SEQ-07` but before `SEQ-08`;
- do not renumber the entire backlog unless there is a strong reason;
- when inserting a new issue, use suffix letters to preserve existing links and history;
- every project may have its own sequence, but cross-project dependency must be stated in the issue body.

## 4. Priority Standard

Priority shows risk and timing:

| Priority | Meaning |
| --- | --- |
| P0 | Foundation, security, data safety, compatibility, build-breaking bug, or required before most other work |
| P1 | Core feature or workflow required for product functionality |
| P2 | Important governance, reporting, hardening, optimization, or advanced workflow |
| P3 | Nice-to-have, cleanup, polish, documentation expansion, or later optimization |

Priority does not replace `SEQ`. A later `SEQ` P0 may still depend on earlier P1/P2 work if the sequence says so.

## 5. Type Standard

Use issue type markers when they improve clarity:

| Type | Use For |
| --- | --- |
| BUG | Incorrect behavior, broken navigation, broken build, regression |
| UX | User flow, interaction model, information architecture |
| UI | Visual component, layout, theme, responsive behavior |
| DB | D1 schema, migrations, repositories, data model |
| API | Route contracts, request/response shape, API behavior |
| INTEGRATION | Frontend-backend-database integration, external service integration |
| SECURITY | Access control, privacy, secrets, secure upload, compliance |
| TEST | Unit, integration, Playwright, smoke, guardrail tests |
| DOCS | README, AGENTS, architecture docs, runbooks |
| DEPLOYMENT | Cloudflare, worker, Pages, D1/R2 bindings, environment validation |
| GOVERNANCE | RBAC/ABAC, audit, lifecycle, approval, policy workflow |

## 6. Required Issue Sections

Implementation issues should include:

```txt
Problem
Goal
Scope
Related Issues
Recommended Position In Execution Order
Mermaid Diagrams
Tasks
Acceptance Criteria
Required Tests
Validation Commands
Architectural Rule
```

Bug issues should include:

```txt
Problem
Evidence
Expected Behavior
Current Behavior
Related Files
Recommended Fix
Mermaid Diagrams
Acceptance Criteria
Required Tests
Validation Commands
Architectural Rule
```

Documentation issues should include:

```txt
Problem
Goal
Files To Update
Documentation Requirements
Mermaid Diagrams
Acceptance Criteria
Validation Commands
```

UI/UX issues should include:

```txt
Problem
Goal
Affected Pages
User Flows
Component Requirements
Accessibility Requirements
Responsive Behavior
Mermaid Diagrams
Acceptance Criteria
Required Tests
Validation Commands
```

Database issues should include:

```txt
Problem
Goal
Affected Tables
Migration Plan
Repository/API Impact
Data Preservation Rules
Mermaid Diagrams
Acceptance Criteria
Required Tests
Validation Commands
```

Integration issues should include:

```txt
Problem
Goal
Frontend Contract
Backend Contract
Database Contract
Error Handling
Security/RBAC/ABAC Requirements
Mermaid Diagrams
Acceptance Criteria
Required Tests
Validation Commands
```

## 7. Mermaid Diagram Rule

Mermaid diagrams are required when an issue or document changes or defines:

```txt
product architecture
module boundaries
database schema or D1 tables
migration or data preservation flow
UI/UX journey or page flow
form wizard flow
frontend-backend-database integration
RBAC/ABAC decision flow
audit, masking, import, or export flow
Cloudflare deployment topology
rebuild or recovery path
```

For major issues, add:

```md
## Mermaid Diagrams

Add or update diagrams for architecture, database, UI/UX, integration, security, deployment, or data flow where relevant.
```

For small isolated issues, add:

```md
## Mermaid Diagrams

Not required because this issue changes only a small isolated behavior.
```

Use `docs/awcms-micro-mermaid-diagram-standard.md` for diagram type recommendations and examples.

## 8. Dependency Rule

Do not execute an issue that depends on unfinished foundation work unless the issue explicitly states it can run in parallel.

For all AWCMS-Micro projects, check these foundations before starting workflow implementation:

```txt
project identity and naming
routing and navigation safety
UI/UX standard
storage/database naming boundary
validation or guardrail tests
update/rebuild compatibility
production data preservation
migration framework when database work is involved
repository or data-access layer when database work is involved
typed frontend-backend integration contract when UI and API work are involved
field or schema standards
RBAC/ABAC and permission model when protected data is involved
audit/redaction model when sensitive data or mutation is involved
Mermaid diagrams when architecture/database/UI/integration/security/deployment behavior is involved
```

## 9. Issue as Source of Truth

When an issue and old documentation disagree:

1. prefer the latest open issue when it is clearly newer and more specific;
2. update the relevant documentation in the same PR or a separate documentation PR;
3. leave a short note in the PR explaining which document was aligned;
4. do not silently implement a behavior that contradicts the current issue sequence.

## 10. Agent Execution Standard

Before executing an issue, an agent must:

1. read the issue body fully;
2. check related issues and sequence order;
3. inspect current repository files;
4. identify whether docs/scripts/tests must be updated;
5. check whether Mermaid diagrams are required;
6. implement the smallest safe change;
7. run or document required validation commands;
8. avoid touching EmDash core unless explicitly allowed;
9. update docs when behavior, issue order, diagrams, or architecture changes.

## 11. Project Backlog Registers

Each major AWCMS-Micro project should maintain an ordered backlog section in its governance documentation.

Required for:

```txt
plugins
templates
database/D1 initiatives
UI/UX initiatives
integration/API initiatives
security/compliance initiatives
Cloudflare deployment initiatives
```

For SIKESRA, the current ordered backlog is documented in:

```txt
docs/awcms-micro-sikesra-plugin-governance.md
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/IMPLEMENTATION_GOVERNANCE.md
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/TECHNICAL_PRD.md
```

## 12. Current SIKESRA Example Backlog

The current SIKESRA order is the active example of this issue system:

| Order | Issue | Focus |
| ---: | ---: | --- |
| 1 | #140 | Plugin identity |
| 2 | #141 | Admin dashboard route bug fix |
| 3 | #142 | Admin UI/UX design system |
| 4 | #119 | `sikesra_` naming policy |
| 5 | #121 | Prefix validation test |
| 6 | #136 | EmDash update/rebuild compatibility |
| 7 | #137 | Data preservation guardrails |
| 8 | #120 | D1 migration framework |
| 9 | #122 | D1 repository layer |
| 10 | #143 | Typed frontend-backend-D1 integration contract |
| 11 | #123 | Core D1 tables |
| 12 | #135 | Field standards |
| 13 | #124 | Migrate runtime state to D1 |
| 14 | #125 | Registry D1 tables |
| 15 | #132 | RBAC/ABAC with EmDash users |
| 16 | #133 | Audit and redaction |
| 17 | #126 | Registry routes to D1 |
| 18 | #127 | 20-digit SIKESRA ID service |
| 19 | #128 | Verification workflow |
| 20 | #129 | Document metadata workflow |
| 21 | #130 | Staged import workflow |
| 22 | #131 | Duplicate review workflow |
| 23 | #134 | Export/report workflow |
| 24 | #138 | Dynamic custom attributes |
| 25 | #139 | Full CRUD governance |

## 13. Label Guidance

Recommended labels when available:

```txt
p0
p1
p2
p3
bug
ux
ui
database
d1
api
integration
security
audit
rbac
abac
frontend
backend
docs
diagram
mermaid
test
guardrail
deployment
cloudflare
template
plugin
```

Project-specific labels may also be used, for example:

```txt
sikesra
plugin-gallery
template-default
template-cloudflare
```

Labels are helpful but not required for correctness. The issue title and body remain the source of truth.

## 14. Documentation Alignment Rule

When an issue system rule, issue order, diagram requirement, or project backlog changes, update the relevant docs.

For repository-wide issue rules, update:

```txt
README.md
AGENTS.md
docs/README.md
docs/awcms-micro-github-issue-system.md
docs/awcms-micro-mermaid-diagram-standard.md
```

For project-specific issue order, update the matching project docs. Examples:

```txt
docs/awcms-micro-sikesra-plugin-governance.md
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/README.md
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/IMPLEMENTATION_GOVERNANCE.md
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/TECHNICAL_PRD.md
```

Future plugins/templates should add their own governance docs or README sections when their backlog becomes large enough.

## 15. Final Rule

Issues are execution contracts. Keep them atomic, ordered, diagram-backed when needed, testable, sync-safe, and aligned with documentation across all AWCMS-Micro projects.