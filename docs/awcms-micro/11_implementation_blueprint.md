# Bagian 11 — Implementation Blueprint per Sprint

> **Contoh domain (ilustratif).** Dokumen ini memakai domain **website / toko online** sebagai contoh berjalan — sesuai posisi AWCMS-Micro sebagai **template full-online website yang dipakai langsung** ([ADR-0034](../adr/0034-template-repositioning-online-store-scope-and-derived-app-deprecation.md)). **Pola & standar**-nya reusable; **entitas, endpoint, layar, dan istilah domain** (katalog, pesanan online, checkout, konten) diisi/disesuaikan **langsung di repo ini**. Contoh yang menyentuh **POS in-store, gudang, atau Coretax** adalah **lineage ERP `awcms` (dikecualikan)**, bukan scope base ini. Lihat [README paket dokumen](README.md) §"AWCMS-Micro sebagai standar pengembangan".

## Tujuan

Dokumen ini menjadi blueprint praktis untuk membuat skeleton repository AWCMS-Micro secara bertahap berdasarkan sprint.

## Prinsip blueprint

1. Build-first: setiap sprint menjaga repository tetap buildable.
2. Skeleton-first: buat module descriptor, README, domain, service, repository, route, OpenAPI, migration, test, docs.
3. No fake completion: skeleton diberi TODO jelas dan tidak diklaim production-ready.
4. Security-first: tenant context, ABAC, RLS, audit, masking sejak awal.
5. Soft-delete-first untuk master/config/draft: helper query, kolom standar, dan audit sejak schema awal.

## Alur build skeleton bertahap

```mermaid
flowchart LR
  S1[S1 Foundation<br/>skeleton · migrate · spec · health] --> S2[S2 Tenant/Identity/Profile]
  S2 --> S3[S3 RBAC/ABAC/RLS]
  S3 --> S4[S4 Katalog Toko Online]
  S4 --> S5[S5 Storefront & Checkout online]
  S5 --> S6[S6 Logging & Pooling]
  S6 --> S7[S7 Engagement & Notifikasi]
  S7 --> S8[S8 Sync & R2]
  S8 --> S9[S9 Warehouse — ERP awcms dikecualikan]
  S9 --> S10[S10 Tax/Coretax — ERP awcms dikecualikan]
  S10 --> S11[S11 UI/Reporting/AI]
  S11 --> S12[S12 Security/Deploy]
```

Setiap sprint menjaga repository tetap **buildable**; skeleton diberi TODO jelas dan tidak diklaim production-ready.

## Target root structure

```text
awcms-micro/
├── AGENTS.md
├── README.md
├── CHANGELOG.md        # versioning (Changesets)
├── .changeset/         # config + changeset entries
├── .claude/skills/     # skill proyek Claude Code
├── package.json
├── astro.config.mjs
├── tsconfig.json
├── .gitignore
├── .env.example
├── docker-compose.yml
├── src/
├── sql/
├── scripts/
├── openapi/
├── asyncapi/
├── docs/
├── deploy/
├── tests/
└── fixtures/
```

> Saat mengeksekusi sprint, gunakan skill proyek terkait: `awcms-micro-implement-issue` sebagai orkestrator, lalu `awcms-micro-new-module`, `awcms-micro-new-migration`, `awcms-micro-new-endpoint`, `awcms-micro-new-event`, dan `awcms-micro-testing`. Lihat `.claude/skills/README.md`.

## Minimal package scripts

```json
{
  "packageManager": "bun@1.3.14",
  "scripts": {
    "dev": "bun --bun astro dev",
    "build": "bun --bun astro build",
    "preview": "bun --bun astro preview",
    "start": "bun ./dist/server/entry.mjs",
    "db:migrate": "bun scripts/db-migrate.ts",
    "api:spec:check": "bun scripts/api-spec-check.ts",
    "api:contract:test": "bun scripts/api-contract-test.ts",
    "security:readiness": "bun scripts/security-readiness.ts",
    "production:preflight": "bun scripts/production-preflight.ts",
    "db:pool:health": "bun scripts/db-pool-health.ts",
    "test": "bun test"
  }
}
```

Semua script di atas wajib dijalankan dengan Bun. Bin Astro/Vite dipanggil lewat **`bun --bun`** agar Bun yang mengeksekusi, bukan binary `node` yang kebetulan terpasang (shebang bin-nya `#!/usr/bin/env node`). Server SSR hasil build dijalankan `bun ./dist/server/entry.mjs` (lihat doc 10 §Standar platform backend & doc 15). Jangan menambahkan `node`, `npm`, `npx`, `pnpm`, atau `yarn` sebagai jalur eksekusi. Bila ada tooling yang belum didukung Bun, ikuti protokol pengecualian di `AGENTS.md` dan doc 16 sebelum menambahkannya.

**Catatan:** blok JSON di atas adalah **contoh minimal ilustratif** dari
sprint awal, bukan cermin `package.json` aktual — `package.json` yang
sebenarnya sudah jauh lebih lengkap (base generik selesai, v0.23.5).
`api:contract:test` khususnya **belum diimplementasikan** di repo ini
(tidak ada `scripts/api-contract-test.ts` maupun entry `package.json`
yang cocok) — lihat `AGENTS.md` §Perintah yang sudah tersedia sekarang
untuk daftar skrip nyata yang bisa dijalankan hari ini.

## Minimal `.env.example`

```env
APP_ENV=development
APP_URL=http://localhost:4321
APP_TIMEZONE=Asia/Jakarta
DATABASE_URL=postgres://awcms-micro:awcms_micro_password@localhost:5432/awcms-micro
DATABASE_POOL_MAX=20
AUTH_JWT_SECRET=change-me-in-production
AWCMS_MICRO_SYNC_HMAC_SECRET=change-me
AWCMS_MICRO_NODE_ID=local-dev-node
STORAGE_DRIVER=local
LOCAL_STORAGE_PATH=./storage
R2_ENABLED=false
```

Base tidak menetapkan provider eksternal tertentu (mis. email/payment gateway/AI). Modul website/toko online menambah flag provider-nya sendiri langsung di repo ini (default off, ADR-0034) — lihat contoh di doc 18 §Provider.

## Sprint 1 — Foundation

### Folder/file

```text
src/lib/{errors,logging,database,auth,files,i18n}
src/modules/_shared
src/pages/api/v1/health.ts
sql/001_awcms_micro_foundation_schema.sql
scripts/db-migrate.ts
scripts/api-spec-check.ts
openapi/awcms-micro-public-api.openapi.yaml
asyncapi/awcms-micro-domain-events.asyncapi.yaml
docs/ARCHITECTURE.md
```

Shared foundation minimal juga menyiapkan konvensi soft delete:

```text
src/modules/_shared/soft-delete.ts
```

Isi awal: tipe `SoftDeleteColumns`, `ListOptions`, helper validasi `includeDeleted`, dan TODO repository filter `deleted_at IS NULL`.

### Minimal `src/modules/index.ts`

```ts
import type { ModuleDescriptor } from "./_shared/module-contract";

export const modules: ModuleDescriptor[] = [];

export function getModuleByKey(
  moduleKey: string
): ModuleDescriptor | undefined {
  return modules.find((module) => module.key === moduleKey);
}
```

### Minimal health endpoint

```ts
import type { APIRoute } from "astro";
import { ok } from "../../../../modules/_shared/api-response";

export const GET: APIRoute = async () =>
  ok({
    status: "ok",
    service: "awcms-micro",
    timestamp: new Date().toISOString()
  });
```

### Minimal foundation migration

```sql
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS awcms_micro_schema_migrations (
  id bigserial PRIMARY KEY,
  migration_name text NOT NULL UNIQUE,
  checksum text,
  executed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS awcms_micro_modules (
  module_key text PRIMARY KEY,
  module_name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  version text NOT NULL DEFAULT '0.1.0',
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMIT;
```

Migration tenant/domain yang soft-deletable harus menambahkan `deleted_at`, `deleted_by`, `delete_reason`, optional `restored_at`/`restored_by`, index aktif `WHERE deleted_at IS NULL`, dan partial unique index untuk kode bisnis yang boleh dipakai ulang.

### Validation

```bash
bun install
bun run build
bun run db:migrate
bun run api:spec:check
```

## Sprint 2 — Tenant, Identity, Profile

### Modules

```text
src/modules/tenant-admin
src/modules/profile-identity
src/modules/identity-access
```

### API routes

```text
/api/v1/setup/status
/api/v1/setup/initialize
/api/v1/auth/login
/api/v1/auth/logout
/api/v1/auth/me
/api/v1/profiles
/api/v1/profiles/resolve
/api/v1/profiles/{profileId}/links
/api/v1/offices
```

### Migration

- `002_awcms_micro_tenant_identity_schema.sql`
- `014_awcms_micro_central_profile_management_schema.sql`
- `025_awcms_micro_setup_wizard_extension.sql`

### Validation

- Tenant dibuat.
- Owner login.
- Profile resolver.
- Identifier masked.
- Setup locked.
- Office/profile soft delete tidak muncul di list default dan restore diaudit.

## Sprint 3 — RBAC, ABAC, RLS

### Files

```text
src/modules/identity-access/domain/access.ts
src/modules/identity-access/application/access-evaluator.ts
src/modules/identity-access/application/assign-access.ts
src/pages/api/v1/access/modules.ts
src/pages/api/v1/access/evaluate.ts
src/pages/api/v1/access/assignments.ts
tests/access/default-deny.test.ts
```

### Minimal evaluator behavior

- Default deny.
- Deny overrides allow.
- Decision log.
- Tenant context.

## Sprint 4 — Katalog Toko Online

### Module

```text
src/modules/catalog-inventory
```

### Routes

```text
/api/v1/inventory/products
/api/v1/inventory/products/{productId}
/api/v1/inventory/stock-balances
/api/v1/inventory/stock-movements
/api/v1/inventory/stock-adjustment-requests
```

### Tables

- Product category, brand, unit (katalog produk toko online).
- Products.
- Product prices.
- Stock balances (ketersediaan produk / availability — ringan).
- Stock movements.

### Validation

- SKU unique.
- Pencarian produk di storefront.
- Product soft delete/restore.
- Opening balance.
- Stock movement append-only.

## Sprint 5 — Storefront & Checkout online (MVP)

### Module

```text
src/modules/online-store
```

### Routes

```text
/api/v1/sales/checkout-sessions
/api/v1/sales/checkout-sessions/{id}/items
/api/v1/sales/checkout-sessions/{id}/payments
/api/v1/sales/checkout-sessions/{id}/post
/api/v1/sales/documents/{id}
```

### Tables

- Checkout sessions (keranjang/checkout online).
- Checkout lines.
- Checkout payments (pembayaran online / payment gateway).
- Sales documents (pesanan online).
- Sales document lines.
- Sales payments.
- Idempotency keys.

### Posting validation

- Checkout status valid.
- Payment sufficient (pembayaran online terkonfirmasi).
- Availability produk tersedia.
- Availability lock.
- Idempotency.
- Atomic transaction.
- Audit event.
- Domain event.

## Sprint 6 — Logging & Pooling

### Modules

```text
src/modules/observability-logging
src/modules/database-connectivity
```

### Routes

```text
/api/v1/logs/recent
/api/v1/logs/audit
/api/v1/logs/security
/api/v1/database/pool/health
```

### Validation

- Redaction.
- Correlation ID.
- Audit helper.
- Pool health.
- Pool saturation incident.

## Sprint 7 — Engagement & Notifikasi

Recast dari contoh "CRM receipt kasir" ke jalur base nyata: **email + newsletter + comments**.
Notifikasi pesanan online (konfirmasi/invoice) memakai outbox **email** base, bukan queue
WhatsApp struk kasir.

### Module

```text
src/modules/email
src/modules/newsletter
src/modules/comments
```

### Routes

```text
/api/v1/store/orders/{id}/confirmation/send
/api/v1/newsletter/subscriptions
/api/v1/newsletter/subscriptions/{id}/consent
/customer/orders/{token}
```

### Validation

- Konfirmasi/invoice pesanan online (PDF) tersimpan lokal.
- Kontak tertaut ke profile.
- Consent langganan dihormati.
- Provider email adapter mocked.
- Token pelacakan pesanan online aman.

## Sprint 8 — Sync & R2

### Module

```text
src/modules/sync-storage
```

### Routes

```text
/api/v1/sync/push
/api/v1/sync/pull
/api/v1/sync/status
/api/v1/sync/conflicts
/api/v1/sync/conflicts/{id}/resolve
/api/v1/sync/objects/presign
```

### Validation

- HMAC valid.
- Timestamp anti replay.
- Duplicate event idempotent.
- Conflict manual.
- Checksum verified.

## Sprint 9 — Warehouse Management

> **Lineage ERP `awcms` — dikecualikan (ADR-0034 §3 / ADR-0025).** Gudang, bin/lot/serial,
> transfer, dan cycle count adalah concern back-office ERP, **bukan** scope template website ini.
> Blok di bawah dipertahankan hanya sebagai ilustrasi lineage, bukan pekerjaan yang dibangun di sini.

### Module

```text
src/modules/warehouse-management
```

### Routes

```text
/api/v1/warehouses
/api/v1/warehouses/{id}/bins
/api/v1/warehouses/{id}/stock
/api/v1/warehouse-transfers
/api/v1/warehouse-transfers/{id}/approve
/api/v1/warehouse-transfers/{id}/ship
/api/v1/warehouse-transfers/{id}/receive
/api/v1/cycle-counts
```

### Validation

- Warehouse/zone/bin.
- Lot/serial.
- Transfer shipped/received.
- In-transit.
- Partial/full receipt.
- Cycle count variance.

## Sprint 10 — Accounting & Coretax

> **Lineage ERP `awcms` — dikecualikan (ADR-0034 §3 / ADR-0025).** Faktur pajak, VAT posting,
> dan batch Coretax adalah concern tax-posting ERP, **bukan** scope template website ini.
> Blok di bawah dipertahankan hanya sebagai ilustrasi lineage, bukan pekerjaan yang dibangun di sini.

### Module

```text
src/modules/accounting-tax
```

### Routes

```text
/api/v1/tax/profiles
/api/v1/tax/business-units
/api/v1/tax/party-profiles
/api/v1/tax/product-profiles
/api/v1/tax/vat-invoices/generate
/api/v1/tax/vat-invoices/{id}/validate
/api/v1/tax/coretax/batches
```

### Validation

- Tax data masked.
- Missing tax data error.
- VAT invoice validation.
- Coretax batch checksum.
- Export approval.

## Sprint 11 — UI/UX, Reporting, AI

### Components

```text
src/components/ui
src/components/admin
src/components/storefront
src/components/customer
```

### Pages

```text
/admin
/admin/products
/admin/stock
/admin/reports
/            (storefront katalog)
/checkout    (keranjang/checkout online)
/customer/orders/{token}
```

`/admin/warehouse` dan `/admin/tax` **tidak** termasuk template ini (lineage ERP `awcms` — dikecualikan, ADR-0034 §3).

### Modules

- `ui-experience`
- `management-reporting`
- `ai-analyst`

### Validation

- Admin shell render.
- Storefront & checkout screen render.
- Pelacakan pesanan online (customer) mobile.
- Report API.
- AI read-only/no SQL/no PII.

## Sprint 12 — Security, Deployment, Handover

### Modules

- `production-security-readiness`

### Deploy files

```text
deploy/systemd/awcms-micro.service.example
deploy/nginx/awcms-micro.conf.example
deploy/pgbouncer/pgbouncer.ini.example
deploy/backup/backup-postgres.sh
deploy/backup/restore-postgres.sh
```

### Validation

- Security readiness pass/fail.
- Go-live blocked on critical fail.
- Backup/restore scripts.
- Handover docs.

## Test skeleton

```text
tests/access
tests/auth
tests/profile
tests/inventory
tests/store
tests/sync
tests/engagement
tests/security
```

(`tests/warehouse` dan `tests/tax` = lineage ERP `awcms`, dikecualikan — ADR-0034 §3.)

## Definition of Skeleton Done

- Folder utama tersedia.
- Module contract tersedia.
- Response/error helper tersedia.
- Tenant context helper tersedia.
- Audit helper tersedia.
- Domain event helper tersedia.
- Migration runner tersedia.
- OpenAPI/AsyncAPI baseline tersedia.
- Health endpoint tersedia.
- Build pass.
- Docs awal tersedia.

## Definition of Implementation Ready

- Skeleton done.
- Tenant/profile/auth siap.
- ABAC guard siap.
- RLS context siap.
- Redaction siap.
- Transaction wrapper siap.
- Idempotency wrapper siap.
- OpenAPI contract siap.
- Test skeleton siap.
