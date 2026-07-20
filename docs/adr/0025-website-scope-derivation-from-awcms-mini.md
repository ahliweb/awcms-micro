# ADR-0025 — AWCMS-Micro sebagai turunan scope WEBSITE dari standar AWCMS-Mini

- **Status:** Accepted
- **Catatan (2026-07-21):** framing "**turunan** scope website dari awcms-mini" di-**supersede sebagian** oleh [ADR-0034](0034-template-repositioning-online-store-scope-and-derived-app-deprecation.md) — repo diposisikan ulang sebagai **TEMPLATE full-online website dipakai LANGSUNG** (asal-usul dari mini = warisan historis), scope membentang hingga **toko online / e-commerce**, **POS in-store tetap dikecualikan**. Scope teknis, daftar modul, dan aturan "pemangkasan tuntas sampai gate CI" di ADR ini TETAP berlaku.
- **Tanggal:** 2026-07-17
- **Pengambil keputusan:** @ahliweb
- **Terkait:** ADR-0001 (modular monolith), ADR-0011 (capability ports), ADR-0012 (module admission & trusted registry boundary), ADR-0013 (extension layers & boundary model), ADR-0014 (deterministic build-time module composition), ADR-0016–ADR-0021 (admission modul ERP di upstream — **tidak diport**, lihat §3), repositori upstream `ahliweb/awcms-mini`, repositori sibling `ahliweb/awcms`

## Konteks

Repositori ini sebelumnya berisi basis kode lain (workspace `emdash`, Astro + pnpm + Cloudflare Workers/D1). Isi itu dihapus seluruhnya untuk refaktor penuh. Keputusan yang perlu direkam: **di atas apa awcms-micro dibangun, dan sampai mana batas scope-nya.**

Keluarga AWCMS sudah punya pola organisasi yang mapan, dan pola itu diikuti di sini — bukan diciptakan baru:

- **`awcms-mini`** adalah **basis standar** — modular monolith Bun + Astro 7 + PostgreSQL RLS yang lengkap dan matang (16+ modul, 76 migrasi, ~90 route API, 57 halaman admin, i18n gettext, 22 ADR). Deskripsi `package.json`-nya masih menyebut "foundation skeleton"; itu sudah usang — AGENTS.md-nya sendiri menyatakan basis ini **complete**.
- **`awcms`** adalah **turunan scope ERP** dari mini. AGENTS.md-nya mengikat: _"AWCMS adalah rebuild ber-skop ERP di atas fondasi awcms-mini. Setiap penambahan/perubahan fitur diuji lebih dulu di awcms-mini, baru di-port ke repo ini — repo ini bukan tempat merintis fitur dari nol."_

**`awcms-micro` mengambil posisi ketiga yang sejajar: turunan scope WEBSITE dari standar yang sama.** Bukan fork liar, bukan basis tandingan.

Pelajaran penting diambil dari repo `awcms`, dan sengaja dihindari di sini. Audit atas repo itu menemukan **documentation drift** yang parah: `docs/ARCHITECTURE.md`-nya ~6 modul basi; ADR-0013-nya masih mendaftar 16 modul milik mini (`blog_content`, `news_portal`, dst) yang tidak ada di sana; `capability-contract-versions.ts`-nya memversi capability yang tak satu pun modulnya ada; `CONTRIBUTING.md`-nya menyuruh `docker compose up -d db` padahal tak ada file compose; dan komentar `client.ts`-nya merujuk `sql/045_awcms_db_role_separation.sql` yang **tidak pernah ada**. Akar masalahnya sama: dokumen, skill, bahkan komentar sumber di-copy massal dari mini **mendahului** kode.

Karena itu ADR ini menetapkan aturan turunannya sendiri di §5: **pemangkasan harus tuntas sampai ke artefak yang di-generate dan gate CI, bukan berhenti di direktori modul.**

## Keputusan

### 1. Basis, runtime, dan konvensi

awcms-micro **mengadopsi utuh standar AWCMS-Mini**, tanpa pengecualian:

- **Bun-only** (ADR-0002), Astro 7 SSR via `@astrojs/node` standalone, dijalankan `bun ./dist/server/entry.mjs`. Target deployment: Bun + PostgreSQL + Docker — **bukan** Cloudflare Workers/D1 seperti isi repo yang lama.
- **PostgreSQL + RLS wajib** untuk setiap tabel tenant-scoped (ADR-0003), lewat chokepoint tunggal `withTenant()`.
- **RBAC + ABAC default-deny** (ADR-0004) lewat `authorizeInTransaction()` **di dalam** transaksi `withTenant` — ABAC dan RLS berlapis, bukan saling menggantikan.
- Soft delete & immutability (ADR-0005), kontrak OpenAPI/AsyncAPI (ADR-0007), capability ports (ADR-0011), registry statis tepercaya (ADR-0012), lapisan ekstensi (ADR-0013), komposisi build-time (ADR-0014), manifest kompatibilitas turunan (ADR-0015) — **semua tetap berlaku apa adanya.**
- Prefix tabel `awcms_micro_*`, migrasi `NNN_awcms_micro_<area>_<desc>.sql`, cookie `awcms_micro_session`.

### 2. Scope: full online website

Scope awcms-micro adalah **website online penuh** — bukan ERP, bukan POS. Registry base berisi **16 modul**:

| Lapis            | Modul                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------- |
| Fondasi          | `tenant_admin`, `profile_identity`, `identity_access`, `logging`, `module_management`         |
| Layanan platform | `sync_storage`, `domain_event_runtime`, `data_lifecycle`, `reporting`, `email`, `form_drafts` |
| Website          | `tenant_domain`, `blog_content`, `news_portal`, `social_publishing`, `visitor_analytics`      |

`visitor_analytics` **termasuk scope inti**, bukan opsional — sebuah website online tanpa pengukuran pengunjung tidak lengkap. Ia membawa serta `reporting` sebagai dependency terdeklarasi (proyeksi/rollup), dan `reporting` membawa `sync_storage` + `email`.

`sync_storage` dipertahankan bukan karena sync LAN node-to-node (itu bukan scope website), melainkan karena **object queue**-nya adalah jalur unggah media ke R2/S3 — pola CLAIM/UPLOAD/FINALIZE 3-fase yang tidak pernah memanggil provider di dalam transaksi DB (ADR-0006).

### 3. Modul yang TIDAK diport

Tujuh modul scope ERP milik upstream **tidak** diport:

`workflow` · `organization_structure` · `document_infrastructure` · `data_exchange` · `integration_hub` · `reference_data` · `idn_admin_regions`

Pemangkasan ini **clean cut, bukan penulisan ulang**: tidak satu pun modul yang dipertahankan mendeklarasikan `dependencies` maupun capability **REQUIRED** pada ketujuhnya. Satu-satunya konsumsi lintas batas — `identity_access` → `organization_hierarchy_resolution` — sudah `optional: true` sejak upstream, jadi resolusi business-scope cukup jatuh ke adaptor flat milik `identity_access` sendiri; seam-nya tetap ada di route composition root untuk aplikasi turunan yang mau memasang provider hierarki sungguhan.

Konsekuensinya, ADR berikut **tidak berlaku di repositori ini** dan dipertahankan hanya sebagai rujukan historis upstream: **ADR-0016** (`organization_structure`), **ADR-0017** (`document_infrastructure`), **ADR-0018** (`data_exchange`), **ADR-0019** (`integration_hub`), **ADR-0020** (kontrak kesiapan ekstensi ERP), **ADR-0021** (`reference_data`).

Satu pengecualian penting yang **bukan** modul: **generic idempotency store** (`awcms_micro_idempotency_keys`). Di upstream ia lahir di dalam `012_awcms_mini_workflow_approval_schema.sql` semata-mata karena "workflow decision" kebetulan endpoint pertama di sana yang butuh `Idempotency-Key`. Store itu **infrastruktur bersama**, bukan milik workflow — `_shared/idempotency.ts` mengeksposnya ke setiap mutation high-risk, dan modul yang kita pertahankan sudah bergantung padanya. Maka migrasi 012 ditulis ulang memuat **store itu saja**, di bawah nama yang jujur (`012_awcms_micro_idempotency_store_schema.sql`), sementara empat tabel workflow dan seed permission `workflow.approval.*` ditinggalkan.

### 4. Penomoran migrasi: gap dipertahankan, bukan dirapikan

Nomor migrasi upstream **dipertahankan apa adanya, lengkap dengan gap** (012 dipakai ulang; gap di 048/054/060/063–068/071–076 adalah jejak modul yang tidak diport).

Menomori ulang dari 001 sempat dipertimbangkan dan **ditolak**: `scripts/db-migrate.ts` mengurutkan **leksikografis** dan hanya memvalidasi pola nama — kontiguitas tidak pernah disyaratkan. Sebaliknya, menomori ulang akan **memalsukan ratusan rujukan silang** ("migration 037", "sql/026") yang tersebar di komentar sumber, README modul, dan dokumen. Gap justru informatif: ia catatan jujur tentang apa yang sengaja tidak dibawa, dan menjaga riwayat migrasi kedua repo tetap terbaca berdampingan saat porting perubahan upstream di masa depan.

### 5. Aturan turunan: pemangkasan harus tuntas sampai gate

Pelajaran dari drift di repo `awcms` (lihat §Konteks) diangkat jadi aturan mengikat. Menghapus sebuah modul **belum selesai** saat direktorinya hilang. Yang wajib ikut dibereskan, dan semuanya sudah dikerjakan pada refaktor ini:

1. **Migrasi SQL** — termasuk statement `ALTER TABLE ... FORCE ROW LEVEL SECURITY` atas tabel yang tak lagi ada (itu kegagalan migrasi keras, bukan no-op), dan tabel infrastruktur yang menumpang di migrasi modul terpangkas (§3).
2. **Registry event** (`DOMAIN_EVENT_TYPE_REGISTRY`) + **channel AsyncAPI** — parity dua arah ditegakkan test; katalog tak boleh memuat event yang tak satu pun modulnya bisa publish.
3. **Fragment + tag OpenAPI**, dan **allow-list operasi publik** di `api-spec-check.ts` — allow-list unauthenticated-by-design adalah tempat terakhir yang boleh menyimpan entri basi.
4. **Katalog i18n** (`en.po`/`id.po`/`messages.pot`) — 464 kunci obsolet dihapus.
5. **Registry work-class**, **preset modul**, **registry config + `.env.example` + doc 18** — ketiganya punya gate sinkronisasi sendiri.
6. **Allow-list RLS-exempt** di generator inventaris — exemption untuk tabel yang tak pernah dibuat bukan sisa tak berbahaya: generator merendernya sebagai "(not found in sql/ — stale entry, review)", dan noise itu melatih pembaca mengabaikan penanda yang justru dirancang menangkap kesalahan RLS sungguhan.
7. **Hash CSP** `THEME_INIT_SCRIPT_HASH` — wajib dihitung ulang karena body script berubah oleh rename (`awcms_micro_theme`). Membawa hash lama akan membuat CSP memblokir script anti-flash tema — diam-diam, dan hanya di browser sungguhan.

**Gate CI adalah spesifikasi yang mengikat, bukan formalitas.** `bun run check` (20 gate berurutan) harus hijau penuh sebelum PR dibuka — bukan subset.

### 6. Modul website baru

Scope website menuntut modul yang belum ada di upstream: **media library**, **SEO/distribusi** (sitemap, RSS, canonical/OG, JSON-LD, redirect), **theming/template**, **site search**, **comments**, dan **newsletter**. Semuanya akan diadmisi lewat jalur normal ADR-0012/§21 module admission governance — satu ADR admission per modul, sebelum baris kode pertamanya ditulis. Modul-modul itu **belum ada** pada ADR ini.

> **Pembaruan (pasca ADR ini):** premis "media library belum ada" ternyata keliru — registry media generik sudah hidup di dalam `news_portal`. **ADR-0026** (2026-07-17) mengoreksinya dan mengadmisi **`media_library`** lewat EKSTRAKSI (bukan implementasi baru); modul itu kini `active` dan memiliki registry media. SEO/distribusi, theming/template, site search, comments, dan newsletter masih menunggu ADR admission masing-masing.

## Konsekuensi

**Positif.** Seluruh disiplin yang membuat standar mini nyata — chokepoint `withTenant`+ABAC, RLS 129 policy, migration runner ber-checksum + advisory lock, tiga gate boundary modul, kontrak OpenAPI/AsyncAPI, release engineering ber-SBOM/cosign — berlaku sejak commit pertama, bukan sesuatu yang harus dibangun ulang. Registry lebih kecil (17 vs 23 — `media_library` diadmisi kemudian lewat ADR-0026) berarti permukaan serang dan beban rawat lebih kecil.

**Negatif / utang yang diakui — DISELESAIKAN oleh Issue #263 (epic #261).** Refaktor awal ADR ini belum merapikan seluruh paket dokumen `docs/awcms-micro/` (dokumen 04, 08, 20, 21, dan lainnya masih memuat modul ERP yang tidak diport). Utang itu kini **selesai**: Issue #263 merekonsiliasi seluruh dokumen aktif — arsitektur (01/02/03/05/06/09/10/11), ERD/data dictionary (04), SOP (08), threat model (20), module admission governance (21, termasuk contoh admission WEBSITE: SEO, theming, search, comments, newsletter), traceability (13), README/AGENTS/CONTRIBUTING, `.claude/skills/`, ADR 0008/0012/0013 (catatan currency), README modul, kontrak OpenAPI/AsyncAPI, dan inventori generated — ke registry WEBSITE **17 modul**; setiap rujukan aktif ke tujuh modul ERP dihapus atau ditandai historis, dan hitungan modul/tabel/endpoint/event/job dicocokkan ke sumber generated. Sebuah gate baru, **`bun run scope:consistency:check`** (`scripts/scope-consistency-check.ts`, dalam rantai `check` + unit test `tests/unit/scope-consistency-check.test.ts`), sekarang **GAGAL** bila salah satu modul excluded muncul lagi di registry/kontrak/inventori aktif, atau bila hitungan modul menyimpang dari 17. Materi perbandingan upstream hanya bertahan di seksi yang jelas berlabel historis (mis. banner "tidak berlaku di repositori ini" pada ADR-0016–0021). `src/`, `sql/`, dan gate CI tetap sumber kebenaran; kini `docs/awcms-micro/` selaras dengannya.

**Netral.** Kedekatan dengan upstream sengaja dijaga (nomor migrasi, struktur modul, nama gate) supaya porting perbaikan dari mini tetap murah. Konsekuensinya, komentar dan dokumen di repo ini sering merujuk upstream secara eksplisit — itu disengaja: rujukan yang jujur ke asal keputusan lebih baik daripada komentar yatim yang kehilangan konteksnya.

## Alternatif yang ditolak

- **Full copy mini lalu pangkas bertahap.** Ditolak: bagasi ERP akan hidup berdampingan dengan scope website tanpa batas waktu, dan setiap gate CI akan hijau atas modul yang tak seorang pun rawat.
- **Bangun modul website dari nol di atas fondasi saja.** Ditolak: `blog_content` (0.9.0), `news_portal` (0.4.0), `social_publishing`, `visitor_analytics`, dan `tenant_domain` di upstream sudah matang, ber-CRUD penuh, ber-admin-UI, dan ber-test — menulis ulang berarti membuang aset dan mengulang bug yang sudah diperbaiki.
- **Tetap di Cloudflare Workers/D1** (stack repo yang lama). Ditolak: RLS PostgreSQL, `withTenant`, work-class backpressure, dan sebagian besar `src/lib` tidak portable ke sana — praktis membuang seluruh fondasi yang justru jadi alasan mengadopsi standar ini.
- **Menomori ulang migrasi dari 001.** Ditolak — lihat §4.
