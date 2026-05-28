import { describe, expect, it, vi } from "vitest";

import { awcmsMicroGalleryPlugin, createPlugin, validateGalleryContent, validateGalleryItem } from "../src/index.js";
import sandboxPlugin from "../src/sandbox.js";

function createMockContext() {
	const kv = new Map<string, unknown>();
	const audit = new Map<string, unknown>();
	return {
		plugin: { id: "awcms-micro-gallery", version: "0.0.1" },
		kv: {
			get: vi.fn(async (key: string) => kv.get(key) ?? null),
			set: vi.fn(async (key: string, value: unknown) => kv.set(key, value)),
		},
		storage: {
			auditEvents: {
				put: vi.fn(async (id: string, value: unknown) => audit.set(id, value)),
			},
		},
		content: {
			list: vi.fn(async () => ({ items: [{ id: "community-cleanup", data: { title: "Community Cleanup" } }], cursor: undefined, hasMore: false })),
		},
		log: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
		_audit: audit,
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
				{ type: "image", src: "/_emdash/api/media/file/launch.jpg", mimeType: "image/jpeg", filename: "launch.jpg", sizeBytes: 1024, alt: "Launch day ribbon cutting" },
				{ type: "video", src: "https://customer.example/video.mp4", mimeType: "video/mp4", filename: "launch.mp4", sizeBytes: 2048, caption: "Launch recap" },
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
		const result = validateGalleryContent({ title: "", gallery_type: "invalid", layout_variant: "invalid", gallery_items: [] }, {}, "id");

		expect(result.valid).toBe(false);
		expect(result.errors.join(" ")).toContain("Judul galeri wajib diisi");
		expect(result.errors.join(" ")).toContain("Tipe galeri harus photo, video, atau mixed");
		expect(result.errors.join(" ")).toContain("Variant layout harus grid, masonry, carousel, atau slider");
	});

	it("serves public gallery list route through the content API", async () => {
		const plugin = createPlugin();
		const ctx = createMockContext();
		const handler = plugin.routes?.["public/list"]?.handler;

		expect(handler).toBeDefined();
		const response = await handler?.({ ...ctx, input: {}, request: new Request("https://example.test") } as never);

		expect(response).toMatchObject({ items: [{ id: "community-cleanup" }] });
		expect(ctx.content.list).toHaveBeenCalledWith("galleries", { limit: 50 });
	});

	it("returns invalid media rejection from the validation API", async () => {
		const plugin = createPlugin();
		const ctx = createMockContext();
		const handler = plugin.routes?.["media/validate"]?.handler;
		const request = new Request("https://example.test", {
			method: "POST",
			body: JSON.stringify({ type: "video", src: "https://example.test/script.js", mimeType: "application/javascript" }),
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

		const settingsPanel = response.blocks.find((b: any) => b.type === "tab")?.panels.find((p: any) => p.label === "Settings");
		const statsBlock = settingsPanel?.blocks.find((b: any) => b.type === "stats");
		expect(statsBlock).toMatchObject({
			items: expect.arrayContaining([
				expect.objectContaining({ label: "Gambar Cloudflare", value: "Opsional" }),
			]),
		});
	});

	it("localizes the sandbox admin blocks for Indonesian requests", async () => {
		const ctx = createMockContext();
		const handler = (sandboxPlugin.routes?.admin as { handler?: (routeCtx: unknown, pluginCtx: unknown) => Promise<unknown> } | undefined)?.handler;

		const response = (await handler?.(
			{ input: {}, request: { headers: { "accept-language": "id-ID,id;q=0.9" } } } as never,
			ctx as never,
		)) as any;

		expect(response).toMatchObject({
			blocks: expect.arrayContaining([
				expect.objectContaining({ type: "header", text: "Galeri AWCMS-Micro" }),
			]),
		});

		const settingsPanel = response.blocks.find((b: any) => b.type === "tab")?.panels.find((p: any) => p.label === "Settings");
		const formBlock = settingsPanel?.blocks.find((b: any) => b.type === "form");
		expect(formBlock).toMatchObject({
			submit: expect.objectContaining({ label: "Simpan pengaturan" }),
		});
	});
});
