import { vi, describe, it, expect } from "vitest";

vi.mock("@cloudflare/kumo", () => {
	return {
		LinkButton: () => null,
	};
});

import {
	AwcmsModuleManifestSchema,
	normalizeAdminNav,
	adaptToEmdashPages,
	resolveLabel
} from "../src/index.js";

describe("AWCMS-Micro Admin Navigation and i18n", () => {
	describe("1. Manifest Schema Validation", () => {
		it("should validate a valid manifest", () => {
			const valid = {
				id: "plugin-test",
				name: "Test Plugin",
				version: "1.0.0",
				navigation: {
					groups: [
						{
							id: "group-1",
							labelKey: "nav.group1",
							fallbackLabel: "Group 1",
							sidebarPlacement: "after-dashboard",
							items: [
								{
									id: "item-1",
									labelKey: "nav.item1",
									fallbackLabel: "Item 1",
									path: "/subpath",
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
							"nav.group1": "Group One",
						}
					}
				}
			};
			const parsed = AwcmsModuleManifestSchema.parse(valid);
			expect(parsed.id).toBe("plugin-test");
			expect(parsed.navigation!.groups![0]!.sidebarPlacement).toBe("after-dashboard");
		});

		it("should fail on invalid manifest", () => {
			const invalid = {
				id: 123, // should be string
				name: "Test Plugin"
			};
			expect(() => AwcmsModuleManifestSchema.parse(invalid)).toThrow();
		});
	});

	describe("2. Navigation Sorting & 3. Nested Child Handling", () => {
		it("should sort groups and items by priority and order", () => {
			const manifests = [
				{
					id: "plugin-a",
					name: "Plugin A",
					navigation: {
						groups: [
							{
								id: "group-high-priority",
								labelKey: "nav.high",
								fallbackLabel: "High Priority",
								sidebarPriority: 10,
								sortOrder: 1,
								items: [
									{
										id: "item-b",
										labelKey: "nav.item.b",
										fallbackLabel: "Item B",
										path: "/b",
										sortOrder: 2,
									},
									{
										id: "item-a",
										labelKey: "nav.item.a",
										fallbackLabel: "Item A",
										path: "/a",
										sortOrder: 1,
										children: [
											{
												id: "child-2",
												labelKey: "nav.child2",
												fallbackLabel: "Child 2",
												path: "/child2",
												sortOrder: 2,
											},
											{
												id: "child-1",
												labelKey: "nav.child1",
												fallbackLabel: "Child 1",
												path: "/child1",
												sortOrder: 1,
											}
										]
									}
								]
							},
							{
								id: "group-low-priority",
								labelKey: "nav.low",
								fallbackLabel: "Low Priority",
								sidebarPriority: 100,
								sortOrder: 1,
								items: [
									{
										id: "item-c",
										labelKey: "nav.item.c",
										fallbackLabel: "Item C",
										path: "/c",
									}
								]
							}
						]
					}
				}
			];

			const result = normalizeAdminNav(manifests as any);

			expect(result.length).toBe(2);
			// group-high-priority has priority 10 < priority 100, so it comes first
			expect(result[0]!.id).toBe("group-high-priority");
			expect(result[1]!.id).toBe("group-low-priority");

			// check items sorted
			const firstGroupItems = result[0]!.items;
			expect(firstGroupItems.length).toBe(2);
			expect(firstGroupItems[0]!.id).toBe("item-a");
			expect(firstGroupItems[1]!.id).toBe("item-b");

			// check nested children sorted
			const children = firstGroupItems[0]!.children;
			expect(children).toBeDefined();
			expect(children!.length).toBe(2);
			expect(children![0]!.id).toBe("child-1");
			expect(children![1]!.id).toBe("child-2");
		});
	});

	describe("4. Permission Filtering", () => {
		it("should filter out items/children if permission checks fail", () => {
			const manifests = [
				{
					id: "plugin-p",
					name: "Plugin P",
					navigation: {
						groups: [
							{
								id: "group-p",
								labelKey: "nav.p",
								fallbackLabel: "Group P",
								items: [
									{
										id: "item-allowed",
										labelKey: "nav.allowed",
										fallbackLabel: "Allowed",
										path: "/allowed",
									},
									{
										id: "item-denied",
										labelKey: "nav.denied",
										fallbackLabel: "Denied",
										path: "/denied",
										permission: "admin:only",
									}
								]
							}
						]
					}
				}
			];

			const permissions = new Set(["some-other-permission"]);
			const result = normalizeAdminNav(manifests as any, {
				hasPermission: (p) => permissions.has(p),
			});

			expect(result.length).toBe(1);
			expect(result[0]!.items.length).toBe(1);
			expect(result[0]!.items[0]!.id).toBe("item-allowed");
		});
	});

	describe("5. Duplicate ID Detection", () => {
		it("should throw error if group IDs are duplicated", () => {
			const manifests = [
				{
					id: "p1",
					name: "Plugin 1",
					navigation: {
						groups: [
							{
								id: "dup-group",
								labelKey: "nav.g",
								fallbackLabel: "G",
								items: []
							}
						]
					}
				},
				{
					id: "p2",
					name: "Plugin 2",
					navigation: {
						groups: [
							{
								id: "dup-group",
								labelKey: "nav.g",
								fallbackLabel: "G",
								items: []
							}
						]
					}
				}
			];
			expect(() => normalizeAdminNav(manifests as any)).toThrow("Duplicate group ID detected");
		});

		it("should throw error if item IDs are duplicated", () => {
			const manifests = [
				{
					id: "p1",
					name: "Plugin 1",
					navigation: {
						groups: [
							{
								id: "g1",
								labelKey: "nav.g",
								fallbackLabel: "G",
								items: [
									{
										id: "dup-item",
										labelKey: "nav.i",
										fallbackLabel: "I",
										path: "/i1",
									},
									{
										id: "dup-item",
										labelKey: "nav.i",
										fallbackLabel: "I",
										path: "/i2",
									}
								]
							}
						]
					}
				}
			];
			expect(() => normalizeAdminNav(manifests as any)).toThrow("Duplicate item ID detected");
		});
	});

	describe("6. Unsafe Path Rejection", () => {
		it("should throw error on external URLs", () => {
			const manifests = [
				{
					id: "p1",
					name: "P1",
					navigation: {
						groups: [
							{
								id: "g1",
								labelKey: "g",
								fallbackLabel: "G",
								items: [
									{
										id: "item-external",
										labelKey: "ext",
										fallbackLabel: "Ext",
										path: "https://google.com",
									}
								]
							}
						]
					}
				}
			];
			expect(() => normalizeAdminNav(manifests as any)).toThrow("Unsafe path: external URLs are not allowed");
		});

		it("should throw error on path traversal", () => {
			const manifests = [
				{
					id: "p1",
					name: "P1",
					navigation: {
						groups: [
							{
								id: "g1",
								labelKey: "g",
								fallbackLabel: "G",
								items: [
									{
										id: "item-traversal",
										labelKey: "trav",
										fallbackLabel: "Trav",
										path: "/something/../admin",
									}
								]
							}
						]
					}
				}
			];
			expect(() => normalizeAdminNav(manifests as any)).toThrow("Unsafe path: path traversal is not allowed");
		});

		it("should throw error on escaping plugin namespace", () => {
			const manifests = [
				{
					id: "my-plugin",
					name: "My Plugin",
					navigation: {
						groups: [
							{
								id: "g1",
								labelKey: "g",
								fallbackLabel: "G",
								items: [
									{
										id: "item-escape",
										labelKey: "esc",
										fallbackLabel: "Esc",
										path: "/plugins/other-plugin/admin",
									}
								]
							}
						]
					}
				}
			];
			expect(() => normalizeAdminNav(manifests as any)).toThrow("Unsafe path: escaping plugin namespace not allowed");
		});
	});

	describe("7. i18n Label Fallback Order", () => {
		const messages = {
			en: {
				"test.label": "English Label",
			},
			id: {
				"test.label": "Indonesian Label",
			}
		};

		it("should resolve requested locale first", () => {
			const label = resolveLabel("test.label", "Fallback", messages, "id");
			expect(label).toBe("Indonesian Label");
		});

		it("should fallback to default locale if requested is missing", () => {
			const label = resolveLabel("test.label", "Fallback", messages, "fr", "en");
			expect(label).toBe("English Label");
		});

		it("should fallback to fallbackLabel if default is also missing", () => {
			const label = resolveLabel("missing.label", "Fallback", messages, "fr", "en");
			expect(label).toBe("Fallback");
		});

		it("should fallback to labelKey if fallbackLabel is missing", () => {
			const label = resolveLabel("missing.label", "", messages, "fr", "en");
			expect(label).toBe("missing.label");
		});
	});

	describe("8. EmDash Adapter Flattening", () => {
		it("should flatten nested manifest groups and items to admin page array", () => {
			const manifest = {
				id: "my-plugin",
				name: "My Plugin",
				navigation: {
					groups: [
						{
							id: "group-1",
							labelKey: "g1",
							fallbackLabel: "Group 1",
							items: [
								{
									id: "item-1",
									labelKey: "i1",
									fallbackLabel: "Item 1",
									path: "/item1",
									icon: "icon1",
									children: [
										{
											id: "child-1",
											labelKey: "c1",
											fallbackLabel: "Child 1",
											path: "/child1",
										}
									]
								}
							]
						}
					]
				}
			};

			const pages = adaptToEmdashPages(manifest as any);
			expect(pages).toEqual([
				{ path: "/item1", label: "Item 1", icon: "icon1" },
				{ path: "/child1", label: "Child 1", icon: undefined }
			]);
		});
	});
});
