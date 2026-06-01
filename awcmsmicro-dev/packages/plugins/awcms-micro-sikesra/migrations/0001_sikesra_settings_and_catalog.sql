-- AWCMS-Micro SIKESRA migration 0001
-- Creates the settings and data-type catalog foundation.
-- Forward-only and idempotent. Do not add destructive SQL to this file.

CREATE TABLE IF NOT EXISTS sikesra_settings (
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

CREATE INDEX IF NOT EXISTS idx_sikesra_settings_tenant_site_updated
	ON sikesra_settings (tenant_id, site_id, updated_at);

CREATE INDEX IF NOT EXISTS idx_sikesra_settings_deleted
	ON sikesra_settings (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_data_types (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	code TEXT NOT NULL,
	label TEXT NOT NULL,
	description TEXT,
	status TEXT NOT NULL DEFAULT 'active',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id),
	UNIQUE (tenant_id, site_id, code)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_data_types_tenant_site_status
	ON sikesra_data_types (tenant_id, site_id, status);

CREATE INDEX IF NOT EXISTS idx_sikesra_data_types_deleted
	ON sikesra_data_types (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_data_subtypes (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	data_type_id TEXT NOT NULL,
	code TEXT NOT NULL,
	label TEXT NOT NULL,
	description TEXT,
	status TEXT NOT NULL DEFAULT 'active',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, data_type_id, code)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_data_subtypes_type_status
	ON sikesra_data_subtypes (tenant_id, site_id, data_type_id, status);

CREATE INDEX IF NOT EXISTS idx_sikesra_data_subtypes_deleted
	ON sikesra_data_subtypes (deleted_at);
