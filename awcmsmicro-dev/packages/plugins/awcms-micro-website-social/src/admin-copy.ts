import { AWCMS_WEBSITE_SOCIAL_PO_LOCALE_MESSAGES } from "./locales/messages.js";

type WebsiteSocialLocale = keyof typeof AWCMS_WEBSITE_SOCIAL_PO_LOCALE_MESSAGES;
type WebsiteSocialMessageKey = keyof (typeof AWCMS_WEBSITE_SOCIAL_PO_LOCALE_MESSAGES)["en"];

function resolveLocale(locale: string | undefined): WebsiteSocialLocale {
	return locale?.startsWith("id") ? "id" : "en";
}

export function getWebsiteSocialAdminCopy(locale: string | undefined) {
	const messages = AWCMS_WEBSITE_SOCIAL_PO_LOCALE_MESSAGES[resolveLocale(locale)];
	return (key: WebsiteSocialMessageKey) => messages[key];
}
