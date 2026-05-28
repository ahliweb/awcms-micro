import type { PluginContext, SandboxedPlugin } from "emdash/plugin";

import {
	AWCMS_GALLERY_COLLECTION,
	sanitizeGallerySettings,
	validateGalleryContent,
	validateGalleryItem,
} from "./validation.js";
import { translateGallery, type GalleryTranslationKey } from "./i18n.js";

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

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

async function buildAdminBlocks(routeCtx: any, pluginCtx: PluginContext, settings: ReturnType<typeof sanitizeGallerySettings>, locale: string | undefined, state: { view: string; id?: string; search?: string }, toastMessage?: string) {
	const t = (key: GalleryTranslationKey) => translateGallery(key, locale);
	
	if (state.view === "create" || state.view === "edit") {
		let entry: any = null;
		if (state.view === "edit" && state.id && pluginCtx.content) {
			try {
				const result = await pluginCtx.content.get(AWCMS_GALLERY_COLLECTION, state.id);
				if (result) {
					entry = result.data;
				}
			} catch (e) {
				// Handle gracefully
			}
		}

		return {
			blocks: [
				{ type: "header", text: state.view === "create" ? t("gallery.create") : t("gallery.edit") },
				{
					type: "actions",
					elements: [
						{ type: "button", label: t("gallery.back"), action_id: "nav_list", style: "secondary" }
					]
				},
				{ type: "divider" },
				{
					type: "form",
					block_id: "gallery-entry-form",
					fields: [
						{
							type: "text_input",
							action_id: "title",
							label: t("gallery.title_label"),
							initial_value: entry?.title || "",
						},
						{
							type: "text_input",
							action_id: "description",
							label: t("gallery.description_label"),
							initial_value: entry?.description || "",
							multiline: true
						},
						{
							type: "select",
							action_id: "gallery_type",
							label: t("gallery.type_label"),
							options: [
								{ label: "Photo", value: "photo" },
								{ label: "Video", value: "video" },
								{ label: "Mixed", value: "mixed" }
							],
							initial_value: entry?.gallery_type || "photo"
						},
						{
							type: "select",
							action_id: "layout_variant",
							label: t("gallery.layout_label"),
							options: [
								{ label: "Grid", value: "grid" },
								{ label: "Masonry", value: "masonry" },
								{ label: "Carousel", value: "carousel" },
								{ label: "Slider", value: "slider" }
							],
							initial_value: entry?.layout_variant || "grid"
						},
						{
							type: "date_input",
							action_id: "event_date",
							label: t("gallery.event_date_label"),
							initial_value: entry?.event_date ? new Date(entry.event_date).toISOString().split("T")[0] : ""
						},
						{
							type: "text_input",
							action_id: "location",
							label: t("gallery.location_label"),
							initial_value: entry?.location || ""
						},
						{
							type: "media_picker",
							action_id: "cover_image_src",
							label: t("gallery.cover_image_label"),
							initial_value: typeof entry?.cover_image === "string" ? entry.cover_image : entry?.cover_image?.src || ""
						},
						{
							type: "toggle",
							action_id: "featured",
							label: t("gallery.featured_label"),
							initial_value: entry?.featured === true
						},
						{
							type: "repeater",
							action_id: "gallery_items",
							label: t("gallery.items_label"),
							item_label: "Item",
							initial_value: entry?.gallery_items || [],
							fields: [
								{
									type: "select",
									action_id: "type",
									label: t("gallery.item_type"),
									options: [
										{ label: "Image", value: "image" },
										{ label: "Video", value: "video" }
									]
								},
								{
									type: "text_input",
									action_id: "src",
									label: t("gallery.item_src")
								},
								{
									type: "text_input",
									action_id: "alt",
									label: t("gallery.item_alt")
								},
								{
									type: "text_input",
									action_id: "caption",
									label: t("gallery.item_caption")
								}
							]
						}
					],
					submit: { label: t("gallery.save_gallery"), action_id: "save_gallery" }
				}
			]
		};
	}

	// Default Tab: List & Settings
	const galleriesList: any[] = [];
	if (pluginCtx.content) {
		try {
			const res = await pluginCtx.content.list(AWCMS_GALLERY_COLLECTION, { limit: 100 });
			if (res && res.items) {
				galleriesList.push(...res.items);
			}
		} catch (e) {
			// Catch pre-migration / missing table issues gracefully
		}
	}

	// Filter galleries list if search query exists
	const filteredGalleries = state.search
		? galleriesList.filter((g: any) => {
				const title = (g.data?.title || "").toLowerCase();
				const desc = (g.data?.description || "").toLowerCase();
				const loc = (g.data?.location || "").toLowerCase();
				return title.includes(state.search!.toLowerCase()) || desc.includes(state.search!.toLowerCase()) || loc.includes(state.search!.toLowerCase());
		  })
		: galleriesList;

	// Build Tab 1: Galleries list
	const listBlocks: any[] = [
		{
			type: "form",
			block_id: "search-form",
			fields: [
				{
					type: "text_input",
					action_id: "search_query",
					label: "Search Galleries",
					initial_value: state.search || "",
					placeholder: "Type title, description, or location..."
				}
			],
			submit: { label: "Search", action_id: "search_galleries" }
		},
		{
			type: "actions",
			elements: [
				{ type: "button", label: t("gallery.create"), action_id: "nav_create", style: "primary" }
			]
		},
		{ type: "divider" }
	];

	if (filteredGalleries.length === 0) {
		listBlocks.push({ type: "context", text: t("gallery.no_entries") });
	} else {
		for (const g of filteredGalleries) {
			const dateStr = g.data?.event_date ? new Date(g.data.event_date).toLocaleDateString(locale, { dateStyle: "medium" }) : "-";
			const itemsCount = Array.isArray(g.data?.gallery_items) ? g.data.gallery_items.length : 0;
			
			listBlocks.push(
				{
					type: "section",
					text: `### **${g.data?.title || g.id}**\n${g.data?.description || ""}\n\n📍 *${g.data?.location || "-"}*  |  📅 *${dateStr}*  |  🏷️ *${g.data?.gallery_type || "mixed"}* (${itemsCount} items)`
				},
				{
					type: "actions",
					elements: [
						{ type: "button", label: t("gallery.edit"), action_id: "nav_edit", value: g.id, style: "secondary" },
						{
							type: "button",
							label: t("gallery.delete"),
							action_id: "delete_gallery",
							value: g.id,
							style: "danger",
							confirm: {
								title: t("gallery.delete"),
								text: "Are you sure you want to delete this gallery?",
								confirm: "Yes, Delete",
								deny: "Cancel",
								style: "danger"
							}
						}
					]
				},
				{ type: "divider" }
			);
		}
	}

	// Build Tab 2: Settings
	const settingsBlocks: any[] = [
		{
			type: "stats",
			items: [
				{ label: t("gallery.images"), value: `${Math.round(settings.maxImageBytes / 1024 / 1024)} MB` },
				{ label: t("gallery.videos"), value: `${Math.round(settings.maxVideoBytes / 1024 / 1024)} MB` },
				{ label: t("gallery.cf_images"), value: settings.cloudflareImagesEnabled ? t("gallery.value.enabled") : t("gallery.value.optional") },
				{ label: t("gallery.cf_stream"), value: settings.cloudflareStreamEnabled ? t("gallery.value.enabled") : t("gallery.value.optional") },
			],
		},
		{
			type: "form",
			block_id: "gallery-settings",
			fields: [
				{
					type: "number_input",
					action_id: "maxImageBytes",
					label: t("gallery.max_img"),
					initial_value: settings.maxImageBytes,
					min: 1,
				},
				{
					type: "number_input",
					action_id: "maxVideoBytes",
					label: t("gallery.max_vid"),
					initial_value: settings.maxVideoBytes,
					min: 1,
				},
				{
					type: "toggle",
					action_id: "cloudflareImagesEnabled",
					label: t("gallery.cf_images_enable"),
					initial_value: settings.cloudflareImagesEnabled,
				},
				{
					type: "toggle",
					action_id: "cloudflareStreamEnabled",
					label: t("gallery.cf_stream_enable"),
					initial_value: settings.cloudflareStreamEnabled,
				},
			],
			submit: { label: t("gallery.save"), action_id: "save_settings" },
		}
	];

	const res: any = {
		blocks: [
			{ type: "header", text: t("gallery.title") },
			{ type: "section", text: t("gallery.desc") },
			{
				type: "tab",
				panels: [
					{ label: t("gallery.label"), blocks: listBlocks },
					{ label: "Settings", blocks: settingsBlocks }
				]
			}
		]
	};

	if (toastMessage) {
		res.toast = { message: toastMessage, type: "success" };
	}

	return res;
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
				const interaction = routeCtx.input as { type?: string; page?: string; action_id?: string; value?: string; values?: Record<string, unknown> };
				const locale = routeCtx.request?.headers?.["accept-language"];
				const settings = await readSettings(pluginCtx, {});

				let state = (await pluginCtx.kv.get("admin:state")) as { view: string; id?: string; search?: string } | null;
				if (!state || (interaction.type === "page_load" && interaction.page === "/")) {
					state = { view: "list", search: "" };
					await pluginCtx.kv.set("admin:state", state);
				}

				let toastMessage: string | undefined;

				if (interaction.type === "block_action") {
					if (interaction.action_id === "nav_create") {
						state = { view: "create", search: state.search };
						await pluginCtx.kv.set("admin:state", state);
					} else if (interaction.action_id === "nav_edit") {
						state = { view: "edit", id: interaction.value, search: state.search };
						await pluginCtx.kv.set("admin:state", state);
					} else if (interaction.action_id === "nav_list") {
						state = { view: "list", search: state.search };
						await pluginCtx.kv.set("admin:state", state);
					} else if (interaction.action_id === "delete_gallery" && interaction.value && pluginCtx.content?.delete) {
						try {
							await pluginCtx.content.delete(AWCMS_GALLERY_COLLECTION, interaction.value);
							await writeAudit(pluginCtx, "gallery.entry.delete", `Deleted gallery ${interaction.value}`, { id: interaction.value });
							toastMessage = translateGallery("gallery.deleted_entry", locale);
						} catch (e: any) {
							pluginCtx.log.error(`Delete gallery error: ${e.message}`);
						}
						state = { view: "list", search: state.search };
						await pluginCtx.kv.set("admin:state", state);
					}
				} else if (interaction.type === "form_submit") {
					if (interaction.action_id === "save_settings") {
						const newSettings = sanitizeGallerySettings(interaction.values ?? {});
						await pluginCtx.kv.set("settings", newSettings);
						await writeAudit(pluginCtx, "gallery.settings.update", "Updated gallery settings", { settings: newSettings });
						toastMessage = translateGallery("gallery.saved", locale);
						return buildAdminBlocks(routeCtx, pluginCtx, newSettings, locale, state, toastMessage);
					} else if (interaction.action_id === "search_galleries") {
						const searchVal = typeof interaction.values?.search_query === "string" ? interaction.values.search_query.trim() : "";
						state = { view: "list", search: searchVal };
						await pluginCtx.kv.set("admin:state", state);
					} else if (interaction.action_id === "save_gallery" && pluginCtx.content) {
						const values = interaction.values || {};
						const title = typeof values.title === "string" ? values.title : "Untitled Gallery";
						const description = typeof values.description === "string" ? values.description : "";
						const gallery_type = typeof values.gallery_type === "string" ? values.gallery_type : "photo";
						const layout_variant = typeof values.layout_variant === "string" ? values.layout_variant : "grid";
						const event_date = typeof values.event_date === "string" && values.event_date ? new Date(values.event_date).toISOString() : null;
						const location = typeof values.location === "string" ? values.location : "";
						const featured = values.featured === true;
						const cover_image_src = typeof values.cover_image_src === "string" ? values.cover_image_src : "";
						const gallery_items = Array.isArray(values.gallery_items) ? values.gallery_items : [];

						const galleryData = {
							title,
							description,
							gallery_type,
							layout_variant,
							event_date,
							location,
							featured,
							cover_image: cover_image_src ? { src: cover_image_src, alt: title } : null,
							gallery_items
						};

						try {
							if (state.view === "create" && pluginCtx.content.create) {
								const slug = slugify(title);
								await pluginCtx.content.create(AWCMS_GALLERY_COLLECTION, {
									slug,
									status: "published",
									data: galleryData
								});
								await writeAudit(pluginCtx, "gallery.entry.create", `Created gallery ${title}`, { title, slug });
							} else if (state.view === "edit" && state.id && pluginCtx.content.update) {
								const slug = slugify(title);
								await pluginCtx.content.update(AWCMS_GALLERY_COLLECTION, state.id, {
									slug,
									status: "published",
									data: galleryData
								});
								await writeAudit(pluginCtx, "gallery.entry.update", `Updated gallery ${title}`, { id: state.id, title, slug });
							}
							toastMessage = translateGallery("gallery.saved_entry", locale);
						} catch (e: any) {
							pluginCtx.log.error(`Save gallery error: ${e.message}`);
						}

						state = { view: "list", search: state.search };
						await pluginCtx.kv.set("admin:state", state);
					}
				}

				return buildAdminBlocks(routeCtx, pluginCtx, settings, locale, state, toastMessage);
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
				const locale = routeCtx.request?.headers?.["accept-language"];
				const item = (await routeCtx.request.json()) as unknown;
				const settings = await readSettings(pluginCtx, {});
				const result = validateGalleryItem(item, 0, settings, locale);
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
