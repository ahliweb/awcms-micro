import type { PluginDescriptor, ResolvedPlugin } from "emdash";
import { definePlugin } from "emdash";

import { version } from "../package.json";
import { createExampleRoutes } from "./routes.js";
import { AWCMS_EXAMPLE_PERMISSION_LIST } from "./permissions.js";

export interface AwcmsMicroExamplePluginOptions {
	tenantId?: string;
	siteId?: string;
}

export function awcmsMicroExamplePlugin(
	options: AwcmsMicroExamplePluginOptions = {},
): PluginDescriptor<AwcmsMicroExamplePluginOptions> {
	return {
		id: "awcms-micro-example",
		version,
		entrypoint: "@awcms-micro/plugin-example",
		adminEntry: "@awcms-micro/plugin-example/admin",
		options,
		adminPages: [{ path: "/overview", label: "Overview", icon: "stack" }],
	};
}

export function createPlugin(
	_options: AwcmsMicroExamplePluginOptions = {},
): ResolvedPlugin {
	return definePlugin({
		id: "awcms-micro-example",
		version,
		storage: {
			audit: {
				indexes: ["timestamp", "action", ["resource", "timestamp"]],
			},
		},
		admin: {
			entry: "@awcms-micro/plugin-example/admin",
			pages: [{ path: "/overview", label: "Overview", icon: "stack" }],
		},
		routes: createExampleRoutes(),
		hooks: {
			"plugin:activate": {
				handler: async (_event, ctx) => {
					ctx.log.info("AWCMS-Micro example plugin activated", {
						permissions: AWCMS_EXAMPLE_PERMISSION_LIST,
					});
				},
			},
		},
	});
}

export default createPlugin;
