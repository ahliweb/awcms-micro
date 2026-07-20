# ADR-0033 — Admission `newsletter` (Official Optional Module): buletin CONSENT-FIRST + ANTI-ENUMERATION lewat content-source descriptor, DAG-safe inward

- **Status:** Accepted
- **Tanggal:** 2026-07-20
- **Pengambil keputusan:** @ahliweb
- **Terkait:** ADR-0025 (turunan scope website — §Konteks menuntut buletin/langganan sebagai fitur website), ADR-0032 (admission `comments` — preseden PERSIS: contribution contract INWARD lewat descriptor-list `listModules()`, modul konten adalah PENYEDIA, modul agregator KONSUMEN, email dikonsumsi lewat outbox event bukan hard dependency), ADR-0031 (admission `site_search` — preseden descriptor-list banyak-penyedia vs capability tunggal), ADR-0006 (provider opsional, di luar transaksi — Turnstile/provider callback/email dispatcher), ADR-0011 (capability ports), ADR-0012 (module admission & trusted registry boundary), ADR-0013 §1/§6 (lapisan ekstensi — modul tidak menulis ke tabel modul lain; kolaborasi lewat kontrak yang dideklarasikan modul pemilik), ADR-0009/0010 (rute publik tenant-scoped host/path), `docs/awcms-micro/21_module_admission_governance.md` (§3 pohon keputusan, §4.3 Official Optional Module, §5 required vs optional capability), epic #261 (website-platform), issue #272 (ADR + runtime dalam satu PR)

## Konteks

ADR-0025 §Konteks menuliskan scope website menuntut modul **buletin (newsletter)** — pengunjung mendaftarkan alamat email untuk menerima kabar, dengan **double-opt-in**, **preference center**, **unsubscribe satu-klik**, penanganan **bounce/complaint (suppression)**, dan pengiriman kampanye/digest yang dapat dijelaskan. Hari ini AWCMS-Micro memiliki `email` (pengiriman transaksional provider-neutral) dan `blog_content` (konten publik terbit) tetapi **tidak** ada permukaan langganan buletin: tidak ada subscriber, tidak ada topik, tidak ada consent evidence, tidak ada kampanye.

Dua risiko harus diikat **sebelum** kode:

1. **Enumerasi.** Sebuah endpoint subscribe/confirm/unsubscribe yang naif membocorkan apakah sebuah alamat sudah terdaftar/tersuppress — persis temuan verdict-oracle M1 pada `comments`. Untuk buletin taruhannya lebih tinggi (alamat email pihak ketiga). **Anti-enumeration wajib**: setiap alur publik mengembalikan respons generik yang **identik** apa pun keadaan alamat.
2. **Drift lintas-modul.** Bila #272 hanya menambah tabel subscriber ad-hoc yang di-`import` `blog_content`, setiap modul konten akan menumbuhkan versi digest/subscriber-nya sendiri. Keputusan yang harus mengikat: siapa yang memiliki buletin, ke arah mana dependency mengalir, dan lewat seam apa modul konten menyumbang sumber konten (untuk digest) tanpa saling impor.

Fakta grounding yang sudah ada dan **tidak** ditulis ulang oleh modul ini:

- `blog_content` (ADR-0009) sudah memiliki predikat "publik + terbit" tunggal. `newsletter` mengonsumsinya lewat descriptor `newsletterContentSources`, bukan memodelkannya ulang.
- `tenant_domain` (ADR-0010) me-resolve tenant dari host untuk rute publik. Endpoint buletin publik memakainya persis seperti `/news` dan `/api/v1/comments`.
- `profile-identity`'s `normalizeIdentifier`/`hashIdentifier`/`maskIdentifier` sudah ada untuk minimisasi email; `data_lifecycle` sudah punya legal hold + generic purge; `domain_event_runtime` sudah punya outbox transaksional; `email` sudah punya dispatcher provider-neutral. `newsletter` memakai ulang semuanya.

## Keputusan

Kami mengadmisi **`newsletter`** sebagai **Official Optional Module** (doc 21 §4.3 — fitur produk generik lintas domain website, opt-in per tenant, default-OFF), **CONSENT-FIRST** (subscriber baru mulai `pending` dan hanya jadi `subscribed` setelah confirm token single-use), **ANTI-ENUMERATION** (respons generik identik pada semua alur publik), dan mewujudkan kolaborasinya lewat **newsletter content-source contribution contract** — **bukan** impor internal lintas-modul dan **bukan** tulisan langsung ke shared table (ADR-0013 §6).

Arah kepemilikan dinyatakan tegas, meniru ADR-0031/0032: **modul konten adalah PENYEDIA "newsletter content sources"; `newsletter` adalah KONSUMEN/agregator.** Tidak ada modul yang sudah ada dibuat bergantung pada `newsletter`, dan `newsletter` tidak mengambil lifecycle dependency apa pun ke modul konten (hanya ke Core) — sehingga graf tetap **DAG-safe inward leaf**.

Sesuai instruksi issue, admission + runtime mendarat dalam **satu PR** (#272): ADR ini Accepted, descriptor `newsletter` didaftarkan di `src/modules/index.ts` (menaikkan hitungan base **21 → 22**), `MODULE_CONTRACT_VERSION` naik **1.4.0 → 1.5.0** (field kontrak baru `newsletterContentSources` + tipe `NewsletterContentSourceDescriptor`/`NewsletterContentSourcePublicationFilter`), dan kode runtime (skema, engine, endpoint, UI, job, event) ada semuanya.

### 1. Parameter admission

| Parameter                 | Nilai                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nama                      | Newsletter                                                                                                                                        |
| `key`                     | `newsletter`                                                                                                                                      |
| Kategori (doc 21 §2)      | **Official Optional Module** — buletin/langganan kebutuhan generik **setiap** situs publik lintas vertikal, opt-in per tenant, default-OFF        |
| `type` di kode            | `domain` (sama seperti `blog_content`/`comments`/`site_search`)                                                                                   |
| `isCore`                  | tidak                                                                                                                                             |
| `status`                  | `active` — descriptor + kode runtime mendarat bersama (#272)                                                                                      |
| Lifecycle `dependencies`  | `["tenant_admin", "identity_access"]` **saja** — tidak ke `blog_content`/`email`                                                                  |
| Kontribusi content-source | descriptor-list `ModuleDescriptor.newsletterContentSources` (§3) — **bukan** capability `provides` (>1 penyedia = `capability_provider_conflict`) |
| Registry count            | base **21 → 22**; `MODULE_CONTRACT_VERSION` **1.4.0 → 1.5.0**                                                                                     |
| Migrasi                   | `091` (skema, 13 tabel RLS FORCE) + `092` (permission seed)                                                                                       |

### 2. Arah panah dependency — depends on nothing but Core

`newsletter` adalah KONSUMEN/agregator: modul konten MENYEDIAKAN `NewsletterContentSourceDescriptor` pure-data lewat `ModuleDescriptor.newsletterContentSources` (pemetaan tabel/kolom deklaratif + publication filter + LABEL event publish deklaratif — bukan extractor eksekutabel), yang dibaca engine generik modul ini lewat `listModules()`. Ia **tidak** mendeklarasikan capability `provides` `newsletter_content_source` (akan memicu `capability_provider_conflict`) — descriptor-list yang menumpang `listModules()` adalah seam banyak-penyedia, derived-safe (preseden `searchSources`/`commentableResources`). `blog_content` menyumbang descriptor pertama `blog_content.post`.

### 3. Seam kontribusi: `newsletterContentSources` (pure DATA, bukan extractor)

Descriptor tidak membawa function reference — hanya NAMA tabel/kolom code-only yang direview, `publicationFilter` deklaratif, dan `publishEventType` (string). Engine `newsletter` (`application/content-source-engine.ts`) membangun query publikasi TERPARAMETER: VALUE filter selalu bound `$n`; hanya IDENTIFIER (nama tabel/kolom) yang diinterpolasi, dan direvalidasi dengan `assertSafeIdentifier`/`assertSafeTableName` sebelum interpolasi — disiplin PERSIS `comments`/`site_search`. Sebuah baris konten harus TERBIT & PUBLIK (per `publicationFilter`) sebelum jadi kandidat digest; tak ada tempat tenant menyuntik SQL.

### 4. Email dikonsumsi lewat event/outbox, bukan hard dependency

Pengiriman kampanye/digest dienqueue sebagai baris `delivery_attempts` per-penerima + domain event **address-free** (outbox `domain_event_runtime`, same-commit, ADR-0006); dispatcher email (konsumen follow-up terdokumentasi) me-resolve penerima TERENKRIPSI saat kirim, **di luar** transaksi DB apa pun. Alamat penerima TIDAK PERNAH dibawa dalam event/response/log. Karena `awcms_micro_worker` hanya punya SELECT pada `awcms_micro_domain_events`, event lifecycle kampanye diterbitkan oleh rute admin (peran app), bukan job dispatch.

### 5. Anti-enumeration + publication boundary (threat model)

- **Respons generik identik** pada subscribe/confirm/preferences/unsubscribe/resubscribe/provider-callback, apa pun keadaan alamat (baru/pending/subscribed/suppressed/lintas-tenant/host tak resolve). Tak ada timing oracle (pad latency saat tenant tak resolve). Tak ada raw PII (email) di response/log/event — hanya hash + mask.
- **Double-opt-in**: subscriber mulai `pending`; hanya confirm token (sha256-hash, single-use via `consumed_at`, konstan-waktu terverifikasi, kedaluwarsa) yang memindahkannya ke `subscribed`.
- **Suppression ditegakkan SEBELUM setiap kirim** dan saat audience-freeze; alamat tersuppress tak pernah dikirimi ulang bahkan bila re-subscribe. `resubscribe` HANYA melepas suppression beralasan `unsubscribe` (bounce/complaint tetap terkunci).
- **Provider callback** diverifikasi signature (HMAC konstan-waktu) + replay (`dedupe_key` UNIQUE insert) SEBELUM dipercaya; redirect browser tak pernah dipercaya.
- **Publication boundary**: kandidat digest hanya dipilih terhadap baris konten yang dikonfirmasi TERBIT & PUBLIK lewat `publicationFilter` modul pemilik. Permukaan buletin **bukan** sumber otorisasi konten.
- **Uniqueness normalized-hash**: `UNIQUE (tenant_id, email_hash)` — alamat sama bisa ada di dua tenant tanpa saling tahu (RLS FORCE + hash tenant-scoped).

### 6. Katalog permission (sql/092)

`module_key` `newsletter`. Setiap `action` adalah literal `AccessAction` yang sudah ada (tak ada literal baru diciptakan): `subscribers.read`; `topics.read/create/update`; `suppression.read/create`; `campaigns.read/create/update/schedule/send/cancel`. Lifecycle kampanye memetakan ke literal berbeda yang sudah ada di union: `schedule` (jadwalkan), `send` (dispatch — mutasi paling berisiko, Idempotency-Key), `cancel` (batal). Topik tak pernah di-hard-delete (postur append-only evidence) — dinonaktifkan via `is_active=false` (`update`).

## Konsekuensi

**Positif:** buletin lengkap tanpa impor lintas-modul; anti-enumeration diikat di desain; drift dicegah lewat descriptor-list yang sama dengan `searchSources`/`commentableResources`; DAG tetap inward leaf; retensi legal-hold-aware + generic purge memakai ulang `data_lifecycle`; pengiriman provider-neutral memakai ulang outbox/`email`.

**Negatif / batas:** pengiriman aktual (adapter provider email untuk kampanye) adalah konsumen outbox follow-up terdokumentasi (di luar scope #272, konsisten ADR-0006); `reportingProjections` untuk statistik pengiriman ditunda (opsional) agar registry check tetap ketat; metrics kustom tidak ditambahkan (opsional, menghindari kardinalitas tinggi).

## Alternatif yang ditolak

- **Capability `provides` `newsletter_content_source`** — memicu `capability_provider_conflict` bila >1 modul konten ingin menyumbang; descriptor-list menang (preseden §3).
- **Hard dependency ke `email`** — akan mengubah DAG dan membuat buletin non-fungsional saat email tak dikonfigurasi; outbox event address-free menang (§4).
- **Menyimpan alamat mentah untuk pengiriman** — melanggar minimisasi PII; AES-GCM ciphertext + sentinel fail-closed menang.
- **Endpoint yang membocorkan keberadaan alamat** (mis. 404 untuk alamat tak dikenal) — melanggar anti-enumeration; respons generik identik menang (§5).
