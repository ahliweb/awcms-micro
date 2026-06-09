-- AWCMS-Micro Email Mailketing migration 0004
-- Creates the audit-events table for tracking all plugin activity.
-- Forward-only and idempotent.

CREATE TABLE IF NOT EXISTS mailketing_audit_events (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	event_kind TEXT NOT NULL,
	actor_id TEXT,
	actor_email TEXT,
	target_type TEXT,
	target_id TEXT,
	summary TEXT NOT NULL,
	detail_json TEXT,
	ip_address TEXT,
	user_agent TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_mailketing_audit_kind
	ON mailketing_audit_events (tenant_id, site_id, event_kind, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_mailketing_audit_actor
	ON mailketing_audit_events (tenant_id, site_id, actor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_mailketing_audit_target
	ON mailketing_audit_events (tenant_id, site_id, target_type, target_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_mailketing_audit_created_at
	ON mailketing_audit_events (tenant_id, site_id, created_at DESC);
