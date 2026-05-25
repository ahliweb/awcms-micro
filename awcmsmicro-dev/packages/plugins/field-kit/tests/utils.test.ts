import { describe, expect, it } from "vitest";

import { normalizeGrid, normalizeObject } from "../src/shared/utils";

describe("field-kit shared utils", () => {
	it("skips prototype-polluting keys when normalizing objects", () => {
		const value = JSON.parse('{"safe":"ok","__proto__":{"polluted":true},"constructor":{"evil":true}}');
		const result = normalizeObject(value, [{ key: "safe", label: "Safe" }]);

		expect(result).toEqual({ safe: "ok" });
		expect(({} as Record<string, unknown>).polluted).toBeUndefined();
		expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
	});

	it("skips prototype-polluting keys when normalizing grids", () => {
		const value = JSON.parse(
			'{"mon":{"am":true,"legacy":"keep-me","__proto__":{"polluted":true}},"__proto__":{"polluted":true}}',
		);
		const result = normalizeGrid(
			value,
			[{ key: "mon", label: "Mon" }],
			[{ key: "am", label: "AM" }],
		);

		expect(result).toEqual({ mon: { am: true, legacy: "keep-me" } });
		expect(({} as Record<string, unknown>).polluted).toBeUndefined();
		expect(Object.getPrototypeOf(result.mon)).toBe(Object.prototype);
	});
});
