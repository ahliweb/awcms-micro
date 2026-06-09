import node from "@astrojs/node";
import react from "@astrojs/react";
import { awcmsMicroDocsPlugin } from "@awcms-micro/plugin-docs";
import { awcmsEmailMailketingPlugin } from "@awcms-micro/plugin-email-mailketing";
import { awcmsMicroGalleryPlugin } from "@awcms-micro/plugin-gallery";
import { awcmsMicroSikesraPlugin } from "@awcms-micro/plugin-sikesra";
import { awcmsMicroWebsiteSocialPlugin } from "@awcms-micro/plugin-website-social";
import { defineConfig } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

export default defineConfig({
	output: "server",
	adapter: node({ mode: "standalone" }),
	prefetch: {
		prefetchAll: false,
		defaultStrategy: "hover",
	},
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	i18n: {
		defaultLocale: "en",
		locales: ["en", "id"],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	integrations: [
		react(),
		emdash({
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
			siteUrl: "https://example.awcms-micro.local",
			plugins: [
				awcmsMicroDocsPlugin(),
				awcmsEmailMailketingPlugin({ tenantId: "t-local-dev", siteId: "default" }),
				awcmsMicroGalleryPlugin(),
				awcmsMicroWebsiteSocialPlugin(),
				awcmsMicroSikesraPlugin({ tenantId: "t-local-dev", siteId: "default" }),
			],
			admin: {
				logo: "/awcms-logo.png",
				favicon: "/awcms-logo.png",
				siteName: "AWCMS",
			},
		}),
	],
	devToolbar: { enabled: false },
});
