/**
 * Core Web Vitals LAB-measurement gate for the PUBLIC pages (Issue #295, epic
 * #261 website-platform, acceptance "Core Web Vitals within budget"). Loads
 * each hermetic public page in a real Chromium (Playwright + Bun), measures
 * Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and
 * Interaction to Next Paint (INP) via the in-page `PerformanceObserver` API,
 * and asserts each is within budget.
 *
 * SCOPE + HONESTY: this is a LAB measurement on localhost, so it is a
 * REGRESSION GATE (catches a change that introduces a large LCP element, a
 * visible layout shift, or a slow interaction handler), NOT the
 * "field/representative-volume" CWV proof #295 ultimately asks for — measured
 * LCP/INP/CLS on production-like content/media volume with real network/CDN
 * remains an infrastructure drill (tracked in
 * `website-platform-e2e-evidence.md` §Deferred work). Budgets use the Google
 * "good" thresholds (LCP ≤ 2500 ms, CLS ≤ 0.1, INP ≤ 200 ms) — comfortably
 * slack for these SSR/near-static pages on localhost, so a failure means a
 * real regression, not CI noise.
 *
 * WHY INP NEEDS TWO COUNTERS. INP is interaction-driven, so this spec DRIVES
 * the interactions itself (keyboard tabbing + a click on a non-navigating
 * element) rather than hoping a cold page load produces one. It then reads two
 * independent numbers:
 *
 *   - `inp` — the worst interaction latency from `event`-timing entries that
 *     carry an `interactionId`. The Event Timing spec clamps
 *     `durationThreshold` to a MINIMUM of 16 ms, so interactions faster than
 *     that are never reported at all. `inp: 0` therefore means "every
 *     interaction finished under the 16 ms observer floor" — a pass.
 *   - `interactions` — a plain `addEventListener` counter, which has no such
 *     floor. It exists so `inp: 0` can be distinguished from "the driver never
 *     actually interacted with the page". Asserting `interactions > 0` is what
 *     keeps the INP budget from passing vacuously.
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
const INP_BUDGET_MS = 200;
/** Settle window after `load` for late layout shifts / a later LCP candidate. */
const SETTLE_MS = 1500;
/** Window after the driven interactions for their paint + entry to land. */
const INTERACTION_SETTLE_MS = 500;

const PAGES = ["/", "/newsletter/demo"] as const;

type Vitals = { lcp: number; cls: number; inp: number; interactions: number };

/**
 * Install the observers BEFORE any document script runs so no early
 * largest-contentful-paint / layout-shift entry is missed. Values are read
 * back after navigation + a settle window.
 */
async function installVitalsObservers(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const w = window as unknown as { __vitals: Vitals };
    w.__vitals = { lcp: 0, cls: 0, inp: 0, interactions: 0 };

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

    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Only entries the browser grouped into a real user interaction
          // carry a non-zero interactionId; everything else is a plain event.
          const e = entry as PerformanceEntry & { interactionId?: number };
          if (!e.interactionId) continue;
          w.__vitals.inp = Math.max(w.__vitals.inp, e.duration);
        }
        // durationThreshold is clamped to >= 16ms by the spec, so sub-16ms
        // interactions legitimately produce no entries here — see the counter
        // below, which is what proves an interaction happened at all. It is an
        // Event Timing option, not yet in lib.dom's PerformanceObserverInit,
        // hence the cast.
      }).observe({
        type: "event",
        buffered: true,
        durationThreshold: 16
      } as PerformanceObserverInit);
    } catch {
      /* observer type unsupported — leaves inp at 0 */
    }

    for (const type of ["pointerdown", "keydown"]) {
      window.addEventListener(
        type,
        () => {
          w.__vitals.interactions += 1;
        },
        { capture: true, passive: true }
      );
    }
  });
}

/**
 * Drives real interactions so INP has something to measure. Deliberately
 * NON-NAVIGATING and non-submitting: tabbing moves focus through the page's
 * own focusable elements, and the click targets the first heading (present on
 * every public page, inert). A form submit would leave the page and fetch,
 * which would measure the network, not the interaction handler.
 */
async function driveInteractions(page: Page): Promise<void> {
  for (let i = 0; i < 3; i += 1) {
    await page.keyboard.press("Tab");
  }

  const heading = page.locator("h1").first();
  if ((await heading.count()) > 0) {
    await heading.click({ position: { x: 2, y: 2 } });
  } else {
    await page.locator("body").click({ position: { x: 2, y: 2 } });
  }

  await page.waitForTimeout(INTERACTION_SETTLE_MS);
}

test.describe("Public — Core Web Vitals lab budgets (Issue #295)", () => {
  for (const path of PAGES) {
    test(`${path} is within LCP/CLS/INP budget`, async ({ page }) => {
      await installVitalsObservers(page);
      await page.goto(path, { waitUntil: "load" });
      // Let late shifts / a later LCP candidate register, then read.
      await page.waitForTimeout(SETTLE_MS);
      await driveInteractions(page);

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

      // Guards the INP budget below from passing vacuously: without this, a
      // page that silently swallowed every interaction would report inp=0.
      expect(
        vitals.interactions,
        `${path}: no interaction reached the page — the INP budget below would be vacuous`
      ).toBeGreaterThan(0);
      expect(
        vitals.inp,
        `${path}: INP ${Math.round(vitals.inp)}ms exceeds ${INP_BUDGET_MS}ms budget`
      ).toBeLessThanOrEqual(INP_BUDGET_MS);
    });
  }
});
