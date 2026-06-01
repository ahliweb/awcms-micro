-- AWCMS-Micro SIKESRA migration 0008
-- Creates duplicate candidate and decision tables for registry, document, and import workflows.
-- Forward-only and idempotent. Do not add destructive SQL to this file.

CREATE TABLE IF NOT EXISTS sikesra_duplicate_candidates (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	source_type TEXT NOT NULL,
	source_id TEXT NOT NULL,
	candidate_type TEXT NOT NULL,
	candidate_id TEXT NOT NULL,
	entity_type TEXT,
	score REAL NOT NULL DEFAULT 0,
	risk_level TEXT NOT NULL DEFAULT 'medium',
	reason_json TEXT NOT NULL DEFAULT '[]',
	status TEXT NOT NULL DEFAULT 'open',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_duplicate_candidates_source
	ON sikesra_duplicate_candidates (tenant_id, site_id, source_type, source_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_duplicate_candidates_candidate
	ON sikesra_duplicate_candidates (tenant_id, site_id, candidate_type, candidate_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_duplicate_candidates_risk
	ON sikesra_duplicate_candidates (tenant_id, site_id, risk_level, status);

CREATE INDEX IF NOT EXISTS idx_sikesra_duplicate_candidates_deleted
	ON sikesra_duplicate_candidates (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_duplicate_decisions (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	candidate_id TEXT NOT NULL,
	decision TEXT NOT NULL,
	reason TEXT NOT NULL,
	decided_by TEXT,
	decided_at TEXT NOT NULL DEFAULT (datetime('now')),
	audit_event_id TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_duplicate_decisions_candidate
	ON sikesra_duplicate_decisions (tenant_id, site_id, candidate_id, decided_at);

CREATE INDEX IF NOT EXISTS idx_sikesra_duplicate_decisions_decision
	ON sikesra_duplicate_decisions (tenant_id, site_id, decision);

CREATE INDEX IF NOT EXISTS idx_sikesra_duplicate_decisions_deleted
	ON sikesra_duplicate_decisions (deleted_at);
