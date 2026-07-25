# Edge cache Varnish (opsional) — Issue #353, ADR-0037

Cache HTTP bersama di depan aplikasi. Tujuannya satu dan sempit:
**menghapus pekerjaan database yang berulang untuk pembaca anonim**,
sehingga slot pool tersisa untuk transaksi yang memang tidak bisa dilayani
dari cache.

```
Traefik (TLS)  →  Varnish  →  aplikasi (Astro SSR)  →  PostgreSQL
                  opsional
```

Varnish **opsional**. Menghapusnya harus meninggalkan situs yang berfungsi
penuh — itu invariant fail-open ADR-0037, sekaligus prosedur rollback-nya.

## Dua lapis aktivasi

Perbedaan ini penting dan sering disalahpahami:

| Lapis             | Siapa yang mengaktifkan              | Kapan                                                                        |
| ----------------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| Container Varnish | **Operator**, sekali, lewat overlay  | Saat memutuskan deployment ini butuh cache                                   |
| Agresivitas cache | **Aplikasi, otomatis, per-response** | Setiap kali aplikasi mengukur tekanan database — naik sendiri, turun sendiri |

Kode aplikasi tidak menjalankan container. Yang otomatis adalah seberapa
keras cache diminta bekerja, dan itulah bagian yang menentukan berapa
banyak permintaan benar-benar sampai ke database.

### Bagaimana eskalasi otomatis memutuskan

Pengendali (`src/lib/cache/edge-cache-pressure.ts`) membaca dua sinyal yang
sudah diukur aplikasi — tanpa I/O tambahan, jadi tidak menambah latensi:

- **Utilisasi work-class foreground** (`critical_transaction`,
  `interactive`, `reporting`). Penantri dalam antrean dihitung sebagai
  permintaan yang tidak terlayani, sehingga kelas penuh berantrean
  melaporkan di atas 100 %. `background_sync`/`maintenance` sengaja
  diabaikan: job pemeliharaan panjang memang memarkir slotnya, dan
  membiarkan itu memicu boost akan membuat eskalasi mengikuti jadwal,
  bukan mengikuti tekanan yang dirasakan pembaca.
- **Circuit breaker database.** Status selain `closed` langsung
  meng-eskalasi tanpa syarat — saat itu database sudah menolak pekerjaan.

Masuk boost pada `EDGE_CACHE_PRESSURE_THRESHOLD_PERCENT` (default 70).
Keluar hanya bila tekanan turun 20 poin di bawah ambang **dan** boost sudah
bertahan minimal 30 detik. Tanpa histeresis itu, beban yang berosilasi di
sekitar ambang akan membalik-balik TTL setiap permintaan dan justru memecah
cache alih-alih melindungi database.

## Apa yang boleh di-cache

Default-deny. Sebuah response hanya cacheable bila **semua** syarat ini
terpenuhi (`src/lib/cache/edge-cache-policy.ts`):

- metode `GET`/`HEAD`, status `200`;
- rutenya ada di allowlist publik: `/`, `/blog/**`, `/news/**`, `/search`,
  `/sitemap.xml`, `/sitemap-*.xml`, `/feed.xml`, `/atom.xml`, `/feed.json`,
  `/robots.txt`, `/theming/tokens.css`;
- permintaan **tidak** membawa cookie sesi maupun header `Authorization`;
- response **tidak** memasang `Set-Cookie`;
- handler rute belum menetapkan `Cache-Control` yang privat.

Denylist diperiksa **sebelum** allowlist, sehingga rute baru yang kebetulan
bersarang di bawah prefix yang diizinkan tidak bisa lolos begitu saja.
`/comments` dan `/newsletter` dikecualikan secara eksplisit: keduanya
permukaan anti-enumerasi yang response-nya sengaja seragam (#271, #272), dan
meng-cache-nya akan menambahkan oracle konsistensi pada endpoint yang
dirancang tidak punya oracle.

**Rute publik baru tidak otomatis ter-cache.** Itu arah kegagalan yang
dipilih: hit rate rendah hanya membuang peluang, sedangkan satu halaman
yang bocor lintas pembaca adalah insiden.

### Kenapa pengunjung pertama selalu meleset

Pengunjung yang belum punya cookie visitor-analytics menerima response
ber-`Set-Cookie`, dan response ber-`Set-Cookie` tidak pernah disimpan.
Konsekuensi langsung dari invariant "tidak pernah menyentuh sesi", dan
diterima: kunjungan berikutnya dari orang yang sama sudah dapat dilayani
dari cache. Bila sebuah deployment menginginkan hit rate maksimum pada
kunjungan pertama, matikan `visitor_analytics` — jangan longgarkan aturan
cookie-nya.

## Menyalakan

```bash
cp config/varnish.env.example .env.varnish
# ganti EDGE_CACHE_PURGE_TOKEN dengan rahasia deployment
docker compose --env-file .env --env-file .env.varnish \
  -f docker-compose.yml -f docker-compose.varnish.yml up --build
```

Trafik lalu masuk lewat port **8080** (Varnish), bukan 4321 (aplikasi) —
arahkan reverse proxy / pemetaan domain Coolify ke 8080. Untuk topologi
produksi immutable, ganti `docker-compose.yml` dengan
`docker-compose.prod.yml`.

Pada Coolify, tambahkan satu service `varnish` di stack yang sama, mount
`deploy/varnish/default.vcl`, lalu ubah port yang di-expose domain dari
4321 ke 8080. Traefik tetap yang memegang TLS; tidak ada yang perlu diubah
di sisi sertifikat.

## Verifikasi

```bash
bun run edge-cache:health
```

Melaporkan konfigurasi efektif, mode saat ini, tekanan yang diukur, dan —
bila endpoint invalidasi dikonfigurasi — apakah endpoint itu **menolak**
BAN tanpa token. Sengaja diuji tanpa token: 2xx di situ berarti siapa pun
di jaringan dapat mengosongkan cache, dan itu membuat perintah ini keluar
dengan status gagal. Angka tekanannya milik proses CLI itu sendiri, bukan
armada yang melayani.

Verifikasi jalur nyata dari luar:

```bash
# MISS lalu HIT pada permintaan kedua
curl -sI https://<domain>/ | grep -i '^x-cache:'
curl -sI https://<domain>/ | grep -i '^x-cache:'

# halaman admin tidak boleh pernah cacheable
curl -sI https://<domain>/admin | grep -i '^x-awcms-edge-cache:'   # bypass

# Surrogate-Control tidak boleh bocor ke klien
curl -sI https://<domain>/ | grep -i '^surrogate-control:'          # kosong
```

`X-AWCMS-Edge-Cache` sengaja hanya bernilai `cacheable`/`bypass` — ia tidak
mengungkap mode eskalasi, karena mode itu memberi tahu publik bahwa
database sedang tertekan.

### Bukti lapangan VCL (2026-07-25)

`deploy/varnish/default.vcl` bukan hanya dikompilasi — ia dijalankan pada
**Varnish 7.7.3 sungguhan** dengan backend tiruan, dan setiap aturannya
diperiksa satu per satu:

| Yang diuji                      | Hasil                                                       |
| ------------------------------- | ----------------------------------------------------------- |
| Halaman publik diminta dua kali | MISS lalu **HIT**, backend hanya dipukul sekali             |
| Permintaan dengan cookie sesi   | Selalu MISS — backend dipukul setiap kali (bypass benar)    |
| Permintaan dengan cookie locale | MISS lalu **HIT** — varian per-locale, bukan per-pengunjung |
| `/admin` dua kali               | Tidak pernah HIT                                            |
| Response ber-`Set-Cookie`       | Tidak pernah disimpan                                       |
| BAN tanpa token / token salah   | **403**                                                     |
| BAN dengan token benar          | 200, dan permintaan berikutnya kembali MISS                 |

Pengujian itu menemukan satu cacat nyata: `Surrogate-Control` masih
terkirim ke klien pada response yang **tidak** di-cache, karena dulu hanya
dibuang di cabang cacheable. Sekarang dibuang tanpa syarat di
`vcl_deliver`, dan diverifikasi ulang setelah perbaikan.

### Bukti lapangan pada instance staging nyata (2026-07-25)

Diukur pada instance staging `awcms-micro-staging.ahlikoding.com` — aplikasi
sungguhan, PostgreSQL 18.4 sungguhan, satu tenant terkonfigurasi — dengan
Varnish 7.7.3 di depannya. Setiap baris 20 permintaan; `db_xact` adalah delta
`pg_stat_database.xact_commit` untuk database staging, jadi ia menghitung
pekerjaan database **nyata**, bukan proksi.

| Rute           | Tanpa cache (db_xact / rata-rata) | Dengan cache (db_xact / rata-rata) | Pengurangan kerja DB |
| -------------- | --------------------------------- | ---------------------------------- | -------------------- |
| `/`            | 163 / 24,8 ms                     | 2 / 1,7 ms                         | −98,8 %              |
| `/sitemap.xml` | 76 / 19,2 ms                      | 1 / 3,7 ms                         | −98,7 %              |
| `/feed.xml`    | 60 / 16,8 ms                      | 1 / 3,3 ms                         | −98,3 %              |

Angka "tanpa cache" diambil lewat Varnish yang sama dengan
`EDGE_CACHE_ENABLED=false`, sehingga satu-satunya variabel yang berubah adalah
kebijakan cache — bukan jalur jaringan. Hasil ini direproduksi ulang setelah
satu siklus deploy penuh (19 HIT dari 20, `db_xact` 1–4).

Aturan keamanannya diverifikasi pada instance yang sama, bukan hanya di lab:

| Yang diuji                    | Hasil                                       |
| ----------------------------- | ------------------------------------------- |
| Halaman publik, 2×            | HIT — backend tidak dipukul lagi            |
| Permintaan dengan cookie sesi | `bypass`, selalu MISS                       |
| `/admin`, 2×                  | Tidak pernah HIT                            |
| `/api/v1/health`, 2×          | `bypass`, selalu MISS                       |
| BAN tanpa token / token salah | **403**                                     |
| BAN token benar               | 200, dan permintaan berikutnya kembali MISS |
| `Surrogate-Control` ke klien  | Tidak pernah muncul, pada rute mana pun     |

### Bila Cloudflare ikut berada di depan (record ter-proxy)

Diverifikasi pada staging 2026-07-25 dengan record Cloudflare **ter-proxy**
(orange cloud): rantai lengkapnya Cloudflare → Traefik → Varnish → aplikasi,
dan permintaan publik ke halaman utama mengembalikan `x-cache: HIT` — cache
di repo ini tetap yang melayani.

Dua hal yang perlu diketahui operator:

- **Cloudflare tidak ikut menyimpan HTML-nya** (`cf-cache-status: DYNAMIC`),
  karena `EDGE_CACHE_BROWSER_TTL_SECONDS=0` menghasilkan
  `Cache-Control: public, max-age=0, must-revalidate`. Ini perilaku yang
  diinginkan: tidak ada lapisan cache kedua yang diam-diam memperpanjang
  kebasian, dan sebuah purge di Varnish langsung terasa oleh pembaca. Menaikkan
  `EDGE_CACHE_BROWSER_TTL_SECONDS` akan mengubah itu — Cloudflare mulai
  menyimpan, dan purge Varnish tidak lagi cukup.
- **Sertifikat yang dilihat publik adalah milik Cloudflare**, bukan Let's
  Encrypt. Let's Encrypt tetap dipakai di **origin** (Traefik). Keduanya benar
  dan berbeda lapisan; jangan simpulkan penerbitan gagal hanya karena
  `openssl s_client` dari internet menunjukkan penerbit Cloudflare.

## Invalidasi

TTL adalah kontrak kesegaran utama: tanpa purge apa pun, sebuah suntingan
terlihat oleh pembaca anonim paling lama selambat
`EDGE_CACHE_DEFAULT_TTL_SECONDS` (default 60 detik).

Untuk perubahan yang tidak boleh menunggu TTL:

```bash
bun run edge-cache:purge -- --host=tenant.example.com
bun run edge-cache:purge -- --host=tenant.example.com --path='^/blog/'
```

`--host` wajib dan merupakan batas tenant di dalam cache key: sebuah purge
tidak pernah bisa menjangkau di luar hostname yang disebutnya. Pola path
dibatasi himpunan karakter sebelum dikirim, karena pola itu ikut membentuk
ekspresi ban di dalam cache.

Cache menerima BAN hanya dari jaringan privat **dan** dengan token yang
cocok. Token kosong **mematikan** invalidasi, bukan membukanya.

### Purge otomatis saat publikasi berubah (Issue #359)

Sejak Issue #359 invalidasi berjalan **sendiri** ketika konten publik
berubah — tidak perlu operator mengingat menjalankan perintah di atas.
Permukaan yang terhubung: `publish`, `archive`, `restore`, `PATCH`, dan
`DELETE` artikel blog, plus job publikasi terjadwal.

Tiga aturan yang membentuk implementasinya, masing-masing karena mode gagal
yang pernah dialami repositori ini:

1. **Selalu di luar transaksi database.** Menahan koneksi pool selama
   panggilan HTTP ke cache adalah bentuk yang menjenuhkan pool pada Issue
   #324. Pemanggilan terjadi setelah `withTenant` selesai, dan hanya ketika
   handler benar-benar sukses — `404`/`422`/fallback `503` tidak mengubah
   konten publik apa pun.
2. **Fail-open mutlak.** Publikasi yang sudah commit tidak pernah berubah
   menjadi gagal karena cache tak terjangkau; TTL tetap jaring pengamannya.
3. **Nol pekerjaan database bila cache tidak dikonfigurasi.** Pemeriksaan
   konfigurasi mendahului pencarian hostname, sehingga deployment tanpa edge
   cache tidak membayar satu query pun per publikasi.

Yang di-purge adalah **seluruh host**, bukan hanya URL yang berubah:
menerbitkan satu artikel juga mengubah daftar, halaman tag/kategori,
sitemap, dan feed. Mendaftar semuanya secara presisi berarti menyalin ulang
aturan routing tiap modul ke satu tempat dan diam-diam melewatkan modul yang
ditambahkan kemudian — biayanya (satu pengisian ulang cache) jauh lebih
murah daripada risikonya.

**Belum terhubung, dan alasannya:** halaman (`blog_pages`) belum disajikan
publik; `news_portal` punya jalur publikasinya sendiri; `purge` artikel
hanya sah untuk konten yang sudah non-publik.

## Metrik

| Metrik                                    | Arti                                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------------- |
| `edge_cache_boost_active`                 | 1 selama proses ini meminta TTL boost                                         |
| `edge_cache_pressure_percent`             | Utilisasi work-class foreground tertinggi saat mode diputuskan                |
| `edge_cache_escalation_transitions_total` | Seberapa sering mode berpindah — laju tinggi = histeresis perlu disetel ulang |
| `edge_cache_purge_total`                  | Percobaan invalidasi eksplisit, per hasil                                     |

Tidak satu pun memakai hostname atau path sebagai label: hostname publik
mengidentifikasi tenant.

## Rollback

Hentikan service Varnish. Bila pemasangannya memakai pola prioritas router
Traefik (lihat [`deploy-coolify.md`](deploy-coolify.md) §Memindahkan domain ke
Varnish), tidak ada langkah lain sama sekali: Traefik jatuh kembali ke router
aplikasi dengan sendirinya — sudah diverifikasi dengan benar-benar mematikan
container-nya di staging. Pada topologi Compose, arahkan reverse proxy kembali
ke port 4321.
Tidak ada migrasi yang perlu dibalik, tidak ada state yang hilang — cache
tidak pernah menjadi sumber kebenaran. Menyetel `EDGE_CACHE_ENABLED=false`
menghentikan aplikasi mengirim header cache sama sekali, sehingga aman
dipakai sebagai langkah pertama bila yang dicurigai adalah kebijakan
cache-nya, bukan container-nya.

## Batasan yang perlu disadari

- Kebasian konten publik kini terikat TTL, bukan nol. Editor perlu tahu
  angka ini.
- Mode eskalasi bersifat **per-proses**. Beberapa instance dapat berada
  pada mode berbeda bersamaan; itu diterima karena masing-masing mengukur
  pool-nya sendiri.
- Varnish menyimpan cache di memori (`VARNISH_SIZE`, default 256M). Restart
  mengosongkannya — yang berarti gelombang MISS, bukan kesalahan.
- Lapisan ini melengkapi, bukan menggantikan, fondasi Redis (ADR-0030):
  Redis menghapus query berulang di dalam proses, Varnish menghapus
  render berulang sebelum proses.
