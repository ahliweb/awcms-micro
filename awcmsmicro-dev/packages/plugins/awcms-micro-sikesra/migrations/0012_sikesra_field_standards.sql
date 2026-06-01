-- AWCMS-Micro SIKESRA migration 0012
-- Creates the field-standard metadata registry for the eight SIKESRA modules.
-- Forward-only and idempotent. Do not add destructive SQL to this file.

CREATE TABLE IF NOT EXISTS sikesra_field_standards (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	module TEXT NOT NULL,
	field_key TEXT NOT NULL,
	label TEXT NOT NULL,
	field_group TEXT NOT NULL,
	data_class TEXT NOT NULL,
	required INTEGER NOT NULL DEFAULT 0,
	data_type TEXT NOT NULL,
	max_length INTEGER,
	enum_values_json TEXT,
	storage_table TEXT NOT NULL,
	importable INTEGER NOT NULL DEFAULT 0,
	exportable INTEGER NOT NULL DEFAULT 0,
	public_safe INTEGER NOT NULL DEFAULT 0,
	mask_by_default INTEGER NOT NULL DEFAULT 1,
	validation_rules_json TEXT NOT NULL DEFAULT '[]',
	notes TEXT,
	version TEXT NOT NULL DEFAULT 'draft',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, module, field_key)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_field_standards_module
	ON sikesra_field_standards (tenant_id, site_id, module, field_group);

CREATE INDEX IF NOT EXISTS idx_sikesra_field_standards_data_class
	ON sikesra_field_standards (tenant_id, site_id, data_class);

CREATE INDEX IF NOT EXISTS idx_sikesra_field_standards_storage_table
	ON sikesra_field_standards (tenant_id, site_id, storage_table);

CREATE INDEX IF NOT EXISTS idx_sikesra_field_standards_deleted
	ON sikesra_field_standards (deleted_at);
