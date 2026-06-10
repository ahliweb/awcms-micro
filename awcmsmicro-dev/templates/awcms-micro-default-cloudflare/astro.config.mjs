import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { awcmsMicroDocsPlugin } from "@awcms-micro/plugin-docs";
import { awcmsEmailMailketingPlugin } from "@awcms-micro/plugin-email-mailketing";
import { awcmsMicroGalleryPlugin } from "@awcms-micro/plugin-gallery";
import { awcmsMicroSikesraPlugin } from "@awcms-micro/plugin-sikesra";
import { awcmsMicroWebsiteSocialPlugin } from "@awcms-micro/plugin-website-social";
import { d1, r2, sandbox } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";

const siteUrl = process.env.AWCMS_MICRO_SITE_URL ?? "https://awcms-micro.ahlikoding.com";
const sikesraTenantId = process.env.AWCMS_MICRO_SIKESRA_TENANT_ID ?? "t-production";
const sikesraSiteId = process.env.AWCMS_MICRO_SIKESRA_SITE_ID ?? "production";
const mailketingTenantId = process.env.AWCMS_MICRO_MAILKETING_TENANT_ID ?? "t-production";
const mailketingSiteId = process.env.AWCMS_MICRO_MAILKETING_SITE_ID ?? "production";

export default defineConfig({
	output: "server",
	adapter: cloudflare(),
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
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
			plugins: [
				awcmsMicroDocsPlugin(),
				awcmsEmailMailketingPlugin({ tenantId: mailketingTenantId, siteId: mailketingSiteId }),
				awcmsMicroGalleryPlugin(),
				awcmsMicroWebsiteSocialPlugin(),
				awcmsMicroSikesraPlugin({ tenantId: sikesraTenantId, siteId: sikesraSiteId }),
			],
			sandboxed: [],
			sandboxRunner: sandbox(),
			siteUrl,
			admin: {
				logo: "/awcms-logo.png",
				favicon: "/awcms-logo.png",
				siteName: "AWCMS",
			},
		}),
	],
	devToolbar: { enabled: false },
});
