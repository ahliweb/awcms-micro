/**
 * Theme descriptor contract (Issue #269, ADR-0029 §3). A `ThemeDescriptor` is
 * TRUSTED, REVIEWED, BUILD-TIME source code — a static TypeScript value bundled
 * at `bun run build`/`typecheck` like any other import, NEVER a database row and
 * NEVER an uploaded/runtime-discovered artifact. It declares the bounded surface
 * a tenant may configure by DATA (`ThemeConfig`, `theme-config.ts`): the design
 * tokens, layout/component slots, media asset slots, orderable content sections,
 * the typography allow-list, plus the theme's accessibility and CSP declarations.
 *
 * Pure types + pure validation here (no I/O). The build-time registry that
 * composes base + derived themes lives in `../theme-registry.ts`; the seam a
 * derived repository fills is `../application-theme-registry.ts` (mirrors
 * `src/modules/application-registry.ts`).
 */
import type {
  DimensionConstraint,
  NumberConstraint
} from "./css-value-validation";

export type ThemeOrigin = "base" | "derived";

export type ThemeTokenKind = "color" | "dimension" | "number" | "font_family";

type ThemeTokenBase = {
  /** `snake_or_kebab` style key; becomes `--awcms-theme-<key>` in the emitted CSS. */
  key: string;
  label: string;
  description: string;
};

export type ThemeColorTokenSpec = ThemeTokenBase & {
  kind: "color";
  /** Default value — itself validated by the registry at load time. */
  default: string;
};

export type ThemeDimensionTokenSpec = ThemeTokenBase & {
  kind: "dimension";
  constraint: DimensionConstraint;
  default: string;
};

export type ThemeNumberTokenSpec = ThemeTokenBase & {
  kind: "number";
  constraint: NumberConstraint;
  default: string;
};

export type ThemeFontFamilyTokenSpec = ThemeTokenBase & {
  kind: "font_family";
  /**
   * Default value = a `key` from the descriptor's `fontFamilies` allow-list
   * (NOT a raw font stack). The tenant likewise selects a `fontFamilies` key;
   * the serializer emits the descriptor-owned CSS stack, so no font value is
   * ever tenant-authored.
   */
  default: string;
};

export type ThemeTokenSpec =
  | ThemeColorTokenSpec
  | ThemeDimensionTokenSpec
  | ThemeNumberTokenSpec
  | ThemeFontFamilyTokenSpec;

/** One selectable typography family — the tenant picks `key`, the reviewed `stack` is what renders. */
export type ThemeFontFamilyOption = {
  key: string;
  label: string;
  /** A reviewed, safe CSS font-family stack, e.g. `"Inter", system-ui, sans-serif`. */
  stack: string;
};

export type ThemeSlotVariant = { key: string; label: string };

/** One layout/component slot the tenant may pick a bounded variant for (header/footer/nav style). */
export type ThemeSlotSpec = {
  key: string;
  label: string;
  variants: readonly ThemeSlotVariant[];
  default: string;
};

export type ThemeAssetSlotKind = "logo" | "favicon" | "image";

/** One media asset slot — the tenant supplies a `media_library` id (never a URL). */
export type ThemeAssetSlotSpec = {
  key: string;
  label: string;
  kind: ThemeAssetSlotKind;
  required?: boolean;
};

/** One orderable content section (the tenant may reorder these on the home layout). */
export type ThemeContentSectionSpec = { key: string; label: string };

/** Accessibility guarantees a theme declares (asserted by the a11y test suite). */
export type ThemeAccessibilityDeclaration = {
  /** Minimum text/background contrast ratio the theme's defaults meet (WCAG AA = 4.5). */
  minContrastRatio: number;
  supportsReducedMotion: boolean;
  supportsResponsive: boolean;
  keyboardNavigable: boolean;
  /** Landmark roles the layout renders (e.g. `banner`, `main`, `contentinfo`, `navigation`). */
  landmarks: readonly string[];
};

/**
 * A theme's CSP posture. The base build's CSP (`astro.config.mjs`) is
 * `default-src 'self'` with NO `unsafe-inline` for style/script. A theme MUST be
 * self-contained: no inline script, no inline style requirement (token values
 * ship as an EXTERNAL same-origin stylesheet), and no external script/style/
 * frame sources beyond the (currently empty) global allow-lists. Enforced by
 * `assertValidThemeDescriptor` so a theme can never weaken the app's CSP.
 */
export type ThemeCspDeclaration = {
  requiresInlineStyle: boolean;
  requiresInlineScript: boolean;
  externalStyleSources: readonly string[];
  externalScriptSources: readonly string[];
  externalFrameSources: readonly string[];
};

export type ThemeCompatibility = {
  minModuleContractVersion: string;
  supportedResourceTypes: readonly string[];
};

export type ThemeDescriptor = {
  themeKey: string;
  /** SemVer of the theme itself (independent of the module version). */
  version: string;
  name: string;
  owner: string;
  description: string;
  origin: ThemeOrigin;
  fontFamilies: readonly ThemeFontFamilyOption[];
  tokens: readonly ThemeTokenSpec[];
  slots: readonly ThemeSlotSpec[];
  assetSlots: readonly ThemeAssetSlotSpec[];
  contentSections: readonly ThemeContentSectionSpec[];
  navPlacements: readonly string[];
  accessibility: ThemeAccessibilityDeclaration;
  csp: ThemeCspDeclaration;
  compatibility: ThemeCompatibility;
};

/** Identity function that pins the `ThemeDescriptor` type at the definition site (mirrors `defineModule`). */
export function defineTheme(descriptor: ThemeDescriptor): ThemeDescriptor {
  return descriptor;
}

export const THEME_KEY_PATTERN = /^[a-z][a-z0-9_]*$/;
export const TOKEN_KEY_PATTERN = /^[a-z][a-z0-9_]*$/;

/**
 * The GLOBAL allow-lists for what external sources a theme may declare in its
 * CSP posture. Both empty by decision (ADR-0029 §7): themes must be
 * self-contained; adding an entry here is a reviewed CSP decision, not a
 * per-theme choice. `assertValidThemeDescriptor` rejects a theme that declares
 * any external script/style/frame source outside these lists.
 */
export const THEME_ALLOWED_EXTERNAL_STYLE_SOURCES: readonly string[] = [];
export const THEME_ALLOWED_EXTERNAL_SCRIPT_SOURCES: readonly string[] = [];
export const THEME_ALLOWED_EXTERNAL_FRAME_SOURCES: readonly string[] = [];

/** Thrown when a `ThemeDescriptor` is malformed or would weaken CSP/a11y. */
export class InvalidThemeDescriptorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidThemeDescriptorError";
  }
}

function assertSubset(
  declared: readonly string[],
  allowed: readonly string[],
  label: string,
  themeKey: string
): void {
  for (const entry of declared) {
    if (!allowed.includes(entry)) {
      throw new InvalidThemeDescriptorError(
        `Theme "${themeKey}" declares ${label} "${entry}" outside the reviewed allow-list — a theme may not weaken CSP (ADR-0029 §7).`
      );
    }
  }
}

/**
 * Validate a `ThemeDescriptor` is well-formed AND cannot weaken the app's
 * security/accessibility posture. Called by the registry for EVERY theme
 * (base + derived) at load time, so a malformed or CSP-weakening theme fails
 * the build/tests rather than shipping. Throws `InvalidThemeDescriptorError`.
 */
export function assertValidThemeDescriptor(descriptor: ThemeDescriptor): void {
  const { themeKey } = descriptor;
  if (!THEME_KEY_PATTERN.test(themeKey)) {
    throw new InvalidThemeDescriptorError(
      `Theme key "${themeKey}" must match ${THEME_KEY_PATTERN}.`
    );
  }

  // CSP: no inline requirement, no external sources beyond the (empty) allow-lists.
  if (descriptor.csp.requiresInlineScript) {
    throw new InvalidThemeDescriptorError(
      `Theme "${themeKey}" requires an inline script — forbidden (ADR-0029 §7: themes are self-contained, CSP is never weakened).`
    );
  }
  if (descriptor.csp.requiresInlineStyle) {
    throw new InvalidThemeDescriptorError(
      `Theme "${themeKey}" requires inline style — forbidden; token values ship as an external same-origin stylesheet (ADR-0029 §7).`
    );
  }
  assertSubset(
    descriptor.csp.externalStyleSources,
    THEME_ALLOWED_EXTERNAL_STYLE_SOURCES,
    "external style source",
    themeKey
  );
  assertSubset(
    descriptor.csp.externalScriptSources,
    THEME_ALLOWED_EXTERNAL_SCRIPT_SOURCES,
    "external script source",
    themeKey
  );
  assertSubset(
    descriptor.csp.externalFrameSources,
    THEME_ALLOWED_EXTERNAL_FRAME_SOURCES,
    "external frame source",
    themeKey
  );

  // A11y: a theme must declare it meets at least WCAG AA contrast + the core semantics.
  if (descriptor.accessibility.minContrastRatio < 4.5) {
    throw new InvalidThemeDescriptorError(
      `Theme "${themeKey}" declares a contrast ratio below WCAG AA (4.5).`
    );
  }
  if (
    !descriptor.accessibility.keyboardNavigable ||
    !descriptor.accessibility.supportsResponsive
  ) {
    throw new InvalidThemeDescriptorError(
      `Theme "${themeKey}" must be keyboard-navigable and responsive.`
    );
  }

  // Token keys unique + valid; font_family defaults reference a real allow-list key.
  const fontKeys = new Set(descriptor.fontFamilies.map((f) => f.key));
  const seenTokens = new Set<string>();
  for (const token of descriptor.tokens) {
    if (!TOKEN_KEY_PATTERN.test(token.key)) {
      throw new InvalidThemeDescriptorError(
        `Theme "${themeKey}" token key "${token.key}" must match ${TOKEN_KEY_PATTERN}.`
      );
    }
    if (seenTokens.has(token.key)) {
      throw new InvalidThemeDescriptorError(
        `Theme "${themeKey}" declares duplicate token key "${token.key}".`
      );
    }
    seenTokens.add(token.key);
    if (token.kind === "font_family" && !fontKeys.has(token.default)) {
      throw new InvalidThemeDescriptorError(
        `Theme "${themeKey}" font_family token "${token.key}" default "${token.default}" is not a declared fontFamilies key.`
      );
    }
  }

  // Slot defaults must be one of the slot's own variants.
  for (const slot of descriptor.slots) {
    if (!slot.variants.some((v) => v.key === slot.default)) {
      throw new InvalidThemeDescriptorError(
        `Theme "${themeKey}" slot "${slot.key}" default "${slot.default}" is not one of its variants.`
      );
    }
  }
}
