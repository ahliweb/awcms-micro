# SIKESRA I18N Migration

## Current PO-Backed Surface

SIKESRA now keeps its main plugin navigation labels in Lingui-compatible PO catalogs:

```txt
src/locales/en/messages.po
src/locales/id/messages.po
```

The runtime manifest uses `src/locales/messages.ts` as a temporary compiled PO adapter so existing EmDash plugin metadata and navigation behavior continue to work while the plugin moves toward generated catalog output during publish.

Reviewed `admin-copy.ts` migration slices are also represented in the PO catalogs under `awcms.adminCopy.*` contexts and compiled through `src/locales/messages.ts`. Migrated slices currently cover the plugin operation center, status/loading states, overview dashboard summary, settings panel copy, registry/wizard scalar labels, and verification queue scalar labels.

## Temporary Compatibility Adapter

`src/admin-copy.ts` remains a temporary compatibility adapter for the larger admin page copy set, including overview, registry, verification, document, report, audit, access, ABAC, and settings page copy.

Do not add new user-facing strings only to `admin-copy.ts` unless the string is part of an active migration. New strings should be represented in PO catalogs first, then exposed through a typed adapter or Lingui `t`/`Trans` usage.

`tests/locales.test.ts` keeps a temporary shape-parity guardrail for `admin-copy.ts` so English and Indonesian adapter keys, nested arrays, objects, and function arity cannot drift while the larger PO migration waits for fluent Indonesian review and UI preview.

## Next Migration Targets

Move these groups from `admin-copy.ts` into PO catalogs in follow-up slices:

- registry step arrays and nested dashboard card copy
- documents and reports labels
- audit and settings labels
- access-rights and ABAC labels
- validation, toast, empty-state, and error messages

## Validation

After changing SIKESRA i18n, run:

```bash
cd awcmsmicro-dev/packages/plugins/awcms-micro-sikesra
pnpm typecheck
pnpm test
pnpm build
```
