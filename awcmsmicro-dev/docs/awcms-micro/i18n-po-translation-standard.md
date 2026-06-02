# AWCMS-Micro PO Translation Standard

## Purpose

AWCMS-Micro plugins and templates must use Lingui-compatible gettext PO catalogs for user-facing translation work.

This keeps downstream plugin and template i18n aligned with upstream EmDash admin translation practice while preserving the rule that AWCMS-Micro must not modify EmDash core for project-specific behavior.

## Upstream References

Follow the current EmDash translation guidance in:

```txt
emdash-latest/docs/src/content/docs/contributing/translating.mdx
```

Also follow the direction from EmDash discussion `emdash-cms/emdash#1168`, especially the maintainer guidance that plugin translations should use `.po` files, likely compiled during publish, rather than inline manifest translation objects.

## Required Catalog Structure

Plugin catalogs live inside the plugin package:

```txt
awcmsmicro-dev/packages/plugins/<plugin-id>/src/locales/
  en/messages.po
  id/messages.po
```

Template catalogs live inside the template package:

```txt
awcmsmicro-dev/templates/<template-id>/src/locales/
  en/messages.po
  id/messages.po
```

English (`en`) is the source locale. Indonesian (`id`) is required for active AWCMS-Micro plugins and templates.

If upstream EmDash later provides an official plugin or template i18n API, AWCMS-Micro catalogs should be connected through an adapter instead of becoming a permanent fork-level translation system.

## Governance Surfaces

This standard must be referenced by the root and project-level guidance that agents and maintainers use before changing plugin or template copy:

- root `README.md` and `AGENTS.md`
- root docs that describe implementation boundaries, repository structure, synchronization, and operator workflow
- `awcmsmicro-dev/AGENTS.md`
- each active plugin or template README when that package owns user-facing strings
- project governance or PRD docs when translation behavior is part of acceptance criteria

When a plugin or template adds user-facing strings, update the matching PO catalogs in the same atomic change unless the issue explicitly scopes that work to a follow-up migration slice.

## PO File Rules

Each PO entry uses English source text as `msgid` and the locale translation as `msgstr`.

```po
#: src/admin.tsx:42
msgid "Save settings"
msgstr "Simpan pengaturan"
```

Translate only `msgstr` values.

Do not translate:

- `msgid` values, because they are lookup keys
- source-reference comments beginning with `#:`
- interpolation placeholders such as `{error}`, `{email}`, `{count}`, or `{label}`
- XML-style tags such as `<0>` and `</0>`

Placeholders and tags must remain exactly the same in the translation, including spelling, braces, angle brackets, and nesting.

Example:

```po
msgid "Authentication error: {error}"
msgstr "Kesalahan autentikasi: {error}"

msgid "Open <0>documentation</0>"
msgstr "Buka <0>dokumentasi</0>"
```

## Plugin Guidance

Plugin admin UI, sidebar labels, route labels, dashboard widgets, settings pages, toast messages, dialog labels, validation messages, and accessibility text must have a PO-backed translation path.

Native React admin UI should prefer Lingui `t` and `Trans` usage where the plugin build can support extraction and compilation.

Sandboxed plugin routes or non-React runtime surfaces may use a small adapter that reads compiled PO catalog output. Temporary compatibility adapters are acceptable during migration, but new user-facing strings should not be added only to inline objects such as manifest `i18n.messages` or code-level copy maps.

Manifest labels may keep English fallback labels for EmDash compatibility, but the PO catalog must be the authoritative translation source for active locales.

## Template Guidance

Template UI strings in Astro pages, layouts, components, and public navigation helpers must follow the same PO catalog standard when they are AWCMS-Micro-owned strings.

Template i18n must stay inside the template boundary. Do not modify EmDash core to translate template strings.

Templates may use Astro-compatible i18n helpers or a template-local adapter, provided the source strings remain represented in PO catalogs and can migrate to an official EmDash or Astro template i18n path later.

Public template strings differ from plugin admin strings because they render on the public site instead of inside the EmDash admin shell. They still need `en` source entries and reviewed `id` translations, but they should not depend on EmDash admin locale compilation unless the template explicitly opts into that pipeline.

For AWCMS-Micro templates that currently use a local copy helper such as `src/utils/public-copy.ts`, the PO catalogs are the authoritative translation inventory. Keep the helper synchronized with the catalog until a template-local adapter or official EmDash template i18n API can compile PO catalogs directly.

## Pseudo-Locale QA

Use EmDash pseudo locale behavior to detect unwrapped admin strings where available:

```ini
EMDASH_PSEUDO_LOCALE=1
```

Run the relevant plugin or template in development, switch to the pseudo locale, and look for normal English strings that should have been wrapped or catalog-backed.

Pseudo locale is a QA signal, not a translation. Do not ship pseudo-locale output as a real locale.

## AI-Assisted Translation Review

AI-assisted translation is allowed only with human review.

Required review rules:

- a fluent or native speaker must review every translated string
- a fluent or native speaker must preview the translations in the running UI
- placeholders and XML-style tags must be checked mechanically and visually
- AI usage must be disclosed in review notes or the pull request description
- unsupervised machine translations are not acceptable

Leaving a string untranslated is safer than shipping a wrong translation. Empty `msgstr` values may fall back to English until a reviewed translation is ready.

## Validation Guidance

For documentation-only changes, run:

```bash
bash scripts/validate-awcmsmicro-boundaries.sh
```

For SIKESRA plugin catalog migration work, run:

```bash
cd awcmsmicro-dev/packages/plugins/awcms-micro-sikesra
pnpm typecheck
pnpm test
pnpm build
```

For template catalog migration work, run the nearest template validation from `awcmsmicro-dev/`, such as:

```bash
pnpm typecheck
pnpm test
pnpm build
```

For the checked-in local and Cloudflare templates, run the template scripts directly when their catalogs or public string helpers change:

```bash
pnpm --dir awcmsmicro-dev/templates/awcms-micro-default typecheck
pnpm --dir awcmsmicro-dev/templates/awcms-micro-default build
pnpm --dir awcmsmicro-dev/templates/awcms-micro-default-cloudflare typecheck
pnpm --dir awcmsmicro-dev/templates/awcms-micro-default-cloudflare test
pnpm --dir awcmsmicro-dev/templates/awcms-micro-default-cloudflare build
```

When locale extraction or compilation scripts are added for a plugin or template, document and run those scripts in the same change.
