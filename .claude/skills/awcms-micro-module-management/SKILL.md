---
name: awcms-micro-module-management
description: Kelola/konsumsi sistem Module Management AWCMS-Micro (registry, komposisi modul build-time atas satu registry base, tenant lifecycle enable/disable, settings, permission sync/status, navigation, job registry, health/readiness). Gunakan saat menambah field descriptor baru (permissions/navigation/settings/jobs/health) di modul lain, saat menyelidiki kenapa suatu modul terlihat degraded/orphaned, saat menambah modul website/domain baru langsung ke `src/modules/index.ts` dan memvalidasi komposisinya (`bun run modules:compose:check`), atau saat mengubah perilaku enable/disable/settings/health module_management sendiri. Jalur aplikasi-turunan (application-registry.ts, extension:check) SUDAH DIHAPUS oleh ADR-0036 — template dipakai langsung. Sesuai src/modules/module-management/README.md, epic #510, epic #738 (Issue #740), ADR-0036.
---

# AWCMS-Micro — Module Management System

Ikuti `src/modules/module-management/README.md` (sumber kebenaran penuh
per issue #511-#521) dan `docs/awcms-micro/10_template_kode_coding_standard.md`
§Module contract. Skill ini merangkum pola yang **tidak jelas dari
sekadar membaca satu file** — dependency graph, urutan sync, semantik
merge settings, dan makna tiap sinyal health.

## Kapan pakai skill ini vs `awcms-micro-new-module`

`awcms-micro-new-module` = cara **scaffold** modul baru (struktur folder,
descriptor minimal). Skill ini = cara kerja **sistem** yang mengelola
modul yang sudah terdaftar — enable/disable per tenant, settings,
permission sync, navigation, jobs, health. Pakai skill ini saat modulmu
sudah ada dan kamu perlu mendeklarasikan `permissions`/`navigation`/
`settings`/`jobs` di descriptornya, atau saat menyelidiki masalah di
sistem module management itu sendiri.

## "Sync first" — aturan FK yang wajib dipahami

`awcms_micro_tenant_modules`, `_module_settings`, `_module_health_checks`
semua punya FK ke `awcms_micro_modules.module_key`. Mendaftarkan modul di
`src/modules/index.ts` **tidak otomatis** membuat baris registrynya.
Setiap mutasi tenant-scoped yang butuh baris registry ada
(`enableTenantModule`/`disableTenantModule`/`updateModuleSettings`/
`runModuleHealthCheck`) memanggil `syncModuleDescriptors(tx)` sendiri di
awal — **jangan** asumsikan operator sudah menjalankan
`POST /api/v1/modules/sync` manual lebih dulu. Bila menambah mutasi baru
dengan FK serupa, ikuti pola yang sama.

Konsekuensi: `GET /api/v1/modules/{moduleKey}/health`'s sinyal
`db_registry_synced` bisa `fail` di instance yang baru dimigrasikan
(belum pernah ada mutasi tenant-scoped apa pun) — ini **bukan bug**,
laporan yang jujur. `POST .../health/check` men-sync duluan sebagai efek
samping menulis riwayat, jadi bisa menunjukkan hasil `pass` untuk sinyal
yang sama di momen yang sama — asimetri yang disengaja, didokumentasikan
di README modul.

## Dependency graph (enable/disable)

Graph **selalu** dibaca dari `listModules()` (code), **tidak pernah**
dari `awcms_micro_module_dependencies` (cache hasil sync terakhir — bisa
basi). Kode error dari `domain/tenant-module-lifecycle.ts`:

| Kode                                 | Kapan                                                |
| ------------------------------------ | ---------------------------------------------------- |
| `MODULE_NOT_FOUND`                   | Key tidak terdaftar / dinonaktifkan global (code)    |
| `MODULE_ALREADY_ENABLED`/`_DISABLED` | Tidak ada perubahan state                            |
| `MODULE_DEPENDENCY_MISSING`          | Dependency tidak terdaftar sama sekali               |
| `MODULE_DEPENDENCY_DISABLED`         | Dependency nonaktif (global atau tenant ini)         |
| `MODULE_REVERSE_DEPENDENCY_ACTIVE`   | Modul lain yang aktif masih bergantung padanya       |
| `MODULE_DEPENDENCY_CYCLE`            | Circular dependency di graph                         |
| `MODULE_VERSION_INCOMPATIBLE`        | `minAppVersion` modul > versi app saat ini           |
| `CORE_MODULE_CANNOT_BE_DISABLED`     | `isCore: true` — tidak bisa dinonaktifkan, bukan bug |

Modul `isCore: true` (saat ini hanya `module_management` sendiri) tidak
bisa dinonaktifkan — ini pencegah _admin lockout_ utama: kemampuan
mengelola modul lain tidak pernah hilang.

### Registry-wide DAG validator (Issue #680, epic #679) — beda dari `hasDependencyCycle`

`hasDependencyCycle` di atas hanya pernah dipanggil untuk SATU modul (yang
sedang dicoba di-enable, `evaluateModuleEnable` — lihat `tenant-module-lifecycle.ts:138`)
— tidak pernah dipakai untuk memeriksa "apakah SELURUH registry sudah
DAG yang valid". Celah inilah yang membuat `tenant_admin`/
`profile_identity`/`identity_access` sempat punya cycle 3-node nyata di
`dependencies` masing-masing (`tenant_admin -> profile_identity ->
tenant_admin`, dst) selama registry-nya tidak pernah diiterasi
menyeluruh — padahal `hasDependencyCycle` SUDAH akan menolaknya kalau
ada yang mencoba meng-enable salah satu dari ketiganya lewat jalur
normal.

`domain/module-dependency-graph.ts`'s `validateModuleDependencyGraph(listModules())`
adalah pemeriksaan menyeluruh itu — mendeteksi EMPAT masalah berbeda
sekaligus (tidak berhenti di yang pertama): `self_dependency`,
`duplicate_dependency`, `missing_dependency`, dan `cycle`
(langsung/tidak langsung, algoritma Kahn menyeluruh, bukan DFS
satu-titik). Dipanggil dari:

- `bun run modules:dag:check` (`scripts/validate-module-graph.ts`) —
  disisipkan ke `bun run check` tepat setelah `api:spec:check`.
- `bun run modules:sync` (`scripts/modules-sync.ts`) — menolak sync ke DB
  bila graph rusak, SEBELUM baris apa pun tersentuh. Sejak Issue #697 (epic
  #679), script ini dibangun di atas shared worker runner
  `src/lib/jobs/job-runner.ts` (advisory lock, `--dry-run` via
  `planModuleSync`, JSON telemetry) — lihat
  `docs/awcms-micro/deployment-profiles.md` §Shared worker runner; perilaku
  `syncModuleDescriptors` sendiri TIDAK berubah.

**Fix nyata untuk cycle historis** (Issue #680): `tenant_admin.dependencies`
diubah dari `["profile_identity", "identity_access"]` menjadi `[]` —
`profile_identity`/`identity_access`'s array masing-masing SUDAH benar
sejak awal (`profile_identity: ["tenant_admin"]`,
`identity_access: ["tenant_admin", "profile_identity"]`); satu-satunya
edge yang salah arah adalah `tenant_admin` balik menunjuk keduanya.
Alasan historis edge itu ada: `tenant_admin`'s one-time setup wizard
(`POST /api/v1/setup/initialize`) menulis baris ke tabel
`profile_identity`/`identity_access` DALAM transaksi yang sama — itu
kebutuhan **saat-dipanggil** (call-time), bukan "tenant_admin tidak bisa
berfungsi sama sekali tanpa keduanya" (static dependency yang salah).
Orkestrasi itu sekarang jadi fungsi composition-root eksplisit,
`application/platform-bootstrap.ts`'s `bootstrapPlatformTenant`, dipanggil
langsung oleh route handler — bukan lewat `dependencies` array. Jangan
kembalikan pola lama ini kalau butuh orkestrasi lintas-modul serupa di
masa depan — buat composition-root function baru, jangan tambah edge
`dependencies` untuk menjustifikasi urutan panggilan satu-kali.

`resolveProtectedModuleKeys`'s (module-presets.ts) hasil closure untuk
`module_management` — `{module_management, tenant_admin, identity_access,
profile_identity}` — TIDAK berubah meski edge tenant_admin dihapus,
karena closure dihitung lewat `identity_access -> profile_identity ->
tenant_admin` (masih transitif sama), bukan lewat edge tenant_admin yang
dihapus. Verifikasi ini lewat test yang sudah ada
(`tests/unit/module-presets.test.ts`'s "real registry's protected set is
exactly module_management's own dependency closure").

### `capabilities` — hubungan source-level, BEDA dari `dependencies` (Issue #681, epic #679)

`ModuleDescriptor` punya field opsional baru, `capabilities?:
{provides?: string[]; consumes?: {capability, providedBy, optional?}[]}`
(`_shared/module-contract.ts`). Ini BUKAN bagian dari dependency-graph
lifecycle di atas — `dependencies` tetap satu-satunya field yang dibaca
`hasDependencyCycle`/`validateModuleDependencyGraph`/`evaluateModuleEnable`/
`evaluateModuleDisable`. `capabilities` murni mendokumentasikan hubungan
IMPORT SOURCE-LEVEL lewat pola ports-and-adapters (`_shared/ports/*.ts`)
— lihat ADR-0011 dan skill `awcms-micro-news-portal`'s §681 untuk contoh
nyata (`blog_content`/`news_portal`). Modul yang butuh kapabilitas dari
modul lain TIDAK PERNAH meng-import `application`/`domain` modul itu
langsung — hanya port interface (`_shared/ports/`) di layer
`application`/`domain`, dengan adapter konkret disuntikkan pemanggil
(route handler = composition root). `optional: true` di `consumes`
berarti fitur pemanggil degradasi aman (bukan error) kalau kapabilitas
itu resolve ke "tidak berlaku" untuk suatu tenant — bukan berarti kode
bisa jalan tanpa modul lain ter-compile (ini monolith, semua source
selalu ikut ter-bundle).

**Dua varian composition-root sudah ada di repo ini — pilih sesuai
taruhan keamanan fitur, bukan template tunggal.** Varian #1
(`blog_content` konsumsi `NewsMediaPort` dari `news_portal`, Issue #681):
route handler SELALU inject adapter konkret, TANPA cek enable/disable
tenant di call site — port itu sendiri yang didesain fail-closed/no-op
aman untuk setiap kasus "tidak berlaku". Varian #2 (gate enable eksplisit
di composition root): dipakai ketika kapabilitas yang dikonsumsi menentukan
keputusan otorisasi/keamanan dan penyedianya opsional per tenant — men-
degradasi "aman" secara implisit lewat port semata (varian #1) berisiko
diam-diam mengonsultasikan data milik modul yang sudah dinonaktifkan tenant.
**Catatan scope**: contoh kanonik upstream — `identity_access` mengonsumsi
`BusinessScopeHierarchyPort` dari `organization_structure` — adalah pola
DERIVED-APP: `organization_structure` adalah modul ERP yang **tidak diport**
ke AWCMS-Micro (ADR-0025), sehingga composition root base
(`buildBusinessScopeHierarchyPort()`, `src/pages/api/v1/identity/business-
scope/hierarchy-port-composition.ts`) hanya mewire adapter FLAT default.
Bila kelak sebuah modul penyedia hierarki nyata masuk scope repo ini, ia
mewire adapternya langsung di composition root base itu (dicoba lebih dulu,
jatuh ke flat untuk scope yang tidak dimilikinya). Kedua
varian tetap TIDAK PERNAH meng-import `application`/`domain` modul lain
langsung dari modul pengonsumsi — hanya lewat port + composition root; lihat
`identity-access/README.md` §`BusinessScopeHierarchyPort`.

## Baca status tenant-enabled: plural vs singular

`fetchTenantModuleEntries(tx, tenantId)` (semua modul terdaftar) vs
`fetchTenantModuleEntry(tx, tenantId, moduleKey)` (satu modul,
`SELECT`-nya di-filter `module_key` langsung, bukan filter di memori).
Pakai yang **singular** kalau consumer-mu cuma butuh status satu modul
spesifik (terutama di gate publik/anonim — narrower read surface untuk
kode yang tidak authenticated), seperti `blog-content`'s
`public-news-tenant-resolution.ts`. Pakai yang **plural** kalau memang
butuh daftar lengkap (endpoint `GET /api/v1/tenant/modules`, tenant module
presets, tenant-module matrix UI). Keduanya punya semantik
opt-out-by-default yang sama (tidak ada row `awcms_micro_tenant_modules`
→ `tenantEnabled: true`). Detail lengkap:
`module-management/README.md` §Tenant module lifecycle, skill
`awcms-micro-tenant-domain-routing` §Belum ada (Sudah diperbaiki).

## Tenant module presets (Issue #565, epic #555)

`domain/module-presets.ts` + `application/module-presets.ts`
(`applyModulePreset`) — set state modul tenant sekaligus ke sebuah
"profil" (`online_website`, `news_portal`, `saas_online`, `pos_lan`,
`minimal`), 100% reuse `evaluateModuleEnable`/`evaluateModuleDisable`/
`enableTenantModule`/`disableTenantModule` di atas — **tidak pernah**
menulis `awcms_micro_tenant_modules` langsung. Preset menerapkan enable
DAN disable (bukan cuma enable) — modul yang tidak ada di daftar preset
dan bukan "protected" (`isCore` + closure transitif dependency-nya,
dihitung dinamis lewat `resolveProtectedModuleKeys`) akan di-disable,
leaves-first, skip (bukan force) untuk modul yang masih dibutuhkan modul
lain yang tetap enabled. Idempotent (re-apply = plan kosong). **Baru
service layer** — belum ada endpoint API/UI (scope Issue #566). Detail
lengkap: `module-management/README.md` §Tenant module presets, skill
`awcms-micro-tenant-domain-routing` §Tenant module presets (Issue #565).

## Settings — merge dangkal, bukan replace

`PATCH .../settings` men-**merge dangkal** body ke `tenantOverride` yang
ada (`{ ...before, ...patch }`) — key yang tidak disebut tetap tidak
berubah. Berbeda dari `PATCH /api/v1/settings`'s `featureFlags` (replace
utuh field itu) karena di sini seluruh body request **adalah** resource
settings-nya, bukan satu field bernama di resource lain. Key yang
menyerupai secret (daftar sama `_shared/redaction.ts`'s `REDACTION_KEYS`,
termasuk `credential`) **ditolak saat request** (`400
SETTINGS_SENSITIVE_KEY_REJECTED`), tidak pernah disimpan lalu di-redact
saat dibaca. **Value** berbentuk credential juga ditolak walau key-nya
tidak mencurigakan (`_shared/redaction.ts`'s `findSecretShapedValues` —
JWT, blok PEM private key, AWS access key id, header `Bearer`/`Basic`
mentah, connection string ber-`user:pass@`; sengaja konservatif supaya
label/URL/flag biasa tidak pernah salah tertolak) — `400
SETTINGS_SECRET_SHAPED_VALUE_REJECTED`, pesan error hanya menyebut path
key, tidak pernah value-nya. Berlaku otomatis untuk semua modul yang
pakai `validateModuleSettingsPatch`, tanpa perlu ubah route/modul
masing-masing.

## Permission sync status — jangan auto-fix `orphaned`

`GET /api/v1/modules/{moduleKey}/permissions` (Issue #517) melaporkan
`synced`/`missing`/`orphaned`/`mismatched_description` — **read-only**,
tidak pernah menulis ke `awcms_micro_permissions`. **11 modul** (dari 17)
sudah mendeklarasikan `permissions` di descriptornya — `module_management`,
`blog_content` (sejak Issue #543, 39-entry array),
`news_portal`, `social_publishing`, `tenant_domain`, `visitor_analytics`,
`profile_identity`, `reporting`, `media_library`, `data_lifecycle`, dan
`domain_event_runtime`. **6 modul** lain (email,
form-drafts, identity-access, logging, sync-storage, tenant-admin) punya
permission seed nyata (dari migration masing-masing) tapi belum
ditambahkan ke descriptor — jadi permission mereka **legitimately** muncul
`orphaned` hari ini, bukan insiden. Jangan hapus baris `awcms_micro_permissions`
berdasarkan laporan ini tanpa keputusan admin eksplisit.

## Health check — GET pasif, POST eksplisit

`GET .../health` = sinyal generik murah saja (registry synced, migrasi
diterapkan, permission/jobs/OpenAPI/AsyncAPI terdokumentasi, settings
valid) — **tidak pernah** memanggil provider eksternal, aman dipanggil
berulang. `POST .../health/check` = sinyal sama **plus** live check ke
provider bila modul punya satu (`email` saat ini, lewat
`resolveEmailProvider().healthCheck()` yang sudah timeout-bounded sejak
Issue #495) — dan menulis riwayat ke `awcms_micro_module_health_checks`.
Menambah provider check baru untuk modul lain: ikuti pola yang sama
(hanya di `POST`, bounded/non-throwing, `detail` selalu string generik
tetap — tidak pernah pesan error mentah).

## Job registry — dokumentasi murni

`ModuleDescriptor.jobs` **tidak pernah** jadi permukaan eksekusi command
dari web — hanya metadata (`command`, `purpose`, `recommendedSchedule`,
`environmentNotes`, `safeInOfflineLan`). Jangan tambah endpoint yang
menjalankan command dari sini; bila eksekusi job dari UI benar-benar
dibutuhkan suatu saat, itu harus fitur terpisah yang dibatasi ketat
(security note eksplisit epic #510).

## Verifikasi

`tests/module-management-*.test.ts` (domain, unit, per Issue) dan
`tests/integration/module-*.integration.test.ts` (API+RLS+audit
end-to-end, real Postgres) — jalankan `bun test` dengan `DATABASE_URL`
sebelum PR yang menyentuh sistem ini dianggap selesai (`bun run check`
tanpa `DATABASE_URL` **melewatkan** semua test integration secara diam-diam).

## Skill terkait

`awcms-micro-new-module` (scaffold modul baru, termasuk field descriptor
ini), `awcms-micro-abac-guard` (guard bersama yang juga menegakkan
`403 MODULE_DISABLED`), `awcms-micro-sensitive-data`/redaction
(`REDACTION_KEYS` yang dipakai validasi settings), `awcms-micro-audit-log`
(pola audit `tenant_module_enabled`/`_disabled`/`settings_updated`/`health_checked`).

## Kebijakan admission modul (Issue #696)

`docs/awcms-micro/21_module_admission_governance.md` mendefinisikan
kategori modul (Core/System/Official Optional Module/Derived Application/
External Integration), kriteria admission, aturan dependency required vs
optional (§5, melengkapi `capabilities` di atas), ekspektasi kompatibilitas
offline/LAN vs full-online-only, dan pemetaan 22 modul terdaftar saat ini
(`src/modules/index.ts`'s `baseModules`, WEBSITE scope — tujuh modul ERP
upstream tidak diport, ADR-0025)
ke kategori tersebut (termasuk catatan remediasi field `type`/`isCore`/
`maintainers` yang belum konsisten diisi — lihat doc 21 §8). Baca dokumen
itu sebelum mengusulkan modul baru atau mengubah kategori/status lifecycle
modul yang sudah ada.

## Komposisi modul build-time atas satu registry base (Issue #740)

> **ADR-0036 (2026-07-21) menghapus penuh jalur aplikasi-turunan.** Seam
> `src/modules/application-registry.ts` + `application-theme-registry.ts`,
> gerbang `extension:check` (`scripts/extension-check.ts`), mesin manifest
> (`extension-compatibility.ts`, `extension-manifest-contract.ts`,
> `extension.manifest.json`), tipe `ApplicationModuleRegistry`/
> `ModuleMigrationNamespace`, fungsi `mergeModuleRegistries`, konstanta
> `BASE_MODULE_MIGRATION_NAMESPACE`, namespace migration 900–999, dan check
> `prohibited_base_override`/`invalid_module_type`/`migration_namespace_overlap`
> **sudah tidak ada**. Keluarga (awcms/awcms-mini/awcms-micro) = tiga template
> dipakai LANGSUNG; modul website/domain baru masuk `src/modules/index.ts`
> langsung. Yang di bawah ini adalah mekanisme base yang DIPERTAHANKAN.

Mesin komposisi memvalidasi **satu registry base** (bukan `{ base,
application }`). `src/modules/module-management/domain/module-composition.ts`
mengekspor `composeModuleRegistry(registry)`, `validateComposedModuleRegistry(
registry)`, dan `buildComposedModuleInventory(registry)` — semuanya menerima
`readonly ModuleDescriptor[]`, dipanggil eksplisit oleh
`bun run modules:compose:check` (pola identik dengan
`validateModuleDependencyGraph`/`modules:dag:check`, sengaja dipakai ulang).

- **Registry base tunggal**: `src/modules/index.ts` = `modules = [...baseModules]`
  langsung. `listModules()`/`listBaseModules()` mengembalikan registry base
  22 modul; identitas referensi (`descriptors === listModules()`, diandalkan
  `descriptor-sync.ts`) dipertahankan. Menambah modul = tambahkan descriptor-nya
  ke `index.ts` (lihat skill `awcms-micro-new-module`).
- **Check komposisi base-load-bearing** (dipertahankan): DAG, `duplicate_module_key`,
  `capability_provider_conflict`/`capability_provider_missing`,
  `deployment_profile_incompatible`, `navigation_path_conflict`,
  `invalid_job_descriptor` — masih superset dari `modules:dag:check`.
- **`bun run modules:composition:inventory:generate`/`:check`** — snapshot JSON
  deterministik registry base (`docs/awcms-micro/module-composition-inventory.json`,
  field `moduleCount`; tanpa `source`/`migrationNamespaces`) untuk bukti CI/rilis,
  wired ke `bun run check`.
- **Fixture test-support**: `tests/fixtures/example-domain-modules/` (mengekspor
  `exampleDomainModules`, `bun test tests/unit/module-composition-fixture.test.ts`)
  — membuktikan mesin komposisi memvalidasi modul domain saat di-compose dengan
  `listBaseModules()`.

`MODULE_CONTRACT_VERSION` kini **2.0.0** (`_shared/module-contract.ts`; MAJOR
karena tipe turunan dihapus). Detail keputusan: `docs/adr/0036-remove-derived-
application-pathway-align-family.md` (men-supersede ADR-0013/0014/0015/0035).
