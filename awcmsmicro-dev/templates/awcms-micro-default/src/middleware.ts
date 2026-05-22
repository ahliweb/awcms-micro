import { defineMiddleware } from "astro:middleware";

const PUBLIC_ADMIN_PREFIXES = [
	"/_emdash/admin/login",
	"/_emdash/admin/setup",
	"/_emdash/admin/signup",
	"/_emdash/admin/invite/accept",
	"/_emdash/admin/device",
];

function isPublicAdminPath(pathname: string) {
	return PUBLIC_ADMIN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function getSessionUserId(sessionUser: unknown) {
	if (!sessionUser || typeof sessionUser !== "object" || !("id" in sessionUser)) return null;
	return typeof sessionUser.id === "string" && sessionUser.id.length > 0 ? sessionUser.id : null;
}

function buildLoginRedirect(url: URL) {
	const loginUrl = new URL("/_emdash/admin/login", url);
	loginUrl.searchParams.set("redirect", `${url.pathname}${url.search}`);
	return loginUrl;
}

export const onRequest = defineMiddleware(async (context, next) => {
	const { url, cookies } = context;

	if (!url.pathname.startsWith("/_emdash/admin") || isPublicAdminPath(url.pathname)) {
		return next();
	}

	if (cookies.get("astro-session") === undefined) {
		return context.redirect(buildLoginRedirect(url).toString());
	}

	const sessionUser = await context.session?.get("user");
	if (!getSessionUserId(sessionUser)) {
		return context.redirect(buildLoginRedirect(url).toString());
	}

	return next();
});
