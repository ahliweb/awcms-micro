import { AWCMS_MICRO_DEFAULT_PUBLIC_COPY } from "../locales/messages";

export function getPublicCopy(locale: string | undefined) {
	return locale?.startsWith("id")
		? AWCMS_MICRO_DEFAULT_PUBLIC_COPY.id
		: AWCMS_MICRO_DEFAULT_PUBLIC_COPY.en;
}
