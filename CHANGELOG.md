# Changelog

Seluruh perubahan penting AWCMS-Micro dicatat di berkas ini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/), dan
proyek ini memakai [Semantic Versioning](https://semver.org/lang/id/). Berkas ini
dikelola lewat [Changesets](.changeset/README.md) — jangan sunting bagian versi
secara manual; tambahkan changeset di setiap PR yang mengubah perilaku, lalu
`bun run changeset:version` yang menuliskannya ke sini (doc 09 §Versioning).

## Riwayat versi sebelum 0.2.0

Rilis terakhir garis keturunan lama AWCMS-Micro adalah tag **`0.1.32`** — basis
kode `emdash` (Astro + pnpm + Cloudflare Workers/D1) yang **dihapus seluruhnya**
pada commit `1b7e6b6`. CHANGELOG era itu tidak dibawa: ia mendeskripsikan produk
yang tidak lagi ada di repositori ini, dan menyambungnya ke riwayat baru akan
menyesatkan pembaca yang menelusuri sebuah versi ke belakang. Riwayatnya tetap
utuh di git dan di 177 issue GitHub berlabel `deprecated`.

Karena itu penomoran dilanjutkan dari `0.1.32` ke **`0.2.0`**, bukan direset ke
`0.1.0` (mundur) dan bukan mengikuti `0.24.0` milik upstream `awcms-mini` (nomor
itu milik riwayat rilis repositori lain — lihat ADR-0025). Dalam SemVer 0.x, bump
minor adalah sinyal breaking change yang tepat untuk penggantian basis kode total.

## [0.2.0] — belum dirilis

Refaktor penuh: AWCMS-Micro dibangun ulang sebagai **turunan scope website** dari
standar [`ahliweb/awcms-mini`](https://github.com/ahliweb/awcms-mini), sejajar
dengan `ahliweb/awcms` yang turunan scope ERP. Keputusan lengkap beserta alasan,
konsekuensi, dan alternatif yang ditolak ada di
[ADR-0025](docs/adr/0025-website-scope-derivation-from-awcms-mini.md).

### Ditambahkan

- Fondasi standar AWCMS-Mini secara utuh: modular monolith Bun + Astro 7 SSR +
  PostgreSQL dengan RLS, chokepoint tunggal `withTenant()`, RBAC/ABAC default-deny
  lewat `authorizeInTransaction()` di dalam transaksi yang sama, audit trail
  ber-redaksi, correlation ID, structured logging, metrics port, work-class
  backpressure + circuit breaker, dan migration runner ber-checksum + advisory lock.
- Registry **16 modul** scope website — fondasi (`tenant_admin`, `profile_identity`,
  `identity_access`, `logging`, `module_management`), layanan platform
  (`sync_storage`, `domain_event_runtime`, `data_lifecycle`, `reporting`, `email`,
  `form_drafts`), dan website (`tenant_domain`, `blog_content`, `news_portal`,
  `social_publishing`, `visitor_analytics`).
- Kontrak OpenAPI (ber-fragment + bundler) dan AsyncAPI, keduanya diverifikasi
  parity dua arah terhadap route dan registry event.
- Rantai gate CI `bun run check` (20 gate berurutan) termasuk typecheck, 2.955
  test, dan build.
- [ADR-0025](docs/adr/0025-website-scope-derivation-from-awcms-mini.md) — rekaman
  keputusan scope, termasuk aturan turunan "pemangkasan harus tuntas sampai
  artefak generated + gate CI".

### Dihapus

- Seluruh basis kode `emdash` sebelumnya (Astro + pnpm + Cloudflare Workers/D1),
  termasuk konfigurasi wrangler dan GitHub Actions era itu.
- Tujuh modul scope ERP milik upstream yang **tidak diport** (ADR-0025 §3):
  `workflow`, `organization_structure`, `document_infrastructure`, `data_exchange`,
  `integration_hub`, `reference_data`, `idn_admin_regions` — beserta migrasi,
  route, permission seed, channel AsyncAPI, fragment OpenAPI, kunci i18n, dan
  entri registry work-class miliknya.

### Diperbaiki

- **Generic idempotency store dipertahankan saat `workflow` dipangkas.** Di upstream
  `awcms_mini_idempotency_keys` lahir di dalam migrasi `workflow` semata-mata karena
  workflow decision kebetulan endpoint pertama yang butuh `Idempotency-Key` — padahal
  store itu infrastruktur bersama yang dipakai `_shared/idempotency.ts` untuk setiap
  mutation high-risk. Migrasi `012` ditulis ulang memuat store itu saja
  (`012_awcms_micro_idempotency_store_schema.sql`), dengan test regresi yang
  memastikan ia bertahan independen dari workflow.
- **`THEME_INIT_SCRIPT_HASH` dihitung ulang.** Body script berubah oleh rename
  (`awcms_micro_theme`), sehingga hash CSP warisan tidak lagi cocok. Membawanya apa
  adanya akan membuat CSP memblokir script anti-flash tema — diam-diam, dan hanya di
  browser sungguhan.

### Catatan

- Utang dokumentasi yang diakui: sebagian `docs/awcms-micro/` masih diselaraskan
  dengan registry 16 modul. Sampai tuntas, **`src/`, `sql/`, dan gate CI adalah
  sumber kebenaran** (ADR-0025 §Konsekuensi, AGENTS.md §Sumber kebenaran).
