-- AWCMS-Micro SIKESRA migration 0011
-- Adds explicit official and local region source tables for issue #123.
-- Forward-only and idempotent. Do not add destructive SQL to this file.

CREATE TABLE IF NOT EXISTS sikesra_official_regions (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	code TEXT NOT NULL,
	parent_code TEXT,
	level TEXT NOT NULL,
	name TEXT NOT NULL,
	official_source TEXT NOT NULL DEFAULT 'kemendagri',
	status TEXT NOT NULL DEFAULT 'active',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, code)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_official_regions_parent
	ON sikesra_official_regions (tenant_id, site_id, parent_code);

CREATE INDEX IF NOT EXISTS idx_sikesra_official_regions_level_status
	ON sikesra_official_regions (tenant_id, site_id, level, status);

CREATE INDEX IF NOT EXISTS idx_sikesra_official_regions_deleted
	ON sikesra_official_regions (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_local_regions (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	code TEXT NOT NULL,
	parent_code TEXT,
	level TEXT NOT NULL,
	name TEXT NOT NULL,
	local_type TEXT NOT NULL DEFAULT 'operator_defined',
	status TEXT NOT NULL DEFAULT 'active',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, code)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_local_regions_parent
	ON sikesra_local_regions (tenant_id, site_id, parent_code);

CREATE INDEX IF NOT EXISTS idx_sikesra_local_regions_level_status
	ON sikesra_local_regions (tenant_id, site_id, level, status);

CREATE INDEX IF NOT EXISTS idx_sikesra_local_regions_deleted
	ON sikesra_local_regions (deleted_at);
