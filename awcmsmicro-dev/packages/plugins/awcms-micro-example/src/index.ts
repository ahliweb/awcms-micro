import type { PluginDescriptor, ResolvedPlugin } from "emdash";
import { definePlugin } from "emdash";

import { version } from "../package.json";
import {
	AWCMS_EXAMPLE_ADMIN_PAGES,
	AWCMS_EXAMPLE_ADMIN_WIDGETS,
	AWCMS_EXAMPLE_ALLOWED_HOSTS,
	AWCMS_EXAMPLE_CAPABILITIES,
	AWCMS_EXAMPLE_DESCRIPTOR_STORAGE,
	AWCMS_EXAMPLE_FIELD_WIDGETS,
	AWCMS_EXAMPLE_PLUGIN_ID,
	AWCMS_EXAMPLE_PORTABLE_TEXT_BLOCKS,
	AWCMS_EXAMPLE_SETTINGS_SCHEMA,
	AWCMS_EXAMPLE_STORAGE,
	createNativeRoutes,
	createSharedHooks,
} from "./runtime.js";

export interface AwcmsMicroExamplePluginOptions {
	tenantId?: string;
	siteId?: string;
}

export function awcmsMicroExamplePlugin(
	options: AwcmsMicroExamplePluginOptions = {},
): PluginDescriptor<AwcmsMicroExamplePluginOptions> {
	return {
		id: AWCMS_EXAMPLE_PLUGIN_ID,
		version,
		entrypoint: "@awcms-micro/plugin-example",
		adminEntry: "@awcms-micro/plugin-example/admin",
		options,
		format: "native",
		capabilities: [...AWCMS_EXAMPLE_CAPABILITIES],
		allowedHosts: AWCMS_EXAMPLE_ALLOWED_HOSTS,
		// @ts-expect-error EmDash PluginDescriptor currently doesn't support compound index arrays in its types but supports them at runtime
		storage: AWCMS_EXAMPLE_DESCRIPTOR_STORAGE,
		adminPages: AWCMS_EXAMPLE_ADMIN_PAGES,
		adminWidgets: AWCMS_EXAMPLE_ADMIN_WIDGETS,
	};
}

export function createPlugin(
	_options: AwcmsMicroExamplePluginOptions = {},
): ResolvedPlugin {
	return definePlugin({
		id: AWCMS_EXAMPLE_PLUGIN_ID,
		version,
		capabilities: [...AWCMS_EXAMPLE_CAPABILITIES],
		allowedHosts: AWCMS_EXAMPLE_ALLOWED_HOSTS,
		storage: AWCMS_EXAMPLE_STORAGE,
		admin: {
			entry: "@awcms-micro/plugin-example/admin",
			settingsSchema: AWCMS_EXAMPLE_SETTINGS_SCHEMA,
			pages: AWCMS_EXAMPLE_ADMIN_PAGES,
			widgets: AWCMS_EXAMPLE_ADMIN_WIDGETS,
			portableTextBlocks: AWCMS_EXAMPLE_PORTABLE_TEXT_BLOCKS,
			fieldWidgets: AWCMS_EXAMPLE_FIELD_WIDGETS,
		},
		routes: createNativeRoutes(),
		hooks: createSharedHooks(),
	});
}

export default createPlugin;
