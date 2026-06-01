-- AWCMS-Micro SIKESRA migration 0007
-- Creates staged import tables for CSV/XLSX mapping, validation, and promotion.
-- Forward-only and idempotent. Do not add destructive SQL to this file.

CREATE TABLE IF NOT EXISTS sikesra_import_mapping_templates (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	name TEXT NOT NULL,
	entity_type TEXT NOT NULL,
	subtype_code TEXT,
	file_format TEXT NOT NULL DEFAULT 'xlsx',
	mapping_json TEXT NOT NULL DEFAULT '{}',
	status TEXT NOT NULL DEFAULT 'active',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_import_mapping_templates_type
	ON sikesra_import_mapping_templates (tenant_id, site_id, entity_type, subtype_code);

CREATE INDEX IF NOT EXISTS idx_sikesra_import_mapping_templates_deleted
	ON sikesra_import_mapping_templates (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_import_batches (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	mapping_template_id TEXT,
	entity_type TEXT NOT NULL,
	subtype_code TEXT,
	file_object_id TEXT,
	status TEXT NOT NULL DEFAULT 'staged',
	total_rows INTEGER NOT NULL DEFAULT 0,
	valid_rows INTEGER NOT NULL DEFAULT 0,
	invalid_rows INTEGER NOT NULL DEFAULT 0,
	duplicate_risk_rows INTEGER NOT NULL DEFAULT 0,
	promoted_rows INTEGER NOT NULL DEFAULT 0,
	source_filename TEXT,
	error_summary_json TEXT NOT NULL DEFAULT '{}',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_import_batches_status
	ON sikesra_import_batches (tenant_id, site_id, status, entity_type);

CREATE INDEX IF NOT EXISTS idx_sikesra_import_batches_template
	ON sikesra_import_batches (tenant_id, site_id, mapping_template_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_import_batches_deleted
	ON sikesra_import_batches (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_import_staging_rows (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	batch_id TEXT NOT NULL,
	row_number INTEGER NOT NULL,
	entity_type TEXT NOT NULL,
	subtype_code TEXT,
	raw_row_json TEXT NOT NULL DEFAULT '{}',
	mapped_row_json TEXT NOT NULL DEFAULT '{}',
	validation_status TEXT NOT NULL DEFAULT 'pending',
	validation_errors_json TEXT NOT NULL DEFAULT '[]',
	duplicate_status TEXT NOT NULL DEFAULT 'unchecked',
	promotion_status TEXT NOT NULL DEFAULT 'not_promoted',
	promoted_registry_entity_id TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_import_staging_rows_batch
	ON sikesra_import_staging_rows (tenant_id, site_id, batch_id, row_number);

CREATE INDEX IF NOT EXISTS idx_sikesra_import_staging_rows_validation
	ON sikesra_import_staging_rows (tenant_id, site_id, validation_status, promotion_status);

CREATE INDEX IF NOT EXISTS idx_sikesra_import_staging_rows_duplicate
	ON sikesra_import_staging_rows (tenant_id, site_id, duplicate_status);

CREATE INDEX IF NOT EXISTS idx_sikesra_import_staging_rows_deleted
	ON sikesra_import_staging_rows (deleted_at);
