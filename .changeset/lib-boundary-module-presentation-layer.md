---
"awcms-micro": patch
---

refactor(lib): tetapkan batas `src/lib` dan pindahkan kode presentasi modul ke `presentation/` (ADR-0038, Issue #371)

`src/lib/` sebelumnya tumbuh menjadi sistem modul kedua yang tidak dijaga gerbang mana pun: lima namespace (`comments`, `newsletter`, `theming`, `seo`, `search`) menyandang nama modul yang sudah ada dan berisi kode milik modul itu, dengan `seo_distribution` bahkan merujuk **ke atas** ke `src/lib/seo/`.

- ADR-0038 menetapkan `src/lib` = infrastruktur teknis yang tidak menyandang nama domain, dan `src/modules/<m>/presentation/` = rumah sah bagi composition root rute, glue middleware, dan skrip klien browser milik modul.
- Sepuluh berkas dipindah dengan `git mv` (riwayat terjaga) — **pemindahan murni, tanpa perubahan perilaku**: tidak ada perubahan API, migration, event, permission, atau registry (tetap 22 modul).
- `bun run modules:dag:check` kini juga **gagal** bila sebuah namespace `src/lib/<x>/` bertabrakan nama dengan sebuah `moduleKey` (persis atau lewat alias domain terdaftar), dengan tes yang menyuntikkan pelanggaran untuk membuktikan gerbangnya benar-benar menolak. Satu pengecualian tercatat: `src/lib/logging/` (primitif logger bebas database).
- `src/lib/files/` dan `src/lib/errors/` yang kosong (hanya `.gitkeep`) dihapus.
