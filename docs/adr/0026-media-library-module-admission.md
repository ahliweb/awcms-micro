# ADR-0026 — Admission `media_library` lewat EKSTRAKSI registry media generik dari `news_portal`

- **Status:** Accepted
- **Tanggal:** 2026-07-17
- **Pengambil keputusan:** @ahliweb
- **Terkait:** ADR-0025 (turunan scope website — §6 mensyaratkan ADR admission sebelum baris kode pertama), ADR-0011 (capability ports), ADR-0012 (module admission & trusted registry boundary), ADR-0013 §1 (lapisan ekstensi, Core tidak boleh bergantung pada Optional), ADR-0006 (provider eksternal di luar transaksi), `docs/awcms-micro/21_module_admission_governance.md`, epic upstream `news_portal` (#631–#642, #649, #681, #690)

## Konteks

ADR-0025 §6 mendaftar **media library** sebagai modul yang dituntut scope website tapi "belum ada di upstream". **Pemeriksaan kode membuktikan premis itu salah**, dan ADR ini mengoreksinya sebelum sebaris kode ditulis — persis fungsi gerbang admission.

Registry media **sudah ada**, hidup di dalam `news_portal`, dan **sudah generik**:

- `sql/041_awcms_micro_news_media_object_registry_schema.sql` mendeklarasikan `awcms_micro_news_media_objects` dengan kolom **`module_key text NOT NULL DEFAULT 'news_portal'`** plus `owner_resource_type`/`owner_resource_id` — referensi resource generik. Kolom itu tidak punya alasan untuk ada kecuali tabelnya memang dirancang melayani lebih dari satu modul.
- Isinya sudah selengkap media library: `storage_driver`, `bucket_name`, `object_key`, `public_url`, `mime_type`, `size_bytes`, `width`, `height`, `alt_text`, `caption`, `status`, soft-delete.
- Sudah ada alur upload presigned (`/api/v1/media/news-images/upload-sessions/*`), gate R2-only, lifecycle orphan (`sql/046`), dan job rekonsiliasi R2.
- Sudah dikonsumsi lintas modul lewat capability port `news_media` (`_shared/ports/news-media-port.ts`) oleh `blog_content` **dan** `social_publishing` — persis pola ADR-0011.

**Ini pola yang identik dengan generic idempotency store (ADR-0025 §3):** sepotong infrastruktur bersama yang lahir di dalam modul yang epic-nya kebetulan pertama membutuhkannya, lalu ikut ternamai menurut epic itu. Di sana solusinya memisahkan store ke migrasinya sendiri. Di sini masalahnya sama, tapi taruhannya lebih besar karena ada **konsekuensi produk yang nyata**, bukan sekadar penamaan:

> `blog_content/application/news-media-reference-gate.ts` menegakkan referensi media terkelola **hanya** saat mode R2-only aktif — dan mode itu milik `news_portal`. Header file itu menyatakannya sendiri: _"When full-online R2-only mode is NOT active for the tenant (the overwhelming majority of deployments/tenants today), this entire check is a no-op — `featuredMediaId`/gallery `url` fields keep their existing, unchanged, pre-#636 behavior."_

Artinya: **tenant yang menjalankan situs brosur (`blog_content` + `tenant_domain`, tanpa `news_portal`) tidak punya media library sama sekali** — ia hanya bisa menempel URL mentah ke gambar yang di-host di tempat lain. Untuk platform yang menyebut dirinya "website online penuh", mengunggah dan mengelola gambar tidak boleh menuntut penyalaan modul **portal berita**. Preset `online_website` (`tenant_domain` + `blog_content` + `email` + `reporting`) hari ini secara harfiah adalah website tanpa manajemen media.

## Keputusan

Kami mengadmisi **`media_library`** sebagai modul base, dan mewujudkannya lewat **EKSTRAKSI dari `news_portal`, bukan implementasi paralel baru**.

Membangun modul media kedua di samping registry yang sudah ada akan menduplikasi tabel, alur upload presigned, gate R2, lifecycle orphan, dan job rekonsiliasi — lalu meninggalkan dua sumber kebenaran untuk "apa itu objek media milik tenant ini". Itu kebalikan dari rekayasa yang benar, dan ADR-0025 §5 sudah mengikat kita untuk tidak menambah drift baru.

### 1. Parameter admission (mengisi `module-proposal-template.md`)

- Nama: **Media Library** · `key`: `media_library`
- Kategori: **System Foundation** (lapisan ADR-0013 #2) — infrastruktur platform reusable, bukan fitur produk end-user yang berdiri sendiri. Sejalan dengan `sync_storage`/`domain_event_runtime`.
- `type`: `system` · `status`: `active` · `isCore`: tidak
- `dependencies`: `["tenant_admin", "identity_access"]` — **tidak** bergantung pada `news_portal` maupun `blog_content` (arah dependensi justru dibalik oleh ADR ini).
- Pemilik: @ahliweb · offline-lan-safe: ya untuk metadata; unggah byte butuh provider dan mengikuti ADR-0006 (di luar transaksi).

### 2. Pembalikan arah kepemilikan

| Sebelum                                                                                                                  | Sesudah                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `news_portal` **memiliki** registry media; `blog_content` & `social_publishing` mengonsumsi port `news_media` (opsional) | `media_library` **memiliki** registry media; `news_portal`, `blog_content`, `social_publishing` mengonsumsi port `media_library` |
| Media hanya tersedia bila `news_portal` menyala                                                                          | Media tersedia bagi tenant website mana pun tanpa `news_portal`                                                                  |

`news_portal` tetap memiliki apa yang benar-benar miliknya: kebijakan editorial R2-only, readiness gate preset, homepage sections, ad placements. Yang berpindah hanyalah registry objek media generik dan alur unggahnya.

Capability port `news_media` **di-supersede** oleh port `media_library` yang setara. Sesuai `_shared/capability-contract-versions.ts`, ini penggantian key capability — bukan bump minor.

### 3. Kompatibilitas & migrasi data

Tabel **`awcms_micro_news_media_objects` TIDAK di-rename**, meski namanya kini keliru menyebut pemilik. Alasannya sama dengan §4 ADR-0025 (gap penomoran migrasi dipertahankan): nama tabel dirujuk `sql/041`/`042`/`046`, seluruh application layer, dan puluhan komentar; me-rename-nya menukar satu ketidaknyamanan kosmetik dengan risiko nyata dan diff yang tak terbaca. Kolom `module_key` sudah menjadi pembeda pemilik sesungguhnya. Migrasi baru **menambahkan** apa yang kurang (§4), tidak menulis ulang yang sudah ada. Keputusan ini ditinjau ulang bila suatu saat ada alasan lain yang menuntut migrasi tabel itu.

### 4. Yang ditambahkan (gap nyata untuk scope website)

Diverifikasi belum ada di kode hari ini:

1. **Varian gambar / responsive derivative** (thumbnail, `srcset`) — grep `variant|thumbnail|srcset|derivative|resize` di `sql/` dan modul media: nihil. Ini bukan kemewahan untuk website: tanpanya setiap halaman mengirim gambar ukuran penuh, memukul LCP dan Core Web Vitals — yang juga menjadi input modul SEO (ADR berikutnya).
2. **Tipe media non-gambar** — route hari ini hanya `/media/news-images/*`. Website butuh PDF/dokumen; kolom `mime_type` sudah generik, yang belum ada adalah jalur unggah + validasinya.
3. **Admin media browser** — `src/pages/admin/news-portal/` hanya punya `ad-placements` dan `homepage-sections`. Tidak ada layar telusur/cari/kelola media.

### 5. Batas scope (yang modul ini TIDAK lakukan)

- **Tidak** memproses/mentranskode byte di dalam transaksi DB (ADR-0006). Pembuatan varian mengikuti pola CLAIM/UPLOAD/FINALIZE 3-fase milik `sync_storage`'s object queue, bukan pekerjaan sinkron di jalur request.
- **Tidak** menjadi CDN, image proxy, atau DAM (tagging/kolaborasi/versioning aset).
- **Tidak** mengunci satu provider: `storage_driver` sudah menjadi kolom; R2 adalah driver pertama, bukan satu-satunya yang mungkin.
- **Tidak** menulis ke tabel modul lain — kolaborasi hanya lewat capability port (ADR-0011/0013 §6).

## Konsekuensi

**Positif.** Media menjadi kapabilitas platform, bukan sandera modul berita — preset `online_website` akhirnya berarti website yang utuh. Satu sumber kebenaran untuk objek media dipertahankan (nol duplikasi). Kolom `module_key` yang sudah ada berarti ekstraksi ini terutama memindahkan kepemilikan dan mengganti nama port, bukan memodelkan ulang data.

**Negatif / risiko yang diakui.** Ini refaktor lintas modul yang menyentuh empat modul (`news_portal`, `blog_content`, `social_publishing`, dan `media_library` baru), tiga migrasi yang sudah ada, alur presigned upload, dan test-nya — **bukan pekerjaan atomik kecil**. Ia harus dikerjakan sebagai epic bertahap dengan `bun run check` hijau di tiap langkah, bukan satu commit raksasa:

1. Daftarkan modul `media_library` + port `media_library` (di samping `news_media` yang di-deprecate) — belum memindahkan kode.
2. Pindahkan registry/directory/upload-session ke `media_library`; `news_portal` mengonsumsi lewat port.
3. Rewire `blog_content` + `social_publishing` ke port baru; lepas `news_media`.
4. Lepas gate R2-only dari kepemilikan `news_portal` sehingga media bekerja tanpa portal berita.
5. Tambah varian gambar, tipe non-gambar, dan admin media browser (§4).

**Utang yang diakui sampai langkah 4 selesai:** tenant tanpa `news_portal` tetap tanpa media terkelola. Ini kondisi hari ini, bukan regresi yang diperkenalkan ADR ini — dicatat di sini supaya tidak dibaca sebagai fitur.

## Alternatif yang ditolak

- **Bangun `media_library` baru dari nol berdampingan dengan registry `news_media`.** Ditolak: dua sumber kebenaran untuk objek media tenant, duplikasi alur presigned/rekonsiliasi/lifecycle-orphan, dan drift yang dijamin — persis yang dilarang ADR-0025 §5.
- **Biarkan media di `news_portal`, cukup tambahkan varian di sana.** Ditolak: mengunci manajemen media di balik modul portal berita. Situs brosur, situs korporat, dan landing page adalah warga kelas satu scope website ini; menuntut mereka menyalakan `news_portal` demi mengunggah logo adalah kekeliruan pemodelan, bukan ketidaknyamanan.
- **Jadikan `blog_content` pemilik media.** Ditolak: `social_publishing` juga mengonsumsi media tanpa perlu `blog_content`, dan modul mendatang (`seo_distribution` untuk gambar OG, theming untuk aset) juga akan butuh. Media adalah infrastruktur lintas modul — System Foundation, bukan modul konten.
- **Rename `awcms_micro_news_media_objects`.** Ditolak — lihat §3.
