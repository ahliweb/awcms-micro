// ── Plugin identity ───────────────────────────────────────────────────────────

export const MAILKETING_PLUGIN_ID = "awcms-email-mailketing";
export const MAILKETING_PLUGIN_VERSION = "0.2.0";
export const MAILKETING_API_BASE = "https://api.mailketing.co.id";
export const MAILKETING_API_SEND_PATH = "/api/v1/send";

// ── Send log ─────────────────────────────────────────────────────────────────

export type MailketingSendStatus = "pending" | "sent" | "failed" | "cancelled";

export interface MailketingSendLogEntry {
	id: string;
	recipient: string;
	subject: string;
	source: string;
	status: MailketingSendStatus;
	providerMessageId: string | null;
	errorMessage: string | null;
	sentAt: string | null;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export interface MailketingSendLogListRequest {
	page?: number;
	pageSize?: number;
	status?: MailketingSendStatus;
	recipient?: string;
	includeDeleted?: boolean;
}

export interface MailketingSendLogListResponse {
	items: MailketingSendLogEntry[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export interface MailketingSendLogDetailRequest {
	id: string;
}

export interface MailketingSendLogSoftDeleteRequest {
	id: string;
	reason?: string;
}

export interface MailketingSendLogRestoreRequest {
	id: string;
}

export interface MailketingSendLogPermanentDeleteRequest {
	id: string;
	reason: string;
}

// ── Settings ─────────────────────────────────────────────────────────────────

export interface MailketingSettings {
	apiToken: string;
	fromEmail: string;
	fromName: string;
	enabled: boolean;
	logOutbound: boolean;
}

export type MailketingSettingsSaveRequest = Partial<MailketingSettings>;

export interface MailketingSettingsGetResponse {
	settings: MailketingSettings;
	configured: boolean;
}

// ── RBAC / Access ────────────────────────────────────────────────────────────

export interface MailketingPermission {
	id: string;
	slug: string;
	label: string;
	description: string | null;
	scope: string;
}

export interface MailketingRole {
	id: string;
	slug: string;
	label: string;
	description: string | null;
	isSystemRole: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export interface MailketingUserRole {
	userId: string;
	roleId: string;
	roleSlug: string;
	roleLabel: string;
	createdAt: string;
	deletedAt: string | null;
}

export interface MailketingUserProfile {
	userId: string;
	displayName: string | null;
	phone: string | null;
	meta: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
}

export interface MailketingUserSummary {
	userId: string;
	email: string;
	name: string | null;
	roles: MailketingRole[];
	profile: MailketingUserProfile | null;
}

export interface MailketingRoleListRequest {
	page?: number;
	pageSize?: number;
}

export interface MailketingRoleListResponse {
	items: MailketingRole[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export interface MailketingRoleCreateRequest {
	slug: string;
	label: string;
	description?: string;
	permissionIds?: string[];
}

export interface MailketingRoleUpdateRequest {
	id: string;
	label?: string;
	description?: string;
	permissionIds?: string[];
}

export interface MailketingRoleDeleteRequest {
	id: string;
}

export interface MailketingUserRoleAssignRequest {
	userId: string;
	roleId: string;
}

export interface MailketingUserRoleRevokeRequest {
	userId: string;
	roleId: string;
}

export interface MailketingUserListRequest {
	page?: number;
	pageSize?: number;
}

export interface MailketingUserListResponse {
	items: MailketingUserSummary[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

// ── Audit ────────────────────────────────────────────────────────────────────

export interface MailketingAuditEvent {
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

export interface MailketingAuditListRequest {
	page?: number;
	pageSize?: number;
	eventKind?: string;
	actorId?: string;
}

export interface MailketingAuditListResponse {
	items: MailketingAuditEvent[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

// ── Overview / Stats ─────────────────────────────────────────────────────────

export interface MailketingOverviewStats {
	totalSent: number;
	totalFailed: number;
	totalPending: number;
	last24hSent: number;
	last24hFailed: number;
	providerConfigured: boolean;
	providerEnabled: boolean;
	fromEmail: string;
	fromName: string;
}

// ── Mailketing API request/response ─────────────────────────────────────────

export interface MailketingApiSendRequest {
	recipient: string;
	from_email: string;
	from_name: string;
	subject: string;
	content: string;
	attach1?: string;
	attach2?: string;
	attach3?: string;
}

export interface MailketingApiSendResponse {
	success: boolean;
	message?: string;
	message_id?: string;
	error?: string;
}

// ── Pagination helper ────────────────────────────────────────────────────────

export function normalizeMailketingPage(page: unknown, pageSize: unknown) {
	const p = typeof page === "number" && page > 0 ? Math.floor(page) : 1;
	const ps =
		typeof pageSize === "number" && pageSize > 0 && pageSize <= 100 ? Math.floor(pageSize) : 20;
	return { page: p, pageSize: ps, offset: (p - 1) * ps };
}
