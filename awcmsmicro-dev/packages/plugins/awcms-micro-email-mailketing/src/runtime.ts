import type {
	PluginContext,
	PluginRoute as NativePluginRoute,
	PluginStorageConfig,
} from "emdash";
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
	requireMailketingD1Database,
	restoreSendLog,
	assignUserRole,
	revokeUserRole,
	setRolePermissions,
	softDeleteRole,
	softDeleteSendLog,
	updateRole,
	updateSendLogStatus,
	upsertPermission,
	upsertSetting,
	upsertUserProfile,
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
export const AWCMS_MAILKETING_ALLOWED_HOSTS = ["mailketing.co.id"] as const;

export const AWCMS_MAILKETING_STORAGE: PluginStorageConfig = {
	mailketing_send_log: {
		indexes: ["timestamp", "status", "recipient"],
	},
	mailketing_settings_state: {
		indexes: ["key", "updatedAt"],
	},
};

export const AWCMS_MAILKETING_DESCRIPTOR_STORAGE = {
	mailketing_send_log: {
		indexes: ["timestamp", "status", "recipient", ["status", "timestamp"]],
	},
	mailketing_settings_state: {
		indexes: ["key", "updatedAt"],
	},
};

export const AWCMS_MAILKETING_MANIFEST = {
	i18n: {
		defaultLocale: "en",
		locales: ["en", "id"],
		messages: MAILKETING_PO_LOCALE_MESSAGES,
	},
};

// ── Settings helpers ──────────────────────────────────────────────────────────

const DEFAULT_TENANT = "default";
const DEFAULT_SITE = "default";

function getScope(options: MailketingRuntimeOptions = {}) {
	return {
		tenantId: options.tenantId ?? DEFAULT_TENANT,
		siteId: options.siteId ?? DEFAULT_SITE,
	};
}

async function readSettings(db: ReturnType<typeof requireMailketingD1Database>, scope: ReturnType<typeof getScope>) {
	const apiToken = await getSettingValue(db, scope, "api_token");
	const fromEmail = await getSettingValue(db, scope, "from_email");
	const fromName = await getSettingValue(db, scope, "from_name");
	const enabled = await getSettingValue(db, scope, "enabled");
	const logOutbound = await getSettingValue(db, scope, "log_outbound");

	return {
		apiToken: apiToken ? JSON.parse(apiToken) as string : "",
		fromEmail: fromEmail ? JSON.parse(fromEmail) as string : "",
		fromName: fromName ? JSON.parse(fromName) as string : "AWCMS Email",
		enabled: enabled ? JSON.parse(enabled) as boolean : true,
		logOutbound: logOutbound ? JSON.parse(logOutbound) as boolean : true,
	};
}

function generateId(): string {
	return `mk_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

// ── Email deliver hook ────────────────────────────────────────────────────────

export interface MailketingRuntimeOptions {
	tenantId?: string;
	siteId?: string;
}

export function createSharedHooks(options: MailketingRuntimeOptions = {}) {
	return {
		"email:deliver": {
			priority: 100,
			timeout: 30000,
			handler: async (event: EmailDeliverEvent, ctx: PluginContext) => {
				const db = requireMailketingD1Database(
					(ctx as unknown as { db?: unknown }).db as ReturnType<typeof requireMailketingD1Database> | undefined,
				);
				const scope = getScope(options);
				const settings = await readSettings(db, scope);

				if (!settings.apiToken) {
					throw new Error("Mailketing API token is not configured. Go to Email Mailketing > Settings.");
				}
				if (!settings.enabled) {
					throw new Error("Mailketing email provider is disabled in settings.");
				}
				if (!settings.fromEmail) {
					throw new Error("Mailketing sender email is not configured.");
				}

				const fetchFn = ctx.http?.fetch;
				if (!fetchFn) {
					throw new Error("HTTP fetch is not available. Ensure network:request capability is enabled.");
				}

				const client = createMailketingClient(settings.apiToken, fetchFn as typeof fetch);

				const logId = generateId();
				const now = new Date().toISOString();

				if (settings.logOutbound) {
					await insertSendLog(db, scope, {
						id: logId,
						recipient: event.message.to,
						subject: event.message.subject,
						source: event.source,
						status: "pending",
						provider_message_id: null,
						error_message: null,
						request_payload_json: JSON.stringify({
							to: event.message.to,
							subject: event.message.subject,
						}),
						response_json: null,
						sent_at: null,
						created_at: now,
						updated_at: now,
						deleted_at: null,
						created_by: null,
					});
				}

				try {
					const result = await client.sendEmail({
						to: event.message.to,
						from: settings.fromEmail,
						from_name: settings.fromName,
						subject: event.message.subject,
						text: event.message.text,
						html: event.message.html,
					});

					if (settings.logOutbound) {
						await updateSendLogStatus(
							db,
							scope,
							logId,
							result.success ? "sent" : "failed",
							result.message_id ?? null,
							result.success ? null : (result.error ?? result.message ?? "Unknown error"),
							JSON.stringify(result),
							result.success ? new Date().toISOString() : null,
						);
					}

					if (!result.success) {
						throw new Error(`Mailketing delivery failed: ${result.error ?? result.message ?? "Unknown error"}`);
					}
				} catch (err) {
					if (settings.logOutbound) {
						await updateSendLogStatus(
							db,
							scope,
							logId,
							"failed",
							null,
							err instanceof Error ? err.message : String(err),
							null,
							null,
						).catch(() => void 0);
					}
					throw err;
				}
			},
		},
	};
}

// ── Admin routes ──────────────────────────────────────────────────────────────

type RouteMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

function ok<T>(data: T) {
	return new Response(JSON.stringify({ success: true, data }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

function err(message: string, status = 400) {
	return new Response(JSON.stringify({ success: false, error: message }), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

async function parseBody<T>(request: Request): Promise<T> {
	const text = await request.text();
	return JSON.parse(text) as T;
}

export function createNativeRoutes(options: MailketingRuntimeOptions = {}): Record<string, NativePluginRoute & { method: RouteMethod }> {
	const scope = getScope(options);

	return {
		// ── Overview ──────────────────────────────────────────────────────────
		"overview/stats": {
			method: "GET",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const settings = await readSettings(db, scope);
					const stats = await getSendStats(db, scope);
					return ok({
						totalSent: stats.sent,
						totalFailed: stats.failed,
						totalPending: stats.pending,
						last24hSent: stats.last24hSent,
						last24hFailed: stats.last24hFailed,
						providerConfigured: !!settings.apiToken && !!settings.fromEmail,
						providerEnabled: settings.enabled,
						fromEmail: settings.fromEmail,
						fromName: settings.fromName,
					});
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		// ── Send Log CRUD ─────────────────────────────────────────────────────
		"send-log/list": {
			method: "POST",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const body = await parseBody<MailketingSendLogListRequest>(ctx.request);
					const { page, pageSize } = normalizeMailketingPage(body.page, body.pageSize);
					const result = await listSendLog(db, scope, {
						page,
						pageSize,
						status: body.status,
						recipient: body.recipient,
						includeDeleted: body.includeDeleted,
					});
					return ok({
						items: result.items.map(mapSendLogRow),
						total: result.total,
						page,
						pageSize,
						totalPages: Math.ceil(result.total / pageSize),
					});
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		"send-log/detail": {
			method: "POST",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const body = await parseBody<MailketingSendLogDetailRequest>(ctx.request);
					if (!body.id) return err("id is required");
					const { getSendLogById } = await import("./db/repositories.js");
					const row = await getSendLogById(db, scope, body.id);
					if (!row) return err("Not found", 404);
					return ok(mapSendLogRow(row));
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		"send-log/soft-delete": {
			method: "POST",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const body = await parseBody<MailketingSendLogSoftDeleteRequest>(ctx.request);
					if (!body.id) return err("id is required");
					await softDeleteSendLog(db, scope, body.id);
					await insertAuditEvent(db, scope, {
						id: generateId(),
						event_kind: "send_log.soft_delete",
						actor_id: null,
						actor_email: null,
						target_type: "send_log",
						target_id: body.id,
						summary: `Send log ${body.id} soft-deleted`,
						detail_json: body.reason ? JSON.stringify({ reason: body.reason }) : null,
						ip_address: null,
						user_agent: null,
						created_at: new Date().toISOString(),
					});
					return ok({ deleted: true });
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		"send-log/restore": {
			method: "POST",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const body = await parseBody<MailketingSendLogRestoreRequest>(ctx.request);
					if (!body.id) return err("id is required");
					await restoreSendLog(db, scope, body.id);
					return ok({ restored: true });
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		"send-log/permanent-delete": {
			method: "POST",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const body = await parseBody<MailketingSendLogPermanentDeleteRequest>(ctx.request);
					if (!body.id) return err("id is required");
					if (!body.reason || body.reason.trim().length === 0)
						return err("reason is required for permanent delete");
					await permanentDeleteSendLog(db, scope, body.id);
					await insertAuditEvent(db, scope, {
						id: generateId(),
						event_kind: "send_log.permanent_delete",
						actor_id: null,
						actor_email: null,
						target_type: "send_log",
						target_id: body.id,
						summary: `Send log ${body.id} permanently deleted`,
						detail_json: JSON.stringify({ reason: body.reason }),
						ip_address: null,
						user_agent: null,
						created_at: new Date().toISOString(),
					});
					return ok({ deleted: true });
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		// ── Settings ──────────────────────────────────────────────────────────
		"settings/get": {
			method: "GET",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const settings = await readSettings(db, scope);
					// Mask API token for security — only indicate whether it's set
					return ok({
						settings: {
							apiToken: settings.apiToken ? "••••••••" : "",
							fromEmail: settings.fromEmail,
							fromName: settings.fromName,
							enabled: settings.enabled,
							logOutbound: settings.logOutbound,
						},
						configured: !!settings.apiToken && !!settings.fromEmail,
					});
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		"settings/save": {
			method: "POST",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const body = await parseBody<MailketingSettingsSaveRequest>(ctx.request);

					if (body.apiToken !== undefined && body.apiToken !== "••••••••") {
						await upsertSetting(db, scope, "api_token", JSON.stringify(body.apiToken), null);
					}
					if (body.fromEmail !== undefined)
						await upsertSetting(db, scope, "from_email", JSON.stringify(body.fromEmail), null);
					if (body.fromName !== undefined)
						await upsertSetting(db, scope, "from_name", JSON.stringify(body.fromName), null);
					if (body.enabled !== undefined)
						await upsertSetting(db, scope, "enabled", JSON.stringify(body.enabled), null);
					if (body.logOutbound !== undefined)
						await upsertSetting(db, scope, "log_outbound", JSON.stringify(body.logOutbound), null);

					await insertAuditEvent(db, scope, {
						id: generateId(),
						event_kind: "settings.save",
						actor_id: null,
						actor_email: null,
						target_type: "settings",
						target_id: null,
						summary: "Plugin settings updated",
						detail_json: JSON.stringify({
							fields: Object.keys(body).filter((k) => k !== "apiToken"),
						}),
						ip_address: null,
						user_agent: null,
						created_at: new Date().toISOString(),
					});

					return ok({ saved: true });
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		"settings/test-connection": {
			method: "POST",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const settings = await readSettings(db, scope);

					if (!settings.apiToken) {
						return ok({ ok: false, error: "API token is not configured" });
					}

					const fetchFn = (ctx as unknown as { http?: { fetch: typeof fetch } }).http?.fetch;
					if (!fetchFn) {
						return ok({ ok: false, error: "HTTP capability not available" });
					}

					const client = createMailketingClient(settings.apiToken, fetchFn as typeof fetch);
					const result = await client.testConnection();
					return ok(result);
				} catch (e) {
					return ok({ ok: false, error: e instanceof Error ? e.message : String(e) });
				}
			},
		},

		// ── Permissions ───────────────────────────────────────────────────────
		"access/permissions/list": {
			method: "GET",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const permissions = await listPermissions(db, scope);
					return ok(permissions.map((p) => ({
						id: p.id,
						slug: p.slug,
						label: p.label,
						description: p.description,
						scope: p.scope,
					})));
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		// ── Roles CRUD ────────────────────────────────────────────────────────
		"access/roles/list": {
			method: "POST",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const body = await parseBody<MailketingRoleListRequest>(ctx.request).catch(() => ({}) as MailketingRoleListRequest);
					const { page, pageSize } = normalizeMailketingPage(
						(body as { page?: unknown }).page,
						(body as { pageSize?: unknown }).pageSize,
					);
					const result = await listRoles(db, scope, { page, pageSize });
					return ok({
						items: result.items.map(mapRoleRow),
						total: result.total,
						page,
						pageSize,
						totalPages: Math.ceil(result.total / pageSize),
					});
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		"access/roles/create": {
			method: "POST",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const body = await parseBody<MailketingRoleCreateRequest>(ctx.request);
					if (!body.slug || !body.label) return err("slug and label are required");

					const id = generateId();
					const now = new Date().toISOString();
					await insertRole(db, scope, {
						id,
						slug: body.slug,
						label: body.label,
						description: body.description ?? null,
						is_system_role: 0,
						created_at: now,
						updated_at: now,
						deleted_at: null,
						created_by: null,
					});

					if (body.permissionIds?.length) {
						await setRolePermissions(db, scope, id, body.permissionIds, null);
					}

					await insertAuditEvent(db, scope, {
						id: generateId(),
						event_kind: "role.create",
						actor_id: null,
						actor_email: null,
						target_type: "role",
						target_id: id,
						summary: `Role '${body.label}' created`,
						detail_json: JSON.stringify({ slug: body.slug }),
						ip_address: null,
						user_agent: null,
						created_at: now,
					});

					return ok({ id, created: true });
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		"access/roles/update": {
			method: "POST",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const body = await parseBody<MailketingRoleUpdateRequest>(ctx.request);
					if (!body.id) return err("id is required");

					if (body.label !== undefined) {
						await updateRole(db, scope, body.id, body.label, body.description ?? null);
					}
					if (body.permissionIds !== undefined) {
						await setRolePermissions(db, scope, body.id, body.permissionIds, null);
					}

					return ok({ updated: true });
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		"access/roles/delete": {
			method: "POST",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const body = await parseBody<MailketingRoleDeleteRequest>(ctx.request);
					if (!body.id) return err("id is required");
					await softDeleteRole(db, scope, body.id);
					await insertAuditEvent(db, scope, {
						id: generateId(),
						event_kind: "role.delete",
						actor_id: null,
						actor_email: null,
						target_type: "role",
						target_id: body.id,
						summary: `Role ${body.id} deleted`,
						detail_json: null,
						ip_address: null,
						user_agent: null,
						created_at: new Date().toISOString(),
					});
					return ok({ deleted: true });
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		// ── User access ───────────────────────────────────────────────────────
		"access/users/list": {
			method: "POST",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const body = await parseBody<MailketingUserListRequest>(ctx.request).catch(() => ({}) as MailketingUserListRequest);
					const { page, pageSize } = normalizeMailketingPage(
						(body as { page?: unknown }).page,
						(body as { pageSize?: unknown }).pageSize,
					);

					if (!ctx.users) {
						return err("users:read capability is not available", 500);
					}

					const emdashUsers = await ctx.users.list({ limit: pageSize });
					const items = await Promise.all(
						emdashUsers.items.map(async (u) => {
							const userRoles = await getUserRoles(db, scope, u.id);
							const profile = await getUserProfile(db, scope, u.id);

							const roleDetails = await Promise.all(
								userRoles.map(async (ur) => {
									const { getRoleById } = await import("./db/repositories.js");
									const role = await getRoleById(db, scope, ur.role_id);
									return role
										? {
												id: role.id,
												slug: role.slug,
												label: role.label,
												description: role.description,
												isSystemRole: role.is_system_role === 1,
												createdAt: role.created_at,
												updatedAt: role.updated_at,
												deletedAt: role.deleted_at,
											}
										: null;
								}),
							);

							return {
								userId: u.id,
								email: u.email,
								name: u.name,
								roles: roleDetails.filter(Boolean),
								profile: profile
									? {
											userId: profile.user_id,
											displayName: profile.display_name,
											phone: profile.phone,
											meta: profile.meta_json ? JSON.parse(profile.meta_json) : {},
											createdAt: profile.created_at,
											updatedAt: profile.updated_at,
										}
									: null,
							};
						}),
					);

					return ok({
						items,
						total: items.length,
						page,
						pageSize,
						totalPages: Math.ceil(items.length / pageSize),
					});
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		"access/users/assign-role": {
			method: "POST",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const body = await parseBody<MailketingUserRoleAssignRequest>(ctx.request);
					if (!body.userId || !body.roleId) return err("userId and roleId are required");
					await assignUserRole(db, scope, body.userId, body.roleId, null);
					await insertAuditEvent(db, scope, {
						id: generateId(),
						event_kind: "user_role.assign",
						actor_id: null,
						actor_email: null,
						target_type: "user",
						target_id: body.userId,
						summary: `Role ${body.roleId} assigned to user ${body.userId}`,
						detail_json: JSON.stringify({ roleId: body.roleId }),
						ip_address: null,
						user_agent: null,
						created_at: new Date().toISOString(),
					});
					return ok({ assigned: true });
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		"access/users/revoke-role": {
			method: "POST",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const body = await parseBody<MailketingUserRoleRevokeRequest>(ctx.request);
					if (!body.userId || !body.roleId) return err("userId and roleId are required");
					await revokeUserRole(db, scope, body.userId, body.roleId);
					return ok({ revoked: true });
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		"access/users/profile/save": {
			method: "POST",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const body = await parseBody<{
						userId: string;
						displayName?: string;
						phone?: string;
						meta?: Record<string, unknown>;
					}>(ctx.request);
					if (!body.userId) return err("userId is required");
					await upsertUserProfile(
						db,
						scope,
						body.userId,
						body.displayName ?? null,
						body.phone ?? null,
						body.meta ? JSON.stringify(body.meta) : null,
						null,
					);
					return ok({ saved: true });
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},

		// ── Audit ─────────────────────────────────────────────────────────────
		"audit/list": {
			method: "POST",
			public: false,
			handler: async (ctx) => {
				try {
					const db = requireMailketingD1Database(
						(ctx as unknown as { db?: unknown }).db as Parameters<typeof requireMailketingD1Database>[0],
					);
					const body = await parseBody<MailketingAuditListRequest>(ctx.request).catch(() => ({}) as MailketingAuditListRequest);
					const { page, pageSize } = normalizeMailketingPage(
						(body as { page?: unknown }).page,
						(body as { pageSize?: unknown }).pageSize,
					);
					const result = await listAuditEvents(db, scope, {
						page,
						pageSize,
						eventKind: body.eventKind,
						actorId: body.actorId,
					});
					return ok({
						items: result.items.map((e) => ({
							id: e.id,
							eventKind: e.event_kind,
							actorId: e.actor_id,
							actorEmail: e.actor_email,
							targetType: e.target_type,
							targetId: e.target_id,
							summary: e.summary,
							detail: e.detail_json ? JSON.parse(e.detail_json) : null,
							ipAddress: e.ip_address,
							userAgent: e.user_agent,
							createdAt: e.created_at,
						})),
						total: result.total,
						page,
						pageSize,
						totalPages: Math.ceil(result.total / pageSize),
					});
				} catch (e) {
					return err(e instanceof Error ? e.message : String(e), 500);
				}
			},
		},
	};
}

// ── Row mappers ───────────────────────────────────────────────────────────────

import type { MailketingSendLogRow as SLRow, MailketingRoleRow as RRow } from "./db/schema.js";

function mapSendLogRow(row: SLRow) {
	return {
		id: row.id,
		recipient: row.recipient,
		subject: row.subject,
		source: row.source,
		status: row.status,
		providerMessageId: row.provider_message_id,
		errorMessage: row.error_message,
		sentAt: row.sent_at,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		deletedAt: row.deleted_at,
	};
}

function mapRoleRow(row: RRow) {
	return {
		id: row.id,
		slug: row.slug,
		label: row.label,
		description: row.description,
		isSystemRole: row.is_system_role === 1,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		deletedAt: row.deleted_at,
	};
}

// ── Sandbox routes (mirrors native but runs in plugin sandbox) ────────────────

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
