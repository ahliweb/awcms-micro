# Work Continuation Log — AWCMS-Micro

> **Tujuan.** Catatan status kerja yang **durable & ter-git** sebagai alternatif
> konteks worktree/session yang ephemeral. Siapa pun (atau agent) yang melanjutkan
> pekerjaan membaca file ini lebih dulu untuk tahu: apa yang baru selesai, apa yang
> masih terbuka, dan cara melanjutkan. **Update entri paling atas setiap kali sebuah
> unit kerja lintas-sesi berpindah tangan.** Ini bukan pengganti ADR (keputusan) atau
> CHANGELOG (rilis) — ini "resume point" operasional.

---

## Entri aktif

### 2026-07-25 (2) — CodeQL 298 + penuntasan backlog issue #293–#296

**Status:** SELESAI di branch yang sama dengan entri di bawah; #293 sudah **DITUTUP** di GitHub.

**CodeQL alert 298** (`js/unused-local-variable`,
`site-search.integration.test.ts:202`) ternyata **coverage gap, bukan dead code** — persis
pola yang dicatat skill `awcms-micro-codeql-triage` §Pola tambahan. Test "rebuild is
idempotent" menangkap hasil rebuild kedua lalu tak pernah meng-assert apa pun darinya.
Yang hilang justru bagian menariknya: `rebuildTenantSearchIndex` meng-DELETE dokumen
sumber lebih dulu, jadi semua baris kembali sebagai `added`, tidak pernah `unchanged` —
itulah yang membedakannya dari reconcile ber-checksum tiga baris di bawahnya. Sekarang
di-assert (runId berbeda, `sourceCount` 5, `added` 5, `unchanged` 0, `removed` 0,
`failures` 0); 11/11 lulus terhadap `postgres:18.4` sungguhan.

**Backlog issue:**

- **#293 DITUTUP** — tiga kotak acceptance semuanya punya bukti lapangan.
- **#294** — kotak 1 (RTO/RPO terukur) tuntas; kotak 2 terpenuhi secara substansi (5/5
  skenario safe-tier diverifikasi ulang hari ini). Sisa "live chaos drill" **diblokir by
  design**: `authorizeDrDrill` menolak `APP_ENV=production` tanpa override apa pun, jadi
  butuh instance non-produksi yang belum ada. Satu follow-up nyata: passphrase dekripsi
  backup offsite baru ada di host prod, wajib disimpan off-box.
- **#295** — lane FULL `performance:suite` dijalankan (skala `large` + soak): **6/6 PASS**,
  termasuk soak **1.428.479 call / 600 s, 0 error**, pertumbuhan **mendatar** (paruh
  pertama 746,5 MB vs paruh kedua 737,0 MB — itulah yang membedakan kebocoran dari churn
  steady-state, bukan angka RSS absolutnya).
- **#296** — spec baru `public-keyboard-journey.e2e.ts` menutup yang **tidak bisa** dilihat
  axe (auditor DOM statis tak pernah menekan Tab): 2.1.2 keyboard trap, 2.4.3 focus order,
  2.4.7 focus visible. 5/5 hijau terhadap instance ter-deploy (EN+ID, trafik read-only).
  **Falsifiabilitasnya dibuktikan** lewat negative control — menyuntik
  `outline: none !important; box-shadow: none !important` membuat spec GAGAL. Lakukan hal
  yang sama untuk assertion a11y baru; hijau saja tidak membuktikan gate-nya menggigit.

**Blocker tunggal yang tersisa untuk #295 DAN #296 bukan kode:** tenant live belum punya
konten terbit, jadi angka CWV mencirikan cangkang situs, `/news`/`/blog` tak merender apa
pun di sana, dan load di edge akan mengukur situs kosong. Terbitkan konten+media
representatif di target → jalankan ulang spec yang SUDAH ada (tanpa perubahan). Sisanya
satu tugas yang memang manual: pass screen-reader (#296).

---

### 2026-07-25 — Sinkronisasi docs+skills + audit konflik lintas-dokumen

**Status:** SELESAI (belum di-PR saat entri ini ditulis — branch kerja, lihat §Langkah lanjut).

**Konteks.** Permintaan operator: "update semua skills dan docs" + "analisis semua docs
agar tidak ada yang konflik". Drift yang disasar: enam commit hari ini (#343–#349) yang
mengubah perilaku tanpa pasangan sync prosa, ditambah dua konflik struktural yang lolos
dari semua gate otomatis.

**Yang diperbaiki:**

- **Celah dokumentasi env var (temuan terbesar).** `src/lib/config/registry.ts` mengklaim
  dirinya "single source of truth for every environment variable this application reads",
  tapi **20 var yang benar-benar dibaca kode ter-ship tidak ada di sana** — jadi tak ada
  pula di `.env.example` maupun doc 18, dan `config:docs:check` tidak bisa melihatnya
  (gate itu membandingkan tiga permukaan, bukan memindai `process.env`). Didaftarkan
  sekarang: comments (3), newsletter (3), site_search (4), redis (7),
  `PREFLIGHT_TEST_DATABASE_URL` — plus enam `CONFIG_EXEMPTIONS` untuk var CI/container
  (`PATH`, `CHANGESET_POLICY_BASE_REF`, `RELEASE_TAG_REF`, `REDIS_PASSWORD`,
  `REDIS_MAXMEMORY`, `REDIS_MAXMEMORY_POLICY`).
- **Status issue yang basi.** Docs menulis "#273 remains open"/"#273 closes when
  #292–#296 are green"; kenyataannya **#273 CLOSED 2026-07-20** dan **#292 CLOSED
  2026-07-21** (premis derived-site dibatalkan ADR-0036). Yang masih terbuka hanya
  #293–#296 beserta epik #261. Dibetulkan di evidence matrix, completion runbook
  (judul, §E, §F), README paket docs, dan tabel backlog di bawah.
- **`security:readiness` (#344)** — pengecualian struktural scan secret +
  `SECRET_SCAN_ACKNOWLEDGED` + check baru `checkCommentsTimingSecretConfigured`
  didokumentasikan di `production-readiness.md` (§Scan secret baru), skill
  `production-preflight`, skill `security-review`, `comments.md`, dan runbook enablement.
- **Backup drill (#346)** — `resilience-dr-verification.md`: "unavailable" kini mencakup
  klien PostgreSQL yang **absen**, bukan hanya versi tak cocok.
- **Job terjadwal (#349)** — skill `deploy` dan skill `news-portal` mendapat seksi ops:
  `docker exec … bun run <job>` tidak pernah bisa dipakai (image tanpa `scripts/`),
  jebakan filter env yang menelan prefix `NEWS_MEDIA_R2_`, dan `skipped` yang menyamar
  sebagai sukses.
- **Konflik internal skill** — skill `production-preflight` menulis "sepuluh stage" di
  satu paragraf dan "sebelas stage" di paragraf lain (yang benar: sepuluh); checklist
  restore-nya masih menyebut "POS smoke test" (di luar scope ADR-0034); checklist go-live
  §Security memuat tax/CRM/AI seolah berlaku di repo ini. Skill `security-review` dapat
  banner scope + tanda _lineage ERP `awcms`_ pada baris warisan.

**Verifikasi:** `config:docs:check`, `check:docs`, `repo:inventory:check`, `typecheck`,
`prettier --check` — lihat §Langkah lanjut untuk sisa gate.

**Langkah lanjut:** commit di branch non-main + PR (perubahan menyentuh `src/` → changeset
`patch` wajib, lihat `changesets:policy:check`). Setelah merge, kompres entri ini jadi satu
baris historis.

---

### 2026-07-24 — Tiga PR sebelumnya (#331/#332/#333) sudah MERGED

> Jejak terkini sebelum entri di atas; dipertahankan sebagai konteks.

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

## Backlog terbuka yang menunggu operator (status per 2026-07-25)

Bukan pekerjaan kode yang bisa di-merge — **ter-gate infrastruktur**, hasil split dari
#273. Runbook eksekusi lengkap: [`website-platform-completion-runbook.md`](website-platform-completion-runbook.md).
**#273 dan #292 sudah CLOSED** (masing-masing 2026-07-20 completed dan 2026-07-21 premis
dibatalkan ADR-0036) — jangan buka lagi; bukti baru cukup ditautkan dari evidence matrix.

| Issue | Ringkas                                                | Status lapangan (2026-07-25)                                                                                                                                                       |
| ----- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| #261  | Epic website-platform (payung)                         | tetap terbuka sampai #293–#296 tuntas                                                                                                                                              |
| #293  | Deployment rehearsal Docker/Coolify/object-storage/CDN | **bukti lengkap** — preflight `GO-LIVE DIIZINKAN` 10/10 di target, media durable + leg upload ter-autentikasi terbukti, reconcile terjadwal; sisa: tautkan artefak & centang kotak |
| #294  | Backup/restore + DR (RTO/RPO terukur) + chaos drill    | backup nightly + offsite R2 terenkripsi **terpasang & restore-proven**; sisa: drill restore R2 + chaos drill live                                                                  |
| #295  | Performance/CWV budget + load/soak                     | gate lab LCP/CLS/**INP** mendarat; sisa: load/soak pada volume representatif                                                                                                       |
| #296  | Full-journey a11y (axe EN/ID) + link checking otomatis | axe atas template `/news` + `/blog` + crawl tautan mendarat; sisa: full journey di environment terdeploy                                                                           |

---

## Cara memakai log ini

1. Baca **Entri aktif** paling atas → itu titik lanjut terkini.
2. Selesaikan/lanjutkan; **update entrinya** (status, verifikasi, langkah berikut).
3. Saat sebuah unit kerja benar-benar selesai + ter-rilis, ringkas jadi satu baris
   historis dan biarkan entri baru naik ke atas.
4. Keputusan arsitektural → ADR; catatan rilis → CHANGELOG; log ini khusus **status kerja
   in-flight** yang harus selamat melintasi sesi/worktree.
