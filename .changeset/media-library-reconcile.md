---
"awcms-micro": minor
---

Rekonsiliasi status aktif, preset, komentar sumber, readiness, dan inventori tergenerasi untuk `media_library` (Issue #264, epic #261 Wave 0, ADR-0026).

- **Preset (perubahan perilaku):** `online_website`, `news_portal`, dan `news_portal_full_online_r2` kini mengaktifkan `media_library` secara eksplisit. Sebelumnya preset apa pun yang mengaktifkan konsumen media (`blog_content`/`news_portal`) akan MENONAKTIFKAN registry media bagi tenant (media_library adalah System Foundation non-protected) — persis celah "website tanpa manajemen media" yang ADR-0026 tutup. Situs brosur kini punya media terkelola tanpa perlu portal berita.
- **Kepemilikan job:** job rekonsiliasi media (`bun run news-media:reconcile`) dipindahkan dari descriptor `news_portal` ke `media_library`, yang memiliki tabel `awcms_micro_news_media_objects` dan seluruh kode rekonsiliasinya (ADR-0026 membalik kepemilikan). Nama command sengaja dipertahankan.
- **Komentar sumber:** `src/modules/index.ts` tidak lagi mendeskripsikan `media_library` sebagai `experimental`/tanpa kode; README modul menandai semua langkah ADR-0026 (5b/5c/5d) selesai.
- **Gate konsistensi baru:** `bun run media-library:consistency:check` (bagian dari `bun run check`) gagal pada drift status/versi/preset/capability/job/komentar `media_library` di masa depan.
- **Dokumentasi:** rekonsiliasi referensi kapabilitas `news_media` usang → `media_library` di README social_publishing/identity_access/_shared, arsitektur social-publishing, ADR-0015, dan catatan pembaruan di ADR-0025. Readiness media terkelola mengikuti profil deployment/storage #262 (`src/lib/deployment/storage-profile.ts`, ADR-0027) — tidak ada definisi profil baru.
