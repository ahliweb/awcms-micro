---
name: awcms-micro-new-module
description: Scaffold modul baru pada modular monolith AWCMS-Micro. Gunakan saat membuat modul domain baru di src/modules/ (mis. warehouse-management, accounting-tax) atau saat memerlukan struktur module.ts + domain/application/infrastructure/api + README. Ikuti struktur standar doc 10 & 11.
---

# AWCMS-Micro — New Module Scaffold

Buat modul mengikuti struktur standar di `docs/awcms-micro/10_template_kode_coding_standard.md` dan `docs/awcms-micro/11_implementation_blueprint.md`.

## Struktur wajib

```text
src/modules/<module-kebab>/
├── module.ts            # ModuleDescriptor
├── domain/               # entities.ts, value-objects.ts, events.ts
├── application/          # services.ts, commands.ts, queries.ts
├── infrastructure/       # repository.ts, mappers.ts
└── README.md             # design doc lengkap: tujuan, tabel, endpoint, event, dependency, invariant keamanan (lihat README modul lain — 94-854 baris, bukan ringkasan singkat)
```

Route API **tidak** hidup di dalam folder modul — tidak ada modul mana pun
yang punya folder `api/` (`find src/modules -maxdepth 2 -type d -name api`
kosong). Route nyata selalu di `src/pages/api/v1/<resource>/...` (Astro
file-based routing), meng-import service/repository dari
`application`/`infrastructure` modul terkait. Lihat `awcms-micro-new-endpoint`.

## Module descriptor (`module.ts`)

```ts
import { defineModule } from "../_shared/module-contract";

export const <camelCase>Module = defineModule({
  key: "<snake_case>",
  name: "<Nama Modul>",
  version: "0.1.0",
  status: "active", // active | experimental | deprecated | maintenance | disabled
  description: "...",
  dependencies: ["tenant_admin", "identity_access", "observability_logging"],
  type: "domain", // base | system | domain | integration | derived — modul domain baru (bukan infrastruktur generik) pakai "domain"
  api: { openApiPath: "openapi/modules/<module>.openapi.yaml", basePath: "/api/v1" },
  events: {
    asyncApiPath: "asyncapi/modules/<module>-events.asyncapi.yaml",
    publishes: [],
    subscribes: []
  }
  // Field opsional lain (Issue #511, epic #510 — Module Management):
  // isCore, permissions, navigation, settings, jobs, health,
  // compatibility, maintainers. Deklarasikan hanya setelah fitur
  // sungguhan yang bersangkutan ADA di modul ini — jangan klaim
  // kapabilitas yang belum diimplementasi (lihat contoh nyata:
  // `src/modules/module-management/module.ts` menambah `navigation`
  // baru setelah Issue #518 selesai, `jobs` setelah #519, satu-satu).
});
```

## Aturan

1. Daftarkan modul di `src/modules/index.ts` (`modules[]`).
2. `key` = `snake_case`; folder = `kebab-case`; type = `PascalCase`.
3. Route tipis → guard → validasi → service → repository (lihat `awcms-micro-abac-guard`).
4. Sertakan TODO jelas; jangan klaim production-ready.
5. Jika modul punya tabel → `awcms-micro-new-migration`. Jika ada API → `awcms-micro-new-endpoint`. Jika ada event → `awcms-micro-new-event`.
6. **Sync descriptor ke database registry wajib** (Issue #513, epic #510) — mendaftarkan modul di `src/modules/index.ts` saja **tidak otomatis** membuat baris `awcms_micro_modules`/`_dependencies`/`_navigation`/`_jobs`. Jalankan `POST /api/v1/modules/sync` (atau `bun run modules:sync` bila skrip CLI tersedia) minimal sekali setelah modul terdaftar — atau andalkan sinkronisasi otomatis yang sudah terpasang di beberapa mutasi tenant-scoped modul lain yang punya FK ke `awcms_micro_modules` (`enableTenantModule`/`disableTenantModule`/`updateModuleSettings`/`runModuleHealthCheck` semua memanggil `syncModuleDescriptors(tx)` sendiri) — **jangan asumsikan** operator sudah sync manual sebelum modul barumu dipakai lewat jalur itu.
7. Jika modul mendeklarasikan `permissions` di descriptor, verifikasi juga migration seed permission-nya konsisten (`GET /api/v1/modules/{moduleKey}/permissions`, Issue #517, akan melaporkan `missing`/`mismatched_description` kalau tidak sinkron).

## Nama modul valid

Domain retail/POS contoh (aspirational, belum tentu ada di base generik ini): `tenant-admin`, `identity-access`, `profile-identity`, `catalog-inventory`, `sales-pos`, `shared-stock-routing`, `warehouse-management`, `accounting-tax`, `crm-communication`, `sync-storage`, `ai-analyst`, `localization-ui`, `observability-logging`, `database-connectivity`, `workflow-approval`, `management-reporting`, `ui-experience`, `production-security-readiness`.

Modul base generik yang **sudah nyata terdaftar** di repo ini (`src/modules/index.ts` — lihat file itu untuk daftar & jumlah yang selalu terkini, jangan hardcode angka di sini karena bertambah seiring modul baru admisi): fondasi (`tenant-admin`, `profile-identity`, `identity-access`, `logging`, `module-management`), layanan platform (`sync-storage`, `media-library`, `domain-event-runtime`, `data-lifecycle`, `reporting`, `email`, `form-drafts`), dan scope website (`tenant-domain`, `blog-content`, `news-portal`, `social-publishing`, `visitor-analytics`). **Tujuh modul ERP milik upstream awcms-mini** (`workflow`, `organization_structure`, `document_infrastructure`, `data_exchange`, `integration_hub`, `reference_data`, `idn_admin_regions`) **tidak diport ke repo ini** (ADR-0025, website-scope) — jangan asumsikan mereka ada hanya karena mereka ada di dokumentasi/skill upstream mini.

## Sebelum scaffold modul baru: cek kebijakan admission

Sebelum membuat modul baru di repo base ini (bukan sekadar mengubah modul
yang sudah ada), baca `docs/awcms-micro/21_module_admission_governance.md`
(kategori Core/System/Official Optional Module/Derived Application/
External Integration, pohon keputusan admission, kriteria dependency &
security review) dan isi
`docs/awcms-micro/templates/module-proposal-template.md` di issue GitHub
terkait. Modul spesifik satu domain bisnis (POS, gudang, pajak, CRM, dll.)
**tidak masuk repo ini** — lihat pohon keputusan di doc 21 §3.

**Modul di REPO BASE ini** (langkah 1 di atas) vs **modul di REPO TURUNAN**
(Issue #740, ADR-0014) adalah dua alur berbeda: bila modulmu memang
spesifik satu domain bisnis dan pohon keputusan doc 21 §3 mengarahkan ke
"bukan untuk repo base ini", **jangan** daftarkan di `src/modules/index.ts`
repo ini — buat repo turunan sendiri lalu daftarkan modulnya di
`src/modules/application-registry.ts` MILIK REPO TURUNAN itu (satu-satunya
file yang perlu diedit; struktur `module.ts` + `domain/application/
infrastructure/api` di atas tetap sama persis). `composeModuleRegistry()`
(`module-management/domain/module-composition.ts`) yang menggabungkan
registry base + registry turunan saat build. Detail: skill
`awcms-micro-module-management` §Komposisi modul build-time,
`docs/awcms-micro/derived-application-guide.md`, dan
`docs/adr/0014-deterministic-build-time-module-composition.md`.

Setelah modul terdaftar dan `bun run modules:compose:check` hijau,
publikasikan/perbarui `extension.manifest.json` repo turunan Anda
(`compatibleAwcmsMicroRange`, `moduleContractVersion`,
`contributedModules` termasuk modul baru ini, dst.) dan jalankan `bun run
extension:check` (Issue #741/ADR-0015) — memverifikasi aplikasi turunan
Anda TETAP kompatibel dengan rilis base saat ini, pertanyaan yang berbeda
dari "registry saya valid hari ini" yang sudah dijawab
`modules:compose:check`. Detail: skill `awcms-micro-module-management`
§Manifest kompatibilitas aplikasi turunan,
`docs/adr/0015-derived-application-compatibility-manifest.md`.

## Contoh admission-only + contribution contract (ADR-0028)

Tidak setiap ADR admission mendaftarkan descriptor di PR yang sama. Bila sebuah
modul base baru diadmisi **sebelum** ada baris kode runtime-nya (keystone
sebelum issue-issue runtime turunannya), pola yang benar adalah **admission-only**:

- Terbitkan ADR admission (Accepted) yang menetapkan key/kategori/arah
  dependency/kontrak — TAPI **jangan** daftarkan descriptor di
  `src/modules/index.ts` dan **jangan** naikkan `EXPECTED_BASE_MODULE_COUNT`
  (`scripts/scope-consistency-check.ts`) di PR admission itu. Registry tetap di
  angka lamanya; descriptor + bump hitungan + regenerasi inventori
  (`repo:inventory:generate`, `modules:composition:inventory:generate`) mendarat
  **bersama** issue runtime pertama. Ini menjaga anchor drift-guard bermakna:
  hitungan modul naik saat KODE modul masuk, bukan saat ADR-nya Accepted.
- Yang boleh mendarat di PR admission: **file type port netral** di
  `src/modules/_shared/ports/*.ts` (belum di-wire, belum di
  `capability-contract-versions.ts` — preseden `legal-hold-guard-port.ts`) plus
  fixture kontraknya. `CAPABILITY_CONTRACT_VERSIONS[<cap>]` dipasangkan dengan
  `provides` sebuah modul, jadi menyusul saat descriptor-nya mendarat.

**Contribution contract (arah panah).** Bila modul baru meng-agregasi kontribusi
banyak modul lain (mis. SEO meng-agregasi fakta dari konten/berita/media/domain),
balik arahnya: modul kontributor **menyediakan** kapabilitas (`provides`), modul
agregator **mengonsumsi** (`consumes`, `optional: true`) — bukan sebaliknya.
Agregator jangan mengimpor internal kontributor dan jangan menulis ke tabelnya;
kolaborasi lewat port + event (ADR-0011/0013 §6). Ini menjaga graf DAG-safe
(agregator tidak menyeret lifecycle dependency ke setiap kontributor) dan
menjaga "tidak ada modul base yang bergantung pada modul turunan". Contoh nyata:
`docs/adr/0028-seo-distribution-module-admission.md` (`seo_distribution`),
port `src/modules/_shared/ports/seo-facts-port.ts`, fixture
`tests/unit/seo-facts-contract.test.ts`.

## Verifikasi

- `bun run build` pass.
- Modul terdaftar di registry (base: `src/modules/index.ts`; turunan:
  `src/modules/application-registry.ts` milik repo turunan sendiri, lalu
  `bun run modules:compose:check` hijau).
- README modul terisi.
