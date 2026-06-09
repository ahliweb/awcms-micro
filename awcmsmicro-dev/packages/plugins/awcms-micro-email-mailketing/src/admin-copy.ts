import {
	MAILKETING_PO_LOCALE_MESSAGES,
	type MailketingLocale,
	type MailketingMessageKey,
} from "./locales/messages.js";

function resolveLocale(locale: string | undefined): MailketingLocale {
	return locale?.startsWith("id") ? "id" : "en";
}

export function getMailketingAdminCopy(locale: string | undefined) {
	const messages = MAILKETING_PO_LOCALE_MESSAGES[resolveLocale(locale)];
	return (key: MailketingMessageKey) => messages[key];
}
