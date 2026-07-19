/**
 * In-repo fixture theme "Aurora" (Issue #269, ADR-0029 §3) — illustrates a
 * reviewed theme a DERIVED repository contributes through its own theme
 * registry, WITHOUT editing the base default theme or `src/modules/theming/
 * theme-registry.ts`. Consumed only by `tests/unit/theme-registry.test.ts`
 * (through the derived-fixture registry) — never imported by the base seam
 * (`application-theme-registry.ts` stays `undefined`).
 *
 * Note it flows through the SAME `defineTheme`/`ThemeDescriptor` contract and
 * the SAME `assertValidThemeDescriptor` gate as the base theme — a derived
 * theme that tried to weaken CSP (inline script, external font) or drop a11y
 * would fail composition exactly like a base one would.
 */
import { defineTheme } from "../../../../src/modules/theming/domain/theme-descriptor";

export const auroraTheme = defineTheme({
  themeKey: "aurora",
  version: "0.1.0",
  name: "Aurora",
  owner: "@derived-example",
  description:
    "A derived-repository fixture theme with a darker, higher-contrast palette and a different slot set — proof a downstream repo can contribute a reviewed theme through the build-time registry seam without editing the base theme registry.",
  origin: "derived",
  fontFamilies: [
    {
      key: "grotesk",
      label: "Grotesk",
      stack: '"Space Grotesk", system-ui, sans-serif'
    },
    { key: "system", label: "System", stack: "system-ui, sans-serif" }
  ],
  tokens: [
    {
      key: "color_primary",
      kind: "color",
      label: "Primary",
      description: "Primary.",
      default: "#7c3aed"
    },
    {
      key: "color_on_primary",
      kind: "color",
      label: "On primary",
      description: "On primary.",
      default: "#ffffff"
    },
    {
      key: "color_background",
      kind: "color",
      label: "Background",
      description: "Background.",
      default: "#0b1020"
    },
    {
      key: "color_text",
      kind: "color",
      label: "Text",
      description: "Text.",
      default: "#e5e7eb"
    },
    {
      key: "color_accent",
      kind: "color",
      label: "Accent",
      description: "Accent.",
      default: "#22d3ee"
    },
    {
      key: "font_body",
      kind: "font_family",
      label: "Body font",
      description: "Body.",
      default: "grotesk"
    },
    {
      key: "radius_base",
      kind: "dimension",
      label: "Radius",
      description: "Radius.",
      constraint: { units: ["rem", "px"], min: 0, max: 3 },
      default: "1rem"
    },
    {
      key: "line_height_base",
      kind: "number",
      label: "Line height",
      description: "Line height.",
      constraint: { min: 1.2, max: 2 },
      default: "1.6"
    }
  ],
  slots: [
    {
      key: "header",
      label: "Header",
      variants: [
        { key: "overlay", label: "Overlay" },
        { key: "sticky", label: "Sticky" }
      ],
      default: "sticky"
    }
  ],
  assetSlots: [{ key: "logo", label: "Logo", kind: "logo" }],
  contentSections: [
    { key: "hero", label: "Hero" },
    { key: "showcase", label: "Showcase" }
  ],
  navPlacements: ["top"],
  accessibility: {
    minContrastRatio: 7,
    supportsReducedMotion: true,
    supportsResponsive: true,
    keyboardNavigable: true,
    landmarks: ["banner", "navigation", "main", "contentinfo"]
  },
  csp: {
    requiresInlineStyle: false,
    requiresInlineScript: false,
    externalStyleSources: [],
    externalScriptSources: [],
    externalFrameSources: []
  },
  compatibility: {
    minModuleContractVersion: "1.2.0",
    supportedResourceTypes: ["home", "page"]
  }
});
