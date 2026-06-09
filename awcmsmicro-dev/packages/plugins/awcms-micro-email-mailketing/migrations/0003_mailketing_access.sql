-- AWCMS-Micro Email Mailketing migration 0003
-- Creates plugin-scoped RBAC tables: permissions, roles, role-permission assignments,
-- and user-role assignments.
-- Forward-only and idempotent.

CREATE TABLE IF NOT EXISTS mailketing_permission_catalog (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	slug TEXT NOT NULL,
	label TEXT NOT NULL,
	description TEXT,
	scope TEXT NOT NULL DEFAULT 'plugin',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	PRIMARY KEY (tenant_id, site_id, id),
	UNIQUE (tenant_id, site_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_mailketing_permission_catalog_tenant_site_slug
	ON mailketing_permission_catalog (tenant_id, site_id, slug);

CREATE TABLE IF NOT EXISTS mailketing_role_catalog (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	slug TEXT NOT NULL,
	label TEXT NOT NULL,
	description TEXT,
	is_system_role INTEGER NOT NULL DEFAULT 0,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id),
	UNIQUE (tenant_id, site_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_mailketing_role_catalog_tenant_site_slug
	ON mailketing_role_catalog (tenant_id, site_id, slug);

CREATE TABLE IF NOT EXISTS mailketing_role_permission_assignments (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	role_id TEXT NOT NULL,
	permission_id TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	created_by TEXT,
	PRIMARY KEY (tenant_id, site_id, role_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_mailketing_role_perms_role
	ON mailketing_role_permission_assignments (tenant_id, site_id, role_id);

CREATE TABLE IF NOT EXISTS mailketing_user_role_assignments (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	user_id TEXT NOT NULL,
	role_id TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_mailketing_user_roles_user
	ON mailketing_user_role_assignments (tenant_id, site_id, user_id, deleted_at);

CREATE INDEX IF NOT EXISTS idx_mailketing_user_roles_role
	ON mailketing_user_role_assignments (tenant_id, site_id, role_id, deleted_at);

CREATE TABLE IF NOT EXISTS mailketing_user_profile (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	user_id TEXT NOT NULL,
	display_name TEXT,
	phone TEXT,
	meta_json TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, user_id)
);
