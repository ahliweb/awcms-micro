export type TranslationMessages = Record<string, Record<string, string>>;

export function resolveLabel(
	labelKey: string,
	fallbackLabel: string,
	messages: TranslationMessages | undefined,
	requestedLocale: string,
	defaultLocale: string = "en"
): string {
	if (messages) {
		// 1. requested locale
		if (messages[requestedLocale]?.[labelKey]) {
			return messages[requestedLocale][labelKey];
		}
		// 2. default locale
		if (messages[defaultLocale]?.[labelKey]) {
			return messages[defaultLocale][labelKey];
		}
	}
	// 3. fallbackLabel
	if (fallbackLabel) {
		return fallbackLabel;
	}
	// 4. labelKey
	return labelKey;
}
