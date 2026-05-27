import type {
	FieldWidgetConfig,
	PluginContext,
	PluginRoute as NativePluginRoute,
	PluginStorageConfig,
	PortableTextBlockConfig,
} from "emdash";
import type { SandboxedPlugin, SandboxedRequest, SandboxedRouteContext } from "emdash/plugin";

import { SIKESRA_REFERENCE_FIXTURES } from "./fixtures.js";
import { adaptToEmdashPages, type AwcmsModuleManifest } from "./navigation.js";

export const AWCMS_EXAMPLE_PLUGIN_ID = "awcms-micro-example";

export const AWCMS_EXAMPLE_CAPABILITIES = ["content:read", "content:write", "media:read", "media:write"] as const;

export const AWCMS_EXAMPLE_ALLOWED_HOSTS: string[] = [];

export const AWCMS_EXAMPLE_STORAGE = {
	auditEvents: {
		indexes: ["timestamp", "kind", "scope", ["scope", "timestamp"]],
	},
	accessChangeEvents: {
		indexes: ["timestamp", "kind", "scope", ["kind", "timestamp"]],
	},
	abacChangeEvents: {
		indexes: ["timestamp", "kind", "scope", ["kind", "timestamp"]],
	},
	abacAttributeCatalog: {
		indexes: ["key", "targetType", "updatedAt", ["targetType", "updatedAt"]],
	},
	abacPolicyRules: {
		indexes: ["id", "effect", "updatedAt", ["effect", "updatedAt"]],
	},
	abacResourceAssignments: {
		indexes: ["resourceId", "updatedAt"],
	},
	abacSubjectAssignments: {
		indexes: ["subjectId", "updatedAt"],
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

export const AWCMS_EXAMPLE_DESCRIPTOR_STORAGE = AWCMS_EXAMPLE_STORAGE;

export const AWCMS_EXAMPLE_MANIFEST: AwcmsModuleManifest = {
	id: "awcms-micro-example",
	name: "AWCMS-Micro Example Plugin",
	version: "0.0.1",
	description: "Access & audit demo plugin for AWCMS-Micro projects",
	navigation: {
		groups: [
			{
				id: "dashboard-group",
				labelKey: "awcms.nav.group.dashboard",
				fallbackLabel: "Dashboard",
				icon: "stack",
				sortOrder: 10,
				sidebarPlacement: "after-dashboard",
				sidebarPriority: 10,
				items: [
					{
						id: "overview",
						labelKey: "awcms.nav.overview",
						fallbackLabel: "Overview",
						path: "/overview",
						icon: "stack",
						sortOrder: 10,
						permission: "awcms:example:dashboard:read",
					}
				]
			},
			{
				id: "content-group",
				labelKey: "awcms.nav.group.content",
				fallbackLabel: "Content",
				icon: "file",
				sortOrder: 20,
				sidebarPlacement: "plugin-local-only",
				items: [
					{
						id: "pages",
						labelKey: "awcms.nav.pages",
						fallbackLabel: "Pages",
						path: "/registry",
						icon: "grid",
						sortOrder: 10,
						permission: "awcms:example:dashboard:read",
					},
					{
						id: "documents",
						labelKey: "awcms.nav.documents",
						fallbackLabel: "Documents",
						path: "/documents",
						icon: "file",
						sortOrder: 20,
						permission: "awcms:example:dashboard:read",
					}
				]
			},
			{
				id: "governance-group",
				labelKey: "awcms.nav.group.governance",
				fallbackLabel: "Governance",
				icon: "shield",
				sortOrder: 30,
				sidebarPlacement: "plugin-local-only",
				items: [
					{
						id: "verification",
						labelKey: "awcms.nav.verification",
						fallbackLabel: "Verification",
						path: "/verification",
						icon: "check",
						sortOrder: 10,
						permission: "awcms:example:audit:read",
					},
					{
						id: "audit-log",
						labelKey: "awcms.nav.audit",
						fallbackLabel: "Audit Log",
						path: "/audit",
						icon: "list",
						sortOrder: 20,
						permission: "awcms:example:audit:read",
					},
					{
						id: "reports",
						labelKey: "awcms.nav.reports",
						fallbackLabel: "Reports",
						path: "/reports",
						icon: "chart",
						sortOrder: 30,
						permission: "awcms:example:audit:read",
					}
				]
			},
			{
				id: "settings-group",
				labelKey: "awcms.nav.group.settings",
				fallbackLabel: "Settings",
				icon: "gear",
				sortOrder: 40,
				sidebarPlacement: "plugin-local-only",
				items: [
					{
						id: "access-control",
						labelKey: "awcms.nav.access",
						fallbackLabel: "Access Control",
						path: "/access/permissions",
						icon: "lock",
						sortOrder: 10,
						permission: "awcms:example:settings:read",
						children: [
							{
								id: "permissions",
								labelKey: "awcms.nav.permissions",
								fallbackLabel: "Permissions",
								path: "/access/permissions",
								sortOrder: 10,
								permission: "awcms:example:permissions:read",
							},
							{
								id: "roles",
								labelKey: "awcms.nav.roles",
								fallbackLabel: "Roles",
								path: "/access/roles",
								sortOrder: 20,
								permission: "awcms:example:roles:read",
							},
							{
								id: "matrix",
								labelKey: "awcms.nav.matrix",
								fallbackLabel: "Role Matrix",
								path: "/access/matrix",
								sortOrder: 30,
								permission: "awcms:example:permissions:read",
							},
							{
								id: "access-preview",
								labelKey: "awcms.nav.accessPreview",
								fallbackLabel: "Access Preview",
								path: "/access/preview",
								sortOrder: 40,
								permission: "awcms:example:preview:read",
							}
						]
					},
					{
						id: "abac",
						labelKey: "awcms.nav.abac",
						fallbackLabel: "ABAC",
						path: "/abac/attributes",
						icon: "sliders",
						sortOrder: 20,
						permission: "awcms:example:settings:read",
						children: [
							{
								id: "abac-attributes",
								labelKey: "awcms.nav.abacAttributes",
								fallbackLabel: "Attributes",
								path: "/abac/attributes",
								sortOrder: 10,
								permission: "awcms:example:abac:read",
							},
							{
								id: "abac-policies",
								labelKey: "awcms.nav.abacPolicies",
								fallbackLabel: "Policies",
								path: "/abac/policies",
								sortOrder: 20,
								permission: "awcms:example:abac:read",
							},
							{
								id: "abac-preview",
								labelKey: "awcms.nav.abacPreview",
								fallbackLabel: "ABAC Preview",
								path: "/abac/preview",
								sortOrder: 30,
								permission: "awcms:example:abac:read",
							}
						]
					}
				]
			}
		]
	},
	i18n: {
		defaultLocale: "en",
		supportedLocales: ["en", "id"],
		messages: {
				en: {
					"awcms.nav.group.dashboard": "Dashboard",
					"awcms.nav.group.content": "Content",
					"awcms.nav.group.governance": "Governance",
					"awcms.nav.group.settings": "Settings",
					"awcms.nav.overview": "Overview",
					"awcms.nav.pages": "Pages",
					"awcms.nav.documents": "Documents",
					"awcms.nav.verification": "Verification",
					"awcms.nav.audit": "Audit Log",
					"awcms.nav.reports": "Reports",
					"awcms.nav.access": "Access Control",
				"awcms.nav.permissions": "Permissions",
				"awcms.nav.roles": "Roles",
				"awcms.nav.matrix": "Role Matrix",
				"awcms.nav.accessPreview": "Access Preview",
				"awcms.nav.abac": "ABAC",
				"awcms.nav.abacAttributes": "Attributes",
				"awcms.nav.abacPolicies": "Policies",
				"awcms.nav.abacPreview": "ABAC Preview",
			},
			id: {
				"awcms.nav.group.dashboard": "Dasbor",
				"awcms.nav.group.content": "Konten",
				"awcms.nav.group.governance": "Tata Kelola",
				"awcms.nav.group.settings": "Pengaturan",
				"awcms.nav.overview": "Ikhtisar",
				"awcms.nav.pages": "Halaman",
				"awcms.nav.documents": "Dokumen",
				"awcms.nav.verification": "Verifikasi",
				"awcms.nav.audit": "Log Audit",
				"awcms.nav.reports": "Laporan",
				"awcms.nav.access": "Kontrol Akses",
				"awcms.nav.permissions": "Izin",
				"awcms.nav.roles": "Peran",
				"awcms.nav.matrix": "Matriks Peran",
				"awcms.nav.accessPreview": "Pratinjau Akses",
				"awcms.nav.abac": "ABAC",
				"awcms.nav.abacAttributes": "Atribut",
				"awcms.nav.abacPolicies": "Kebijakan",
				"awcms.nav.abacPreview": "Pratinjau ABAC",
			}
		}
	}
};

export const AWCMS_EXAMPLE_ADMIN_PAGES = adaptToEmdashPages(AWCMS_EXAMPLE_MANIFEST);

export const AWCMS_EXAMPLE_ADMIN_WIDGETS = [
	{ id: "governance-status", title: "Governance Status", size: "half" as const },
	{ id: "access-rights-health", title: "Access Rights Health", size: "half" as const },
	{ id: "abac-policy-status", title: "ABAC Policy Status", size: "half" as const },
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

export interface AbacAttributeDefinition {
	key: string;
	label: string;
	targetType: "subject" | "resource" | "context";
	description: string;
	updatedAt: string;
}

export interface AbacSubjectAssignment {
	subjectId: string;
	attributes: Record<string, string>;
	updatedAt: string;
}

export interface AbacResourceAssignment {
	resourceId: string;
	attributes: Record<string, string>;
	updatedAt: string;
}

export interface AbacPolicyRule {
	id: string;
	label: string;
	effect: "allow" | "deny";
	actions: string[];
	requiredSubject: Record<string, string>;
	requiredResource: Record<string, string>;
	requiredContext: Record<string, string>;
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

const DEFAULT_ABAC_ATTRIBUTES: AbacAttributeDefinition[] = [
	{ key: "tenant_id", label: "Tenant ID", targetType: "subject", description: "Tenant identifier for the acting subject.", updatedAt: "" },
	{ key: "site_id", label: "Site ID", targetType: "subject", description: "Site identifier for the acting subject.", updatedAt: "" },
	{ key: "module_id", label: "Module ID", targetType: "resource", description: "Module identifier for the resource.", updatedAt: "" },
	{ key: "resource_type", label: "Resource Type", targetType: "resource", description: "Resource type used in ABAC evaluation.", updatedAt: "" },
	{ key: "resource_status", label: "Resource Status", targetType: "resource", description: "Workflow status of the resource.", updatedAt: "" },
	{ key: "resource_sensitivity", label: "Resource Sensitivity", targetType: "resource", description: "Sensitivity classification for the resource.", updatedAt: "" },
	{ key: "owner_user_id", label: "Owner User ID", targetType: "resource", description: "Owning user of the resource.", updatedAt: "" },
	{ key: "region_scope", label: "Region Scope", targetType: "context", description: "Region scope for the decision context.", updatedAt: "" },
	{ key: "action", label: "Action", targetType: "context", description: "Action under evaluation.", updatedAt: "" },
];

const DEFAULT_ABAC_SUBJECTS: AbacSubjectAssignment[] = [
	{ subjectId: "user-demo-editor", attributes: { tenant_id: "tenant-a", site_id: "site-main", region_scope: "id-jakarta" }, updatedAt: "" },
	{ subjectId: "user-demo-reviewer", attributes: { tenant_id: "tenant-a", site_id: "site-main", region_scope: "id-jakarta" }, updatedAt: "" },
];

const DEFAULT_ABAC_RESOURCES: AbacResourceAssignment[] = [
	{ resourceId: "resource-public-post", attributes: { module_id: "content", resource_type: "post", resource_status: "published", resource_sensitivity: "public", owner_user_id: "user-demo-editor" }, updatedAt: "" },
	{ resourceId: "resource-sensitive-policy", attributes: { module_id: "governance", resource_type: "policy", resource_status: "review", resource_sensitivity: "restricted", owner_user_id: "user-demo-reviewer" }, updatedAt: "" },
];

const DEFAULT_ABAC_POLICIES: AbacPolicyRule[] = [
	{
		id: "allow-published-content-read",
		label: "Allow published content reads for the same tenant",
		effect: "allow",
		actions: ["content.read"],
		requiredSubject: { tenant_id: "tenant-a" },
		requiredResource: { resource_status: "published", resource_sensitivity: "public" },
		requiredContext: { region_scope: "id-jakarta" },
		updatedAt: "",
	},
	{
		id: "deny-sensitive-publish-outside-governance",
		label: "Explicitly deny publishing restricted governance resources",
		effect: "deny",
		actions: ["content.publish_sensitive"],
		requiredSubject: { tenant_id: "tenant-a" },
		requiredResource: { resource_sensitivity: "restricted", module_id: "governance" },
		requiredContext: {},
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

type VerificationStage =
	| "draft"
	| "submitted_village"
	| "verified_village"
	| "submitted_district"
	| "verified_district"
	| "submitted_regency"
	| "active_verified";

interface VerificationListItem {
	id: string;
	registryEntityId: string;
	code: string;
	label: string;
	entityType: string;
	sensitivity: string;
	region: {
		provinceCode: string;
		regencyCode: string;
		districtCode: string;
		villageCode: string;
	};
	verificationStage: VerificationStage;
	nextStage: VerificationStage | null;
	canAdvance: boolean;
	supportingDocumentIds: string[];
	publicSummary: string;
}

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

const VERIFICATION_STAGE_FLOW: VerificationStage[] = [
	"draft",
	"submitted_village",
	"verified_village",
	"submitted_district",
	"verified_district",
	"submitted_regency",
	"active_verified",
];

const VERIFICATION_STATE_KEY = "state:sikesraVerificationStages";

function getNextVerificationStage(stage: VerificationStage): VerificationStage | null {
	const index = VERIFICATION_STAGE_FLOW.indexOf(stage);
	return index >= 0 && index < VERIFICATION_STAGE_FLOW.length - 1 ? (VERIFICATION_STAGE_FLOW[index + 1] ?? null) : null;
}

async function getVerificationStageState(ctx: PluginContext): Promise<Record<string, VerificationStage>> {
	const stored = await ctx.kv.get<Record<string, VerificationStage>>(VERIFICATION_STATE_KEY);
	if (stored && typeof stored === "object") return stored;
	return Object.fromEntries(SIKESRA_REFERENCE_FIXTURES.registryEntities.map((entity) => [entity.id, entity.verificationStage])) as Record<string, VerificationStage>;
}

async function setVerificationStageState(ctx: PluginContext, state: Record<string, VerificationStage>) {
	await ctx.kv.set(VERIFICATION_STATE_KEY, state);
}

async function listVerificationItems(ctx: PluginContext): Promise<VerificationListItem[]> {
	const state = await getVerificationStageState(ctx);
	return SIKESRA_REFERENCE_FIXTURES.registryEntities.map((entity) => {
		const verificationStage = state[entity.id] ?? entity.verificationStage;
		return {
			id: entity.id,
			registryEntityId: entity.id,
			code: entity.code,
			label: entity.label,
			entityType: entity.entityType,
			sensitivity: entity.sensitivity,
			region: entity.region,
			verificationStage,
			nextStage: getNextVerificationStage(verificationStage),
			canAdvance: verificationStage !== "active_verified",
			supportingDocumentIds: entity.supportingDocumentIds,
			publicSummary: entity.publicSummary,
		};
	});
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

async function ensureAbacCatalogSeeded(ctx: PluginContext) {
	const existingAttributes = await ctx.storage.abacAttributeCatalog!.count();
	if (existingAttributes === 0) {
		for (const item of DEFAULT_ABAC_ATTRIBUTES) {
			await ctx.storage.abacAttributeCatalog!.put(item.key, touchUpdatedAt(item));
		}
	}

	const existingSubjects = await ctx.storage.abacSubjectAssignments!.count();
	if (existingSubjects === 0) {
		for (const item of DEFAULT_ABAC_SUBJECTS) {
			await ctx.storage.abacSubjectAssignments!.put(item.subjectId, touchUpdatedAt(item));
		}
	}

	const existingResources = await ctx.storage.abacResourceAssignments!.count();
	if (existingResources === 0) {
		for (const item of DEFAULT_ABAC_RESOURCES) {
			await ctx.storage.abacResourceAssignments!.put(item.resourceId, touchUpdatedAt(item));
		}
	}

	const existingPolicies = await ctx.storage.abacPolicyRules!.count();
	if (existingPolicies === 0) {
		for (const item of DEFAULT_ABAC_POLICIES) {
			await ctx.storage.abacPolicyRules!.put(item.id, touchUpdatedAt(item));
		}
	}

	await ctx.kv.set("state:lastAbacPreviewSubjectId", DEFAULT_ABAC_SUBJECTS[0]?.subjectId ?? "");
	await ctx.kv.set("state:lastAbacPreviewResourceId", DEFAULT_ABAC_RESOURCES[0]?.resourceId ?? "");
}

async function listCollectionValues<T>(
	collection: { query: (options?: any) => Promise<{ items: Array<{ id: string; data: unknown }> }> },
	orderByField: string = "updatedAt"
): Promise<T[]> {
	const result = await collection.query({ orderBy: { [orderByField]: "desc" }, limit: 200 });
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

async function listAbacAttributes(ctx: PluginContext) {
	return listCollectionValues<AbacAttributeDefinition>(ctx.storage.abacAttributeCatalog!);
}

async function listAbacPolicies(ctx: PluginContext) {
	return listCollectionValues<AbacPolicyRule>(ctx.storage.abacPolicyRules!);
}

async function listAbacSubjects(ctx: PluginContext) {
	return listCollectionValues<AbacSubjectAssignment>(ctx.storage.abacSubjectAssignments!);
}

async function listAbacResources(ctx: PluginContext) {
	return listCollectionValues<AbacResourceAssignment>(ctx.storage.abacResourceAssignments!);
}

function getStringArray(value: unknown, key: string) {
	if (!isRecord(value)) return [];
	const candidate = value[key];
	if (!Array.isArray(candidate)) return [];
	return candidate.filter((item): item is string => typeof item === "string" && item.length > 0);
}

function getStringRecord(value: unknown, key: string): Record<string, string> {
	if (!isRecord(value)) return {};
	const candidate = value[key];
	if (!isRecord(candidate)) return {};
	const result: Record<string, string> = {};
	for (const [entryKey, entryValue] of Object.entries(candidate)) {
		if (typeof entryValue === "string" && entryValue.length > 0) result[entryKey] = entryValue;
	}
	return result;
}

async function summarizeAccessRights(ctx: PluginContext) {
	await ensureAccessCatalogSeeded(ctx);
	const permissions = await listPermissions(ctx);
	const roles = await listRoles(ctx);
	const roleAssignments = await listRoleAssignments(ctx);
	const userAssignments = await listUserRoleAssignments(ctx);
	const changeEvents = await listCollectionValues<ExampleAuditEvent>(ctx.storage.accessChangeEvents!, "timestamp");

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

function collectMissingAttributes(required: Record<string, string>, available: Record<string, string>) {
	return Object.entries(required).filter(([key]) => available[key] === undefined).map(([key]) => key);
}

function allAttributesMatch(required: Record<string, string>, available: Record<string, string>) {
	return Object.entries(required).every(([key, value]) => available[key] === value);
}

async function summarizeAbac(ctx: PluginContext) {
	await ensureAbacCatalogSeeded(ctx);
	const attributes = await listAbacAttributes(ctx);
	const policies = await listAbacPolicies(ctx);
	const subjects = await listAbacSubjects(ctx);
	const resources = await listAbacResources(ctx);
	const events = await listCollectionValues<ExampleAuditEvent>(ctx.storage.abacChangeEvents!, "timestamp");

	return {
		attributes,
		policies,
		subjects,
		resources,
		events,
		health: {
			attributeCount: attributes.length,
			policyCount: policies.length,
			subjectCount: subjects.length,
			resourceCount: resources.length,
			explicitDenyCount: policies.filter((policy) => policy.effect === "deny").length,
		},
	};
}

async function appendAbacChangeEvent(ctx: PluginContext, record: ExampleAuditEvent) {
	await ctx.storage.abacChangeEvents!.put(record.id, record);
	await incrementCounter(ctx, "state:abacChangeCount");
	return record;
}

async function evaluateAbacDecision(ctx: PluginContext, input: unknown) {
	await ensureAbacCatalogSeeded(ctx);
	const subjectId = getString(input, "subjectId") ?? "";
	const resourceId = getString(input, "resourceId") ?? "";
	const action = getString(input, "action") ?? "";
	const contextAttributes = getStringRecord(input, "contextAttributes");

	if (!subjectId || !resourceId || !action) {
		return {
			allowed: false,
			reason: "Missing required ABAC input",
			matchedPolicyIds: [],
			effect: "deny",
			missingAttributes: [
				...(subjectId ? [] : ["subjectId"]),
				...(resourceId ? [] : ["resourceId"]),
				...(action ? [] : ["action"]),
			],
		};
	}

	const subject = (await ctx.storage.abacSubjectAssignments!.get(subjectId)) as AbacSubjectAssignment | null;
	const resource = (await ctx.storage.abacResourceAssignments!.get(resourceId)) as AbacResourceAssignment | null;

	if (!subject || !resource) {
		return {
			allowed: false,
			reason: !subject ? `No subject assignment found for ${subjectId}` : `No resource assignment found for ${resourceId}`,
			matchedPolicyIds: [],
			effect: "deny",
			missingAttributes: [],
		};
	}

	const policies = await listAbacPolicies(ctx);
	const relevantPolicies = policies.filter((policy) => policy.actions.includes(action));
	let missingAttributes: string[] = [];
	const matchedAllowPolicies: string[] = [];
	const matchedDenyPolicies: string[] = [];

	for (const policy of relevantPolicies) {
		const missing = [
			...collectMissingAttributes(policy.requiredSubject, subject.attributes),
			...collectMissingAttributes(policy.requiredResource, resource.attributes),
			...collectMissingAttributes(policy.requiredContext, contextAttributes),
		];
		if (missing.length > 0) {
			missingAttributes = [...new Set([...missingAttributes, ...missing])];
			continue;
		}

		const subjectMatch = allAttributesMatch(policy.requiredSubject, subject.attributes);
		const resourceMatch = allAttributesMatch(policy.requiredResource, resource.attributes);
		const contextMatch = allAttributesMatch(policy.requiredContext, contextAttributes);

		if (!(subjectMatch && resourceMatch && contextMatch)) continue;

		if (policy.effect === "deny") matchedDenyPolicies.push(policy.id);
		else matchedAllowPolicies.push(policy.id);
	}

	if (matchedDenyPolicies.length > 0) {
		return {
			allowed: false,
			reason: `Explicit deny from policy ${matchedDenyPolicies.join(", ")}`,
			matchedPolicyIds: matchedDenyPolicies,
			effect: "deny",
			missingAttributes,
		};
	}

	if (matchedAllowPolicies.length > 0) {
		return {
			allowed: true,
			reason: `Allowed by policy ${matchedAllowPolicies.join(", ")}`,
			matchedPolicyIds: matchedAllowPolicies,
			effect: "allow",
			missingAttributes,
		};
	}

	return {
		allowed: false,
		reason: missingAttributes.length > 0 ? `Missing required attributes: ${missingAttributes.join(", ")}` : `No matching allow policy for action ${action}`,
		matchedPolicyIds: [],
		effect: "deny",
		missingAttributes,
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

const verificationListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	return { items: await listVerificationItems(ctx) };
};

const verificationAdvanceRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const registryEntityId = getString(routeCtx.input, "registryEntityId") ?? "";
	const actor = getString(routeCtx.input, "actor") ?? actorFromRoute(ctx);
	const notes = getString(routeCtx.input, "notes") ?? "Advanced verification stage from the admin reference UI";
	const items = await listVerificationItems(ctx);
	const item = items.find((entry) => entry.registryEntityId === registryEntityId);

	if (!item) {
		return { success: false, error: { code: "NOT_FOUND", message: `Unknown verification entity ${registryEntityId}` } };
	}

	if (!item.nextStage) {
		return { success: false, error: { code: "INVALID_STATE", message: `Registry entity ${registryEntityId} is already at the final verification stage` } };
	}

	const nextState = await getVerificationStageState(ctx);
	nextState[registryEntityId] = item.nextStage;
	await setVerificationStageState(ctx, nextState);

	const event = await appendAuditEvent(
		ctx,
		createAuditRecord({
			kind: "verification.stage.advance",
			scope: "verification",
			actor,
			summary: `Advanced verification for ${item.code} to ${item.nextStage}`,
			metadata: {
				registryEntityId,
				code: item.code,
				from: item.verificationStage,
				to: item.nextStage,
				notes,
			},
		}),
	);

	return {
		success: true,
		item: {
			...item,
			verificationStage: item.nextStage,
			nextStage: getNextVerificationStage(item.nextStage),
			canAdvance: item.nextStage !== "active_verified",
		},
		items: await listVerificationItems(ctx),
		event,
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

const abacAttributesListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const abac = await summarizeAbac(ctx);
	return { items: abac.attributes };
};

const abacAttributesSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	await ensureAbacCatalogSeeded(ctx);
	const key = getString(routeCtx.input, "key") ?? "";
	const label = getString(routeCtx.input, "label") ?? key;
	const targetType = (getString(routeCtx.input, "targetType") as AbacAttributeDefinition["targetType"] | undefined) ?? "context";
	const description = getString(routeCtx.input, "description") ?? "";
	const item = touchUpdatedAt<AbacAttributeDefinition>({ key, label, targetType, description, updatedAt: "" });
	await ctx.storage.abacAttributeCatalog!.put(key, item);
	const event = createAuditRecord({ kind: "abac.attribute.save", scope: "abac", actor: actorFromRoute(ctx), summary: `Saved ABAC attribute ${key}`, metadata: { ...item } });
	await appendAbacChangeEvent(ctx, event);
	await appendAuditEvent(ctx, event);
	return { success: true, item };
};

const abacSubjectsListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const abac = await summarizeAbac(ctx);
	return { items: abac.subjects };
};

const abacSubjectsSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	await ensureAbacCatalogSeeded(ctx);
	const subjectId = getString(routeCtx.input, "subjectId") ?? "";
	const attributes = getStringRecord(routeCtx.input, "attributes");
	const item = touchUpdatedAt<AbacSubjectAssignment>({ subjectId, attributes, updatedAt: "" });
	await ctx.storage.abacSubjectAssignments!.put(subjectId, item);
	const event = createAuditRecord({ kind: "abac.subject.save", scope: "abac", actor: actorFromRoute(ctx), summary: `Saved ABAC subject assignment for ${subjectId}`, metadata: { ...item } });
	await appendAbacChangeEvent(ctx, event);
	await appendAuditEvent(ctx, event);
	return { success: true, item };
};

const abacResourcesListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const abac = await summarizeAbac(ctx);
	return { items: abac.resources };
};

const abacResourcesSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	await ensureAbacCatalogSeeded(ctx);
	const resourceId = getString(routeCtx.input, "resourceId") ?? "";
	const attributes = getStringRecord(routeCtx.input, "attributes");
	const item = touchUpdatedAt<AbacResourceAssignment>({ resourceId, attributes, updatedAt: "" });
	await ctx.storage.abacResourceAssignments!.put(resourceId, item);
	const event = createAuditRecord({ kind: "abac.resource.save", scope: "abac", actor: actorFromRoute(ctx), summary: `Saved ABAC resource assignment for ${resourceId}`, metadata: { ...item } });
	await appendAbacChangeEvent(ctx, event);
	await appendAuditEvent(ctx, event);
	return { success: true, item };
};

const abacPoliciesListRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const abac = await summarizeAbac(ctx);
	return { items: abac.policies };
};

const abacPoliciesSaveRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	await ensureAbacCatalogSeeded(ctx);
	const id = getString(routeCtx.input, "id") ?? "";
	const label = getString(routeCtx.input, "label") ?? id;
	const effect = (getString(routeCtx.input, "effect") as AbacPolicyRule["effect"] | undefined) ?? "allow";
	const actions = getStringArray(routeCtx.input, "actions");
	const requiredSubject = getStringRecord(routeCtx.input, "requiredSubject");
	const requiredResource = getStringRecord(routeCtx.input, "requiredResource");
	const requiredContext = getStringRecord(routeCtx.input, "requiredContext");
	const item = touchUpdatedAt<AbacPolicyRule>({ id, label, effect, actions, requiredSubject, requiredResource, requiredContext, updatedAt: "" });
	await ctx.storage.abacPolicyRules!.put(id, item);
	const event = createAuditRecord({ kind: "abac.policy.save", scope: "abac", actor: actorFromRoute(ctx), summary: `Saved ABAC policy ${id}`, metadata: { ...item } });
	await appendAbacChangeEvent(ctx, event);
	await appendAuditEvent(ctx, event);
	return { success: true, item };
};

const abacPreviewRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	return evaluateAbacDecision(ctx, routeCtx.input);
};

const abacEnforceDemoRoute: SharedRouteHandler = async (routeCtx, ctx) => {
	const decision = await evaluateAbacDecision(ctx, routeCtx.input);
	const contextAttributes = getStringRecord(routeCtx.input, "contextAttributes");
	const sensitive = (contextAttributes.action ?? getString(routeCtx.input, "action") ?? "").includes("sensitive");
	if (sensitive) {
		const event = createAuditRecord({ kind: "abac.decision.audit", scope: "abac", actor: actorFromRoute(ctx), summary: `Audited ABAC decision for sensitive action ${contextAttributes.action ?? getString(routeCtx.input, "action") ?? "unknown"}`, metadata: decision as unknown as Record<string, unknown> });
		await appendAbacChangeEvent(ctx, event);
		await appendAuditEvent(ctx, event);
	}
	return decision;
};

const abacHealthRoute: SharedRouteHandler = async (_routeCtx, ctx) => {
	const abac = await summarizeAbac(ctx);
	return abac.health;
};

const sharedRouteEntries: Record<string, { public?: boolean; handler: SharedRouteHandler }> = {
	"public/status": { public: true, handler: publicStatusRoute },
	"dashboard/summary": { handler: overviewSummaryRoute },
	"overview/summary": { handler: overviewSummaryRoute },
	"verification/list": { handler: verificationListRoute },
	"verification/advance": { handler: verificationAdvanceRoute },
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
	"abac/attributes/list": { handler: abacAttributesListRoute },
	"abac/attributes/save": { handler: abacAttributesSaveRoute },
	"abac/subjects/list": { handler: abacSubjectsListRoute },
	"abac/subjects/save": { handler: abacSubjectsSaveRoute },
	"abac/resources/list": { handler: abacResourcesListRoute },
	"abac/resources/save": { handler: abacResourcesSaveRoute },
	"abac/policies/list": { handler: abacPoliciesListRoute },
	"abac/policies/save": { handler: abacPoliciesSaveRoute },
	"abac/preview": { handler: abacPreviewRoute },
	"abac/enforce-demo": { handler: abacEnforceDemoRoute },
	"abac/health": { handler: abacHealthRoute },
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
		await ensureAbacCatalogSeeded(ctx);
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
		await ensureAbacCatalogSeeded(ctx);
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
