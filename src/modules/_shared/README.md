# Shared Module Foundation

Folder ini berisi kontrak lintas-modul yang boleh dipakai semua modul AWCMS-Micro.

## Module Contract

Setiap modul wajib mendeklarasikan `ModuleDescriptor` dari `module-contract.ts`, lalu mendaftarkannya lewat `src/modules/index.ts`.

## API Response

Endpoint REST memakai helper dari `api-response.ts` agar response konsisten:

- sukses: `{ success: true, data, meta }`
- gagal: `{ success: false, error: { code, message, details? }, meta }`

## Idempotency Store

`idempotency.ts` backs `awcms_micro_idempotency_keys` (migration 012) for every high-risk mutation endpoint that requires `Idempotency-Key` (doc 10, skill `awcms-micro-idempotency`). `saveIdempotencyRecord` uses `INSERT ... ON CONFLICT (tenant_id, request_scope, idempotency_key) DO NOTHING RETURNING id` — two parallel requests can both pass `findIdempotencyRecord` under READ COMMITTED before either commits, and only one may win the unique index. On losing the race it re-`SELECT`s the now-committed winning row and compares `request_hash`: identical payload → throws `IdempotencyRaceLostError` carrying the winner's response to replay (honoring the ordinary "same hash → replay" rule even under the race); different payload → throws it with no replay (genuine conflict). `withTenant` (`src/lib/database/tenant-context.ts`) catches this error at the one chokepoint every caller already goes through: it rolls back the loser's transaction (so its mutation never persists), skips the circuit breaker (benign concurrency, not an infra failure), logs `idempotency.race_lost` (SHA-256 hash of the key, never the raw value), and returns either the replayed response or a clean `409 IDEMPOTENCY_CONFLICT` — never a raw constraint error — without touching the ~25 individual route files.

## Capability Ports

Untuk kapabilitas yang genuinely dipakai lintas-modul tapi TIDAK boleh jadi
cross-module `application`/`domain` import langsung (lihat
`docs/adr/0011-capability-ports-for-cross-module-collaboration.md`),
AWCMS-Micro memakai pola ports-and-adapters minimal — bukan DI framework,
murni parameter fungsi biasa:

- **Port** — interface TypeScript murni di `src/modules/_shared/ports/*.ts`,
  tidak meng-import apa pun dari modul manapun (netral).
- **Adapter** — implementasi konkret satu port, hidup di modul PEMILIK
  kapabilitas itu sendiri (mis. `media-library/application/media-library-port-adapter.ts`).
  Modul lain tidak pernah meng-import file adapter modul lain secara langsung.
- **Composition root** — route handler (`src/pages/api/v1/**`, dst.) yang
  meng-import adapter konkret dan menyuntikkannya sebagai parameter fungsi
  biasa ke kode `application` modul lain yang membutuhkan kapabilitas itu.

Tiga port nyata saat ini:

- **`ports/media-library-port.ts` — `MediaLibraryPort`** — kapabilitas milik
  `media_library`, dikonsumsi `blog_content`, `news_portal`, dan
  `social_publishing`: apakah penegakan managed-media aktif untuk tenant
  (dijawab dari readiness + flag per-tenant milik `media_library` sendiri, tanpa
  portal berita), validasi sebuah referensi media aman (same-tenant, verified),
  dan resolve id media ke URL publik/alt text. Men-supersede `NewsMediaPort`
  yang dipensiunkan (ADR-0026 langkah 3–4) — port lama membawa
  `isFullOnlineR2ModeActiveForTenant`, pertanyaan editorial `news_portal` yang
  tak semestinya ada di kontrak media.
- **`ports/public-content-port.ts` — `PublicContentPort`** — kapabilitas
  milik `blog_content`, dikonsumsi `news_portal`: query post/kategori
  publik read-only (existence check, ringkasan post by id, kategori by
  slug, listing post terbaru) untuk homepage section composer.
- **`ports/social-publishing-port.ts` — `SocialPublishingPort`** —
  kapabilitas milik `social_publishing`, dikonsumsi `blog_content` secara
  opsional (no-op aman — `{ jobsCreated: 0 }` — bila `social_publishing`
  tidak aktif untuk deployment tersebut): `onArticlePublished` membuat
  outbox job untuk setiap rule/akun yang cocok saat sebuah artikel
  published, murni tulis DB dalam transaksi milik caller (ADR-0006
  compliant — publish sungguhan ke provider terjadi belakangan, di luar
  transaksi, lewat dispatcher `social_publishing`).

Port yang **didefinisikan mendahului wiring** (bedakan dua kasus — jangan
disamakan):

- **Type-only, provider DAN consumer sama-sama belum di-wire, belum ada entri
  di `capability-contract-versions.ts`** — `ports/legal-hold-guard-port.ts`.
  Entri versi dipasangkan dengan `provides` sebuah modul, jadi menyusul saat
  modul penyedianya mendarat. Ini preseden yang tepat untuk `seo-facts-port.ts`.
- **Provider SUDAH di-wire, versi SUDAH ada, hanya consumer yang pending** —
  `ports/party-directory-port.ts`: `profile_identity` sudah
  `provides: ["party_directory"]` dengan adapter nyata, dan `party_directory:
"1.0.0"` sudah ada di `capability-contract-versions.ts`. Ini **bukan** kasus
  yang sama dengan dua port di atas.
- **`ports/seo-facts-port.ts` — `SeoFactsSource`** (ADR-0028, admission
  `seo_distribution`) — kapabilitas `seo_facts` yang modul konten
  (`blog_content`, `news_portal`, tipe konten aplikasi turunan) **sediakan**
  dan `seo_distribution` **konsumsi**: fakta SEO per-resource yang diturunkan
  server (canonical path + locale alternates, metadata/robots, Open
  Graph/Twitter via id media, JSON-LD schema terkontrol, entri sitemap/feed)
  untuk render metadata (#266), sitemap/feed (#267), dan redirect (#268).
  Arah panah ke DALAM (konten menyediakan, SEO mengonsumsi optional) menjaga
  agregator SEO ignorant terhadap modul konten mana pun dan tidak menyeret
  dependency ke mereka — sama semangatnya dengan `blog_content`↔`news_portal`.
  File ini juga membawa invariant kontrak murni (helper `buildSeoCacheKey`
  yang menuntut tenant/host/locale, prediket visibilitas publik, klasifikasi
  target redirect same-tenant, dan guard JSON-LD terkontrol) yang dikunci
  `tests/unit/seo-facts-contract.test.ts`. Descriptor `seo_distribution`,
  adapter `seo_facts`, dan entri `CAPABILITY_CONTRACT_VERSIONS["seo_facts"]`
  belum ada — mendarat di #266 (ADR-0028 admission-only).

`ModuleDescriptor` (`module-contract.ts`) punya field opsional
`capabilities?: ModuleCapabilityContract` (`{ provides?: string[],
consumes?: ModuleCapabilityDependency[] }`) untuk mendokumentasikan
hubungan port ini secara terstruktur — `provides` menyebut nama kapabilitas
yang modul ini sediakan adapternya (cocok dengan sebuah port di atas),
`consumes` menyebut kapabilitas modul lain yang dipakai (`providedBy` +
`optional` bila modul penyedia boleh tidak aktif untuk tenant/deployment
tertentu). Field ini sengaja TERPISAH dari `dependencies` (yang murni
mengatur urutan enable/disable lifecycle, dicek
`domain/tenant-module-lifecycle.ts`) — sebuah modul bisa mengonsumsi
kapabilitas modul lain tanpa mendeklarasikan `dependencies` ke sana (kasus
nyata `blog_content`/`news_portal`, keputusan Issue #632 yang masih
berlaku). Diverifikasi otomatis oleh `tests/unit/module-boundary.test.ts`,
yang men-scan `application`/`domain` tree tiap modul untuk import langsung
ke tree modul lain dan gagal loud bila ditemukan — bukan sekadar
didokumentasikan dan dipercaya secara manual.

Rasional desain lengkap (konteks, alternatif yang ditolak, trade-off):
`docs/adr/0011-capability-ports-for-cross-module-collaboration.md`.

## Soft Delete Convention

Resource master/config/draft yang bisa dihapus wajib memakai kolom:

- `deleted_at`
- `deleted_by`
- `delete_reason`

Query list/detail default harus menyaring `deleted_at IS NULL`. Akses arsip, restore, dan purge harus memakai permission eksplisit dan audit log. Helper awal tersedia di `soft-delete.ts`; repository spesifik modul tetap wajib memakai query terparametrisasi dan RLS sesuai doc 10/16.
