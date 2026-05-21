import { useState, useEffect } from "react";
import { usePluginAPI } from "./ui";

interface RecentPost {
  id: string;
  title: string;
  createdAt: string;
}

export function RecentContentWidget() {
  const api = usePluginAPI();
  const [posts, setPosts] = useState<RecentPost[]>([]);

  useEffect(() => {
    api.get("content/activity").then((data) => {
      setPosts(data.recentPosts ?? []);
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
              <small style={{ color: "#666" }}>{new Date(post.createdAt).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
