import { DashboardPage } from "./components/DashboardPage";
import { AuditPage } from "./components/AuditPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { SettingsPage } from "./components/SettingsPage";
import { ActivitySummaryWidget } from "./components/ActivitySummaryWidget";
import { QuickStatsWidget } from "./components/QuickStatsWidget";
import { RecentContentWidget } from "./components/RecentContentWidget";

export const pages = {
  "/": DashboardPage,
  "/activity": AuditPage,
  "/comments": AnalyticsPage,
  "/settings": SettingsPage,
};

export const widgets = {
  "activity-summary": ActivitySummaryWidget,
  "quick-stats": QuickStatsWidget,
  "recent-content": RecentContentWidget,
};
