# Bagian 19 — Glossary dan Terminologi

> **Contoh domain (ilustratif).** Dokumen ini memakai domain **website / toko online** sebagai contoh berjalan — sesuai posisi AWCMS-Micro sebagai **template full-online website yang dipakai langsung** ([ADR-0034](../adr/0034-template-repositioning-online-store-scope-and-derived-app-deprecation.md)). **Pola & standar**-nya reusable; **entitas, endpoint, layar, dan istilah domain** (katalog, pesanan online, checkout, konten) diisi/disesuaikan **langsung di repo ini**. Contoh yang menyentuh **POS in-store, gudang, atau Coretax** adalah **lineage ERP `awcms` (dikecualikan)**, bukan scope base ini. Lihat [README paket dokumen](README.md) §"AWCMS-Micro sebagai standar pengembangan".

## Tujuan

Dokumen ini menjadi rujukan istilah AWCMS-Micro agar seluruh paket dokumen (01–18) dan implementasi memakai definisi yang sama. Istilah dikelompokkan: arsitektur, keamanan/akses, toko online & inventory, konten & engagement, sync/offline, database, dan frontend/UI. Istilah warehouse dan pajak/Coretax dipertahankan sebagai rujukan **lineage ERP `awcms` (dikecualikan, ADR-0034 §3)**.

## Peta konsep inti

```mermaid
flowchart LR
  Tenant[Tenant] --> Office[Office]
  Tenant --> User[Tenant User] --> Role --> Perm[Permission]
  User --> ABAC
  Tenant --> Content[Konten: Blog / News / Media]
  Content --> Comments[Komentar]
  Content --> Newsletter
  Office --> Stock[Ketersediaan] --> Movement[Stock Movement]
  Checkout[Checkout online] --> SalesDoc[Pesanan Online] --> Confirm[Konfirmasi Pesanan]
  SalesDoc --> Outbox --> Sync
```

## Arsitektur

| Istilah                           | Definisi                                                                                                                          |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **AWCMS-Micro**                   | Standar aplikasi modular monolith yang dirancang paket dokumen ini.                                                               |
| **Modular monolith**              | Satu aplikasi yang dibagi menjadi modul berbatas jelas, siap dipecah ke microservice bila perlu, tetapi tidak dipisah sejak awal. |
| **Module descriptor**             | Metadata modul (`module.ts`): key, versi, dependency, path OpenAPI/AsyncAPI, event publish/subscribe.                             |
| **Offline-first / LAN-first**     | Prinsip bahwa sistem berjalan penuh di jaringan lokal tanpa internet; internet hanya untuk sync/provider opsional.                |
| **Domain event**                  | Fakta bisnis yang sudah terjadi (mis. `sales.transaction.posted`), dikirim via envelope AsyncAPI.                                 |
| **Envelope**                      | Struktur pembungkus standar event (eventId, eventType, tenantId, payload, metadata).                                              |
| **OpenAPI**                       | Kontrak REST API. **AsyncAPI**                                                                                                    | Kontrak domain event. |
| **Correlation ID / Causation ID** | ID untuk menelusuri satu request lintas log/event; causation menghubungkan event ke event pemicunya.                              |

## Arsitektur ekstensi (epic #738)

> Sumber kebenaran lengkap: `docs/adr/0013-extension-layers-and-boundary-model.md`. Tabel di bawah hanya rangkuman rujukan cepat.

| Istilah                                    | Definisi                                                                                                                                                                                                                                              |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tenant**                                 | Unit isolasi data & langganan platform (`awcms_micro_tenants`) — **batas keamanan (RLS)**, satu tenant = satu dataset terisolasi. Tidak pernah dilemahkan oleh legal entity/organization unit.                                                        |
| **Legal entity**                           | Badan hukum/usaha di **dalam** satu tenant (mis. satu PT/CV dalam grup usaha) — batas bisnis/akuntansi, bukan batas keamanan. Kandidat primitif Official Optional Business Foundation, belum diimplementasikan (Wave 2 epic #738).                    |
| **Organization unit**                      | Subdivisi bisnis (departemen/cabang/cost center) di dalam legal entity/tenant — batas bisnis/akuntansi/workflow, berbeda dari `awcms_micro_offices` (register lokasi fisik yang sudah ada).                                                           |
| **Profile / Party**                        | Entitas kanonis (orang/organisasi) yang dikenal platform, dimiliki `profile_identity` (Core) — lapisan lain mereferensikan lewat `profile_entity_links`/capability port, tidak membuat registry sendiri.                                              |
| **Business-role**                          | Kapasitas fungsional seorang profile/party di dalam legal entity/organization unit (mis. approver) untuk segregation-of-duties/workflow — berbeda dari RBAC **Role** (permission sistem). Belum diimplementasikan (Wave 2).                           |
| **Service catalog**                        | Paket/fitur/tier yang **operator platform** jual ke tenant — dimiliki lapisan SaaS Control Plane. Tidak boleh disamakan dengan item/product master ERP.                                                                                               |
| **Subscription billing**                   | Penagihan tenant untuk pemakaian platform (invoice langganan, metering, entitlement) — dimiliki SaaS Control Plane. Tidak boleh disamakan dengan general ledger/AR-AP tenant.                                                                         |
| **Operational ledger / accounting ledger** | General ledger, AR/AP, dan pembukuan operasional internal tenant sendiri — dimiliki lapisan ERP Extension, terpisah tegas dari subscription billing SaaS Control Plane.                                                                               |
| **Extension layer**                        | Salah satu dari enam lapisan target: Core, System Foundation, Official Optional Business Foundation, SaaS Control Plane, ERP Extension, Derived Application (ADR-0013) — arah dependency selalu DAG menuju Core.                                      |
| **SaaS Control Plane**                     | Lapisan di luar repo base yang memiliki service catalog & subscription billing lintas tenant.                                                                                                                                                         |
| **ERP Extension**                          | Lapisan di luar repo base yang memiliki item/product master & general ledger/AR-AP/valuasi inventory/payroll/pajak milik satu tenant.                                                                                                                 |
| **Derived Application**                    | Lapisan di luar repo base untuk modul domain spesifik vertikal (POS, portal sekolah, dst.) yang bukan SaaS Control Plane maupun ERP Extension — lihat `derived-application-guide.md`.                                                                 |
| **Capability port**                        | Interface TypeScript murni (`_shared/ports/*.ts`) yang memisahkan kapabilitas dari implementasi modul pemiliknya (ADR-0011) — mekanisme kolaborasi lintas-modul/lintas-repo yang diizinkan, pengganti import langsung.                                |
| **Lifecycle dependency**                   | `ModuleDescriptor.dependencies` — urutan enable/disable, selalu required (doc 21 §5).                                                                                                                                                                 |
| **Capability dependency**                  | `ModuleDescriptor.capabilities.consumes` — hubungan level-source lewat port/adapter, `optional` dinyatakan eksplisit (ADR-0011, doc 21 §5).                                                                                                           |
| **No shared-table write**                  | Aturan: hanya kode modul pemilik yang boleh menulis tabelnya sendiri; pemilik lain berkolaborasi lewat capability port/API/event, tidak pernah tabel bersama (ADR-0013 §6).                                                                           |
| **Business transaction reference**         | Referensi generik (tenant, legal-entity scope, tipe, status lifecycle) ke sebuah transaksi bisnis yang dimiliki ekstensi ERP — kontrak murni base, bukan tabel (`_shared/business-transaction-contract.ts`, Issue #755).                              |
| **Posting request/result**                 | Envelope event berpasangan (`AccountingPostingRequestPayload`/`Result`) yang menaik di atas `domain_event_runtime` — penerimaan request (`accepted`) BUKAN bukti posting berhasil (`posted`); base tidak pernah menginterpretasi isinya (Issue #755). |
| **Period lock**                            | Kapabilitas "apakah periode akuntansi ini boleh diposting" milik ekstensi ERP — `PeriodLockPort` (`_shared/ports/period-lock-port.ts`) fail-closed untuk posting, TAPI bukan batas identitas/RLS (Issue #755).                                        |

## Keamanan dan akses

| Istilah                  | Definisi                                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **RBAC**                 | Role-Based Access Control — akses berdasarkan peran user.                                                                 |
| **ABAC**                 | Attribute-Based Access Control — akses berdasarkan atribut (module, activity, resource, office, environment).             |
| **Default deny**         | Semua akses ditolak kecuali diizinkan eksplisit.                                                                          |
| **Deny overrides allow** | Bila ada aturan deny yang cocok, ia mengalahkan semua allow.                                                              |
| **RLS**                  | Row-Level Security PostgreSQL — filter baris per tenant di level database.                                                |
| **Tenant context**       | Konteks tenant aktif yang diset di transaction (`app.current_tenant_id`) untuk RLS.                                       |
| **Decision log**         | Catatan keputusan ABAC (terutama deny high-risk).                                                                         |
| **Audit log**            | Catatan aksi high-risk untuk akuntabilitas (`awcms_micro_audit_events`).                                                  |
| **Masking / Redaction**  | Menyembunyikan sebagian/seluruh data sensitif pada tampilan (mask) dan pada log (redact).                                 |
| **HMAC**                 | Hash-based Message Authentication Code — tanda tangan integritas untuk sync.                                              |
| **Idempotency**          | Sifat mutation yang menghasilkan efek sama walau diulang dengan `Idempotency-Key` sama.                                   |
| **Soft delete**          | Penghapusan logis dengan `deleted_at`/actor/reason; list default menyembunyikan data, restore/purge butuh izin dan audit. |

## Toko online dan inventory

| Istilah                            | Definisi                                                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Checkout session**               | Draft keranjang/checkout online sebelum diposting (status draft/held).                                                   |
| **Posting**                        | Mengubah checkout menjadi transaksi final (sales document / pesanan online) secara atomic.                               |
| **Sales document**                 | Pesanan online yang sudah posted, **immutable** (append-only).                                                           |
| **Immutable**                      | Tidak dapat diubah/dihapus; koreksi lewat cancel/return/reversal/adjustment.                                             |
| **Tombstone**                      | Event/penanda bahwa resource di-soft-delete agar node sync lain ikut menyembunyikan data tanpa physical delete langsung. |
| **Stock balance**                  | Saldo stok per produk per office (on hand, reserved, available).                                                         |
| **Stock movement**                 | Mutasi stok **append-only** (opening, sale, return, adjustment, transfer).                                               |
| **Opening balance**                | Saldo stok awal saat implementasi.                                                                                       |
| **SKU / Barcode**                  | Kode unik produk per tenant / kode pindai.                                                                               |
| **Tracking type**                  | Cara pelacakan produk: none / lot / serial / lot_serial.                                                                 |
| **Reversal / Return / Adjustment** | Mekanisme koreksi resmi tanpa mengubah transaksi posted.                                                                 |

## Warehouse (lineage ERP `awcms` — dikecualikan, ADR-0034 §3)

> Istilah gudang berikut **bukan** scope website base ini; dipertahankan hanya sebagai rujukan terminologi lineage ERP `awcms`.

| Istilah                    | Definisi                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------- |
| **Warehouse / Zone / Bin** | Hierarki lokasi fisik gudang; bin = lokasi rak terkecil.                           |
| **Bin balance**            | Saldo stok detail per bin/lot/serial.                                              |
| **Lot / Batch**            | Kelompok stok dengan atribut sama (mis. tanggal produksi/expired).                 |
| **Serial**                 | Identitas unit tunggal yang dilacak individual.                                    |
| **Transfer order**         | Perintah pemindahan stok antar gudang (draft→...→received).                        |
| **In-transit**             | Stok yang sudah dikirim (shipped) tetapi belum diterima.                           |
| **Partial receipt**        | Penerimaan sebagian dari yang dikirim.                                             |
| **Quarantine**             | Lokasi karantina untuk barang rusak/expired.                                       |
| **Cycle count**            | Perhitungan stok berkala untuk menemukan variance.                                 |
| **Variance**               | Selisih antara stok sistem dan hasil hitung fisik.                                 |
| **FEFO**                   | First Expired First Out — prioritas keluar untuk stok yang lebih dulu kedaluwarsa. |

## Pajak / Coretax (lineage ERP `awcms` — dikecualikan, ADR-0034 §3)

> Istilah pajak/Coretax berikut **bukan** scope website base ini; dipertahankan hanya sebagai rujukan terminologi lineage ERP `awcms`. (Catatan: pajak sebagai baris nominal pada checkout toko online tetap in-scope; yang dikecualikan adalah faktur pajak/VAT posting/Coretax export.)

| Istilah                         | Definisi                                                                                                                     |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Coretax**                     | Sistem administrasi pajak DJP Indonesia; AWCMS-Micro bersifat **Coretax-ready** (XML/staging), bukan integrasi upload resmi. |
| **NPWP**                        | Nomor Pokok Wajib Pajak. **NIK**                                                                                             | Nomor Induk Kependudukan. |
| **NITKU / ID TKU**              | Nomor Identitas Tempat Kegiatan Usaha — identitas unit usaha untuk pajak.                                                    |
| **PPN / VAT**                   | Pajak Pertambahan Nilai / Value Added Tax.                                                                                   |
| **DPP**                         | Dasar Pengenaan Pajak — basis nilai untuk menghitung PPN.                                                                    |
| **VAT invoice (faktur)**        | Faktur pajak yang di-stage dari sales document posted.                                                                       |
| **Coretax batch**               | Kumpulan VAT invoice tervalidasi yang diekspor sebagai XML + checksum.                                                       |
| **Party / Product tax profile** | Konfigurasi pajak untuk pihak (customer/supplier) / produk.                                                                  |
| **Checksum**                    | Nilai verifikasi integritas file ekspor.                                                                                     |

## Engagement dan notifikasi pesanan

| Istilah                    | Definisi                                                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Invoice/konfirmasi PDF** | Bukti/konfirmasi pesanan digital (PDF) yang dibuat lokal.                                                         |
| **Consent**                | Persetujuan pelanggan untuk dihubungi via email/newsletter/notifikasi.                                            |
| **Message outbox**         | Antrean pesan (email/newsletter/notifikasi) yang dikirim provider saat online.                                    |
| **Mailketing**             | Provider email opsional (base). _(StarSender/WhatsApp adalah contoh provider lineage ERP `awcms`, dikecualikan.)_ |
| **Customer portal**        | Halaman pelanggan untuk membuka konfirmasi/status pesanan via token.                                              |
| **Order token**            | Token non-sequential untuk akses konfirmasi pesanan tanpa login.                                                  |

## Sync dan offline

| Istilah                    | Definisi                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| **Sync node**              | Instance offline/LAN yang bersinkron dengan server pusat.                                   |
| **Outbox / Inbox**         | Antrean event keluar / masuk untuk sinkronisasi.                                            |
| **Transactional outbox**   | Pola menulis event dalam transaction yang sama dengan data, lalu dikirim worker terpisah.   |
| **Push / Pull**            | Mengirim / menarik event antar node dan server.                                             |
| **Checkpoint**             | Penanda posisi sinkronisasi terakhir.                                                       |
| **Conflict**               | Perbedaan data antar node yang perlu diselesaikan (high-risk = manual + audit).             |
| **Anti-replay / Skew**     | Perlindungan terhadap pengiriman ulang; skew = toleransi selisih waktu (default 300 detik). |
| **Object sync queue / R2** | Antrean upload file ke object storage (Cloudflare R2 opsional).                             |

## Database dan performa

| Istilah                     | Definisi                                                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Migration**               | Perubahan schema berurutan (`NNN_awcms_micro_<area>_<desc>.sql`) yang tercatat & audit-ready.                              |
| **Partial unique index**    | Unique index dengan kondisi, mis. `WHERE deleted_at IS NULL`, agar kode bisnis aktif tetap unik saat data lama diarsipkan. |
| **Schema migrations table** | `awcms_micro_schema_migrations` — catatan migration yang sudah dijalankan + checksum.                                      |
| **`SET LOCAL`**             | Menetapkan variabel hanya untuk transaction berjalan (aman dengan PgBouncer transaction pooling).                          |
| **`FOR UPDATE`**            | Mengunci baris terpilih hingga transaction selesai (mencegah race pada stok).                                              |
| **Connection pool**         | Kumpulan koneksi DB yang dipakai ulang.                                                                                    |
| **Work class**              | Kategori beban (critical_transaction, interactive, reporting, background_sync, maintenance) untuk prioritas pool.          |
| **Backpressure**            | Menahan/menolak beban saat pool jenuh (`503 DATABASE_BUSY`).                                                               |
| **Circuit breaker**         | Memutus akses sementara saat DB tidak sehat.                                                                               |
| **PgBouncer**               | Connection pooler eksternal (mode transaction) opsional.                                                                   |
| **Keyset pagination**       | Paginasi berbasis kunci (bukan offset besar) untuk data besar.                                                             |
| **Idempotency store**       | `awcms_micro_idempotency_keys` — penyimpanan hasil mutation high-risk.                                                     |

## Frontend dan UI

| Istilah                  | Definisi                                                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **SSR**                  | Server-Side Rendering — halaman dirender di server (Astro output server).                                                                        |
| **Island**               | Bagian interaktif yang di-hydrate di klien (Astro islands).                                                                                      |
| **PWA / Service worker** | Progressive Web App; service worker meng-cache app shell & mengelola background sync.                                                            |
| **IndexedDB**            | Penyimpanan klien untuk outbox transaksi offline & cache master.                                                                                 |
| **Design token**         | Variabel desain (warna, tipografi, spacing) sebagai CSS custom properties.                                                                       |
| **State pattern**        | Loading / empty / error / success yang wajib di tiap layar.                                                                                      |
| **Optimistic UI**        | Menampilkan hasil sebelum konfirmasi server, rollback bila ditolak.                                                                              |
| **i18n / locale**        | Internasionalisasi; min en+id (default **en**). String UI statis via `.po` gettext; konten data multi-bahasa di DB per locale aktif (doc 14/04). |
| **WCAG 2.1 AA**          | Standar aksesibilitas target AWCMS-Micro.                                                                                                        |
| **Sync indicator**       | Komponen UI penunjuk status koneksi & antrean sync.                                                                                              |

## Peran (persona)

| Peran                          | Ringkas                                                                     |
| ------------------------------ | --------------------------------------------------------------------------- |
| **Owner**                      | Akses penuh & approval utama.                                               |
| **Admin**                      | Kelola sistem, user, katalog & konten, laporan.                             |
| **Editor/Content**             | Kelola halaman, blog, berita, media, jadwal publikasi.                      |
| **Store Operator**             | Proses & pemenuhan pesanan online (tanpa Coretax/export/assign).            |
| **Engagement Staff**           | Moderasi komentar, newsletter, notifikasi.                                  |
| **Manager**                    | Approval pesanan/stok/operasional.                                          |
| **Inventory Staff**            | Katalog produk, ketersediaan, adjustment terbatas.                          |
| **Business Analyst**           | Laporan agregat & AI analyst.                                               |
| **Customer/Pengunjung**        | Telusuri katalog, checkout online, lacak pesanan, kelola langganan/consent. |
| **Auditor**                    | Audit trail read-only.                                                      |
| **Petugas Gudang** _(lineage)_ | Transfer, receiving, cycle count — lineage ERP `awcms`, dikecualikan.       |
| **Tax Officer** _(lineage)_    | Pajak & Coretax — lineage ERP `awcms`, dikecualikan.                        |

## Singkatan cepat

`ABAC` · `RBAC` · `RLS` · `POS` · `WMS` · `PDF` · `PPN/VAT` · `DPP` · `NPWP` · `NIK` · `NITKU` · `HMAC` · `FEFO` · `SSR` · `PWA` · `R2` · `SKU` · `DTO` · `SOP` · `PRD` · `SRS` · `ERD` · `DoD`.
