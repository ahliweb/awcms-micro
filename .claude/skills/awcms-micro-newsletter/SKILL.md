---
name: awcms-micro-newsletter
description: Kerjakan bagian mana pun dari epic newsletter AWCMS-Micro (Issue #272, epic #261 Wave 2, ADR-0033 — SELESAI) — topik/daftar langganan, subscriber double-opt-in (hash+mask+AES-GCM, tanpa raw email), subscription per-topik, ledger append-only (consent/state-history/provider), token single-use konstan-waktu, suppression (bounce/complaint/manual/unsubscribe), lifecycle kampanye/digest (draft→schedule→dispatch→complete/cancel) dengan audience snapshot beku + delivery attempts resumable, provider callback signature+replay, retensi legal-hold-aware, ANTI-ENUMERATION pada semua rute publik, rute admin + UI, atau seam kontribusi newsletterContentSources untuk tipe konten baru. Gunakan saat menambah endpoint/logic ke src/modules/newsletter, src/pages/api/v1/newsletter, src/pages/admin/newsletter, mengubah schema newsletter, menyumbang NewsletterContentSourceDescriptor dari modul konten, atau mengerjakan issue susulan. Merangkum keputusan yang sudah dibuat di Issue #272 supaya tidak diulang/dikontradiksi.
---

# AWCMS-Micro — Newsletter Module

`newsletter` (`src/modules/newsletter`) adalah **modul domain Official Optional
Module** (ADR-0033, Issue #272, epic #261 Wave 2) — buletin **CONSENT-FIRST** +
**ANTI-ENUMERATION**. Admission + runtime pertama mendarat dalam satu PR (#272),
menaikkan registry base **21 → 22** dan `MODULE_CONTRACT_VERSION` **1.4.0 →
1.5.0**. Modul terdaftar `status: "active"`, default-OFF,
`dependencies: ["tenant_admin", "identity_access"]` saja. Baca
`src/modules/newsletter/README.md` untuk detail tiap tabel/endpoint dan
`docs/awcms-micro/newsletter.md` untuk consent/privacy/runbook.

## Keputusan yang WAJIB dipakai ulang (jangan didesain ulang)

1. **ANTI-ENUMERATION adalah spine.** Setiap rute publik
   (`subscribe`/`confirm`/`preferences`/`unsubscribe`/`resubscribe`/
   `provider-callback`) WAJIB mengembalikan respons generik identik (lihat
   `domain/generic-response.ts` — `GENERIC_ACCEPTED`) apa pun keadaan alamat
   (baru/pending/subscribed/suppressed/lintas-tenant/host tak resolve). Tanpa
   timing oracle (pad latency di `public-newsletter-tenant-resolution.ts`), tanpa
   raw email di response/log/event. Alamat SELALU disimpan minimized:
   `deriveSubscriberEmailParts` (hash + mask) + `resolveStoredSubscriberRef`
   (AES-GCM ciphertext atau sentinel `unresolvable`).

2. **Double-opt-in + token single-use.** Subscriber mulai `pending`; hanya
   confirm token (`domain/newsletter-token.ts` — sha256-hash, `verifyTokenHash`
   konstan-waktu, `consumed_at` single-use, kedaluwarsa) yang memindahkannya ke
   `subscribed`. Raw token dikembalikan SEKALI di hasil service, TIDAK PERNAH di
   respons HTTP (dikirim lewat email path). State machine di
   `domain/subscriber-state.ts` + `domain/subscription-state.ts`.

3. **Suppression ditegakkan sebelum kirim.** `application/suppression-directory.ts`
   dicek saat audience-freeze DAN saat attempt (`application/delivery-engine.ts`).
   `resubscribe` HANYA melepas suppression beralasan `unsubscribe`; bounce/complaint
   tetap terkunci.

4. **Provider callback: verify SEBELUM percaya.** `domain/provider-callback-verify.ts`
   (HMAC konstan-waktu atas RAW body + `dedupe_key` UNIQUE untuk replay). Signature
   buruk → 400. Redirect browser tak pernah dipercaya.

5. **Seam kontribusi `newsletterContentSources`** (pure DATA, bukan capability
   `provides`, bukan extractor). Modul konten mendeklarasikan
   `NewsletterContentSourceDescriptor` di `module.ts`-nya; engine
   `application/content-source-engine.ts` membacanya via `listModules()` dan
   merevalidasi identifier (`assertSafeIdentifier`) sebelum SQL apa pun.
   `blog_content` menyumbang `blog_content.post`.

6. **Email lewat outbox event address-free, bukan hard dependency** (ADR-0006).
   Kampanye membekukan audience snapshot + enqueue `delivery_attempts`, lalu
   `application/newsletter-events.ts` menerbitkan event address-free. Job
   `newsletter:dispatch` TIDAK menerbitkan event (worker hanya SELECT pada
   `awcms_micro_domain_events`) — event lifecycle diterbitkan rute admin (peran app).

7. **13 tabel `awcms_micro_newsletter_*`, RLS FORCE** (sql/091), permission seed
   (sql/092). Retensi legal-hold-aware (`application/subscriber-retention.ts`,
   descriptor `newsletter.subscribers` delegated `anonymize`) + generic purge
   (delivery_attempts/provider_events/tokens).
   **Anonimisasi retensi (audit M2) menimpa `email_hash` → sentinel
   `'anonymized-' || id`** (sha256 email low-entropy itu dictionary-reversible =
   existence oracle bila dipertahankan). Konsekuensi yang mudah lupa: SETELAH
   anonimisasi, TIDAK ADA baris yang resolve lewat `email_hash` asli — kode/test
   yang lookup by hash lama akan dapat 0 baris (bukan bug produk; test harus
   tangkap `id` sebelum anonimisasi lalu lookup by id). Padding timing (audit M1)
   di cabang suppressed `subscribe`/`resubscribe` menyamakan jumlah round-trip
   dengan jalur tulis agar bukan timing oracle.

## Jangan

- Jangan kembalikan status berbeda untuk alamat ada vs tidak ada (oracle).
- Jangan simpan/log/eventify raw email.
- Jangan panggil provider di dalam transaksi DB.
- Jangan tambah literal `AccessAction` baru — pakai yang ada (`schedule`/`send`/
  `cancel` untuk lifecycle kampanye).
- Jangan hard-delete topik — nonaktifkan (`is_active=false`).
