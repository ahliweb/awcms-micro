import { getEmDashCollection } from "emdash";

export interface WebsiteSocialConfig {
	enabled: boolean;
	whatsappNumber: string;
	defaultMessage: string;
	heroMessage: string;
	sectionMessage: string;
	contactMessage: string;
	profileMessage: string;
	servicesMessage: string;
	postsMessage: string;
	galleryMessage: string;
	newsMessage: string;
	widgetsMessage: string;
	heroLabel: string;
	sectionLabel: string;
	contactLabel: string;
	profileLabel: string;
	servicesLabel: string;
	postsLabel: string;
	galleryLabel: string;
	newsLabel: string;
	widgetsLabel: string;
	stickyLabel: string;
	mapsEmbedUrl: string;
	businessAddress: string;
	openingHours: string;
	googleMapsUrl: string;
}

const DEFAULT_SOCIAL_CONFIG: WebsiteSocialConfig = {
	enabled: true,
	whatsappNumber: "6289513380400",
	defaultMessage: "Hello AWCMS-Micro team, I would like to discuss a website project.",
	heroMessage: "Hello AWCMS-Micro team, I am interested in building a public website with EmDash.",
	sectionMessage: "Hello AWCMS-Micro team, I want to learn more about this public website section.",
	contactMessage: "Hello AWCMS-Micro team, please help me plan my website project.",
	profileMessage: "Hello AWCMS-Micro team, I want to discuss the website profile and brand story.",
	servicesMessage: "Hello AWCMS-Micro team, I want to discuss the website services and content workflow.",
	postsMessage: "Hello AWCMS-Micro team, I want to discuss publishing posts and portfolio content.",
	galleryMessage: "Hello AWCMS-Micro team, I want to discuss gallery and media management.",
	newsMessage: "Hello AWCMS-Micro team, I want to discuss news and update publishing.",
	widgetsMessage: "Hello AWCMS-Micro team, I want to discuss homepage widgets and managed sections.",
	heroLabel: "Start on WhatsApp",
	sectionLabel: "Ask about this section",
	contactLabel: "Plan with WhatsApp",
	profileLabel: "Discuss profile",
	servicesLabel: "Ask about services",
	postsLabel: "Discuss content",
	galleryLabel: "Discuss gallery",
	newsLabel: "Discuss updates",
	widgetsLabel: "Discuss widgets",
	stickyLabel: "Chat on WhatsApp",
	mapsEmbedUrl: "",
	businessAddress: "",
	openingHours: "",
	googleMapsUrl: "",
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
			profileMessage: asString(data.profile_message, DEFAULT_SOCIAL_CONFIG.profileMessage),
			servicesMessage: asString(data.services_message, DEFAULT_SOCIAL_CONFIG.servicesMessage),
			postsMessage: asString(data.posts_message, DEFAULT_SOCIAL_CONFIG.postsMessage),
			galleryMessage: asString(data.gallery_message, DEFAULT_SOCIAL_CONFIG.galleryMessage),
			newsMessage: asString(data.news_message, DEFAULT_SOCIAL_CONFIG.newsMessage),
			widgetsMessage: asString(data.widgets_message, DEFAULT_SOCIAL_CONFIG.widgetsMessage),
			heroLabel: asString(data.hero_label, DEFAULT_SOCIAL_CONFIG.heroLabel),
			sectionLabel: asString(data.section_label, DEFAULT_SOCIAL_CONFIG.sectionLabel),
			contactLabel: asString(data.contact_label, DEFAULT_SOCIAL_CONFIG.contactLabel),
			profileLabel: asString(data.profile_label, DEFAULT_SOCIAL_CONFIG.profileLabel),
			servicesLabel: asString(data.services_label, DEFAULT_SOCIAL_CONFIG.servicesLabel),
			postsLabel: asString(data.posts_label, DEFAULT_SOCIAL_CONFIG.postsLabel),
			galleryLabel: asString(data.gallery_label, DEFAULT_SOCIAL_CONFIG.galleryLabel),
			newsLabel: asString(data.news_label, DEFAULT_SOCIAL_CONFIG.newsLabel),
			widgetsLabel: asString(data.widgets_label, DEFAULT_SOCIAL_CONFIG.widgetsLabel),
			stickyLabel: asString(data.sticky_label, DEFAULT_SOCIAL_CONFIG.stickyLabel),
			mapsEmbedUrl: asString(data.maps_embed_url, DEFAULT_SOCIAL_CONFIG.mapsEmbedUrl),
			businessAddress: asString(data.business_address, DEFAULT_SOCIAL_CONFIG.businessAddress),
			openingHours: asString(data.opening_hours, DEFAULT_SOCIAL_CONFIG.openingHours),
			googleMapsUrl: asString(data.google_maps_url, DEFAULT_SOCIAL_CONFIG.googleMapsUrl),
		};
	} catch {
		return DEFAULT_SOCIAL_CONFIG;
	}
}
