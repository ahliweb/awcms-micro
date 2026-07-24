/**
 * Core Web Vitals LAB-measurement gate for the PUBLIC pages (Issue #295, epic
 * #261 website-platform, acceptance "Core Web Vitals within budget"). Loads
 * each hermetic public page in a real Chromium (Playwright + Bun), measures
 * Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) via the
 * in-page `PerformanceObserver` API, and asserts each is within budget.
 *
 * SCOPE + HONESTY: this is a LAB measurement on localhost, so it is a
 * REGRESSION GATE (catches a change that introduces a large LCP element or a
 * visible layout shift), NOT the "field/representative-volume" CWV proof #295
 * ultimately asks for — measured LCP/INP/CLS on production-like content/media
 * volume with real network/CDN remains an infrastructure drill (tracked in
 * `website-platform-e2e-evidence.md` §Deferred work). INP is not asserted here:
 * it is interaction-driven and not reliably observable for a cold headless
 * page load; LCP + CLS are the two lab-observable vitals. Budgets use the
 * Google "good" thresholds (LCP ≤ 2500 ms, CLS ≤ 0.1) — comfortably slack for
 * these SSR/near-static pages on localhost, so a failure means a real
 * regression, not CI noise.
 *
 * Pages (render reliably without a seeded tenant — same hermetic set the
 * a11y/link specs use): `/` and `/newsletter/demo`.
 *
 * Requires only the server under `E2E_BASE_URL` (default
 * `http://localhost:4321`). Run:
 *   `bun run test:e2e tests/e2e/public-web-vitals.e2e.ts`.
 */
import { test, expect, type Page } from "@playwright/test";

const LCP_BUDGET_MS = 2500;
const CLS_BUDGET = 0.1;
/** Settle window after `load` for late layout shifts / a later LCP candidate. */
const SETTLE_MS = 1500;

const PAGES = ["/", "/newsletter/demo"] as const;

type Vitals = { lcp: number; cls: number };

/**
 * Install the observers BEFORE any document script runs so no early
 * largest-contentful-paint / layout-shift entry is missed. Values are read
 * back after navigation + a settle window.
 */
async function installVitalsObservers(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const w = window as unknown as { __vitals: Vitals };
    w.__vitals = { lcp: 0, cls: 0 };

    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // renderTime is 0 for cross-origin images without Timing-Allow-Origin;
          // fall back to startTime, which is always populated.
          const e = entry as PerformanceEntry & { renderTime?: number };
          w.__vitals.lcp = Math.max(
            w.__vitals.lcp,
            e.renderTime || e.startTime
          );
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      /* observer type unsupported — leaves lcp at 0, asserted-as-within-budget */
    }

    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          };
          if (!shift.hadRecentInput) w.__vitals.cls += shift.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    } catch {
      /* observer type unsupported — leaves cls at 0 */
    }
  });
}

test.describe("Public — Core Web Vitals lab budgets (Issue #295)", () => {
  for (const path of PAGES) {
    test(`${path} is within LCP/CLS budget`, async ({ page }) => {
      await installVitalsObservers(page);
      await page.goto(path, { waitUntil: "load" });
      // Let late shifts / a later LCP candidate register, then read.
      await page.waitForTimeout(SETTLE_MS);

      const vitals = await page.evaluate(
        () => (window as unknown as { __vitals: Vitals }).__vitals
      );

      expect(
        vitals.lcp,
        `${path}: LCP ${Math.round(vitals.lcp)}ms exceeds ${LCP_BUDGET_MS}ms budget`
      ).toBeLessThanOrEqual(LCP_BUDGET_MS);
      expect(
        vitals.cls,
        `${path}: CLS ${vitals.cls.toFixed(3)} exceeds ${CLS_BUDGET} budget`
      ).toBeLessThanOrEqual(CLS_BUDGET);
    });
  }
});
