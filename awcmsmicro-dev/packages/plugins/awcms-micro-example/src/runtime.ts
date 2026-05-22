import type {
	FieldWidgetConfig,
	PluginContext,
	PluginRoute as NativePluginRoute,
	PluginStorageConfig,
	PortableTextBlockConfig,
} from "emdash";
import type { SandboxedPlugin, SandboxedRequest, SandboxedRouteContext } from "emdash/plugin";

export const AWCMS_EXAMPLE_PLUGIN_ID = "awcms-micro-example";

export const AWCMS_EXAMPLE_CAPABILITIES = ["content:read", "media:read", "media:write"] as const;

export const AWCMS_EXAMPLE_ALLOWED_HOSTS: string[] = [];

export const AWCMS_EXAMPLE_STORAGE = {
	auditEvents: {
		indexes: ["timestamp", "kind", "scope", ["scope", "timestamp"]],
	},
	accessChangeEvents: {
		indexes: ["timestamp", "kind", "scope", ["kind", "timestamp"]],
	},
	contentSnapshots: {
		indexes: ["collection", "contentId", "timestamp", ["collection", "timestamp"]],
	},
	permissionCatalog: {
		indexes: ["slug", "scope", "updatedAt", ["scope", "updatedAt"]],
	},
	roleCatalog: {
		indexes: ["slug", "updatedAt"],
	},
	rolePermissionAssignments: {
		indexes: ["roleSlug", "updatedAt"],
	},
	userRoleAssignments: {
		indexes: ["userId", "updatedAt"],
	},
} satisfies PluginStorageConfig;

export const AWCMS_EXAMPLE_DESCRIPTOR_STORAGE = {
	auditEvents: {
		indexes: ["timestamp", "kind", "scope"],
	},
	accessChangeEvents: {
		indexes: ["timestamp", "kind", "scope"],
	},
	contentSnapshots: {
		indexes: ["collection", "contentId", "timestamp"],
	},
	permissionCatalog: {
		indexes: ["slug", "scope", "updatedAt"],
	},
	roleCatalog: {
		indexes: ["slug", "updatedAt"],
	},
	rolePermissionAssignments: {
		indexes: ["roleSlug", "updatedAt"],
	},
	userRoleAssignments: {
		indexes: ["userId", "updatedAt"],
	},
} satisfies Record<string, { indexes?: string[]; uniqueIndexes?: string[] }>;

export const AWCMS_EXAMPLE_ADMIN_PAGES = [
	{ path: "/overview", label: "Overview", icon: "stack" },
	{ path: "/audit", label: "Audit", icon: "list" },
	{ path: "/access/permissions", label: "Permissions", icon: "lock" },
	{ path: "/access/roles", label: "Roles", icon: "users" },
	{ path: "/access/matrix", label: "Role Matrix", icon: "grid" },
	{ path: "/access/preview", label: "Access Preview", icon: "eye" },
];

export const AWCMS_EXAMPLE_ADMIN_WIDGETS = [
	{ id: "governance-status", title: "Governance Status", size: "half" as const },
	{ id: "access-rights-health", title: "Access Rights Health", size: "half" as const },
];

export const AWCMS_EXAMPLE_SETTINGS_SCHEMA = {
	publicStatusLabel: {
		type: "string" as const,
		label: "Public Status Label",
		description: "Shown by the plugin's public-safe status route.",
		default: "healthy",
	},
	auditRetentionDays: {
		type: "number" as const,
		label: "Audit Retention Days",
		description: "Used by the demo cron cleanup summary.",
		default: 30,
		min: 1,
	},
	governanceMode: {
		type: "select" as const,
		label: "Governance Mode",
		options: [
			{ value: "observe", label: "Observe" },
			{ value: "review", label: "Review" },
			{ value: "enforce-demo", label: "Enforce Demo" },
		],
		default: "review",
	},
	metadataCanonicalBase: {
		type: "url" as const,
		label: "Metadata Canonical Base",
		description: "Optional override for page metadata contributions.",
		placeholder: "https://example.awcms-micro.local",
	},
};

export const AWCMS_EXAMPLE_PORTABLE_TEXT_BLOCKS: PortableTextBlockConfig[] = [
	{
		type: "awcms-access-note",
		label: "AWCMS Access Note",
		icon: "info",
		description: "Portable Text note block for access and governance guidance.",
		category: "AWCMS Micro",
	},
];

export const AWCMS_EXAMPLE_FIELD_WIDGETS: FieldWidgetConfig[] = [
	{
		name: "status-badge",
		label: "Status badge",
		fieldTypes: ["string"],
	},
];

export interface ExampleAuditEvent {
	id: string;
	timestamp: string;
	kind: string;
	scope: string;
	actor: string;
	summary: string;
	metadata: Record<string, unknown>;
}

export interface ExampleSettings {
	publicStatusLabel: string;
	auditRetentionDays: number;
	governanceMode: string;
	metadataCanonicalBase: string;
}

export interface AccessPermission {
	slug: string;
	label: string;
	description: string;
	scope: string;
	updatedAt: string;
}

export interface AccessRole {
	slug: string;
	label: string;
	description: string;
	updatedAt: string;
}

export interface RolePermissionAssignment {
	roleSlug: string;
	permissions: string[];
	updatedAt: string;
}

export interface UserRoleAssignment {
	userId: string;
	roles: string[];
	updatedAt: string;
}

const DEFAULT_ACCESS_PERMISSIONS: AccessPermission[] = [
	{
		slug: "content.read.public",
		label: "Read Public Content",
		description: "Allows reading public-facing content surfaces.",
		scope: "content",
		updatedAt: "",
	},
	{
		slug: "content.review.publish",
		label: "Review And Publish",
		description: "Allows review workflows to approve and publish content.",
		scope: "workflow",
		updatedAt: "",
	},
	{
		slug: "audit.read.events",
		label: "Read Audit Events",
		description: "Allows operators to inspect governance and access audit events.",
		scope: "audit",
		updatedAt: "",
	},
];

const DEFAULT_ACCESS_ROLES: AccessRole[] = [
	{
		slug: "site-editor",
		label: "Site Editor",
		description: "Editor role for content operations.",
		updatedAt: "",
	},
	{
		slug: "governance-reviewer",
		label: "Governance Reviewer",
		description: "Reviewer role for governance and publishing approval.",
		updatedAt: "",
	},
];

const DEFAULT_ROLE_ASSIGNMENTS: RolePermissionAssignment[] = [
	{
		roleSlug: "site-editor",
		permissions: ["content.read.public", "audit.read.events"],
		updatedAt: "",
	},
	{
		roleSlug: "governance-reviewer",
		permissions: ["content.read.public", "content.review.publish", "audit.read.events"],
		updatedAt: "",
	},
];

const DEFAULT_USER_ROLE_ASSIGNMENTS: UserRoleAssignment[] = [
	{
		userId: "user-demo-editor",
		roles: ["site-editor"],
		updatedAt: "",
	},
	{
		userId: "user-demo-reviewer",
		roles: ["governance-reviewer"],
		updatedAt: "",
	},
];

const DEFAULT_SETTINGS: ExampleSettings = {
	publicStatusLabel: "healthy",
	auditRetentionDays: 30,
	governanceMode: "review",
	metadataCanonicalBase: "",
};

type SharedRouteHandler = (routeCtx: SandboxedRouteContext, ctx: PluginContext) => Promise<unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown, key: string): string | undefined {
	if (!isRecord(value)) return undefined;
	const candidate = value[key];
	return typeof candidate === "string" ? candidate : undefined;
}

function getNumber(value: unknown, key: string): number | undefined {
	if (!isRecord(value)) return undefined;
	const candidate = value[key];
	return typeof candidate === "number" && Number.isFinite(candidate) ? candidate : undefined;
}

function actorFromRoute(ctx: any): string {
	const ip = ctx.requestMeta?.ip;
	return typeof ip === "string" && ip ? `request:${ip}` : "request:unknown";
}

function actorFromContent(content: Record<string, unknown>): string {
	const actor = content.authorId ?? content.author_id ?? content.updatedBy ?? content.updated_by;
	return typeof actor === "string" && actor ? actor : "system";
}

function toIsoNow() {
	return new Date().toISOString();
}

async function getSettings(ctx: PluginContext): Promise<ExampleSettings> {
	const publicStatusLabel = await ctx.kv.get<string>("settings:publicStatusLabel");
	const auditRetentionDays = await ctx.kv.get<number>("settings:auditRetentionDays");
	const governanceMode = await ctx.kv.get<string>("settings:governanceMode");
	const metadataCanonicalBase = await ctx.kv.get<string>("settings:metadataCanonicalBase");

	return {
		publicStatusLabel: publicStatusLabel ?? DEFAULT_SETTINGS.publicStatusLabel,
		auditRetentionDays: auditRetentionDays ?? DEFAULT_SETTINGS.auditRetentionDays,
		governanceMode: governanceMode ?? DEFAULT_SETTINGS.governanceMode,
		metadataCanonicalBase: metadataCanonicalBase ?? DEFAULT_SETTINGS.metadataCanonicalBase,
	};
}

async function setSettings(ctx: PluginContext, input: unknown) {
	const current = await getSettings(ctx);
	const next: ExampleSettings = {
		publicStatusLabel: getString(input, "publicStatusLabel") ?? current.publicStatusLabel,
		auditRetentionDays: getNumber(input, "auditRetentionDays") ?? current.auditRetentionDays,
		governanceMode: getString(input, "governanceMode") ?? current.governanceMode,
		metadataCanonicalBase: getString(input, "metadataCanonicalBase") ?? current.metadataCanonicalBase,
	};

	await ctx.kv.set("settings:publicStatusLabel", next.publicStatusLabel);
	await ctx.kv.set("settings:auditRetentionDays", next.auditRetentionDays);
	await ctx.kv.set("settings:governanceMode", next.governanceMode);
	await ctx.kv.set("settings:metadataCanonicalBase", next.metadataCanonicalBase);

	return next;
}

async function incrementCounter(ctx: PluginContext, key: string) {
	const current = (await ctx.kv.get<number>(key)) ?? 0;
	const next = current + 1;
	await ctx.kv.set(key, next);
	return next;
}

export function createAuditRecord(input: Omit<ExampleAuditEvent, "id" | "timestamp">): ExampleAuditEvent {
	const timestamp = toIsoNow();
	return {
		id: `${timestamp}:${input.kind}:${Math.random().toString(36).slice(2, 8)}`,
		timestamp,
		kind: input.kind,
		scope: input.scope,
		actor: input.actor,
		summary: input.summary,
		metadata: input.metadata,
	};
}

async function appendAuditEvent(ctx: PluginContext, record: ExampleAuditEvent) {
	await ctx.storage.auditEvents!.put(record.id, record);
	await ctx.kv.set("state:lastAuditEventId", record.id);
	await incrementCounter(ctx, "state:auditCount");
	ctx.log.info(`[${AWCMS_EXAMPLE_PLUGIN_ID}] ${record.summary}`, record.metadata);
	return record;
}

async function listAuditEvents(ctx: PluginContext, limit = 20, cursor?: string) {
	const result = await ctx.storage.auditEvents!.query({
		orderBy: { timestamp: "desc" },
		limit,
		cursor,
	});

	return {
		items: result.items.map((item: { id: string; data: unknown }) => item.data as ExampleAuditEvent),
		cursor: result.cursor,
		hasMore: result.hasMore,
	};
}

async function summarizePluginState(ctx: PluginContext) {
	const settings = await getSettings(ctx);
	const auditCount = (await ctx.kv.get<number>("state:auditCount")) ?? 0;
	const lifecycleCount = (await ctx.kv.get<number>("state:lifecycleCount")) ?? 0;
	const publicHits = (await ctx.kv.get<number>("state:publicStatusHits")) ?? 0;
	const lastCronAt = (await ctx.kv.get<string>("state:lastCronAt")) ?? null;
	const lastLifecycle = (await ctx.kv.get<string>("state:lastLifecycle")) ?? null;
	const recent = await listAuditEvents(ctx, 5);

	return {
		plugin: { id: AWCMS_EXAMPLE_PLUGIN_ID },
		settings,
		counters: {
			auditCount,
			lifecycleCount,
			publicHits,
		},
		lastCronAt,
		lastLifecycle,
		recentEvents: recent.items,
	};
}

async function writeSnapshot(ctx: PluginContext, collection: string, content: Record<string, unknown>) {
	const contentId = typeof content.id === "string" ? content.id : "unknown";
	const snapshotId = `${collection}:${contentId}:${Date.now()}`;
	await ctx.storage.contentSnapshots!.put(snapshotId, {
		collection,
		contentId,
		timestamp: toIsoNow(),
		slug: typeof content.slug === "string" ? content.slug : null,
		status: typeof content.status === "string" ? content.status : null,
	});
	return snapshotId;
}

async function appendAccessChangeEvent(ctx: PluginContext, record: ExampleAuditEvent) {
	await ctx.storage.accessChangeEvents!.put(record.id, record);
	await incrementCounter(ctx, "state:accessChangeCount");
	return record;
}

function touchUpdatedAt<T extends { updatedAt: string }>(value: T): T {
	return { ...value, updatedAt: toIsoNow() };
}

async function ensureAccessCatalogSeeded(ctx: PluginContext) {
	const existingPermissions = await ctx.storage.permissionCatalog!.count();
	if (existingPermissions === 0) {
		for (const item of DEFAULT_ACCESS_PERMISSIONS) {
			await ctx.storage.permissionCatalog!.put(item.slug, touchUpdatedAt(item));
		}
	}

	const existingRoles = await ctx.storage.roleCatalog!.count();
	if (existingRoles === 0) {
		for (const item of DEFAULT_ACCESS_ROLES) {
			await ctx.storage.roleCatalog!.put(item.slug, touchUpdatedAt(item));
		}
	}

	const existingRoleAssignments = await ctx.storage.rolePermissionAssignments!.count();
	if (existingRoleAssignments === 0) {
		for (const item of DEFAULT_ROLE_ASSIGNMENTS) {
			await ctx.storage.rolePermissionAssignments!.put(item.roleSlug, touchUpdatedAt(item));
		}
	}

	const existingUserAssignments = await ctx.storage.userRoleAssignments!.count();
	if (existingUserAssignments === 0) {
		for (const item of DEFAULT_USER_ROLE_ASSIGNMENTS) {
			await ctx.storage.userRoleAssignments!.put(item.userId, touchUpdatedAt(item));
		}
		await ctx.kv.set("state:lastPreviewUserId", DEFAULT_USER_ROLE_ASSIGNMENTS[0]?.userId ?? "");
	}
}

async function listCollectionValues<T>(collection: { query: (options?: any) => Promise<{ items: Array<{ id: string; data: unknown }> }> }): Promise<T[]> {
	const result = await collection.query({ orderBy: { updatedAt: "desc" }, limit: 200 });
	return result.items.map((item) => item.data as T);
}

async function listPermissions(ctx: PluginContext) {
	return listCollectionValues<AccessPermission>(ctx.storage.permissionCatalog!);
}

async function listRoles(ctx: PluginContext) {
	return listCollectionValues<AccessRole>(ctx.storage.roleCatalog!);
}

async function listRoleAssignments(ctx: PluginContext) {
	return listCollectionValues<RolePermissionAssignment>(ctx.storage.rolePermissionAssignments!);
}

async function listUserRoleAssignments(ctx: PluginContext) {
	return listCollectionValues<UserRoleAssignment>(ctx.storage.userRoleAssignments!);
}

function getStringArray(value: unknown, key: string) {
	if (!isRecord(value)) return [];
	const candidate = value[key];
	if (!Array.isArray(candidate)) return [];
	return candidate.filter((item): item is string => typeof item === "string" && item.length > 0);
}

async function summarizeAccessRights(ctx: PluginContext) {
	await ensureAccessCatalogSeeded(ctx);
	const permissions = await listPermissions(ctx);
	const roles = await listRoles(ctx);
	const roleAssignments = await listRoleAssignments(ctx);
	const userAssignments = await listUserRoleAssignments(ctx);
	const changeEvents = await listCollectionValues<ExampleAuditEvent>(ctx.storage.accessChangeEvents!);

	const rolesWithoutPermissions = roles
		.filter((role) => !roleAssignments.some((assignment) => assignment.roleSlug === role.slug && assignment.permissions.length > 0))
		.map((role) => role.slug);

	const usersWithoutRoles = userAssignments.filter((assignment) => assignment.roles.length === 0).map((assignment) => assignment.userId);

	return {
		permissions,
		roles,
		roleAssignments,
		userAssignments,
		changeEvents,
		health: {
			permissionCount: permissions.length,
			roleCount: roles.length,
			assignmentCount: roleAssignments.length,
			userAssignmentCount: userAssignments.length,
			rolesWithoutPermissions,
			usersWithoutRoles,
		},
	};
}

async function previewAccess(ctx: PluginContext, input: unknown) {
	await ensureAccessCatalogSeeded(ctx);
	const userId = getString(input, "userId") ?? "";
	const permissionSlug = getString(input, "permissionSlug") ?? "";
	const reasonPrefix = !userId || !permissionSlug ? "Missing required preview input" : null;

	if (reasonPrefix) {
		return {
			allowed: false,
			reason: reasonPrefix,
			matchedRoles: [],
			effectivePermissions: [],
		};
	}

	const userAssignment = (await ctx.storage.userRoleAssignments!.get(userId)) as UserRoleAssignment | null;
	if (!userAssignment || userAssignment.roles.length === 0) {
		return {
			allowed: false,
			reason: `No role assignment found for ${userId}`,
			matchedRoles: [],
			effectivePermissions: [],
		};
	}

	const assignments = await Promise.all(
		userAssignment.roles.map(async (roleSlug) =>
			((await ctx.storage.rolePermissionAssignments!.get(roleSlug)) as RolePermissionAssignment | null) ?? {
				roleSlug,
				permissions: [],
				updatedAt: "",
			},
		),
	);

	const effectivePermissions = [...new Set(assignments.flatMap((assignment) => assignment.permissions))].toSorted();
	const matchedRoles = assignments.filter((assignment) => assignment.permissions.includes(permissionSlug)).map((assignment) => assignment.roleSlug);
	const allowed = matchedRoles.length > 0;

	return {
		allowed,
		reason: allowed
			? `Permission ${permissionSlug} granted by role ${matchedRoles.join(", ")}`
			: `Permission ${permissionSlug} not granted to ${userId}`,
		matchedRoles,
		effectivePermissions,
	};
}

const publicStatusRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	await incrementCounter(ctx, "state:publicStatusHits");
	const settings = await getSettings(ctx);
	const auditCount = (await ctx.kv.get<number>("state:auditCount")) ?? 0;
	const lastLifecycle = (await ctx.kv.get<string>("state:lastLifecycle")) ?? null;

	return {
		plugin: { id: AWCMS_EXAMPLE_PLUGIN_ID, visibility: "public-safe" },
		status: settings.publicStatusLabel,
		governanceMode: settings.governanceMode,
		auditCount,
		lastLifecycle,
	};
};

const settingsGetRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	return getSettings(ctx);
};

const settingsSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const next = await setSettings(ctx, routeCtx.input);
	await appendAuditEvent(
		ctx,
		createAuditRecord({
			kind: "settings.update",
			scope: "settings",
			actor: actorFromRoute(ctx),
			summary: "Updated example plugin settings",
			metadata: { ...next },
		}),
	);
	return { success: true, settings: next };
};

const auditListRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const limit = Math.min(getNumber(routeCtx.input, "limit") ?? 20, 50);
	const cursor = getString(routeCtx.input, "cursor");
	return listAuditEvents(ctx, limit, cursor);
};

const overviewSummaryRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const summary = await summarizePluginState(ctx);
	const access = await summarizeAccessRights(ctx);
	return {
		...summary,
		accessRights: access.health,
	};
};

const touchStateRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const note = getString(routeCtx.input, "note") ?? "manual-touch";
	const actor = actorFromRoute(ctx);
	await ctx.kv.set("state:lastManualTouch", toIsoNow());
	const counter = await incrementCounter(ctx, "state:manualTouches");
	const event = await appendAuditEvent(
		ctx,
		createAuditRecord({
			kind: "state.touch",
			scope: "state",
			actor,
			summary: `Touched plugin state: ${note}`,
			metadata: { note, counter },
		}),
	);
	return { success: true, counter, event };
};

const accessPermissionsListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	await ensureAccessCatalogSeeded(ctx);
	return { items: await listPermissions(ctx) };
};

const accessPermissionsSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	await ensureAccessCatalogSeeded(ctx);
	const slug = getString(routeCtx.input, "slug") ?? "";
	const label = getString(routeCtx.input, "label") ?? slug;
	const description = getString(routeCtx.input, "description") ?? "";
	const scope = getString(routeCtx.input, "scope") ?? "general";
	const permission = touchUpdatedAt<AccessPermission>({ slug, label, description, scope, updatedAt: "" });
	await ctx.storage.permissionCatalog!.put(slug, permission);
	const event = createAuditRecord({
		kind: "access.permission.save",
		scope: "access-rights",
		actor: actorFromRoute(ctx),
		summary: `Saved permission ${slug}`,
		metadata: { ...permission },
	});
	await appendAccessChangeEvent(ctx, event);
	await appendAuditEvent(ctx, event);
	return { success: true, item: permission };
};

const accessRolesListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	await ensureAccessCatalogSeeded(ctx);
	return {
		roles: await listRoles(ctx),
		userAssignments: await listUserRoleAssignments(ctx),
	};
};

const accessRolesSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	await ensureAccessCatalogSeeded(ctx);
	const slug = getString(routeCtx.input, "slug") ?? "";
	const label = getString(routeCtx.input, "label") ?? slug;
	const description = getString(routeCtx.input, "description") ?? "";
	const role = touchUpdatedAt<AccessRole>({ slug, label, description, updatedAt: "" });
	await ctx.storage.roleCatalog!.put(slug, role);
	const event = createAuditRecord({
		kind: "access.role.save",
		scope: "access-rights",
		actor: actorFromRoute(ctx),
		summary: `Saved role ${slug}`,
		metadata: { ...role },
	});
	await appendAccessChangeEvent(ctx, event);
	await appendAuditEvent(ctx, event);
	return { success: true, item: role };
};

const accessUserAssignmentsSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	await ensureAccessCatalogSeeded(ctx);
	const userId = getString(routeCtx.input, "userId") ?? "";
	const roles = getStringArray(routeCtx.input, "roles");
	const assignment = touchUpdatedAt<UserRoleAssignment>({ userId, roles, updatedAt: "" });
	await ctx.storage.userRoleAssignments!.put(userId, assignment);
	await ctx.kv.set("state:lastPreviewUserId", userId);
	const event = createAuditRecord({
		kind: "access.user-assignment.save",
		scope: "access-rights",
		actor: actorFromRoute(ctx),
		summary: `Saved user role assignment for ${userId}`,
		metadata: { ...assignment },
	});
	await appendAccessChangeEvent(ctx, event);
	await appendAuditEvent(ctx, event);
	return { success: true, item: assignment };
};

const accessMatrixGetRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const access = await summarizeAccessRights(ctx);
	return {
		permissions: access.permissions,
		roles: access.roles,
		assignments: access.roleAssignments,
	};
};

const accessMatrixSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	await ensureAccessCatalogSeeded(ctx);
	const roleSlug = getString(routeCtx.input, "roleSlug") ?? "";
	const permissions = getStringArray(routeCtx.input, "permissions");
	const assignment = touchUpdatedAt<RolePermissionAssignment>({ roleSlug, permissions, updatedAt: "" });
	await ctx.storage.rolePermissionAssignments!.put(roleSlug, assignment);
	const event = createAuditRecord({
		kind: "access.matrix.save",
		scope: "access-rights",
		actor: actorFromRoute(ctx),
		summary: `Saved role-permission matrix for ${roleSlug}`,
		metadata: { ...assignment },
	});
	await appendAccessChangeEvent(ctx, event);
	await appendAuditEvent(ctx, event);
	return { success: true, item: assignment };
};

const accessPreviewRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const preview = await previewAccess(ctx, routeCtx.input);
	return preview;
};

const accessHealthRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const access = await summarizeAccessRights(ctx);
	return access.health;
};

const sharedRouteEntries: Record<string, { public?: boolean; handler: SharedRouteHandler }> = {
	"public/status": { public: true, handler: publicStatusRoute },
	"dashboard/summary": { handler: overviewSummaryRoute },
	"overview/summary": { handler: overviewSummaryRoute },
	"settings/get": { handler: settingsGetRoute },
	"settings/save": { handler: settingsSaveRoute },
	"audit/list": { handler: auditListRoute },
	"state/touch": { handler: touchStateRoute },
	"access/permissions/list": { handler: accessPermissionsListRoute },
	"access/permissions/save": { handler: accessPermissionsSaveRoute },
	"access/roles/list": { handler: accessRolesListRoute },
	"access/roles/save": { handler: accessRolesSaveRoute },
	"access/users/save": { handler: accessUserAssignmentsSaveRoute },
	"access/matrix/get": { handler: accessMatrixGetRoute },
	"access/matrix/save": { handler: accessMatrixSaveRoute },
	"access/preview": { handler: accessPreviewRoute },
	"access/health": { handler: accessHealthRoute },
};

export function createSandboxRoutes() {
	return sharedRouteEntries;
}

export function createNativeRoutes() {
	const routes: Record<string, NativePluginRoute> = {};
	for (const [path, entry] of Object.entries(sharedRouteEntries)) {
		routes[path] = {
			public: entry.public,
			handler: async (ctx) =>
				entry.handler({ input: ctx.input, request: toSandboxRequest(ctx.request), requestMeta: ctx.requestMeta }, ctx),
		};
	}
	return routes;
}

function toSandboxRequest(request: Request): SandboxedRequest {
	const headers: Record<string, string> = {};
	request.headers.forEach((value, key) => {
		headers[key] = value;
	});
	return {
		url: request.url,
		method: request.method,
		headers,
	};
}

const sharedHooks: SandboxedPlugin["hooks"] = {
	"plugin:install": async (_event, ctx) => {
		await ensureAccessCatalogSeeded(ctx);
		await ctx.kv.set("state:lastLifecycle", "plugin:install");
		await incrementCounter(ctx, "state:lifecycleCount");
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "plugin.install",
				scope: "lifecycle",
				actor: "system",
				summary: "Installed the AWCMS-Micro example plugin",
				metadata: {},
			}),
		);
	},
	"plugin:activate": async (_event, ctx) => {
		await ensureAccessCatalogSeeded(ctx);
		await ctx.kv.set("state:lastLifecycle", "plugin:activate");
		await incrementCounter(ctx, "state:lifecycleCount");
		if (ctx.cron) {
			await ctx.cron.schedule("governance-summary", { schedule: "0 * * * *" });
		}
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "plugin.activate",
				scope: "lifecycle",
				actor: "system",
				summary: "Activated the AWCMS-Micro example plugin",
				metadata: { cron: !!ctx.cron },
			}),
		);
	},
	"plugin:deactivate": async (_event, ctx) => {
		await ctx.kv.set("state:lastLifecycle", "plugin:deactivate");
		await incrementCounter(ctx, "state:lifecycleCount");
		if (ctx.cron) {
			await ctx.cron.cancel("governance-summary").catch(() => {});
		}
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "plugin.deactivate",
				scope: "lifecycle",
				actor: "system",
				summary: "Deactivated the AWCMS-Micro example plugin",
				metadata: {},
			}),
		);
	},
	"plugin:uninstall": async (event, ctx) => {
		await ctx.kv.set("state:lastLifecycle", "plugin:uninstall");
		await incrementCounter(ctx, "state:lifecycleCount");
		if (ctx.cron) {
			await ctx.cron.cancel("governance-summary").catch(() => {});
		}
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "plugin.uninstall",
				scope: "lifecycle",
				actor: "system",
				summary: "Uninstalled the AWCMS-Micro example plugin",
				metadata: { deleteData: event.deleteData },
			}),
		);
	},
	"content:beforeSave": async (event, ctx) => {
		await writeSnapshot(ctx, event.collection, event.content);
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: event.isNew ? "content.prepare-create" : "content.prepare-update",
				scope: "content",
				actor: actorFromContent(event.content),
				summary: `Prepared ${event.collection} content for save`,
				metadata: {
					collection: event.collection,
					isNew: event.isNew,
					slug: typeof event.content.slug === "string" ? event.content.slug : null,
				},
			}),
		);
		return event.content;
	},
	"content:afterSave": async (event, ctx) => {
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: event.isNew ? "content.created" : "content.saved",
				scope: "content",
				actor: actorFromContent(event.content),
				summary: `Saved ${event.collection} content`,
				metadata: { collection: event.collection, isNew: event.isNew },
			}),
		);
	},
	"content:beforeDelete": async (event, ctx) => {
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "content.prepare-delete",
				scope: "content",
				actor: "system",
				summary: `Prepared ${event.collection}/${event.id} for delete`,
				metadata: { collection: event.collection, id: event.id, permanent: event.permanent },
			}),
		);
		return true;
	},
	"content:afterDelete": async (event, ctx) => {
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "content.deleted",
				scope: "content",
				actor: "system",
				summary: `Deleted ${event.collection}/${event.id}`,
				metadata: { collection: event.collection, id: event.id, permanent: event.permanent },
			}),
		);
	},
	"content:afterPublish": async (event, ctx) => {
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "content.published",
				scope: "content",
				actor: actorFromContent(event.content),
				summary: `Published ${event.collection} content`,
				metadata: { collection: event.collection },
			}),
		);
	},
	"content:afterUnpublish": async (event, ctx) => {
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "content.unpublished",
				scope: "content",
				actor: actorFromContent(event.content),
				summary: `Unpublished ${event.collection} content`,
				metadata: { collection: event.collection },
			}),
		);
	},
	"media:beforeUpload": async (event, ctx) => {
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "media.prepare-upload",
				scope: "media",
				actor: "system",
				summary: `Prepared media upload for ${event.file.name}`,
				metadata: event.file,
			}),
		);
		return event.file;
	},
	"media:afterUpload": async (event, ctx) => {
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "media.uploaded",
				scope: "media",
				actor: "system",
				summary: `Uploaded media ${event.media.id}`,
				metadata: { id: event.media.id, mimeType: event.media.mimeType },
			}),
		);
	},
	cron: async (event, ctx) => {
		if (event.name !== "governance-summary") return;
		await ctx.kv.set("state:lastCronAt", toIsoNow());
		const settings = await getSettings(ctx);
		await appendAuditEvent(
			ctx,
			createAuditRecord({
				kind: "cron.summary",
				scope: "cron",
				actor: "system",
				summary: "Ran governance summary cron",
				metadata: { retentionDays: settings.auditRetentionDays },
			}),
		);
	},
	"page:metadata": async (event, ctx) => {
		const settings = await getSettings(ctx);
		const href = settings.metadataCanonicalBase || event.page.canonical || event.page.url;
		return [
			{ kind: "meta" as const, name: "awcms-micro:governance-mode", content: settings.governanceMode },
			{ kind: "link" as const, rel: "canonical" as const, href, key: "awcms-micro-canonical" },
		];
	},
};

export function createSharedHooks() {
	return sharedHooks;
}
