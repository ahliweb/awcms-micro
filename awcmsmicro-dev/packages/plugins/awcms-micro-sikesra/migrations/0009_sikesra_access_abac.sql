-- AWCMS-Micro SIKESRA migration 0009
-- Creates RBAC and ABAC configuration tables tied to trusted EmDash user IDs.
-- Forward-only and idempotent. Do not add destructive SQL to this file.

CREATE TABLE IF NOT EXISTS sikesra_permission_catalog (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	slug TEXT NOT NULL,
	scope TEXT NOT NULL,
	label TEXT NOT NULL,
	description TEXT,
	status TEXT NOT NULL DEFAULT 'active',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_permission_catalog_scope
	ON sikesra_permission_catalog (tenant_id, site_id, scope, status);

CREATE TABLE IF NOT EXISTS sikesra_role_catalog (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	slug TEXT NOT NULL,
	label TEXT NOT NULL,
	description TEXT,
	status TEXT NOT NULL DEFAULT 'active',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_role_catalog_status
	ON sikesra_role_catalog (tenant_id, site_id, status);

CREATE TABLE IF NOT EXISTS sikesra_role_permission_assignments (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	role_slug TEXT NOT NULL,
	permission_slug TEXT NOT NULL,
	effect TEXT NOT NULL DEFAULT 'allow',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, role_slug, permission_slug)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_role_permission_assignments_permission
	ON sikesra_role_permission_assignments (tenant_id, site_id, permission_slug, effect);

CREATE TABLE IF NOT EXISTS sikesra_user_role_assignments (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	emdash_user_id TEXT NOT NULL,
	sikesra_role_slug TEXT NOT NULL,
	is_active INTEGER NOT NULL DEFAULT 1,
	valid_from TEXT,
	valid_until TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_user_role_assignments_user
	ON sikesra_user_role_assignments (tenant_id, site_id, emdash_user_id, is_active);

CREATE INDEX IF NOT EXISTS idx_sikesra_user_role_assignments_role
	ON sikesra_user_role_assignments (tenant_id, site_id, sikesra_role_slug, is_active);

CREATE TABLE IF NOT EXISTS sikesra_user_scope_assignments (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	emdash_user_id TEXT NOT NULL,
	region_scope_type TEXT NOT NULL DEFAULT 'all',
	region_scope_code TEXT,
	organization_scope_type TEXT NOT NULL DEFAULT 'all',
	organization_scope_code TEXT,
	is_active INTEGER NOT NULL DEFAULT 1,
	valid_from TEXT,
	valid_until TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_user_scope_assignments_user
	ON sikesra_user_scope_assignments (tenant_id, site_id, emdash_user_id, is_active);

CREATE INDEX IF NOT EXISTS idx_sikesra_user_scope_assignments_region
	ON sikesra_user_scope_assignments (tenant_id, site_id, region_scope_type, region_scope_code);

CREATE TABLE IF NOT EXISTS sikesra_abac_attribute_catalog (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	key TEXT NOT NULL,
	target_type TEXT NOT NULL,
	data_type TEXT NOT NULL DEFAULT 'string',
	label TEXT NOT NULL,
	description TEXT,
	status TEXT NOT NULL DEFAULT 'active',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, key, target_type)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_abac_attribute_catalog_target
	ON sikesra_abac_attribute_catalog (tenant_id, site_id, target_type, status);

CREATE TABLE IF NOT EXISTS sikesra_abac_subject_assignments (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	emdash_user_id TEXT NOT NULL,
	attribute_key TEXT NOT NULL,
	attribute_value TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_abac_subject_assignments_user
	ON sikesra_abac_subject_assignments (tenant_id, site_id, emdash_user_id, attribute_key);

CREATE TABLE IF NOT EXISTS sikesra_abac_resource_assignments (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	resource_type TEXT NOT NULL,
	resource_id TEXT NOT NULL,
	attribute_key TEXT NOT NULL,
	attribute_value TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_abac_resource_assignments_resource
	ON sikesra_abac_resource_assignments (tenant_id, site_id, resource_type, resource_id);

CREATE TABLE IF NOT EXISTS sikesra_abac_policy_rules (
	tenant_id TEXT NOT NULL,
	site_id TEXT NOT NULL,
	id TEXT NOT NULL,
	effect TEXT NOT NULL,
	actions_json TEXT NOT NULL DEFAULT '[]',
	subject_conditions_json TEXT NOT NULL DEFAULT '{}',
	resource_conditions_json TEXT NOT NULL DEFAULT '{}',
	priority INTEGER NOT NULL DEFAULT 100,
	status TEXT NOT NULL DEFAULT 'active',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	deleted_at TEXT,
	created_by TEXT,
	updated_by TEXT,
	PRIMARY KEY (tenant_id, site_id, id)
);

CREATE INDEX IF NOT EXISTS idx_sikesra_abac_policy_rules_effect
	ON sikesra_abac_policy_rules (tenant_id, site_id, effect, status, priority);
