/**
 * Issue #372 — the three decision points of the visitor-analytics dashboard
 * client, now importable from
 * `modules/visitor-analytics/presentation/analytics-dashboard-client.ts`.
 *
 * All three are error-handling branches that no test could reach while the
 * 452-line controller lived inside `admin/analytics.astro`'s `<script>`:
 *   - `parseAnalyticsPageConfig`'s `catch` decides what a page whose config
 *     blob is corrupt falls back to — a throw here would abort module
 *     evaluation and freeze every section on "loading" with no error shown;
 *   - `aggregateSummaryState` decides whether a partly-failed summary is
 *     reported as a failure or quietly as "no data yet" (the issue's own
 *     guardrail forbids the latter);
 *   - `resolveSessionsOutcome` is the sessions request's failure branch,
 *     including the ok-but-empty-payload case.
 */
import { describe, expect, test } from "bun:test";

import {
  ANALYTICS_PAGE_CONFIG_FALLBACK,
  aggregateSummaryState,
  parseAnalyticsPageConfig,
  resolveSessionsOutcome
} from "../../src/modules/visitor-analytics/presentation/analytics-dashboard-client";

describe("parseAnalyticsPageConfig (Issue #372)", () => {
  test("malformed JSON degrades to the closed-by-default fallback", () => {
    expect(parseAnalyticsPageConfig("{ not json")).toEqual(
      ANALYTICS_PAGE_CONFIG_FALLBACK
    );
  });

  test("a missing or empty config blob degrades to the same fallback", () => {
    expect(parseAnalyticsPageConfig(null)).toEqual(
      ANALYTICS_PAGE_CONFIG_FALLBACK
    );
    expect(parseAnalyticsPageConfig(undefined)).toEqual(
      ANALYTICS_PAGE_CONFIG_FALLBACK
    );
    expect(parseAnalyticsPageConfig("")).toEqual(
      ANALYTICS_PAGE_CONFIG_FALLBACK
    );
  });

  test("the fallback grants nothing: no privileged section, no gated fetch", () => {
    const config = parseAnalyticsPageConfig("[[[");

    expect(config.canViewRealtime).toBe(false);
    expect(config.canViewSessions).toBe(false);
    expect(config.showRawDetailColumns).toBe(false);
    expect(config.geoActive).toBe(false);
  });

  test("a partial payload keeps the fallback for every key it omits", () => {
    const config = parseAnalyticsPageConfig('{"canViewSessions":true}');

    expect(config.canViewSessions).toBe(true);
    expect(config.showRawDetailColumns).toBe(false);
    expect(config.locale).toBe("en");
  });

  test("a well-formed payload is used as-is", () => {
    const config = parseAnalyticsPageConfig(
      '{"canViewRealtime":true,"canViewSessions":true,"showRawDetailColumns":true,"geoActive":true,"locale":"id"}'
    );

    expect(config).toEqual({
      canViewRealtime: true,
      canViewSessions: true,
      showRawDetailColumns: true,
      geoActive: true,
      locale: "id"
    });
  });
});

describe("aggregateSummaryState (Issue #372)", () => {
  test("one failing range makes the whole section an error, not 'empty'", () => {
    expect(
      aggregateSummaryState([
        { state: "empty" },
        { state: "error", message: "Service unavailable." },
        { state: "empty" }
      ])
    ).toEqual({ state: "error", message: "Service unavailable." });
  });

  test("the first error carrying a message wins", () => {
    expect(
      aggregateSummaryState([
        { state: "error", message: undefined },
        { state: "error", message: "Rate limited." }
      ])
    ).toEqual({ state: "error", message: "Rate limited." });
  });

  test("an error with no message at all still reports error state", () => {
    expect(aggregateSummaryState([{ state: "error" }])).toEqual({
      state: "error",
      message: undefined
    });
  });

  test("all three ranges empty is 'empty'", () => {
    expect(
      aggregateSummaryState([
        { state: "empty" },
        { state: "empty" },
        { state: "empty" }
      ])
    ).toEqual({ state: "empty" });
  });

  test("any range with data is 'ready'", () => {
    expect(
      aggregateSummaryState([
        { state: "empty" },
        { state: "ready" },
        { state: "empty" }
      ])
    ).toEqual({ state: "ready" });
  });
});

describe("resolveSessionsOutcome (Issue #372)", () => {
  test("a failed request is an error carrying the resolved message", () => {
    expect(
      resolveSessionsOutcome({ ok: false, data: null, message: "Forbidden." })
    ).toEqual({ state: "error", message: "Forbidden." });
  });

  test("ok with a null payload is an error, not an empty result set", () => {
    expect(resolveSessionsOutcome({ ok: true, data: null })).toEqual({
      state: "error",
      message: undefined
    });
  });

  test("ok with a payload is ready and passes the payload through", () => {
    const data = { sessions: [], nextCursor: null };

    expect(resolveSessionsOutcome({ ok: true, data })).toEqual({
      state: "ready",
      data
    });
  });

  test("an empty sessions array is still 'ready' — the empty state is the table's job", () => {
    const outcome = resolveSessionsOutcome({
      ok: true,
      data: { sessions: [], nextCursor: "cursor-1" }
    });

    expect(outcome.state).toBe("ready");
  });
});
