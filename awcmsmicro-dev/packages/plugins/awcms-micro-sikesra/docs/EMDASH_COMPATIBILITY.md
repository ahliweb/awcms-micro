# SIKESRA EmDash Compatibility

This document tracks issue #136 compatibility guardrails for keeping the AWCMS-Micro SIKESRA plugin safe across EmDash update and rebuild workflows.

## Plugin Boundary Rule

SIKESRA canonical logic belongs inside:

```txt
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/
```

SIKESRA canonical logic must not be placed in upstream EmDash core/admin locations such as:

```txt
emdash-latest/packages/core/
emdash-latest/packages/admin/
```

## Boundary Validation Command

Run from the SIKESRA plugin package:

```bash
pnpm awcms:sikesra:check-boundary
```

The command fails if SIKESRA references are found under upstream EmDash core/admin paths.

## Current Validation Baseline

```bash
pnpm awcms:sikesra:check-boundary
pnpm test
pnpm typecheck
pnpm build
```

## Known Compatibility Risks

- EmDash plugin route registration API changes may require SIKESRA route smoke-test updates.
- EmDash admin page registration changes may require admin page smoke-test updates.
- Future D1 migrations must remain under the SIKESRA plugin boundary and use `sikesra_` table names.
- Cloudflare template validation must be repeated before declaring rebuild compatibility complete.
