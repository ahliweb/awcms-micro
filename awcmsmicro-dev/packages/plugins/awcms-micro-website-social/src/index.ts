import type { PluginDescriptor, ResolvedPlugin } from "emdash";
import { definePlugin } from "emdash";

import { version } from "../package.json";

export const AWCMS_WEBSITE_SOCIAL_PLUGIN_ID = "awcms-micro-website-social";
export const AWCMS_WEBSITE_SOCIAL_COLLECTION = "website_social";

export const AWCMS_WEBSITE_SOCIAL_ADMIN_PAGES = [
	{ path: "/", label: "Website Social", labelKey: "websiteSocial.label", icon: "chat" },
];

export function awcmsMicroWebsiteSocialPlugin(): PluginDescriptor {
	return {
		id: AWCMS_WEBSITE_SOCIAL_PLUGIN_ID,
		version,
		entrypoint: "@awcms-micro/plugin-website-social",
		adminEntry: "@awcms-micro/plugin-website-social/admin",
		capabilities: [],
		allowedHosts: [],
		adminPages: AWCMS_WEBSITE_SOCIAL_ADMIN_PAGES,
	};
}

export function createPlugin(): ResolvedPlugin {
	return definePlugin({
		id: AWCMS_WEBSITE_SOCIAL_PLUGIN_ID,
		version,
		capabilities: [],
		allowedHosts: [],
		admin: {
			entry: "@awcms-micro/plugin-website-social/admin",
			pages: AWCMS_WEBSITE_SOCIAL_ADMIN_PAGES,
		},
	});
}

export default createPlugin;
