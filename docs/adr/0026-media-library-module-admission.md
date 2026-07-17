# ADR-0026 — Admission `media_library` lewat EKSTRAKSI registry media generik dari `news_portal`

- **Status:** Accepted
- **Tanggal:** 2026-07-17
- **Pengambil keputusan:** @ahliweb
- **Terkait:** ADR-0025 (turunan scope website — §6 mensyaratkan ADR admission sebelum baris kode pertama), ADR-0011 (capability ports), ADR-0012 (module admission & trusted registry boundary), ADR-0013 §1 (lapisan ekstensi, Core tidak boleh bergantung pada Optional), ADR-0006 (provider eksternal di luar transaksi), `docs/awcms-micro/21_module_admission_governance.md`, epic upstream `news_portal` (#631–#642, #649, #681, #690)

## Konteks

ADR-0025 §6 mendaftar **media library** sebagai modul yang dituntut scope website tapi "belum ada di upstream". **Pemeriksaan kode membuktikan premis itu salah**, dan ADR ini mengoreksinya sebelum sebaris kode ditulis — persis fungsi gerbang admission.

Registry media **sudah ada**, hidup di dalam `news_portal`, dan **sudah generik**:

- `sql/041_awcms_micro_news_media_object_registry_schema.sql` mendeklarasikan `awcms_micro_news_media_objects` dengan **`owner_resource_type`/`owner_resource_id`** — referensi resource generik yang hari ini sudah menunjuk ke `blog_post`, `blog_page`, `ad`, `video_thumbnail`, dan `seo_image`. Tabelnya nyata-nyata sudah melayani lebih dari satu modul.

  > **Koreksi (langkah 5).** Revisi awal ADR ini memakai kolom `module_key text NOT NULL DEFAULT 'news_portal'` sebagai bukti utamanya — "kolom yang tak punya alasan ada kecuali tabelnya dirancang multi-modul". Itu **keliru**: `sql/041` juga membawa `CHECK (module_key = 'news_portal')`, yang melarang setiap nilai lain, dan `createPendingNewsMediaObject` tak pernah menyetel kolom itu. Jadi semua objek media berstempel `news_portal` dan kolomnya tidak membawa informasi apa pun tentang modul yang dilayani. Kesimpulan ADR ini tidak berubah — buktinya yang diperbaiki: yang membuat registry ini generik adalah `owner_resource_type`, bukan `module_key`. CHECK-nya juga ada di `awcms-mini` (warisan upstream). Dikunci `tests/integration/media-registry-module-key-constraint.integration.test.ts`.

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

Tabel **`awcms_micro_news_media_objects` TIDAK di-rename**, meski namanya kini keliru menyebut pemilik. Alasannya sama dengan §4 ADR-0025 (gap penomoran migrasi dipertahankan): nama tabel dirujuk `sql/041`/`042`/`046`, seluruh application layer, dan puluhan komentar; me-rename-nya menukar satu ketidaknyamanan kosmetik dengan risiko nyata dan diff yang tak terbaca. Pembeda pemilik yang sesungguhnya adalah `owner_resource_type` (lihat koreksi §2 soal `module_key`). Migrasi baru **menambahkan** apa yang kurang (§4), tidak menulis ulang yang sudah ada. Keputusan ini ditinjau ulang bila suatu saat ada alasan lain yang menuntut migrasi tabel itu.

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

**Positif.** Media menjadi kapabilitas platform, bukan sandera modul berita — preset `online_website` akhirnya berarti website yang utuh. Satu sumber kebenaran untuk objek media dipertahankan (nol duplikasi). Referensi `owner_resource_type`/`owner_resource_id` yang sudah ada berarti ekstraksi ini terutama memindahkan kepemilikan dan mengganti nama port, bukan memodelkan ulang data.

**Negatif / risiko yang diakui.** Ini refaktor lintas modul yang menyentuh empat modul (`news_portal`, `blog_content`, `social_publishing`, dan `media_library` baru), tiga migrasi yang sudah ada, alur presigned upload, dan test-nya — **bukan pekerjaan atomik kecil**. Ia harus dikerjakan sebagai epic bertahap dengan `bun run check` hijau di tiap langkah, bukan satu commit raksasa:

1. Daftarkan modul `media_library` + port `media_library` (di samping `news_media` yang di-deprecate) — belum memindahkan kode. **(selesai)**
2. Pindahkan registry/directory/upload-session ke `media_library`; `news_portal` mengonsumsi lewat port. **(selesai)**
3. ~~Rewire `blog_content` + `social_publishing` ke port baru; lepas `news_media`.~~
4. ~~Lepas gate R2-only dari kepemilikan `news_portal` sehingga media bekerja tanpa portal berita.~~
   → **3–4 dikerjakan sebagai SATU langkah (selesai)** — lihat koreksi di bawah.
5. Tambah preset/endpoint penyalaan, varian gambar, tipe non-gambar, dan admin media browser (§4).
   - **5a. Endpoint penyalaan enforcement (selesai)** — `GET`/`POST /api/v1/media/enforcement`, `sql/079`. Melunasi utang yang dicatat langkah 3–4: situs brosur kini punya tombolnya, bukan hanya kapabilitasnya.
   - 5b. Varian gambar/`srcset` — belum.
   - **5c. Tipe media non-gambar (selesai)** — `application/pdf`, dikenali sniffer, opt-in operator.
   - **5d. Admin media browser (selesai)** — `/admin/media`. Permukaan UI pertama modul ini; entry `navigation` pertamanya juga.

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

### Langkah 5d — admin media browser

`/admin/media`. Sampai langkah ini, seluruh permukaan media hanya bisa dijangkau dengan `curl`: langkah 5 menegakkan kesembilan permission `media.*`, tapi tak satu pun punya layar. Dua akibat konkret yang ditutup halaman ini:

- **Id objek media akhirnya bisa dilihat.** Header `admin/news-portal/ad-placements.astro` mencatat celahnya terang-terangan — "no media picker UI exists anywhere in this repo yet". Editor harus mengetik UUID `mediaObjectId` tanpa cara apa pun untuk mengetahuinya selain query database. Halaman ini menampilkan id di samping thumbnail-nya, siap disalin. Ini **bukan** picker: picker adalah komponen yang tertanam di form-form itu, pekerjaan tersendiri yang lebih besar. Mengetik UUID tetap alurnya; yang berubah, sumbernya bukan lagi database.
- **Objek yang di-soft-delete bisa dipulihkan lewat UI.** `restore` ada sejak Issue #633 dan tak pernah punya tombol.

Keputusan yang layak dicatat:

- **Baca lewat modul, tulis lewat API.** Baca SSR memanggil `listNewsMediaObjects` di dalam `withTenant` setelah memeriksa `context.permissions` — konvensi setiap halaman admin di repo ini. Mutasinya sengaja TIDAK begitu: attach/detach/restore/purge masing-masing menuntut `Idempotency-Key`, mengaudit aktornya, dan menjawab 404-vs-409 lewat `media-object-lifecycle-failure.ts`. Menyalin aturan itu ke frontmatter halaman berarti mem-fork-nya, bukan memakainya ulang.
- **Tombol yang disembunyikan bukan penegakan.** Sebuah tombol muncul hanya bila permission-nya dipegang DAN status objeknya mengizinkan transisinya. Itu kesopanan UX; servernya menolak panggilan yang sama terlepas dari itu — konvensi _navigation-visibility-is-not-authorization_ yang didokumentasikan `identity-access/module.ts`.
- **Preview opt-in, bukan opt-out.** Hanya empat tipe raster yang di-`<img>`-kan, lewat allow-list eksplisit, bukan lewat prefiks `image/`. Lihat koreksi fakta di bawah.

#### Koreksi fakta: sniffer TIDAK mengenal SVG

Catatan sisa pekerjaan sebelumnya (termasuk milik saya sendiri) menyebut sniffer MIME mengenal "4 tipe raster + SVG". **Itu salah**, dan baru ketahuan saat komentar kode yang mengklaimnya diperiksa alih-alih dipercaya:

- `media-mime-sniffer.ts` hanya mengenali **empat** signature secara positif — JPEG/PNG/WebP/GIF. Apa pun selainnya menghasilkan `undefined`, yang selalu diperlakukan finalize sebagai **tolak keras**.
- `image/svg+xml` memang ada di `NEWS_MEDIA_R2_KNOWN_MIME_TYPES` dan punya jalur override konfigurasi yang sah (`allowsSvgMimeType`, `checkNewsMediaR2SvgNotAllowed`) — tapi jalur itu tak pernah bisa menghasilkan objek SVG tersimpan, karena sniffing-lah yang menentukan, bukan allow-list. Deployment yang mengizinkan SVG tetap menolak setiap unggahan SVG.

Jadi `mime_type` di registry hari ini mustahil bernilai `image/svg+xml`. Guard preview tetap dipasang, bukan karena ada lubang hidup, melainkan karena yang membuatnya mustahil adalah fakta tentang **sniffer**, bukan tentang halaman ini — dan **5c justru ada untuk memperlebar himpunan tipe yang diterima**. Preview yang opt-in ke empat tipe raster yang diketahui inert akan fail-closed saat hari itu tiba; preview yang mempercayai prefiks `image/` akan diam-diam mulai merender apa pun yang diizinkan 5c.

**Konsekuensi untuk 5c:** menambah tipe media non-gambar bukan sekadar memperlebar allow-list konfigurasi — ia menuntut permukaan **sniffer** ikut diperlebar, karena allow-list tanpa signature yang cocok adalah no-op yang menolak semuanya. `media-r2-config.ts` sudah menyatakan ini (`config:validate` memperlakukan tipe di luar himpunan "known" sebagai hard error justru karena sniffer tak akan pernah menerimanya); catatan sisa pekerjaan yang salah itulah yang mengaburkannya.

### Langkah 5c — tipe media non-gambar (PDF)

Dikerjakan persis seperti yang diramalkan koreksi 5d di atas: yang perlu diperlebar adalah **sniffer**, bukan allow-list konfigurasi. `application/pdf` kini punya signature (`%PDF-`), entri di `MIME_TYPE_TO_EXTENSION`, dan tempat di `NEWS_MEDIA_R2_KNOWN_MIME_TYPES`.

**Tiga himpunan yang dulu identik, kini sengaja berbeda.** Ini inti langkah 5c, dan menyamakan dua di antaranya adalah kekeliruan nyata ke dua arah — keduanya senyap:

| Himpunan               | Isi                                    |
| ---------------------- | -------------------------------------- |
| Dikenali sniffer       | JPEG, PNG, WebP, GIF, **PDF**          |
| Diizinkan default      | JPEG, PNG, WebP, GIF                   |
| "Known" (boleh di-opt) | keempatnya + **PDF** + `image/svg+xml` |

- **Sniffable ⊇ allowed** adalah yang membuat entri allow-list bermakna. Tipe yang diizinkan tanpa signature adalah no-op yang menolak semuanya — persis keadaan `image/svg+xml`, dan harus tetap begitu.
- **Allowed ⊉ sniffable** adalah yang mencegah "mengenali" berubah diam-diam menjadi "mengirimkan ke semua deployment saat upgrade". PDF dikenali; tak seorang pun yang tidak memintanya mulai menerimanya.

**PDF opt-in, bukan default.** Alasannya bukan alasan SVG, dan membedakannya penting:

- SVG ditolak **permanen**: SVG yang disajikan dari domain media milik tenant mengeksekusi `<script>`-nya di origin itu. PDF dirender viewer sandbox browser dan tidak bisa men-script halaman yang menautkannya.
- Yang membuatnya opt-in justru V14.3 ("konfigurasi aman by default"): tipe yang **dikenali** codebase bukan berarti tipe yang diam-diam diterima setiap deployment yang sekadar upgrade. Memperlebar apa yang boleh diterbitkan editor ke situs live adalah keputusan operator, sekali, bukan efek samping bump versi.
- Yang diterima operator, terus terang: PDF bisa menyisipkan JavaScript dan menjadi pembawa malware/phishing. Sniffing membuktikan byte-nya PDF; ia tidak dan tidak bisa membuktikan PDF-nya aman. `security:readiness` melaporkan opt-in ini (`checkNewsMediaR2DocumentTypesOptIn`) supaya risiko sisa itu terlihat, bukan disimpulkan dari env var yang tak dibaca ulang.

Ini **bukan** penghalang yang dirobohkan ADR-0026. Yang itu menuntut menyalakan sebuah **modul domain** demi punya media sama sekali — kekeliruan pemodelan produk. Ini satu env var milik operator yang memperlebar tipe yang diterima pustaka media yang tenant-nya sudah punya.

**Efek samping yang menghidupkan guard tidur.** `ad-placement-policy.ts` memegang allow-list empat tipe sendiri, dengan komentarnya sendiri yang menyebut pemeriksaannya "saat ini redundan — mime type objek terverifikasi selalu salah satu dari empat ini". Benar saat ditulis, **salah sejak 5c**: deployment yang opt-in bisa menyimpan objek `application/pdf` terverifikasi, dan `/admin/media` (langkah 5d) justru menunjukkan id-nya kepada editor. Jadi mesin defense-in-depth yang dibangun untuk kebutuhan masa depan menjadi beban nyata tepat saat pustaka media mengenal tipe yang bukan banner — ia yang mengembalikan `AD_PLACEMENT_REFERENCE_INVALID` alih-alih merender `<img>` rusak ke portal berita live. Komentarnya dikoreksi dan guard-nya dikunci test yang diverifikasi gagal saat daftarnya "disinkronkan ulang" dengan config media.

Dicatat juga: `checkNewsMediaR2SvgNotAllowed` tidak pernah punya unit test sejak Issue #635. Sekarang punya, berdampingan dengan yang baru — keduanya mirip bentuk tapi berlawanan makna (yang satu memperingatkan konfigurasi yang tidak bekerja, yang lain memperingatkan konfigurasi yang bekerja).

**Utang yang benar-benar tersisa:** 5b (varian gambar/`srcset`). Satu fitur tersendiri, bukan pelunasan utang.

## Alternatif yang ditolak

- **Bangun `media_library` baru dari nol berdampingan dengan registry `news_media`.** Ditolak: dua sumber kebenaran untuk objek media tenant, duplikasi alur presigned/rekonsiliasi/lifecycle-orphan, dan drift yang dijamin — persis yang dilarang ADR-0025 §5.
- **Biarkan media di `news_portal`, cukup tambahkan varian di sana.** Ditolak: mengunci manajemen media di balik modul portal berita. Situs brosur, situs korporat, dan landing page adalah warga kelas satu scope website ini; menuntut mereka menyalakan `news_portal` demi mengunggah logo adalah kekeliruan pemodelan, bukan ketidaknyamanan.
- **Jadikan `blog_content` pemilik media.** Ditolak: `social_publishing` juga mengonsumsi media tanpa perlu `blog_content`, dan modul mendatang (`seo_distribution` untuk gambar OG, theming untuk aset) juga akan butuh. Media adalah infrastruktur lintas modul — System Foundation, bukan modul konten.
- **Rename `awcms_micro_news_media_objects`.** Ditolak — lihat §3.
