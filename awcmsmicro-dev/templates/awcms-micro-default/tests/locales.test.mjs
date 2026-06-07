import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import { AWCMS_MICRO_DEFAULT_PUBLIC_COPY } from "../src/locales/messages.ts";

const flattenKeys = (value, prefix = "") =>
	Object.entries(value).flatMap(([key, entry]) => {
		const next = prefix ? `${prefix}.${key}` : key;
		return typeof entry === "object" && entry !== null ? flattenKeys(entry, next) : [next];
	});

const readContexts = async (locale) => {
	const catalog = await readFile(
		new URL(`../src/locales/${locale}/messages.po`, import.meta.url),
		"utf8",
	);
	return Array.from(catalog.matchAll(/^msgctxt "((?:\\.|[^"\\])*)"$/gm), (match) =>
		match[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\"),
	);
};

const MEDIA_SHOWCASE_REGEX = /const mediaShowcaseItems = visibleGalleries/;
const MEDIA_STRIP_REGEX = /class="landing-media-strip"/;
const MEDIA_DETAIL_REGEX = /<details class="landing-media-detail">/;
const CONTACT_CARDS_REGEX = /class="landing-contact-cards"/;
const WHATSAPP_NUMBER_REGEX = /websiteSocial\.whatsappNumber/;

await test("PO catalogs cover every default template copy key", async () => {
	const expectedKeys = flattenKeys(AWCMS_MICRO_DEFAULT_PUBLIC_COPY.en).toSorted();

	for (const locale of ["en", "id"]) {
		assert.deepEqual(
			(await readContexts(locale)).toSorted(),
			expectedKeys,
			`${locale} PO catalog keys drifted`,
		);
	}
});

await test("default public template keeps interactive media and contact sections", async () => {
	const homepage = await readFile(new URL("../src/pages/index.astro", import.meta.url), "utf8");

	assert.match(homepage, MEDIA_SHOWCASE_REGEX);
	assert.match(homepage, MEDIA_STRIP_REGEX);
	assert.match(homepage, MEDIA_DETAIL_REGEX);
	assert.match(homepage, CONTACT_CARDS_REGEX);
	assert.match(homepage, WHATSAPP_NUMBER_REGEX);
});
