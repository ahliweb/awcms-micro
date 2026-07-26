/**
 * SSR page model for the visitor-analytics dashboard (`/admin/analytics`)
 * — presentation layer per ADR-0038, extracted from that page's frontmatter
 * by Issue #372.
 *
 * This page adds no endpoint, no permission, and never queries
 * `awcms_micro_visitor_sessions`/`awcms_micro_visit_events` directly. Every
 * number and table on it comes from a real client-side `fetch` to the
 * already-shipped `GET /api/v1/analytics/*` endpoints (Issue #621), which
 * is why this module computes no data at all — only the permission flags
 * and config the client script needs to know before its first request.
 * Server-side ABAC (`authorizeInTransaction`) remains the only real
 * enforcement point; every flag below is a UI-only convenience layer that
 * can be MORE restrictive than the API, never less.
 *
 * Raw-detail gating (`visitor_analytics.raw_detail.read`, separate from
 * `dashboard.read`) is NOT re-derived here. `GET /api/v1/analytics/sessions`
 * already returns `ipAddress`/`ipHash`/`userAgentHash`/
 * `loginIdentifierSnapshot` as `null` for a caller without that permission
 * (`domain/analytics-response-shaping.ts`). `showRawDetailColumns` only
 * decides whether the four raw-detail *columns* are rendered at all — a
 * presentation nicety that avoids a wall of dashes, not a second security
 * decision; see `domain/dashboard-view.ts`'s own header for why it cannot
 * leak.
 *
 * Geolocation gate: the Location section is hidden behind a safe "disabled"
 * notice decided from `resolveVisitorAnalyticsConfig()` (Issue #617,
 * env-only, no I/O) — the exact same double gate `domain/geo-enrichment.ts`
 * enforces (`VISITOR_ANALYTICS_GEO_ENABLED` AND
 * `VISITOR_ANALYTICS_TRUST_CLOUDFLARE`). Reading env-derived config is not a
 * database access and not a copy of a security decision: it only decides
 * whether the page bothers to fetch a section that would always come back
 * empty.
 *
 * Filter scope: only `range` (`24h|7d|30d|12m`) is a real query parameter
 * the API accepts. `area`/"visitor type" have no server-side equivalent on
 * any aggregate endpoint, so both narrow the active-sessions table's
 * already-fetched rows client-side (`matchesAreaFilter`/
 * `matchesVisitorTypeFilter`). The three fixed "human visitors" cards
 * (24h/7d/30d) are independent of the range selector.
 */
import { buildClientErrorMessages } from "../../../lib/i18n/error-messages";
import type { Translator } from "../../../lib/i18n/translate";
import type { SupportedLocale } from "../../../lib/i18n/locale";
import type { SsrContext } from "../../../lib/auth/ssr-session";
import { permissionKey } from "../../identity-access/domain/access-control";
import { resolveVisitorAnalyticsConfig } from "../domain/visitor-analytics-config";
import type {
  AnalyticsPageConfig,
  AnalyticsStrings
} from "./analytics-dashboard-client";

export interface AnalyticsPageModel {
  canViewDashboard: boolean;
  canViewRealtime: boolean;
  canViewSessions: boolean;
  canViewRawDetail: boolean;
  geoActive: boolean;
  /** Handed to the browser verbatim via `<ClientJsonData>`. */
  pageConfig: AnalyticsPageConfig;
}

export function resolveAnalyticsPageModel(
  context: SsrContext,
  locale: SupportedLocale
): AnalyticsPageModel {
  const canViewDashboard = context.permissions.has(
    permissionKey("visitor_analytics", "dashboard", "read")
  );
  const canViewRealtime = context.permissions.has(
    permissionKey("visitor_analytics", "realtime", "read")
  );
  const canViewSessions = context.permissions.has(
    permissionKey("visitor_analytics", "sessions", "read")
  );
  const canViewRawDetail = context.permissions.has(
    permissionKey("visitor_analytics", "raw_detail", "read")
  );

  const config = resolveVisitorAnalyticsConfig();
  const geoActive = config.geoEnabled && config.trustCloudflare;

  return {
    canViewDashboard,
    canViewRealtime,
    canViewSessions,
    canViewRawDetail,
    geoActive,
    pageConfig: {
      canViewRealtime,
      canViewSessions,
      showRawDetailColumns: canViewRawDetail,
      geoActive,
      locale
    }
  };
}

/** See `access-users-page-data.ts` for why the strings blob is typed by the
 *  client module's own interface. */
export function buildAnalyticsClientStrings(t: Translator): AnalyticsStrings {
  return {
    networkError: t("common.network_error"),
    errorMessages: buildClientErrorMessages(t),
    humanLabel: t("admin.analytics.sessions_value_human"),
    botLabel: t("admin.analytics.sessions_value_bot"),
    stateLoading: t("admin.analytics.state_loading"),
    stateEmptyGeneric: t("admin.analytics.state_empty_generic"),
    stateErrorGeneric: t("admin.analytics.state_error_generic"),
    sessionsEmpty: t("admin.analytics.sessions_empty"),
    sessionsFilteredEmpty: t("admin.analytics.sessions_filtered_empty")
  };
}

/** Range selector options — the only filter the API actually accepts. */
export function buildRangeOptions(
  t: Translator
): { value: string; label: string }[] {
  return [
    { value: "24h", label: t("admin.analytics.range_24h") },
    { value: "7d", label: t("admin.analytics.range_7d") },
    { value: "30d", label: t("admin.analytics.range_30d") },
    { value: "12m", label: t("admin.analytics.range_12m") }
  ];
}

/** Client-side-only narrowing of the already-fetched sessions rows. */
export function buildSessionAreaOptions(
  t: Translator
): { value: string; label: string }[] {
  return [
    { value: "all", label: t("admin.analytics.sessions_filter_all") },
    { value: "admin", label: t("admin.analytics.sessions_filter_admin") },
    { value: "public", label: t("admin.analytics.sessions_filter_public") },
    { value: "api", label: t("admin.analytics.sessions_filter_api") }
  ];
}

export function buildSessionTypeOptions(
  t: Translator
): { value: string; label: string }[] {
  return [
    { value: "all", label: t("admin.analytics.sessions_filter_all") },
    { value: "human", label: t("admin.analytics.sessions_filter_human") },
    { value: "bot", label: t("admin.analytics.sessions_filter_bot") }
  ];
}
