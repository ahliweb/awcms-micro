---
name: awcms-micro-pr-review
description: Review pull request AWCMS-Micro terhadap Definition of Done dan kontrak proyek. Gunakan saat diminta review PR/diff AWCMS-Micro. Memeriksa scope atomic, migration/OpenAPI/AsyncAPI sinkron, tenant/ABAC/RLS, idempotency, audit, masking, test, dan docs sesuai doc 09, 10, 12.
---

# AWCMS-Micro — PR Review

Ikuti `docs/awcms-micro/12_generator_prompt.md` (Prompt Review PR), `docs/awcms-micro/09_roadmap_repository_commit.md` (PR checklist), dan `docs/awcms-micro/10_template_kode_coding_standard.md`.

## Fokus review

1. Scope sesuai issue; **tidak ada unrelated change**.
2. No secret / data customer asli / dump DB / `.env`.
3. Schema berubah → ada migration berurutan (`awcms-micro-new-migration`).
4. API berubah → OpenAPI diperbarui (`awcms-micro-new-endpoint`).
5. Event berubah → AsyncAPI diperbarui (`awcms-micro-new-event`).
6. Tenant context + ABAC + RLS untuk data tenant-scoped.
7. Idempotency untuk mutation high-risk.
8. Audit high-risk + redaction.
9. Soft delete policy untuk resource deletable; posted/append-only entity tidak dihapus.
10. Input validation lengkap; error response standar.
11. Sensitive data masked.
12. Test relevan ada & pass; build pass.
13. Docs diperbarui; commit mengikuti convention `<type>(<scope>): <summary>`.

## Konsistensi kontrak

- Migration ↔ ERD (doc 04) ↔ matrix migration (doc 13).
- Endpoint ↔ OpenAPI ↔ tabel error/header (doc 05).
- Event ↔ AsyncAPI ↔ `module.ts` publishes/subscribes.
- Soft delete ↔ ERD kolom/index ↔ OpenAPI DELETE/restore/includeDeleted ↔ audit event.

## Output

```text
Verdict: Approve / Request changes / Comment only
Critical issues:
Security issues:
Functional issues:
Data/migration issues:
API/event contract issues:
Testing gaps:
Documentation gaps:
Suggested patch:
```

Untuk modul sensitif, jalankan juga `awcms-micro-security-review`.

## Membaca hasil CI (jangan salah simpul)

- **Quality FAILURE dengan kaskade ~20 suite timeout serempak `5000–5001ms`** = kontensi/saturasi pool DB, BUKAN diff. Ambil data point kedua (`gh run rerun <id> --failed`) sebelum meminta perubahan; sering hijau di rerun.
- **Check standalone "CodeQL"** (gate alert baru PR) bisa FAILURE meski `Analyze (actions)`/`Analyze (javascript-typescript)` SUCCESS. `code-scanning/alerts?ref=…&state=open` bisa mengembalikan 0 walau gate merah — pakai `code-scanning/alerts?pr=<n>` untuk melihat alert PR-scoped. HIGH memblokir merge.
- **Test-only ≠ tanpa risiko**: 3 suite integration baru pertama kali dieksekusi terhadap Postgres nyata di CI meski `tsc` lokal hijau — drift nama field/route/kolom baru muncul di sini. Perlakukan CI hijau (bukan `bun run check` lokal yang skip integration) sebagai bukti.

## Kejujuran dokumen evidence

Dokumen yang memetakan kriteria→test (mis. evidence matrix) TIDAK boleh over-claim: jika sebuah test membuktikan properti X _absent_/didelegasikan (mis. CSP didelegasikan ke Astro, bukan diuji di integration), sel matriks tidak boleh menuliskannya sebagai "diuji". Cross-check tiap klaim ke assertion nyata + komentar in-file.

## Setelah subagent review/coder

Cek `git branch --show-current` + `git worktree list` sesudah subagent selesai (agen worktree-isolated commit ke branch/worktree sendiri; commit reachable via object store bersama, ambil file disjoint dengan `git checkout <sha> -- <path>`). Grep SELURUH repo untuk semua kemunculan fakta basi sebelum menyebut satu fix selesai.
