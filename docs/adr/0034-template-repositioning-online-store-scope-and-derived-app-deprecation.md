# ADR-0034 — AWCMS-Micro sebagai TEMPLATE full-online website (hingga toko online), POS dikecualikan, dan deprecation jalur aplikasi-turunan

- **Status:** Accepted
- **Tanggal:** 2026-07-21
- **Pengambil keputusan:** @ahliweb
- **Terkait / men-supersede sebagian:** [ADR-0013](0013-extension-layers-and-boundary-model.md) (lapisan Derived Application), [ADR-0014](0014-deterministic-build-time-module-composition.md) (komposisi build-time / `application-registry.ts`), [ADR-0015](0015-derived-application-compatibility-manifest.md) (manifest kompatibilitas turunan / `extension:check`), [ADR-0025](0025-website-scope-derivation-from-awcms-mini.md) (posisi "turunan scope website dari awcms-mini"). Menegaskan kembali batas scope [ADR-0027](0027-full-online-deployment-and-durable-storage-profiles.md).

## Konteks

ADR-0025 memposisikan repo ini sebagai **turunan scope website dari standar `awcms-mini`**, dan ADR-0013/0014/0015 membangun **jalur aplikasi-turunan**: base ini dipakai sebagai fondasi yang di atasnya dibangun aplikasi domain terpisah (mis. repo `ahliweb/awpos` retail/POS) lewat `application-registry.ts` + compatibility manifest + gerbang `bun run extension:check`. `derived-app-pilot-plan.md` bahkan memilih **AWPOS (retail/POS)** sebagai pilot pertama.

Dua konsekuensi yang tidak diinginkan muncul dari framing itu:

1. **Kesan "untuk membangun POS".** Paket dokumen 02–19 memakai domain **retail/POS bergaya AWPOS** sebagai contoh berjalan (SOP kasir, layar POS fullscreen, skema `sales_pos`, glosarium POS/inventory/pajak). Walau ada banner "ilustratif", efek nettonya memposisikan base seolah alat membangun **point-of-sale in-store** — padahal ADR-0025 §2 sendiri menyatakan scope-nya _"bukan ERP, bukan POS"_.
2. **Jalur turunan mempersulit pemakaian langsung.** Untuk dipakai, model "bangun aplikasi-turunan terpisah di atas base" menambah lapisan (manifest, registry aplikasi, gate kompatibilitas) yang tidak perlu jika tujuannya cukup: **memakai repo ini langsung sebagai template website**.

Keputusan pemilik: **repo ini dipakai LANGSUNG sebagai template full-online website yang bisa tumbuh sampai TOKO ONLINE (e-commerce), tanpa mewajibkan jalur aplikasi-turunan, dan tanpa framing POS.**

## Keputusan

### 1. Template langsung, bukan basis-turunan-wajib

awcms-micro adalah **template full-online website siap-pakai**. Cara pakai utama: **gunakan repo ini secara langsung** sebagai titik awal sebuah website — bukan membangun aplikasi-turunan terpisah di atasnya. Asal-usul historis dari standar `awcms-mini` tetap dicatat sebagai **warisan** (konvensi Bun-only, RLS, RBAC/ABAC, kontrak, gate CI tetap berlaku utuh), tetapi repo ini **tidak lagi** diposisikan sebagai "turunan yang mem-port dari mini" secara berkelanjutan — ia berdiri sebagai template-nya sendiri. Ini men-supersede framing "turunan scope website" pada ADR-0025 §Konteks/§Keputusan-1 (scope teknis dan daftar modul ADR-0025 tetap berlaku).

### 2. Scope: full online website hingga toko online (e-commerce), BUKAN POS in-store

Scope membentang dari situs konten/blog/berita/media **sampai ujung toko online**: katalog produk, halaman etalase, keranjang & **checkout online**, halaman pesanan — semuanya sebagai permukaan **website publik**. Yang **dikecualikan** dan tetap milik lineage ERP `awcms`:

- **POS in-store / kasir fisik** (terminal kasir, keyboard-first fullscreen, cetak struk/hardware);
- **offline-first retail** (outbox IndexedDB untuk transaksi kasir, sinkronisasi node toko);
- **ops back-office ERP**: posting transaksi immutable bergaya jurnal, kunci stok gudang fisik, transfer gudang, export pajak Coretax, CRM operasional.

Aturan praktis: jika sebuah kapabilitas hanya masuk akal di **belakang meja kasir / gudang / back-office**, itu ERP (`awcms`), bukan sini. Jika masuk akal sebagai **halaman/website publik yang diakses pembeli lewat browser**, itu masuk spektrum template ini. Toko online adalah **arah ekstensi in-scope**, bukan modul base saat ini (registry base tetap seperti ADR-0025/berikutnya; e-commerce ditambahkan sebagai modul website bila/ketika diadmisi lewat ADR — ADR-0025 §6).

### 3. Jalur aplikasi-turunan: DEPRECATED (opsional-lawas)

Lapisan **Derived Application** (ADR-0013), komposisi `application-registry.ts` untuk aplikasi turunan terpisah (ADR-0014), dan manifest kompatibilitas + gerbang `extension:check` (ADR-0015) **di-deprecate sebagai model pemakaian utama**. Mereka turun status menjadi **opsional-lawas**: masih ada untuk kompatibilitas mundur, tetapi dokumentasi tidak lagi mengarahkan pengguna ke jalur itu sebagai default.

**Kode dan gate TIDAK dihapus dalam ADR ini.** `application-registry.ts`, `extension:check`, `modules:compose:check`, `modules:composition:inventory:check`, dan fixture `tests/fixtures/derived-application-example` tetap utuh agar CI hijau dan tidak terjadi documentation drift docs-vs-kode (justru risiko yang ADR-0025 §5 tulis untuk dicegah). Penghapusan gerbang/kode adalah langkah **evidence-gated terpisah di masa depan** (perlu ADR sendiri + verifikasi CI penuh), dan bersifat **opsional**.

### 4. Contoh domain: retail/POS → website/toko online

Contoh berjalan di paket dokumen 02–19 harus berorientasi **website/toko online**, bukan retail/POS in-store. Banner penanda tiap dokumen diperbarui untuk menyatakan (a) base ini template website, (b) contoh POS/kasir adalah **legacy warisan sumber-standar AWPOS** yang sedang diganti, dan (c) POS in-store berada di luar scope (lineage ERP `awcms`). Penulisan-ulang konten POS mendalam (langkah SOP kasir, layar POS fullscreen, skema `sales_pos`) adalah pekerjaan bertahap lanjutan; hingga tuntas, **`src/`, `sql/`, dan gate CI tetap sumber kebenaran** (mewarisi ADR-0025 §Konsekuensi).

### 5. AWPOS

`ahliweb/awpos` (retail/POS) **bukan** target aplikasi-turunan dari template ini. Perannya terhadap awcms-micro murni **historis**: paket dokumennya adalah sumber-standar dari mana paket dokumen base ini diekstraksi (lihat `AUDIT_STANDAR_PENGEMBANGAN_2026-07-04.md`). Sebagai aplikasi POS, AWPOS termasuk lineage **ERP (`awcms`)**, bukan spektrum website ini. Pilot bukti platform (Issue #273/#292) adalah **website generik / toko online**, bukan AWPOS.

## Konsekuensi

- **Positif:** framing jelas — template website langsung, hingga toko online, tanpa POS; pengguna tidak dipaksa lewat lapisan aplikasi-turunan; docs tidak lagi menyiratkan base membangun POS.
- **`AGENTS.md` (kontrak first-read) + README + paket dokumen** direframe (positioning template, katalog/etalase/checkout = ekstensi website in-scope yang dipisahkan dari POS/gudang/pajak yang dikecualikan, `derived-application-guide.md` + `derived-app-pilot-plan.md` ditandai deprecated menunjuk ADR ini). Sapuan banner 02–19 = putaran lanjutan (§4).
- **Utang lanjutan (diakui, bertahap):** (a) penulisan-ulang konten contoh POS mendalam di 02–19 menjadi website/toko-online; (b) opsional & evidence-gated: pelepasan gerbang/kode jalur turunan (`extension:check` dll.). Keduanya putaran terpisah.
- **Tidak berubah:** seluruh konvensi teknis base (Bun-only, RLS/FORCE, RBAC/ABAC default-deny, kontrak OpenAPI/AsyncAPI, registry modul saat ini, gate CI). ADR ini me-reposisi **narasi & jalur pemakaian**, bukan arsitektur runtime.
