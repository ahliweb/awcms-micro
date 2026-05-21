import { useState, useEffect } from "react";
import { usePluginAPI } from "./ui";

export function QuickStatsWidget() {
  const api = usePluginAPI();
  const [stats, setStats] = useState({ analyticsCount: 0, commentsCount: 0, pluginVersion: "" });

  useEffect(() => {
    api.get("overview").then((data) => {
      setStats({
        analyticsCount: data.analyticsCount ?? 0,
        commentsCount: data.commentsCount ?? 0,
        pluginVersion: data.version ?? "",
      });
    });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "0.5rem" }}><strong>{stats.analyticsCount}</strong><br /><small>Analytics Events</small></div>
      <div style={{ marginBottom: "0.5rem" }}><strong>{stats.commentsCount}</strong><br /><small>Comment Logs</small></div>
      <div><strong>{stats.pluginVersion}</strong><br /><small>Plugin Version</small></div>
    </div>
  );
}
