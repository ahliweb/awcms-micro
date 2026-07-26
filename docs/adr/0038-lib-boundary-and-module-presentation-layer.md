# ADR-0038 — Batas `src/lib` dan lapisan `presentation` milik modul

- **Status:** Accepted
- **Tanggal:** 2026-07-26
- **Pengambil keputusan:** @ahliweb
- **Terkait:** Issue #371; Issue #369, #370 (serumpun — lapisan presentasi tanpa kontrak); ADR-0028, ADR-0029, ADR-0031, ADR-0032, ADR-0033 (lima modul yang kodenya terlanjur tinggal di `src/lib`); ADR-0036 (`MODULE_CONTRACT_VERSION` 2.0.0, satu registry base)

## Konteks

Batas modul AWCMS-Micro dijaga oleh empat gerbang: `modules:dag:check`,
`modules:compose:check`, `modules:composition:inventory:check`, dan
`module-contract.ts`. Keempatnya hanya membaca `src/modules`.

Diukur pada `0a8c3ba5` (v1.1.0), `src/lib/` berisi 22 namespace terisi dan
sekitar 20.000 baris — seluruhnya **di luar** jangkauan gerbang-gerbang itu.
Untuk `database/`, `auth/`, `resilience/`, `redis/` hal itu wajar: mereka
infrastruktur teknis lintas-modul dan memang bukan milik siapa pun.

Yang tidak wajar: **lima namespace menyandang nama modul yang sudah ada** dan
berisi logika milik modul tersebut.

| Namespace lib        | Modul pemilik      | Isi                                                                      |
| -------------------- | ------------------ | ------------------------------------------------------------------------ |
| `src/lib/comments`   | `comments`         | `comments-client.ts`, `comments-admin-client.ts`                         |
| `src/lib/newsletter` | `newsletter`       | `newsletter-admin-client.ts`                                             |
| `src/lib/theming`    | `theming`          | `theme-media.ts`, `theme-preview.ts`, `theme-public-css.ts`              |
| `src/lib/seo`        | `seo_distribution` | `discovery-providers.ts`, `discovery-route.ts`, `redirect-middleware.ts` |
| `src/lib/search`     | `site_search`      | `search-sources.ts`                                                      |

Arah ketergantungannya bahkan sudah terbalik: komentar header
`seo-distribution/application/seo-discovery-service.ts` dan
`public-seo-tenant-resolution.ts` menunjuk `src/lib/seo/` sebagai composition
root mereka — sebuah modul merujuk **ke atas**, ke namespace yang menyandang
namanya sendiri, lewat jalur yang validator DAG tidak bisa lihat.

**Ini gejala, bukan kecerobohan.** Kontrak modul mengenal `domain`,
`application`, dan `infrastructure`, dan **tidak menyediakan tempat bagi kode
presentasi/pengiriman**: composition root rute, glue middleware, dan skrip klien
browser. Ketika skrip klien `comments` harus keluar dari berkas `.astro`,
satu-satunya rumah yang tersedia adalah `src/lib/comments/`. Konsumennya
membuktikan hal itu: `src/components/comments/CommentsSection.astro` dan
`src/pages/admin/comments/index.astro`.

Hasilnya `src/lib` tumbuh menjadi **sistem modul kedua yang tidak dijaga
gerbang mana pun** — dan tanpa keputusan eksplisit, ia akan terus tumbuh setiap
kali sebuah modul butuh kode yang menyentuh browser atau merakit rute.

Catatan penting dari investigasi Issue #371, **dikoreksi pada review PR #374**:
enam dependensi dua-arah yang sempat terlihat pada graf memang semuanya edge
antar `README.md`, bukan antar kode — jadi tidak ada SIKLUS antar modul.

Tapi klaim awal "nol impor relatif lintas-modul di seluruh `src/modules`"
**salah**, dan tidak boleh dipakai sebagai dasar keputusan apa pun. Pengukuran
ulang menemukan **~80** impor relatif lintas-modul yang sudah ada jauh sebelum
ADR ini (`recordAuditEvent` dari `logging`, port adapter, `permissionKey` dari
`identity_access`, dan seterusnya). Klaim itu lahir dari memeriksa `_shared`
plus tiga pasangan modul tertentu, lalu menggeneralisasi ke seluruh pohon.

Yang benar-benar dijaga hari ini adalah **dependensi yang DIDEKLARASIKAN**
(`modules:dag:check` memvalidasi registry), bukan impor tingkat berkas. Tidak
ada gerbang yang memeriksa apakah sebuah impor relatif lintas-modul sesuai
dengan `dependencies` modul itu — termasuk untuk `presentation/` yang ADR ini
perkenalkan. Itu lubang nyata dan tercatat sebagai pekerjaan lanjutan (§Risiko),
bukan sesuatu yang ADR ini selesaikan.

## Keputusan

### 1. Definisi `src/lib`

`src/lib/` **hanya** berisi infrastruktur teknis yang **tidak menyandang nama
domain**: `auth`, `cache`, `config`, `database`, `deployment`, `html`, `i18n`,
`integration`, `jobs`, `logging`, `observability`, `performance`, `redis`,
`resilience`, `security`, `semver`, `tenant`, `ui`.

Uji kepemilikan yang dipakai: **sebuah berkas milik `src/lib` bila menghapus
modul mana pun tidak membuatnya kehilangan makna.** Bila berkas itu hanya masuk
akal karena ada satu modul tertentu, ia milik modul itu.

### 2. Lapisan `presentation` milik modul

Kode presentasi/pengiriman sebuah modul tinggal di
`src/modules/<modul>/presentation/`. Lapisan ini mencakup:

- **composition root rute** — perakitan port + adapter untuk sebuah permukaan
  HTTP (`seo-distribution/presentation/discovery-providers.ts`);
- **glue pengiriman** — kode yang mengubah keluaran data-polos sebuah service
  menjadi `Response` nyata, termasuk wiring middleware
  (`seo-distribution/presentation/redirect-middleware.ts`);
- **skrip klien browser** — modul yang di-`import` dari `<script>` sebuah
  `.astro` (`comments/presentation/comments-client.ts`).

Aturan arah tetap: `presentation` boleh mengimpor `application`/`domain` milik
modulnya sendiri, adapter port modul lain, dan `src/lib`. `domain` dan
`application` **tidak pernah** mengimpor `presentation`. Ini persis alasan
mengapa composition root tidak boleh diletakkan di `application` — ia satu-satunya
lapisan yang boleh tahu modul lain secara konkret.

### 3. Lapisan tidak dienumerasi dalam kode — ini konvensi direktori

`module-contract.ts` **tidak** mengenumerasi `domain`/`application`/`infrastructure`
di mana pun, dan tidak ada skrip yang memvalidasi nama subdirektori modul.
Lapisan selalu berupa konvensi direktori yang ditegakkan lewat review dan
dokumen. `presentation` mengikuti aturan yang sama: **tidak ada mekanisme baru
yang ditambahkan ke kontrak modul**, karena menambah enumerasi untuk satu lapisan
saja akan mengarang kontrak yang tidak dipunyai tiga lapisan lainnya. Yang
ditegakkan mesin adalah keputusan §4 di bawah, bukan penamaan lapisannya.

### 4. Gerbang: `src/lib/<x>/` tidak boleh bertabrakan nama dengan `moduleKey`

`bun run modules:dag:check` (`scripts/validate-module-graph.ts`) diperluas dengan
gerbang kedua: ia membaca daftar subdirektori `src/lib/` dan **gagal** bila ada
namespace yang bertabrakan dengan sebuah `moduleKey`, baik

- **persis** (nama direktori, dinormalisasi `-`→`_`, sama dengan `moduleKey`), maupun
- lewat **alias domain terdaftar** (`seo` → `seo_distribution`, `search` →
  `site_search`) — tanpa ini, dua dari lima kasus historis akan lolos karena
  namanya bukan `moduleKey` harfiah.

Pesan gagalnya menyebutkan modul pemilik dan tujuan pemindahan
(`src/modules/<modul>/presentation/`).

Gerbang ini punya tes yang **menyuntikkan pelanggaran** dan membuktikan gerbangnya
benar-benar menolak — termasuk memanggil `main()` skrip itu sendiri di atas pohon
direktori fixture dan memeriksa exit code 1. Gerbang yang belum pernah terlihat
gagal adalah gerbang yang belum terbukti.

### 5. Satu pengecualian yang disengaja dan tercatat: `logging`

`src/lib/logging/` bertabrakan persis dengan modul `logging`, dan **tetap di
`src/lib`**. Alasannya sudah tercatat di `src/modules/logging/README.md`
§"Bukan bagian modul ini" jauh sebelum gerbang ini ada: `logger.ts`,
`error-sanitizer.ts`, dan `correlation-response.ts` adalah primitif logger
terstruktur yang bebas database, dipakai ~139 berkas lintas seluruh codebase
termasuk `src/middleware.ts`. Modul `logging` memiliki **audit trail**
(`awcms_micro_audit_events`) — hal yang berbeda yang kebetulan berbagi satu kata.

Pengecualian ini ditulis eksplisit sebagai entri bertanda alasan di
`INFRASTRUCTURE_NAMESPACE_EXEMPTIONS`, bukan sebagai titik buta deteksi: sebuah
tes membuktikan bahwa dengan tabel pengecualian dikosongkan, `logging` **memang**
terdeteksi sebagai tabrakan. Menambah entri baru ke tabel ini **wajib lewat ADR**.

### 6. `src/lib/files/` dan `src/lib/errors/` dihapus

Keduanya kosong — hanya berisi `.gitkeep` ter-track. Perancah mati yang
menyiratkan struktur yang tidak pernah ada.

## Konsekuensi

**Positif.**

- Batas modul kini benar-benar tertutup: tidak ada lagi jalur sah bagi kode milik
  modul untuk tinggal di luar `src/modules`, dan usaha membuatnya kembali gagal di
  CI, bukan di review.
- `seo_distribution` tidak lagi mengimpor/merujuk ke atas ke `src/lib/seo`; semua
  composition root SEO kini berada di dalam batas modulnya.
- Kode presentasi punya rumah sah, sehingga tekanan yang melahirkan lima namespace
  itu hilang di sumbernya — bukan sekadar dibersihkan sekali.
- Riwayat berkas terjaga: seluruh pemindahan memakai `git mv`, sehingga `git log
--follow` dan `git blame` tetap utuh untuk kode keamanan-sensitif seperti
  `redirect-middleware.ts`.

**Negatif / biaya.**

- Impor relatif di sepuluh berkas yang dipindah bertambah satu tingkat
  (`../database/` → `../../../lib/database/`). Diterima: kedalaman impor adalah
  harga yang jauh lebih murah daripada batas modul yang bocor.
- Dua tabel kecil (`MODULE_OWNED_LIB_NAMESPACE_ALIASES` dan
  `INFRASTRUCTURE_NAMESPACE_EXEMPTIONS`) harus dirawat manusia. Keduanya sengaja
  dibuat berukuran kecil, dicetak dalam pesan gagal, dan diikat tes.
- Gerbang ini berbasis **nama**, bukan analisis kepemilikan sesungguhnya. Sebuah
  namespace `src/lib` bernama netral yang diam-diam berisi logika satu modul tetap
  lolos. Gerbang ini menutup mode gagal yang **terbukti terjadi**, bukan seluruh
  ruang kemungkinan.

**Netral.**

- Registry tetap **22 modul**; tidak ada modul baru, tidak ada perubahan
  `MODULE_CONTRACT_VERSION`, tidak ada migration, tidak ada perubahan
  OpenAPI/AsyncAPI. Pemindahan murni, tanpa perubahan perilaku.
- `presentation/` saat ini hanya ada pada lima modul; modul lain menambahkannya
  hanya bila memang memerlukannya.

## Alternatif yang ditolak

1. **Biarkan saja, cukup dokumentasikan.** Ditolak: konvensi tanpa gerbang persis
   yang gagal di sini — lima namespace tumbuh melewati lima ADR admission modul
   tanpa ada yang menghentikannya.
2. **Enumerasi lapisan modul di `module-contract.ts` dan validasi nama
   subdirektori.** Ditolak untuk saat ini: tiga lapisan yang sudah ada pun tidak
   dienumerasi, sehingga menambahkannya hanya untuk `presentation` mengarang
   mekanisme baru untuk masalah yang bukan penyebab insiden ini. Penyebabnya adalah
   `src/lib` yang tak terjaga (§4), bukan penamaan direktori.
3. **Taruh skrip klien browser di `src/components/` atau `infrastructure/`.**
   Ditolak: `src/components` adalah wilayah bersama lintas modul (masalah yang sama,
   nama folder berbeda), sementara `infrastructure/` di repo ini berarti adapter
   keluar (DB/provider), bukan pengiriman ke browser — memuati ulang maknanya akan
   mengaburkan lapisan yang sudah jelas.
4. **Pindahkan `src/lib/logging/` ke modul `logging` demi gerbang tanpa
   pengecualian.** Ditolak: ~139 berkas termasuk `src/middleware.ts` bergantung
   padanya sebagai primitif bebas database; memindahkannya akan membuat middleware
   dan setiap modul bergantung pada satu modul domain hanya untuk bisa mencatat log.
   Pengecualian yang tercatat lebih jujur daripada gerbang yang memaksa arsitektur
   yang salah.
