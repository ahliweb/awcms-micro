import type { MailketingD1Database, MailketingRepositoryScope } from "./connection.js";
import type {
	MailketingAuditEventRow,
	MailketingPermissionRow,
	MailketingRolePermissionRow,
	MailketingRoleRow,
	MailketingSendLogRow,
	MailketingSettingsRow,
	MailketingUserProfileRow,
	MailketingUserRoleRow,
} from "./schema.js";
import { MAILKETING_D1_TABLES } from "./schema.js";

// ── Settings repository ───────────────────────────────────────────────────────

export async function getSettingValue(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	key: string,
): Promise<string | null> {
	const row = await db
		.prepare<{ value_json: string }>(
			`SELECT value_json FROM ${MAILKETING_D1_TABLES.settings}
			 WHERE tenant_id = ? AND site_id = ? AND key = ? AND deleted_at IS NULL`,
		)
		.bind(scope.tenantId, scope.siteId, key)
		.first();
	return row?.value_json ?? null;
}

export async function upsertSetting(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	key: string,
	valueJson: string,
	updatedBy: string | null,
): Promise<void> {
	const now = new Date().toISOString();
	await db
		.prepare(
			`INSERT INTO ${MAILKETING_D1_TABLES.settings}
			   (tenant_id, site_id, key, value_json, created_at, updated_at, updated_by)
			 VALUES (?, ?, ?, ?, ?, ?, ?)
			 ON CONFLICT (tenant_id, site_id, key)
			 DO UPDATE SET value_json = excluded.value_json,
			               updated_at = excluded.updated_at,
			               updated_by = excluded.updated_by`,
		)
		.bind(scope.tenantId, scope.siteId, key, valueJson, now, now, updatedBy)
		.run?.();
}

// ── Send log repository ───────────────────────────────────────────────────────

export async function insertSendLog(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	row: Omit<MailketingSendLogRow, "tenant_id" | "site_id">,
): Promise<void> {
	await db
		.prepare(
			`INSERT INTO ${MAILKETING_D1_TABLES.sendLog}
			   (tenant_id, site_id, id, recipient, subject, source, status,
			    provider_message_id, error_message, request_payload_json, response_json,
			    sent_at, created_at, updated_at, deleted_at, created_by)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		)
		.bind(
			scope.tenantId,
			scope.siteId,
			row.id,
			row.recipient,
			row.subject,
			row.source,
			row.status,
			row.provider_message_id,
			row.error_message,
			row.request_payload_json,
			row.response_json,
			row.sent_at,
			row.created_at,
			row.updated_at,
			row.deleted_at,
			row.created_by,
		)
		.run?.();
}

export async function updateSendLogStatus(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	id: string,
	status: string,
	providerMessageId: string | null,
	errorMessage: string | null,
	responseJson: string | null,
	sentAt: string | null,
): Promise<void> {
	const now = new Date().toISOString();
	await db
		.prepare(
			`UPDATE ${MAILKETING_D1_TABLES.sendLog}
			 SET status = ?, provider_message_id = ?, error_message = ?,
			     response_json = ?, sent_at = ?, updated_at = ?
			 WHERE tenant_id = ? AND site_id = ? AND id = ?`,
		)
		.bind(status, providerMessageId, errorMessage, responseJson, sentAt, now, scope.tenantId, scope.siteId, id)
		.run?.();
}

export async function listSendLog(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	opts: {
		page: number;
		pageSize: number;
		status?: string;
		recipient?: string;
		includeDeleted?: boolean;
	},
): Promise<{ items: MailketingSendLogRow[]; total: number }> {
	const offset = (opts.page - 1) * opts.pageSize;
	let where = `tenant_id = ? AND site_id = ?`;
	const binds: unknown[] = [scope.tenantId, scope.siteId];

	if (!opts.includeDeleted) {
		where += ` AND deleted_at IS NULL`;
	}
	if (opts.status) {
		where += ` AND status = ?`;
		binds.push(opts.status);
	}
	if (opts.recipient) {
		where += ` AND recipient LIKE ?`;
		binds.push(`%${opts.recipient}%`);
	}

	const countRow = await db
		.prepare<{ cnt: number }>(
			`SELECT COUNT(*) as cnt FROM ${MAILKETING_D1_TABLES.sendLog} WHERE ${where}`,
		)
		.bind(...binds)
		.first();

	const total = countRow?.cnt ?? 0;

	const items = await db
		.prepare<MailketingSendLogRow>(
			`SELECT * FROM ${MAILKETING_D1_TABLES.sendLog}
			 WHERE ${where}
			 ORDER BY created_at DESC
			 LIMIT ? OFFSET ?`,
		)
		.bind(...binds, opts.pageSize, offset)
		.all();

	return { items: items.results ?? [], total };
}

export async function getSendLogById(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	id: string,
): Promise<MailketingSendLogRow | null> {
	return db
		.prepare<MailketingSendLogRow>(
			`SELECT * FROM ${MAILKETING_D1_TABLES.sendLog}
			 WHERE tenant_id = ? AND site_id = ? AND id = ?`,
		)
		.bind(scope.tenantId, scope.siteId, id)
		.first();
}

export async function softDeleteSendLog(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	id: string,
): Promise<void> {
	const now = new Date().toISOString();
	await db
		.prepare(
			`UPDATE ${MAILKETING_D1_TABLES.sendLog}
			 SET deleted_at = ?, updated_at = ?
			 WHERE tenant_id = ? AND site_id = ? AND id = ? AND deleted_at IS NULL`,
		)
		.bind(now, now, scope.tenantId, scope.siteId, id)
		.run?.();
}

export async function restoreSendLog(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	id: string,
): Promise<void> {
	const now = new Date().toISOString();
	await db
		.prepare(
			`UPDATE ${MAILKETING_D1_TABLES.sendLog}
			 SET deleted_at = NULL, updated_at = ?
			 WHERE tenant_id = ? AND site_id = ? AND id = ?`,
		)
		.bind(now, scope.tenantId, scope.siteId, id)
		.run?.();
}

export async function permanentDeleteSendLog(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	id: string,
): Promise<void> {
	await db
		.prepare(
			`DELETE FROM ${MAILKETING_D1_TABLES.sendLog}
			 WHERE tenant_id = ? AND site_id = ? AND id = ?`,
		)
		.bind(scope.tenantId, scope.siteId, id)
		.run?.();
}

// ── Permissions repository ────────────────────────────────────────────────────

export async function listPermissions(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
): Promise<MailketingPermissionRow[]> {
	const result = await db
		.prepare<MailketingPermissionRow>(
			`SELECT * FROM ${MAILKETING_D1_TABLES.permissions}
			 WHERE tenant_id = ? AND site_id = ? AND deleted_at IS NULL
			 ORDER BY slug ASC`,
		)
		.bind(scope.tenantId, scope.siteId)
		.all();
	return result.results ?? [];
}

export async function upsertPermission(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	id: string,
	slug: string,
	label: string,
	description: string | null,
): Promise<void> {
	const now = new Date().toISOString();
	await db
		.prepare(
			`INSERT INTO ${MAILKETING_D1_TABLES.permissions}
			   (tenant_id, site_id, id, slug, label, description, scope, created_at, updated_at)
			 VALUES (?, ?, ?, ?, ?, ?, 'plugin', ?, ?)
			 ON CONFLICT (tenant_id, site_id, slug)
			 DO UPDATE SET label = excluded.label,
			               description = excluded.description,
			               updated_at = excluded.updated_at`,
		)
		.bind(scope.tenantId, scope.siteId, id, slug, label, description, now, now)
		.run?.();
}

// ── Roles repository ──────────────────────────────────────────────────────────

export async function listRoles(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	opts: { page: number; pageSize: number },
): Promise<{ items: MailketingRoleRow[]; total: number }> {
	const offset = (opts.page - 1) * opts.pageSize;

	const countRow = await db
		.prepare<{ cnt: number }>(
			`SELECT COUNT(*) as cnt FROM ${MAILKETING_D1_TABLES.roles}
			 WHERE tenant_id = ? AND site_id = ? AND deleted_at IS NULL`,
		)
		.bind(scope.tenantId, scope.siteId)
		.first();

	const total = countRow?.cnt ?? 0;

	const items = await db
		.prepare<MailketingRoleRow>(
			`SELECT * FROM ${MAILKETING_D1_TABLES.roles}
			 WHERE tenant_id = ? AND site_id = ? AND deleted_at IS NULL
			 ORDER BY label ASC
			 LIMIT ? OFFSET ?`,
		)
		.bind(scope.tenantId, scope.siteId, opts.pageSize, offset)
		.all();

	return { items: items.results ?? [], total };
}

export async function getRoleById(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	id: string,
): Promise<MailketingRoleRow | null> {
	return db
		.prepare<MailketingRoleRow>(
			`SELECT * FROM ${MAILKETING_D1_TABLES.roles}
			 WHERE tenant_id = ? AND site_id = ? AND id = ? AND deleted_at IS NULL`,
		)
		.bind(scope.tenantId, scope.siteId, id)
		.first();
}

export async function insertRole(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	role: Omit<MailketingRoleRow, "tenant_id" | "site_id">,
): Promise<void> {
	await db
		.prepare(
			`INSERT INTO ${MAILKETING_D1_TABLES.roles}
			   (tenant_id, site_id, id, slug, label, description, is_system_role,
			    created_at, updated_at, deleted_at, created_by)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		)
		.bind(
			scope.tenantId,
			scope.siteId,
			role.id,
			role.slug,
			role.label,
			role.description,
			role.is_system_role,
			role.created_at,
			role.updated_at,
			role.deleted_at,
			role.created_by,
		)
		.run?.();
}

export async function updateRole(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	id: string,
	label: string,
	description: string | null,
): Promise<void> {
	const now = new Date().toISOString();
	await db
		.prepare(
			`UPDATE ${MAILKETING_D1_TABLES.roles}
			 SET label = ?, description = ?, updated_at = ?
			 WHERE tenant_id = ? AND site_id = ? AND id = ? AND deleted_at IS NULL`,
		)
		.bind(label, description, now, scope.tenantId, scope.siteId, id)
		.run?.();
}

export async function softDeleteRole(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	id: string,
): Promise<void> {
	const now = new Date().toISOString();
	await db
		.prepare(
			`UPDATE ${MAILKETING_D1_TABLES.roles}
			 SET deleted_at = ?, updated_at = ?
			 WHERE tenant_id = ? AND site_id = ? AND id = ? AND is_system_role = 0`,
		)
		.bind(now, now, scope.tenantId, scope.siteId, id)
		.run?.();
}

export async function setRolePermissions(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	roleId: string,
	permissionIds: string[],
	createdBy: string | null,
): Promise<void> {
	const now = new Date().toISOString();
	await db
		.prepare(
			`DELETE FROM ${MAILKETING_D1_TABLES.rolePermissions}
			 WHERE tenant_id = ? AND site_id = ? AND role_id = ?`,
		)
		.bind(scope.tenantId, scope.siteId, roleId)
		.run?.();

	for (const permId of permissionIds) {
		await db
			.prepare(
				`INSERT OR IGNORE INTO ${MAILKETING_D1_TABLES.rolePermissions}
				   (tenant_id, site_id, role_id, permission_id, created_at, created_by)
				 VALUES (?, ?, ?, ?, ?, ?)`,
			)
			.bind(scope.tenantId, scope.siteId, roleId, permId, now, createdBy)
			.run?.();
	}
}

export async function getRolePermissions(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	roleId: string,
): Promise<MailketingRolePermissionRow[]> {
	const result = await db
		.prepare<MailketingRolePermissionRow>(
			`SELECT * FROM ${MAILKETING_D1_TABLES.rolePermissions}
			 WHERE tenant_id = ? AND site_id = ? AND role_id = ?`,
		)
		.bind(scope.tenantId, scope.siteId, roleId)
		.all();
	return result.results ?? [];
}

// ── User roles repository ─────────────────────────────────────────────────────

export async function getUserRoles(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	userId: string,
): Promise<MailketingUserRoleRow[]> {
	const result = await db
		.prepare<MailketingUserRoleRow>(
			`SELECT * FROM ${MAILKETING_D1_TABLES.userRoles}
			 WHERE tenant_id = ? AND site_id = ? AND user_id = ? AND deleted_at IS NULL`,
		)
		.bind(scope.tenantId, scope.siteId, userId)
		.all();
	return result.results ?? [];
}

export async function assignUserRole(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	userId: string,
	roleId: string,
	createdBy: string | null,
): Promise<void> {
	const now = new Date().toISOString();
	await db
		.prepare(
			`INSERT OR REPLACE INTO ${MAILKETING_D1_TABLES.userRoles}
			   (tenant_id, site_id, user_id, role_id, created_at, updated_at, deleted_at, created_by, updated_by)
			 VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)`,
		)
		.bind(scope.tenantId, scope.siteId, userId, roleId, now, now, createdBy, createdBy)
		.run?.();
}

export async function revokeUserRole(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	userId: string,
	roleId: string,
): Promise<void> {
	const now = new Date().toISOString();
	await db
		.prepare(
			`UPDATE ${MAILKETING_D1_TABLES.userRoles}
			 SET deleted_at = ?, updated_at = ?
			 WHERE tenant_id = ? AND site_id = ? AND user_id = ? AND role_id = ? AND deleted_at IS NULL`,
		)
		.bind(now, now, scope.tenantId, scope.siteId, userId, roleId)
		.run?.();
}

// ── User profile repository ───────────────────────────────────────────────────

export async function getUserProfile(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	userId: string,
): Promise<MailketingUserProfileRow | null> {
	return db
		.prepare<MailketingUserProfileRow>(
			`SELECT * FROM ${MAILKETING_D1_TABLES.userProfile}
			 WHERE tenant_id = ? AND site_id = ? AND user_id = ? AND deleted_at IS NULL`,
		)
		.bind(scope.tenantId, scope.siteId, userId)
		.first();
}

export async function upsertUserProfile(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	userId: string,
	displayName: string | null,
	phone: string | null,
	metaJson: string | null,
	updatedBy: string | null,
): Promise<void> {
	const now = new Date().toISOString();
	await db
		.prepare(
			`INSERT INTO ${MAILKETING_D1_TABLES.userProfile}
			   (tenant_id, site_id, user_id, display_name, phone, meta_json,
			    created_at, updated_at, deleted_at, updated_by)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)
			 ON CONFLICT (tenant_id, site_id, user_id)
			 DO UPDATE SET display_name = excluded.display_name,
			               phone = excluded.phone,
			               meta_json = excluded.meta_json,
			               updated_at = excluded.updated_at,
			               updated_by = excluded.updated_by`,
		)
		.bind(scope.tenantId, scope.siteId, userId, displayName, phone, metaJson, now, now, updatedBy)
		.run?.();
}

// ── Audit repository ──────────────────────────────────────────────────────────

export async function insertAuditEvent(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	row: Omit<MailketingAuditEventRow, "tenant_id" | "site_id">,
): Promise<void> {
	await db
		.prepare(
			`INSERT INTO ${MAILKETING_D1_TABLES.auditEvents}
			   (tenant_id, site_id, id, event_kind, actor_id, actor_email,
			    target_type, target_id, summary, detail_json,
			    ip_address, user_agent, created_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		)
		.bind(
			scope.tenantId,
			scope.siteId,
			row.id,
			row.event_kind,
			row.actor_id,
			row.actor_email,
			row.target_type,
			row.target_id,
			row.summary,
			row.detail_json,
			row.ip_address,
			row.user_agent,
			row.created_at,
		)
		.run?.();
}

export async function listAuditEvents(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
	opts: {
		page: number;
		pageSize: number;
		eventKind?: string;
		actorId?: string;
	},
): Promise<{ items: MailketingAuditEventRow[]; total: number }> {
	const offset = (opts.page - 1) * opts.pageSize;
	let where = `tenant_id = ? AND site_id = ?`;
	const binds: unknown[] = [scope.tenantId, scope.siteId];

	if (opts.eventKind) {
		where += ` AND event_kind = ?`;
		binds.push(opts.eventKind);
	}
	if (opts.actorId) {
		where += ` AND actor_id = ?`;
		binds.push(opts.actorId);
	}

	const countRow = await db
		.prepare<{ cnt: number }>(
			`SELECT COUNT(*) as cnt FROM ${MAILKETING_D1_TABLES.auditEvents} WHERE ${where}`,
		)
		.bind(...binds)
		.first();

	const total = countRow?.cnt ?? 0;

	const items = await db
		.prepare<MailketingAuditEventRow>(
			`SELECT * FROM ${MAILKETING_D1_TABLES.auditEvents}
			 WHERE ${where}
			 ORDER BY created_at DESC
			 LIMIT ? OFFSET ?`,
		)
		.bind(...binds, opts.pageSize, offset)
		.all();

	return { items: items.results ?? [], total };
}

// ── Overview stats ────────────────────────────────────────────────────────────

export async function getSendStats(
	db: MailketingD1Database,
	scope: MailketingRepositoryScope,
): Promise<{ sent: number; failed: number; pending: number; last24hSent: number; last24hFailed: number }> {
	const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

	const allStats = await db
		.prepare<{ status: string; cnt: number }>(
			`SELECT status, COUNT(*) as cnt
			 FROM ${MAILKETING_D1_TABLES.sendLog}
			 WHERE tenant_id = ? AND site_id = ? AND deleted_at IS NULL
			 GROUP BY status`,
		)
		.bind(scope.tenantId, scope.siteId)
		.all();

	const recentStats = await db
		.prepare<{ status: string; cnt: number }>(
			`SELECT status, COUNT(*) as cnt
			 FROM ${MAILKETING_D1_TABLES.sendLog}
			 WHERE tenant_id = ? AND site_id = ? AND deleted_at IS NULL AND created_at >= ?
			 GROUP BY status`,
		)
		.bind(scope.tenantId, scope.siteId, since24h)
		.all();

	const statsMap: Record<string, number> = {};
	for (const row of allStats.results ?? []) {
		statsMap[row.status] = row.cnt;
	}

	const recentMap: Record<string, number> = {};
	for (const row of recentStats.results ?? []) {
		recentMap[row.status] = row.cnt;
	}

	return {
		sent: statsMap["sent"] ?? 0,
		failed: statsMap["failed"] ?? 0,
		pending: statsMap["pending"] ?? 0,
		last24hSent: recentMap["sent"] ?? 0,
		last24hFailed: recentMap["failed"] ?? 0,
	};
}
