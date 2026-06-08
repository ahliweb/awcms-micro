// Temporary compiled PO adapter. Keep synchronized with src/locales/*/messages.po
// until the plugin publish workflow generates this module from PO catalogs.
export const AWCMS_WEBSITE_SOCIAL_PO_LOCALE_MESSAGES = {
	en: {
		"websiteSocial.label": "Website Social",
		"websiteSocial.eyebrow": "Website social",
		"websiteSocial.title": "Website Social Contact",
		"websiteSocial.description":
			"Manage WhatsApp number, contextual call-to-action labels, public contact messages, and business location info through the EmDash website_social collection. Public templates read the latest published locale record and render sticky WhatsApp buttons, section-specific CTAs, and a Google Maps embed in the footer.",
		"websiteSocial.manage": "Manage WhatsApp & location settings",
		"websiteSocial.viewPublic": "View public website",
		"websiteSocial.tipPhone": "Use E.164 style phone numbers without plus signs, for example 6289513380400.",
		"websiteSocial.tipSafety": "Keep messages public-safe and avoid personal, sensitive, or operational secrets.",
		"websiteSocial.tipLocale": "Publish one active record per locale so public pages can resolve localized CTA text.",
		"websiteSocial.tipLabels": "Set hero, profile, services, posts, gallery, news, widgets, contact, and sticky labels/messages so each public CTA matches its page context.",
		"websiteSocial.tipLocation": "To show a Google Maps embed in the public footer, add maps_embed_url (iframe src), business_address, opening_hours, and google_maps_url fields to the website_social collection record.",
	},
	id: {
		"websiteSocial.label": "Sosial Website",
		"websiteSocial.eyebrow": "Sosial website",
		"websiteSocial.title": "Kontak Sosial Website",
		"websiteSocial.description":
			"Kelola nomor WhatsApp, label ajakan bertindak kontekstual, pesan kontak publik, dan info lokasi bisnis melalui koleksi website_social EmDash. Template publik membaca record locale terbaru yang dipublikasikan dan merender tombol WhatsApp sticky, CTA publik khusus section, serta embed Google Maps di footer.",
		"websiteSocial.manage": "Kelola pengaturan WhatsApp & lokasi",
		"websiteSocial.viewPublic": "Lihat website publik",
		"websiteSocial.tipPhone": "Gunakan nomor telepon gaya E.164 tanpa tanda plus, misalnya 6289513380400.",
		"websiteSocial.tipSafety": "Jaga pesan tetap aman untuk publik dan hindari rahasia personal, sensitif, atau operasional.",
		"websiteSocial.tipLocale": "Publikasikan satu record aktif per locale agar halaman publik dapat memakai teks CTA terlokalisasi.",
		"websiteSocial.tipLabels": "Atur label/pesan hero, profil, layanan, pos, galeri, berita, widget, kontak, dan sticky agar setiap CTA publik sesuai konteks halamannya.",
		"websiteSocial.tipLocation": "Untuk menampilkan embed Google Maps di footer publik, tambahkan field maps_embed_url (src iframe), business_address, opening_hours, dan google_maps_url ke record koleksi website_social.",
	},
} as const;
