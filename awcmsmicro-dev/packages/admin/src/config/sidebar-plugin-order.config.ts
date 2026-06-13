/**
 * Explicit sidebar plugin group order for AWCMS-Micro.
 *
 * Plugins listed here render in this order in both the sidebar and the command palette.
 * Plugins not listed fall to the end and sort alphabetically among themselves.
 * Add new AWCMS-Micro plugin IDs here when they are registered in the template.
 */
export const SIDEBAR_PLUGIN_GROUP_ORDER: readonly string[] = [
	"awcms-micro-sikesra", // Governance plugin — always first
	"awcms-micro-gallery", // Gallery
	"awcms-micro-docs", // Docs
	"awcms-micro-website-social", // Website Social
	"awcms-micro-email-mailketing", // Email / Mailketing
] as const;
