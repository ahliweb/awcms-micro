---
name: awcms-micro-ui-screen
description: Implementasikan layar/komponen UI AWCMS-Micro sesuai design system. Gunakan saat membangun halaman admin/POS/portal, komponen UI, island interaktif, atau memasang design token/theme. Menegakkan token doc 14, state pattern, a11y AA, i18n, dan aturan offline-first doc 15.
---

# AWCMS-Micro — UI Screen / Component

Ikuti **`docs/awcms-micro/14_ui_ux_design_system.md`** (token, komponen, layout, layar) dan **`docs/awcms-micro/15_frontend_architecture_integration.md`** (SSR/islands, API client, offline).

## Checklist implementasi layar

1. **Token dulu** — pakai CSS variables doc 14 (`--color-*`, `--sp-*`, `--fs-*`, termasuk `--color-primary-strong`/`--color-success-strong`/`--color-danger-strong` untuk teks putih di atas warna solid, Issue #434 — semua ≥4.5:1 terukur, jangan pakai varian polos untuk itu; `--color-warning-strong`/`--color-info-strong` untuk teks/ikon amber/info di atas surface/tint terang, #314; `--color-scrim` untuk backdrop dialog/drawer). Jangan hardcode warna/ukuran. Theme via `data-theme` tanpa flash — **halaman yang meng-import `tokens.css` WAJIB juga menjalankan `THEME_INIT_SCRIPT_BODY`**, kalau tidak override `[data-theme="dark"]` tak pernah berlaku dan halaman light-only walau OS dark (fix login #313).
   **Motion (overhaul #311–#316)**: jangan pernah hardcode `transition`/`animation` mentah — pakai token `--dur-fast/base/slow` + `--ease-standard/decelerate/accelerate/spring` + primitif `--transition-colors/transform/opacity`; helper opt-in `.awcms-animate-fade/slide-up/scale-in`; skeleton pakai primitive `.awcms-skeleton` (bukan spinner). Semua ini sudah reduced-motion-safe lewat guard global di `tokens.css`. **Surface admin yang di-scan a11y E2E: entrance HARUS transform-only** (translateY, `opacity` tetap 1) — entrance `opacity:0→1` membuat axe menangkap teks mid-fade sebagai `color-contrast` fail (fix #314, lihat `.dash-rise` di `src/pages/admin/index.astro`).
2. **Komponen dari library** — Button/FormField/DataGrid/Dialog dst. dari `src/components/ui`; jangan duplikasi. Untuk state akses-ditolak/gagal-sementara pakai `StateNotice.astro` (`src/components/ui`, Issue #434) — jangan bikin blok `.permission-denied` ad-hoc baru. Untuk list/tabel besar pakai `DataTable.astro` + `Pagination.astro` + `FilterBar.astro` (Issue #693) alih-alih `<table>`/`.table-scroll` hand-rolled; untuk banner sukses/error pasca-mutation pakai `ActionBanner.astro` (kompatibel langsung dengan `showBanner()` yang sudah ada); untuk status lifecycle pakai `StatusBadge.astro`; untuk label+input+error pakai `FormField.astro`. Untuk konfirmasi aksi destruktif **jangan pernah** `window.confirm`/`window.prompt` — pakai `ConfirmDialog.astro` + `src/lib/ui/confirm-dialog-client.ts`'s `openConfirmDialog()` (native `<dialog>`, focus trap + Esc-close bawaan browser, opsional field alasan wajib). Contoh migrasi nyata: `src/pages/admin/access-users.astro` dan `src/pages/admin/tenant/domains.astro` (lihat doc 14 §Migrated reference pages).
3. **State pattern wajib** — loading (skeleton), empty (+CTA), error (`StateNotice.astro` — bedakan "akses ditolak" dari "gagal sementara, coba lagi", pesan aman ter-i18n dari error code doc 05), success/submitting.
4. **Island seperlunya** — halaman SSR; interaktivitas hanya di island (POS, form, chat). Data awal via SSR, mutation via API client.
5. **Form/mutation client-side** — pakai `submitJson`/`showBanner`/`lockElement`/`reloadAfterDelay` (`src/lib/ui/admin-form-client.ts`, Issue #434) untuk form/tombol mutation di halaman admin — `lockElement` mencegah double-submit (`disabled`+`aria-busy` selama request, kembali ke semula termasuk saat gagal); jangan duplikasi implementasi `submitJson`/banner per halaman, dan jangan `fetch` mentah.
6. **Navigasi role-aware** — filter menu dari permission `GET /auth/me`; backend tetap validasi (UI hiding bukan kontrol).
7. **i18n** — lihat skill `awcms-micro-i18n` (katalog `.po` gettext, resolusi locale via middleware, formatter locale-aware, `LanguageSwitcher.astro`) — string UI statis **selalu** lewat `t("namespace.key")`, tidak pernah hardcode, termasuk komponen kecil (theme toggle, skip-link, dst. — Issue #434 menemukan `ThemeToggle.astro` lolos ekstraksi awal karena PR i18n tidak menyentuhnya).
8. **A11y (WCAG 2.1 AA)** — kontras ≥4.5:1, fokus terlihat, label eksplisit, dialog trap fokus + Esc, target sentuh ≥44px (mobile), status tidak hanya warna. Skip-link keyboard di layout admin (`AdminLayout.astro`, Issue #434). Sidebar admin responsif (Issue #693): di bawah `--bp-md` jadi off-canvas drawer dengan toggle `aria-expanded`/`aria-controls`, scrim penutup, `Esc` menutup + fokus kembali ke toggle, fokus pindah ke drawer saat dibuka, dan sisa halaman di-`inert`-kan selama drawer terbuka — jangan bangun drawer/dialog baru tanpa pola setara (lihat komentar `<script>` `AdminLayout.astro`).
9. **Masking** — data sensitif tampil lewat `MaskedText`; jangan cache PII mentah di IndexedDB.
10. **POS khusus** — keyboard map F1–F10 (doc 14), cart optimistic dengan rollback, offline outbox + `SyncIndicator` (doc 15).
11. **Tabel lebar** — bungkus dengan container scroll (`overflow-x: auto`), jangan biarkan tabel memaksa scroll horizontal seluruh halaman (Issue #434) — `DataTable.astro` sudah menyediakan ini secara default.
12. **Kontrol capability-gated (Issue #693)** — jangan pernah render kontrol interaktif (dropdown, tombol) yang secara visual menyiratkan sebuah aksi/kapabilitas lalu men-`disabled`-kannya di client sebagai satu-satunya penjaga (contoh nyata: `TenantBadge.astro` menggantikan `TenantSwitcher.astro` yang dulu begitu). Kalau kapabilitasnya memang tidak ada untuk siapapun hari ini, jangan render bentuk kontrolnya sama sekali — render badge/teks statis. Kalau kapabilitasnya BISA ada untuk sebagian user, computed data (daftar opsi, izin) harus datang dari server berdasarkan otorisasi nyata, bukan flag/state klien; dan endpoint tujuan aksi tetap harus menolak permintaan dari user yang tidak berwenang meski UI-nya "kebetulan" tidak disembunyikan (defense-in-depth, backend adalah penegak sesungguhnya).

13. **Surface publik CSS-less (raw-HTML `.ts` route, overhaul #312)** — halaman yang dirender sebagai string HTML mentah dari route `.ts` (mis. blog/news publik via `blog-content/domain/public-page-rendering.ts`'s `renderPublicPageShell()`) TIDAK terkena CSP style-hasher Astro; CSP `default-src 'self'` memblokir `<style>` inline & atribut `style=`. Styling HANYA lewat stylesheet eksternal same-origin `public/css/public-content.css` (self-contained: token `--pc-*` + nama `--dur-*`/`--ease-*` identik `tokens.css` + guard reduced-motion sendiri, mobile-first). Jangan tambah `<style>`/`style=` inline ke jalur ini — extend `public-content.css`.

## Wireframe & inventory

Layout shell (admin/POS/portal) dan tabel route→persona→API ada di doc 14 §Screen inventory — patuhi route dan komponen utamanya.

## Verifikasi

- Render 4 state (loading/empty/error/ready) dapat didemokan.
- Keyboard-only pass untuk POS; axe/kontras pass untuk AA.
- Tidak ada string hardcode; tidak ada warna literal; tidak ada `fetch` mentah.
- Offline: buka layar POS tanpa jaringan → tetap operasional, antrean terlihat.
- Layar admin baru/dimigrasikan: layout diverifikasi di 320/360px, tablet, desktop, zoom 200%, dan keyboard-only (Issue #693); smoke test aksesibilitas otomatis (`@axe-core/playwright`, lihat `tests/e2e/admin-a11y-smoke.e2e.ts`) tidak menemukan pelanggaran critical/serious. **A11y E2E berjalan di viewport lebar — bug mobile-only lolos CI**; jalankan pass headless login+`/admin` di 360px (light+dark) sebelum menyatakan selesai (fix overflow topbar + focusable table #315).
- Motion: verifikasi `prefers-reduced-motion: reduce` menetralkan animasi, dan entrance surface admin transform-only (tidak ada teks mid-fade yang bikin axe `color-contrast` fail).

## Skill terkait

`awcms-micro-new-endpoint` (kontrak API), `awcms-micro-i18n` (katalog `.po`, locale, formatter), `awcms-micro-sensitive-data` (masking), `awcms-micro-testing` (render/state test), `awcms-micro-browser-test` (E2E Playwright + smoke aksesibilitas otomatis), `awcms-micro-ux-review` (audit layar yang sudah ada), `awcms-micro-wizard-form` (form multi-step — identitas/detail/lampiran/review sebelum submit).
