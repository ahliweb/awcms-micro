---
"awcms-micro": patch
---

Percepat halaman admin modul (`/admin/modules` dan `/admin/modules/tenants`) dengan menghilangkan pola N+1 pada perhitungan health/readiness modul.

Sebelumnya `fetchModuleHealthReport` dipanggil sekali per modul di dalam `Promise.all(catalog.map(...))`, terserialisasi pada satu koneksi `withTenant`. Dengan registry kini 22 modul, setiap modul menjalankan ~4 query + `readdir(sql/)` — dan sinyal `migrations_applied` (yang bersifat instance-global, identik untuk semua modul) dihitung 22×.

Perbaikan: jalur batched baru `fetchModuleHealthReports` membangun satu `ModuleHealthBatchContext` sekali untuk seluruh registry — `migrations_applied`, scan lifecycle `awcms_micro_modules`, dan katalog permission masing-masing dibaca sekali, plus baris settings tenant (`WHERE tenant_id`) sekali. Total ~4 query + 1 readdir untuk SEMUA modul, bukan per modul. `fetchModuleHealthReport` (single) dan jalur batched berbagi builder sinyal murni yang sama, sehingga output `status`/`signals` per modul byte-identik (dijamin test ekuivalensi baru). Semua query tetap pada koneksi tenant-scoped `withTenant` yang sama — RLS dan cakupan akses tidak berubah, hanya jumlah query yang berkurang.
