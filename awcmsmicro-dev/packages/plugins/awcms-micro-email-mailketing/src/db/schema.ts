export const MAILKETING_D1_TABLES = {
	settings: "mailketing_settings",
	pluginState: "mailketing_plugin_state",
	sendLog: "mailketing_send_log",
	permissions: "mailketing_permission_catalog",
	roles: "mailketing_role_catalog",
	rolePermissions: "mailketing_role_permission_assignments",
	userRoles: "mailketing_user_role_assignments",
	userProfile: "mailketing_user_profile",
	auditEvents: "mailketing_audit_events",
} as const;

export type MailketingD1TableName = (typeof MAILKETING_D1_TABLES)[keyof typeof MAILKETING_D1_TABLES];

export function assertMailketingTableName(table: string): asserts table is MailketingD1TableName {
	if (!table.startsWith("mailketing_")) {
		throw new Error(`Mailketing repository table must use mailketing_ prefix: ${table}`);
	}
}

// ── Row types matching D1 columns ────────────────────────────────────────────

export interface MailketingSettingsRow {
	tenant_id: string;
	site_id: string;
	key: string;
	value_json: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	created_by: string | null;
	updated_by: string | null;
}

export interface MailketingSendLogRow {
	tenant_id: string;
	site_id: string;
	id: string;
	recipient: string;
	subject: string;
	source: string;
	status: string;
	provider_message_id: string | null;
	error_message: string | null;
	request_payload_json: string | null;
	response_json: string | null;
	sent_at: string | null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	created_by: string | null;
}

export interface MailketingPermissionRow {
	tenant_id: string;
	site_id: string;
	id: string;
	slug: string;
	label: string;
	description: string | null;
	scope: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

export interface MailketingRoleRow {
	tenant_id: string;
	site_id: string;
	id: string;
	slug: string;
	label: string;
	description: string | null;
	is_system_role: number;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	created_by: string | null;
}

export interface MailketingRolePermissionRow {
	tenant_id: string;
	site_id: string;
	role_id: string;
	permission_id: string;
	created_at: string;
	created_by: string | null;
}

export interface MailketingUserRoleRow {
	tenant_id: string;
	site_id: string;
	user_id: string;
	role_id: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	created_by: string | null;
	updated_by: string | null;
}

export interface MailketingUserProfileRow {
	tenant_id: string;
	site_id: string;
	user_id: string;
	display_name: string | null;
	phone: string | null;
	meta_json: string | null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	updated_by: string | null;
}

export interface MailketingAuditEventRow {
	tenant_id: string;
	site_id: string;
	id: string;
	event_kind: string;
	actor_id: string | null;
	actor_email: string | null;
	target_type: string | null;
	target_id: string | null;
	summary: string;
	detail_json: string | null;
	ip_address: string | null;
	user_agent: string | null;
	created_at: string;
}
