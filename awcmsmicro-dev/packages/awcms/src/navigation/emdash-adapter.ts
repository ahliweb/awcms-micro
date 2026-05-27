import type { AwcmsModuleManifest } from "../modules/module-manifest.schema.js";

export type EmdashAdminPage = {
	path: string;
	label: string;
	icon?: string;
};

/**
	* Feature flag check for AWCMS_USE_EMDASH_ADMIN_NAV.
	* Controls whether AWCMS-Micro plugins should adopt the new native EmDash
	* admin navigation or rely on the custom compatibility layer fallback.
	*/
export function getUseEmdashAdminNav(): boolean {
	if (typeof process !== "undefined" && process.env) {
		return process.env.AWCMS_USE_EMDASH_ADMIN_NAV === "true";
	}
	return false;
}

export function getEnablePluginSidebarPlacement(): boolean {
	if (typeof process !== "undefined" && process.env) {
		return process.env.AWCMS_ENABLE_PLUGIN_SIDEBAR_PLACEMENT !== "false";
	}
	return true; // default true
}

/**
	* Migration boundary function that converts/flattens the structured
	* AWCMS-Micro navigation manifest to flat EmDash admin.pages records.
	*/
export function adaptToEmdashPages(
	manifest: AwcmsModuleManifest
): EmdashAdminPage[] {
	const pages: EmdashAdminPage[] = [];

	if (!manifest.navigation) {
		return pages;
	}

	const addItems = (items: any[]) => {
		for (const item of items) {
			pages.push({
				path: item.path,
				label: item.fallbackLabel,
				icon: item.icon,
			});
			if (item.children) {
				addItems(item.children);
			}
		}
	};

	if (manifest.navigation.groups) {
		for (const group of manifest.navigation.groups) {
			addItems(group.items);
		}
	}

	if (manifest.navigation.items) {
		addItems(manifest.navigation.items);
	}

	return pages;
}
