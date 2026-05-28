type PluginPageConfig = {
	path: string;
	label?: string;
};

type PluginConfig = {
	name?: string;
	enabled?: boolean;
	adminMode?: "react" | "blocks" | "none";
	adminPages?: PluginPageConfig[];
};

type PluginManifest = {
	plugins: Record<string, PluginConfig>;
};

export type PluginNavPage = {
	path: string;
	label: string;
};

export type PluginNavGroup = {
	pluginId: string;
	label: string;
	pages: PluginNavPage[];
};

export function humanizePluginId(pluginId: string): string {
	return pluginId
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function getPluginNavGroups(
	manifest: PluginManifest,
	shouldIncludePage: (pluginId: string, config: PluginConfig, page: PluginPageConfig) => boolean,
): PluginNavGroup[] {
	const groups: PluginNavGroup[] = [];

	for (const [pluginId, config] of Object.entries(manifest.plugins)) {
		if (config.enabled === false) continue;
		if (!config.adminPages || config.adminPages.length === 0) continue;

		const pages = config.adminPages
			.filter((page) => shouldIncludePage(pluginId, config, page))
			.map((page) => ({
				path: page.path,
				label: page.label || humanizePluginId(pluginId),
			}));

		if (pages.length === 0) continue;

		groups.push({
			pluginId,
			label: config.name?.trim() || humanizePluginId(pluginId),
			pages,
		});
	}

	return groups;
}
