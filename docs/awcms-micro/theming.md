# Theming — author guide, token reference, runbook, CSP & a11y (ADR-0029)

Operator + theme-author reference for the `theming` module (Issue #269, epic
#261 Wave 2). See `docs/adr/0029-theming-module-admission.md` for the full
decision record and `src/modules/theming/README.md` for the code map.

## 1. Concepts

- **Theme** — reviewed, build-time source (`ThemeDescriptor`). NOT uploadable,
  NOT a DB row. Declares the bounded surface a tenant may configure.
- **Theme config (`ThemeConfig`)** — a tenant's DATA choices for a theme. The only
  tenant-authored input; carries no code/template/raw CSS.
- **Version** — a published config is an immutable, numbered version. A change is a
  new version; the active pointer selects which published version is live.

## 2. Theme-author guide (adding a theme)

A theme is a `ThemeDescriptor` (see `defineTheme` in
`src/modules/theming/domain/theme-descriptor.ts`). A theme MUST:

1. use a unique `themeKey` (`^[a-z][a-z0-9_]*$`) and a SemVer `version`;
2. declare its **tokens** (color / dimension / number / font_family), each with a
   default and — for dimension/number — bounds; font families are an allow-list of
   `{ key, label, stack }` (the tenant picks a key, the reviewed `stack` renders);
3. declare **slots** (header/footer/nav variants), **assetSlots** (logo/favicon/
   image), **contentSections** (orderable), and **navPlacements**;
4. declare **accessibility** (`minContrastRatio >= 4.5`, keyboard-navigable,
   responsive, landmarks) and **CSP** (`requiresInlineScript: false`,
   `requiresInlineStyle: false`, empty external sources) — `assertValidThemeDescriptor`
   REJECTS any theme that would weaken CSP or drop a11y.

Register a **base** theme in `src/modules/theming/theme-registry.ts`
(`BASE_THEME_DESCRIPTORS`). A **derived repository** registers its own theme by
replacing `src/modules/theming/application-theme-registry.ts` — it never edits the
base registry (see `tests/fixtures/derived-theme-example/`).

## 3. Token-schema reference (the `aria` default theme)

| Token                                                                                                                                 | Kind        | Bounds / allow-list                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `color_primary`, `color_on_primary`, `color_background`, `color_surface`, `color_text`, `color_muted`, `color_border`, `color_accent` | color       | hex, `rgb()/rgba()/hsl()/hsla()` (numeric only), or a named-color allow-list |
| `font_body`, `font_heading`                                                                                                           | font_family | one of `system` / `humanist` / `serif` / `mono`                              |
| `font_size_base`                                                                                                                      | dimension   | `rem`/`px`, 0.875–1.5                                                        |
| `radius_base`                                                                                                                         | dimension   | `rem`/`px`, 0–2                                                              |
| `space_unit`                                                                                                                          | dimension   | `rem`/`px`, 0.25–3                                                           |
| `container_max_width`                                                                                                                 | dimension   | `rem`/`px`, 20–120                                                           |
| `line_height_base`                                                                                                                    | number      | 1.2–2.2                                                                      |

Slots: `header` (minimal/centered/split), `footer` (simple/columns), `nav_style`
(inline/hamburger). Asset slots: `logo`, `favicon`, `hero_image` (media UUIDs).
Sections: `hero`, `featured`, `latest`, `about`, `cta`. Nav placements: `top`, `side`.

Design tokens are emitted as `--awcms-theme-<key>` custom properties on `:root`.

## 4. Admin API (`/api/v1/theming/*`)

| Method + path                   | Permission                | Idempotency | Notes                              |
| ------------------------------- | ------------------------- | ----------- | ---------------------------------- |
| `GET /api/v1/theming`           | `theming.config.read`     | —           | themes + state + draft + history   |
| `PUT /api/v1/theming/draft`     | `theming.config.update`   | required    | save/replace the draft (validated) |
| `POST /api/v1/theming/validate` | `theming.config.read`     | —           | dry-run; returns the token CSS     |
| `POST /api/v1/theming/preview`  | `theming.preview.create`  | —           | mint a preview session             |
| `POST /api/v1/theming/publish`  | `theming.version.publish` | required    | publish an immutable version       |
| `POST /api/v1/theming/rollback` | `theming.version.restore` | required    | body `{ versionId }`               |
| `POST /api/v1/theming/retire`   | `theming.version.archive` | required    | fall back to default               |

Public (Astro, not JSON, not OpenAPI): `GET /theming/tokens.css` (active tokens),
`GET /theming/preview/{token}` + `GET /theming/preview-tokens/{token}.css` (preview).

## 5. Runbook — publish / preview / rollback

- **Preview a draft**: save the draft (`PUT .../draft`), then `POST .../preview`.
  Open the returned `previewUrl` (works in any browser/device; expires, default 30m,
  cap 120m). It is `noindex` + `no-store` — never shared indefinitely, never indexed.
- **Publish**: `POST .../publish` promotes the current draft to a new immutable
  version and makes it live. Regenerate/serve `/theming/tokens.css` — its ETag is
  tenant + version-fingerprint, so caches revalidate automatically.
- **Roll back**: `POST .../rollback { versionId }` — get valid version ids from
  `GET /api/v1/theming` (`versions[]`). Only your own published versions are valid
  targets.
- **Retire**: `POST .../retire` clears the active pointer; the site falls back to
  the default theme. Published versions remain for later rollback.
- **Preview retention**: expired preview sessions are purged by the generic
  `data_lifecycle` engine (`bun run data-lifecycle:archive-purge`, cursor
  `expires_at`).

## 6. CSP notes

- Token values are served as an **external same-origin stylesheet**, allowed by the
  app's `style-src 'self'` (`astro.config.mjs`). A theme may NOT require inline
  style/script or external script/font sources — `assertValidThemeDescriptor`
  enforces this, so theming can never weaken the app CSP.
- The preview page renders through the Astro-hashed `PublicThemeLayout` structural
  style + the external preview token stylesheet — no inline value injection.

## 7. Accessibility checklist (asserted by the a11y E2E)

Contrast (default tokens meet WCAG AA), keyboard navigation + visible focus, a skip
link, landmarks (`banner`/`navigation`/`main`/`contentinfo`), a single `<h1>`,
`prefers-reduced-motion`, and a responsive layout. `tests/e2e/theming-preview.e2e.ts`
runs axe-core (WCAG 2.2 AA) against the rendered theme.

## 8. Threat model (summary — full table in ADR-0029)

CSS injection & unsafe URLs (reject-not-sanitize spine; media = ids, not URLs),
SSTI/arbitrary code (no DB templates; build-time layout only), CSP weakening
(descriptor gate + external stylesheet), preview leakage (hashed short-lived token,
noindex, no-store), cache poisoning / cross-tenant (host-first public key, distinct
preview namespace, RLS FORCE), mutable-published tampering (INSERT-only + DB
trigger), a11y regression (bounded tokens + declared semantics + axe).
