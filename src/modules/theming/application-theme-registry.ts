/**
 * Build-time extension point for a derived/downstream repository to contribute
 * its OWN reviewed themes (Issue #269, ADR-0029 §3) — the exact analogue of
 * `src/modules/application-registry.ts` (Issue #740) for module descriptors.
 *
 * A derived repository forks/vendors this base repository, then REPLACES the
 * export below with its own `ApplicationThemeRegistry`. This is the ONLY file a
 * derived repository needs to edit to contribute a reviewed theme to the final
 * composed theme registry — `src/modules/theming/theme-registry.ts` (the
 * reviewed base composition root) and `themes/default-theme.ts` stay completely
 * untouched, exactly the guardrail ADR-0013 §5/§9 and doc 21 §7 require ("derived
 * applications must not directly edit the base registry").
 *
 * Still 100% static, compile-time TypeScript, resolved and bundled at
 * `bun run build`/`typecheck` like every other import in this repo — NO runtime
 * discovery, file upload, package scanning, `eval`, or untrusted code loading
 * (ADR-0029 §3, the whole reason themes are code and not database rows).
 *
 * This base repository's own build ships `undefined` here, so
 * `listThemeDescriptors()` returns exactly the base themes. A real derived
 * repository would instead do something like:
 *
 * ```ts
 * import type { ApplicationThemeRegistry } from "./theme-registry";
 * import { auroraTheme } from "./themes/aurora/theme";
 *
 * export const applicationThemeRegistry: ApplicationThemeRegistry = {
 *   id: "awpos-storefront",
 *   themes: [auroraTheme]
 * };
 * ```
 *
 * See `tests/fixtures/derived-theme-example/` for a working, in-repo
 * illustration of exactly this shape (used only by tests — never wired in here,
 * since this file must stay `undefined` for the base repository's own shipped
 * behavior to remain unchanged).
 */
import type { ApplicationThemeRegistry } from "./theme-registry";

export const applicationThemeRegistry: ApplicationThemeRegistry | undefined =
  undefined;
