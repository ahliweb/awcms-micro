-- AWCMS-Micro SIKESRA migration 0003
-- Creates core registry, person profile, entity-person link, and code sequence tables.
-- Forward-only and idempotent. Do not add destructive SQL to this file.

CREATE TABLE IF NOT EXISTS sikesra_registry_entities (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	sikesra_id_20 TEXT,
	code TEXT NOT NULL,
	label TEXT NOT NULL,
	entity_type TEXT NOT NULL,
	subtype_code TEXT,
	sensitivity TEXT NOT NULL DEFAULT 'public_safe',
	province_code TEXT,
	regency_code TEXT,
	district_code TEXT,
	village_code TEXT,
	verification_stage TEXT NOT NULL DEFAULT 'draft',
	input_level TEXT,
	public_summary TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id),
	UNIQUE (tenant_id, site_id, code),
	UNIQUE (tenant_id, site_id, sikesra_id_20)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_registry_entities_type_stage
	ON sikesra_registry_entities (tenant_id, site_id, entity_type, verification_stage);

CREATE INDEX IF NOT EXISTS idx_sikesra_registry_entities_region
	ON sikesra_registry_entities (tenant_id, site_id, province_code, regency_code, district_code, village_code);

CREATE INDEX IF NOT EXISTS idx_sikesra_registry_entities_sensitivity
	ON sikesra_registry_entities (tenant_id, site_id, sensitivity);

CREATE INDEX IF NOT EXISTS idx_sikesra_registry_entities_deleted
	ON sikesra_registry_entities (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_person_profiles (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	display_name TEXT NOT NULL,
	identity_label TEXT,
	date_of_birth TEXT,
	gender TEXT,
	phone_masked TEXT,
	email_masked TEXT,
	data_class TEXT NOT NULL DEFAULT 'sensitive_personal',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_person_profiles_data_class
	ON sikesra_person_profiles (tenant_id, site_id, data_class);

CREATE INDEX IF NOT EXISTS idx_sikesra_person_profiles_deleted
	ON sikesra_person_profiles (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_entity_people (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	registry_entity_id TEXT NOT NULL,
	person_profile_id TEXT NOT NULL,
	relationship_type TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, registry_entity_id, person_profile_id, relationship_type)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_entity_people_entity
	ON sikesra_entity_people (tenant_id, site_id, registry_entity_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_entity_people_person
	ON sikesra_entity_people (tenant_id, site_id, person_profile_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_entity_people_deleted
	ON sikesra_entity_people (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_code_sequences (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	sequence_key TEXT NOT NULL,
	last_value INTEGER NOT NULL DEFAULT 0,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, sequence_key)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_code_sequences_deleted
	ON sikesra_code_sequences (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_code_history (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	registry_entity_id TEXT NOT NULL,
	sikesra_id_20 TEXT NOT NULL,
	sequence_key TEXT NOT NULL,
	issued_at TEXT NOT NULL DEFAULT (datetime('now')),
	issued_by TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_code_history_entity
	ON sikesra_code_history (tenant_id, site_id, registry_entity_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_code_history_code
	ON sikesra_code_history (tenant_id, site_id, sikesra_id_20);

CREATE INDEX IF NOT EXISTS idx_sikesra_code_history_deleted
	ON sikesra_code_history (deleted_at);
