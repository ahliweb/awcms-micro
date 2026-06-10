import type {
	PluginContext,
	PluginRoute as NativePluginRoute,
	PluginStorageConfig,
	StorageCollection,
} from "emdash";
import { PluginRouteError } from "emdash";
import type { EmailDeliverEvent } from "emdash/plugin";

import {
	MAILKETING_PLUGIN_ID,
	normalizeMailketingPage,
	type MailketingAuditListRequest,
	type MailketingRoleCreateRequest,
	type MailketingRoleDeleteRequest,
	type MailketingRoleUpdateRequest,
	type MailketingSendLogDetailRequest,
	type MailketingSendLogListRequest,
	type MailketingSendLogPermanentDeleteRequest,
	type MailketingSendLogRestoreRequest,
	type MailketingSendLogSoftDeleteRequest,
	type MailketingSettingsSaveRequest,
	type MailketingRoleListRequest,
	type MailketingUserListRequest,
	type MailketingUserRoleAssignRequest,
	type MailketingUserRoleRevokeRequest,
} from "./contracts/index.js";
import {
	assignUserRole,
	ensureDefaultPermissions,
	ensureDefaultRoles,
	ensureDefaultSettings,
	getRoleById,
	getSendLogById,
	getSendStats,
	getSettingValue,
	getUserProfile,
	getUserRoles,
	insertAuditEvent,
	insertRole,
	insertSendLog,
	listAuditEvents,
	listPermissions,
	listRoles,
	listSendLog,
	permanentDeleteSendLog,
	restoreSendLog,
	revokeUserRole,
	setRolePermissions,
	softDeleteRole,
	softDeleteSendLog,
	updateRole,
	updateSendLogStatus,
	upsertPermission,
	upsertSetting,
	upsertUserProfile,
	type MailketingRoleDoc,
	type MailketingSendLogDoc,
	type MailketingStorageContext,
} from "./db/index.js";
import { MAILKETING_PO_LOCALE_MESSAGES } from "./locales/messages.js";
import { createMailketingClient } from "./services/mailketing-api.js";

export const AWCMS_MAILKETING_PLUGIN_ID = MAILKETING_PLUGIN_ID;

export const AWCMS_MAILKETING_ADMIN_PAGES = [
	{ path: "/overview", label: "Overview", labelKey: "mailketing.nav.overview", icon: "stack" },
	{ path: "/send-log", label: "Send Log", labelKey: "mailketing.nav.sendLog", icon: "list" },
	{ path: "/settings", label: "Settings", labelKey: "mailketing.nav.settings", icon: "gear" },
	{ path: "/access/users", label: "Users", labelKey: "mailketing.nav.users", icon: "users" },
	{ path: "/access/roles", label: "Roles", labelKey: "mailketing.nav.roles", icon: "shield" },
	{
		path: "/access/permissions",
		label: "Permissions",
		labelKey: "mailketing.nav.permissions",
		icon: "lock",
	},
	{ path: "/audit", label: "Audit Log", labelKey: "mailketing.nav.audit", icon: "list" },
] as const;

export const AWCMS_MAILKETING_ADMIN_WIDGETS = [
	{ id: "email-status", title: "Email Status", size: "half" as const },
	{ id: "send-stats", title: "Send Statistics", size: "half" as const },
];

export const AWCMS_MAILKETING_CAPABILITIES = ["email:provide", "network:request", "users:read"] as const;
export const AWCMS_MAILKETING_ALLOWED_HOSTS = ["api.mailketing.co.id"] as const;

export const AWCMS_MAILKETING_STORAGE: PluginStorageConfig = {
	mailketing_send_log: {
		indexes: ["status", "recipient", "createdAt", "deletedAt"],
	},
	mailketing_permission_catalog: {
		indexes: ["slug", "scope"],
	},
	mailketing_role_catalog: {
		indexes: ["slug"],
	},
	mailketing_role_permission_assignments: {
		indexes: ["roleId", "permissionId"],
	},
	mailketing_user_role_assignments: {
		indexes: ["userId", "roleId"],
	},
	mailketing_user_profile: {
		indexes: ["userId"],
	},
	mailketing_audit_events: {
		indexes: ["eventKind", "actorId", "createdAt"],
	},
};

export const AWCMS_MAILKETING_DESCRIPTOR_STORAGE = AWCMS_MAILKETING_STORAGE;

export const AWCMS_MAILKETING_MANIFEST = {
	i18n: {
		defaultLocale: "en",
		locales: ["en", "id"],
		messages: MAILKETING_PO_LOCALE_MESSAGES,
	},
};

// ── Plugin options ────────────────────────────────────────────────────────────

export interface MailketingRuntimeOptions {
	tenantId?: string;
	siteId?: string;
	defaultFromEmail?: string;
	defaultFromName?: string;
}

const DEFAULT_FROM_EMAIL = "sender@satpamsiber.com";
const DEFAULT_FROM_NAME = "AWCMS Email";

// ── Settings helpers ──────────────────────────────────────────────────────────

async function readSettings(ctx: MailketingStorageContext) {
	const apiToken = await getSettingValue(ctx, "api_token");
	const fromEmail = await getSettingValue(ctx, "from_email");
	const fromName = await getSettingValue(ctx, "from_name");
	const enabled = await ctx.kv.get<boolean>("settings:enabled");
	const logOutbound = await ctx.kv.get<boolean>("settings:log_outbound");

	return {
		apiToken: typeof apiToken === "string" ? apiToken : "",
		fromEmail: typeof fromEmail === "string" ? fromEmail : DEFAULT_FROM_EMAIL,
		fromName: typeof fromName === "string" ? fromName : DEFAULT_FROM_NAME,
		enabled: typeof enabled === "boolean" ? enabled : true,
		logOutbound: typeof logOutbound === "boolean" ? logOutbound : true,
	};
}

function generateId(): string {
	return `mk_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function ctxToStorage(ctx: PluginContext): MailketingStorageContext {
	return {
		storage: ctx.storage as Record<string, StorageCollection>,
		kv: ctx.kv,
	};
}

// ── Email deliver hook ────────────────────────────────────────────────────────

export function createSharedHooks(options: MailketingRuntimeOptions = {}) {
	return {
		"email:deliver": {
			exclusive: true,
			priority: 100,
			timeout: 30000,
			handler: async (event: EmailDeliverEvent, ctx: PluginContext) => {
				const s = ctxToStorage(ctx);

				await ensureDefaultSettings(
					s,
					options.defaultFromEmail ?? DEFAULT_FROM_EMAIL,
					options.defaultFromName ?? DEFAULT_FROM_NAME,
				);
				await ensureDefaultPermissions(s, options.tenantId ?? "default", options.siteId ?? "default");
				await ensureDefaultRoles(s);

				const settings = await readSettings(s);

				if (!settings.apiToken) {
					throw new Error("Mailketing API token not configured. Go to Email Mailketing > Settings.");
				}
				if (!settings.enabled) {
					throw new Error("Mailketing email provider is disabled.");
				}
				if (!settings.fromEmail) {
					throw new Error("Mailketing sender email not configured.");
				}

				const fetchFn = ctx.http?.fetch;
				if (!fetchFn) {
					throw new Error("HTTP fetch is not available. Ensure network:request capability is enabled.");
				}

				const client = createMailketingClient(settings.apiToken, fetchFn as typeof fetch);
				const logId = generateId();
				const now = new Date().toISOString();

				if (settings.logOutbound) {
					const logEntry: MailketingSendLogDoc = {
						id: logId,
						recipient: event.message.to,
						subject: event.message.subject,
						source: event.source ?? "system",
						status: "pending",
						providerMessageId: null,
						errorMessage: null,
						requestPayloadJson: JSON.stringify({ to: event.message.to, subject: event.message.subject }),
						responseJson: null,
						sentAt: null,
						createdAt: now,
						updatedAt: now,
						deletedAt: null,
						createdBy: null,
					};
					await insertSendLog(s, logEntry);
				}

				try {
					const result = await client.sendEmail({
						recipient: event.message.to,
						from_email: settings.fromEmail,
						from_name: settings.fromName,
						subject: event.message.subject,
						content: event.message.html ?? event.message.text ?? "",
					});

					if (settings.logOutbound) {
						await updateSendLogStatus(
							s,
							logId,
							result.success ? "sent" : "failed",
							result.message_id ?? null,
							result.success ? null : (result.error ?? result.message ?? "Unknown error"),
							JSON.stringify(result),
							result.success ? new Date().toISOString() : null,
						);
					}

					if (!result.success) {
						throw new Error(`Mailketing delivery failed: ${result.error ?? result.message ?? "Unknown"}`);
					}
				} catch (err) {
					if (settings.logOutbound) {
						await updateSendLogStatus(s, logId, "failed", null, err instanceof Error ? err.message : String(err), null, null).catch(() => void 0);
					}
					throw err;
				}
			},
		},
	};
}

// ── Native routes ─────────────────────────────────────────────────────────────

export function createNativeRoutes(
	options: MailketingRuntimeOptions = {},
): Record<string, NativePluginRoute> {
	const bootstrap = async (s: MailketingStorageContext) => {
		await ensureDefaultSettings(s, options.defaultFromEmail ?? DEFAULT_FROM_EMAIL, options.defaultFromName ?? DEFAULT_FROM_NAME);
		await ensureDefaultPermissions(s, options.tenantId ?? "default", options.siteId ?? "default");
		await ensureDefaultRoles(s);
	};

	return {
		// ── Overview ──────────────────────────────────────────────────────────
		"overview/stats": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				await bootstrap(s);
				const settings = await readSettings(s);
				const stats = await getSendStats(s);
				return {
					totalSent: stats.sent,
					totalFailed: stats.failed,
					totalPending: stats.pending,
					last24hSent: stats.last24hSent,
					last24hFailed: stats.last24hFailed,
					providerConfigured: !!settings.apiToken && !!settings.fromEmail,
					providerEnabled: settings.enabled,
					fromEmail: settings.fromEmail,
					fromName: settings.fromName,
				};
			},
		},

		// ── Send Log ─────────────────────────────────────────────────────────
		"send-log/list": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				const body = ctx.input as MailketingSendLogListRequest;
				const { page, pageSize } = normalizeMailketingPage(body?.page, body?.pageSize);
				const result = await listSendLog(s, { page, pageSize, status: body?.status, recipient: body?.recipient, includeDeleted: body?.includeDeleted });
				return { items: result.items.map(mapSendLogDoc), total: result.total, page, pageSize, totalPages: Math.ceil(result.total / pageSize) || 1 };
			},
		},

		"send-log/detail": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				const body = ctx.input as MailketingSendLogDetailRequest;
				if (!body?.id) throw PluginRouteError.badRequest("id is required");
				const doc = await getSendLogById(s, body.id);
				if (!doc) throw PluginRouteError.notFound("Send log entry not found");
				return mapSendLogDoc(doc);
			},
		},

		"send-log/soft-delete": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				const body = ctx.input as MailketingSendLogSoftDeleteRequest;
				if (!body?.id) throw PluginRouteError.badRequest("id is required");
				await softDeleteSendLog(s, body.id);
				await insertAuditEvent(s, { id: generateId(), eventKind: "send_log.soft_delete", actorId: ctx.user?.id ?? null, actorEmail: ctx.user?.email ?? null, targetType: "send_log", targetId: body.id, summary: `Send log ${body.id} soft-deleted`, detail: body.reason ? { reason: body.reason } : null, ipAddress: ctx.requestMeta?.ip ?? null, userAgent: null, createdAt: new Date().toISOString() });
				return { deleted: true };
			},
		},

		"send-log/restore": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				const body = ctx.input as MailketingSendLogRestoreRequest;
				if (!body?.id) throw PluginRouteError.badRequest("id is required");
				await restoreSendLog(s, body.id);
				return { restored: true };
			},
		},

		"send-log/permanent-delete": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				const body = ctx.input as MailketingSendLogPermanentDeleteRequest;
				if (!body?.id) throw PluginRouteError.badRequest("id is required");
				if (!body.reason?.trim()) throw PluginRouteError.badRequest("reason is required for permanent delete");
				await permanentDeleteSendLog(s, body.id);
				await insertAuditEvent(s, { id: generateId(), eventKind: "send_log.permanent_delete", actorId: ctx.user?.id ?? null, actorEmail: ctx.user?.email ?? null, targetType: "send_log", targetId: body.id, summary: `Send log ${body.id} permanently deleted`, detail: { reason: body.reason }, ipAddress: ctx.requestMeta?.ip ?? null, userAgent: null, createdAt: new Date().toISOString() });
				return { deleted: true };
			},
		},

		// ── Settings ──────────────────────────────────────────────────────────
		"settings/get": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				await bootstrap(s);
				const settings = await readSettings(s);
				return {
					settings: {
						apiToken: settings.apiToken ? "••••••••" : "",
						fromEmail: settings.fromEmail,
						fromName: settings.fromName,
						enabled: settings.enabled,
						logOutbound: settings.logOutbound,
					},
					configured: !!settings.apiToken && !!settings.fromEmail,
				};
			},
		},

		"settings/save": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				const body = ctx.input as MailketingSettingsSaveRequest;
				if (!body || typeof body !== "object") throw PluginRouteError.badRequest("Invalid request body");
				if (body.apiToken !== undefined && body.apiToken !== "••••••••") {
					await upsertSetting(s, "api_token", body.apiToken);
				}
				if (body.fromEmail !== undefined) await upsertSetting(s, "from_email", body.fromEmail);
				if (body.fromName !== undefined) await upsertSetting(s, "from_name", body.fromName);
				if (body.enabled !== undefined) await ctx.kv.set("settings:enabled", body.enabled);
				if (body.logOutbound !== undefined) await ctx.kv.set("settings:log_outbound", body.logOutbound);
				await insertAuditEvent(s, { id: generateId(), eventKind: "settings.save", actorId: ctx.user?.id ?? null, actorEmail: ctx.user?.email ?? null, targetType: "settings", targetId: null, summary: "Plugin settings updated", detail: { fields: Object.keys(body).filter((k) => k !== "apiToken") }, ipAddress: ctx.requestMeta?.ip ?? null, userAgent: null, createdAt: new Date().toISOString() });
				return { saved: true };
			},
		},

		"settings/test-connection": {
			public: false,
			handler: async (ctx) => {
				try {
					const s = ctxToStorage(ctx);
					const settings = await readSettings(s);
					if (!settings.apiToken) return { ok: false, error: "API token is not configured" };
					const fetchFn = ctx.http?.fetch;
					if (!fetchFn) return { ok: false, error: "HTTP capability not available" };
					const client = createMailketingClient(settings.apiToken, fetchFn as typeof fetch);
					return await client.testConnection();
				} catch (e) {
					return { ok: false, error: e instanceof Error ? e.message : String(e) };
				}
			},
		},

		// ── Permissions ───────────────────────────────────────────────────────
		"access/permissions/list": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				await bootstrap(s);
				const permissions = await listPermissions(s);
				return permissions.map((p) => ({ id: p.id, slug: p.slug, label: p.label, description: p.description, scope: p.scope }));
			},
		},

		// ── Roles ─────────────────────────────────────────────────────────────
		"access/roles/list": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				await bootstrap(s);
				const body = ctx.input as MailketingRoleListRequest | null | undefined;
				const { page, pageSize } = normalizeMailketingPage(body?.page, body?.pageSize);
				const result = await listRoles(s, { page, pageSize });
				return { items: result.items.map(mapRoleDoc), total: result.total, page, pageSize, totalPages: Math.ceil(result.total / pageSize) || 1 };
			},
		},

		"access/roles/create": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				const body = ctx.input as MailketingRoleCreateRequest;
				if (!body?.slug || !body?.label) throw PluginRouteError.badRequest("slug and label are required");
				const id = generateId();
				const now = new Date().toISOString();
				const doc: MailketingRoleDoc = { id, slug: body.slug, label: body.label, description: body.description ?? null, isSystemRole: false, createdAt: now, updatedAt: now, deletedAt: null, createdBy: ctx.user?.id ?? null };
				await insertRole(s, doc);
				if (body.permissionIds?.length) await setRolePermissions(s, id, body.permissionIds, ctx.user?.id ?? null);
				await insertAuditEvent(s, { id: generateId(), eventKind: "role.create", actorId: ctx.user?.id ?? null, actorEmail: ctx.user?.email ?? null, targetType: "role", targetId: id, summary: `Role '${body.label}' created`, detail: { slug: body.slug }, ipAddress: ctx.requestMeta?.ip ?? null, userAgent: null, createdAt: now });
				return { id, created: true };
			},
		},

		"access/roles/update": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				const body = ctx.input as MailketingRoleUpdateRequest;
				if (!body?.id) throw PluginRouteError.badRequest("id is required");
				if (body.label !== undefined) await updateRole(s, body.id, body.label, body.description ?? null);
				if (body.permissionIds !== undefined) await setRolePermissions(s, body.id, body.permissionIds, ctx.user?.id ?? null);
				return { updated: true };
			},
		},

		"access/roles/delete": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				const body = ctx.input as MailketingRoleDeleteRequest;
				if (!body?.id) throw PluginRouteError.badRequest("id is required");
				const role = await getRoleById(s, body.id);
				if (!role) throw PluginRouteError.notFound("Role not found");
				if (role.isSystemRole) throw PluginRouteError.badRequest("System roles cannot be deleted");
				await softDeleteRole(s, body.id);
				await insertAuditEvent(s, { id: generateId(), eventKind: "role.delete", actorId: ctx.user?.id ?? null, actorEmail: ctx.user?.email ?? null, targetType: "role", targetId: body.id, summary: `Role '${role.label}' deleted`, detail: null, ipAddress: ctx.requestMeta?.ip ?? null, userAgent: null, createdAt: new Date().toISOString() });
				return { deleted: true };
			},
		},

		// ── Users ─────────────────────────────────────────────────────────────
		"access/users/list": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				await bootstrap(s);
				if (!ctx.users) throw PluginRouteError.internal("users:read capability is not available");
				const body = ctx.input as MailketingUserListRequest | null | undefined;
				const { page, pageSize } = normalizeMailketingPage(body?.page, body?.pageSize);
				const emdashUsers = await ctx.users.list({ limit: 100 });
				const items = await Promise.all(
					emdashUsers.items.map(async (u) => {
						const userRoleDocs = await getUserRoles(s, u.id);
						const profile = await getUserProfile(s, u.id);
						const roleDetails = await Promise.all(userRoleDocs.map(async (ur) => { const role = await getRoleById(s, ur.roleId); return role ? mapRoleDoc(role) : null; }));
						return { userId: u.id, email: u.email, name: u.name ?? null, roles: roleDetails.filter((r): r is NonNullable<typeof r> => r !== null), profile: profile ? { userId: profile.userId, displayName: profile.displayName, phone: profile.phone, meta: profile.meta, createdAt: profile.createdAt, updatedAt: profile.updatedAt } : null };
					}),
				);
				const total = items.length;
				const offset = (page - 1) * pageSize;
				return { items: items.slice(offset, offset + pageSize), total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
			},
		},

		"access/users/assign-role": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				const body = ctx.input as MailketingUserRoleAssignRequest;
				if (!body?.userId || !body?.roleId) throw PluginRouteError.badRequest("userId and roleId are required");
				await assignUserRole(s, body.userId, body.roleId, ctx.user?.id ?? null);
				await insertAuditEvent(s, { id: generateId(), eventKind: "user_role.assign", actorId: ctx.user?.id ?? null, actorEmail: ctx.user?.email ?? null, targetType: "user", targetId: body.userId, summary: `Role ${body.roleId} assigned to user ${body.userId}`, detail: { roleId: body.roleId }, ipAddress: ctx.requestMeta?.ip ?? null, userAgent: null, createdAt: new Date().toISOString() });
				return { assigned: true };
			},
		},

		"access/users/revoke-role": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				const body = ctx.input as MailketingUserRoleRevokeRequest;
				if (!body?.userId || !body?.roleId) throw PluginRouteError.badRequest("userId and roleId are required");
				await revokeUserRole(s, body.userId, body.roleId);
				await insertAuditEvent(s, { id: generateId(), eventKind: "user_role.revoke", actorId: ctx.user?.id ?? null, actorEmail: ctx.user?.email ?? null, targetType: "user", targetId: body.userId, summary: `Role ${body.roleId} revoked from user ${body.userId}`, detail: { roleId: body.roleId }, ipAddress: ctx.requestMeta?.ip ?? null, userAgent: null, createdAt: new Date().toISOString() });
				return { revoked: true };
			},
		},

		"access/users/profile/save": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				const body = ctx.input as { userId: string; displayName?: string; phone?: string; meta?: Record<string, unknown> };
				if (!body?.userId) throw PluginRouteError.badRequest("userId is required");
				await upsertUserProfile(s, body.userId, body.displayName ?? null, body.phone ?? null, body.meta ?? null, ctx.user?.id ?? null);
				return { saved: true };
			},
		},

		// ── Audit ─────────────────────────────────────────────────────────────
		"audit/list": {
			public: false,
			handler: async (ctx) => {
				const s = ctxToStorage(ctx);
				const body = ctx.input as MailketingAuditListRequest | null | undefined;
				const { page, pageSize } = normalizeMailketingPage(body?.page, body?.pageSize);
				const result = await listAuditEvents(s, { page, pageSize, eventKind: body?.eventKind, actorId: body?.actorId });
				return { items: result.items.map((e) => ({ id: e.id, eventKind: e.eventKind, actorId: e.actorId, actorEmail: e.actorEmail, targetType: e.targetType, targetId: e.targetId, summary: e.summary, detail: e.detail, ipAddress: e.ipAddress, userAgent: e.userAgent, createdAt: e.createdAt })), total: result.total, page, pageSize, totalPages: Math.ceil(result.total / pageSize) || 1 };
			},
		},
	};
}

// ── Row mappers ───────────────────────────────────────────────────────────────

function mapSendLogDoc(doc: MailketingSendLogDoc) {
	return { id: doc.id, recipient: doc.recipient, subject: doc.subject, source: doc.source, status: doc.status, providerMessageId: doc.providerMessageId, errorMessage: doc.errorMessage, sentAt: doc.sentAt, createdAt: doc.createdAt, updatedAt: doc.updatedAt, deletedAt: doc.deletedAt };
}

function mapRoleDoc(doc: MailketingRoleDoc) {
	return { id: doc.id, slug: doc.slug, label: doc.label, description: doc.description, isSystemRole: doc.isSystemRole, createdAt: doc.createdAt, updatedAt: doc.updatedAt, deletedAt: doc.deletedAt };
}

// ── Sandbox / Settings schema ─────────────────────────────────────────────────

export function createSandboxRoutes() {
	return {} as Record<string, never>;
}

export const AWCMS_MAILKETING_SETTINGS_SCHEMA = {
	type: "object" as const,
	properties: {
		apiToken: { type: "string" as const },
		fromEmail: { type: "string" as const },
		fromName: { type: "string" as const },
		enabled: { type: "boolean" as const },
		logOutbound: { type: "boolean" as const },
	},
};

export { upsertPermission };
