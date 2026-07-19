/**
 * In-repo fixture `ApplicationThemeRegistry` (Issue #269, ADR-0029 §3) —
 * illustrates exactly what a real derived repository would export from ITS OWN
 * `src/modules/theming/application-theme-registry.ts` (see that file in this
 * repo for the base's own, always-`undefined`, shipped version). Consumed ONLY
 * by `tests/unit/theme-registry.test.ts` (which composes it through the SAME
 * `composeThemeDescriptors` gate as the base) — never imported by the base seam
 * itself, since the base repository's own build must keep shipping `undefined`
 * there (a default base build composes exactly the base themes).
 */
import type { ApplicationThemeRegistry } from "../../../src/modules/theming/theme-registry";
import { auroraTheme } from "./themes/aurora-theme";

export const exampleApplicationThemeRegistry: ApplicationThemeRegistry = {
  id: "derived-theme-example-fixture",
  themes: [auroraTheme]
};
