import { readFile } from "node:fs/promises";

import { describe, expect, it, vi } from "vitest";

import { translateGallery } from "../src/i18n.js";
import {
	awcmsMicroGalleryPlugin,
	createPlugin,
	validateGalleryContent,
	validateGalleryItem,
} from "../src/index.js";
import { AWCMS_GALLERY_PO_LOCALE_MESSAGES } from "../src/locales/messages.js";
import sandboxPlugin from "../src/sandbox.js";

type PoEntry = {
	msgctxt?: string;
	msgid?: string;
	msgstr?: string;
};

const unescapePo = (value: string) => value.replace(/\\"/g, '"').replace(/\\\\/g, "\\");

const parsePoEntries = (catalog: string) => {
	const entries: PoEntry[] = [];
	let current: PoEntry = {};

	for (const line of catalog.split("\n")) {
		const match = /^(msgctxt|msgid|msgstr) "((?:\\.|[^"\\])*)"$/.exec(line);
		if (!match) continue;
		const field = match[1] as keyof PoEntry;
		const value = match[2] ?? "";
		if (field === "msgctxt" && (current.msgid || current.msgstr)) {
			entries.push(current);
			current = {};
		}
		current[field as keyof PoEntry] = unescapePo(value);
		if (field === "msgstr") {
			entries.push(current);
			current = {};
		}
	}

	return entries;
};

const readCatalog = async (locale: "en" | "id") =>
	parsePoEntries(
		await readFile(new URL(`../src/locales/${locale}/messages.po`, import.meta.url), "utf8"),
	);

const placeholders = (value = "") =>
	Array.from(value.matchAll(/\{[A-Za-z0-9_]+\}|<\/?\d+>/g), String).sort();

function createMockContext() {
	const kv = new Map<string, unknown>();
	const legacyRows: any[] = [];
	const galleryAuditRows = new Map<string, any>();
	const mediaItems = [
		{
			id: "media-1",
			filename: "hero.jpg",
			mimeType: "image/jpeg",
			url: "/media/media-1/hero.jpg",
			createdAt: "2026-05-29T00:00:00.000Z",
		},
		{
			id: "media-2",
			filename: "clip.mp4",
			mimeType: "video/mp4",
			url: "/media/media-2/clip.mp4",
			createdAt: "2026-05-29T01:00:00.000Z",
		},
	];
	const schemaBuilder = {
		ifNotExists() {
			return schemaBuilder;
		},
		addColumn() {
			return schemaBuilder;
		},
		execute: vi.fn(async () => undefined),
	};
	const db = {
		schema: {
			createTable: vi.fn(() => schemaBuilder),
		},
		selectFrom(table: string) {
			const filters: Record<string, string> = {};
			const query = {
				select() {
					return query;
				},
				where(column: string, _op: string, value: string) {
					filters[column] = value;
					return query;
				},
				async execute() {
					if (table === "_plugin_storage") {
						return legacyRows
							.filter((row) => Object.entries(filters).every(([key, value]) => row[key] === value))
							.map((row) => ({ ...row }));
					}
					if (table === "gallery_audit_events") {
						return [...galleryAuditRows.values()]
							.filter((row) => Object.entries(filters).every(([key, value]) => row[key] === value))
							.map((row) => ({ ...row }));
					}
					return [];
				},
			};
			return query;
		},
		insertInto(table: string) {
			let nextRow: any;
			return {
				values(row: any) {
					nextRow = row;
					return this;
				},
				onConflict() {
					return {
						execute: async () => {
							if (table === "gallery_audit_events")
								galleryAuditRows.set(nextRow.id, { ...nextRow });
						},
					};
				},
				execute: async () => {
					if (table === "gallery_audit_events") galleryAuditRows.set(nextRow.id, { ...nextRow });
				},
			};
		},
		deleteFrom(table: string) {
			const filters: Record<string, string> = {};
			const query = {
				where(column: string, _op: string, value: string) {
					filters[column] = value;
					return query;
				},
				async execute() {
					if (table === "_plugin_storage") {
						for (let index = legacyRows.length - 1; index >= 0; index -= 1) {
							if (
								Object.entries(filters).every(([key, value]) => legacyRows[index][key] === value)
							) {
								legacyRows.splice(index, 1);
							}
						}
					}
				},
			};
			return query;
		},
	};
	return {
		plugin: { id: "awcms-micro-gallery", version: "0.0.1" },
		kv: {
			get: vi.fn(async (key: string) => kv.get(key) ?? null),
			set: vi.fn(async (key: string, value: unknown) => kv.set(key, value)),
		},
		db,
		_legacyRows: legacyRows,
		_galleryAuditRows: galleryAuditRows,
		content: {
			list: vi.fn(async () => ({
				items: [{ id: "community-cleanup", data: { title: "Community Cleanup" } }],
				cursor: "next-page",
				hasMore: true,
			})),
			create: vi.fn(async (_collection: string, data: any) => ({
				id: "gallery-1",
				type: "galleries",
				slug: data.slug ?? "gallery-1",
				status: "published",
				locale: "en",
				data: data.data ?? {},
				createdAt: "2026-05-29T00:00:00.000Z",
				updatedAt: "2026-05-29T00:00:00.000Z",
				publishedAt: "2026-05-29T00:00:00.000Z",
			})),
			update: vi.fn(async (_collection: string, _id: string, data: any) => ({
				id: "gallery-1",
				type: "galleries",
				slug: data.slug ?? "gallery-1",
				status: "published",
				locale: "en",
				data: data.data ?? {},
				createdAt: "2026-05-29T00:00:00.000Z",
				updatedAt: "2026-05-29T00:00:00.000Z",
				publishedAt: "2026-05-29T00:00:00.000Z",
			})),
			delete: vi.fn(async () => true),
		},
		media: {
			list: vi.fn(async () => ({ items: mediaItems, cursor: "media-next", hasMore: true })),
			upload: vi.fn(async (_filename: string, _contentType: string, _bytes: ArrayBuffer) => ({
				mediaId: "media-uploaded",
				storageKey: "media-uploaded.jpg",
				url: "/media/media-uploaded/media-uploaded.jpg",
			})),
		},
		http: {
			fetch: vi.fn(
				async () =>
					new Response(new Uint8Array([1, 2, 3]), {
						status: 200,
						headers: { "content-type": "image/jpeg" },
					}),
			),
		},
		log: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
	};
}

describe("awcms micro gallery plugin", () => {
	it("builds a standard descriptor without EmDash core changes", () => {
		const descriptor = awcmsMicroGalleryPlugin();

		expect(descriptor.id).toBe("awcms-micro-gallery");
		expect(descriptor.format).toBe("standard");
		expect(descriptor.entrypoint).toBe("@awcms-micro/plugin-gallery/sandbox");
		expect(descriptor.capabilities).toContain("media:write");
		expect(descriptor.adminPages?.[0]?.path).toBe("/");
		expect((descriptor as any).navigation?.groups?.[0]).toMatchObject({
			id: "gallery-group",
			labelKey: "gallery.group",
			sidebarPlacement: "after-dashboard",
			sidebarPriority: 10,
		});
		expect(descriptor.storage).toBeUndefined();
	});

	it("resolves Gallery translations through the PO catalog adapter", () => {
		expect(translateGallery("gallery.title", "en")).toBe("AWCMS-Micro Gallery");
		expect(translateGallery("gallery.title", "id")).toBe("Galeri AWCMS-Micro");
		expect(translateGallery("gallery.error.imageSize", "id")).toContain("{limit}");
	});

	it("keeps Gallery PO catalogs synchronized with the compiled adapter", async () => {
		const expectedKeys = Object.keys(AWCMS_GALLERY_PO_LOCALE_MESSAGES.en).toSorted();

		for (const locale of ["en", "id"] as const) {
			const entries = await readCatalog(locale);
			expect(
				entries.map((entry) => entry.msgctxt).toSorted(),
				`${locale} PO catalog keys drifted`,
			).toEqual(expectedKeys);
			for (const entry of entries) {
				expect(
					placeholders(entry.msgstr),
					`${locale} placeholder drift in ${entry.msgctxt}`,
				).toEqual(placeholders(entry.msgid));
			}
		}
	});

	it("exports a sandbox plugin object", () => {
		expect(typeof sandboxPlugin).toBe("object");
		expect(sandboxPlugin).toHaveProperty("hooks");
		expect(sandboxPlugin).toHaveProperty("routes");
	});

	it("accepts valid mixed gallery content", () => {
		const result = validateGalleryContent({
			title: "Launch Day",
			gallery_type: "mixed",
			layout_variant: "grid",
			gallery_items: [
				{
					type: "image",
					src: "/_emdash/api/media/file/launch.jpg",
					mimeType: "image/jpeg",
					filename: "launch.jpg",
					sizeBytes: 1024,
					alt: "Launch day ribbon cutting",
				},
				{
					type: "video",
					src: "https://customer.example/video.mp4",
					mimeType: "video/mp4",
					filename: "launch.mp4",
					sizeBytes: 2048,
					caption: "Launch recap",
				},
			],
		});

		expect(result.valid).toBe(true);
		expect(result.errors).toEqual([]);
	});

	it("rejects unsafe media", () => {
		const result = validateGalleryItem({
			type: "image",
			src: "file:///private/key.jpg",
			mimeType: "application/x-msdownload",
			filename: "../key.jpg",
			sizeBytes: 20 * 1024 * 1024,
		});

		expect(result.valid).toBe(false);
		expect(result.errors.join(" ")).toContain("public EmDash media URL or HTTPS URL");
		expect(result.errors.join(" ")).toContain("MIME type");
		expect(result.errors.join(" ")).toContain("filename");
	});

	it("localizes gallery validation errors for Indonesian requests", () => {
		const result = validateGalleryContent(
			{ title: "", gallery_type: "invalid", layout_variant: "invalid", gallery_items: [] },
			{},
			"id",
		);

		expect(result.valid).toBe(false);
		expect(result.errors.join(" ")).toContain("Judul galeri wajib diisi");
		expect(result.errors.join(" ")).toContain("Tipe galeri harus photo, video, atau mixed");
		expect(result.errors.join(" ")).toContain(
			"Variant layout harus grid, masonry, carousel, atau slider",
		);
	});

	it("serves public gallery list route through the content API", async () => {
		const plugin = createPlugin();
		const ctx = createMockContext();
		const handler = plugin.routes?.["public/list"]?.handler;

		expect(handler).toBeDefined();
		const response = await handler?.({
			...ctx,
			input: {},
			request: new Request("https://example.test"),
		} as never);

		expect(response).toMatchObject({ items: [{ id: "community-cleanup" }] });
		expect(ctx.content.list).toHaveBeenCalledWith("galleries", { limit: 50 });
	});

	it("renders the admin page when the raw Accept-Language header is a full header value", async () => {
		// Regression: the raw Accept-Language header (e.g. "id-ID,id;q=0.9,en;q=0.8")
		// is NOT a valid Intl locale and previously crashed toLocaleDateString with a
		// RangeError, producing a 500 "Plugin route error" on the admin page.
		const plugin = createPlugin();
		const ctx = createMockContext() as any;
		ctx.content.list = vi.fn(async () => ({
			items: [
				{
					id: "gallery-with-date",
					data: {
						title: "Community Cleanup Gallery",
						location: "Community Hall",
						event_date: "2026-05-01T00:00:00.000Z",
						gallery_type: "mixed",
						gallery_items: [],
					},
				},
			],
			cursor: undefined,
			hasMore: false,
		}));
		const handler = plugin.routes?.admin?.handler;
		expect(handler).toBeDefined();

		const response = (await handler?.({
			...ctx,
			input: { type: "page_load", page: "/" },
			request: new Request("https://example.test", {
				headers: { "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7" },
			}),
		} as never)) as { blocks?: any[] };

		// The gallery table must render (not the degraded error blocks), proving the
		// locale was normalized and the event date formatted without throwing.
		const json = JSON.stringify(response);
		expect(json).toContain("gallery-table");
		expect(json).toContain("Community Cleanup Gallery");
		expect(ctx.log.error).not.toHaveBeenCalled();
	});

	it("renders the admin page with a malformed stored event_date without crashing", async () => {
		const plugin = createPlugin();
		const ctx = createMockContext() as any;
		ctx.content.list = vi.fn(async () => ({
			items: [
				{
					id: "gallery-bad-date",
					data: { title: "Broken Date Gallery", event_date: "not-a-real-date", gallery_items: [] },
				},
			],
			cursor: undefined,
			hasMore: false,
		}));
		const handler = plugin.routes?.admin?.handler;

		const response = (await handler?.({
			...ctx,
			input: { type: "page_load", page: "/" },
			request: new Request("https://example.test", {
				headers: { "accept-language": "en-US,en;q=0.9" },
			}),
		} as never)) as { blocks?: any[] };

		const json = JSON.stringify(response);
		expect(json).toContain("Broken Date Gallery");
		expect(ctx.log.error).not.toHaveBeenCalled();
	});

	it("migrates legacy gallery audit storage on activate", async () => {
		const plugin = createPlugin();
		const hook = plugin.hooks?.["plugin:activate"];
		const ctx = createMockContext() as any;
		ctx._legacyRows.push({
			plugin_id: "awcms-micro-gallery",
			collection: "auditEvents",
			id: "event-1",
			data: JSON.stringify({
				id: "event-1",
				timestamp: "2026-05-29T00:00:00.000Z",
				kind: "gallery.media.accept",
				summary: "Accepted gallery media item",
				metadata: {},
			}),
			created_at: "2026-05-29T00:00:00.000Z",
			updated_at: "2026-05-29T00:00:00.000Z",
		});

		await hook?.handler?.({} as never, ctx as never);

		expect(ctx._legacyRows).toHaveLength(0);
		expect([...ctx._galleryAuditRows.values()]).toHaveLength(1);
		expect([...ctx._galleryAuditRows.values()][0]).toMatchObject({
			id: "event-1",
			kind: "gallery.media.accept",
			summary: "Accepted gallery media item",
		});
	});

	it("renders paginated admin gallery and media tables", async () => {
		const plugin = createPlugin();
		const ctx = createMockContext();
		const handler = plugin.routes?.admin?.handler;

		const response = (await handler?.({
			...ctx,
			input: { type: "page_load", page: "/" },
			request: { headers: {} },
		} as never)) as any;

		const tab = response.blocks.find((b: any) => b.type === "tab");
		expect(tab.panels).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					label: "Gallery",
					blocks: expect.arrayContaining([
						expect.objectContaining({
							type: "table",
							page_action_id: "load-galleries-page",
							next_cursor: "next-page",
						}),
					]),
				}),
				expect.objectContaining({
					label: "Media",
					blocks: expect.arrayContaining([
						expect.objectContaining({
							type: "table",
							page_action_id: "load-media-page",
							next_cursor: "media-next",
						}),
					]),
				}),
			]),
		);
	});

	it("saves gallery content with media-library urls", async () => {
		const plugin = createPlugin();
		const ctx = createMockContext();
		const handler = plugin.routes?.admin?.handler;

		ctx.kv.get = vi.fn(async (key: string) => {
			if (key === "admin:state")
				return { view: "create", search: "", cursor: undefined, mediaCursor: undefined };
			return null;
		});

		await handler?.({
			...ctx,
			input: {
				type: "form_submit",
				action_id: "save_gallery",
				values: {
					title: "Launch Day",
					description: "Gallery launch",
					gallery_type: "mixed",
					layout_variant: "grid",
					location: "Jakarta",
					cover_image_src: "/media/media-1/hero.jpg",
					gallery_items: [
						{ type: "image", src: "/media/media-1/hero.jpg", alt: "Hero", caption: "Cover" },
					],
				},
			},
			request: { headers: {} },
		} as never);

		expect(ctx.content.create).toHaveBeenCalled();
		const createCall = (ctx.content.create as any).mock.calls[0][1];
		expect(createCall.data.cover_image.src).toBe("/media/media-1/hero.jpg");
		expect(createCall.data.gallery_items[0].src).toBe("/media/media-1/hero.jpg");
	});

	it("imports media from a source url", async () => {
		const plugin = createPlugin();
		const ctx = createMockContext();
		const handler = plugin.routes?.["media/import"]?.handler;

		const response = await handler?.({
			...ctx,
			input: { sourceUrl: "https://example.test/hero.jpg", filename: "hero.jpg" },
			request: { headers: {} },
		} as never);

		expect(response).toMatchObject({ success: true, mediaId: "media-uploaded" });
		expect(ctx.http.fetch).toHaveBeenCalledWith("https://example.test/hero.jpg");
		expect(ctx.media.upload).toHaveBeenCalled();
	});

	it("returns invalid media rejection from the validation API", async () => {
		const plugin = createPlugin();
		const ctx = createMockContext();
		const handler = plugin.routes?.["media/validate"]?.handler;
		const request = new Request("https://example.test", {
			method: "POST",
			body: JSON.stringify({
				type: "video",
				src: "https://example.test/script.js",
				mimeType: "application/javascript",
			}),
		});

		const response = await handler?.({ ...ctx, input: {}, request } as never);

		expect(response).toMatchObject({ success: false });
	});

	it("returns admin blocks with stats items for the blocks renderer", async () => {
		const plugin = createPlugin();
		const ctx = createMockContext();
		const handler = plugin.routes?.admin?.handler;

		expect(handler).toBeDefined();
		const response = await handler?.({
			...ctx,
			input: {},
			request: { headers: {} },
		} as never);

		expect(response).toMatchObject({
			blocks: expect.arrayContaining([
				expect.objectContaining({
					type: "tab",
					panels: expect.arrayContaining([
						expect.objectContaining({
							label: "Settings",
							blocks: expect.arrayContaining([
								expect.objectContaining({
									type: "stats",
									items: expect.any(Array),
								}),
							]),
						}),
					]),
				}),
			]),
		});
	});

	it("localizes the standard admin blocks for Indonesian requests", async () => {
		const plugin = createPlugin();
		const ctx = createMockContext();
		const handler = plugin.routes?.admin?.handler;

		const response = (await handler?.({
			...ctx,
			input: {},
			request: { headers: { "accept-language": "id-ID,id;q=0.9" } },
		} as never)) as any;

		expect(response).toMatchObject({
			blocks: expect.arrayContaining([
				expect.objectContaining({ type: "header", text: "Galeri AWCMS-Micro" }),
			]),
		});

		const settingsPanel = response.blocks
			.find((b: any) => b.type === "tab")
			?.panels.find((p: any) => p.label === "Pengaturan");
		const statsBlock = settingsPanel?.blocks.find((b: any) => b.type === "stats");
		expect(statsBlock).toMatchObject({
			items: expect.arrayContaining([
				expect.objectContaining({ label: "Gambar Cloudflare", value: "Opsional" }),
			]),
		});
	});

	it("localizes the sandbox admin blocks for Indonesian requests", async () => {
		const ctx = createMockContext();
		const handler = (
			sandboxPlugin.routes?.admin as
				| { handler?: (routeCtx: unknown, pluginCtx: unknown) => Promise<unknown> }
				| undefined
		)?.handler;

		const response = (await handler?.(
			{ input: {}, request: { headers: { "accept-language": "id-ID,id;q=0.9" } } } as never,
			ctx as never,
		)) as any;

		expect(response).toMatchObject({
			blocks: expect.arrayContaining([
				expect.objectContaining({ type: "header", text: "Galeri AWCMS-Micro" }),
			]),
		});

		const settingsPanel = response.blocks
			.find((b: any) => b.type === "tab")
			?.panels.find((p: any) => p.label === "Pengaturan");
		const formBlock = settingsPanel?.blocks.find((b: any) => b.type === "form");
		expect(formBlock).toMatchObject({
			submit: expect.objectContaining({ label: "Simpan pengaturan" }),
		});
	});

	it("renders the sandbox admin page on page_load with a raw Accept-Language header", async () => {
		// Regression for the production 500 "Plugin route error": the sandbox entry
		// (the runtime entrypoint) crashed when toLocaleDateString received the raw
		// Accept-Language header as a locale while rendering a gallery event date.
		const ctx = createMockContext() as any;
		ctx.content.list = vi.fn(async () => ({
			items: [
				{
					id: "gallery-with-date",
					data: {
						title: "Community Cleanup Gallery",
						event_date: "2026-05-01T00:00:00.000Z",
						gallery_type: "mixed",
						gallery_items: [],
					},
				},
			],
			cursor: undefined,
			hasMore: false,
		}));
		const handler = (
			sandboxPlugin.routes?.admin as
				| { handler?: (routeCtx: unknown, pluginCtx: unknown) => Promise<unknown> }
				| undefined
		)?.handler;

		const response = (await handler?.(
			{
				input: { type: "page_load", page: "/" },
				request: { headers: { "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7" } },
			} as never,
			ctx as never,
		)) as { blocks?: any[] };

		const json = JSON.stringify(response);
		expect(json).toContain("gallery-table");
		expect(json).toContain("Community Cleanup Gallery");
		expect(ctx.log.error).not.toHaveBeenCalled();
	});

	it("creates a gallery from the sandbox admin save_gallery interaction", async () => {
		const ctx = createMockContext() as any;
		const handler = (
			sandboxPlugin.routes?.admin as {
				handler?: (routeCtx: unknown, pluginCtx: unknown) => Promise<unknown>;
			}
		)?.handler;
		const request = { headers: { "accept-language": "en-US,en;q=0.9" } };

		// Enter the create view first so the save handler knows to create.
		await handler?.(
			{ input: { type: "block_action", action_id: "nav_create" }, request } as never,
			ctx as never,
		);
		await handler?.(
			{
				input: {
					type: "form_submit",
					action_id: "save_gallery",
					values: {
						title: "New Sandbox Gallery",
						description: "Created in sandbox",
						gallery_type: "photo",
						event_date: "2026-06-01",
						gallery_items: [],
					},
				},
				request,
			} as never,
			ctx as never,
		);

		expect(ctx.content.create).toHaveBeenCalledTimes(1);
		expect(ctx.content.create).toHaveBeenCalledWith(
			"galleries",
			expect.objectContaining({
				slug: "new-sandbox-gallery",
				status: "published",
				data: expect.objectContaining({
					title: "New Sandbox Gallery",
					event_date: "2026-06-01T00:00:00.000Z",
				}),
			}),
		);
		expect([...ctx._galleryAuditRows.values()]).toContainEqual(
			expect.objectContaining({ kind: "gallery.entry.create" }),
		);
		expect(ctx.log.error).not.toHaveBeenCalled();
	});

	it("updates a gallery from the sandbox admin save_gallery interaction", async () => {
		const ctx = createMockContext() as any;
		const handler = (
			sandboxPlugin.routes?.admin as {
				handler?: (routeCtx: unknown, pluginCtx: unknown) => Promise<unknown>;
			}
		)?.handler;
		const request = { headers: { "accept-language": "en-US,en;q=0.9" } };

		await handler?.(
			{
				input: { type: "block_action", action_id: "nav_edit", value: "gallery-1" },
				request,
			} as never,
			ctx as never,
		);
		await handler?.(
			{
				input: {
					type: "form_submit",
					action_id: "save_gallery",
					values: {
						title: "Updated Sandbox Gallery",
						description: "Updated in sandbox",
						gallery_type: "mixed",
						layout_variant: "carousel",
						event_date: "2026-06-02",
						location: "Bandung",
						gallery_items: [],
					},
				},
				request,
			} as never,
			ctx as never,
		);

		expect(ctx.content.update).toHaveBeenCalledTimes(1);
		expect(ctx.content.update).toHaveBeenCalledWith(
			"galleries",
			"gallery-1",
			expect.objectContaining({
				slug: "updated-sandbox-gallery",
				status: "published",
				data: expect.objectContaining({
					title: "Updated Sandbox Gallery",
					event_date: "2026-06-02T00:00:00.000Z",
				}),
			}),
		);
		expect([...ctx._galleryAuditRows.values()]).toContainEqual(
			expect.objectContaining({ kind: "gallery.entry.update" }),
		);
		expect(ctx.log.error).not.toHaveBeenCalled();
	});

	it("deletes a gallery from the sandbox admin delete_gallery interaction", async () => {
		const ctx = createMockContext() as any;
		const handler = (
			sandboxPlugin.routes?.admin as {
				handler?: (routeCtx: unknown, pluginCtx: unknown) => Promise<unknown>;
			}
		)?.handler;

		await handler?.(
			{
				input: { type: "block_action", action_id: "delete_gallery", value: "gallery-xyz" },
				request: { headers: { "accept-language": "en" } },
			} as never,
			ctx as never,
		);

		expect(ctx.content.delete).toHaveBeenCalledWith("galleries", "gallery-xyz");
		expect([...ctx._galleryAuditRows.values()]).toContainEqual(
			expect.objectContaining({ kind: "gallery.entry.delete" }),
		);
	});

	it("imports media from the sandbox admin import_media interaction", async () => {
		const ctx = createMockContext() as any;
		const handler = (
			sandboxPlugin.routes?.admin as {
				handler?: (routeCtx: unknown, pluginCtx: unknown) => Promise<unknown>;
			}
		)?.handler;

		await handler?.(
			{
				input: {
					type: "form_submit",
					action_id: "import_media",
					values: { source_url: "https://example.test/photo.jpg", filename: "photo.jpg" },
				},
				request: { headers: { "accept-language": "en" } },
			} as never,
			ctx as never,
		);

		expect(ctx.media.upload).toHaveBeenCalled();
		expect([...ctx._galleryAuditRows.values()]).toContainEqual(
			expect.objectContaining({ kind: "gallery.media.import" }),
		);
	});

	it("applies the search filter from the sandbox admin search_galleries interaction", async () => {
		const ctx = createMockContext() as any;
		const handler = (
			sandboxPlugin.routes?.admin as {
				handler?: (routeCtx: unknown, pluginCtx: unknown) => Promise<unknown>;
			}
		)?.handler;

		await handler?.(
			{
				input: {
					type: "form_submit",
					action_id: "search_galleries",
					values: { search_query: "cleanup" },
				},
				request: { headers: { "accept-language": "en" } },
			} as never,
			ctx as never,
		);

		const state = (await ctx.kv.get("admin:state")) as { search?: string; view?: string };
		expect(state.search).toBe("cleanup");
		expect(state.view).toBe("list");
	});
});
