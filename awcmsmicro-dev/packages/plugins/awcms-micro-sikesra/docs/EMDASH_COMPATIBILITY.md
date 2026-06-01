# SIKESRA EmDash Compatibility

This document tracks issue #136 compatibility guardrails for keeping the AWCMS-Micro SIKESRA plugin safe across EmDash update and rebuild workflows.

## Plugin Boundary Rule

SIKESRA canonical logic belongs inside:

```txt
awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/
awcmsmicro-dev/templates/awcms-micro-default/
awcmsmicro-dev/templates/awcms-micro-default-cloudflare/
awcmsmicro-dev/docs/awcms-micro/
awcmsmicro-dev/.awcms-changesets/
```

SIKESRA canonical logic must not be placed in upstream EmDash core/admin locations such as:

```txt
emdash-latest/packages/core/
emdash-latest/packages/admin/
awcmsmicro-dev/packages/core/
awcmsmicro-dev/packages/admin/
```

Persistent source-level downstream tweaks that are explicitly approved for AWCMS-Micro compatibility must be stored as narrow patch overlays in:

```txt
awcmsmicro-dev/.awcms-patches/
```

Issue #145 uses this exception to pass a trusted EmDash user snapshot from the authenticated private plugin API route into plugin route context. The overlay is not SIKESRA business logic; it is a compatibility bridge so SIKESRA RBAC/ABAC can use EmDash session identity without trusting client headers.

## Boundary Validation Command

Run from the SIKESRA plugin package:

```bash
pnpm awcms:sikesra:check-boundary
```

The command fails if SIKESRA references are found under upstream EmDash core/admin paths.

## D1 Migration Preservation Checklist

Every SIKESRA migration must remain under `awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/migrations/` and must follow these rules:

- create only `sikesra_` tables;
- create only `idx_sikesra_` indexes;
- create only `trg_sikesra_` triggers;
- use `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS` for local/dev/preview idempotency;
- avoid destructive SQL in historical migrations;
- add forward-only follow-up migrations for schema changes;
- keep `src/db/migrations.ts`, `src/db/schema.ts`, and runtime table catalogs aligned.

## Cloudflare Rebuild Checklist

When Cloudflare template behavior, bindings, storage, D1, public routes, or admin routes change, run:

```bash
pnpm --dir awcmsmicro-dev/templates/awcms-micro-default-cloudflare validate:cloudflare-env
pnpm --dir awcmsmicro-dev/templates/awcms-micro-default-cloudflare typecheck
pnpm --dir awcmsmicro-dev/templates/awcms-micro-default-cloudflare build
```

The rebuild must preserve the SIKESRA plugin registration, admin route, public route, D1 binding usage, R2/media binding usage, and sandbox runner support.

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

## Rollback Steps

If an EmDash sync or rebuild breaks SIKESRA compatibility:

- stop deployment before applying migrations or publishing the broken template;
- preserve current D1/R2 backups and run `pnpm awcms:sikesra:backup-inventory` where environment access is available;
- revert only the failing sync/rebuild changes, not historical SIKESRA data migrations;
- restore the last passing SIKESRA plugin/template artifact set;
- rerun `pnpm awcms:sikesra:validate-after-emdash-sync` and the relevant template build checks;
- document any required downstream workaround in `awcmsmicro-dev/docs/awcms-micro/divergence-log.md` before retrying the sync.

## Production User Identity Rule

Private SIKESRA plugin routes must read production identity from the trusted EmDash route context user derived from `locals.user`. Development fixtures may use `X-Sikesra-User-*` headers only when the runtime is not production, and those headers must never override a trusted route context user.

The #145 patch overlay must preserve this dispatch chain across rebuilds:

```txt
EmDash private plugin API route -> handlePluginApiRoute(..., user) -> PluginRouteRegistry.invoke({ user }) -> RouteContext.user -> SIKESRA RBAC/ABAC guard
```

## Known Compatibility Risks

- EmDash plugin route registration API changes may require SIKESRA route smoke-test updates.
- EmDash admin page registration changes may require admin page smoke-test updates.
- Future D1 migrations must remain under the SIKESRA plugin boundary and use `sikesra_` table names.
- Cloudflare template validation must be repeated before declaring rebuild compatibility complete.
- Temporary plugin-storage compatibility collections remain until the D1 runtime-state migration issue is complete.
