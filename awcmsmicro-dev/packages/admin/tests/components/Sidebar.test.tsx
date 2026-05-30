import { describe, expect, it } from "vitest";

import { humanizePluginLabel } from "../../src/components/Sidebar";

describe("SidebarNav helpers", () => {
	it("humanizes plugin labels and resolves icons", () => {
		expect(humanizePluginLabel("awcms-micro-sikesra")).toBe("Awcms Micro Sikesra");
		expect(humanizePluginLabel("awcms-micro-sikesra", "Registry")).toBe("Registry");
	});
});
