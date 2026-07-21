# ADR-0035 — Pertahankan mekanisme komposisi modul; tolak pelepasan kode jalur aplikasi-turunan

- **Status:** Superseded by [ADR-0036](0036-remove-derived-application-pathway-align-family.md)
- **Catatan (2026-07-21):** keputusan "tolak pelepasan (won't-do)" **DIBALIK** oleh [ADR-0036](0036-remove-derived-application-pathway-align-family.md). Pemilik (@ahliweb) menyeragamkan keluarga dengan `awcms` (yang sudah menghapus penuh jalur turunan, PR #205), dan bukti membuktikan removal dapat dilakukan **tanpa menurunkan cakupan test** (fixtures direlokasi jadi test-support non-derived, check base-load-bearing dipertahankan). ADR-0036 §3 merekonsiliasi kelima temuan bukti di bawah item-per-item.
- **Tanggal:** 2026-07-21
- **Pengambil keputusan:** @ahliweb
- **Terkait:** [ADR-0034](0034-template-repositioning-online-store-scope-and-derived-app-deprecation.md) §3/§Konsekuensi (menutup butir "utang lanjutan (b)"), [ADR-0013](0013-extension-layers-and-boundary-model.md), [ADR-0014](0014-deterministic-build-time-module-composition.md), [ADR-0015](0015-derived-application-compatibility-manifest.md).

## Konteks

[ADR-0034](0034-template-repositioning-online-store-scope-and-derived-app-deprecation.md) me-reposisi awcms-micro sebagai **template dipakai langsung** dan men-**deprecate** jalur aplikasi-turunan (ADR-0013/0014/0015) menjadi **opsional-lawas**. ADR-0034 §3 dengan sengaja **tidak menghapus** kode/gerbangnya, dan mencatat pelepasan sebagai **"utang lanjutan (b)": opsional & evidence-gated — perlu ADR sendiri + verifikasi CI penuh**.

ADR ini adalah putaran evidence-gated tersebut. Sebelum menghapus apa pun, footprint mekanisme "jalur turunan" dipetakan di kode nyata. Temuannya:

1. **Perakitan registry base memakai mekanisme yang sama.** `src/modules/index.ts` menyusun registry efektifnya sendiri lewat `modules = mergeModuleRegistries(baseModules, applicationModuleRegistry)`. Di base, `applicationModuleRegistry` = `undefined`, sehingga hasilnya byte-identical dengan `baseModules` — tetapi jalur pemanggilannya **adalah** kode base yang aktif, bukan cabang mati.
2. **`application-registry.ts` dan tipenya dirujuk oleh kode base non-turunan.** Nilai `applicationModuleRegistry` di-**import langsung** (bukan sekadar rujukan) oleh **module-sync API** (`/api/v1/modules/sync.ts`) dan `descriptor-sync.ts` — keduanya menyusun ulang registry efektif runtime base. Tipenya `ApplicationModuleRegistry` dikonsumsi berat oleh mesin komposisi base `module-management/domain/module-composition.ts` + `extension-compatibility.ts`. Polanya di-**cermin** oleh **theming** (`application-theme-registry.ts` = seam `undefined` paralel yang identik), **didefinisikan** di `_shared/module-contract.ts`, dan seam-nya dirujuk oleh **business-scope hierarchy-port** (`buildBusinessScopeHierarchyPort()`). Tak satu pun dari situs ini adalah kode turunan — semuanya infrastruktur base.
3. **`modules:compose:check` memvalidasi registry BASE.** `scripts/validate-module-composition.ts` di base (dengan `applicationModuleRegistry = undefined`) tereduksi menjadi validasi registry base saja: duplicate key, DAG dependency, binding capability provider, larangan override modul base, namespace migration, klaim deployment-profile, konflik path navigasi, job descriptor. Ia **superset** dari `modules:dag:check`. Menghapusnya **melemahkan validasi base**.
4. **`extension:check` adalah no-op yang lolos-trivial di base.** `scripts/extension-check.ts` (ADR-0015) tanpa `extension.manifest.json` (base tak punya) selalu lolos; enginenya (`module-management/domain/extension-compatibility.ts`) adalah fungsi murni. Murah dipertahankan; nol manfaat fungsional dari menghapusnya.
5. **Fixtures turunan menopang test base.** `tests/fixtures/derived-application-example` + `derived-theme-example` dipakai unit test yang membuktikan mesin komposisi/theming base (`extension-check-fixtures.test.ts`, `theme-registry.test.ts`, `module-composition-fixture.test.ts`) — mereka adalah **bukti negatif/positif** bahwa seam base bekerja, bukan sekadar demo turunan.

Kesimpulan bukti: "jalur aplikasi-turunan" **tidak** dapat dilepas sebagai cabang mati. Inti mekanismenya (`mergeModuleRegistries`/`composeModuleRegistry`, seam `application-registry.ts`, gerbang `modules:compose:check`) **adalah infrastruktur base load-bearing** yang menopang perakitan registry base, theming, sync, dan business-scope. Menghapusnya = rewrite invasif dan sensitif-keamanan atas jalur pemuatan modul base **tanpa manfaat fungsional**, dan justru **memunculkan kembali drift docs-vs-kode** yang ADR-0034 §3 (mewarisi ADR-0025 §5) tahan untuk dicegah.

## Keputusan

1. **Pertahankan mekanisme komposisi modul sebagai infrastruktur base.** `mergeModuleRegistries`/`composeModuleRegistry`, `src/modules/application-registry.ts` (seam inert `undefined`), `modules:compose:check`, `modules:composition:inventory:check`, `modules:dag:check`, dan pola descriptor-seam theming **tetap** — mereka bukan kode turunan opsional, melainkan cara base merakit + memvalidasi registry-nya sendiri.

2. **Tolak pelepasan kode/gerbang jalur turunan.** Butir "utang lanjutan (b)" ADR-0034 §Konsekuensi dinyatakan **SELESAI dengan keputusan menolak (won't-do)**, bukan tertunda. Tidak ada penghapusan `application-registry.ts`, `extension:check`, `extension-compatibility.ts`, `extension-manifest-contract.ts`, atau fixtures turunan.

3. **`extension:check` tetap sebagai guardrail murah.** Ia lolos-trivial di base (tak ada manifest = tak ada kendala dideklarasikan), dan menjadi bermakna otomatis bila suatu saat sebuah repo memakai seam turunan — mempertahankannya nol-biaya dan menjaga gerbang CI hijau tanpa perubahan.

4. **Status "opsional-lawas" ADR-0034 §3 tetap berlaku untuk NARASI, bukan kode.** Dokumentasi tetap tidak mengarahkan pengguna ke jalur turunan sebagai default (sudah dilakukan di ADR-0034 Round 1: `derived-application-guide.md` + `derived-app-pilot-plan.md` bertanda DEPRECATED). Yang berubah dengan ADR ini: pertanyaan **"apakah kodenya dihapus?"** dijawab **tidak, permanen, dengan bukti** — sehingga tidak ada lagi utang yang menggantung.

## Konsekuensi

- **Positif:** menutup satu-satunya butir ADR-0034 yang masih terbuka dengan keputusan berbasis-bukti, bukan pekerjaan berisiko. CI tetap hijau, tidak ada drift docs-vs-kode, tidak ada pelemahan validasi registry base, tidak ada rewrite jalur pemuatan modul yang sensitif-keamanan.
- **Netral:** seam `application-registry.ts` tetap ada sebagai titik ekstensi inert. Jika di masa depan benar-benar diperlukan repo turunan, mekanismenya masih utuh (ADR-0013/0014/0015 sebagai referensi teknis, berstatus opsional-lawas).
- **Tidak berubah:** seluruh arsitektur runtime, registry 22-modul, dan gerbang CI (`bun run check` tetap menjalankan `modules:compose:check`, `modules:composition:inventory:check`, `extension:check` — semuanya valid dan hijau untuk base).
- **Jika kelak removal diinginkan lagi:** butuh ADR baru yang membantah temuan bukti §Konteks di atas (mis. setelah theming + business-scope + sync dilepas dari seam komposisi), bukan sekadar menghidupkan kembali "utang (b)".
