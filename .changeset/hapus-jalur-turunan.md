---
"awcms-micro": major
---

refactor(module-composition)!: hapus penuh jalur aplikasi-turunan (ADR-0036, men-supersede ADR-0035)

Menghapus permukaan yang KHUSUS jalur aplikasi-turunan untuk menyeragamkan keluarga dengan `awcms` (yang sudah menghapus penuh jalur turunan, PR #205) — AWCMS-Micro dipakai LANGSUNG sebagai template, tidak ada repo derivatif. ADR-0036 **men-supersede ADR-0035** (yang menolak pelepasan): bukti membuktikan removal dapat dilakukan tanpa menurunkan cakupan test.

Dihapus: seam `src/modules/application-registry.ts` + `src/modules/theming/application-theme-registry.ts`, gerbang `bun run extension:check` (`scripts/extension-check.ts`, dari `package.json` `check` + `.github/workflows/ci.yml` + `production-preflight.ts`), mesin manifest kompatibilitas turunan (`module-management/domain/extension-compatibility.ts`, `_shared/extension-manifest-contract.ts`, `extension.manifest.json`), tipe `ApplicationModuleRegistry`/`ModuleMigrationNamespace` + `mergeModuleRegistries` + `BASE_MODULE_MIGRATION_NAMESPACE`, konsep migration namespace 900–999, dan check turunan-only (`prohibited_base_override`, `invalid_module_type`, `migration_namespace_overlap`).

`module-management/domain/module-composition.ts` kini memvalidasi satu registry base (`composeModuleRegistry(registry)`/`validateComposedModuleRegistry(registry)`/`buildComposedModuleInventory(registry)` menerima `readonly ModuleDescriptor[]`). Check base-load-bearing (DAG, duplicate key, capability binding, deployment-profile, navigation, job) DIPERTAHANKAN. `theme-registry.ts` menyusun tema base in-repo tanpa seam (`composeThemeDescriptors(extraThemes = [])`). `MODULE_CONTRACT_VERSION` `1.5.0` → `2.0.0` (MAJOR: tipe diekspor dihapus).

Fixture `tests/fixtures/derived-application-example/` direlokasi jadi test-support non-derived `tests/fixtures/example-domain-modules/` (mengekspor `exampleDomainModules`); `derived-theme-example` + `extension-contract-incompatible` dihapus. Gate `modules:compose:check` + `modules:composition:inventory:check` tetap ada; `docs/awcms-micro/module-composition-inventory.json` diregenerasi (bentuk `moduleCount`, tanpa `source`/`baseModuleCount`/`migrationNamespaces`). Cakupan test dipertahankan setara. Tanpa migration DB.
