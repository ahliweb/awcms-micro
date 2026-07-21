# Bagian 9 — Roadmap Teknis Repository dan Urutan Commit

## Tujuan

Dokumen ini menjadi panduan teknis implementasi repository AWCMS-Micro: struktur folder, branch, commit atomic, migration order, API/UI/testing order, release versioning, merge/deploy checklist, dan template laporan implementasi.

## Prinsip repository

1. Setiap perubahan atomic.
2. Jangan campur perubahan unrelated.
3. Database change harus migration.
4. API change harus OpenAPI.
5. Event change harus AsyncAPI.
6. High-risk mutation harus idempotent.
7. High-risk action harus audit.
8. Resource deletable memakai soft delete; posted/append-only entity tidak dihapus.
9. Jangan commit `.env`, token, backup, dump DB, data customer asli.

## Struktur repository final

```text
awcms-micro/
├── AGENTS.md
├── README.md
├── CHANGELOG.md         # digenerate Changesets
├── .changeset/          # config + changeset entries
├── .claude/skills/      # skill proyek Claude Code
├── package.json
├── bun.lock
├── astro.config.mjs
├── tsconfig.json
├── .env.example
├── .gitignore
├── docker-compose.yml
├── src/
├── sql/
├── scripts/
├── openapi/
├── asyncapi/
├── docs/
├── deploy/
├── tests/
├── fixtures/
└── public/
```

## Struktur source

```text
src/
├── lib/
│   ├── db.ts
│   ├── database/
│   ├── logging/
│   ├── auth/
│   ├── files/
│   └── errors/
├── modules/
│   ├── _shared/
│   ├── tenant-admin/
│   ├── identity-access/
│   ├── profile-identity/
│   ├── sync-storage/
│   ├── localization-ui/
│   ├── observability-logging/
│   ├── database-connectivity/
│   ├── management-reporting/
│   ├── ui-experience/
│   └── production-security-readiness/
└── pages/
    ├── api/v1/
    └── admin/
```

Modul domain toko online (mis. `catalog`, `storefront-checkout`, `order-management`) diisi **langsung di repo ini** sebagai contoh — tetap **ILUSTRATIF**, bukan bagian 22-modul registry base. Contoh yang menyentuh gudang/pajak/Coretax (mis. `warehouse-management`, `accounting-tax`) adalah **lineage ERP `awcms` (dikecualikan, [ADR-0034](../adr/0034-template-repositioning-online-store-scope-and-derived-app-deprecation.md) §3, [ADR-0025](../adr/0025-website-scope-derivation-from-awcms-mini.md))** — bukan sesuatu yang dibangun di sini.

## Struktur modul standard

```text
src/modules/<module>/
├── module.ts
├── domain/
├── application/
├── infrastructure/
├── api/
└── README.md
```

## Branch strategy

```mermaid
gitGraph
  commit id: "init"
  branch develop
  checkout develop
  commit id: "foundation"
  branch feature/0.1-skeleton
  commit id: "skeleton"
  checkout develop
  merge feature/0.1-skeleton
  branch feature/2.1-tenant
  commit id: "tenant schema"
  checkout develop
  merge feature/2.1-tenant
  checkout main
  merge develop tag: "v0.1.0"
```

| Branch                   | Fungsi                  |
| ------------------------ | ----------------------- |
| `main`                   | Stabil/production-ready |
| `develop`                | Integrasi fitur         |
| `feature/<issue>-<name>` | Fitur atomic            |
| `fix/<issue>-<name>`     | Bug fix                 |
| `release/vX.Y.Z`         | Release prep            |
| `hotfix/vX.Y.Z-<name>`   | Hotfix production       |

## GitHub issue snapshot

Issue atomic dibuat atau dibuat ulang dari `docs/awcms-micro/06_github_issues_detail.md`, sedangkan state GitHub aktual dicatat di `docs/awcms-micro/github/`. Snapshot live terbaru bisa saja kosong apabila issue GitHub sudah dibersihkan; dalam kondisi itu, dokumen 06 tetap menjadi backlog rencana, bukan bukti issue aktif.

Aturan:

1. Snapshot issue dipisahkan berdasarkan state: `issues-open-NNN.md` dan `issues-closed-NNN.md`.
2. Setiap file snapshot berisi maksimal 100 issue.
3. Snapshot memuat metadata issue, body, label, milestone, assignee, timestamp, URL, dan komentar.
4. Label dan milestone dicatat di `docs/awcms-micro/github/labels-milestones.md`.
5. Refresh snapshot dilakukan setelah perubahan massal issue, sebelum audit sprint, dan sebelum laporan release.

## Commit convention

Format:

```text
<type>(<scope>): <summary>
```

Contoh:

```text
feat(profile): add central profile schema
feat(sync): add offline sync outbox and inbox
fix(access): prevent privilege escalation on role assignment
docs(security): add production readiness checklist
test(access): add ABAC default deny tests
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `security`, `perf`, `ci`, `build`.

Scopes: `foundation`, `db`, `api`, `auth`, `access`, `profile`, `tenant`, `sync`, `ui`, `logging`, `pooling`, `reporting`, `security`, `docs`. Contoh domain toko online menambah scope-nya sendiri (mis. `catalog`, `storefront`, `checkout`, `order`, `content`). Scope gudang/pajak (`warehouse`, `tax`) adalah lineage ERP `awcms` (dikecualikan, ADR-0034 §3).

## Urutan commit atomic utama

### Sprint 1

1. `feat(foundation): initialize Bun Astro modular monolith skeleton`
2. `feat(db): add SQL migration runner`
3. `feat(api): add OpenAPI and AsyncAPI baseline contracts`
4. `feat(shared): add soft delete repository conventions`
5. `chore(deploy): add local PostgreSQL Docker Compose profile`

### Sprint 2

1. `feat(tenant): add tenant office and physical location schema`
2. `feat(profile): add central profile management schema`
3. `feat(profile): add profile resolver and entity linking service`
4. `feat(auth): add identity login and tenant user membership`

### Sprint 3

1. `feat(access): add RBAC ABAC schema and activity registry`
2. `feat(access): implement ABAC evaluator with deny by default`
3. `feat(access): add access assignment API and audit trail`

### Sprint 4

1. `feat(logging): add structured logger and request correlation`
2. `feat(logging): add cross-module audit event helper`
3. `feat(pooling): add database pool gate and backpressure`
4. `security(production): add production security readiness checklist`

### Sprint 5

1. `feat(sync): add offline sync outbox inbox and signed API`
2. `feat(sync): add sync conflict tracking and resolution`
3. `feat(sync): add R2 object sync queue`

### Sprint 6

1. `feat(ui): add UI persona screen and navigation registry`
2. `feat(ui): build admin shell with modular navigation`
3. `feat(reporting): add management reporting views and dashboard API`

### Sprint 7

1. `chore(deploy): add offline LAN and production deployment profiles`
2. `docs(handover): add operational SOP and handover manual`

Contoh domain website (katalog, storefront/checkout, manajemen pesanan online) ditambahkan **langsung di repo ini** setelah base siap — tetap ilustratif. Contoh gudang/pajak/Coretax adalah lineage ERP `awcms` (dikecualikan, [ADR-0034](../adr/0034-template-repositioning-online-store-scope-and-derived-app-deprecation.md) §3).

## Migration order final rekomendasi

```text
001_awcms_micro_foundation_schema.sql
002_awcms_micro_tenant_office_schema.sql
003_awcms_micro_central_profile_management_schema.sql
004_awcms_micro_identity_login_schema.sql
005_awcms_micro_abac_access_control_schema.sql
006_awcms_micro_setup_wizard_schema.sql
007_awcms_micro_sync_storage_outbox_inbox_schema.sql
008_awcms_micro_sync_storage_conflict_schema.sql
009_awcms_micro_object_sync_queue_schema.sql
010_awcms_micro_management_reporting_permission_schema.sql
011_awcms_micro_audit_logging_schema.sql
012_awcms_micro_idempotency_store_schema.sql
013_awcms_micro_i18n_po_schema.sql
014_awcms_micro_theme_mode_schema.sql
015_awcms_micro_ui_ux_persona_experience_schema.sql
016_awcms_micro_modular_monolith_contracts_schema.sql
017_awcms_micro_dashboard_materialized_views.sql
```

Catatan: setelah production, migration tidak boleh di-rename sembarangan. Koreksi harus migration baru. Aplikasi turunan melanjutkan nomor migration domainnya sendiri mulai nomor setelah migration terakhir base di atas.

**Komposisi aplikasi-turunan + skema migration-namespace DIHAPUS oleh ADR-0036.** Jalur turunan (`src/modules/application-registry.ts`, `composeModuleRegistry()` merge, `BASE_MODULE_MIGRATION_NAMESPACE`, range 900–999, `ApplicationModuleRegistry.migrationNamespace`) sudah tidak ada. Migration berlanjut sekuensial di dalam repo ini — nomor baru = setelah migration terakhir base saat ini; koreksi selalu lewat migration baru, bukan mengedit yang lama.

`002` semula bernama `tenant_identity_schema` (menggabungkan Issue 2.1 dan 2.3); dipecah agar satu migration = satu issue: `002` scope Issue 2.1 (tenant/office), `004` scope Issue 2.3 (identity/login). `006` (setup wizard, Issue 12.1) diimplementasikan lebih awal dari rencana semula (slot `015`) begitu Issue 2.1–2.4 selesai — sesuai `docs/awcms-micro/06_github_issues_detail.md` §Koreksi urutan sprint yang menempatkan 12.1 tepat setelah 2.4. `007` (Issue 6.1 — sync nodes/outbox/inbox), `008` (Issue 6.2 — sync conflict tracking), dan `009` (Issue 6.3 — R2 object sync queue) dipecah dari rencana gabungan `sync_storage_r2`, menuntaskan epic M5 (Sync Storage) sepenuhnya; `008` juga menambah `ALTER TABLE` pada tabel `sync_push_batches` milik `007` (koreksi via migration baru, bukan mengedit `007`), dan `008`/`009` masing-masing menyisipkan permission baru ke katalog `awcms_micro_permissions` (`005`). `009` tidak memanggil R2/Cloudflare SDK nyata — hanya antrean lokal + kolom `requires_upload` yang digerakkan env `R2_ENABLED`; dispatcher upload nyata tetap backlog pada saat itu (kemudian dibangun oleh Issue #436, migrasi `018` — lihat `src/modules/sync-storage/README.md` §Dispatcher), sama seperti `awcms_micro_sync_outbox` (event lokal antar-node) yang juga belum punya dispatcher live saat `007`/`009` dibuat. `010` (Issue 9.1 — management reporting) diimplementasikan lebih awal dari rencana semula (slot `016`) karena 9.1 hanya bergantung pada M2 (tuntas) dan mengikuti tepat setelah 8.1 di sprint aktual, bukan setelah M8; migration ini hanya menyisipkan satu permission baru (`reporting.dashboard.read`) ke katalog `005` — keempat view laporannya (tenant activity, access/audit, sync health, module usage) adalah agregasi baca murni atas tabel yang sudah ada (`002`-`009`), tidak ada tabel baru. Slot `016` lama (`management_dashboard_reporting_schema`) dihapus dari rencana karena sudah terealisasi sebagai `010`; sisa migration `011`-`019` bergeser turun satu slot mengikuti hal ini. `011` (Issue 10.1 — structured logging & audit trail) tetap di nomor yang sama seperti rencana, hanya nama file diganti dari `logging_observability_schema` menjadi `audit_logging_schema` agar mencerminkan scope sesungguhnya (tabel generik `awcms_micro_audit_events` + 2 permission baru — `logging.audit_trail.read` dan `profile_identity.profile_management.purge`; `profile_identity.profile_management.delete`/`.restore` sudah diseed sejak `005`); Issue 10.2 (connection pooling & backpressure) ternyata tidak butuh migration sama sekali — pool config, work-class gate, dan circuit breaker semuanya infrastruktur aplikasi murni (`src/lib/database/`) di depan koneksi yang sudah ada, bukan skema baru. Slot `012` lama (`database_connection_pooling_schema`) dihapus dari rencana; sisa migration `013`-`019` bergeser turun satu slot menjadi `012`-`018`. Issue 10.3 (production security readiness checklist) juga tidak butuh migration — deliverable-nya adalah tiga script CLI (`bun run db:pool:health`, `bun run security:readiness`, `bun run production:preflight`) yang memverifikasi kontrol yang sudah ada (RLS, ABAC default-deny, audit trail, pool health), bukan skema baru. Slot lama `012` (`production_security_readiness_schema`) dihapus dari rencana; sisa migration `013`-`018` bergeser turun satu slot menjadi `012`-`017`. Issue 11.1 (workflow approval engine) **tidak diport ke AWCMS-Micro** — website scope (ADR-0025 §3). Slot `012` yang baru kosong ditempati oleh `012_awcms_micro_idempotency_store_schema.sql` — hanya tabel idempotency generik `awcms_micro_idempotency_keys` yang dipakai bersama oleh endpoint mutation high-risk mana pun; empat tabel workflow (definitions/instances/tasks/decisions) dan permission `workflow.approval.*` yang semula direncanakan sengaja ditinggalkan (ADR-0025 §3). Slot `012`-`014` lama (`i18n_po_schema`, `theme_mode_schema`, `ui_ux_persona_experience_schema`) bergeser turun satu menjadi `013`-`015`. Penomoran `013` dst. di atas adalah rencana; nomor final ditentukan saat setiap issue benar-benar diimplementasikan berurutan.

**Realisasi menyimpang dari rencana di atas (2026-07-06)**: seluruh 18 issue backlog doc 06 tuntas tanpa pernah mengimplementasikan slot rencana `013`-`017` (`i18n_po_schema`, `theme_mode_schema`, `ui_ux_persona_experience_schema`, `modular_monolith_contracts_schema`, `dashboard_materialized_views` — tidak pernah difile sebagai GitHub issue, tetap sketsa aspirasional untuk roadmap base v2/aplikasi turunan, bukan bagian 18 issue backlog yang benar-benar dikerjakan). Migration `013`-`015` yang benar-benar ada di `sql/` adalah **perawatan pasca-backlog** yang sama sekali tidak berkaitan dengan rencana di atas — bukan realisasi/renumbering slot manapun: `013_awcms_micro_enforce_rls_least_privilege.sql` (penegakan RLS `FORCE` + role aplikasi least-privilege), `014_awcms_micro_sync_node_management_permission_schema.sql` (seed permission admin node sync), dan `015_awcms_micro_tenant_settings_management_permission_schema.sql` (seed permission admin Settings) — ketiganya dicatat lengkap di `AUDIT_STANDAR_PENGEMBANGAN_2026-07-04.md` §Perawatan pasca-backlog, bukan di sini karena bukan bagian issue backlog terencana.

## Urutan API implementation

1. Shared response/error helper.
2. Tenant context middleware.
3. Auth middleware.
4. ABAC middleware.
5. Idempotency middleware.
6. Soft delete query/repository helper.
7. Audit helper.
8. Logging middleware.
9. `/setup/status` dan `/setup/initialize`.
10. `/auth/login` dan `/auth/me`.
11. `/access/evaluate`.
12. `/profiles/resolve`.
13. Soft delete/restore endpoint untuk master data yang deletable.
14. `/sync/push` dan `/sync/pull`.
15. `/reports/*` (view generik: tenant activity, access/audit summary, sync health).
16. `/security/go-live-gates/evaluate`.

Contoh domain website di repo ini menambah endpoint domainnya (mis. katalog, checkout, pesanan online) setelah urutan base ini — tetap ilustratif. Endpoint gudang/pajak adalah lineage ERP `awcms` (dikecualikan, ADR-0034 §3).

## Urutan UI implementation

1. Design tokens.
2. Base layout.
3. Button/input/select/dialog/table/status components.
4. Login.
5. Setup wizard.
6. Admin shell.
7. Dashboard.
8. User/access management.
9. Reports generik (tenant activity, sync health, audit).
10. Logs/security readiness.

Contoh domain website menambah layar domainnya (storefront, keranjang/checkout, halaman pesanan, portal customer) setelah urutan base ini — tetap ilustratif.

## Versioning

```mermaid
flowchart LR
  V1[v0.1.0<br/>foundation skeleton] --> V2[v0.2.0<br/>tenant/identity/profile]
  V2 --> V3[v0.3.0<br/>RBAC/ABAC]
  V3 --> V4[v0.4.0<br/>logging/pooling/security readiness]
  V4 --> V5[v0.5.0<br/>sync storage]
  V5 --> V6[v0.6.0<br/>UI shell/reporting]
  V6 --> V7[v0.7.0<br/>deployment]
  V7 --> V8[v1.0.0<br/>base production-ready]
```

| Versi    | Isi                                                                                 |
| -------- | ----------------------------------------------------------------------------------- |
| `v0.1.0` | Foundation skeleton (SSR, module contract, migration runner, API contract baseline) |
| `v0.2.0` | Tenant, identity, profile                                                           |
| `v0.3.0` | RBAC/ABAC evaluator + assignment                                                    |
| `v0.4.0` | Logging, pooling, security readiness                                                |
| `v0.5.0` | Sync storage (outbox/inbox, conflict, R2 queue)                                     |
| `v0.6.0` | UI shell, management reporting                                                      |
| `v0.7.0` | Deployment profile                                                                  |
| `v1.0.0` | Base production-ready (gates doc 07)                                                |

Contoh domain website/toko online yang dibangun di atas base ini melanjutkan baseline versinya sendiri di atas versi base.

Nomor versi naik progresif per rilis Changesets, bukan hanya saat satu slot di atas selesai penuh — satu issue yang merge bisa langsung memicu rilis minor/patch walau issue lain dalam slot yang sama belum selesai. `CHANGELOG.md` mencatat isi riil tiap rilis; tabel ini hanya peta target.

### SemVer

- **MAJOR** — perubahan tidak-kompatibel (breaking) pada API/kontrak/schema publik.
- **MINOR** — fitur baru yang kompatibel ke belakang.
- **PATCH** — bug fix kompatibel.
- Pra-1.0.0: perubahan minor boleh membawa penyesuaian yang belum stabil.

### Versioning dengan Changesets

Versi & `CHANGELOG.md` dikelola dengan [Changesets](../../.changeset/README.md). Alur:

```mermaid
flowchart LR
  PR[PR mengubah perilaku] --> CS[Tambah changeset<br/>bun run changeset]
  CS --> Merge[Merge ke main]
  Merge --> Rel[Rilis: bun run changeset:version]
  Rel --> Bump[Bump versi package.json]
  Rel --> Log[Update CHANGELOG.md]
  Bump --> Tag[Tag vX.Y.Z + release]
```

Aturan:

- **Setiap PR** yang mengubah perilaku (fitur, fix, schema/API/event) **wajib menyertakan satu changeset** dengan tingkat bump SemVer + ringkasan.
- Perubahan **docs-only/chore** boleh tanpa changeset — ditegakkan otomatis oleh `bun run changesets:policy:check` (`scripts/changeset-policy-check.ts`, bagian gate `Changesets policy` di CI, lihat [`release-process.md`](release-process.md)).
- Baseline saat ini `0.0.0` (belum ada kode dirilis); rilis bertag pertama = `0.1.0` (Foundation).
- `CHANGELOG.md` mengikuti format Keep a Changelog; entri versi digenerate dari changeset.
- Proses rilis ter-otomasi lewat skill `awcms-micro-release` (status → version → tag → GitHub release), yang membungkus empat perintah CLI Changesets: `bun run changeset` (tambah changeset baru), `bun run changeset:status` (lihat changeset pending + bump level tergabung tanpa menulis apa pun — cek cepat sebelum rilis), `bun run changeset:version` (konsumsi changeset pending → bump `package.json` + tulis `CHANGELOG.md`), dan `bun run changeset:tag` (buat git tag `vX.Y.Z` dari versi `package.json` saat ini, langkah terakhir sebelum `git push --tags` memicu `release.yml`).

## PR checklist

- Scope sesuai issue.
- Tidak ada unrelated change.
- No secret/data customer.
- Build pass.
- Test relevan pass.
- Migration jika schema berubah.
- OpenAPI jika API berubah.
- AsyncAPI jika event berubah.
- Security notes terpenuhi.
- Soft delete policy terpenuhi untuk resource deletable.
- Docs update.
- Changeset ditambahkan jika perubahan mempengaruhi perilaku.

## Pre-deploy checklist

```bash
bun install
bun run db:migrate
bun run api:spec:check
bun test
bun run build
bun run db:pool:health
bun run security:readiness
```

## Template laporan implementasi

```text
Summary:
Files changed:
Commands run:
Test results:
Security notes:
Documentation updates:
Remaining limitations:
Next recommended step:
```
