import { useState, useEffect, type ReactNode } from "react";

interface PluginAPI {
  get(route: string): Promise<any>;
  post(route: string, body: unknown): Promise<any>;
}

function usePluginAPI(): PluginAPI {
  const pluginId = "awcms-micro";
  const baseUrl = `/_emdash/api/plugins/${pluginId}`;

  return {
    async get(route: string) {
      const res = await fetch(`${baseUrl}/${route}`, {
        headers: { "X-EmDash-Request": "1" },
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      return data.data ?? data;
    },
    async post(route: string, body: unknown) {
      const res = await fetch(`${baseUrl}/${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-EmDash-Request": "1" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      return data.data ?? data;
    },
  };
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ border: "1px solid #e5e5e5", borderRadius: 8, padding: "1rem", marginBottom: "1rem" }}>
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
      {children}
    </div>
  );
}

function Loading() {
  return <p>Loading...</p>;
}

function Alert({ type, message }: { type: string; message: string }) {
  const bg = type === "success" ? "#d4edda" : "#f8d7da";
  const color = type === "success" ? "#155724" : "#721c24";
  return <div style={{ background: bg, color, padding: "0.75rem", borderRadius: 4, marginBottom: "1rem" }}>{message}</div>;
}

export { usePluginAPI, Card, Loading, Alert };
