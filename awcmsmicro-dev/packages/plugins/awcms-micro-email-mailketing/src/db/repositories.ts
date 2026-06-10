import type {
	MailketingAuditEventDoc,
	MailketingPermissionDoc,
	MailketingRoleDoc,
	MailketingRolePermissionDoc,
	MailketingSendLogDoc,
	MailketingUserProfileDoc,
	MailketingUserRoleDoc,
} from "./schema.js";
import {
	getAuditCollection,
	getPermissionCollection,
	getRoleCollection,
	getRolePermissionsCollection,
	getSendLogCollection,
	getUserProfileCollection,
	getUserRolesCollection,
	type MailketingStorageContext,
} from "./connection.js";

// ── Settings (via ctx.kv) ────────────────────────────────────────────────────

const KV_PREFIX = "settings:";

export async function getSettingValue(
	ctx: MailketingStorageContext,
	key: string,
): Promise<string | null> {
	return ctx.kv.get<string>(`${KV_PREFIX}${key}`);
}

export async function upsertSetting(
	ctx: MailketingStorageContext,
	key: string,
	value: unknown,
): Promise<void> {
	await ctx.kv.set(`${KV_PREFIX}${key}`, value);
}

// ── Send Log ─────────────────────────────────────────────────────────────────

export async function insertSendLog(
	ctx: MailketingStorageContext,
	doc: MailketingSendLogDoc,
): Promise<void> {
	await getSendLogCollection(ctx).put(doc.id, doc);
}

export async function updateSendLogStatus(
	ctx: MailketingStorageContext,
	id: string,
	status: string,
	providerMessageId: string | null,
	errorMessage: string | null,
	responseJson: string | null,
	sentAt: string | null,
): Promise<void> {
	const col = getSendLogCollection(ctx);
	const existing = await col.get(id);
	if (!existing) return;
	const now = new Date().toISOString();
	await col.put(id, {
		...existing,
		status,
		providerMessageId,
		errorMessage,
		responseJson,
		sentAt,
		updatedAt: now,
	});
}

export async function listSendLog(
	ctx: MailketingStorageContext,
	opts: {
		page: number;
		pageSize: number;
		status?: string;
		recipient?: string;
		includeDeleted?: boolean;
	},
): Promise<{ items: MailketingSendLogDoc[]; total: number }> {
	const col = getSendLogCollection(ctx);

	// Fetch all, filter in-memory (admin use-case; datasets are small)
	const all = await col.query({ limit: 1000, orderBy: { createdAt: "desc" } });
	let items = all.items.map((r) => r.data);

	if (!opts.includeDeleted) {
		items = items.filter((e) => !e.deletedAt);
	}
	if (opts.status) {
		items = items.filter((e) => e.status === opts.status);
	}
	if (opts.recipient) {
		const lc = opts.recipient.toLowerCase();
		items = items.filter((e) => e.recipient.toLowerCase().includes(lc));
	}

	const total = items.length;
	const offset = (opts.page - 1) * opts.pageSize;
	return { items: items.slice(offset, offset + opts.pageSize), total };
}

export async function getSendLogById(
	ctx: MailketingStorageContext,
	id: string,
): Promise<MailketingSendLogDoc | null> {
	return getSendLogCollection(ctx).get(id);
}

export async function softDeleteSendLog(
	ctx: MailketingStorageContext,
	id: string,
): Promise<void> {
	const col = getSendLogCollection(ctx);
	const existing = await col.get(id);
	if (!existing || existing.deletedAt) return;
	const now = new Date().toISOString();
	await col.put(id, { ...existing, deletedAt: now, updatedAt: now });
}

export async function restoreSendLog(
	ctx: MailketingStorageContext,
	id: string,
): Promise<void> {
	const col = getSendLogCollection(ctx);
	const existing = await col.get(id);
	if (!existing) return;
	const now = new Date().toISOString();
	await col.put(id, { ...existing, deletedAt: null, updatedAt: now });
}

export async function permanentDeleteSendLog(
	ctx: MailketingStorageContext,
	id: string,
): Promise<void> {
	await getSendLogCollection(ctx).delete(id);
}

export async function getSendStats(
	ctx: MailketingStorageContext,
): Promise<{ sent: number; failed: number; pending: number; last24hSent: number; last24hFailed: number }> {
	const col = getSendLogCollection(ctx);
	const all = await col.query({ limit: 1000 });
	const items = all.items.map((r) => r.data).filter((e) => !e.deletedAt);
	const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

	let sent = 0, failed = 0, pending = 0, last24hSent = 0, last24hFailed = 0;
	for (const item of items) {
		if (item.status === "sent") sent++;
		else if (item.status === "failed") failed++;
		else if (item.status === "pending") pending++;
		if (item.createdAt >= since24h) {
			if (item.status === "sent") last24hSent++;
			else if (item.status === "failed") last24hFailed++;
		}
	}
	return { sent, failed, pending, last24hSent, last24hFailed };
}

// ── Permissions ───────────────────────────────────────────────────────────────

export async function listPermissions(
	ctx: MailketingStorageContext,
): Promise<MailketingPermissionDoc[]> {
	const all = await getPermissionCollection(ctx).query({ limit: 200 });
	return all.items.map((r) => r.data).filter((p) => !p.deletedAt);
}

export async function upsertPermission(
	ctx: MailketingStorageContext,
	doc: MailketingPermissionDoc,
): Promise<void> {
	await getPermissionCollection(ctx).put(doc.id, doc);
}

// ── Roles ─────────────────────────────────────────────────────────────────────

export async function listRoles(
	ctx: MailketingStorageContext,
	opts: { page: number; pageSize: number },
): Promise<{ items: MailketingRoleDoc[]; total: number }> {
	const all = await getRoleCollection(ctx).query({ limit: 200 });
	const active = all.items.map((r) => r.data).filter((r) => !r.deletedAt);
	const total = active.length;
	const offset = (opts.page - 1) * opts.pageSize;
	return { items: active.slice(offset, offset + opts.pageSize), total };
}

export async function getRoleById(
	ctx: MailketingStorageContext,
	id: string,
): Promise<MailketingRoleDoc | null> {
	const doc = await getRoleCollection(ctx).get(id);
	if (!doc || doc.deletedAt) return null;
	return doc;
}

export async function getRoleBySlug(
	ctx: MailketingStorageContext,
	slug: string,
): Promise<MailketingRoleDoc | null> {
	const all = await getRoleCollection(ctx).query({ limit: 200 });
	return all.items.map((r) => r.data).find((r) => r.slug === slug && !r.deletedAt) ?? null;
}

export async function insertRole(
	ctx: MailketingStorageContext,
	doc: MailketingRoleDoc,
): Promise<void> {
	await getRoleCollection(ctx).put(doc.id, doc);
}

export async function updateRole(
	ctx: MailketingStorageContext,
	id: string,
	label: string,
	description: string | null,
): Promise<void> {
	const col = getRoleCollection(ctx);
	const existing = await col.get(id);
	if (!existing || existing.deletedAt) return;
	const now = new Date().toISOString();
	await col.put(id, { ...existing, label, description, updatedAt: now });
}

export async function softDeleteRole(
	ctx: MailketingStorageContext,
	id: string,
): Promise<void> {
	const col = getRoleCollection(ctx);
	const existing = await col.get(id);
	if (!existing || existing.deletedAt || existing.isSystemRole) return;
	const now = new Date().toISOString();
	await col.put(id, { ...existing, deletedAt: now, updatedAt: now });
}

// ── Role-Permission Assignments ───────────────────────────────────────────────

export async function setRolePermissions(
	ctx: MailketingStorageContext,
	roleId: string,
	permissionIds: string[],
	createdBy: string | null,
): Promise<void> {
	const col = getRolePermissionsCollection(ctx);

	// Remove existing assignments for this role
	const existing = await col.query({ limit: 200 });
	const toDelete = existing.items.filter((r) => r.data.roleId === roleId);
	if (toDelete.length > 0) {
		await col.deleteMany(toDelete.map((r) => r.id));
	}

	// Insert new assignments
	const now = new Date().toISOString();
	const newDocs = permissionIds.map((permId) => ({
		id: `${roleId}:${permId}`,
		data: { roleId, permissionId: permId, createdAt: now, createdBy } satisfies MailketingRolePermissionDoc,
	}));
	if (newDocs.length > 0) {
		await col.putMany(newDocs);
	}
}

export async function getRolePermissions(
	ctx: MailketingStorageContext,
	roleId: string,
): Promise<MailketingRolePermissionDoc[]> {
	const all = await getRolePermissionsCollection(ctx).query({ limit: 200 });
	return all.items.map((r) => r.data).filter((r) => r.roleId === roleId);
}

// ── User Role Assignments ─────────────────────────────────────────────────────

export async function getUserRoles(
	ctx: MailketingStorageContext,
	userId: string,
): Promise<MailketingUserRoleDoc[]> {
	const all = await getUserRolesCollection(ctx).query({ limit: 200 });
	return all.items.map((r) => r.data).filter((r) => r.userId === userId && !r.deletedAt);
}

export async function assignUserRole(
	ctx: MailketingStorageContext,
	userId: string,
	roleId: string,
	createdBy: string | null,
): Promise<void> {
	const docId = `${userId}:${roleId}`;
	const now = new Date().toISOString();
	const doc: MailketingUserRoleDoc = {
		userId,
		roleId,
		createdAt: now,
		updatedAt: now,
		deletedAt: null,
		createdBy,
		updatedBy: createdBy,
	};
	await getUserRolesCollection(ctx).put(docId, doc);
}

export async function revokeUserRole(
	ctx: MailketingStorageContext,
	userId: string,
	roleId: string,
): Promise<void> {
	const docId = `${userId}:${roleId}`;
	const col = getUserRolesCollection(ctx);
	const existing = await col.get(docId);
	if (!existing || existing.deletedAt) return;
	const now = new Date().toISOString();
	await col.put(docId, { ...existing, deletedAt: now, updatedAt: now });
}

// ── User Profile ──────────────────────────────────────────────────────────────

export async function getUserProfile(
	ctx: MailketingStorageContext,
	userId: string,
): Promise<MailketingUserProfileDoc | null> {
	const doc = await getUserProfileCollection(ctx).get(userId);
	if (!doc || doc.deletedAt) return null;
	return doc;
}

export async function upsertUserProfile(
	ctx: MailketingStorageContext,
	userId: string,
	displayName: string | null,
	phone: string | null,
	meta: Record<string, unknown> | null,
	updatedBy: string | null,
): Promise<void> {
	const col = getUserProfileCollection(ctx);
	const existing = await col.get(userId);
	const now = new Date().toISOString();
	const doc: MailketingUserProfileDoc = {
		userId,
		displayName,
		phone,
		meta: meta ?? existing?.meta ?? {},
		createdAt: existing?.createdAt ?? now,
		updatedAt: now,
		deletedAt: null,
		updatedBy,
	};
	await col.put(userId, doc);
}

// ── Audit Events ──────────────────────────────────────────────────────────────

export async function insertAuditEvent(
	ctx: MailketingStorageContext,
	doc: MailketingAuditEventDoc,
): Promise<void> {
	await getAuditCollection(ctx).put(doc.id, doc);
}

export async function listAuditEvents(
	ctx: MailketingStorageContext,
	opts: {
		page: number;
		pageSize: number;
		eventKind?: string;
		actorId?: string;
	},
): Promise<{ items: MailketingAuditEventDoc[]; total: number }> {
	const all = await getAuditCollection(ctx).query({ limit: 1000, orderBy: { createdAt: "desc" } });
	let items = all.items.map((r) => r.data);

	if (opts.eventKind) {
		items = items.filter((e) => e.eventKind === opts.eventKind);
	}
	if (opts.actorId) {
		items = items.filter((e) => e.actorId === opts.actorId);
	}

	const total = items.length;
	const offset = (opts.page - 1) * opts.pageSize;
	return { items: items.slice(offset, offset + opts.pageSize), total };
}

// ── Built-in data bootstrap ───────────────────────────────────────────────────

export async function ensureDefaultPermissions(
	ctx: MailketingStorageContext,
	tenantId: string,
	siteId: string,
): Promise<void> {
	void tenantId; void siteId; // scoped by plugin ID in storage
	const existing = await listPermissions(ctx);
	if (existing.length > 0) return;

	const now = new Date().toISOString();
	const perms: MailketingPermissionDoc[] = [
		{ id: "perm-mk-view-log",    slug: "mailketing.send_log.view",   label: "View Send Log",    description: "Can view the email send log",             scope: "plugin", createdAt: now, updatedAt: now, deletedAt: null },
		{ id: "perm-mk-delete-log",  slug: "mailketing.send_log.delete", label: "Delete Send Log",  description: "Can soft-delete send log entries",        scope: "plugin", createdAt: now, updatedAt: now, deletedAt: null },
		{ id: "perm-mk-manage-set",  slug: "mailketing.settings.manage", label: "Manage Settings",  description: "Can update plugin settings and API key",  scope: "plugin", createdAt: now, updatedAt: now, deletedAt: null },
		{ id: "perm-mk-manage-role", slug: "mailketing.access.manage",   label: "Manage Access",    description: "Can manage roles and user assignments",   scope: "plugin", createdAt: now, updatedAt: now, deletedAt: null },
		{ id: "perm-mk-view-audit",  slug: "mailketing.audit.view",      label: "View Audit Log",   description: "Can view the audit trail",                scope: "plugin", createdAt: now, updatedAt: now, deletedAt: null },
	];
	await getPermissionCollection(ctx).putMany(perms.map((p) => ({ id: p.id, data: p })));
}

export async function ensureDefaultRoles(
	ctx: MailketingStorageContext,
): Promise<void> {
	const existing = await listRoles(ctx, { page: 1, pageSize: 10 });
	if (existing.total > 0) return;

	const now = new Date().toISOString();
	const roles: MailketingRoleDoc[] = [
		{ id: "role-mk-admin",  slug: "mailketing_admin",  label: "Mailketing Admin",  description: "Full access to Email Mailketing plugin",     isSystemRole: true,  createdAt: now, updatedAt: now, deletedAt: null, createdBy: null },
		{ id: "role-mk-viewer", slug: "mailketing_viewer", label: "Mailketing Viewer", description: "Read-only access to send log and audit log", isSystemRole: false, createdAt: now, updatedAt: now, deletedAt: null, createdBy: null },
	];
	await getRoleCollection(ctx).putMany(roles.map((r) => ({ id: r.id, data: r })));

	await setRolePermissions(ctx, "role-mk-admin", [
		"perm-mk-view-log",
		"perm-mk-delete-log",
		"perm-mk-manage-set",
		"perm-mk-manage-role",
		"perm-mk-view-audit",
	], null);

	await setRolePermissions(ctx, "role-mk-viewer", [
		"perm-mk-view-log",
		"perm-mk-view-audit",
	], null);
}

export async function ensureDefaultSettings(
	ctx: MailketingStorageContext,
	defaultFromEmail: string,
	defaultFromName: string,
): Promise<void> {
	const existing = await ctx.kv.get<string>("settings:api_token");
	if (existing !== null) return; // already initialized

	await ctx.kv.set("settings:from_email", defaultFromEmail);
	await ctx.kv.set("settings:from_name", defaultFromName);
	await ctx.kv.set("settings:enabled", true);
	await ctx.kv.set("settings:log_outbound", true);
	// Note: api_token is NOT set here; the admin must configure it via Settings page
}
