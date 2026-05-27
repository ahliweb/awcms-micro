import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it, vi } from "vitest";

import { awcmsMicroExamplePlugin } from "../src/index.js";
import {
	AWCMS_EXAMPLE_DASHBOARD_MODULE_CARDS,
	AWCMS_EXAMPLE_PLUGIN_HEADER_MENU,
	filterPluginHeaderMenu,
} from "../src/admin.js";
import sandboxPlugin from "../src/sandbox.js";
import { AWCMS_EXAMPLE_PERMISSION_LIST } from "../src/permissions.js";
import { SIKESRA_REFERENCE_FIXTURES, maskSensitive } from "../src/fixtures.js";
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
	let output = "";
	let index = 0;
	let inString = false;
	let escaped = false;
	let quote = "";

	while (index < source.length) {
		const char = source[index];
		const next = source[index + 1];

		if (inString) {
			output += char;
			if (escaped) {
				escaped = false;
			} else if (char === "\\") {
				escaped = true;
			} else if (char === quote) {
				inString = false;
				quote = "";
			}
			index += 1;
			continue;
		}

		if (char === '"' || char === "'") {
			inString = true;
			quote = char;
			output += char;
			index += 1;
			continue;
		}

		if (char === "/" && next === "/") {
			index += 2;
			while (index < source.length && source[index] !== "\n") {
				index += 1;
			}
			continue;
		}

		if (char === "/" && next === "*") {
			index += 2;
			while (index < source.length && !(source[index] === "*" && source[index + 1] === "/")) {
				index += 1;
			}
			index += 2;
			continue;
		}

		output += char;
		index += 1;
	}

	return JSON.parse(output.replace(/,\s*([}\]])/g, "$1")) as T;
}

function createMockContext() {
	const kvData = new Map<string, unknown>();
	const collections = {
		auditEvents: new Map<string, unknown>(),
		accessChangeEvents: new Map<string, unknown>(),
		abacChangeEvents: new Map<string, unknown>(),
		abacAttributeCatalog: new Map<string, unknown>(),
		abacPolicyRules: new Map<string, unknown>(),
		abacResourceAssignments: new Map<string, unknown>(),
		abacSubjectAssignments: new Map<string, unknown>(),
		contentSnapshots: new Map<string, unknown>(),
		permissionCatalog: new Map<string, unknown>(),
		roleCatalog: new Map<string, unknown>(),
		rolePermissionAssignments: new Map<string, unknown>(),
		userRoleAssignments: new Map<string, unknown>(),
	};
	const cron = {
		schedule: vi.fn(async () => {}),
		cancel: vi.fn(async () => {}),
	};

	const createCollection = (store: Map<string, unknown>) => ({
		put: vi.fn(async (id: string, value: unknown) => {
			store.set(id, value);
		}),
		get: vi.fn(async (id: string) => (store.has(id) ? store.get(id) : null)),
		delete: vi.fn(async (id: string) => store.delete(id)),
		count: vi.fn(async () => store.size),
		query: vi.fn(async () => ({
			items: Array.from(store.entries(), ([id, data]) => ({ id, data })),
			cursor: undefined,
			hasMore: false,
		})),
	});

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
				auditEvents: createCollection(collections.auditEvents),
				accessChangeEvents: createCollection(collections.accessChangeEvents),
				abacChangeEvents: createCollection(collections.abacChangeEvents),
				abacAttributeCatalog: createCollection(collections.abacAttributeCatalog),
				abacPolicyRules: createCollection(collections.abacPolicyRules),
				abacResourceAssignments: createCollection(collections.abacResourceAssignments),
				abacSubjectAssignments: createCollection(collections.abacSubjectAssignments),
				contentSnapshots: createCollection(collections.contentSnapshots),
				permissionCatalog: createCollection(collections.permissionCatalog),
				roleCatalog: createCollection(collections.roleCatalog),
				rolePermissionAssignments: createCollection(collections.rolePermissionAssignments),
				userRoleAssignments: createCollection(collections.userRoleAssignments),
			},
		},
		collections,
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
		expect(AWCMS_EXAMPLE_PERMISSION_LIST).toContain("awcms:example:permissions:write");
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
		expect(AWCMS_EXAMPLE_ADMIN_PAGES).toHaveLength(13);
		expect(AWCMS_EXAMPLE_ADMIN_WIDGETS[0]?.id).toBe("governance-status");
		expect(AWCMS_EXAMPLE_ADMIN_WIDGETS[1]?.id).toBe("access-rights-health");
		expect(AWCMS_EXAMPLE_ADMIN_WIDGETS[2]?.id).toBe("abac-policy-status");
		expect(AWCMS_EXAMPLE_PORTABLE_TEXT_BLOCKS[0]?.type).toBe("awcms-access-note");
		expect(AWCMS_EXAMPLE_FIELD_WIDGETS[0]?.name).toBe("status-badge");
			expect(AWCMS_EXAMPLE_ADMIN_PAGES.map((page) => page.path)).toEqual([
				"/overview",
				"/registry",
				"/documents",
				"/verification",
				"/audit",
				"/reports",
				"/access/permissions",
				"/access/roles",
				"/access/matrix",
			"/access/preview",
			"/abac/attributes",
			"/abac/policies",
			"/abac/preview",
		]);
	});

	it("declares dashboard module cards and a filtered header menu model", () => {
		expect(AWCMS_EXAMPLE_DASHBOARD_MODULE_CARDS).toHaveLength(8);
		expect(AWCMS_EXAMPLE_DASHBOARD_MODULE_CARDS[0]?.href).toBe("/registry");
		expect(AWCMS_EXAMPLE_PLUGIN_HEADER_MENU.map((item) => item.label)).toEqual([
			"Overview",
			"Data Entry",
			"Verification",
			"Reports",
			"Settings",
		]);

		const filtered = filterPluginHeaderMenu(
			[
				{
					id: "parent",
					label: "Parent",
					href: "/parent",
					permission: undefined,
					children: [
						{ id: "read-child", label: "Read child", href: "/parent/read", permission: "awcms:example:parent:read" },
						{ id: "write-child", label: "Write child", href: "/parent/write", permission: "awcms:example:parent:write" },
					],
				},
				{
					id: "blocked",
					label: "Blocked",
					href: "/blocked",
					permission: "awcms:example:blocked:write",
					children: [{ id: "blocked-child", label: "Blocked child", href: "/blocked/child", permission: "awcms:example:blocked:write" }],
				},
			] as any,
			(permission) => !permission || permission === "awcms:example:parent:read",
		);

		expect(filtered).toHaveLength(1);
		expect(filtered[0]?.children).toHaveLength(1);
		expect(filtered[0]?.children?.[0]?.label).toBe("Read child");
	});

	it("ships deterministic SIKESRA reference fixtures", () => {
		expect(SIKESRA_REFERENCE_FIXTURES.registryEntities).toHaveLength(3);
		expect(SIKESRA_REFERENCE_FIXTURES.supportingDocuments).toHaveLength(4);
		expect(SIKESRA_REFERENCE_FIXTURES.verificationEvents).toHaveLength(3);
		expect(SIKESRA_REFERENCE_FIXTURES.publicAggregate.caveat).toContain("coarse counts");
		expect(SIKESRA_REFERENCE_FIXTURES.registryEntities[0]?.verificationStage).toBe("active_verified");
		expect(SIKESRA_REFERENCE_FIXTURES.registryEntities[2]?.sensitivity).toBe("highly_restricted");
		expect(SIKESRA_REFERENCE_FIXTURES.publicAggregate.categories.some((item) => item.suppressed)).toBe(true);
		expect(SIKESRA_REFERENCE_FIXTURES.abacPolicies[0]?.effect).toBe("deny");
	});

	it("masks sensitive values when access is denied", () => {
		expect(maskSensitive("0912345678", true)).toBe("0912345678");
		expect(maskSensitive("0912345678", false)).toBe("••••••");
		expect(maskSensitive(undefined, false)).toBeNull();
	});

	it("exposes public and protected routes", async () => {
		const { ctx, kvData, collections } = createMockContext();
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
		expect(Object.keys(publicResult).toSorted()).toEqual(["auditCount", "governanceMode", "lastLifecycle", "plugin", "status"]);
		expect(publicResult.status).toBe("green");
		expect(publicResult.plugin.visibility).toBe("public-safe");
		expect(publicResult).not.toHaveProperty("storageKey");
		expect(publicResult).not.toHaveProperty("userId");
		expect(kvData.get("settings:governanceMode")).toBe("observe");
		expect(collections.auditEvents.size).toBeGreaterThan(0);
	});

	it("advances one verification stage and persists the new state", async () => {
		const { ctx, collections } = createMockContext();
		const routes = createNativeRoutes();

		const before = (await routes["verification/list"]!.handler({ ...ctx, input: {} } as any)) as any;
		expect(before.items.find((item: any) => item.registryEntityId === "registry-entity-guru-agama-01")?.verificationStage).toBe("verified_district");

		const result = (await routes["verification/advance"]!.handler(
			{
				...ctx,
				input: {
					registryEntityId: "registry-entity-guru-agama-01",
					actor: "district-officer",
					notes: "Promoted from district review",
				},
			} as any,
		)) as any;

		expect(result.success).toBe(true);
		expect(result.item.verificationStage).toBe("submitted_regency");
		expect(result.item.nextStage).toBe("active_verified");
		expect(result.event.kind).toBe("verification.stage.advance");

		const after = (await routes["verification/list"]!.handler({ ...ctx, input: {} } as any)) as any;
		expect(after.items.find((item: any) => item.registryEntityId === "registry-entity-guru-agama-01")?.verificationStage).toBe("submitted_regency");
		expect(collections.auditEvents.size).toBeGreaterThan(0);
	});

	it("records lifecycle and cron behavior", async () => {
		const { ctx, cron, kvData, collections } = createMockContext();
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
		expect(collections.auditEvents.size).toBeGreaterThan(1);
		expect(collections.permissionCatalog.size).toBeGreaterThan(0);
	});

	it("records content and media hooks", async () => {
		const { ctx, collections } = createMockContext();
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

		expect(collections.contentSnapshots.size).toBe(1);
		expect(collections.auditEvents.size).toBeGreaterThanOrEqual(4);
	});

	it("supports access-rights catalog create, list, matrix, and preview flows", async () => {
		const { ctx, collections } = createMockContext();
		const routes = createNativeRoutes();

		const permissionsBefore = (await routes["access/permissions/list"]!.handler({ ...ctx, input: {} } as any)) as any;
		expect(permissionsBefore.items.length).toBeGreaterThan(0);

		await routes["access/permissions/save"]!.handler(
			{
				...ctx,
				input: {
					slug: "documents.review",
					label: "Review Documents",
					description: "Allows reviewing governed documents.",
					scope: "documents",
				},
			} as any,
		);

		await routes["access/roles/save"]!.handler(
			{
				...ctx,
				input: {
					slug: "document-reviewer",
					label: "Document Reviewer",
					description: "Reviews controlled documents.",
				},
			} as any,
		);

		await routes["access/matrix/save"]!.handler(
			{
				...ctx,
				input: {
					roleSlug: "document-reviewer",
					permissions: ["documents.review", "audit.read.events"],
				},
			} as any,
		);

		await routes["access/users/save"]!.handler(
			{
				...ctx,
				input: {
					userId: "user-demo-doc-reviewer",
					roles: ["document-reviewer"],
				},
			} as any,
		);

		const preview = (await routes["access/preview"]!.handler(
			{
				...ctx,
				input: { userId: "user-demo-doc-reviewer", permissionSlug: "documents.review" },
			} as any,
		)) as any;

		expect(preview.allowed).toBe(true);
		expect(preview.matchedRoles).toContain("document-reviewer");
		expect(collections.accessChangeEvents.size).toBeGreaterThanOrEqual(4);
	});

	it("returns a deterministic denied access preview when roles do not grant the permission", async () => {
		const { ctx } = createMockContext();
		const routes = createNativeRoutes();

		const preview = (await routes["access/preview"]!.handler(
			{ ...ctx, input: { userId: "user-demo-editor", permissionSlug: "content.review.publish" } } as any,
		)) as any;

		expect(preview.allowed).toBe(false);
		expect(preview.reason).toContain("not granted");
	});

	it("supports ABAC attribute, policy, preview, and sensitive-action audit flows", async () => {
		const { ctx, collections } = createMockContext();
		const routes = createNativeRoutes();

		const attributes = (await routes["abac/attributes/list"]!.handler({ ...ctx, input: {} } as any)) as any;
		expect(attributes.items.length).toBeGreaterThan(0);

		await routes["abac/attributes/save"]!.handler(
			{
				...ctx,
				input: {
					key: "action",
					label: "Action",
					targetType: "context",
					description: "Action under review",
				},
			} as any,
		);

		await routes["abac/policies/save"]!.handler(
			{
				...ctx,
				input: {
					id: "allow-published-read-jakarta",
					label: "Allow published read in Jakarta",
					effect: "allow",
					actions: ["content.read"],
					requiredSubject: { tenant_id: "tenant-a" },
					requiredResource: { resource_status: "published", resource_sensitivity: "public" },
					requiredContext: { region_scope: "id-jakarta" },
				},
			} as any,
		);

		const allow = (await routes["abac/preview"]!.handler(
			{
				...ctx,
				input: {
					subjectId: "user-demo-editor",
					resourceId: "resource-public-post",
					action: "content.read",
					contextAttributes: { region_scope: "id-jakarta" },
				},
			} as any,
		)) as any;

		expect(allow.allowed).toBe(true);
		expect(allow.effect).toBe("allow");

		const deny = (await routes["abac/preview"]!.handler(
			{
				...ctx,
				input: {
					subjectId: "user-demo-reviewer",
					resourceId: "resource-sensitive-policy",
					action: "content.publish_sensitive",
					contextAttributes: {},
				},
			} as any,
		)) as any;

		expect(deny.allowed).toBe(false);
		expect(deny.reason).toContain("Explicit deny");

		const missing = (await routes["abac/preview"]!.handler(
			{
				...ctx,
				input: {
					subjectId: "user-demo-editor",
					resourceId: "resource-public-post",
					action: "content.read",
					contextAttributes: {},
				},
			} as any,
		)) as any;

		expect(missing.allowed).toBe(false);
		expect(missing.reason).toContain("Missing required attributes");

		const regionMismatch = (await routes["abac/preview"]!.handler(
			{
				...ctx,
				input: {
					subjectId: "user-demo-editor",
					resourceId: "resource-public-post",
					action: "content.read",
					contextAttributes: { region_scope: "id-bandung" },
				},
			} as any,
		)) as any;

		expect(regionMismatch.allowed).toBe(false);
		expect(regionMismatch.reason).toBe("No matching allow policy for action content.read");

		await routes["abac/enforce-demo"]!.handler(
			{
				...ctx,
				input: {
					subjectId: "user-demo-reviewer",
					resourceId: "resource-sensitive-policy",
					action: "content.publish_sensitive",
					contextAttributes: { action: "content.publish_sensitive" },
				},
			} as any,
		);

		expect(collections.abacChangeEvents.size).toBeGreaterThanOrEqual(3);
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
		expect(manifest.admin.pages).toHaveLength(13);
		expect(manifest.admin.widgets[0].id).toBe("governance-status");
		expect(manifest.admin.widgets[1].id).toBe("access-rights-health");
		expect(manifest.admin.widgets[2].id).toBe("abac-policy-status");
		expect(Object.keys(manifest.storage).toSorted()).toEqual([
			"abacAttributeCatalog",
			"abacChangeEvents",
			"abacPolicyRules",
			"abacResourceAssignments",
			"abacSubjectAssignments",
			"accessChangeEvents",
			"auditEvents",
			"contentSnapshots",
			"permissionCatalog",
			"roleCatalog",
			"rolePermissionAssignments",
			"userRoleAssignments",
		]);
	});
});
