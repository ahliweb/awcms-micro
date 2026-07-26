---
"awcms-micro": patch
---

Nyalakan analisis statis untuk lapisan `.astro` yang sebelumnya tidak diperiksa alat apa pun (Issue #369): tambah gerbang `bun run typecheck:astro` (`astro check` — mengetik-periksa frontmatter dan ≈19.2k baris `<script>` inline), jalankan ESLint (flat config, `no-floating-promises` + `no-misused-promises` + `no-control-regex`) di dalam `bun run lint`, dan tambahkan `DOM`/`DOM.Iterable` ke `compilerOptions.lib`. Keduanya masuk `bun run check` dan job CI "Quality".

Devdependency `typescript` diturunkan dari `^7.0.2` ke pin eksak `6.0.3`: `typescript@7` adalah kompiler native yang tidak lagi mengekspor API programatik, sehingga `astro check` menolak jalan dan `typescript-eslint` (peer `<6.1.0`) tidak bisa dipakai. `tsc --noEmit` tetap hijau, hanya lebih lambat (0,8 s → 6,9 s).

Bug nyata yang ditemukan gerbang baru ini dan langsung diperbaiki: pilihan peran di `/admin/registrations` mengirim nama peran alih-alih UUID-nya (`role.id` tidak ada; yang benar `role.roleId`), badge ukuran berkas di `/admin/media` merender `null B` untuk objek tanpa ukuran, banner "warning" di `/admin/reporting/projections` tidak punya gaya sama sekali sehingga peringatan ketidakcocokan tampak netral, dua `ConfirmDialog` dirender tanpa label tombol wajibnya, dan 48 promise `server.stop()` yang tidak di-`await` di teardown test.
