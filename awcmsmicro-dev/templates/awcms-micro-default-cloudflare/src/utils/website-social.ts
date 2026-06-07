import { getEmDashCollection } from "emdash";

export interface WebsiteSocialConfig {
	enabled: boolean;
	whatsappNumber: string;
	defaultMessage: string;
	heroMessage: string;
	sectionMessage: string;
	contactMessage: string;
	stickyLabel: string;
}

const DEFAULT_SOCIAL_CONFIG: WebsiteSocialConfig = {
	enabled: true,
	whatsappNumber: "6281234567890",
	defaultMessage: "Hello AWCMS-Micro team, I would like to discuss a Cloudflare website project.",
	heroMessage: "Hello AWCMS-Micro team, I am interested in building a Cloudflare-ready public website with EmDash.",
	sectionMessage: "Hello AWCMS-Micro team, I want to learn more about this public website section.",
	contactMessage: "Hello AWCMS-Micro team, please help me plan my Cloudflare website project.",
	stickyLabel: "Chat on WhatsApp",
};

function asString(value: unknown, fallback: string) {
	return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizePhone(value: string) {
	return value.replace(/[^0-9]/g, "");
}

export function createWhatsAppUrl(config: WebsiteSocialConfig, message?: string) {
	const number = normalizePhone(config.whatsappNumber);
	const text = message || config.defaultMessage;
	return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export async function getWebsiteSocialConfig(locale: string | undefined): Promise<WebsiteSocialConfig> {
	try {
		const { entries } = await getEmDashCollection("website_social", { limit: 10 });
		const preferred = entries.find((entry: any) => entry.locale === locale) ?? entries[0];
		const data = (preferred as any)?.data ?? {};

		return {
			enabled: data.enabled !== false,
			whatsappNumber: normalizePhone(asString(data.whatsapp_number, DEFAULT_SOCIAL_CONFIG.whatsappNumber)),
			defaultMessage: asString(data.default_message, DEFAULT_SOCIAL_CONFIG.defaultMessage),
			heroMessage: asString(data.hero_message, DEFAULT_SOCIAL_CONFIG.heroMessage),
			sectionMessage: asString(data.section_message, DEFAULT_SOCIAL_CONFIG.sectionMessage),
			contactMessage: asString(data.contact_message, DEFAULT_SOCIAL_CONFIG.contactMessage),
			stickyLabel: asString(data.sticky_label, DEFAULT_SOCIAL_CONFIG.stickyLabel),
		};
	} catch {
		return DEFAULT_SOCIAL_CONFIG;
	}
}
