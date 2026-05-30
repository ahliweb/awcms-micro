import { describe, expect, it } from "vitest";

import { getDocsCopy } from "../src/content.js";

describe("docs copy", () => {
	it("returns English by default", () => {
		expect(getDocsCopy(undefined).title).toContain("AWCMS-Micro");
	});

	it("returns Indonesian for id locales", () => {
		expect(getDocsCopy("id-ID").title).toContain("Dokumen");
	});

	it("includes the docs plugin boundary", () => {
		expect(getDocsCopy("en").sections[2]?.bullets.join(" ")).toContain("awcms-micro-docs");
	});
});
