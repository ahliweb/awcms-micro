-- AWCMS-Micro SIKESRA migration 0004
-- Creates module-specific registry detail tables for all eight SIKESRA modules.
-- Forward-only and idempotent. Do not add destructive SQL to this file.

CREATE TABLE IF NOT EXISTS sikesra_rumah_ibadah_details (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	registry_entity_id TEXT NOT NULL,
	detail_json TEXT NOT NULL DEFAULT '{}',
	field_standard_version TEXT NOT NULL DEFAULT 'draft',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, registry_entity_id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_rumah_ibadah_details_deleted
	ON sikesra_rumah_ibadah_details (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_lembaga_keagamaan_details (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	registry_entity_id TEXT NOT NULL,
	detail_json TEXT NOT NULL DEFAULT '{}',
	field_standard_version TEXT NOT NULL DEFAULT 'draft',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, registry_entity_id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_lembaga_keagamaan_details_deleted
	ON sikesra_lembaga_keagamaan_details (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_pendidikan_keagamaan_details (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	registry_entity_id TEXT NOT NULL,
	detail_json TEXT NOT NULL DEFAULT '{}',
	field_standard_version TEXT NOT NULL DEFAULT 'draft',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, registry_entity_id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_pendidikan_keagamaan_details_deleted
	ON sikesra_pendidikan_keagamaan_details (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_lks_details (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	registry_entity_id TEXT NOT NULL,
	detail_json TEXT NOT NULL DEFAULT '{}',
	field_standard_version TEXT NOT NULL DEFAULT 'draft',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, registry_entity_id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_lks_details_deleted
	ON sikesra_lks_details (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_guru_agama_details (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	registry_entity_id TEXT NOT NULL,
	person_profile_id TEXT,
	detail_json TEXT NOT NULL DEFAULT '{}',
	field_standard_version TEXT NOT NULL DEFAULT 'draft',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, registry_entity_id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_guru_agama_details_person
	ON sikesra_guru_agama_details (tenant_id, site_id, person_profile_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_guru_agama_details_deleted
	ON sikesra_guru_agama_details (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_anak_yatim_details (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	registry_entity_id TEXT NOT NULL,
	person_profile_id TEXT,
	detail_json TEXT NOT NULL DEFAULT '{}',
	field_standard_version TEXT NOT NULL DEFAULT 'draft',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, registry_entity_id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_anak_yatim_details_person
	ON sikesra_anak_yatim_details (tenant_id, site_id, person_profile_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_anak_yatim_details_deleted
	ON sikesra_anak_yatim_details (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_disabilitas_details (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	registry_entity_id TEXT NOT NULL,
	person_profile_id TEXT,
	detail_json TEXT NOT NULL DEFAULT '{}',
	field_standard_version TEXT NOT NULL DEFAULT 'draft',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, registry_entity_id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_disabilitas_details_person
	ON sikesra_disabilitas_details (tenant_id, site_id, person_profile_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_disabilitas_details_deleted
	ON sikesra_disabilitas_details (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_lansia_terlantar_details (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	registry_entity_id TEXT NOT NULL,
	person_profile_id TEXT,
	detail_json TEXT NOT NULL DEFAULT '{}',
	field_standard_version TEXT NOT NULL DEFAULT 'draft',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, registry_entity_id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_lansia_terlantar_details_person
	ON sikesra_lansia_terlantar_details (tenant_id, site_id, person_profile_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_lansia_terlantar_details_deleted
	ON sikesra_lansia_terlantar_details (deleted_at);
