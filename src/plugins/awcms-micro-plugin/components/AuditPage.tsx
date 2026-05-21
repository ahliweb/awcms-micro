import { useState, useEffect } from "react";
import { usePluginAPI, Card, Loading } from "./ui";

interface AuditEntry {
  id: string;
  action: string;
  collection: string;
  contentId: string;
  timestamp: string;
  userId: string;
}

export function AuditPage() {
  const api = usePluginAPI();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("audit/recent").then((data) => {
      setEntries(data.entries ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1>Audit Log</h1>
      <Card title="Recent Activity">
        {entries.length === 0 ? (
          <p>No audit entries yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Action</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Collection</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Content ID</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{entry.action}</td>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{entry.collection}</td>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{entry.contentId}</td>
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
