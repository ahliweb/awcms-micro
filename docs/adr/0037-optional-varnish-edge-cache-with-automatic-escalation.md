# ADR-0037 — Edge cache Varnish opsional dengan eskalasi otomatis

- **Status:** Accepted
- **Tanggal:** 2026-07-25
- **Pengambil keputusan:** @ahliweb
- **Terkait:** Issue #353; ADR-0025, ADR-0027, ADR-0030, ADR-0034; Issue #323, #324 (insiden saturasi pool), Issue #743 (work class berbatas)

## Konteks

Setiap permintaan halaman publik menempuh jalur penuh Astro SSR →
PostgreSQL. Untuk konten yang identik bagi semua pengunjung anonim —
beranda, daftar dan detail artikel, sitemap, feed, hasil pencarian —
pekerjaan database yang sama diulang untuk setiap pembaca.

Dua insiden yang sudah tercatat di repositori ini memperlihatkan mode gagal
yang sama: pada Issue #324 slot pool bocor sampai pool jenuh, dan pada
Issue #323 kejenuhan itu merembet menjadi 500 di admin. Ketika pool jenuh,
pembaca anonim dan operator yang sedang menyunting berebut sumber daya yang
sama, padahal hanya salah satunya yang benar-benar membutuhkan database.

ADR-0030 sudah memasang fondasi Redis opsional untuk cache **di dalam**
aplikasi. Fondasi itu tetap relevan, tetapi ia tidak menghilangkan biaya
render SSR dan tidak melindungi apa pun ketika proses aplikasi itu sendiri
yang antre. Lapisan yang hilang adalah cache HTTP **di depan** aplikasi.

Menambahkan cache di depan aplikasi multi-tenant tanpa aturan bersama
menimbulkan risiko yang tidak simetris: hit rate yang rendah hanya
membuang peluang, tetapi satu halaman yang bocor lintas pembaca atau
lintas tenant adalah insiden keamanan.

## Keputusan

AWCMS-Micro mengadopsi **Varnish sebagai edge cache opsional** dengan
topologi Traefik (TLS) → Varnish → aplikasi → PostgreSQL, dan dengan **dua
lapis aktivasi yang sengaja dibedakan**:

1. **Infrastruktur — opt-in operator.** Container Varnish adalah overlay
   (`docker-compose.varnish.yml`, satu service Coolify), mengikuti preseden
   ADR-0030. Tidak ada di stack default.
2. **Perilaku — otomatis.** Aplikasi menentukan sendiri, per-response,
   apakah sebuah response boleh di-cache, dan **menaikkan TTL-nya sendiri**
   ketika ia mengukur tekanan database, lalu menurunkannya kembali setelah
   tekanan reda. Tidak ada yang perlu dinyalakan manual saat beban naik.

Pemisahan ini disengaja dan perlu dinyatakan jujur: kode aplikasi tidak
dapat — dan tidak seharusnya — menjalankan container baru sendiri. Yang
otomatis adalah **seberapa keras cache diminta bekerja**, dan itulah bagian
yang benar-benar menentukan berapa banyak permintaan sampai ke database.

### Sinyal eskalasi

Pengendali membaca dua sinyal yang sudah diukur aplikasi, tanpa I/O
tambahan sama sekali:

- **Saturasi work-class foreground** (`getWorkClassSaturation()`) —
  `critical_transaction`, `interactive`, `reporting`. Penantri dalam antrean
  dihitung sebagai permintaan yang tidak terlayani, sehingga kelas yang
  penuh dengan antrean melaporkan di atas 100 %.
  `background_sync`/`maintenance` sengaja dikecualikan: job pemeliharaan
  yang panjang memang memarkir slotnya berlama-lama, dan membiarkan itu
  memicu boost akan membuat eskalasi menyala mengikuti jadwal, bukan
  mengikuti tekanan yang benar-benar dirasakan pembaca.
- **Circuit breaker database.** Status selain `closed` langsung
  meng-eskalasi tanpa syarat: saat itu database sudah menolak pekerjaan,
  dan menyajikan halaman yang sedikit basi jelas lebih baik bagi pembaca
  daripada 503. Ini filosofi degradasi yang sama dengan fallback
  `DATABASE_BUSY` milik `withTenant`, satu lapis lebih ke luar.

Pelepasan memakai histeresis 20 poin **dan** tahan minimum 30 detik,
sehingga beban yang berosilasi di sekitar ambang tidak membalik-balik TTL
setiap permintaan — pembalikan seperti itu justru memecah cache alih-alih
melindungi database.

## Invariant arsitektur

1. **Default-deny.** Sebuah response tidak cacheable kecuali rutenya ada di
   allowlist publik eksplisit (`edge-cache-policy.ts`). Menambah rute ke
   allowlist adalah tindakan sadar yang bisa direview.
2. **Tidak pernah menyentuh sesi.** Permintaan yang membawa cookie sesi
   di-bypass; response yang membawa `Set-Cookie` tidak pernah disimpan.
3. **Cache key memisahkan tenant dan locale.** Host masuk ke key (tenant
   di-resolve per host), dan `Vary: Cookie` dikirim pada setiap response
   cacheable; VCL rujukan menormalkan header `Cookie` menjadi hanya cookie
   locale sebelum lookup, sehingga varian tersimpan per-locale, bukan
   per-pengunjung.
4. **Fail-open.** Varnish mati atau dihapus ⇒ Traefik langsung ke aplikasi,
   tanpa penurunan fungsi. Ini juga prosedur rollback-nya.
5. **Aplikasi otoritatif atas TTL** lewat `Surrogate-Control`, yang
   dikonsumsi dan dibuang oleh cache sehingga tidak pernah sampai ke
   browser. Browser mendapat `Cache-Control` terpisah yang konservatif.
6. **Handler yang sudah menetapkan `Cache-Control` sendiri tidak ditimpa** —
   lapisan ini menambah instruksi untuk cache bersama, bukan menilai ulang
   rute yang sudah memikirkan kesegarannya sendiri.
7. **PostgreSQL tetap otoritatif.** Cache tidak pernah menjadi sumber
   kebenaran; setiap entri dapat dihitung ulang.
8. **Tidak menambah latensi.** Resolusi mode hanya membaca penghitung
   dalam-proses; tidak ada panggilan database maupun jaringan di jalur
   response.

## Pertahanan berlapis untuk kebocoran lintas-pembaca

Risiko paling merusak di lapisan ini adalah satu pembaca menerima halaman
pembaca lain. Risiko itu ditutup di tiga tempat yang saling bebas — satu
saja sudah cukup:

1. kebijakan aplikasi (tanpa cookie sesi, tanpa `Set-Cookie`, rute
   allowlist, status 200 saja);
2. cache key (host + path + `Vary`);
3. VCL itu sendiri, yang mem-`pass` permintaan bercookie sesi dan menolak
   menyimpan response ber-`Set-Cookie`, apa pun kata aplikasi.

Lapis ketiga bukan sekadar redundansi seremonial. Cookie yang diantrekan
lewat `context.cookies` Astro (visitor key milik visitor-analytics) baru
digabungkan ke response **setelah** middleware selesai, sehingga tidak
terlihat oleh kebijakan sisi aplikasi. Hanya di VCL pemeriksaan itu bisa
lengkap.

## Alternatif yang dipertimbangkan

### Mengandalkan Redis (ADR-0030) saja

Sudah ada dan tenant-safe, tetapi cache di dalam proses tetap membayar
render SSR penuh dan tidak menolong ketika prosesnya sendiri yang antre.
Ditolak sebagai pengganti; keduanya justru saling melengkapi.

### Cache di Cloudflare (proxy oranye)

Menghapus trafik jauh sebelum server, tetapi memindahkan kontrol
invalidasi dan aturan tenant ke bidang kendali pihak ketiga, dan hostname
produksi keluarga ini sengaja grey-cloud. Tidak ditolak selamanya —
header yang dikirim aplikasi sudah standar dan akan dihormati Cloudflare
bila suatu saat diaktifkan.

### Menjadikan Varnish wajib di stack utama

Menyeragamkan deployment, tetapi menjadikan cache sebagai dependency
startup dan memperbesar beban operasi setiap instalasi kecil. Ditolak
dengan alasan yang sama seperti Redis pada ADR-0030.

### TTL statis tanpa eskalasi

Paling sederhana, tetapi memaksa operator memilih satu angka untuk dua
situasi yang sangat berbeda: TTL yang aman saat tenang terlalu pendek untuk
menolong saat tertekan, dan TTL yang menolong saat tertekan terlalu basi
untuk hari biasa. Eskalasi otomatis menghapus pilihan itu.

### Purge otomatis per-publikasi sejak awal

Menarik, tetapi transisi publikasi berada di dalam transaksi database di
dua modul, sementara invalidasi wajib berada **di luar** transaksi
(invariant yang sama dengan ADR-0030). Ditunda secara sadar ke issue
terpisah; TTL sudah membatasi kebasian, dan `bun run edge-cache:purge`
menyediakan jalur eksplisit untuk kasus yang tidak boleh menunggu TTL.

## Konsekuensi

### Positif

- pembaca anonim berulang tidak lagi membangkitkan pekerjaan database;
- gangguan database berubah menjadi halaman agak basi, bukan 503, selama
  jendela `stale-if-error`;
- perlindungan menguat sendiri tepat saat dibutuhkan, tanpa intervensi
  operator;
- rollback cukup dengan mengarahkan proxy kembali ke port aplikasi;
- header yang dikirim adalah standar HTTP, jadi CDN lain dapat menggantikan
  Varnish tanpa perubahan kode.

### Negatif dan batasan

- kebasian konten publik kini terikat pada TTL, bukan nol — angka default
  60 detik adalah kontrak yang harus disadari editor;
- allowlist rute adalah daftar manual; rute publik baru **tidak** otomatis
  ter-cache, dan itu memang arah kegagalan yang dipilih;
- purge per-publikasi belum otomatis (lihat alternatif di atas);
- pengunjung yang benar-benar baru (belum punya cookie visitor) selalu
  meleset dari cache, karena response-nya memasang cookie — konsekuensi
  langsung dari invariant 2;
- mode eskalasi bersifat per-proses; beberapa instance dapat berada pada
  mode berbeda pada saat yang sama, dan itu diterima karena masing-masing
  mengukur tekanan pool-nya sendiri;
- Varnish menambah satu komponen operasional yang perlu dipantau, meskipun
  tidak ada yang bergantung padanya.

## Keamanan dan privasi

- Endpoint invalidasi hanya menerima permintaan dari jaringan privat **dan**
  dengan token bersama; token kosong menonaktifkan invalidasi, bukan
  membukanya.
- Pola path pada permintaan purge dibatasi himpunan karakter sebelum
  mencapai mesin regex cache, karena pola itu ikut membentuk ekspresi ban.
- Metrik cache tidak pernah memakai hostname atau path sebagai label —
  hostname publik mengidentifikasi tenant.
- `Surrogate-Control` tidak pernah sampai ke klien; header `Via`/`X-Varnish`
  dihapus di `vcl_deliver`.
- Rute anti-enumerasi (`/comments`, `/newsletter`) dikecualikan secara
  eksplisit, bukan karena kebetulan tidak masuk allowlist: response-nya
  memang dibuat seragam, dan meng-cache-nya akan menambahkan oracle
  konsistensi pada endpoint yang dirancang tidak punya oracle.
