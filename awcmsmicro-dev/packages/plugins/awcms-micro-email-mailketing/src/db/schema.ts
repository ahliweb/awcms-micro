// ── Storage collection names ──────────────────────────────────────────────────

export const MAILKETING_STORAGE_COLLECTIONS = {
	sendLog: "mailketing_send_log",
	permissionCatalog: "mailketing_permission_catalog",
	roleCatalog: "mailketing_role_catalog",
	rolePermissions: "mailketing_role_permission_assignments",
	userRoles: "mailketing_user_role_assignments",
	userProfile: "mailketing_user_profile",
	auditEvents: "mailketing_audit_events",
} as const;

export type MailketingStorageCollectionName =
	(typeof MAILKETING_STORAGE_COLLECTIONS)[keyof typeof MAILKETING_STORAGE_COLLECTIONS];

// ── Document shapes (stored as JSON in _plugin_storage) ──────────────────────

export interface MailketingSendLogDoc {
	id: string;
	recipient: string;
	subject: string;
	source: string;
	status: string;
	providerMessageId: string | null;
	errorMessage: string | null;
	requestPayloadJson: string | null;
	responseJson: string | null;
	sentAt: string | null;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	createdBy: string | null;
}

export interface MailketingPermissionDoc {
	id: string;
	slug: string;
	label: string;
	description: string | null;
	scope: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export interface MailketingRoleDoc {
	id: string;
	slug: string;
	label: string;
	description: string | null;
	isSystemRole: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	createdBy: string | null;
}

export interface MailketingRolePermissionDoc {
	roleId: string;
	permissionId: string;
	createdAt: string;
	createdBy: string | null;
}

export interface MailketingUserRoleDoc {
	userId: string;
	roleId: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	createdBy: string | null;
	updatedBy: string | null;
}

export interface MailketingUserProfileDoc {
	userId: string;
	displayName: string | null;
	phone: string | null;
	meta: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	updatedBy: string | null;
}

export interface MailketingAuditEventDoc {
	id: string;
	eventKind: string;
	actorId: string | null;
	actorEmail: string | null;
	targetType: string | null;
	targetId: string | null;
	summary: string;
	detail: Record<string, unknown> | null;
	ipAddress: string | null;
	userAgent: string | null;
	createdAt: string;
}
