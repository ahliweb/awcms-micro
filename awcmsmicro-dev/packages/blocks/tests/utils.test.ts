import { describe, expect, it } from "vitest";

import { isSafePreviewUrl } from "../src/utils.js";

describe("isSafePreviewUrl", () => {
	it("allows relative paths", () => {
		expect(isSafePreviewUrl("/images/photo.png")).toBe(true);
	});

	it("allows http and https URLs", () => {
		expect(isSafePreviewUrl("https://example.com/photo.png")).toBe(true);
		expect(isSafePreviewUrl("http://example.com/photo.png")).toBe(true);
	});

	it("rejects protocol-relative URLs", () => {
		expect(isSafePreviewUrl("//evil.example/photo.png")).toBe(false);
	});

	it("rejects javascript URLs", () => {
		expect(isSafePreviewUrl("javascript:alert(1)")).toBe(false);
	});
});
