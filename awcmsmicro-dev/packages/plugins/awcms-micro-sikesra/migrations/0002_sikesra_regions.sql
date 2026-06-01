-- AWCMS-Micro SIKESRA migration 0002
-- Creates official and local region reference tables.
-- Forward-only and idempotent. Do not add destructive SQL to this file.

CREATE TABLE IF NOT EXISTS sikesra_regions (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	code TEXT NOT NULL,
	parent_code TEXT,
	level TEXT NOT NULL,
	name TEXT NOT NULL,
	source TEXT NOT NULL DEFAULT 'official',
	status TEXT NOT NULL DEFAULT 'active',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, code)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_regions_parent
	ON sikesra_regions (tenant_id, site_id, parent_code);

CREATE INDEX IF NOT EXISTS idx_sikesra_regions_level_status
	ON sikesra_regions (tenant_id, site_id, level, status);

CREATE INDEX IF NOT EXISTS idx_sikesra_regions_deleted
	ON sikesra_regions (deleted_at);

CREATE TABLE IF NOT EXISTS sikesra_region_aliases (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	region_code TEXT NOT NULL,
	alias TEXT NOT NULL,
	source TEXT NOT NULL DEFAULT 'operator',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, region_code, alias)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_region_aliases_region
	ON sikesra_region_aliases (tenant_id, site_id, region_code);

CREATE INDEX IF NOT EXISTS idx_sikesra_region_aliases_deleted
	ON sikesra_region_aliases (deleted_at);
