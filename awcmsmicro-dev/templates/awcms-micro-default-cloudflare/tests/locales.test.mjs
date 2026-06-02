import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import { AWCMS_MICRO_CLOUDFLARE_PUBLIC_COPY } from "../src/locales/messages.ts";

const flattenKeys = (value, prefix = "") =>
	Object.entries(value).flatMap(([key, entry]) => {
		const next = prefix ? `${prefix}.${key}` : key;
		return typeof entry === "object" && entry !== null ? flattenKeys(entry, next) : [next];
	});

const readContexts = async (locale) => {
	const catalog = await readFile(new URL(`../src/locales/${locale}/messages.po`, import.meta.url), "utf8");
	return [...catalog.matchAll(/^msgctxt "((?:\\.|[^"\\])*)"$/gm)].map((match) =>
		match[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\"),
	);
};

test("PO catalogs cover every Cloudflare template copy key", async () => {
	const expectedKeys = flattenKeys(AWCMS_MICRO_CLOUDFLARE_PUBLIC_COPY.en).toSorted();

	for (const locale of ["en", "id"]) {
		assert.deepEqual((await readContexts(locale)).toSorted(), expectedKeys, `${locale} PO catalog keys drifted`);
	}
});
