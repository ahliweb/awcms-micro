import { useState, useEffect } from "react";
import { usePluginAPI, Card, Loading } from "./ui";

interface StatsData {
  auditCount: number;
  analyticsCount: number;
  todayActions: number;
  pluginVersion: string;
}

export function DashboardPage() {
  const api = usePluginAPI();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("stats").then((data: StatsData) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1>AWCMS Micro Dashboard</h1>
      <Card title="Overview">
        <div style={{ display: "flex", gap: "2rem" }}>
          <div><strong>{stats?.auditCount ?? 0}</strong><br />Audit Entries</div>
          <div><strong>{stats?.todayActions ?? 0}</strong><br />Today's Actions</div>
          <div><strong>{stats?.analyticsCount ?? 0}</strong><br />Analytics Events</div>
        </div>
      </Card>
      <Card title="Plugin Info">
        <p>Version: {stats?.pluginVersion}</p>
      </Card>
    </div>
  );
}
