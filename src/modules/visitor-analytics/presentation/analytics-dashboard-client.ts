/**
 * Browser controller for the visitor-analytics dashboard
 * (`/admin/analytics`) — presentation layer per ADR-0038, moved out of that
 * page's 452-line inline `<script>` by Issue #372.
 *
 * Every value on the dashboard arrives here from a real `fetch` to the
 * ABAC-guarded `GET /api/v1/analytics/*` endpoints (Issue #621) — this file
 * renders exactly what the API sent back and never re-derives a permission
 * decision.
 *
 * The three functions exported alongside `initAnalyticsDashboard` are the
 * decision points that used to be unreachable by any test: config parsing
 * (whose `catch` decides what a *broken* page config falls back to), the
 * summary section's error/empty aggregation across three parallel range
 * requests, and the sessions request's failure branch. See
 * `tests/unit/analytics-dashboard-client.test.ts` — `bun test` has no DOM,
 * so the rendering itself stays covered by
 * `tests/e2e/admin-analytics-dashboard.e2e.ts`, and everything that decides
 * *what* to render is pure and tested here.
 */
import {
  fetchJson,
  readClientStrings
} from "../../../lib/ui/admin-form-client";
import { formatDateTime, formatNumber } from "../../../lib/i18n/format";
import type { SupportedLocale } from "../../../lib/i18n/locale";
import {
  buildSessionRowCells,
  isNamedCountListEmpty,
  isRealtimeAllZero,
  isSecurityViewEmpty,
  isSummaryEmpty,
  matchesAreaFilter,
  matchesVisitorTypeFilter,
  resolveSectionState,
  type AnalyticsAreaFilter,
  type AnalyticsVisitorTypeFilter,
  type SessionRowLike
} from "../domain/dashboard-view";

export interface AnalyticsPageConfig {
  canViewRealtime: boolean;
  canViewSessions: boolean;
  showRawDetailColumns: boolean;
  geoActive: boolean;
  locale: SupportedLocale;
}

export interface AnalyticsStrings {
  networkError: string;
  errorMessages?: Record<string, string>;
  humanLabel: string;
  botLabel: string;
  stateLoading: string;
  stateEmptyGeneric: string;
  stateErrorGeneric: string;
  sessionsEmpty: string;
  sessionsFilteredEmpty: string;
}

export type SectionState = "ready" | "empty" | "error";

/** The safe defaults a page whose config blob is missing or corrupt falls
 *  back to: show nothing privileged, fetch nothing gated. */
export const ANALYTICS_PAGE_CONFIG_FALLBACK: AnalyticsPageConfig = {
  canViewRealtime: false,
  canViewSessions: false,
  showRawDetailColumns: false,
  geoActive: false,
  locale: "en"
};

/**
 * Parses the `<script type="application/json" id="analytics-page-config">`
 * payload. A missing element, empty text, or malformed JSON must degrade to
 * the closed-by-default fallback rather than throwing — a parse error here
 * would otherwise abort module evaluation and leave the whole dashboard
 * frozen on "loading" with no error message at all.
 */
export function parseAnalyticsPageConfig(
  raw: string | null | undefined
): AnalyticsPageConfig {
  if (!raw) return { ...ANALYTICS_PAGE_CONFIG_FALLBACK };
  try {
    return { ...ANALYTICS_PAGE_CONFIG_FALLBACK, ...JSON.parse(raw) };
  } catch {
    return { ...ANALYTICS_PAGE_CONFIG_FALLBACK };
  }
}

/**
 * Folds the three per-range summary outcomes into the one status line the
 * Summary section shows. Error wins over empty (this issue's own guardrail:
 * a failure is never presented as if it were merely "no data yet"), and the
 * first error message is the one shown — the three requests differ only by
 * range, so a second copy of the same failure adds nothing.
 */
export function aggregateSummaryState(
  outcomes: { state: SectionState; message?: string }[]
): { state: SectionState; message?: string } {
  const errors = outcomes.filter((outcome) => outcome.state === "error");
  if (errors.length > 0) {
    // Mirrors the original `firstErrorMessage ??= result.message`: the first
    // error that actually carries a message wins, so an error without one
    // never suppresses a later, more informative message.
    return {
      state: "error",
      message: errors.find((error) => error.message !== undefined)?.message
    };
  }
  const allEmpty = outcomes.every((outcome) => outcome.state === "empty");
  return { state: allEmpty ? "empty" : "ready" };
}

/**
 * The sessions request is the one section that cannot fall back to a
 * partial render: without rows there is nothing to filter or paginate. A
 * non-ok response OR an ok response with no payload both mean "error" —
 * the second case matters because `fetchJson` resolves `ok: true` with
 * `data: null` for a 204/empty body, which must not be mistaken for an
 * empty result set.
 */
export function resolveSessionsOutcome<TData>(result: {
  ok: boolean;
  data?: TData | null;
  message?: string;
}): { state: "error"; message?: string } | { state: "ready"; data: TData } {
  if (!result.ok || !result.data) {
    return { state: "error", message: result.message };
  }
  return { state: "ready", data: result.data };
}

type SessionWithLastSeen = SessionRowLike & { lastSeenAt: string };

export function initAnalyticsDashboard(
  config: AnalyticsPageConfig = parseAnalyticsPageConfig(
    document.getElementById("analytics-page-config")?.textContent
  ),
  strings: AnalyticsStrings = readClientStrings<AnalyticsStrings>(
    "i18n-strings"
  )
): void {
  function sectionStateEl(role: string): HTMLElement | null {
    return document.querySelector(`[data-role="${role}-state"]`);
  }

  /** Renders one of doc 14's four mandated widget states as this section's
   *  own status line — "ready" clears it, "empty"/"error" show a message. */
  function setSectionState(
    role: string,
    state: SectionState,
    message?: string
  ): void {
    const el = sectionStateEl(role);
    if (!el) return;
    if (state === "ready") {
      el.textContent = "";
      return;
    }
    el.textContent =
      message ??
      (state === "empty"
        ? strings.stateEmptyGeneric
        : strings.stateErrorGeneric);
  }

  function setTileValue(
    scopeSelector: string,
    field: string,
    value: string
  ): void {
    const scope = document.querySelector(scopeSelector);
    const el = scope?.querySelector(`[data-field="${field}"]`);
    if (el) el.textContent = value;
  }

  function renderNamedCountTable(
    role: string,
    rows: { name: string; count: number }[]
  ): void {
    const tbody = document.querySelector(`[data-role="${role}"] tbody`);
    if (!tbody) return;
    tbody.innerHTML = "";
    for (const row of rows) {
      const tr = document.createElement("tr");
      const nameTd = document.createElement("td");
      nameTd.textContent = row.name;
      const countTd = document.createElement("td");
      countTd.textContent = formatNumber(row.count, config.locale);
      tr.append(nameTd, countTd);
      tbody.append(tr);
    }
  }

  async function loadRealtime(): Promise<void> {
    if (!config.canViewRealtime) return;
    const result = await fetchJson<{
      onlineHumanCount: number;
      onlineAdminCount: number;
      onlinePublicCount: number;
      onlineApiCount: number;
      lastUpdatedAt: string;
    }>("/api/v1/analytics/realtime", strings);

    const state = resolveSectionState(
      result.ok,
      result.data,
      isRealtimeAllZero
    );
    const stats = result.data;
    const scope = '[data-section="realtime"]';
    setTileValue(
      scope,
      "onlineHumanCount",
      stats ? formatNumber(stats.onlineHumanCount, config.locale) : "–"
    );
    setTileValue(
      scope,
      "onlineAdminCount",
      stats ? formatNumber(stats.onlineAdminCount, config.locale) : "–"
    );
    setTileValue(
      scope,
      "onlinePublicCount",
      stats ? formatNumber(stats.onlinePublicCount, config.locale) : "–"
    );
    setTileValue(
      scope,
      "onlineApiCount",
      stats ? formatNumber(stats.onlineApiCount, config.locale) : "–"
    );
    const updatedEl = document.querySelector(
      '[data-role="realtime-updated-at"]'
    );
    if (updatedEl && stats) {
      updatedEl.textContent = formatDateTime(
        new Date(stats.lastUpdatedAt),
        config.locale
      );
    }
    setSectionState(
      "realtime",
      state === "ready" ? "ready" : state,
      state === "error" ? result.message : undefined
    );
  }

  async function loadSummary(): Promise<void> {
    const ranges: { range: string; scope: string }[] = [
      { range: "24h", scope: '[data-summary-range="24h"]' },
      { range: "7d", scope: '[data-summary-range="7d"]' },
      { range: "30d", scope: '[data-summary-range="30d"]' }
    ];

    const results = await Promise.all(
      ranges.map(({ range }) =>
        fetchJson<{
          humanUniqueVisitors: number;
          humanPageviews: number;
          botPageviews: number;
        }>(`/api/v1/analytics/summary?range=${range}`, strings)
      )
    );

    const outcomes = results.map((result, index) => {
      const scope = ranges[index]!.scope;
      const state = resolveSectionState(result.ok, result.data, isSummaryEmpty);

      setTileValue(
        scope,
        "humanUniqueVisitors",
        result.data
          ? formatNumber(result.data.humanUniqueVisitors, config.locale)
          : "–"
      );
      setTileValue(
        scope,
        "humanPageviews",
        result.data
          ? formatNumber(result.data.humanPageviews, config.locale)
          : "–"
      );

      return { state, message: result.message };
    });

    const summary = aggregateSummaryState(outcomes);
    setSectionState("summary", summary.state, summary.message);
  }

  async function loadPages(range: string): Promise<void> {
    const result = await fetchJson<{
      pages: { name: string; count: number }[];
    }>(`/api/v1/analytics/pages?range=${range}`, strings);
    const list = result.data?.pages ?? null;
    const state = resolveSectionState(result.ok, list, isNamedCountListEmpty);
    renderNamedCountTable("pages-table", state === "ready" ? list! : []);
    setSectionState(
      "pages",
      state,
      state === "error" ? result.message : undefined
    );
  }

  async function loadDevices(range: string): Promise<void> {
    const result = await fetchJson<{
      browsers: { name: string; count: number }[];
      devices: { name: string; count: number }[];
    }>(`/api/v1/analytics/devices?range=${range}`, strings);
    const data = result.data;
    const state = resolveSectionState(
      result.ok,
      data,
      (d) =>
        isNamedCountListEmpty(d.browsers) && isNamedCountListEmpty(d.devices)
    );
    renderNamedCountTable(
      "browsers-table",
      state === "ready" ? data!.browsers : []
    );
    renderNamedCountTable(
      "devices-table",
      state === "ready" ? data!.devices : []
    );
    setSectionState(
      "devices",
      state,
      state === "error" ? result.message : undefined
    );
  }

  async function loadLocations(range: string): Promise<void> {
    if (!config.geoActive) return;
    const result = await fetchJson<{
      countries: { name: string; count: number }[];
    }>(`/api/v1/analytics/locations?range=${range}`, strings);
    const list = result.data?.countries ?? null;
    const state = resolveSectionState(result.ok, list, isNamedCountListEmpty);
    renderNamedCountTable("locations-table", state === "ready" ? list! : []);
    setSectionState(
      "locations",
      state,
      state === "error" ? result.message : undefined
    );
  }

  async function loadSecurity(range: string): Promise<void> {
    const result = await fetchJson<{
      botPageviews: number;
      topBotReasons: { name: string; count: number }[];
      botPageviewsByArea: { name: string; count: number }[];
    }>(`/api/v1/analytics/security?range=${range}`, strings);
    const data = result.data;
    const state = resolveSectionState(result.ok, data, isSecurityViewEmpty);
    setTileValue(
      '[data-section="security"]',
      "botPageviews",
      data ? formatNumber(data.botPageviews, config.locale) : "–"
    );
    renderNamedCountTable(
      "bot-reasons-table",
      state === "ready" ? data!.topBotReasons : []
    );
    renderNamedCountTable(
      "bot-areas-table",
      state === "ready" ? data!.botPageviewsByArea : []
    );
    setSectionState(
      "security",
      state,
      state === "error" ? result.message : undefined
    );
  }

  async function loadRangeScopedSections(range: string): Promise<void> {
    await Promise.all([
      loadPages(range),
      loadDevices(range),
      loadLocations(range),
      loadSecurity(range)
    ]);
  }

  let sessionsRaw: SessionWithLastSeen[] = [];
  let sessionsNextCursor: string | null = null;

  function currentSessionFilters(): {
    area: AnalyticsAreaFilter;
    type: AnalyticsVisitorTypeFilter;
  } {
    const areaSelect = document.getElementById(
      "sessions-area-filter"
    ) as HTMLSelectElement | null;
    const typeSelect = document.getElementById(
      "sessions-type-filter"
    ) as HTMLSelectElement | null;
    return {
      area: (areaSelect?.value ?? "all") as AnalyticsAreaFilter,
      type: (typeSelect?.value ?? "all") as AnalyticsVisitorTypeFilter
    };
  }

  function renderSessionsTable(): void {
    const tbody = document.querySelector('[data-role="sessions-table"] tbody');
    if (!tbody) return;
    tbody.innerHTML = "";

    if (sessionsRaw.length === 0) {
      setSectionState("sessions", "empty", strings.sessionsEmpty);
      return;
    }

    const { area, type } = currentSessionFilters();
    const filtered = sessionsRaw.filter(
      (session) =>
        matchesAreaFilter(session.area, area) &&
        matchesVisitorTypeFilter(session.isHuman, type)
    );

    if (filtered.length === 0) {
      setSectionState("sessions", "empty", strings.sessionsFilteredEmpty);
      return;
    }

    setSectionState("sessions", "ready");

    for (const session of filtered) {
      const cells = buildSessionRowCells(session, {
        showRawDetailColumns: config.showRawDetailColumns,
        humanLabel: strings.humanLabel,
        botLabel: strings.botLabel
      });

      const values = [
        cells.area,
        cells.currentPath,
        cells.browser,
        cells.os,
        cells.device,
        cells.visitorType,
        cells.country,
        formatDateTime(new Date(session.lastSeenAt), config.locale)
      ];

      if (cells.raw) {
        values.push(
          cells.raw.ipAddress,
          cells.raw.ipHash,
          cells.raw.userAgentHash,
          cells.raw.loginIdentifier
        );
      }

      const tr = document.createElement("tr");
      for (const value of values) {
        const td = document.createElement("td");
        td.textContent = value;
        tr.append(td);
      }
      tbody.append(tr);
    }
  }

  async function loadSessionsPage(cursor: string | null): Promise<void> {
    if (!config.canViewSessions) return;
    const url = cursor
      ? `/api/v1/analytics/sessions?cursor=${encodeURIComponent(cursor)}`
      : "/api/v1/analytics/sessions";
    const result = await fetchJson<{
      sessions: SessionWithLastSeen[];
      nextCursor: string | null;
    }>(url, strings);

    const outcome = resolveSessionsOutcome(result);
    if (outcome.state === "error") {
      setSectionState("sessions", "error", outcome.message);
      return;
    }

    sessionsRaw = cursor
      ? sessionsRaw.concat(outcome.data.sessions)
      : outcome.data.sessions;
    sessionsNextCursor = outcome.data.nextCursor;

    const loadMoreButton = document.getElementById(
      "sessions-load-more-button"
    ) as HTMLButtonElement | null;
    if (loadMoreButton) loadMoreButton.hidden = !sessionsNextCursor;

    renderSessionsTable();
  }

  document
    .getElementById("realtime-refresh-button")
    ?.addEventListener("click", () => {
      void loadRealtime();
    });

  document
    .getElementById("range-select")
    ?.addEventListener("change", (event) => {
      const value = (event.target as HTMLSelectElement).value;
      void loadRangeScopedSections(value);
    });

  document
    .getElementById("sessions-area-filter")
    ?.addEventListener("change", renderSessionsTable);
  document
    .getElementById("sessions-type-filter")
    ?.addEventListener("change", renderSessionsTable);
  document
    .getElementById("sessions-load-more-button")
    ?.addEventListener("click", () => {
      if (sessionsNextCursor) void loadSessionsPage(sessionsNextCursor);
    });

  const initialRangeSelect = document.getElementById(
    "range-select"
  ) as HTMLSelectElement | null;
  const initialRange = initialRangeSelect?.value ?? "7d";

  void loadRealtime();
  void loadSummary();
  void loadRangeScopedSections(initialRange);
  void loadSessionsPage(null);
}
