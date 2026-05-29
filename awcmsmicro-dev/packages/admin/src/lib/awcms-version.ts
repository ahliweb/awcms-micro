/**
 * Root AWCMS maintenance version, injected by the admin build.
 * Falls back to the checked-in workspace version for local tests.
 */

declare const __AWCMS_ROOT_VERSION__: string;

export const AWCMS_ROOT_VERSION: string =
	typeof __AWCMS_ROOT_VERSION__ !== "undefined" ? __AWCMS_ROOT_VERSION__ : "0.1.0";
