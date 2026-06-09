import type { PluginDescriptor, ResolvedPlugin } from "emdash";
import { definePlugin } from "emdash";

import { version } from "../package.json";

import {
	AWCMS_MAILKETING_ADMIN_PAGES,
	AWCMS_MAILKETING_ADMIN_WIDGETS,
	AWCMS_MAILKETING_ALLOWED_HOSTS,
	AWCMS_MAILKETING_CAPABILITIES,
	AWCMS_MAILKETING_DESCRIPTOR_STORAGE,
	AWCMS_MAILKETING_MANIFEST,
	AWCMS_MAILKETING_PLUGIN_ID,
	AWCMS_MAILKETING_SETTINGS_SCHEMA,
	AWCMS_MAILKETING_STORAGE,
	createNativeRoutes,
	createSharedHooks,
	type MailketingRuntimeOptions,
} from "./runtime.js";

export { AWCMS_MAILKETING_PLUGIN_ID };
export type { MailketingRuntimeOptions };

export function awcmsEmailMailketingPlugin(
	options: MailketingRuntimeOptions = {},
): PluginDescriptor<MailketingRuntimeOptions> {
	return {
		id: AWCMS_MAILKETING_PLUGIN_ID,
		version,
		entrypoint: "@awcms-micro/plugin-email-mailketing",
		adminEntry: "@awcms-micro/plugin-email-mailketing/admin",
		options,
		format: "native",
		capabilities: [...AWCMS_MAILKETING_CAPABILITIES],
		allowedHosts: [...AWCMS_MAILKETING_ALLOWED_HOSTS],
		// @ts-expect-error EmDash PluginDescriptor currently doesn't support compound index arrays in its types but supports them at runtime
		storage: AWCMS_MAILKETING_DESCRIPTOR_STORAGE,
		adminPages: [...AWCMS_MAILKETING_ADMIN_PAGES],
		adminWidgets: AWCMS_MAILKETING_ADMIN_WIDGETS,
		i18n: AWCMS_MAILKETING_MANIFEST.i18n,
	};
}

export function createPlugin(options: MailketingRuntimeOptions = {}): ResolvedPlugin {
	return definePlugin({
		id: AWCMS_MAILKETING_PLUGIN_ID,
		version,
		capabilities: [...AWCMS_MAILKETING_CAPABILITIES],
		allowedHosts: [...AWCMS_MAILKETING_ALLOWED_HOSTS],
		storage: AWCMS_MAILKETING_STORAGE,
		admin: {
			entry: "@awcms-micro/plugin-email-mailketing/admin",
			settingsSchema: AWCMS_MAILKETING_SETTINGS_SCHEMA,
			pages: [...AWCMS_MAILKETING_ADMIN_PAGES],
			widgets: AWCMS_MAILKETING_ADMIN_WIDGETS,
			i18n: AWCMS_MAILKETING_MANIFEST.i18n,
		} as never,
		routes: createNativeRoutes(options),
		hooks: createSharedHooks(options),
	});
}

export default createPlugin;
