import { describe, expect, it } from "vitest";

import { awcmsMicroExamplePlugin } from "../src/index.js";
import { createAuditRecord } from "../src/audit.js";
import { AWCMS_EXAMPLE_PERMISSION_LIST } from "../src/permissions.js";

describe("awcms micro example plugin", () => {
	it("builds a descriptor without touching EmDash core", () => {
		const descriptor = awcmsMicroExamplePlugin();

		expect(descriptor.id).toBe("awcms-micro-example");
		expect(descriptor.adminEntry).toBe("@awcms-micro/plugin-example/admin");
	});

	it("exposes the expected permission namespace", () => {
		expect(AWCMS_EXAMPLE_PERMISSION_LIST).toContain("awcms:example:dashboard:read");
		expect(AWCMS_EXAMPLE_PERMISSION_LIST).toContain("awcms:example:audit:read");
	});

	it("creates tenant-ready audit records", () => {
		const record = createAuditRecord({ action: "settings.update", resource: "settings" });

		expect(record.action).toBe("settings.update");
		expect(record.resource).toBe("settings");
		expect(record.actor).toBe("system");
	});
});
