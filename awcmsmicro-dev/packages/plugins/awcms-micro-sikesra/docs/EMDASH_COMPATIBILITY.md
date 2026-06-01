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
pnpm awcms:sikesra:check-d1-prefix
pnpm awcms:sikesra:check-data-boundary
pnpm awcms:sikesra:check-user-references
pnpm awcms:sikesra:check-file-links
pnpm awcms:sikesra:validate-data-after-rebuild
pnpm test
pnpm typecheck
pnpm build
```

## Rebuild Checklist

Every EmDash update or AWCMS-Micro rebuild must verify:

- plugin routes still register under `/_emdash/api/plugins/awcms-micro-sikesra`;
- admin pages still register under `/_emdash/admin/plugins/awcms-micro-sikesra`;
- D1 migrations remain forward-only, idempotent, and `sikesra_` prefixed;
- user assignments reference EmDash user IDs without mutating EmDash user tables;
- document metadata keeps `sikesra_supporting_documents` linked to `sikesra_file_objects`;
- public aggregate routes expose only public-safe aggregate data;
- local and Cloudflare templates typecheck and build.

## Production User Identity Rule

Development fixtures may use `X-Sikesra-User-*` headers for local route tests. Production runtime must not trust those client-provided headers; trusted EmDash session identity and SIKESRA RBAC/ABAC integration are required by the later user-assignment issue.

## Known Compatibility Risks

- EmDash plugin route registration API changes may require SIKESRA route smoke-test updates.
- EmDash admin page registration changes may require admin page smoke-test updates.
- Future D1 migrations must remain under the SIKESRA plugin boundary and use `sikesra_` table names.
- Cloudflare template validation must be repeated before declaring rebuild compatibility complete.
- Temporary plugin-storage compatibility collections remain until the D1 runtime-state migration issue is complete.
