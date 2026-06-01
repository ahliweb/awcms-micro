-- AWCMS-Micro SIKESRA migration 0010
-- Creates export job and canonical audit event tables.
-- Forward-only and idempotent. Do not add destructive SQL to this file.

CREATE TABLE IF NOT EXISTS sikesra_export_jobs (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	actor_user_id TEXT,
	actor_name TEXT,
	export_type TEXT NOT NULL DEFAULT 'report',
	entity_type TEXT,
	requested_fields_json TEXT NOT NULL DEFAULT '[]',
	filters_json TEXT NOT NULL DEFAULT '{}',
	sensitivity_level TEXT NOT NULL DEFAULT 'public_safe',
	reason TEXT,
	status TEXT NOT NULL DEFAULT 'queued',
	file_object_id TEXT,
	result_summary_json TEXT NOT NULL DEFAULT '{}',
	error_message TEXT,
	requested_at TEXT NOT NULL DEFAULT (datetime('now')),
	completed_at TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_export_jobs_status
	ON sikesra_export_jobs (tenant_id, site_id, status, requested_at);

CREATE INDEX IF NOT EXISTS idx_sikesra_export_jobs_actor
	ON sikesra_export_jobs (tenant_id, site_id, actor_user_id, requested_at);

CREATE INDEX IF NOT EXISTS idx_sikesra_export_jobs_sensitivity
	ON sikesra_export_jobs (tenant_id, site_id, sensitivity_level);

CREATE INDEX IF NOT EXISTS idx_sikesra_export_jobs_deleted
	ON sikesra_export_jobs (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_audit_events (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	timestamp TEXT NOT NULL DEFAULT (datetime('now')),
	kind TEXT NOT NULL,
	scope TEXT NOT NULL,
	actor_user_id TEXT,
	actor_name TEXT,
	summary TEXT NOT NULL,
	metadata_json TEXT NOT NULL DEFAULT '{}',
	redaction_policy TEXT NOT NULL DEFAULT 'sikesra_default_redacted',
	request_id TEXT,
	ip_hash TEXT,
	user_agent_hash TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_audit_events_timestamp
	ON sikesra_audit_events (tenant_id, site_id, timestamp);

CREATE INDEX IF NOT EXISTS idx_sikesra_audit_events_kind_scope
	ON sikesra_audit_events (tenant_id, site_id, kind, scope);

CREATE INDEX IF NOT EXISTS idx_sikesra_audit_events_actor
	ON sikesra_audit_events (tenant_id, site_id, actor_user_id, timestamp);

CREATE INDEX IF NOT EXISTS idx_sikesra_audit_events_deleted
	ON sikesra_audit_events (deleted_at);
