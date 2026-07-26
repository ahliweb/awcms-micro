---
"awcms-micro": patch
---

Tambah `defineTenantRoute` (`src/modules/_shared/tenant-route.ts`): satu tempat
untuk pembukaan auth/tenant yang sebelumnya disalin ke 201 dari 260 rute API
(`resolveAuthInputs` → cek tenant/token → `getDatabaseClient` →
`hashSessionToken` → `withTenant` → `authorizeInTransaction` → short-circuit
`auth.denied`). `workClass` WAJIB di tipenya — tidak ada default — sehingga 221
klasifikasi pool yang selama ini implisit menjadi keputusan tertulis;
`unavailableBehavior` di-hardcode `"response"` (rute adalah pemanggil
`Response`, #323) dan larangan `Promise.all` atas satu `tx` (#324)
didokumentasikan di tipe `tx`.

Modul `data_lifecycle` dimigrasi penuh sebagai bukti (5 file rute, 6 handler)
tanpa perubahan perilaku — tes integrasi lamanya tetap hijau tanpa disunting.
Gerbang baru `bun run api:tenant-route:check` menolak rute BARU yang memanggil
`withTenant` langsung, dengan daftar pengecualian eksplisit berisi 235 rute
lama yang hanya boleh menyusut.
