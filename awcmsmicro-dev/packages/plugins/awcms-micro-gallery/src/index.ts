import type { PluginDescriptor, ResolvedPlugin } from "emdash";

import { version } from "../package.json";
import {
	AWCMS_GALLERY_COLLECTION,
	DEFAULT_MAX_IMAGE_BYTES,
	DEFAULT_MAX_VIDEO_BYTES,
	sanitizeGallerySettings,
	validateGalleryContent,
	validateGalleryItem,
} from "./validation.js";

export interface AwcmsMicroGalleryPluginOptions {
	maxImageBytes?: number;
	maxVideoBytes?: number;
	cloudflareImages?: boolean;
	cloudflareStream?: boolean;
}

export const AWCMS_GALLERY_PLUGIN_ID = "awcms-micro-gallery";

export const AWCMS_GALLERY_CAPABILITIES = [
	"content:read",
	"content:write",
	"media:read",
	"media:write",
] as const;

export const AWCMS_GALLERY_ADMIN_PAGES = [{ path: "/", label: "Gallery", icon: "image" }];

export const AWCMS_GALLERY_SETTINGS_SCHEMA = {
	maxImageBytes: {
		type: "number" as const,
		label: "Maximum image bytes",
		description: "Images larger than this are rejected by gallery validation routes and hooks.",
		default: DEFAULT_MAX_IMAGE_BYTES,
		min: 1,
	},
	maxVideoBytes: {
		type: "number" as const,
		label: "Maximum video bytes",
		description: "Videos larger than this are rejected by gallery validation routes and hooks.",
		default: DEFAULT_MAX_VIDEO_BYTES,
		min: 1,
	},
	cloudflareImagesEnabled: {
		type: "boolean" as const,
		label: "Cloudflare Images enabled",
		default: false,
	},
	cloudflareStreamEnabled: {
		type: "boolean" as const,
		label: "Cloudflare Stream enabled",
		default: false,
	},
};

export function awcmsMicroGalleryPlugin(
	options: AwcmsMicroGalleryPluginOptions = {},
): PluginDescriptor<AwcmsMicroGalleryPluginOptions> {
	return {
		id: AWCMS_GALLERY_PLUGIN_ID,
		version,
		entrypoint: "@awcms-micro/plugin-gallery/sandbox",
		options,
		format: "standard",
		capabilities: [...AWCMS_GALLERY_CAPABILITIES],
		allowedHosts: [],
		adminPages: AWCMS_GALLERY_ADMIN_PAGES,
		storage: {
			auditEvents: { indexes: ["timestamp", "kind", "contentId"] },
		},
	};
}

function settingsFromOptions(options: AwcmsMicroGalleryPluginOptions) {
	return sanitizeGallerySettings({
		maxImageBytes: options.maxImageBytes,
		maxVideoBytes: options.maxVideoBytes,
		cloudflareImagesEnabled: options.cloudflareImages === true,
		cloudflareStreamEnabled: options.cloudflareStream === true,
	});
}

async function readSettings(ctx: any, options: AwcmsMicroGalleryPluginOptions) {
	const defaults = settingsFromOptions(options);
	const saved = (await ctx.kv.get("settings")) as Record<string, unknown> | null;
	return sanitizeGallerySettings({ ...defaults, ...saved });
}

async function writeAudit(ctx: any, kind: string, summary: string, metadata: Record<string, unknown>) {
	const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
	await ctx.storage.auditEvents.put(id, {
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
				stats: [
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

export function createPlugin(options: AwcmsMicroGalleryPluginOptions = {}): ResolvedPlugin {
	return {
		id: AWCMS_GALLERY_PLUGIN_ID,
		version,
		capabilities: [...AWCMS_GALLERY_CAPABILITIES],
		allowedHosts: [],
		storage: {
			auditEvents: { indexes: ["timestamp", "kind", "contentId"] },
		},
		hooks: {
			"content:beforeSave": {
				handler: async (event: any, ctx: any) => {
					if (event.collection !== AWCMS_GALLERY_COLLECTION) return event.content;
					const settings = await readSettings(ctx, options);
					const result = validateGalleryContent(event.content, settings);
					await writeAudit(ctx, result.valid ? "gallery.validation.ok" : "gallery.validation.reject", "Validated gallery content before save", {
						contentId: event.content?.id,
						errors: result.errors,
					});
					if (!result.valid) {
						throw new Error(`Invalid gallery content: ${result.errors.join("; ")}`);
					}
					return event.content;
				},
			},
		},
		routes: {
			admin: {
				handler: async (ctx: any) => {
					const interaction = ctx.input as { type?: string; page?: string; action_id?: string; values?: Record<string, unknown> };
					if (interaction.type === "form_submit" && interaction.action_id === "save_settings") {
						const settings = sanitizeGallerySettings(interaction.values ?? {});
						await ctx.kv.set("settings", settings);
						await writeAudit(ctx, "gallery.settings.update", "Updated gallery settings", { settings });
						return buildAdminBlocks(settings, "Gallery settings saved.");
					}
					return buildAdminBlocks(await readSettings(ctx, options));
				},
			},
			settings: {
				handler: async (ctx: any) => {
					if (ctx.request.method === "POST") {
						const body = (await ctx.request.json()) as Record<string, unknown>;
						const settings = sanitizeGallerySettings(body);
						await ctx.kv.set("settings", settings);
						await writeAudit(ctx, "gallery.settings.update", "Updated gallery settings route", { settings });
						return { success: true, settings };
					}
					return { settings: await readSettings(ctx, options) };
				},
			},
			"public/list": {
				public: true,
				handler: async (ctx: any) => {
					if (!ctx.content) return { items: [], source: "content-api-unavailable" };
					const result = await ctx.content.list(AWCMS_GALLERY_COLLECTION, { limit: 50 });
					return {
						items: result.items,
						cursor: result.cursor,
						hasMore: result.hasMore,
					};
				},
			},
			"media/validate": {
				handler: async (ctx: any) => {
					const item = (await ctx.request.json()) as unknown;
					const settings = await readSettings(ctx, options);
					const result = validateGalleryItem(item, 0, settings);
					if (!result.valid) {
						await writeAudit(ctx, "gallery.media.reject", "Rejected gallery media item", { errors: result.errors });
						return { success: false, errors: result.errors };
					}
					await writeAudit(ctx, "gallery.media.accept", "Accepted gallery media item", {});
					return { success: true };
				},
			},
		},
		admin: {
			settingsSchema: AWCMS_GALLERY_SETTINGS_SCHEMA,
			pages: AWCMS_GALLERY_ADMIN_PAGES,
		},
	} as unknown as ResolvedPlugin;
}

export default createPlugin;
export { validateGalleryContent, validateGalleryItem } from "./validation.js";
export type { GalleryItem, GalleryLayout, GalleryType } from "./validation.js";
