# theming — tenant-selectable presentation (ADR-0029, Issue #269)

Official Optional Module (epic #261 Wave 2). Lets a tenant **select** a trusted
theme and **configure** it by DATA (design tokens, layout slots, media, section
order) — with **no uploaded code, no arbitrary templates, no raw CSS/HTML/JS**.

## The two things this module keeps strictly apart

| Trusted, build-time (code)                                                                                                                                                   | Tenant-authored (data)                                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A **theme** = a `ThemeDescriptor` composed by `theme-registry.ts` (base + a derived-repo seam, mirroring `application-registry.ts`). Reviewed source, bundled at build time. | A **`ThemeConfig`** = token overrides, slot selections, media ids, section order, nav placement. Stored in the DB (`awcms_micro_theming_config_versions` + `_tenant_state`, sql/085, RLS FORCE'd), schema-validated and bounded. |
| `PublicThemeLayout.astro` — the ONLY thing that renders.                                                                                                                     | —                                                                                                                                                                                                                                |

There is no database-stored executable template anywhere.

## Security spine — `domain/css-value-validation.ts`

Every design-token VALUE is validated by **REJECTION, never sanitization**:

- `assertSafeCssPrimitive` — charset-limited, length-bounded, control-char-free,
  and rejects `url(` / `expression` / `@import` / `javascript:` / `/*` / `;{}<>` /
  backslash / unbalanced parens. Rejecting (not stripping) sidesteps the
  `js/incomplete-multi-character-sanitization` class entirely.
- `validateColorValue` / `validateDimensionValue` / `validateNumberValue` — strict,
  linear (no-ReDoS) grammars.
- font families are chosen from a per-theme **allow-list**; the emitted CSS stack
  is descriptor-owned, so no font value is ever tenant-authored.
- `serializeThemeTokensCss` is safe by construction (re-validates every value) and
  emits a `:root { --awcms-theme-* }` block served as an **external same-origin
  stylesheet** (`/theming/tokens.css`) — so the app's `style-src 'self'` CSP is
  never weakened (no per-request inline `<style>`).

## Lifecycle — draft → validate → preview → publish → rollback/retire

- **draft** — one mutable working copy per tenant (`PUT /api/v1/theming/draft`).
- **validate** — read-only dry run (`POST /api/v1/theming/validate`), returns the
  token CSS that would be produced.
- **preview** — a short-lived, **non-indexable**, authorized session
  (`POST /api/v1/theming/preview` → `/theming/preview/{token}`): token stored as a
  hash, `X-Robots-Tag: noindex`, `private, no-store`, distinct URL namespace from
  the public stylesheet (cannot poison the public/CDN cache).
- **publish** — INSERT a new **immutable** version and make it the live look
  (`POST /api/v1/theming/publish`). Published versions can never be mutated (engine
  INSERT-only + the sql/085 `BEFORE UPDATE/DELETE` trigger).
- **rollback / retire** — move the active pointer only (`POST .../rollback`,
  `POST .../retire`); history stays intact.

All high-risk mutations require an `Idempotency-Key`, are ABAC-gated, and are
audited.

## Files

- `domain/` — `css-value-validation.ts` (spine), `theme-descriptor.ts` (contract +
  `assertValidThemeDescriptor` CSP/a11y gate), `theme-config.ts` (validate +
  serialize), `theme-lifecycle.ts`, `preview-token.ts`, `theme-permissions.ts`.
- `themes/default-theme.ts` — the base `aria` theme. `theme-registry.ts` +
  `application-theme-registry.ts` — the build-time composition seam.
- `application/` — `theme-config-directory.ts`, `theme-preview-directory.ts`,
  `theme-service.ts` (orchestration + injected audit), `theme-render-resolver.ts`,
  `theme-preview-render.ts`.
- composition roots in `src/lib/theming/` (`theme-media.ts`, `theme-public-css.ts`,
  `theme-preview.ts`) wire `media_library` + the public-tenant resolver.
- routes: `src/pages/api/v1/theming/*` (admin API), `src/pages/theming/tokens.css.ts`
  (public), `src/pages/theming/preview/[token].astro` + `preview-tokens/[token].css.ts`.
- `src/layouts/PublicThemeLayout.astro` — the trusted render layout.

## Derived-repo contribution

A derived repository contributes its OWN reviewed theme by replacing
`application-theme-registry.ts` — never editing the base default theme or the base
registry. See `tests/fixtures/derived-theme-example/` for a working illustration.

## Documented follow-ups (deferred, API-first)

- **Full admin UI screens** (rich token editor + responsive preview dashboard) —
  the API + a minimal preview surface ship here; the full screens are deferred
  (same posture as `seo_distribution`'s #266 config API). `navigation` is undeclared.
- **Domain events** (`awcms-micro.theming.version.published` / `.rolled-back` /
  `.retired`) — publish/rollback/retire are audited synchronous hooks today
  (same decision as `seo_distribution` #268); events land when a consumer needs them.
- **Public-route adoption** — the layout + token stylesheet are ready; wiring the
  home/`/news` public routes onto `PublicThemeLayout` is a follow-up (the #266
  precedent of not rewriting tested routes in one atomic PR). Rendering + a11y are
  proven end-to-end through the preview surface.
- Media asset rendering in preview shows the resolved logo; full favicon/OG wiring
  into public routes rides the public-route adoption follow-up.
