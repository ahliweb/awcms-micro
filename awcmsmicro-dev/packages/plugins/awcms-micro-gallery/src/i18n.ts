import { AWCMS_GALLERY_PO_LOCALE_MESSAGES } from "./locales/messages.js";

export const AWCMS_GALLERY_TRANSLATIONS = AWCMS_GALLERY_PO_LOCALE_MESSAGES;

export type GalleryTranslationKey = keyof typeof AWCMS_GALLERY_TRANSLATIONS.en;

export function normalizeGalleryLocale(locale: string | undefined): "en" | "id" {
	return locale && locale.startsWith("id") ? "id" : "en";
}

export function translateGallery(key: GalleryTranslationKey, locale: string | undefined): string {
	return AWCMS_GALLERY_TRANSLATIONS[normalizeGalleryLocale(locale)][key];
}

/**
 * Resolve a safe, supported locale ("en" | "id") from a route/plugin context.
 *
 * The raw `Accept-Language` header (e.g. "id-ID,id;q=0.9,en;q=0.8") is NOT a
 * valid Intl/BCP-47 locale and throws `RangeError` when passed directly to
 * `Intl`/`toLocaleDateString`. Different runtimes also expose headers
 * differently (Fetch `Headers` vs plain object), so read defensively and always
 * normalize down to a supported locale.
 */
export function resolveRequestLocale(source: { request?: unknown } | undefined): "en" | "id" {
	const request = source?.request as { headers?: unknown } | undefined;
	const headers = request?.headers as
		| { get?: (name: string) => string | null }
		| Record<string, unknown>
		| undefined;
	let raw: string | undefined;
	if (headers && typeof (headers as { get?: unknown }).get === "function") {
		raw = (headers as { get: (name: string) => string | null }).get("accept-language") ?? undefined;
	} else if (headers && typeof headers === "object") {
		const record = headers as Record<string, unknown>;
		const value = record["accept-language"] ?? record["Accept-Language"];
		raw = typeof value === "string" ? value : undefined;
	}
	return normalizeGalleryLocale(raw);
}

/** Format an event date for display, returning "-" for missing/invalid values. */
export function formatEventDate(value: unknown, locale: "en" | "id"): string {
	if (typeof value !== "string" || !value) return "-";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "-";
	return date.toLocaleDateString(locale, { dateStyle: "medium" });
}

/** Convert a stored date into a `YYYY-MM-DD` value for date inputs, safely. */
export function toDateInputValue(value: unknown): string {
	if (typeof value !== "string" || !value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return date.toISOString().split("T")[0] ?? "";
}

/** Parse a date input into an ISO string, returning null for missing/invalid values. */
export function toIsoDateOrNull(value: unknown): string | null {
	if (typeof value !== "string" || !value) return null;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return null;
	return date.toISOString();
}
