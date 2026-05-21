import { useState, useEffect } from "react";
import { usePluginAPI } from "./ui";

export function ActivitySummaryWidget() {
  const api = usePluginAPI();
  const [stats, setStats] = useState({ auditCount: 0, notificationsCount: 0 });

  useEffect(() => {
    api.get("overview").then((data) => {
      setStats({
        auditCount: data.auditCount ?? 0,
        notificationsCount: data.notificationsCount ?? 0,
      });
    });
  }, []);

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div><strong>{stats.auditCount}</strong><br /><small>Audit</small></div>
        <div><strong>{stats.notificationsCount}</strong><br /><small>Unread</small></div>
      </div>
    </div>
  );
}
