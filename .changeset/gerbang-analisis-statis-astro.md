---
"awcms-micro": patch
---

Nyalakan analisis statis untuk lapisan `.astro` yang sebelumnya tidak diperiksa alat apa pun (Issue #369): tambah gerbang `bun run typecheck:astro` (`astro check` — mengetik-periksa frontmatter dan ≈19.2k baris `<script>` inline), jalankan ESLint (flat config, `no-floating-promises` + `no-misused-promises` + `no-control-regex`) di dalam `bun run lint`, dan tambahkan `DOM`/`DOM.Iterable` ke `compilerOptions.lib`. Keduanya masuk `bun run check` dan job CI "Quality".

Toolchain-nya dikarantina, bukan dipaksakan ke root: `astro check` dan `typescript-eslint` masih butuh API programatik TypeScript yang `typescript@7` (kompiler native) tidak lagi ekspor. Root tetap `typescript ^7.0.2` sehingga `tsc --noEmit` terus memeriksa 100% pohon `.ts`, sementara `tools/static-analysis/` punya `node_modules` sendiri berisi `typescript` 6.0.3 dan dijalankan oleh `scripts/static-analysis.ts` dengan cwd root. Gerbang baru `bun run static-analysis:quarantine:check` gagal begitu toolchain-nya menerima TypeScript 7 — sinyal otomatis bahwa workaround-nya bisa dihapus.

Bug nyata yang ditemukan gerbang baru ini dan langsung diperbaiki: pilihan peran di `/admin/registrations` mengirim nama peran alih-alih UUID-nya (`role.id` tidak ada; yang benar `role.roleId`), badge ukuran berkas di `/admin/media` merender `null B` untuk objek tanpa ukuran, banner "warning" di `/admin/reporting/projections` tidak punya gaya sama sekali sehingga peringatan ketidakcocokan tampak netral, dua `ConfirmDialog` dirender tanpa label tombol wajibnya, dan 48 promise `server.stop()` yang tidak di-`await` di teardown test.
