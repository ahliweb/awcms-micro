-- AWCMS-Micro SIKESRA migration 0006
-- Creates verification state and event tables for level-based review workflows.
-- Forward-only and idempotent. Do not add destructive SQL to this file.

CREATE TABLE IF NOT EXISTS sikesra_verification_stage_state (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	registry_entity_id TEXT NOT NULL,
	stage TEXT NOT NULL DEFAULT 'draft',
	current_level TEXT NOT NULL DEFAULT 'desa_kelurahan',
	next_level TEXT,
	status TEXT NOT NULL DEFAULT 'pending',
	region_scope_code TEXT,
	assigned_to TEXT,
	submitted_at TEXT,
	decided_at TEXT,
	decision_notes TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, registry_entity_id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_verification_stage_state_stage
	ON sikesra_verification_stage_state (tenant_id, site_id, stage, status);

CREATE INDEX IF NOT EXISTS idx_sikesra_verification_stage_state_level
	ON sikesra_verification_stage_state (tenant_id, site_id, current_level, next_level);

CREATE INDEX IF NOT EXISTS idx_sikesra_verification_stage_state_region
	ON sikesra_verification_stage_state (tenant_id, site_id, region_scope_code);

CREATE INDEX IF NOT EXISTS idx_sikesra_verification_stage_state_deleted
	ON sikesra_verification_stage_state (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_verification_events (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	registry_entity_id TEXT NOT NULL,
	from_stage TEXT,
	to_stage TEXT NOT NULL,
	verifier_level TEXT NOT NULL,
	verifier_user_id TEXT,
	decision TEXT NOT NULL,
	reason TEXT,
	notes TEXT,
	region_scope_code TEXT,
	audit_event_id TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_verification_events_entity
	ON sikesra_verification_events (tenant_id, site_id, registry_entity_id, created_at);

CREATE INDEX IF NOT EXISTS idx_sikesra_verification_events_decision
	ON sikesra_verification_events (tenant_id, site_id, decision, verifier_level);

CREATE INDEX IF NOT EXISTS idx_sikesra_verification_events_region
	ON sikesra_verification_events (tenant_id, site_id, region_scope_code);

CREATE INDEX IF NOT EXISTS idx_sikesra_verification_events_deleted
	ON sikesra_verification_events (deleted_at);
