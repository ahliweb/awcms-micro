export const AWCMS_EXAMPLE_PERMISSIONS = {
	dashboardRead: "awcms:example:dashboard:read",
	settingsRead: "awcms:example:settings:read",
	settingsUpdate: "awcms:example:settings:update",
	auditRead: "awcms:example:audit:read",
	publicStatusRead: "awcms:example:public-status:read",
	stateTouch: "awcms:example:state:touch",
	permissionCatalogRead: "awcms:example:permissions:read",
	permissionCatalogWrite: "awcms:example:permissions:write",
	roleCatalogRead: "awcms:example:roles:read",
	roleCatalogWrite: "awcms:example:roles:write",
	accessPreviewRead: "awcms:example:access-preview:read",
} as const;

export const AWCMS_EXAMPLE_PERMISSION_LIST = Object.values(AWCMS_EXAMPLE_PERMISSIONS);
