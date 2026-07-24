# Work Continuation Log — AWCMS-Micro

> **Tujuan.** Catatan status kerja yang **durable & ter-git** sebagai alternatif
> konteks worktree/session yang ephemeral. Siapa pun (atau agent) yang melanjutkan
> pekerjaan membaca file ini lebih dulu untuk tahu: apa yang baru selesai, apa yang
> masih terbuka, dan cara melanjutkan. **Update entri paling atas setiap kali sebuah
> unit kerja lintas-sesi berpindah tangan.** Ini bukan pengganti ADR (keputusan) atau
> CHANGELOG (rilis) — ini "resume point" operasional.

---

## Entri aktif

> Tidak ada unit kerja in-flight per 2026-07-24 sore — tiga PR di bawah (#331/#332/#333)
> semuanya sudah MERGED ke `main`. Entri dibiarkan sebagai jejak terkini; kompres jadi
> historis saat pekerjaan berikutnya masuk.

### 2026-07-24 — De-flake E2E: race lintas-file pada singleton `setup_state`

**Status:** SELESAI & MERGED — PR [#333](https://github.com/ahliweb/awcms-micro/pull/333) (`ebd943b1`).
Test-only + changeset `patch`.

**Konteks.** Saat menuntaskan #332, job E2E required gagal 3× di `seo-discovery-smoke`
(sitemap `<urlset>` kosong) — **bukan** dari diff docs. Akar: enam smoke spec public-content
me-repoint singleton global `awcms_micro_setup_state` (resolusi default-tenant `localhost`) lalu
assert; `fullyParallel: true` + `mode: serial` (hanya intra-file) → repoint spec lain mendarat di
antara seed & fetch → tenant salah → konten kosong.

**Fix.** `tests/e2e/helpers/setup-state-ownership.ts` — advisory lock Postgres session-level (koneksi
ter-`reserve()`, meniru `src/lib/jobs/advisory-lock.ts`) di-hold `beforeAll`→`afterAll`, kunci sama
untuk keenam spec (seo-discovery, seo-redirect, newsletter, comments, site-search, theming). Mutual
exclusion dibuktikan vs `postgres:18.4`; E2E CI #333 & #332 hijau. Detail lengkap → memory
`awcms-micro-e2e-setup-state-singleton-race`.

---

### 2026-07-24 — Sync prosa docs+skills dgn fitur ter-ship (auth-hardening/email + admin + rename R2)

**Status:** SELESAI & MERGED — PR [#332](https://github.com/ahliweb/awcms-micro/pull/332) (`5d6d608c`).
Docs/skills only (13 file `.md`) → tidak butuh changeset.

**Konteks.** Beberapa commit fitur belum punya pasangan "docs+skills sync": browser-UX auth
(#328 2FA challenge/enroll, #330 SSO picker), email module, sidebar-menu #322 + My Profile #320,
dan rename env-var R2 #326. Drift ditemukan lewat **4 auditor read-only paralel**, tiap temuan
diverifikasi ulang terhadap kode sebelum diedit.

**Yang diperbaiki (13 file):**

- **Auth-UX**: skill `auth-online-hardening` (widget Turnstile SUDAH ada di
  login/forgot-password/register; hanya `/setup` tanpa halaman) + skill `browser-test` (tambah
  `mfa-browser-ux.e2e.ts`/`sso-login-picker-smoke.e2e.ts`).
- **Email**: **koreksi error nyata di runbook §1** — email BUKAN di balik shared gate
  `AUTH_ONLINE_SECURITY_*` (aktif dari `EMAIL_ENABLED` saja, jalan di profil apa pun). newsletter.md:
  `newsletter:dispatch` hanya hand-off, tak panggil provider.
- **Admin/UI**: README module-management (nav entry **20 di 12 modul**, dulu 16/10; +/admin/sidebar-menu)
  - skill module-management (seksi baru sidebar-menu #322 + 3 gotcha) + doc 14 (footer versi #320).
- **R2 #326**: docs 11/20/21, deployment-profiles, deploy-coolify, skill news-portal → `AWCMS_MICRO_R2_*`
  kanonik (selaras doc 18/.env.example); betulkan line-ref `object-storage-uploader.ts` :88-89→:169.

**Verifikasi (hijau):** `check:docs`, `config:docs:check`, `prettier --check` (13 file); E2E CI
lolos setelah branch di-update dengan fix #333.

---

### 2026-07-24 — Full-online enablement runbook (Turnstile/2FA/SSO/email)

**Status:** SELESAI & MERGED — PR [#331](https://github.com/ahliweb/awcms-micro/pull/331) (`c5d95624`).
Docs-only.

**Konteks.** Fitur auth-hardening + email sudah ter-ship penuh (#588 Turnstile, #589 TOTP 2FA,
#590 Google OIDC, #591 tenant SSO, #493 email Mailketing) tapi **dormant-by-design** di balik gate
`AUTH_ONLINE_SECURITY_ENABLED` + `AUTH_ONLINE_SECURITY_PROFILE=full_online`. Belum ada satu prosedur
operator "cara menyalakan + konfigurasi" yang berurutan. Runbook ini mengisi celah itu (bukan
development baru).

**Yang dikerjakan:**

- **Baru:** `docs/awcms-micro/full-online-enablement-runbook.md` (bagian 0–10: prasyarat, gate
  dua-level, kunci enkripsi AES yang permanen, per-fitur enable+cara peroleh credential, cron
  `email:dispatch`, apply/validate/rollback, backup layer-2 offsite).
- **Indeks:** ditambahkan satu baris di tabel runbook `docs/awcms-micro/README.md`.
- **Koreksi terverifikasi:** invocation validator dibetulkan `env:validate` → **`config:validate`**
  (script asli package.json; `env:validate` tidak pernah ada). Semua env var / script / route /
  tabel / gate-fn lain sudah dicek ADA di kode sebelum ditulis.

**Verifikasi (hijau):** `check:docs`, `config:docs:check`, `prettier --check` (2 file). Docs-only
(hanya `*.md`) → **tidak perlu changeset**.

**Langkah lanjut:** merge PR #331. Setelah merge, kompres entri ini jadi satu baris historis.

---

### 2026-07-21 — Sinkronisasi docs + skills pasca ADR-0036 (penghapusan jalur aplikasi-turunan)

**Status:** SELESAI & ter-ship (sudah di-commit — sudah ada banyak commit main setelahnya).

**Konteks.** [ADR-0036](../adr/0036-remove-derived-application-pathway-align-family.md)
(PR #304, commit `39a33f2f`) **menghapus penuh jalur aplikasi-turunan** dan
men-supersede ADR-0035/0013/0014/0015. Kode + gate CI sudah diselaraskan oleh PR #304
sendiri (`bun run check` hijau), tetapi banyak **prosa docs & skill** — yang tidak
tercakup gate otomatis — masih menyebut mekanisme yang sudah dihapus sebagai "aktif".
Pekerjaan ini membereskan drift prosa itu.

**Ground truth (keadaan sekarang):**

- **DIHAPUS** (jangan pernah sajikan sebagai current): `src/modules/application-registry.ts`,
  `theming/application-theme-registry.ts`, gerbang `bun run extension:check`
  (`scripts/extension-check.ts`), `extension-compatibility.ts`, `extension-manifest-contract.ts`,
  `extension.manifest.json`, tipe `ApplicationModuleRegistry`/`ModuleMigrationNamespace`,
  fungsi `mergeModuleRegistries`, konstanta `BASE_MODULE_MIGRATION_NAMESPACE`, namespace
  migration 900–999, check `prohibited_base_override`/`invalid_module_type`/`migration_namespace_overlap`.
- **DIPERTAHANKAN:** `module-composition.ts` (memvalidasi **satu registry base**;
  `composeModuleRegistry`/`validateComposedModuleRegistry`/`buildComposedModuleInventory`
  menerima `readonly ModuleDescriptor[]`), `theme-registry.ts` (`BASE_THEME_DESCRIPTORS`,
  `composeThemeDescriptors(extraThemes=[])`), `listModules`/`listBaseModules`, gate
  `modules:compose:check` / `modules:composition:inventory:check` / `modules:dag:check`.
- `MODULE_CONTRACT_VERSION` = **2.0.0** (dulu 1.5.0). Registry base = **22 modul**.
- Keluarga = awcms / awcms-mini / awcms-micro, **tiga template dipakai LANGSUNG**; tidak
  ada repo aplikasi-turunan. Kapabilitas ERP/POS = lineage `awcms`; memperluas scope
  template ini butuh **ADR baru** (modul ditambah langsung di `src/modules/index.ts`).

**Yang dikerjakan (28 file, prosa saja):**

- **Skills (6):** `awcms-micro-module-management` (rewrite 2 seksi + deskripsi frontmatter),
  `awcms-micro-new-module`, `awcms-micro-release`, `awcms-micro-production-preflight`
  (11→10 stage), `awcms-micro-comments`, `awcms-micro-codeql-triage` (§6 ditandai OBSOLETE).
- **Docs root (6):** `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `GOVERNANCE.md`,
  `.github/ISSUE_TEMPLATE/feature_request.yml`, `src/modules/newsletter/README.md`.
- **docs/awcms-micro (16):** `09`, `10`, `19`, `20`, `21`, `README`, `branch-protection`,
  `base-standard-hardening-roadmap`, `release-process`, `production-readiness`,
  `production-preflight-runbook`, `theming`, `website-platform-e2e-evidence`,
  `derived-app-pilot-plan` (banner ADR-0036), `examples/minimal-domain-module`,
  `docs/perbedaan-dengan-awcms`.
- **Dibiarkan sebagai rujukan HISTORIS (sengaja):** `derived-application-guide.md` &
  `extension-compatibility-policy.md` — keduanya sudah punya banner `⛔ DIHAPUS — ADR-0036`
  di atas yang menyatakan seluruh isinya historis; body-nya tidak diedit. Body ADR
  0013/0014/0015/0035 juga historis (status header sudah "Superseded").

**Verifikasi (semua hijau):** `lint`, `check:docs`, `config:docs:check`,
`repo:inventory:check`, `modules:compose:check`, `modules:composition:inventory:check`,
`scope:consistency:check`, `media-library:consistency:check`, `api:docs:check`,
`api:spec:check`. (Belum dijalankan penuh: `typecheck`/`test`/`build` — tidak tersentuh
karena perubahan murni prosa; integration test butuh `DATABASE_URL`.)

**Cara verifikasi ulang / mencari sisa drift:**

```bash
# Referensi jalur-turunan yang MASIH aktif (bukan historis/ber-banner) harus 0:
grep -rn -E "extension:check|application-registry\.ts|mergeModuleRegistries|extension\.manifest\.json" \
  --include="*.md" docs .claude/skills README.md AGENTS.md CONTRIBUTING.md \
  | grep -viE "DIHAPUS|removed|ADR-0036|Superseded|historis|OBSOLETE|tidak ada|no longer"
```

**Langkah lanjut:** commit sebagai `docs(...)`/`chore(docs)` di branch non-main lalu PR
(lihat `release-process.md`). Tidak perlu changeset (perubahan docs/skill, bukan perilaku
paket — cek `changesets:policy:check` bila ragu).

---

## Backlog terbuka yang menunggu operator (per 2026-07-21)

Bukan pekerjaan kode yang bisa di-merge — **ter-gate infrastruktur**, hasil split dari
#273. Runbook eksekusi lengkap: [`website-platform-completion-runbook.md`](website-platform-completion-runbook.md).

| Issue | Ringkas                                                | Butuh                                 |
| ----- | ------------------------------------------------------ | ------------------------------------- |
| #261  | Epic website-platform (payung)                         | tetap terbuka sampai #293–#296 tuntas |
| #293  | Deployment rehearsal Docker/Coolify/object-storage/CDN | infra deploy nyata                    |
| #294  | Backup/restore + DR (RTO/RPO terukur) + chaos drill    | environment live                      |
| #295  | Performance/CWV budget + load/soak                     | volume representatif                  |
| #296  | Full-journey a11y (axe EN/ID) + link checking otomatis | environment terdeploy                 |

`#296` paling dekat ke otomasi CLI (axe + link-check) bila ingin mengurangi
ketergantungan operator.

---

## Cara memakai log ini

1. Baca **Entri aktif** paling atas → itu titik lanjut terkini.
2. Selesaikan/lanjutkan; **update entrinya** (status, verifikasi, langkah berikut).
3. Saat sebuah unit kerja benar-benar selesai + ter-rilis, ringkas jadi satu baris
   historis dan biarkan entri baru naik ke atas.
4. Keputusan arsitektural → ADR; catatan rilis → CHANGELOG; log ini khusus **status kerja
   in-flight** yang harus selamat melintasi sesi/worktree.
