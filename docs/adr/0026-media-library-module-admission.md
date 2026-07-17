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

1. Daftarkan modul `media_library` + port `media_library` (di samping `news_media` yang di-deprecate) — belum memindahkan kode. **(selesai)**
2. Pindahkan registry/directory/upload-session ke `media_library`; `news_portal` mengonsumsi lewat port. **(selesai)**
3. ~~Rewire `blog_content` + `social_publishing` ke port baru; lepas `news_media`.~~
4. ~~Lepas gate R2-only dari kepemilikan `news_portal` sehingga media bekerja tanpa portal berita.~~
   → **3–4 dikerjakan sebagai SATU langkah (selesai)** — lihat koreksi di bawah.
5. Tambah preset/endpoint penyalaan, varian gambar, tipe non-gambar, dan admin media browser (§4).
   - **5a. Endpoint penyalaan enforcement (selesai)** — `GET`/`POST /api/v1/media/enforcement`, `sql/079`. Melunasi utang yang dicatat langkah 3–4: situs brosur kini punya tombolnya, bukan hanya kapabilitasnya.
   - 5b. Varian gambar/`srcset` — belum.
   - 5c. Tipe media non-gambar — belum.
   - 5d. Admin media browser — belum.

### Koreksi staging: langkah 3 dan 4 ternyata satu pekerjaan

Staging di atas mengasumsikan langkah 3 (rewire konsumen ke port baru) bisa mendarat sebelum langkah 4 (lepas gate R2-only). **Itu keliru, dan baru terlihat saat langkah 3 dimulai.**

Sebabnya: kopling itu hidup di **kontrak port itu sendiri**, bukan di adaptornya. `NewsMediaPort` membawa method `isFullOnlineR2ModeActiveForTenant` — pertanyaan kebijakan editorial `news_portal`, bukan pertanyaan media. Selama method itu ada di kontrak, port `media_library` tetap wajib menjawab pertanyaan `news_portal`, jadi adaptornya tetap harus mengimpor `news-portal-tenant-state`/`news-portal-preset-readiness`. Melakukan langkah 3 sendirian hanya akan **mengganti nama port tanpa membalik apa pun** — `media_library` akan "menyediakan" kapabilitas yang mustahil ia implementasikan tanpa modul konsumennya.

Dua method lain (`isMediaReferenceSafe`, `resolveMediaReferences`) sudah murni: setelah langkah 2, keduanya hanya memanggil registry di `media_library`. `news_portal` menyediakan `news_media` semata karena registry-nya kebetulan lahir di sana.

Pemecahan yang dikerjakan, dan kenapa ini bukan sekadar rename:

- Pertanyaan **"haruskah referensi media tenant ini berbasis registry?"** adalah pertanyaan media. Ia kini dijawab `media_library` dari readiness deployment-nya sendiri (`domain/managed-media-readiness.ts`, hasil pecahan bagian `NEWS_MEDIA_R2_*` dari readiness preset `news_portal`) dan flag per-tenant miliknya sendiri (`application/media-library-tenant-state.ts`, `sql/078`).
- Preset R2-only `news_portal` menjadi **salah satu PENULIS** flag itu, bukan pemiliknya. Sebaliknya tidak berlaku: tenant boleh punya flag tanpa pernah menerapkan preset — justru itulah kasus situs brosur.
- Kapabilitas `news_media` **dipensiunkan**, bukan di-MAJOR-bump: penyedianya berubah DAN kontraknya kehilangan satu method. Repo turunan yang dipin ke `news_media` harus gagal terang-terangan, bukan diam-diam terikat ke port yang tidak lagi menanyakan hal yang ia tanyakan.
- `sql/078` mem-backfill dari `awcms_micro_news_portal_tenant_state`. Tanpa itu, deploy akan **mematikan** penegakan media persis bagi tenant yang memintanya — regresi keamanan yang menyamar sebagai refaktor. Backfill lintas-tenant membaca tabel ber-RLS `FORCE`; klaim bahwa role migrasi mem-bypass RLS diverifikasi test integrasi (`media-library-tenant-state.integration.test.ts`), bukan dipercaya dari komentar.

**Pelajaran yang bisa dipakai ulang:** saat memindahkan kepemilikan kapabilitas, periksa **kontrak port** lebih dulu, bukan hanya letak adaptornya. Adaptor di modul yang salah adalah gejala; method milik modul yang salah di dalam kontrak adalah penyebabnya.

**Utang yang tersisa (dilunasi langkah 5a).** Saat langkah 3–4 mendarat, tidak ada jalur non-`news_portal` untuk MENYALAKAN flag `media_library`, jadi situs brosur punya kapabilitasnya tanpa tombolnya. Langkah 5a menutupnya.

### Langkah 5a — endpoint penyalaan enforcement

`GET`/`POST /api/v1/media/enforcement` (`sql/079`: permission `media_library.enforcement.read`/`.enable`), didukung entry point tersanksi `application/enable-managed-media-enforcement.ts` yang menjalankan gate readiness lebih dulu — sama seperti `apply-news-portal-preset.ts`, dan di entry point-nya (bukan di satu pemanggil) supaya pemanggil kedua di masa depan tak bisa melewatinya.

Peringatan di utang lama **ditaati**: flag ini tidak diekspos lewat `awcms_micro_module_settings`. Sebagai gantinya:

- **Activity code terpisah (`enforcement`, bukan `media`).** `media.*` mengatur OBJEK media; `enforcement.*` mengatur KEBIJAKAN konten se-tenant. Beda radius ledakan, jadi harus bisa diberikan terpisah — melipatnya ke `media.create` berarti menyerahkan saklar kebijakan ke setiap editor yang mengunggah gambar.
- **Satu arah, secara konstruksi.** Tidak ada action `disable`, tidak ada fungsi "unmark", tidak ada DELETE terhadap tabelnya di mana pun. Ini **properti keamanan, bukan API yang belum selesai**: header `sql/043` mencatat desain lama terbukti dieksploitasi end-to-end justru karena tenant bisa membersihkan marker-nya sendiri dan diam-diam mematikan seluruh validasi medianya. Menambahkan jalur disable "demi simetri" mengembalikan eksploit itu dengan nama yang lebih ramah. Empat guard independen menjaganya (`tests/unit/media-enforcement-one-way.test.ts` + test integrasi), dan sudah diverifikasi **gagal** saat jalur disable disuntikkan kembali.
- **Jalan mundur yang sah** adalah mengubah konfigurasi `NEWS_MEDIA_R2_*` — tindakan operator yang deliberate dan auditable, di luar jangkauan tenant, yang sudah diperlakukan fail-closed oleh `evaluateManagedMediaReadiness`.

Rekonsiliasi dengan header `sql/078` ("tidak ada write endpoint generik"): klaim itu **tetap benar**. Yang ditolak `sql/043` adalah endpoint GENERIK (`PATCH /api/v1/tenant/modules/{moduleKey}/settings`) yang dijaga permission generik tak terkait. Endpoint ini terdedikasi, dijaga permission terdedikasi sendiri, dan hanya bisa menyalakan. Detail lengkap di header `sql/079`.

**Utang yang benar-benar tersisa:** 5b (varian gambar/`srcset`), 5c (tipe non-gambar), 5d (admin media browser). Ketiganya fitur tersendiri, bukan pelunasan utang.

## Alternatif yang ditolak

- **Bangun `media_library` baru dari nol berdampingan dengan registry `news_media`.** Ditolak: dua sumber kebenaran untuk objek media tenant, duplikasi alur presigned/rekonsiliasi/lifecycle-orphan, dan drift yang dijamin — persis yang dilarang ADR-0025 §5.
- **Biarkan media di `news_portal`, cukup tambahkan varian di sana.** Ditolak: mengunci manajemen media di balik modul portal berita. Situs brosur, situs korporat, dan landing page adalah warga kelas satu scope website ini; menuntut mereka menyalakan `news_portal` demi mengunggah logo adalah kekeliruan pemodelan, bukan ketidaknyamanan.
- **Jadikan `blog_content` pemilik media.** Ditolak: `social_publishing` juga mengonsumsi media tanpa perlu `blog_content`, dan modul mendatang (`seo_distribution` untuk gambar OG, theming untuk aset) juga akan butuh. Media adalah infrastruktur lintas modul — System Foundation, bukan modul konten.
- **Rename `awcms_micro_news_media_objects`.** Ditolak — lihat §3.
