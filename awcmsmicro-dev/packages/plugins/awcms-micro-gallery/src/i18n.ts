export const AWCMS_GALLERY_TRANSLATIONS = {
	en: {
		"gallery.title": "AWCMS-Micro Gallery",
		"gallery.desc": "Manage gallery validation, Cloudflare media flags, and audit-ready gallery controls without changing EmDash core.",
		"gallery.saved": "Gallery settings saved.",
		"gallery.images": "Images",
		"gallery.videos": "Videos",
		"gallery.cf_images": "Cloudflare Images",
		"gallery.cf_stream": "Cloudflare Stream",
		"gallery.max_img": "Maximum image bytes",
		"gallery.max_img_desc": "Images larger than this are rejected by gallery validation routes and hooks.",
		"gallery.max_vid": "Maximum video bytes",
		"gallery.max_vid_desc": "Videos larger than this are rejected by gallery validation routes and hooks.",
		"gallery.cf_images_enable": "Cloudflare Images enabled",
		"gallery.cf_images_enable_desc": "Enable Cloudflare Images support for gallery media workflows.",
		"gallery.cf_stream_enable": "Cloudflare Stream enabled",
		"gallery.cf_stream_enable_desc": "Enable Cloudflare Stream support for gallery media workflows.",
		"gallery.save": "Save settings",
		"gallery.label": "Gallery",
		"gallery.group": "Gallery",
		"gallery.value.enabled": "Enabled",
		"gallery.value.optional": "Optional",
	},
	id: {
		"gallery.title": "Galeri AWCMS-Micro",
		"gallery.desc": "Kelola validasi galeri, bendera media Cloudflare, dan kontrol galeri siap-audit tanpa mengubah core EmDash.",
		"gallery.saved": "Pengaturan galeri disimpan.",
		"gallery.images": "Gambar",
		"gallery.videos": "Video",
		"gallery.cf_images": "Gambar Cloudflare",
		"gallery.cf_stream": "Stream Cloudflare",
		"gallery.max_img": "Ukuran gambar maksimum (byte)",
		"gallery.max_img_desc": "Gambar yang lebih besar dari batas ini akan ditolak oleh route dan hook validasi galeri.",
		"gallery.max_vid": "Ukuran video maksimum (byte)",
		"gallery.max_vid_desc": "Video yang lebih besar dari batas ini akan ditolak oleh route dan hook validasi galeri.",
		"gallery.cf_images_enable": "Gambar Cloudflare diaktifkan",
		"gallery.cf_images_enable_desc": "Aktifkan dukungan Cloudflare Images untuk alur kerja media galeri.",
		"gallery.cf_stream_enable": "Stream Cloudflare diaktifkan",
		"gallery.cf_stream_enable_desc": "Aktifkan dukungan Cloudflare Stream untuk alur kerja media galeri.",
		"gallery.save": "Simpan pengaturan",
		"gallery.label": "Galeri",
		"gallery.group": "Galeri",
		"gallery.value.enabled": "Aktif",
		"gallery.value.optional": "Opsional",
	},
} as const;

export type GalleryTranslationKey = keyof typeof AWCMS_GALLERY_TRANSLATIONS.en;

export function normalizeGalleryLocale(locale: string | undefined): "en" | "id" {
	return locale && locale.startsWith("id") ? "id" : "en";
}

export function translateGallery(key: GalleryTranslationKey, locale: string | undefined): string {
	return AWCMS_GALLERY_TRANSLATIONS[normalizeGalleryLocale(locale)][key];
}
