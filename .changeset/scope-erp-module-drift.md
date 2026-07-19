---
"awcms-micro": patch
---

Hapus rujukan aktif ke tujuh modul ERP yang tidak diport dari arsitektur, ERD, SOP, threat model, dan governance aktif (Issue #263, epic #261 Wave 0, ADR-0025).

- **Rekonsiliasi dokumen ke registry WEBSITE 17 modul:** doc arsitektur (01/02/03/05/06/09/10/11), ERD/data dictionary (04), SOP operasional (08 — lima seksi SOP modul ERP dihapus), module admission governance (21), dan traceability (13) kini mendeskripsikan hanya 17 modul aktif (termasuk `media_library`). Matrix migration doc 13 diperbaiki ke 64 file nyata (001–079) yang dipetakan benar per modul; klaim "23 modul"/"76 migration" dihapus. (Threat model doc 20 sudah historis-OK sejak commit lebih awal, tidak disentuh PR ini.)
- **Kontrak & inventori:** operasi ERP usang (`workflow`/`organization-structure`/`reference-data`/`document-infrastructure`/`data-exchange`/`integration-hub`) dihapus dari AsyncAPI; inventori repo/module/API/event diregenerasi.
- **Governance (perubahan contoh):** §21 module admission kini memakai contoh WEBSITE (SEO, theming, search, comments, newsletter) menggantikan contoh ERP yang menyesatkan.
- **Skill & README:** `.claude/skills/` dan README modul (module-management, identity-access, reporting, email, form-drafts, blog-content) tidak lagi merujuk modul/route/tabel/migration ERP yang tak ada; komentar historis upstream ditandai jelas. Catatan currency ADR-0025 ditambahkan ke ADR 0008/0012/0013.
- **Snapshot GitHub (`docs/awcms-micro/github/README.md`):** narasi hand-written yang mengklaim lima modul ERP + `workflow_approval` ditambahkan ke registry ("16 → 23 modul") direlabel/dihapus jadi "TIDAK diport (ADR-0025)"; rujukan ke README/skill/route ERP yang tak ada dibersihkan. Ini prosa manual, bukan bagian auto-generated `github:snapshot:refresh`.
- **Gate konsistensi baru:** `bun run scope:consistency:check` (`scripts/scope-consistency-check.ts`, dalam rantai `bun run check`, plus unit test fixture) GAGAL bila modul excluded muncul lagi di registry/kontrak/inventori aktif, atau bila hitungan modul menyimpang dari 17 — mendeteksi nama modul stale, rujukan route/tabel tak-ada, dan module-count drift.
- **ADR-0025 §Konsekuensi** diperbarui: utang dokumentasi yang diakui kini ditandai selesai.
