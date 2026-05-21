import { useState, useEffect } from "react";
import { usePluginAPI } from "./ui";

export function ActivitySummaryWidget() {
  const api = usePluginAPI();
  const [stats, setStats] = useState({ todayActions: 0, auditCount: 0 });

  useEffect(() => {
    api.get("stats").then((data) => {
      setStats({
        todayActions: data.todayActions ?? 0,
        auditCount: data.auditCount ?? 0,
      });
    });
  }, []);

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div><strong>{stats.todayActions}</strong><br /><small>Today</small></div>
        <div><strong>{stats.auditCount}</strong><br /><small>Total</small></div>
      </div>
    </div>
  );
}
