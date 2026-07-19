/**
 * Unit tests for theme descriptor validation + the build-time registry
 * composition (Issue #269, ADR-0029 §3). Proves: a theme cannot weaken CSP or
 * drop a11y; the base + a DERIVED-repo fixture theme compose through the SAME
 * gate; a derived theme cannot shadow a base theme; and every default theme
 * token value is itself safe.
 */
import { describe, expect, test } from "bun:test";

import {
  InvalidThemeDescriptorError,
  assertValidThemeDescriptor,
  type ThemeDescriptor
} from "../../src/modules/theming/domain/theme-descriptor";
import {
  BASE_THEME_DESCRIPTORS,
  composeThemeDescriptors,
  getThemeDescriptor,
  listThemeDescriptors
} from "../../src/modules/theming/theme-registry";
import { defaultTheme } from "../../src/modules/theming/themes/default-theme";
import {
  defaultThemeConfig,
  resolveThemeTokens
} from "../../src/modules/theming/domain/theme-config";
import { exampleApplicationThemeRegistry } from "../fixtures/derived-theme-example/theme-registry";

describe("assertValidThemeDescriptor", () => {
  test("the base default theme is valid", () => {
    expect(() => assertValidThemeDescriptor(defaultTheme)).not.toThrow();
  });

  test("rejects a theme that requires an inline script (CSP weakening)", () => {
    const bad: ThemeDescriptor = {
      ...defaultTheme,
      csp: { ...defaultTheme.csp, requiresInlineScript: true }
    };
    expect(() => assertValidThemeDescriptor(bad)).toThrow(
      InvalidThemeDescriptorError
    );
  });

  test("rejects a theme that requires inline style", () => {
    const bad: ThemeDescriptor = {
      ...defaultTheme,
      csp: { ...defaultTheme.csp, requiresInlineStyle: true }
    };
    expect(() => assertValidThemeDescriptor(bad)).toThrow(
      InvalidThemeDescriptorError
    );
  });

  test("rejects a theme declaring an external script source outside the allow-list", () => {
    const bad: ThemeDescriptor = {
      ...defaultTheme,
      csp: {
        ...defaultTheme.csp,
        externalScriptSources: ["https://evil.example"]
      }
    };
    expect(() => assertValidThemeDescriptor(bad)).toThrow(
      InvalidThemeDescriptorError
    );
  });

  test("rejects a theme below WCAG AA contrast or not keyboard-navigable", () => {
    expect(() =>
      assertValidThemeDescriptor({
        ...defaultTheme,
        accessibility: { ...defaultTheme.accessibility, minContrastRatio: 3 }
      })
    ).toThrow(InvalidThemeDescriptorError);
    expect(() =>
      assertValidThemeDescriptor({
        ...defaultTheme,
        accessibility: {
          ...defaultTheme.accessibility,
          keyboardNavigable: false
        }
      })
    ).toThrow(InvalidThemeDescriptorError);
  });

  test("rejects an invalid theme key and a slot default that is not one of its variants", () => {
    expect(() =>
      assertValidThemeDescriptor({ ...defaultTheme, themeKey: "Bad Key" })
    ).toThrow(InvalidThemeDescriptorError);
    expect(() =>
      assertValidThemeDescriptor({
        ...defaultTheme,
        slots: [
          {
            key: "header",
            label: "H",
            variants: [{ key: "a", label: "A" }],
            default: "z"
          }
        ]
      })
    ).toThrow(InvalidThemeDescriptorError);
  });
});

describe("composeThemeDescriptors", () => {
  test("base-only registry (undefined app registry) is exactly the base themes", () => {
    const composed = composeThemeDescriptors(undefined);
    expect(composed.map((t) => t.themeKey)).toEqual(
      BASE_THEME_DESCRIPTORS.map((t) => t.themeKey)
    );
    expect(composed.some((t) => t.themeKey === "aria")).toBe(true);
  });

  test("a DERIVED repository contributes a reviewed theme WITHOUT editing the base registry", () => {
    const composed = composeThemeDescriptors(exampleApplicationThemeRegistry);
    const keys = composed.map((t) => t.themeKey);
    expect(keys).toContain("aria"); // base, untouched
    expect(keys).toContain("aurora"); // derived, added via the seam
    // The derived theme flowed through the SAME validation gate.
    expect(composed.find((t) => t.themeKey === "aurora")?.origin).toBe(
      "derived"
    );
  });

  test("a derived theme may NOT shadow a base theme key", () => {
    const shadow = {
      id: "x",
      themes: [{ ...defaultTheme, origin: "derived" as const }]
    };
    expect(() => composeThemeDescriptors(shadow)).toThrow(
      /Duplicate theme key/
    );
  });
});

describe("effective registry + default token safety", () => {
  test("listThemeDescriptors + getThemeDescriptor resolve the base default", () => {
    expect(listThemeDescriptors().length).toBeGreaterThanOrEqual(1);
    expect(getThemeDescriptor("aria")?.themeKey).toBe("aria");
    expect(getThemeDescriptor("does_not_exist")).toBeNull();
  });

  test("every default theme token value passes its own validator (defaults are safe)", () => {
    // resolveThemeTokens re-validates every value; throwing would mean a default is unsafe.
    expect(() =>
      resolveThemeTokens(defaultTheme, defaultThemeConfig(defaultTheme))
    ).not.toThrow();
  });
});
