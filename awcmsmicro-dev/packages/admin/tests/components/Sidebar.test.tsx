import { describe, expect, it } from "vitest";

import {
	buildSidebarPluginGroups,
	humanizePluginLabel,
	resolveSidebarIcon,
} from "../../src/components/Sidebar";

describe("SidebarNav helpers", () => {
	it("humanizes plugin labels and resolves icons", () => {
		expect(humanizePluginLabel("awcms-micro-sikesra")).toBe("Awcms Micro Sikesra");
		expect(humanizePluginLabel("awcms-micro-sikesra", "Registry")).toBe("Registry");
		expect(resolveSidebarIcon("shield")).toBeDefined();
		expect(resolveSidebarIcon("code")).toBeDefined();
		expect(resolveSidebarIcon("unknown-icon")).toBeDefined();
	});

	it("sorts plugin groups alphabetically and keeps page icons contextual", () => {
		const groups = buildSidebarPluginGroups(
			{
				collections: {},
				plugins: {
					"zeta-plugin": {
						name: "Zeta Plugin",
						enabled: true,
						adminMode: "blocks",
						adminPages: [{ path: "/settings", label: "Settings", icon: "gear" }],
					},
					"alpha-plugin": {
						name: "Alpha Plugin",
						enabled: true,
						adminMode: "blocks",
						adminPages: [{ path: "/overview", label: "Overview", icon: "chart" }],
					},
				},
				taxonomies: [],
			},
			{},
		);

		expect(groups.map((group) => group.label)).toEqual(["Alpha Plugin", "Zeta Plugin"]);
		expect(groups[0]?.items[0]?.label).toBe("Overview");
		expect(groups[1]?.items[0]?.label).toBe("Settings");
		expect(groups[0]?.items[0]?.icon).toBe(resolveSidebarIcon("chart"));
		expect(groups[1]?.items[0]?.icon).toBe(resolveSidebarIcon("gear"));
	});
});
