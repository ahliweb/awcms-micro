-- AWCMS-Micro Email Mailketing migration 0002
-- Creates the send-log table for tracking all outbound email attempts.
-- Forward-only and idempotent.

CREATE TABLE IF NOT EXISTS mailketing_send_log (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	recipient TEXT NOT NULL,
	subject TEXT NOT NULL,
	source TEXT NOT NULL DEFAULT 'system',
	status TEXT NOT NULL DEFAULT 'pending',
	provider_message_id TEXT,
	error_message TEXT,
	request_payload_json TEXT,
	response_json TEXT,
	sent_at TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_mailketing_send_log_tenant_site_status
	ON mailketing_send_log (tenant_id, site_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_mailketing_send_log_tenant_site_recipient
	ON mailketing_send_log (tenant_id, site_id, recipient, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_mailketing_send_log_deleted
	ON mailketing_send_log (deleted_at);

CREATE INDEX IF NOT EXISTS idx_mailketing_send_log_sent_at
	ON mailketing_send_log (tenant_id, site_id, sent_at DESC);
