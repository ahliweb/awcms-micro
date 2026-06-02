import { AWCMS_GALLERY_PO_LOCALE_MESSAGES } from "./locales/messages.js";

export const AWCMS_GALLERY_TRANSLATIONS = AWCMS_GALLERY_PO_LOCALE_MESSAGES;

export type GalleryTranslationKey = keyof typeof AWCMS_GALLERY_TRANSLATIONS.en;

export function normalizeGalleryLocale(locale: string | undefined): "en" | "id" {
	return locale && locale.startsWith("id") ? "id" : "en";
}

export function translateGallery(key: GalleryTranslationKey, locale: string | undefined): string {
	return AWCMS_GALLERY_TRANSLATIONS[normalizeGalleryLocale(locale)][key];
}
