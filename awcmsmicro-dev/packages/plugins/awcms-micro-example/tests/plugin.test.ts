import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it, vi } from "vitest";

import { awcmsMicroExamplePlugin } from "../src/index.js";
import sandboxPlugin from "../src/sandbox.js";
import { AWCMS_EXAMPLE_PERMISSION_LIST } from "../src/permissions.js";
import {
	AWCMS_EXAMPLE_ADMIN_PAGES,
	AWCMS_EXAMPLE_ADMIN_WIDGETS,
	AWCMS_EXAMPLE_CAPABILITIES,
	AWCMS_EXAMPLE_DESCRIPTOR_STORAGE,
	AWCMS_EXAMPLE_FIELD_WIDGETS,
	AWCMS_EXAMPLE_PLUGIN_ID,
	AWCMS_EXAMPLE_PORTABLE_TEXT_BLOCKS,
	createAuditRecord,
	createNativeRoutes,
	createSharedHooks,
} from "../src/runtime.js";

function parseJsoncObject<T>(source: string): T {
	return Function(`return (${source})`)() as T;
}

function createMockContext() {
	const kvData = new Map<string, unknown>();
	const auditEvents = new Map<string, unknown>();
	const contentSnapshots = new Map<string, unknown>();
	const cron = {
		schedule: vi.fn(async () => {}),
		cancel: vi.fn(async () => {}),
	};

	return {
		ctx: {
			plugin: { id: AWCMS_EXAMPLE_PLUGIN_ID, version: "0.0.1" },
			request: new Request("https://example.test"),
			requestMeta: { ip: "127.0.0.1" },
			input: {},
			cron,
			log: {
				info: vi.fn(),
				warn: vi.fn(),
				error: vi.fn(),
				debug: vi.fn(),
			},
			kv: {
				get: vi.fn(async (key: string) => (kvData.has(key) ? kvData.get(key) : null)),
				set: vi.fn(async (key: string, value: unknown) => {
					kvData.set(key, value);
				}),
				delete: vi.fn(async (key: string) => kvData.delete(key)),
				list: vi.fn(async (prefix?: string) =>
					[...kvData.entries()]
						.filter(([key]) => !prefix || key.startsWith(prefix))
						.map(([key, value]) => ({ key, value })),
				),
			},
			storage: {
					auditEvents: {
						put: vi.fn(async (id: string, value: unknown) => {
							auditEvents.set(id, value);
						}),
						query: vi.fn(async () => ({
							items: Array.from(auditEvents.entries(), ([id, data]) => ({ id, data })),
							cursor: undefined,
							hasMore: false,
						})),
					count: vi.fn(async () => auditEvents.size),
				},
					contentSnapshots: {
						put: vi.fn(async (id: string, value: unknown) => {
							contentSnapshots.set(id, value);
						}),
						query: vi.fn(async () => ({
							items: Array.from(contentSnapshots.entries(), ([id, data]) => ({ id, data })),
							cursor: undefined,
							hasMore: false,
						})),
					count: vi.fn(async () => contentSnapshots.size),
				},
			},
		},
		auditEvents,
		contentSnapshots,
		kvData,
		cron,
	};
}

describe("awcms micro example plugin", () => {
	it("builds a descriptor without touching EmDash core", () => {
		const descriptor = awcmsMicroExamplePlugin();

		expect(descriptor.id).toBe("awcms-micro-example");
		expect(descriptor.adminEntry).toBe("@awcms-micro/plugin-example/admin");
		expect(descriptor.capabilities).toEqual([...AWCMS_EXAMPLE_CAPABILITIES]);
		expect(descriptor.storage).toEqual(AWCMS_EXAMPLE_DESCRIPTOR_STORAGE);
		expect(descriptor.adminPages).toEqual(AWCMS_EXAMPLE_ADMIN_PAGES);
		expect(descriptor.adminWidgets).toEqual(AWCMS_EXAMPLE_ADMIN_WIDGETS);
	});

	it("exposes the expected permission namespace", () => {
		expect(AWCMS_EXAMPLE_PERMISSION_LIST).toContain("awcms:example:dashboard:read");
		expect(AWCMS_EXAMPLE_PERMISSION_LIST).toContain("awcms:example:audit:read");
	});

	it("creates structured audit records", () => {
		const record = createAuditRecord({
			kind: "settings.update",
			scope: "settings",
			actor: "system",
			summary: "Updated settings",
			metadata: { governanceMode: "review" },
		});

		expect(record.kind).toBe("settings.update");
		expect(record.scope).toBe("settings");
		expect(record.actor).toBe("system");
		expect(record.summary).toBe("Updated settings");
	});

	it("declares admin pages, widgets, blocks, and field widgets", () => {
		expect(AWCMS_EXAMPLE_ADMIN_PAGES).toHaveLength(2);
		expect(AWCMS_EXAMPLE_ADMIN_WIDGETS[0]?.id).toBe("governance-status");
		expect(AWCMS_EXAMPLE_PORTABLE_TEXT_BLOCKS[0]?.type).toBe("awcms-access-note");
		expect(AWCMS_EXAMPLE_FIELD_WIDGETS[0]?.name).toBe("status-badge");
	});

	it("exposes public and protected routes", async () => {
		const { ctx, kvData, auditEvents } = createMockContext();
		const routes = createNativeRoutes();

		await routes["settings/save"]!.handler({
			...ctx,
			input: {
				publicStatusLabel: "green",
				auditRetentionDays: 14,
				governanceMode: "observe",
				metadataCanonicalBase: "https://example.test",
			},
		} as any);

		const publicResult = (await routes["public/status"]!.handler({ ...ctx, input: {} } as any)) as any;
		expect(publicResult.status).toBe("green");
		expect(publicResult.plugin.visibility).toBe("public-safe");
		expect(kvData.get("settings:governanceMode")).toBe("observe");
		expect(auditEvents.size).toBeGreaterThan(0);
	});

	it("records lifecycle and cron behavior", async () => {
		const { ctx, cron, kvData, auditEvents } = createMockContext();
		const hooks = createSharedHooks();

		const activate =
			typeof hooks?.["plugin:activate"] === "function"
				? hooks["plugin:activate"]
				: hooks?.["plugin:activate"]?.handler;
		const cronHook = typeof hooks?.cron === "function" ? hooks.cron : hooks?.cron?.handler;

		await activate!({} as any, ctx as any);
		await cronHook!(
			{ name: "governance-summary", schedule: "0 * * * *", triggeredAt: new Date().toISOString() } as any,
			ctx as any,
		);

		expect(cron.schedule).toHaveBeenCalledWith("governance-summary", { schedule: "0 * * * *" });
		expect(kvData.get("state:lastLifecycle")).toBe("plugin:activate");
		expect(kvData.get("state:lastCronAt")).toBeTruthy();
		expect(auditEvents.size).toBeGreaterThan(1);
	});

	it("records content and media hooks", async () => {
		const { ctx, auditEvents, contentSnapshots } = createMockContext();
		const hooks = createSharedHooks();

		const beforeSave =
			typeof hooks?.["content:beforeSave"] === "function"
				? hooks["content:beforeSave"]
				: hooks?.["content:beforeSave"]?.handler;
		const afterPublish =
			typeof hooks?.["content:afterPublish"] === "function"
				? hooks["content:afterPublish"]
				: hooks?.["content:afterPublish"]?.handler;
		const beforeUpload =
			typeof hooks?.["media:beforeUpload"] === "function"
				? hooks["media:beforeUpload"]
				: hooks?.["media:beforeUpload"]?.handler;
		const afterUpload =
			typeof hooks?.["media:afterUpload"] === "function"
				? hooks["media:afterUpload"]
				: hooks?.["media:afterUpload"]?.handler;

		await beforeSave!(
			{ collection: "posts", isNew: false, content: { id: "post-1", slug: "hello" } } as any,
			ctx as any,
		);
		await afterPublish!(
			{ collection: "posts", content: { id: "post-1", authorId: "user-1" } } as any,
			ctx as any,
		);
		await beforeUpload!(
			{ file: { name: "logo.png", type: "image/png", size: 1234 } } as any,
			ctx as any,
		);
		await afterUpload!(
			{ media: { id: "media-1", mimeType: "image/png" } } as any,
			ctx as any,
		);

		expect(contentSnapshots.size).toBe(1);
		expect(auditEvents.size).toBeGreaterThanOrEqual(4);
	});

	it("exports a sandbox-compatible server entry", () => {
		expect(sandboxPlugin.hooks?.["plugin:install"]).toBeTruthy();
		expect(sandboxPlugin.routes?.["public/status"]).toBeTruthy();
	});

	it("keeps the manifest aligned with the implemented plugin surface", () => {
		const manifestPath = resolve(import.meta.dirname, "../emdash-plugin.jsonc");
		const manifest = parseJsoncObject<any>(readFileSync(manifestPath, "utf8"));

		expect(manifest.slug).toBe("awcms-micro-example");
		expect(manifest.capabilities).toEqual([...AWCMS_EXAMPLE_CAPABILITIES]);
		expect(manifest.admin.pages).toHaveLength(2);
		expect(manifest.admin.widgets[0].id).toBe("governance-status");
	});
});
