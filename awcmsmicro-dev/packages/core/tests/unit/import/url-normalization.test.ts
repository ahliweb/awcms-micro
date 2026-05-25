import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../src/import/ssrf.js", () => ({
	resolveAndValidateExternalUrl: vi.fn(async () => {}),
	validateExternalUrl: vi.fn(),
	ssrfSafeFetch: vi.fn(),
}));

import { clearSources, probeUrl, registerSource } from "../../../src/import/registry.js";
import { normalizeUrl } from "../../../src/import/sources/wordpress-rest.js";

beforeEach(() => {
	clearSources();
});

describe("import url normalization", () => {
	it("trims trailing slashes before probing sources", async () => {
		const seen: string[] = [];
		registerSource({
			id: "test",
			name: "Test Source",
			requiresFile: false,
			canProbe: true,
			async probe(url) {
				seen.push(url);
				return {
					sourceId: "test",
					confidence: "possible",
					detected: { platform: "wordpress" },
					capabilities: {
						publicContent: true,
						privateContent: false,
						customPostTypes: false,
						allMeta: false,
						mediaStream: false,
					},
					suggestedAction: { type: "proceed" },
				};
			},
		});

		const result = await probeUrl("example.com////");

		expect(seen).toEqual(["https://example.com"]);
		expect(result.url).toBe("https://example.com");
	});

	it("normalizes WordPress REST URLs without regex", () => {
		expect(normalizeUrl("example.com/wp-json///")).toBe("https://example.com");
		expect(normalizeUrl("https://example.com/blog/wp-json/")).toBe("https://example.com/blog");
	});
});
