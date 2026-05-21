import { useState, useEffect } from "react";
import { usePluginAPI, Card, Loading } from "./ui";

interface AnalyticsEntry {
  date: string;
  type: string;
  count: number;
}

export function AnalyticsPage() {
  const api = usePluginAPI();
  const [data, setData] = useState<AnalyticsEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("analytics/summary").then((result) => {
      setData(result.daily ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1>Analytics</h1>
      <Card title="Last 7 Days">
        {data.length === 0 ? (
          <p>No analytics data yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Date</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Event Type</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Count</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, i) => (
                <tr key={i}>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{entry.date}</td>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{entry.type}</td>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{entry.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
