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

const PAGES_COLLECTION_REGEX = /getEmDashCollection\("pages"/;
const POSTS_COLLECTION_REGEX = /getEmDashCollection\("posts"/;
const NEWS_COLLECTION_REGEX = /getEmDashCollection\("news"/;
const GALLERIES_COLLECTION_REGEX = /getEmDashCollection\("galleries"/;
const HOMEPAGE_WIDGET_REGEX = /<WidgetArea name="homepage"/;
const WEBSITE_SOCIAL_REGEX = /getWebsiteSocialConfig\(currentLocale\)/;
const MEDIA_SHOWCASE_REGEX = /const mediaShowcaseItems = visibleGalleries/;
const MEDIA_STRIP_REGEX = /class="landing-media-strip"/;
const MEDIA_DETAIL_REGEX = /<details class="landing-media-detail">/;
const CONTACT_CARDS_REGEX = /class="landing-contact-cards"/;
const WHATSAPP_NUMBER_REGEX = /websiteSocial\.whatsappNumber/;
const BASE_LAYOUT_COLLECTIONS_REGEX = /collections=\{\["posts", "pages", "news", "galleries"\]\}/;
const SIKESRA_TENANT_ENV_REGEX = /AWCMS_MICRO_SIKESRA_TENANT_ID/;
const SIKESRA_SITE_ENV_REGEX = /AWCMS_MICRO_SIKESRA_SITE_ID/;
const STORAGE_PUBLIC_BASE_ENV_REGEX = /AWCMS_MICRO_STORAGE_PUBLIC_BASE_URL/;
const DEPLOY_SCRIPT_REGEX = /pnpm validate:cloudflare-env && astro build && wrangler deploy/;

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

	assert.match(homepage, PAGES_COLLECTION_REGEX);
	assert.match(homepage, POSTS_COLLECTION_REGEX);
	assert.match(homepage, NEWS_COLLECTION_REGEX);
	assert.match(homepage, GALLERIES_COLLECTION_REGEX);
	assert.match(homepage, HOMEPAGE_WIDGET_REGEX);
	assert.match(homepage, WEBSITE_SOCIAL_REGEX);
	assert.match(homepage, MEDIA_SHOWCASE_REGEX);
	assert.match(homepage, MEDIA_STRIP_REGEX);
	assert.match(homepage, MEDIA_DETAIL_REGEX);
	assert.match(homepage, CONTACT_CARDS_REGEX);
	assert.match(homepage, WHATSAPP_NUMBER_REGEX);
	assert.match(baseLayout, BASE_LAYOUT_COLLECTIONS_REGEX);
	assert.match(galleryIndex, GALLERIES_COLLECTION_REGEX);
	assert.match(galleryDetail, GALLERIES_COLLECTION_REGEX);
	const collectionSlugSet = new Set(collectionSlugs);
	assert.ok(collectionSlugSet.has("galleries"), "Cloudflare seed must define galleries");
	assert.ok(collectionSlugSet.has("website_social"), "Cloudflare seed must define website_social");
	assert.ok(homepageWidgetArea, "Cloudflare seed must define homepage widget area");
	assert.ok(
		primaryMenus.every((menu) => menu.items.some((item) => item.url === "/gallery")),
		"Every primary menu locale must include Gallery",
	);
});

await test("Cloudflare deployment config declares SIKESRA scope and storage URL vars", async () => {
	const [astroConfig, wranglerConfig, envExample, devVarsExample, validationScript, packageJson] =
		await Promise.all([
			readFile(new URL("../astro.config.mjs", import.meta.url), "utf8"),
			readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"),
			readFile(new URL("../.env.example", import.meta.url), "utf8"),
			readFile(new URL("../.dev.vars.example", import.meta.url), "utf8"),
			readFile(new URL("../scripts/validate-cloudflare-env.sh", import.meta.url), "utf8"),
			readFile(new URL("../package.json", import.meta.url), "utf8"),
		]);

	for (const source of [astroConfig, wranglerConfig, envExample, devVarsExample, validationScript]) {
		assert.match(source, SIKESRA_TENANT_ENV_REGEX);
		assert.match(source, SIKESRA_SITE_ENV_REGEX);
	}

	for (const source of [wranglerConfig, envExample, devVarsExample, validationScript]) {
		assert.match(source, STORAGE_PUBLIC_BASE_ENV_REGEX);
	}

	assert.match(await readFile(new URL("../src/pages/index.astro", import.meta.url), "utf8"), STORAGE_PUBLIC_BASE_ENV_REGEX);
	assert.match(packageJson, DEPLOY_SCRIPT_REGEX);
});
