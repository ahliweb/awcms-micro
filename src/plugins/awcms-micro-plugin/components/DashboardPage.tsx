import { useState, useEffect } from "react";
import { usePluginAPI, Card, Loading } from "./ui";

interface OverviewData {
  pluginId: string;
  version: string;
  auditCount: number;
  analyticsCount: number;
  notificationsCount: number;
  commentsCount: number;
  scheduledTasks: Array<{ name: string; schedule: string }>;
}

export function DashboardPage() {
  const api = usePluginAPI();
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [network, setNetwork] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("overview"), api.get("network/ping")]).then(([overviewData, networkData]) => {
      setOverview(overviewData as OverviewData);
      setNetwork(networkData as Record<string, unknown>);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1>AWCMS-Micro Plugin Overview</h1>
      <Card title="Overview">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1rem" }}>
          <div><strong>{overview?.auditCount ?? 0}</strong><br />Audit entries</div>
          <div><strong>{overview?.analyticsCount ?? 0}</strong><br />Analytics events</div>
          <div><strong>{overview?.notificationsCount ?? 0}</strong><br />Notifications</div>
          <div><strong>{overview?.commentsCount ?? 0}</strong><br />Comment logs</div>
        </div>
      </Card>
      <Card title="Plugin Info">
        <p><strong>ID:</strong> {overview?.pluginId}</p>
        <p><strong>Version:</strong> {overview?.version}</p>
        <p><strong>Scheduled tasks:</strong> {overview?.scheduledTasks.map((task) => task.name).join(", ") || "None"}</p>
      </Card>
      <Card title="Network Capability Example">
        {network?.ok ? (
          <p>
            Upstream repo: <strong>{String(network.repo ?? "emdash-cms/emdash")}</strong>
          </p>
        ) : (
          <p>Unable to reach the GitHub API from the plugin runtime.</p>
        )}
      </Card>
    </div>
  );
}
