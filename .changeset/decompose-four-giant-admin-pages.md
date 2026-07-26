---
"awcms-micro": patch
---

Empat halaman admin terbesar yang punya jaring pengaman Playwright dipecah
di bawah 400 baris, dan enam primitive UI baru diekstrak dari pola yang
benar-benar diukur — bukan ditebak (Issue #372).

Yang membengkak di 51 halaman `.astro` bukan frontmatter-nya, melainkan
skrip inline dan template yang menyusul. Tiga gerakan mekanis per halaman:

- **Skrip inline → modul `.ts`** di `src/modules/<modul>/presentation/`
  (ADR-0038). 1.263 baris kode browser yang selama ini tak terlihat oleh
  `tsc` maupun test apa pun sekarang ikut type-check, dan cabang
  penanganan errornya punya unit test: fallback konfigurasi rusak di
  dashboard analytics, agregasi error/empty tiga request ringkasan, cabang
  gagal request sesi, pengecekan bentuk hostname, dua predikat XOR sumber
  rahasia provider SSO, penjaga break-glass, dan cabang gagal mutation
  bersama (48 test baru).
- **Frontmatter → `presentation/<page>-page-data.ts`.** Blob
  `clientStrings` sekarang diketik dengan interface milik modul kliennya
  sendiri, jadi `tsc` gagal kalau kedua sisi melenceng.
- **Ekstraksi komponen berdasarkan pengukuran**: `ClientJsonData` (35 dari
  51 halaman), `LoadErrorNotice` (38), `TextField` (27), `SelectField`
  (31), `FieldHint` (18), `CheckboxField`/`CheckboxGroup` (16).
  `DataTable` mendapat prop `columns` dan `dataRole`; `ConfirmDialog`
  membuat `confirmLabel`/`cancelLabel` opsional — yang sekaligus
  memperbaiki `admin/registrations.astro`, satu-satunya pemanggil yang
  tidak mengirim keduanya dan merender dua tombol tanpa teks
  (`bun run typecheck` adalah `tsc --noEmit`, yang tidak pernah membaca
  `.astro`).

Hasil: `admin/access-users` 1005→397, `admin/analytics` 1123→380,
`admin/security` 1069→399, `admin/tenant/domains` 1045→371. Keempat
spesifikasi E2E-nya lulus tanpa disunting.

Dua perbaikan ikutan yang ditemukan saat memindahkan kode:
`admin/tenant/domains` memanggil `withTenant` tanpa
`unavailableBehavior: "throw"` (fallback 503 `Response` bisa bocor ke nilai
SSR, kelas insiden PR #323), dan tiga rule CSS element-level halaman itu
dijangkarkan ke `.domain-manager` agar tidak merembes keluar setelah
stylesheet-nya berhenti di-scope Astro.
