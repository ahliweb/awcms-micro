# ADR-0036 — Hapus penuh jalur aplikasi-turunan, seragamkan keluarga (template dipakai-langsung)

- **Status:** Accepted
- **Tanggal:** 2026-07-21
- **Pengambil keputusan:** @ahliweb
- **Men-supersede:** [ADR-0035](0035-retain-module-composition-mechanism-reject-derived-pathway-code-removal.md) (mempertahankan kode + menolak pelepasan jalur turunan — **dibalik** oleh dokumen ini), [ADR-0013](0013-extension-layers-and-boundary-model.md) (lapisan Derived Application), [ADR-0014](0014-deterministic-build-time-module-composition.md) (komposisi build-time untuk aplikasi turunan / `application-registry.ts`), [ADR-0015](0015-derived-application-compatibility-manifest.md) (manifest kompatibilitas turunan + `extension:check`).
- **Terkait:** [ADR-0034](0034-template-repositioning-online-store-scope-and-derived-app-deprecation.md) (deprecation jalur turunan — dokumen ini menuntaskan §Konsekuensi butir (b) dengan PENGHAPUSAN, bukan penolakan), [ADR-0025](0025-website-scope-derivation-from-awcms-mini.md), [ADR-0029](0029-theming-module-admission.md) (seam tema turunan `application-theme-registry.ts`), ADR-0011 (capability ports). Menegaskan kembali konvensi runtime inti (ADR-0001..0004).
- **Selaras dengan:** `awcms` `ADR-0034` (keluarga = tiga template sejajar dipakai-langsung) dan **PR #205** yang **menghapus penuh** permukaan jalur-turunan di `awcms` — dokumen ini menerapkan langkah yang sama ke `awcms-micro`.

## Konteks

[ADR-0034](0034-template-repositioning-online-store-scope-and-derived-app-deprecation.md) mereposisi awcms-micro sebagai **template dipakai-langsung** dan men-**deprecate** jalur aplikasi-turunan (ADR-0013/0014/0015) menjadi **opsional-lawas**, tetapi **menahan** kodenya. [ADR-0035](0035-retain-module-composition-mechanism-reject-derived-pathway-code-removal.md) kemudian menutup butir "utang lanjutan (b)" ADR-0034 dengan keputusan **menolak pelepasan (won't-do)**, dengan argumen: mekanisme komposisi (`mergeModuleRegistries`/`application-registry.ts`/`modules:compose:check`, dicermin oleh seam tema `application-theme-registry.ts`, dan dirujuk oleh module-sync + business-scope) adalah **infrastruktur base load-bearing**, sehingga menghapusnya = rewrite invasif net-negatif yang memunculkan kembali drift docs-vs-kode.

Dua hal mengubah keputusan itu:

1. **Keputusan pemilik: seragamkan keluarga.** `awcms`, `awcms-mini`, dan `awcms-micro` adalah **tiga template sejajar yang dipakai LANGSUNG**; tidak ada repo yang membangun aplikasi-turunan terpisah di atas yang lain. `awcms` sudah **menghapus penuh** permukaan jalur-turunan-nya (PR #205 — seam `application-registry.ts`, `extension:check`, tipe `ApplicationModuleRegistry`/`ModuleMigrationNamespace`, namespace 900–999). Membiarkan awcms-micro sendirian mempertahankan seam turunan membuat keluarga tidak konsisten dan membiarkan "jalan lama" yang sudah ditolak sebagai model pemakaian tetap tersedia sebagai footgun.

2. **Bukti empiris membantah premis "removal = penurunan cakupan".** Kekhawatiran inti ADR-0035 adalah bahwa melepas mekanisme itu **melemahkan validasi base** dan **membuang fixtures yang menopang test base**. `awcms` membuktikan kebalikannya: seluruh check base-load-bearing (DAG, duplicate key, capability binding, deployment-profile, navigation, job) **dipertahankan**, hanya beroperasi atas **satu registry base** alih-alih `{ base, application }`; fixtures turunan **direlokasi** menjadi test-support non-derived (`example-domain-modules`) sehingga cakupan test **setara**. Tidak ada gerbang yang hilang; `modules:compose:check` + `modules:composition:inventory:check` tetap ada dan tetap memvalidasi registry base.

Dengan bukti itu, argumen ADR-0035 dievaluasi ulang **item-per-item** di §Keputusan — dan setiap temuannya ternyata dapat dipenuhi TANPA seam turunan.

## Keputusan

### 1. Hapus permukaan yang KHUSUS jalur-turunan

Dihapus (bukan sekadar di-deprecate):

- Seam modul `src/modules/application-registry.ts` (selalu `undefined` di base) dan seam tema `src/modules/theming/application-theme-registry.ts` (paralel `undefined`, ADR-0029 §3).
- Gerbang `bun run extension:check` (`scripts/extension-check.ts`) — dari `package.json` script, `bun run check`, `.github/workflows/ci.yml`, dan `scripts/production-preflight.ts`.
- Mesin manifest kompatibilitas turunan: `src/modules/module-management/domain/extension-compatibility.ts` dan `src/modules/_shared/extension-manifest-contract.ts`, beserta `extension.manifest.json` fixture.
- Tipe komposisi turunan `ApplicationModuleRegistry` + `ModuleMigrationNamespace` (`_shared/module-contract.ts`), fungsi `mergeModuleRegistries`, konstanta `BASE_MODULE_MIGRATION_NAMESPACE`, konsep migration namespace 900–999, dan check turunan-only (`prohibited_base_override`, `invalid_module_type`, `migration_namespace_overlap`).

`MODULE_CONTRACT_VERSION` naik **1.5.0 → 2.0.0** (MAJOR: tipe diekspor dihapus).

### 2. PERTAHANKAN mekanisme komposisi base sebagai infrastruktur load-bearing

`module-composition.ts` kini memvalidasi **satu registry base** (`validateComposedModuleRegistry(registry)`/`composeModuleRegistry(registry)`/`buildComposedModuleInventory(registry)` menerima `readonly ModuleDescriptor[]`). Check base-load-bearing (DAG, duplicate key, capability binding, deployment-profile, navigation, job) **tetap** — masih superset dari `modules:dag:check`. `theme-registry.ts` tetap menyusun tema base in-repo (validate + tolak shadow key) melalui `composeThemeDescriptors(extraThemes = [])` tanpa seam. `listModules`/`listBaseModules`, `ModuleDescriptor`/`defineModule`, dan `module_management` tetap identik.

### 3. Rekonsiliasi eksplisit dengan ADR-0035 (men-supersede)

Setiap temuan bukti ADR-0035 §Konteks dijawab tanpa seam turunan:

1. **"Perakitan registry base memakai `mergeModuleRegistries`."** — `src/modules/index.ts` kini `modules = [...baseModules]` langsung; `mergeModuleRegistries` dihapus. Identitas referensi (`descriptors === listModules()`, diandalkan `descriptor-sync.ts`) **dipertahankan** — array module-level tunggal yang stabil. Tidak ada cabang mati yang tersisa.
2. **"`application-registry.ts` di-import module-sync + descriptor-sync."** — kedua situs kini memanggil `composeModuleRegistry(listBaseModules())`; gerbang validasi pra-sync (BLOCKED finding PR #769) **tetap utuh**, hanya tanpa parameter aplikasi. Seam tema paralel (`application-theme-registry.ts`) dan rujukan business-scope juga disesuaikan ke base.
3. **"`modules:compose:check` memvalidasi registry BASE."** — benar, dan itu **dipertahankan**. Ia sekarang eksplisit hanya memvalidasi registry base; tidak ada pelemahan validasi.
4. **"`extension:check` no-op lolos-trivial murah dipertahankan."** — dihapus. Karena base tak punya manifest, gerbang ini **nol-manfaat fungsional**; mempertahankannya justru memaksa memelihara mesin manifest (`extension-compatibility.ts`/`extension-manifest-contract.ts`) yang murni khusus-turunan. Menghapus keduanya menghilangkan surface, bukan proteksi.
5. **"Fixtures turunan menopang test base."** — direlokasi menjadi test-support **non-derived** `tests/fixtures/example-domain-modules/` (mengekspor `exampleDomainModules`). `module-composition-fixture.test.ts` tetap membuktikan mesin komposisi memvalidasi modul domain (di-compose dengan `listBaseModules()`); `theme-registry.test.ts` membuktikan gate validate/dedupe tema dengan tema sintetik inline. Cakupan test **setara** — dibuktikan hijau, bukan diklaim.

Kesimpulan: premis ADR-0035 ("removal = rewrite net-negatif + drift") **terbantah oleh bukti** (awcms + eksekusi di repo ini). ADR-0035 **di-supersede**; jawaban atas "apakah kodenya dihapus?" berubah dari **"tidak, permanen"** menjadi **"ya, dan cakupan test dipertahankan setara"**.

### 4. Dokumen jalur-turunan: usang

`docs/awcms-micro/derived-application-guide.md` dan `docs/awcms-micro/extension-compatibility-policy.md` ditandai **DEPRECATED** menunjuk ADR ini. ADR-0013/0014/0015 di-**supersede** (status diperbarui); ADR-0034 tetap berlaku untuk framing "template dipakai-langsung" (dokumen ini menuntaskan utang (b)-nya).

## Konsekuensi

- **Positif:** keluarga (awcms/awcms-mini/awcms-micro) seragam — tak ada seam aplikasi-turunan; pengembangan langsung di template; modul website/domain baru masuk `src/modules/` dan tema baru masuk `theme-registry.ts` langsung. Surface keamanan-sensitif (mesin manifest, namespace reservation, merge seam) berkurang.
- **Cakupan test:** dipertahankan setara — fixtures direlokasi menjadi test-support; seluruh check base-load-bearing tetap diuji (mutation-style RED tetap ada); `bun run check` penuh hijau.
- **Breaking (internal):** `MODULE_CONTRACT_VERSION` 2.0.0; bentuk `module-composition-inventory.json` berubah (`moduleCount`, tanpa `source`/`baseModuleCount`/`applicationModuleCount`/`migrationNamespaces`) — diregenerasi. Tanpa migration DB (CHECK `awcms_micro_modules_module_type_check` sql/025 tetap; `ModuleType` union tetap kompatibel).
- **Tidak berubah:** seluruh konvensi runtime (Bun-only, RLS/FORCE, RBAC/ABAC default-deny, kontrak OpenAPI/AsyncAPI, registry 22-modul, gerbang CI non-derived). ADR ini mengubah **model pemakaian & tata kelola**, bukan arsitektur runtime.
- **Jika kelak jalur turunan diinginkan lagi:** butuh ADR baru; mekanismenya tak lagi ada di kode (ADR-0013/0014/0015 sebagai rujukan historis).
