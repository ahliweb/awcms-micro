import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { awcmsMicroExamplePlugin } from "@awcms-micro/plugin-example";
import { d1, r2, sandbox } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";

const siteUrl = process.env.AWCMS_MICRO_SITE_URL ?? "https://awcms-micro.ahlikoding.com";

export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
			plugins: [
		...(() => {
			const plugin = awcmsMicroExamplePlugin({
				tenantId: "t-local-dev",
			});
			console.log("awcmsMicroExamplePlugin result:", plugin);
			return [plugin];
		})(),
	],
			sandboxed: [],
			sandboxRunner: sandbox(),
			siteUrl,
		}),
	],
	devToolbar: { enabled: false },
});
