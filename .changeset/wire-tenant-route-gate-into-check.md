---
"awcms-micro": patch
---

Pasang `api:tenant-route:check` ke dalam `bun run check`.

Gerbang dari Issue #370 sebelumnya bisa dijalankan tapi tidak ditegakkan —
rute API baru yang menulis tangan pembukaan auth/tenant tetap bisa merge.
Sekarang ia berjalan bersama gerbang lain, sehingga daftar
`NOT_YET_MIGRATED` benar-benar hanya bisa menyusut.

Skill `awcms-micro-new-endpoint`, `awcms-micro-new-module`, dan
`awcms-micro-ui-screen` disinkronkan dengan `defineTenantRoute`,
lapisan `presentation/` (ADR-0038), dan pola halaman `.astro` tipis.
Sekalian membuang dua klaim basi di `awcms-micro-new-endpoint`: penyebutan
topologi "LAN-first" (sudah dihapus ADR-0034/0036) dan pernyataan bahwa
rute publik tenant-scoped belum punya implementasi contoh.
