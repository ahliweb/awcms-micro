-- AWCMS-Micro SIKESRA migration 0015
-- Creates governance tables for soft/permanent delete requests, approvals, snapshots, and events.
-- Forward-only and idempotent. Do not add destructive SQL to this file.

CREATE TABLE IF NOT EXISTS sikesra_delete_requests (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	target_table TEXT NOT NULL,
	target_record_id TEXT NOT NULL,
	target_sikesra_id_20 TEXT,
	target_type TEXT NOT NULL,
	operation_type TEXT NOT NULL,
	reason TEXT NOT NULL,
	risk_level TEXT NOT NULL DEFAULT 'high',
	requested_by TEXT,
	requested_at TEXT NOT NULL DEFAULT (datetime('now')),
	status TEXT NOT NULL DEFAULT 'requested',
	expires_at TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_delete_requests_target
	ON sikesra_delete_requests (tenant_id, site_id, target_table, target_record_id, status);

CREATE INDEX IF NOT EXISTS idx_sikesra_delete_requests_status
	ON sikesra_delete_requests (tenant_id, site_id, status, requested_at);

CREATE INDEX IF NOT EXISTS idx_sikesra_delete_requests_deleted
	ON sikesra_delete_requests (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_delete_snapshots (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	delete_request_id TEXT NOT NULL,
	target_table TEXT NOT NULL,
	target_record_id TEXT NOT NULL,
	snapshot_json TEXT NOT NULL DEFAULT '{}',
	related_records_json TEXT NOT NULL DEFAULT '[]',
	checksum TEXT,
	created_by TEXT,
	updated_by TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_delete_snapshots_request
	ON sikesra_delete_snapshots (tenant_id, site_id, delete_request_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_delete_snapshots_deleted
	ON sikesra_delete_snapshots (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_delete_approvals (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	delete_request_id TEXT NOT NULL,
	approval_level TEXT NOT NULL DEFAULT 'super_admin',
	approved_by TEXT,
	approved_at TEXT,
	decision TEXT NOT NULL,
	notes TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_delete_approvals_request
	ON sikesra_delete_approvals (tenant_id, site_id, delete_request_id, decision);

CREATE INDEX IF NOT EXISTS idx_sikesra_delete_approvals_deleted
	ON sikesra_delete_approvals (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_delete_events (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	delete_request_id TEXT NOT NULL,
	event_kind TEXT NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_sikesra_delete_events_request
	ON sikesra_delete_events (tenant_id, site_id, delete_request_id, created_at);

CREATE INDEX IF NOT EXISTS idx_sikesra_delete_events_deleted
	ON sikesra_delete_events (deleted_at);
