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
	contentSnapshots: {
		indexes: ["collection", "contentId", "timestamp", ["collection", "timestamp"]],
	},
} satisfies PluginStorageConfig;

export const AWCMS_EXAMPLE_DESCRIPTOR_STORAGE = {
	auditEvents: {
		indexes: ["timestamp", "kind", "scope"],
	},
	contentSnapshots: {
		indexes: ["collection", "contentId", "timestamp"],
	},
} satisfies Record<string, { indexes?: string[]; uniqueIndexes?: string[] }>;

export const AWCMS_EXAMPLE_ADMIN_PAGES = [
	{ path: "/overview", label: "Overview", icon: "stack" },
	{ path: "/audit", label: "Audit", icon: "list" },
];

export const AWCMS_EXAMPLE_ADMIN_WIDGETS = [
	{ id: "governance-status", title: "Governance Status", size: "half" as const },
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
	return summarizePluginState(ctx);
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

const sharedRouteEntries: Record<string, { public?: boolean; handler: SharedRouteHandler }> = {
	"public/status": { public: true, handler: publicStatusRoute },
	"dashboard/summary": { handler: overviewSummaryRoute },
	"overview/summary": { handler: overviewSummaryRoute },
	"settings/get": { handler: settingsGetRoute },
	"settings/save": { handler: settingsSaveRoute },
	"audit/list": { handler: auditListRoute },
	"state/touch": { handler: touchStateRoute },
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
