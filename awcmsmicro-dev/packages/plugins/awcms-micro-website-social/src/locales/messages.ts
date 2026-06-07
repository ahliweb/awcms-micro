// Temporary compiled PO adapter. Keep synchronized with src/locales/*/messages.po
// until the plugin publish workflow generates this module from PO catalogs.
export const AWCMS_WEBSITE_SOCIAL_PO_LOCALE_MESSAGES = {
	en: {
		"websiteSocial.label": "Website Social",
		"websiteSocial.eyebrow": "Website social",
		"websiteSocial.title": "Website Social Contact",
		"websiteSocial.description":
			"Manage WhatsApp number, contextual call-to-action labels, and public contact messages through the EmDash website_social collection. Public templates read the latest published locale record and render sticky WhatsApp buttons plus section-specific public CTAs.",
		"websiteSocial.manage": "Manage WhatsApp settings",
		"websiteSocial.viewPublic": "View public website",
		"websiteSocial.tipPhone": "Use E.164 style phone numbers without plus signs, for example 6281234567890.",
		"websiteSocial.tipSafety": "Keep messages public-safe and avoid personal, sensitive, or operational secrets.",
		"websiteSocial.tipLocale": "Publish one active record per locale so public pages can resolve localized CTA text.",
		"websiteSocial.tipLabels": "Set hero, profile, services, posts, gallery, news, widgets, contact, and sticky labels/messages so each public CTA matches its page context.",
	},
	id: {
		"websiteSocial.label": "Sosial Website",
		"websiteSocial.eyebrow": "Sosial website",
		"websiteSocial.title": "Kontak Sosial Website",
		"websiteSocial.description":
			"Kelola nomor WhatsApp, label ajakan bertindak kontekstual, dan pesan kontak publik melalui koleksi website_social EmDash. Template publik membaca record locale terbaru yang dipublikasikan dan merender tombol WhatsApp sticky serta CTA publik khusus section.",
		"websiteSocial.manage": "Kelola pengaturan WhatsApp",
		"websiteSocial.viewPublic": "Lihat website publik",
		"websiteSocial.tipPhone": "Gunakan nomor telepon gaya E.164 tanpa tanda plus, misalnya 6281234567890.",
		"websiteSocial.tipSafety": "Jaga pesan tetap aman untuk publik dan hindari rahasia personal, sensitif, atau operasional.",
		"websiteSocial.tipLocale": "Publikasikan satu record aktif per locale agar halaman publik dapat memakai teks CTA terlokalisasi.",
		"websiteSocial.tipLabels": "Atur label/pesan hero, profil, layanan, pos, galeri, berita, widget, kontak, dan sticky agar setiap CTA publik sesuai konteks halamannya.",
	},
} as const;
