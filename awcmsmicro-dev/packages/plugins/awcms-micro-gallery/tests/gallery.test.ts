import { describe, expect, it, vi } from "vitest";

import { awcmsMicroGalleryPlugin, createPlugin, validateGalleryContent, validateGalleryItem } from "../src/index.js";

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
});
