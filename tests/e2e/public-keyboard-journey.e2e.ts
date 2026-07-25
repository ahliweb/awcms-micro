/**
 * Keyboard-journey conformance for the PUBLIC (anonymous) surfaces — Issue
 * #296, epic #261 (website-platform), acceptance criterion "critical public
 * journeys meet the declared WCAG 2.2 target (axe, EN + ID, desktop + mobile,
 * keyboard, SR)".
 *
 * WHY A SEPARATE SPEC FROM `public-a11y-smoke.e2e.ts`. axe-core is a static
 * DOM auditor: it can see that a control has an accessible name, but it cannot
 * press Tab. Three of the criteria this issue names are only observable by
 * actually driving the keyboard, and each one has a documented history of
 * shipping broken while an axe scan stayed green:
 *
 *   - **2.1.2 No Keyboard Trap** — a focus loop that never releases. Invisible
 *     to a static scan; only reachable by tabbing until focus either escapes or
 *     provably cycles.
 *   - **2.4.3 Focus Order** — a `tabindex` or CSS-order change can make the
 *     traversal order diverge from the reading order without any DOM node
 *     looking wrong in isolation.
 *   - **2.4.7 / 2.4.11 Focus Visible / Focus Appearance** — a global
 *     `outline: none` reset produces a perfectly accessible-looking DOM whose
 *     focused element is invisible on screen. `:focus-visible` styling only
 *     exists WHILE focused, so it cannot be asserted without focusing.
 *
 * This spec is deliberately **hermetic and read-only**: it seeds only the
 * locale cookie (same COOKIE-ONLY mechanism `public-a11y-smoke.e2e.ts`
 * documents — `resolveRequestLocale(context.cookies)` for every non-`/admin/*`
 * route), navigates, and presses keys. There is no database import, no seeded
 * tenant, and no mutable server state, so it is retry-safe AND safe to point at
 * a deployed instance with `E2E_BASE_URL` — which is how the criterion's
 * "deployed instance" half gets exercised without writing to production.
 *
 * SCOPE — the same public pages `public-a11y-smoke.e2e.ts` covers, for the same
 * reason (they render reliably with no seeded content): `/`, `/newsletter/demo`
 * (both locales), `/comments/demo` (both locales). A published blog/news page
 * needs a bootstrapped tenant and is covered hermetically by
 * `public-content-a11y.e2e.ts`.
 *
 * Requires only the server under `E2E_BASE_URL` (default
 * `http://localhost:4321`). Run:
 *   `bun run test:e2e tests/e2e/public-keyboard-journey.e2e.ts`.
 */
import { test, expect, type Page } from "@playwright/test";

/** The cookie the language switcher sets; `LOCALE_COOKIE_NAME` in `locale.ts`. */
const LOCALE_COOKIE_NAME = "awcms_micro_locale";
const LOCALES = ["en", "id"] as const;

/**
 * Upper bound on Tab presses per page. Generous relative to these pages'
 * control counts (single digits) but finite: a real keyboard trap must show up
 * as "focus never leaves this element" long before the bound, and the bound is
 * what keeps a trap from hanging the run until Playwright's own timeout.
 */
const MAX_TAB_PRESSES = 40;

type FocusedElement = {
  /** Document order index among focusable candidates, or -1 if not a candidate. */
  domIndex: number;
  tag: string;
  /** Best-effort identity for failure messages. */
  label: string;
  /** True when the focused element paints a focus indicator (outline or ring). */
  hasVisibleFocusIndicator: boolean;
};

/**
 * The focusable-candidate selector. Matches what a sequential-navigation user
 * can actually reach: links with an href, form controls, and anything given an
 * explicit non-negative tabindex. `:not([disabled])` and `[tabindex="-1"]`
 * exclusions mirror the browser's own sequential-focus rules.
 */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "[tabindex]"
]
  .map((base) => `${base}:not([disabled]):not([tabindex="-1"])`)
  .join(", ");

/**
 * Read the currently-focused element, its position in document order, and
 * whether it paints a focus indicator.
 *
 * The focus-indicator check requires the focused element to paint a computed
 * `outline` (non-`none` style with a real width — the UA ring's
 * `outline-style: auto` qualifies) or a `box-shadow`. It deliberately does NOT
 * measure indicator contrast/thickness (2.4.11 AAA territory): the failure it
 * guards against is the common one, a blanket `outline: none` reset that leaves
 * a keyboard user with no visible position at all. Falsifiability is verified
 * by a negative control (inject `outline: none !important; box-shadow: none
 * !important` and this spec must FAIL) rather than assumed from a green run.
 */
async function readFocus(
  page: Page,
  focusableSelector: string
): Promise<FocusedElement> {
  return page.evaluate((selector) => {
    const active = document.activeElement;
    if (!active || active === document.body) {
      return {
        domIndex: -1,
        tag: active ? active.tagName.toLowerCase() : "none",
        label: "(body)",
        hasVisibleFocusIndicator: true
      };
    }

    const candidates = Array.from(document.querySelectorAll(selector));
    const domIndex = candidates.indexOf(active);
    const style = window.getComputedStyle(active);
    const outlineWidth = Number.parseFloat(style.outlineWidth || "0");
    // `outline-style: auto` is the UA focus ring; `outline-width` computes to a
    // real pixel value for it, so the width test does not reject it.
    const hasOutline =
      style.outlineStyle !== "none" && Number.isFinite(outlineWidth)
        ? outlineWidth > 0
        : false;
    const hasRing = style.boxShadow !== "none" && style.boxShadow !== "";

    // Outline and box-shadow are the two forms an indicator can take that are
    // observable WHILE focused. A border-colour swap is deliberately NOT
    // accepted here: it can only be recognised by diffing against the same
    // element's unfocused styles, and accepting it unconditionally would make
    // this assertion unfalsifiable (every element has some border colour).
    return {
      domIndex,
      tag: active.tagName.toLowerCase(),
      label:
        active.getAttribute("aria-label") ??
        active.textContent?.trim().slice(0, 40) ??
        active.getAttribute("name") ??
        active.tagName.toLowerCase(),
      hasVisibleFocusIndicator: hasOutline || hasRing
    };
  }, focusableSelector);
}

/**
 * Tab through the page and return the traversal, stopping when focus returns to
 * the document (browser chrome / address bar) or the bound is hit.
 */
async function tabThrough(page: Page): Promise<FocusedElement[]> {
  const seen: FocusedElement[] = [];

  for (let press = 0; press < MAX_TAB_PRESSES; press += 1) {
    await page.keyboard.press("Tab");
    const focused = await readFocus(page, FOCUSABLE_SELECTOR);

    // Focus left the page's control set (returned to the document/body). One
    // full pass is done — everything reachable has been reached.
    if (focused.domIndex === -1 && seen.length > 0) {
      break;
    }

    seen.push(focused);

    // A full cycle: focus is back on the first control it started at.
    if (
      seen.length > 1 &&
      focused.domIndex >= 0 &&
      focused.domIndex === seen[0]!.domIndex
    ) {
      seen.pop();
      break;
    }
  }

  return seen;
}

async function assertKeyboardJourney(page: Page, label: string): Promise<void> {
  const visibleFocusableCount = await page
    .locator(FOCUSABLE_SELECTOR)
    .filter({ visible: true })
    .count();

  await page.evaluate(() => document.body.focus());
  const traversal = await tabThrough(page);

  // 2.1.2 No Keyboard Trap: the traversal terminated on its own (either focus
  // left the page or it cycled back to the start) rather than being cut off by
  // the bound, and it never sat on one element repeatedly.
  expect(
    traversal.length,
    `${label}: focus never escaped or cycled within ${MAX_TAB_PRESSES} Tab presses — possible keyboard trap`
  ).toBeLessThan(MAX_TAB_PRESSES);

  if (visibleFocusableCount === 0) {
    // Nothing focusable on the page at all (a purely static document): the
    // remaining criteria are vacuous, and asserting them would be theatre.
    return;
  }

  expect(
    traversal.length,
    `${label}: Tab reached no control at all despite ${visibleFocusableCount} visible focusable element(s)`
  ).toBeGreaterThan(0);

  // 2.4.3 Focus Order: the order Tab visits controls in matches document order.
  // Only positions that ARE focusable candidates participate (a skip link that
  // moves focus to a container is legitimately not one).
  const orderedIndexes = traversal
    .map((entry) => entry.domIndex)
    .filter((index) => index >= 0);
  const sortedIndexes = [...orderedIndexes].sort((a, b) => a - b);
  expect(
    orderedIndexes,
    `${label}: Tab order diverges from document order (${orderedIndexes.join(",")})`
  ).toEqual(sortedIndexes);

  // 2.4.7 Focus Visible: every visited control paints an indicator while focused.
  const invisible = traversal.filter(
    (entry) => entry.domIndex >= 0 && !entry.hasVisibleFocusIndicator
  );
  expect(
    invisible.map((entry) => `${entry.tag} "${entry.label}"`),
    `${label}: focused control(s) with no visible focus indicator`
  ).toEqual([]);

  // Reverse traversal works too — Shift+Tab must walk back, not dead-end.
  const forwardLast = await readFocus(page, FOCUSABLE_SELECTOR);
  await page.keyboard.press("Shift+Tab");
  const backOne = await readFocus(page, FOCUSABLE_SELECTOR);
  if (forwardLast.domIndex > 0) {
    expect(
      backOne.domIndex,
      `${label}: Shift+Tab did not move focus backwards from index ${forwardLast.domIndex}`
    ).not.toBe(forwardLast.domIndex);
  }
}

/**
 * Seed the locale cookie for the origin under test, then navigate. Clearing
 * first keeps a prior locale from leaking across a per-locale loop iteration.
 */
async function gotoWithLocale(
  page: Page,
  path: string,
  locale: (typeof LOCALES)[number],
  baseURL: string | undefined
): Promise<void> {
  await page.context().clearCookies();
  await page.context().addCookies([
    {
      name: LOCALE_COOKIE_NAME,
      value: locale,
      url: baseURL ?? "http://localhost:4321"
    }
  ]);
  await page.goto(path);
}

test.describe("Public — keyboard journey (WCAG 2.2 AA: 2.1.2, 2.4.3, 2.4.7)", () => {
  test("homepage is fully keyboard traversable with visible focus", async ({
    page
  }) => {
    // `/` is static (hardcoded lang, ignores the locale cookie) — one pass.
    await page.goto("/");
    await assertKeyboardJourney(page, "/ (homepage)");
  });

  for (const locale of LOCALES) {
    test(`newsletter demo page is fully keyboard traversable with visible focus (${locale})`, async ({
      page,
      baseURL
    }) => {
      await gotoWithLocale(page, "/newsletter/demo", locale, baseURL);
      await assertKeyboardJourney(page, `/newsletter/demo (${locale})`);
    });

    test(`comments demo page is fully keyboard traversable with visible focus (${locale})`, async ({
      page,
      baseURL
    }) => {
      await gotoWithLocale(page, "/comments/demo", locale, baseURL);
      await assertKeyboardJourney(page, `/comments/demo (${locale})`);
    });
  }
});
