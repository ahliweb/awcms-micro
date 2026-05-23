import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { awcmsMicroExamplePlugin } from "@awcms-micro/plugin-example";
import { awcmsMicroGalleryPlugin } from "@awcms-micro/plugin-gallery";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

export default defineConfig({
	output: "server",
	adapter: node({ mode: "standalone" }),
	image: {
		layout: "constrained",
		responsiveStyles: true,
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
				awcmsMicroExamplePlugin({ tenantId: "t-local-dev" }),
				awcmsMicroGalleryPlugin({ maxImageBytes: 10485760, maxVideoBytes: 262144000 }),
			],
		}),
		],
	devToolbar: { enabled: false },
});
