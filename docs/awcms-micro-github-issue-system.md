# AWCMS-Micro GitHub Issue Execution System

This document defines the issue-management standard used in the AWCMS-Micro repository.

It is especially important for the SIKESRA plugin backlog, where many issues are intentionally split into small, ordered, atomic implementation steps.

## 1. Purpose

GitHub issues in this repository are not only reminders. They are the implementation contract used by maintainers, developers, and AI coding agents.

Issues must be:

- atomic enough to be executed safely;
- ordered when they depend on earlier architecture work;
- specific about files, expected behavior, acceptance criteria, and validation commands;
- explicit about EmDash compatibility and AWCMS-Micro boundaries;
- safe for junior developers or lower-cost AI agents to execute without guessing architecture.

## 2. Standard Issue Title Format

Use this pattern for sequenced AWCMS-Micro plugin work:

```txt
[PRODUCT][SEQ-XX][TYPE][PRIORITY] Title
```

Example:

```txt
[SIKESRA][SEQ-07A][P0] Add typed frontend-backend-D1 integration contract for SIKESRA admin workflows
```

Allowed segments:

```txt
PRODUCT  = SIKESRA, AWCMS, DOCS, SECURITY, CLOUDFLARE, etc.
SEQ      = SEQ-01, SEQ-01A, SEQ-07A, etc.
TYPE     = BUG, DOCS, SECURITY, UX, DB, API, TEST, optional when priority is enough
PRIORITY = P0, P1, P2, P3
```

## 3. Sequence Standard

`SEQ` defines execution order, not issue creation order.

Rules:

- lower sequence must be considered first;
- `SEQ-01A` means an urgent or parallel issue inserted after `SEQ-01` but before `SEQ-02`;
- `SEQ-07A` means an issue inserted after `SEQ-07` but before `SEQ-08`;
- do not renumber the entire backlog unless there is a strong reason;
- when inserting a new issue, use suffix letters to preserve existing links and history.

## 4. Priority Standard

Priority shows risk and timing:

| Priority | Meaning |
| --- | --- |
| P0 | Foundation, security, data safety, build-breaking bug, or required before most other work |
| P1 | Core feature or workflow required for product functionality |
| P2 | Important governance, reporting, advanced workflow, or hardening |
| P3 | Nice-to-have, cleanup, polish, documentation expansion, or later optimization |

Priority does not replace `SEQ`. A later `SEQ` P0 may still depend on earlier P1/P2 work if the sequence says so.

## 5. Required Issue Sections

Implementation issues should include:

```txt
Problem
Goal
Scope
Related Issues
Recommended Position In Execution Order
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
Acceptance Criteria
Validation Commands
```

## 6. Dependency Rule

Do not execute an issue that depends on unfinished foundation work unless the issue explicitly states it can run in parallel.

For the SIKESRA plugin, do not start later workflow implementation before the following foundations are ready:

```txt
plugin identity
admin route safety
UI/UX standard
sikesra_ naming rule
prefix validation
after-rebuild guardrails
data preservation guardrails
D1 migration framework
D1 repository layer
typed frontend-backend-D1 contract
core D1 tables
field standards
RBAC/ABAC model
audit/redaction model
```

## 7. Issue as Source of Truth

When an issue and old documentation disagree:

1. prefer the latest open issue when it is clearly newer and more specific;
2. update the relevant documentation in the same PR or a separate documentation PR;
3. leave a short note in the PR explaining which document was aligned;
4. do not silently implement a behavior that contradicts the current issue sequence.

## 8. Agent Execution Standard

Before executing an issue, an agent must:

1. read the issue body fully;
2. check related issues and sequence order;
3. inspect current repository files;
4. identify whether docs/scripts/tests must be updated;
5. implement the smallest safe change;
6. run or document required validation commands;
7. avoid touching EmDash core unless explicitly allowed;
8. update docs when behavior, issue order, or architecture changes.

## 9. SIKESRA Current Ordered Backlog

The current SIKESRA order is:

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

## 10. Label Guidance

Recommended labels when available:

```txt
sikesra
p0
p1
p2
bug
ux
database
d1
api
security
audit
rbac
abac
frontend
backend
docs
test
guardrail
```

Labels are helpful but not required for correctness. The issue title and body remain the source of truth.

## 11. Documentation Alignment Rule

When the SIKESRA issue order changes, update:

```txt
README.md
AGENTS.md
docs/README.md
docs/awcms-micro-github-issue-system.md
docs/awcms-micro-sikesra-plugin-governance.md
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/README.md
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/IMPLEMENTATION_GOVERNANCE.md
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/TECHNICAL_PRD.md
```

## 12. Final Rule

Issues are execution contracts. Keep them atomic, ordered, testable, sync-safe, and aligned with documentation.