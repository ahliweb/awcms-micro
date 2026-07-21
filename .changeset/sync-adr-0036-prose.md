---
"awcms-micro": patch
---

docs(governance): sinkronkan prosa docs+skills pasca ADR-0036 (hapus referensi jalur-turunan stale)

PR #304 (ADR-0036) menghapus penuh jalur aplikasi-turunan dan membuat `bun run check` hijau di level kode + gate CI, tetapi meninggalkan prosa stale di ~28 file yang tidak tercakup gate otomatis — termasuk skills (`.claude/skills/`) yang memang di luar `bun run check`.

Disinkronkan (docs/skill, tanpa perubahan perilaku): 6 skills (module-management dua seksi ditulis ulang ke satu registry base; production-preflight 11→10 stage; codeql-triage §6 OBSOLETE; new-module/release/comments), 6 docs root (README/AGENTS/CONTRIBUTING/GOVERNANCE/`.github/ISSUE_TEMPLATE/feature_request.yml`/newsletter README → `MODULE_CONTRACT_VERSION` 2.0.0), dan 16 file `docs/awcms-micro`. `derived-application-guide.md` + `extension-compatibility-policy.md` dibiarkan HISTORIS (banner ⛔ DIHAPUS ADR-0036 sudah ada).

Baru: `docs/awcms-micro/work-continuation-log.md` — resume-point in-flight lintas-sesi yang durable & ter-git (alternatif konteks worktree), terindeks di README.
