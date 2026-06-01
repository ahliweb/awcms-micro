-- AWCMS-Micro SIKESRA migration 0005
-- Creates document metadata and file-object tables for R2-compatible storage.
-- Forward-only and idempotent. Do not add destructive SQL to this file.

CREATE TABLE IF NOT EXISTS sikesra_file_objects (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	storage_provider TEXT NOT NULL DEFAULT 'r2',
	storage_bucket TEXT,
	storage_key TEXT NOT NULL,
	original_filename TEXT NOT NULL,
	safe_filename TEXT NOT NULL,
	content_type TEXT NOT NULL,
	file_extension TEXT,
	file_size_bytes INTEGER NOT NULL DEFAULT 0,
	checksum_sha256 TEXT,
	classification TEXT NOT NULL DEFAULT 'restricted',
	validation_status TEXT NOT NULL DEFAULT 'pending',
	validation_notes TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_file_objects_classification
	ON sikesra_file_objects (tenant_id, site_id, classification, validation_status);

CREATE INDEX IF NOT EXISTS idx_sikesra_file_objects_checksum
	ON sikesra_file_objects (tenant_id, site_id, checksum_sha256);

CREATE INDEX IF NOT EXISTS idx_sikesra_file_objects_deleted
	ON sikesra_file_objects (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_supporting_documents (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	registry_entity_id TEXT NOT NULL,
	file_object_id TEXT NOT NULL,
	document_type TEXT NOT NULL,
	title TEXT NOT NULL,
	classification TEXT NOT NULL DEFAULT 'restricted',
	validation_status TEXT NOT NULL DEFAULT 'pending',
	verification_stage TEXT NOT NULL DEFAULT 'draft',
	issuer TEXT,
	issued_at TEXT,
	expires_at TEXT,
	access_policy TEXT NOT NULL DEFAULT 'rbac_abac_required',
	metadata_json TEXT NOT NULL DEFAULT '{}',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_supporting_documents_entity
	ON sikesra_supporting_documents (tenant_id, site_id, registry_entity_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_supporting_documents_file
	ON sikesra_supporting_documents (tenant_id, site_id, file_object_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_supporting_documents_type_status
	ON sikesra_supporting_documents (tenant_id, site_id, document_type, validation_status);

CREATE INDEX IF NOT EXISTS idx_sikesra_supporting_documents_classification
	ON sikesra_supporting_documents (tenant_id, site_id, classification);

CREATE INDEX IF NOT EXISTS idx_sikesra_supporting_documents_deleted
	ON sikesra_supporting_documents (deleted_at);
