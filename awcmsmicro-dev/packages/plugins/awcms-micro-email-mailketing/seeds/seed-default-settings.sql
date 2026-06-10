-- AWCMS-Micro Email Mailketing: default settings seed
-- NOTE: This SQL seed targets the legacy raw mailketing_* SQL tables.
-- The plugin now uses EmDash ctx.kv (via _emdash_options table) and
-- ctx.storage (via _plugin_storage table). Settings are bootstrapped
-- automatically at first route access via ensureDefaultSettings().
-- This file is kept for reference only. Do NOT apply it to a fresh install.
-- SECURITY: Do NOT commit real production credentials into source control.

INSERT INTO mailketing_settings
	(tenant_id, site_id, key, value_json, created_at, updated_at)
VALUES
	('t-local-dev', 'default', 'api_token',    '"70e3b49ec472fb3b945929c1a43fed36"',   datetime('now'), datetime('now')),
	('t-local-dev', 'default', 'from_email',   '"sender@satpamsiber.com"',             datetime('now'), datetime('now')),
	('t-local-dev', 'default', 'from_name',    '"AWCMS Email"',                        datetime('now'), datetime('now')),
	('t-local-dev', 'default', 'enabled',      'true',                                 datetime('now'), datetime('now')),
	('t-local-dev', 'default', 'log_outbound', 'true',                                 datetime('now'), datetime('now'))
ON CONFLICT (tenant_id, site_id, key)
DO UPDATE SET
	value_json = excluded.value_json,
	updated_at = excluded.updated_at;

-- Seed built-in permissions
INSERT INTO mailketing_permission_catalog
	(tenant_id, site_id, id, slug, label, description, scope, created_at, updated_at)
VALUES
	('t-local-dev', 'default', 'perm-mk-view-log',    'mailketing.send_log.view',    'View Send Log',    'Can view the email send log',            'plugin', datetime('now'), datetime('now')),
	('t-local-dev', 'default', 'perm-mk-delete-log',  'mailketing.send_log.delete',  'Delete Send Log',  'Can soft-delete send log entries',       'plugin', datetime('now'), datetime('now')),
	('t-local-dev', 'default', 'perm-mk-manage-set',  'mailketing.settings.manage',  'Manage Settings',  'Can update plugin settings and API key', 'plugin', datetime('now'), datetime('now')),
	('t-local-dev', 'default', 'perm-mk-manage-role', 'mailketing.access.manage',    'Manage Access',    'Can manage roles and user assignments',   'plugin', datetime('now'), datetime('now')),
	('t-local-dev', 'default', 'perm-mk-view-audit',  'mailketing.audit.view',       'View Audit Log',   'Can view the audit trail',               'plugin', datetime('now'), datetime('now'))
ON CONFLICT (tenant_id, site_id, slug)
DO UPDATE SET
	label       = excluded.label,
	description = excluded.description,
	updated_at  = excluded.updated_at;

-- Seed built-in system role: mailketing_admin
INSERT INTO mailketing_role_catalog
	(tenant_id, site_id, id, slug, label, description, is_system_role, created_at, updated_at)
VALUES
	('t-local-dev', 'default', 'role-mk-admin',  'mailketing_admin',  'Mailketing Admin',  'Full access to Email Mailketing plugin',    1, datetime('now'), datetime('now')),
	('t-local-dev', 'default', 'role-mk-viewer', 'mailketing_viewer', 'Mailketing Viewer', 'Read-only access to send log and audit log', 0, datetime('now'), datetime('now'))
ON CONFLICT (tenant_id, site_id, slug)
DO UPDATE SET
	label       = excluded.label,
	description = excluded.description,
	updated_at  = excluded.updated_at;

-- Assign all permissions to mailketing_admin
INSERT INTO mailketing_role_permission_assignments
	(tenant_id, site_id, role_id, permission_id, created_at)
VALUES
	('t-local-dev', 'default', 'role-mk-admin', 'perm-mk-view-log',    datetime('now')),
	('t-local-dev', 'default', 'role-mk-admin', 'perm-mk-delete-log',  datetime('now')),
	('t-local-dev', 'default', 'role-mk-admin', 'perm-mk-manage-set',  datetime('now')),
	('t-local-dev', 'default', 'role-mk-admin', 'perm-mk-manage-role', datetime('now')),
	('t-local-dev', 'default', 'role-mk-admin', 'perm-mk-view-audit',  datetime('now'))
ON CONFLICT (tenant_id, site_id, role_id, permission_id) DO NOTHING;

-- Assign view permissions to mailketing_viewer
INSERT INTO mailketing_role_permission_assignments
	(tenant_id, site_id, role_id, permission_id, created_at)
VALUES
	('t-local-dev', 'default', 'role-mk-viewer', 'perm-mk-view-log',   datetime('now')),
	('t-local-dev', 'default', 'role-mk-viewer', 'perm-mk-view-audit', datetime('now'))
ON CONFLICT (tenant_id, site_id, role_id, permission_id) DO NOTHING;
