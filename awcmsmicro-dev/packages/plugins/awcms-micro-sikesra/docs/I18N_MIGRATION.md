# SIKESRA I18N Migration

## Current PO-Backed Surface

SIKESRA now keeps its main plugin navigation labels in Lingui-compatible PO catalogs:

```txt
src/locales/en/messages.po
src/locales/id/messages.po
```

The runtime manifest uses `src/locales/messages.ts` as a temporary compiled PO adapter so existing EmDash plugin metadata and navigation behavior continue to work while the plugin moves toward generated catalog output during publish.

## Temporary Compatibility Adapter

`src/admin-copy.ts` remains a temporary compatibility adapter for the larger admin page copy set, including overview, registry, verification, document, report, audit, access, ABAC, and settings page copy.

Do not add new user-facing strings only to `admin-copy.ts` unless the string is part of an active migration. New strings should be represented in PO catalogs first, then exposed through a typed adapter or Lingui `t`/`Trans` usage.

## Next Migration Targets

Move these groups from `admin-copy.ts` into PO catalogs in follow-up slices:

- overview dashboard copy
- registry and wizard labels
- verification queue labels
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
