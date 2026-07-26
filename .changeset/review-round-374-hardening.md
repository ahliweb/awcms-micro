---
"awcms-micro": patch
---

Perbaikan hasil ronde review PR #374 (reviewer + security auditor).

- `ClientJsonData.astro` memakai `JSON.stringify` telanjang untuk `set:html`.
  `JSON.stringify` tidak meng-escape `<`, jadi payload berisi `</script>`
  menutup data island dan sisanya diparse sebagai HTML hidup. Belum
  eksploitabel (semua call site hanya string i18n), tapi komponen ini
  mengiklankan diri menerima "payload JSON apa pun" untuk 35 halaman admin.
  Serializer dipindah ke `src/lib/ui/client-json-data.ts` agar bisa diuji, dan
  `<` di-escape jadi `<` — no-op untuk `JSON.parse`.
- Tiga pemanggil non-`Response` di modul `theming` memanggil `withTenant`
  tanpa `unavailableBehavior: "throw"` (kelas #323). Pada rute PUBLIK
  `/theming/tokens.css` itu berarti pool jenuh menyajikan `[object Response]`
  sebagai CSS di setiap page load. Kini degradasi ke tema default / preview
  `null`.
- `scripts/link-check.ts`: filter skema jadi ALLOW-list (deny-list lamanya
  melewatkan `file:`), dan userinfo dibuang dari laporan JSON yang lazim
  dilampirkan ke issue.
- `scripts/static-analysis.ts`: laporan tmp pakai `mkdtemp` (path lama bisa
  ditebak dan jadi target symlink lewat `-o` ESLint), dan pembersihannya
  dipindah ke sebelum `fail()` — `process.exit()` melewati `finally`.
- `scripts/validate-module-graph.ts`: root `src/lib` yang tak terbaca kini
  MELEMPAR alih-alih melaporkan pohon kosong yang lolos, dan lookup tabel
  pakai `Object.hasOwn` (direktori bernama `constructor`/`toString` tak lagi
  dianggap exempt).
- `api:tenant-route:check` ditambahkan sebagai langkah CI eksplisit — CI
  menjalankan gerbang satu per satu, jadi memasangnya di `bun run check` saja
  tidak membuatnya berjalan.
- Daftar pengecualian ESLint dikosongkan (entrinya sudah basi di PR yang sama).
- ADR-0038: klaim "nol impor relatif lintas-modul" dikoreksi — pengukuran
  ulang menemukan ~80 impor semacam itu yang sudah ada sebelumnya. Yang
  dijaga hari ini adalah dependensi yang dideklarasikan, bukan impor tingkat
  berkas.
