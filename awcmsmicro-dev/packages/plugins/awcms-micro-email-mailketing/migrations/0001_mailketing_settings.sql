-- AWCMS-Micro Email Mailketing migration 0001
-- Creates settings, send-log, and plugin state tables.
-- Forward-only and idempotent. Do not add destructive SQL to this file.

CREATE TABLE IF NOT EXISTS mailketing_settings (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	key TEXT NOT NULL,
	value_json TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, key)
);

CREATE INDEX IF NOT EXISTS idx_mailketing_settings_tenant_site
	ON mailketing_settings (tenant_id, site_id, updated_at);

CREATE INDEX IF NOT EXISTS idx_mailketing_settings_deleted
	ON mailketing_settings (deleted_at);

CREATE TABLE IF NOT EXISTS mailketing_plugin_state (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	key TEXT NOT NULL,
	value_json TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	PRIMARY KEY (tenant_id, site_id, key)
);
