---
"awcms-micro": minor
---

Uji invalidasi edge cache terhadap Varnish sungguhan di CI, dan tambahkan
`bun run edge-cache:verify` yang menguji **akibat** purge, bukan panggilannya.

Tindak lanjut post-mortem Issue #359/#361. Invalidasi sempat mati total
selama dua rilis sementara empat pengaman melaporkan sehat — dan keempatnya
ternyata satu asumsi yang sama: bahwa permintaan yang ditulis adalah
permintaan yang terkirim. Unit test men-stub `fetch` (persis lapisan yang
rusak), `edge-cache:health` memakai klien yang sama dengan yang diperiksanya,
klien itu menyimpulkan sukses dari status code, dan metrik ikut mencatat
"purged" untuk non-purge.

Dua penutup yang berdiri di luar asumsi itu:

- `tests/integration/edge-cache-varnish.integration.test.ts` menyalakan
  `varnish:7.7.3` sungguhan dari `deploy/varnish/default.vcl` yang dikirim
  (hanya alamat backend yang ditukar) lalu membuktikan purge benar-benar
  membuang objeknya dan origin kembali dipukul — assertion yang secara
  struktural mustahil dibuat oleh `fetch` yang di-stub. CI menjalankannya
  dengan `EDGE_CACHE_VARNISH_TEST=1` sehingga ketiadaan Docker menjadi
  **gagal keras**, bukan skip diam-diam.
- `bun run edge-cache:verify -- --url=<url>` memanaskan URL sampai `HIT`,
  mem-purge, lalu mewajibkan `MISS`. Sebuah `MISS` saja tidak membuktikan
  apa pun (kedaluwarsa TTL identik), jadi `HIT` beberapa detik sebelumnya
  itulah yang membuat urutan ini sahih.

Suite baru itu diuji balik dengan mengembalikan transport lama sementara:
4 dari 8 test gagal, termasuk satu yang melaporkan `purged` padahal
tokennya salah.
