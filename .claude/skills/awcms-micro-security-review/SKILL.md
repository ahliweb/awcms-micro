---
name: awcms-micro-security-review
description: Jalankan security review modul AWCMS-Micro terhadap checklist keamanan. Gunakan sebelum merge modul sensitif atau saat diminta "security review <modul>". Memeriksa secret, auth, tenant/ABAC/RLS, audit, idempotency, masking, HMAC, dan AI read-only sesuai doc 12.
---

# AWCMS-Micro — Security Review Modul

Ikuti `docs/awcms-micro/12_generator_prompt.md` (Prompt Security Review) dan `docs/awcms-micro/13_final_master_index_traceability.md` (matrix security control).

> **Scope (ADR-0025/ADR-0034).** Repo ini adalah template **website full-online
> (sampai toko online)** yang dipakai langsung — bukan POS in-store, gudang, atau
> Coretax. Baris checklist/tabel bertanda **_lineage ERP `awcms`_** di bawah
> dipertahankan sebagai pola reusable untuk repo keluarga lain; **tidak** ada
> modul pajak/POS/CRM/AI di registry 22 modul repo ini, dan `security:readiness`
> memang mencetaknya sebagai "out of scope" (lihat
> `docs/awcms-micro/production-readiness.md` §Item di luar cakupan). Jangan
> laporkan ketiadaannya sebagai temuan.

## Checklist (per modul)

- [ ] Tidak ada hardcoded secret; provider credential dari env. Gate objektifnya `bun run security:readiness` — sebelum menyimpulkan sebuah temuan, baca §Scan secret di bawah.
- [ ] Auth required kecuali endpoint public eksplisit.
- [ ] Tenant context diset; query tenant-scoped filter `tenant_id`.
- [ ] ABAC default deny + deny overrides allow (`awcms-micro-abac-guard`).
- [ ] RLS aktif pada semua tabel tenant-scoped.
- [ ] Audit high-risk tertulis + redaksi (`awcms-micro-audit-log`).
- [ ] Idempotency pada mutation high-risk (`awcms-micro-idempotency`).
- [ ] Soft delete default filter aktif untuk resource deletable; restore/purge berizin, diaudit, dan tidak berlaku pada posted/append-only entity.
- [ ] Data sensitif dimasking (`awcms-micro-sensitive-data`); tidak bocor ke response/log/event.
- [ ] Error aman, tanpa stack trace.
- [ ] Sync HMAC + anti-replay bila modul sync (`awcms-micro-sync-hmac`).
- [ ] AI read-only: no raw SQL, no mutation, no raw PII/tax identity, tool call diaudit.
- [ ] Stock lock (`FOR UPDATE`) & immutable posted transaction bila relevan.
- [ ] Consent dicek sebelum kirim (CRM — _lineage ERP `awcms`_); receipt token non-sequential.
- [ ] File checksum diverifikasi (sync/R2; tax export _lineage ERP `awcms`_).

## Scan secret (`security:readiness`, Issue #293)

Check `No hardcoded secret` bersifat `critical` — satu false positive
memblokir go-live. Sejak PR #344 heuristiknya punya empat pengecualian
**struktural** (baris komentar, deklarasi type-only, template literal
terinterpolasi, nilai URL) plus daftar `SECRET_SCAN_ACKNOWLEDGED` berisi
kasus yang memang berbentuk seperti secret tapi terbukti bukan. Urutan
penanganan temuan baru: buktikan dulu bukan secret nyata → perbaiki
bentuknya bila memungkinkan → **baru** tambahkan entri acknowledged
beralasan (file + variabel + nilai + alasan). **Jangan pernah** melebarkan
regex-nya: itu menghilangkan kasus dari pandangan reviewer. Detail dan
daftar false-positive nyata: `docs/awcms-micro/production-readiness.md`
§Scan secret.

## Fokus per area

| Area        | Cek utama                                                                    |
| ----------- | ---------------------------------------------------------------------------- |
| Identity    | password hash modern, login lockout, failed login audit                      |
| POS         | idempotency, stock lock, atomic, immutable                                   |
| Tax         | NPWP/NIK/NITKU masked, export approval + audit                               |
| CRM         | consent, provider key env, phone/email masked                                |
| Sync        | HMAC, anti-replay, node inactive ditolak                                     |
| AI          | read-only, safe aggregate views, no raw PII                                  |
| Master data | soft delete hidden by default, restore conflict check, purge retention/legal |

## Output

Verdict (Approve / Request changes / Comment) + daftar temuan: critical, security, functional, data/migration, contract, testing gap, docs gap, saran patch. Critical finding **memblokir** go-live.
