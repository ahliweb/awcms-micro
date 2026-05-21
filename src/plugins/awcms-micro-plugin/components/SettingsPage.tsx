import { useState, useEffect } from "react";
import { usePluginAPI, Card, Loading, Alert } from "./ui";

export function SettingsPage() {
  const api = usePluginAPI();
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("settings").then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await api.post("settings/save", settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1>Plugin Settings</h1>
      {saved && <Alert type="success" message="Settings saved successfully" />}
      <Card title="General">
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={(settings.enabled as boolean) ?? true}
              onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
            />
            Enabled
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={(settings.analyticsEnabled as boolean) ?? false}
              onChange={(e) => setSettings({ ...settings, analyticsEnabled: e.target.checked })}
            />
            Analytics Enabled
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>Max Audit Entries</label>
          <input
            type="number"
            min={25}
            max={1000}
            value={Number(settings.maxAuditEntries ?? 150)}
            onChange={(e) => setSettings({ ...settings, maxAuditEntries: Number(e.target.value) })}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #e5e5e5", borderRadius: 4 }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>Notification Email</label>
          <input
            type="email"
            value={(settings.notifyEmail as string) ?? ""}
            onChange={(e) => setSettings({ ...settings, notifyEmail: e.target.value })}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #e5e5e5", borderRadius: 4 }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>Reference URL</label>
          <input
            type="url"
            value={(settings.docsUrl as string) ?? "https://docs.emdashcms.com"}
            onChange={(e) => setSettings({ ...settings, docsUrl: e.target.value })}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #e5e5e5", borderRadius: 4 }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>Theme</label>
          <select
            value={(settings.theme as string) ?? "system"}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #e5e5e5", borderRadius: 4 }}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ padding: "0.5rem 1rem", background: "#0066cc", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </Card>
    </div>
  );
}
