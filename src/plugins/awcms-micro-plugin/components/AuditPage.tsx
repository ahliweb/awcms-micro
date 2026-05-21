import { useState, useEffect } from "react";
import { usePluginAPI, Card, Loading } from "./ui";

interface AuditEntry {
  id: string;
  type: string;
  collection?: string;
  resourceId?: string;
  message: string;
  timestamp: string;
}

export function AuditPage() {
  const api = usePluginAPI();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("activity/list?limit=20").then((data) => {
      setEntries((data.items as AuditEntry[]) ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1>Activity Log</h1>
      <Card title="Recent Activity">
        {entries.length === 0 ? (
          <p>No audit entries yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Type</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Message</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Resource</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{entry.type}</td>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{entry.message}</td>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{entry.collection ? `${entry.collection}/${entry.resourceId ?? "-"}` : entry.resourceId ?? "-"}</td>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{new Date(entry.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
