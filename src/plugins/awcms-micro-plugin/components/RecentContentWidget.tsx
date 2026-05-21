import { useState, useEffect } from "react";
import { usePluginAPI } from "./ui";

interface RecentPost {
  id: string;
  title: string;
  status: string;
}

export function RecentContentWidget() {
  const api = usePluginAPI();
  const [posts, setPosts] = useState<RecentPost[]>([]);

  useEffect(() => {
    api.get("content/recent").then((data) => {
      setPosts((data.items as RecentPost[]) ?? []);
    });
  }, []);

  return (
    <div>
      {posts.length === 0 ? (
        <p style={{ color: "#666", fontSize: "0.875rem" }}>No recent posts</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: "0.5rem" }}>
              <div style={{ fontWeight: 500 }}>{post.title}</div>
              <small style={{ color: "#666" }}>{post.status}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
