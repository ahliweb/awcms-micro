---
"awcms-micro": patch
---

Tambah gate aksesibilitas untuk permukaan penemuan publik dan perintah pemeriksa tautan operator (Issue #296).

`tests/e2e/public-discovery-a11y.e2e.ts` menjalankan axe-core (WCAG 2.2 A/AA, gagal pada critical/serious) atas halaman daftar (`/news`, `/blog/{tenantCode}`), halaman pencarian (`/news/search`, `/blog/{tenantCode}/search`, dan keempat cabang render `/search`: belum ada query, terlalu pendek, tanpa hasil, ada hasil), serta dokumen 404 publik bersama — dalam EN dan ID, pada viewport desktop dan ponsel, ditambah pemeriksaan bahwa form pencarian bisa dioperasikan hanya dengan keyboard.

`bun run link:check -- --url=<url>` (`scripts/link-check.ts`) merayapi situs yang sudah dirender dari sebuah URL awal — ditambah `robots.txt` `Sitemap:` dan sitemap index/anak — lalu memverifikasi setiap anchor internal, `rel=canonical`, `rel=alternate hreflang`, tautan feed, dan pagination benar-benar terselesaikan. Laporan JSON ke stdout (`--json-output=` untuk artefak bukti); exit 0 bersih, 1 ada tautan rusak, 2 usage error atau URL awal sendiri tak terjangkau.

Hanya menambah test, skrip, dan dokumentasi — tidak ada perubahan perilaku aplikasi.
