---
name: awcms-micro-implement-issue
description: Kerjakan satu issue/sprint AWCMS-Micro secara atomic dari awal sampai laporan. Gunakan saat diminta "implementasikan Issue X.Y", "kerjakan Sprint N", "buat fitur <modul>", atau saat memulai unit kerja AWCMS-Micro apa pun. Orkestrator yang memanggil skill AWCMS-Micro lain (migration, endpoint, event, idempotency, abac, audit) sesuai kebutuhan.
---

# AWCMS-Micro — Implement Issue / Sprint (Atomic)

Skill orkestrator untuk mengeksekusi satu unit kerja AWCMS-Micro end-to-end sesuai kontrak di `AGENTS.md` dan `docs/awcms-micro/12_generator_prompt.md`.

## Prasyarat baca (WAJIB sebelum edit)

1. `AGENTS.md` — aturan wajib & guardrail.
2. `docs/awcms-micro/06_github_issues_detail.md` — detail issue.
3. `docs/awcms-micro/11_implementation_blueprint.md` — folder/file target sprint.
4. Modul, SQL, OpenAPI, AsyncAPI, dan docs yang terkait scope.

## Langkah 0 — Buat branch (WAJIB sebelum edit apa pun)

Jangan pernah mengerjakan issue langsung di `main` — `main` dilindungi (lihat `docs/awcms-micro/branch-protection.md`) dan semua perubahan masuk lewat PR. Sebelum menyentuh file mana pun untuk sebuah issue, buat branch baru dari `main` yang up-to-date:

```bash
git switch main && git pull --ff-only
git switch -c <prefix>/<issue>-<slug-singkat>
```

Konvensi prefix (sama dengan `CONTRIBUTING.md`):

- `feature/<issue>-<nama>` — fitur/modul baru.
- `fix/<issue>-<nama>` — perbaikan bug/konsistensi.
- `docs/<topik>` — perubahan dokumentasi saja.

Contoh: `git switch -c feature/262-full-online-storage-truth`. Satu issue = satu branch = satu PR (`Closes #NNN`). Jika kamu menemukan branch sudah ada untuk issue itu, lanjutkan di branch tersebut alih-alih membuat yang baru.

## Prosedur

```mermaid
flowchart TD
  A0[Buat branch dari main<br/>prefix/issue-slug] --> A[Baca docs + kode terkait]
  A --> B{Scope jelas & atomic?}
  B -- Tidak --> C[Pecah / klarifikasi]
  B -- Ya --> D[Implementasi minimal]
  D --> E{Schema berubah?} -->|Ya| M[awcms-micro-new-migration]
  D --> F{API berubah?} -->|Ya| P[awcms-micro-new-endpoint]
  D --> G{Event berubah?} -->|Ya| V[awcms-micro-new-event]
  D --> H{Mutation high-risk?} -->|Ya| I[awcms-micro-idempotency + awcms-micro-audit-log]
  M & P & V & I --> T[awcms-micro-testing]
  T --> Q[Validasi: db:migrate · api:spec:check · test · build]
  Q --> R[Update docs + laporan implementasi]
```

## Aturan atomic

- Kerjakan hanya scope issue; **jangan** sentuh file unrelated.
- Data tenant-scoped: tenant context + `awcms-micro-abac-guard` + RLS.
- Data sensitif: `awcms-micro-sensitive-data`.
- High-risk action: `awcms-micro-audit-log`; high-risk mutation: `awcms-micro-idempotency`.
- Resource deletable: soft delete + restore/purge policy; jangan hapus posted/append-only entity.
- Provider eksternal lewat outbox/queue, **tidak** di dalam DB transaction.
- Backend/tooling wajib Bun-only. Jangan menambah Node.js/npm/npx/pnpm/yarn atau adapter server Node.js kecuali Bun belum mendukung capability tersebut, maintainer sudah memberi izin eksplisit, dan pengecualian dicatat di docs/audit.

## Validasi wajib

```bash
bun run db:migrate
bun run api:spec:check
bun test
bun run build
```

## Definition of Done

Ikuti checklist DoD di `AGENTS.md`. Tutup dengan **laporan implementasi**:

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

## Skill terkait

`awcms-micro-new-module`, `awcms-micro-new-migration`, `awcms-micro-new-endpoint`, `awcms-micro-new-event`, `awcms-micro-idempotency`, `awcms-micro-abac-guard`, `awcms-micro-audit-log`, `awcms-micro-sensitive-data`, `awcms-micro-testing`, `awcms-micro-security-review`, `awcms-micro-pr-review`.
