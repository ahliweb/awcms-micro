import { describe, expect, it } from "vitest";

import { normalizeGrid, normalizeObject } from "../src/shared/utils.js";

describe("normalizeObject", () => {
	it("returns a null-prototype object and ignores polluted input", () => {
		const input = JSON.parse('{"__proto__":{"polluted":true},"title":"Hello"}');
		const result = normalizeObject(input, [{ key: "title", label: "Title" }]);

		expect(result.title).toBe("Hello");
		expect((result as Record<string, unknown>).polluted).toBeUndefined();
		expect(Object.getPrototypeOf(result)).toBeNull();
	});
});

describe("normalizeGrid", () => {
	it("returns null-prototype row objects and ignores polluted input", () => {
		const result = normalizeGrid(
			JSON.parse('{"row1":{"__proto__":{"polluted":true},"leaf":true}}'),
			[{ key: "row1", label: "Row 1" }],
			[{ key: "leaf", label: "Leaf" }],
		);

		expect(result.row1.leaf).toBe(true);
		expect((result.row1 as Record<string, unknown>).polluted).toBeUndefined();
		expect(Object.getPrototypeOf(result.row1)).toBeNull();
	});
});
