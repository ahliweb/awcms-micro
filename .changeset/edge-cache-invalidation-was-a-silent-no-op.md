---
"awcms-micro": patch
---

Perbaiki invalidasi edge cache yang **tidak pernah benar-benar terjadi**
(Issue #359).

Klien purge memakai metode HTTP kustom `BAN`, idiom Varnish yang lazim.
Tetapi `fetch` milik Bun **diam-diam menulis ulang metode yang tidak dikenal
menjadi `GET`** (diverifikasi pada Bun 1.3.14 terhadap Varnish sungguhan:
permintaan tiba sebagai `ReqMethod GET`, dilayani sebagai halaman biasa, dan
membalas 200). Karena 200 itu, klien melaporkan purge **berhasil** padahal
cache tidak pernah tersentuh — invalidasi yang sepenuhnya mati namun tampak
sehat, baik dari kode maupun dari `bun run edge-cache:health`.

Dua perubahan menutup kelas kegagalan itu:

- transport menjadi `POST /__awcms-edge-cache/ban` sehingga tidak lagi
  bergantung pada metode kustom yang harus selamat melewati setiap klien
  HTTP di rantai;
- respons ban membawa penanda `X-Edge-Cache-Ban: ok` yang **wajib** ada.
  Sebuah 200 tanpa penanda kini dilaporkan **gagal**, bukan sukses — artinya
  yang menjawab bukan handler ban cache.

Ditemukan dengan menjalankan publikasi sungguhan pada instance staging dan
mendapati cache tetap `HIT`; unit test tidak bisa menangkapnya karena
mereka men-stub `fetch`.
