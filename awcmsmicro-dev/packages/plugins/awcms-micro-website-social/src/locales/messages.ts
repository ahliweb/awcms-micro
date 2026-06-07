// Temporary compiled PO adapter. Keep synchronized with src/locales/*/messages.po
// until the plugin publish workflow generates this module from PO catalogs.
export const AWCMS_WEBSITE_SOCIAL_PO_LOCALE_MESSAGES = {
	en: {
		"websiteSocial.label": "Website Social",
		"websiteSocial.eyebrow": "Website social",
		"websiteSocial.title": "Website Social Contact",
		"websiteSocial.description":
			"Manage WhatsApp number, call-to-action labels, and public contact messages through the EmDash website_social collection. Public templates read the latest published record and render sticky WhatsApp buttons plus contextual public CTAs.",
		"websiteSocial.manage": "Manage WhatsApp settings",
		"websiteSocial.viewPublic": "View public website",
		"websiteSocial.tipPhone": "Use E.164 style phone numbers without plus signs, for example 6281234567890.",
		"websiteSocial.tipSafety": "Keep messages public-safe and avoid personal, sensitive, or operational secrets.",
		"websiteSocial.tipLocale": "Publish one active record per locale so public pages can resolve localized CTA text.",
	},
	id: {
		"websiteSocial.label": "Sosial Website",
		"websiteSocial.eyebrow": "Sosial website",
		"websiteSocial.title": "Kontak Sosial Website",
		"websiteSocial.description":
			"Kelola nomor WhatsApp, label ajakan bertindak, dan pesan kontak publik melalui koleksi website_social EmDash. Template publik membaca record terbaru yang dipublikasikan dan merender tombol WhatsApp sticky serta CTA publik kontekstual.",
		"websiteSocial.manage": "Kelola pengaturan WhatsApp",
		"websiteSocial.viewPublic": "Lihat website publik",
		"websiteSocial.tipPhone": "Gunakan nomor telepon gaya E.164 tanpa tanda plus, misalnya 6281234567890.",
		"websiteSocial.tipSafety": "Jaga pesan tetap aman untuk publik dan hindari rahasia personal, sensitif, atau operasional.",
		"websiteSocial.tipLocale": "Publikasikan satu record aktif per locale agar halaman publik dapat memakai teks CTA terlokalisasi.",
	},
} as const;
