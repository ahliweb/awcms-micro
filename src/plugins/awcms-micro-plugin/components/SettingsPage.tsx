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
          <label style={{ display: "block", marginBottom: "0.25rem" }}>Webhook URL</label>
          <input
            type="url"
            value={(settings.webhookUrl as string) ?? ""}
            onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #e5e5e5", borderRadius: 4 }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>Notification Email</label>
          <input
            type="email"
            value={(settings.notificationEmail as string) ?? ""}
            onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #e5e5e5", borderRadius: 4 }}
          />
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
