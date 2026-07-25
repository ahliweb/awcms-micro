---
"awcms-micro": minor
---

Invalidasi edge cache otomatis saat publikasi konten berubah (Issue #359,
tindak lanjut Issue #353 / ADR-0037 yang sengaja menundanya).

Sebelumnya kesegaran konten publik hanya dibatasi TTL (default 60 detik),
dan invalidasi segera mengandalkan operator mengingat menjalankan
`bun run edge-cache:purge`. Sekarang `publish`, `archive`, `restore`,
`PATCH`, dan `DELETE` artikel blog — plus job publikasi terjadwal —
meng-invalidasi sendiri cache publik tenant yang bersangkutan.

Tiga aturan yang mengikat implementasinya: dipanggil **di luar** transaksi
database (menahan koneksi pool selama panggilan HTTP ke cache adalah bentuk
yang menjenuhkan pool pada Issue #324), **fail-open mutlak** (publikasi yang
sudah commit tidak pernah berubah menjadi gagal karena cache tak
terjangkau), dan **nol pekerjaan database ketika edge cache tidak
dikonfigurasi**. Ketiganya diuji unit.

Tanpa edge cache aktif, tidak ada perubahan perilaku sama sekali.
