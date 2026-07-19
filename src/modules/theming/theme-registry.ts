/**
 * The reviewed, build-time THEME registry (Issue #269, ADR-0029 §3) — the
 * theme-descriptor analogue of `src/modules/index.ts` for module descriptors.
 *
 * `listThemeDescriptors()` returns the base themes (`BASE_THEME_DESCRIPTORS`,
 * reviewed in-repo code) MERGED with whatever a derived repository contributes
 * through the build-time seam `application-theme-registry.ts` (which ships
 * `undefined` in this base repo, so a default build returns exactly the base
 * themes). EVERY descriptor — base or derived — is validated by
 * `assertValidThemeDescriptor` at load time, so a malformed or CSP-weakening
 * theme fails the build/tests, never renders.
 *
 * This composition is 100% static/compile-time: no database, no upload, no
 * runtime discovery. A theme is trusted, reviewed source; only a tenant's DATA
 * configuration of a theme (`ThemeConfig`) lives in the database.
 */
import {
  assertValidThemeDescriptor,
  type ThemeDescriptor
} from "./domain/theme-descriptor";
import { applicationThemeRegistry } from "./application-theme-registry";
import { defaultTheme } from "./themes/default-theme";

/** One derived repository's contribution of reviewed themes to the composed registry. */
export type ApplicationThemeRegistry = {
  /** Stable, human-readable identifier for the contributing repository — diagnostics only, never persisted/authorized on. */
  id: string;
  themes: readonly ThemeDescriptor[];
};

/** The base themes this repository ships. Order is not significant. */
export const BASE_THEME_DESCRIPTORS: readonly ThemeDescriptor[] = [
  defaultTheme
];

/** The theme every tenant falls back to when none is selected. */
export const DEFAULT_THEME_KEY = defaultTheme.themeKey;

/**
 * Compose base + derived themes into the effective registry, validating each
 * descriptor and rejecting a `themeKey` collision (a derived theme may not
 * shadow a base theme — that would let a derived repo silently replace a
 * reviewed base theme). Pure over its `applicationRegistry` argument so tests
 * can pass a fixture registry without touching the base seam.
 */
export function composeThemeDescriptors(
  applicationRegistry: ApplicationThemeRegistry | undefined
): ThemeDescriptor[] {
  const composed: ThemeDescriptor[] = [];
  const seen = new Set<string>();

  const add = (descriptor: ThemeDescriptor): void => {
    assertValidThemeDescriptor(descriptor);
    if (seen.has(descriptor.themeKey)) {
      throw new Error(
        `Duplicate theme key "${descriptor.themeKey}" — a derived theme may not shadow a base/another theme (ADR-0029 §3).`
      );
    }
    seen.add(descriptor.themeKey);
    composed.push(descriptor);
  };

  for (const descriptor of BASE_THEME_DESCRIPTORS) add(descriptor);
  for (const descriptor of applicationRegistry?.themes ?? []) add(descriptor);
  return composed;
}

let cached: ThemeDescriptor[] | null = null;

/** The effective, validated theme registry (base + this repo's derived seam). Cached. */
export function listThemeDescriptors(): ThemeDescriptor[] {
  if (cached === null) {
    cached = composeThemeDescriptors(applicationThemeRegistry);
  }
  return cached;
}

/** Look up one theme by key (latest/only version in the registry), or `null`. */
export function getThemeDescriptor(themeKey: string): ThemeDescriptor | null {
  return listThemeDescriptors().find((t) => t.themeKey === themeKey) ?? null;
}
