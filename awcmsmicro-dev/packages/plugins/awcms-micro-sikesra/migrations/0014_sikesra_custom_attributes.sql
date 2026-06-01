-- AWCMS-Micro SIKESRA migration 0014
-- Creates dynamic custom attribute definition, value, and change event tables.
-- Forward-only and idempotent. Do not add destructive SQL to this file.

CREATE TABLE IF NOT EXISTS sikesra_custom_attribute_definitions (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	attribute_key TEXT NOT NULL,
	label TEXT NOT NULL,
	description TEXT,
	scope_type TEXT NOT NULL DEFAULT 'global',
	scope_value TEXT,
	entity_type TEXT,
	subtype_code TEXT,
	target_registry_entity_id TEXT,
	target_sikesra_id_20 TEXT,
	field_group TEXT,
	data_class TEXT NOT NULL DEFAULT 'non_personal',
	data_type TEXT NOT NULL DEFAULT 'string',
	required INTEGER NOT NULL DEFAULT 0,
	default_value_json TEXT NOT NULL DEFAULT 'null',
	enum_values_json TEXT NOT NULL DEFAULT '[]',
	validation_rules_json TEXT NOT NULL DEFAULT '{}',
	placeholder TEXT,
	help_text TEXT,
	sort_order INTEGER NOT NULL DEFAULT 0,
	is_active INTEGER NOT NULL DEFAULT 1,
	is_system INTEGER NOT NULL DEFAULT 0,
	is_searchable INTEGER NOT NULL DEFAULT 0,
	is_filterable INTEGER NOT NULL DEFAULT 0,
	is_importable INTEGER NOT NULL DEFAULT 0,
	is_exportable INTEGER NOT NULL DEFAULT 0,
	public_safe INTEGER NOT NULL DEFAULT 0,
	mask_by_default INTEGER NOT NULL DEFAULT 1,
	valid_from TEXT,
	valid_until TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_custom_attribute_definitions_scope
	ON sikesra_custom_attribute_definitions (tenant_id, site_id, scope_type, scope_value, is_active);

CREATE INDEX IF NOT EXISTS idx_sikesra_custom_attribute_definitions_key
	ON sikesra_custom_attribute_definitions (tenant_id, site_id, attribute_key, entity_type, subtype_code);

CREATE INDEX IF NOT EXISTS idx_sikesra_custom_attribute_definitions_deleted
	ON sikesra_custom_attribute_definitions (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_custom_attribute_values (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	attribute_definition_id TEXT NOT NULL,
	registry_entity_id TEXT,
	sikesra_id_20 TEXT,
	value_text TEXT,
	value_number REAL,
	value_boolean INTEGER,
	value_date TEXT,
	value_datetime TEXT,
	value_json TEXT,
	value_hash TEXT,
	value_display TEXT,
	sensitivity TEXT NOT NULL DEFAULT 'non_personal',
	is_current INTEGER NOT NULL DEFAULT 1,
	version INTEGER NOT NULL DEFAULT 1,
	source TEXT NOT NULL DEFAULT 'manual',
	verification_stage TEXT,
	verified_at TEXT,
	verified_by TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_custom_attribute_values_definition
	ON sikesra_custom_attribute_values (tenant_id, site_id, attribute_definition_id, is_current);

CREATE INDEX IF NOT EXISTS idx_sikesra_custom_attribute_values_registry_entity
	ON sikesra_custom_attribute_values (tenant_id, site_id, registry_entity_id, is_current);

CREATE INDEX IF NOT EXISTS idx_sikesra_custom_attribute_values_sikesra_id
	ON sikesra_custom_attribute_values (tenant_id, site_id, sikesra_id_20, is_current);

CREATE INDEX IF NOT EXISTS idx_sikesra_custom_attribute_values_deleted
	ON sikesra_custom_attribute_values (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_custom_attribute_change_events (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	event_type TEXT NOT NULL,
	definition_id TEXT,
	value_id TEXT,
	actor_user_id TEXT,
	summary TEXT NOT NULL,
	metadata_json TEXT NOT NULL DEFAULT '{}',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_custom_attribute_change_events_definition
	ON sikesra_custom_attribute_change_events (tenant_id, site_id, definition_id, created_at);

CREATE INDEX IF NOT EXISTS idx_sikesra_custom_attribute_change_events_value
	ON sikesra_custom_attribute_change_events (tenant_id, site_id, value_id, created_at);

CREATE INDEX IF NOT EXISTS idx_sikesra_custom_attribute_change_events_deleted
	ON sikesra_custom_attribute_change_events (deleted_at);
