import { useState, useEffect } from "react";
import { usePluginAPI, Card, Loading } from "./ui";

interface CommentEntry {
  id: string;
  status: string;
  collection: string;
  contentId: string;
  authorName: string;
  reason?: string;
}

export function AnalyticsPage() {
  const api = usePluginAPI();
  const [data, setData] = useState<CommentEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("comments/list").then((result) => {
      setData((result.items as CommentEntry[]) ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1>Comment Hooks</h1>
      <Card title="Recent Comment Events">
        {data.length === 0 ? (
          <p>No comment activity yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Author</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Status</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Content</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry) => (
                <tr key={entry.id}>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{entry.authorName}</td>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{entry.status}</td>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{entry.collection}/{entry.contentId}</td>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #f0f0f0" }}>{entry.reason ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
