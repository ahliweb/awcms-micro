import type { PluginContext, SandboxedPlugin } from "emdash/plugin";

import {
	AWCMS_GALLERY_COLLECTION,
	sanitizeGallerySettings,
	validateGalleryContent,
	validateGalleryItem,
} from "./validation.js";

function settingsFromOptions(options: { maxImageBytes?: number; maxVideoBytes?: number; cloudflareImages?: boolean; cloudflareStream?: boolean; }) {
	return sanitizeGallerySettings({
		maxImageBytes: options.maxImageBytes,
		maxVideoBytes: options.maxVideoBytes,
		cloudflareImagesEnabled: options.cloudflareImages === true,
		cloudflareStreamEnabled: options.cloudflareStream === true,
	});
}

async function readSettings(pluginCtx: PluginContext, options: { maxImageBytes?: number; maxVideoBytes?: number; cloudflareImages?: boolean; cloudflareStream?: boolean; }) {
	const defaults = settingsFromOptions(options);
	const saved = (await pluginCtx.kv.get("settings")) as Record<string, unknown> | null;
	return sanitizeGallerySettings({ ...defaults, ...saved });
}

async function writeAudit(pluginCtx: PluginContext, kind: string, summary: string, metadata: Record<string, unknown>) {
	const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
	const auditEvents = pluginCtx.storage.auditEvents;
	if (!auditEvents) return;
	await auditEvents.put(id, {
		id,
		timestamp: new Date().toISOString(),
		kind,
		summary,
		metadata,
	});
}

function buildAdminBlocks(settings: ReturnType<typeof sanitizeGallerySettings>, message?: string) {
	return {
		blocks: [
			{ type: "header", text: "AWCMS-Micro Gallery" },
			{
				type: "section",
				text: "Manage gallery validation, Cloudflare media flags, and audit-ready gallery controls without changing EmDash core.",
			},
			message ? { type: "banner", tone: "success", text: message } : { type: "divider" },
			{
				type: "stats",
				items: [
					{ label: "Images", value: `${Math.round(settings.maxImageBytes / 1024 / 1024)} MB` },
					{ label: "Videos", value: `${Math.round(settings.maxVideoBytes / 1024 / 1024)} MB` },
					{ label: "Cloudflare Images", value: settings.cloudflareImagesEnabled ? "Enabled" : "Optional" },
					{ label: "Cloudflare Stream", value: settings.cloudflareStreamEnabled ? "Enabled" : "Optional" },
				],
			},
			{
				type: "form",
				block_id: "gallery-settings",
				fields: [
					{
						type: "number_input",
						action_id: "maxImageBytes",
						label: "Maximum image bytes",
						initial_value: settings.maxImageBytes,
						min: 1,
					},
					{
						type: "number_input",
						action_id: "maxVideoBytes",
						label: "Maximum video bytes",
						initial_value: settings.maxVideoBytes,
						min: 1,
					},
					{
						type: "toggle",
						action_id: "cloudflareImagesEnabled",
						label: "Cloudflare Images enabled",
						initial_value: settings.cloudflareImagesEnabled,
					},
					{
						type: "toggle",
						action_id: "cloudflareStreamEnabled",
						label: "Cloudflare Stream enabled",
						initial_value: settings.cloudflareStreamEnabled,
					},
				],
				submit: { label: "Save settings", action_id: "save_settings" },
			},
		],
	};
}

const sandboxPlugin: SandboxedPlugin = {
	hooks: {
		"content:beforeSave": {
			handler: async (event: any, pluginCtx: PluginContext): Promise<void | Record<string, unknown>> => {
				if (event.collection !== AWCMS_GALLERY_COLLECTION) return event.content;
				const settings = await readSettings(pluginCtx, {});
				const result = validateGalleryContent(event.content, settings);
				await writeAudit(pluginCtx, result.valid ? "gallery.validation.ok" : "gallery.validation.reject", "Validated gallery content before save", {
					contentId: event.content?.id,
					errors: result.errors,
				});
				if (!result.valid) {
					throw new Error(`Invalid gallery content: ${result.errors.join("; ")}`);
				}
				return event.content as Record<string, unknown> | undefined;
			},
		},
	},
	routes: {
		admin: {
			handler: async (routeCtx: any, pluginCtx: PluginContext): Promise<unknown> => {
				const interaction = routeCtx.input as { type?: string; page?: string; action_id?: string; values?: Record<string, unknown> };
				if (interaction.type === "form_submit" && interaction.action_id === "save_settings") {
					const settings = sanitizeGallerySettings(interaction.values ?? {});
					await pluginCtx.kv.set("settings", settings);
					await writeAudit(pluginCtx, "gallery.settings.update", "Updated gallery settings", { settings });
					return buildAdminBlocks(settings, "Gallery settings saved.");
				}
				return buildAdminBlocks(await readSettings(pluginCtx, {}));
			},
		},
		settings: {
			handler: async (routeCtx: any, pluginCtx: PluginContext): Promise<unknown> => {
				if (routeCtx.request.method === "POST") {
					const body = (await routeCtx.request.json()) as Record<string, unknown>;
					const settings = sanitizeGallerySettings(body);
					await pluginCtx.kv.set("settings", settings);
					await writeAudit(pluginCtx, "gallery.settings.update", "Updated gallery settings route", { settings });
					return { success: true, settings };
				}
				return { settings: await readSettings(pluginCtx, {}) };
			},
		},
		"public/list": {
			public: true,
			handler: async (_routeCtx: any, pluginCtx: PluginContext): Promise<unknown> => {
				if (!pluginCtx.content) return { items: [], source: "content-api-unavailable" };
				const result = await pluginCtx.content.list(AWCMS_GALLERY_COLLECTION, { limit: 50 });
				return {
					items: result.items,
					cursor: result.cursor,
					hasMore: result.hasMore,
				};
			},
		},
		"media/validate": {
			handler: async (routeCtx: any, pluginCtx: PluginContext): Promise<unknown> => {
				const item = (await routeCtx.request.json()) as unknown;
				const settings = await readSettings(pluginCtx, {});
				const result = validateGalleryItem(item, 0, settings);
				if (!result.valid) {
					await writeAudit(pluginCtx, "gallery.media.reject", "Rejected gallery media item", { errors: result.errors });
					return { success: false, errors: result.errors };
				}
				await writeAudit(pluginCtx, "gallery.media.accept", "Accepted gallery media item", {});
				return { success: true };
			},
		},
	},
} satisfies SandboxedPlugin;

export default sandboxPlugin;
