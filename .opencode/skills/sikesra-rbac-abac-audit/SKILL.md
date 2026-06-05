---
name: sikesra-rbac-abac-audit
description: SIKESRA RBAC, ABAC, privacy, masking, public aggregate, and audit controls. Use when implementing access rights, EmDash user assignments, permission checks, ABAC policies, sensitive field masking, public routes, audit logs, or redaction.
---

# SIKESRA RBAC, ABAC, Privacy, And Audit

Use this skill for SIKESRA access control, EmDash user references, RBAC/ABAC, data-class masking, public aggregate safety, audit redaction, and sensitive lifecycle decisions.

## Required Sources

Read these before changing access, privacy, or audit code:

1. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/TECHNICAL_PRD.md`.
2. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/IMPLEMENTATION_GOVERNANCE.md`.
3. `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/MERMAID_DIAGRAMS.md`.
4. `docs/security/access-control.md`.
5. `docs/security/audit-logging.md`.
6. `docs/security/privacy-baseline.md`.
7. `docs/security/indonesia-compliance.md`.
8. `.opencode/skills/backend-services/SKILL.md`.

## Identity Rule

- Use trusted EmDash request/session identity as the source of user identity.
- Reference EmDash user IDs from SIKESRA assignment tables.
- Do not create a duplicate SIKESRA user system.
- Do not mutate, reset, or delete EmDash core user records from the SIKESRA plugin.
- Preserve assignment history if an EmDash user becomes inactive or missing; mark/report the reference as inactive or orphaned.
- Production route handlers must prefer trusted route context user data exposed by private plugin route dispatch.
- Client-provided `X-Sikesra-User-*` headers must not be trusted in production and must not override trusted route context identity in development tests.

## RBAC And ABAC Decision Flow

Route enforcement must include:

```txt
trusted EmDash user identity
SIKESRA role assignment
SIKESRA permission
ABAC region scope
ABAC organization/module scope
```

Explicit deny overrides allow.

## Role Examples

Use canonical SIKESRA roles from governance docs, including:

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

Store role, permission, scope, and policy data in `sikesra_` tables.

## Privacy And Masking

Classify every field as one of:

```txt
non_personal
personal
sensitive_personal
restricted
```

Mask sensitive and restricted fields by default. Reveal controls require permission, ABAC scope, reason where required, and audit visibility.

KTP and domicile address fields are sensitive personal data and must not be exposed publicly.

## Public Aggregate Safety

Public routes may expose only approved aggregate counts or public-safe non-personal aggregate attributes.

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

Apply small-cell suppression for vulnerable categories.

## Audit And Redaction

- Audit sensitive decisions, mutating actions, reveal actions, restricted export, import promotion, duplicate decisions, verification transitions, and lifecycle governance.
- Public and ordinary admin DTOs must not expose raw audit metadata that contains sensitive payloads.
- Audit retention/purge must be a dedicated governed workflow; audit rows are not ordinary permanent-delete targets.
- Keep audit events in `sikesra_audit_events` or the canonical audit tables defined by the active issue.

## Validation

- `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:check-user-references`
- `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:check-data-boundary`
- `pnpm --filter @awcms-micro/plugin-sikesra test`
- `pnpm --filter @awcms-micro/plugin-sikesra typecheck`
- `pnpm --filter @awcms-micro/plugin-sikesra awcms:sikesra:validate-after-emdash-sync`
