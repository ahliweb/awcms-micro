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
	const catalog = await readFile(
		new URL(`../src/locales/${locale}/messages.po`, import.meta.url),
		"utf8",
	);
	return Array.from(catalog.matchAll(/^msgctxt "((?:\\.|[^"\\])*)"$/gm), (match) =>
		match[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\"),
	);
};

await test("PO catalogs cover every Cloudflare template copy key", async () => {
	const expectedKeys = flattenKeys(AWCMS_MICRO_CLOUDFLARE_PUBLIC_COPY.en).toSorted();

	for (const locale of ["en", "id"]) {
		assert.deepEqual(
			(await readContexts(locale)).toSorted(),
			expectedKeys,
			`${locale} PO catalog keys drifted`,
		);
	}
});

await test("Cloudflare public template keeps default-template parity surfaces", async () => {
	const [homepage, baseLayout, seedSource, galleryIndex, galleryDetail] = await Promise.all([
		readFile(new URL("../src/pages/index.astro", import.meta.url), "utf8"),
		readFile(new URL("../src/layouts/Base.astro", import.meta.url), "utf8"),
		readFile(new URL("../seed/seed.json", import.meta.url), "utf8"),
		readFile(new URL("../src/pages/gallery/index.astro", import.meta.url), "utf8"),
		readFile(new URL("../src/pages/gallery/[slug].astro", import.meta.url), "utf8"),
	]);
	const seed = JSON.parse(seedSource);
	const collectionSlugs = seed.collections.map((collection) => collection.slug);
	const primaryMenus = seed.menus.filter((menu) => menu.name === "primary");
	const homepageWidgetArea = seed.widgetAreas.find((area) => area.name === "homepage");

	assert.match(homepage, /getEmDashCollection\("pages"/);
	assert.match(homepage, /getEmDashCollection\("posts"/);
	assert.match(homepage, /getEmDashCollection\("news"/);
	assert.match(homepage, /getEmDashCollection\("galleries"/);
	assert.match(homepage, /<WidgetArea name="homepage"/);
	assert.match(homepage, /getWebsiteSocialConfig\(currentLocale\)/);
	assert.match(homepage, /const mediaShowcaseItems = visibleGalleries/);
	assert.match(homepage, /class="landing-media-strip"/);
	assert.match(homepage, /<details class="landing-media-detail">/);
	assert.match(homepage, /class="landing-contact-cards"/);
	assert.match(homepage, /websiteSocial\.whatsappNumber/);
	assert.match(baseLayout, /collections=\{\["posts", "pages", "news", "galleries"\]\}/);
	assert.match(galleryIndex, /getEmDashCollection\("galleries"/);
	assert.match(galleryDetail, /getEmDashCollection\("galleries"/);
	assert.ok(collectionSlugs.includes("galleries"), "Cloudflare seed must define galleries");
	assert.ok(collectionSlugs.includes("website_social"), "Cloudflare seed must define website_social");
	assert.ok(homepageWidgetArea, "Cloudflare seed must define homepage widget area");
	assert.ok(
		primaryMenus.every((menu) => menu.items.some((item) => item.url === "/gallery")),
		"Every primary menu locale must include Gallery",
	);
});
