---
"awcms-micro": patch
---

Tutup sambungan terakhir yang belum teruji: rute publikasi sungguhan →
PostgreSQL sungguhan → Varnish sungguhan (lanjutan Issue #359/#361).

Suite transport membuktikan `purgeEdgeCache()` mengosongkan cache nyata;
unit test membuktikan rute memanggil pembungkusnya. Tidak satu pun
membuktikan keduanya **tersambung** — resolusi hostname dari
`awcms_micro_tenant_domains` duduk di antaranya, dan tenant yang
hostname-nya tidak resolve tidak meng-invalidasi apa pun sementara seluruh
test komponen tetap hijau. Di staging, celah itu hanya pernah terlihat
dengan menerbitkan artikel sungguhan lalu memeriksa permintaan berikutnya.

`tests/integration/edge-cache-publish-invalidation.integration.test.ts`
sekarang menjalankan tepat urutan itu, dan mengunci batas-batasnya: setiap
hostname aktif tenant di-purge (bukan hanya yang primary), hostname
non-aktif tidak, publikasi tenant lain tidak mengosongkan cache tenant ini,
dan publikasi yang **gagal** tidak mengosongkan apa pun — yang terakhir
menutup cara murah bagi pemanggil tak berwenang untuk membuang cache sebuah
situs.

Kedua CLI operator (`edge-cache:verify`, `edge-cache:health`) kini
dijalankan sebagai proses sungguhan terhadap Varnish nyata, sehingga exit
code yang dibaca pipeline deploy ikut jadi bagian assertion — pemeriksa yang
sendirinya tidak diperiksa adalah persis bagaimana `edge-cache:health` bisa
melaporkan sehat untuk subsistem yang tidak melakukan apa pun.

Suite baru diuji balik dengan dua mutasi: melepas pemanggilan invalidasi
dari rute `publish` menggagalkan 3 dari 6 test; mengubah filter status
resolver hostname menggagalkan 5 dari 6.

Ditambahkan pula gate `bun run http:methods:check`. Aturan Bun-nya ternyata
lebih luas dari "metode kustom": yang menentukan adalah kecocokan huruf per
huruf dengan tabel verb internalnya, sehingga `Post`/`Delete`/`Patch` —
salah kapitalisasi biasa yang menurut spec fetch justru wajib dinormalkan —
juga terkirim sebagai `GET`. Arahnya berbahaya: permintaan yang dimaksudkan
mengubah terkirim sebagai pembacaan, dan 200-nya terbaca sukses. Sudah
dilaporkan ke hulu (oven-sh/bun#33469); gate ini menutup sisi kita.
