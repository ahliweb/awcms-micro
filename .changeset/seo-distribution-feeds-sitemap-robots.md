---
"awcms-micro": minor
---

Tambahkan permukaan discovery/syndication publik `seo_distribution` — robots.txt, sitemap index + child sitemaps berpaginasi, serta feed RSS 2.0 / Atom 1.0 / JSON Feed 1.1 (Issue #267, epic #261 Wave 1, ADR-0028).

- **Route Astro publik (bukan OpenAPI, seperti `/news`), tanpa autentikasi secara desain:** `/robots.txt`, `/sitemap.xml` (index), `/sitemap-{n}.xml` (child), `/feed.xml` (RSS), `/atom.xml` (Atom), `/feed.json` (JSON Feed — dipertahankan oleh ADR-0028 §4). Semua mengagregasi kontrak `seo_facts` yang sama; provider di-wire di composition root `src/lib/seo/discovery-providers.ts` (modul `seo_distribution` sendiri tidak mengimpor modul konten).
- **Host server-derived** dari domain primary terverifikasi tenant (`tenant_domain`) — host request yang datang TIDAK PERNAH dipakai untuk membentuk URL (pertahanan host-header poisoning); tenant di-resolve + digate (`seo_distribution` enabled) oleh `withSeoPublicTenant` dengan normalisasi latensi 404 generik.
- **Bounded queries:** sitemap index menghitung ukurannya dari roll-up `summarize` yang murah; tiap child page satu window terbatas; feed dibatasi `feed_item_limit` (≤200). Tidak ada request yang men-scan seluruh konten tenant. Bukti query-plan (index-backed, tanpa Seq Scan lintas-tenant) di `tests/integration/seo-discovery-query-plan.integration.test.ts`.
- **Cache & invalidasi event-driven:** signature deterministik (`kind + host + locale + contractVersion + configFingerprint + content roll-up`) menghasilkan `ETag` kuat + `Last-Modified`; `If-None-Match`/`If-Modified-Since` → 304; `Cache-Control: public, max-age, s-maxage, stale-while-revalidate`. Karena validator diturunkan dari state konten/domain/config, perubahan publish/update/archive/delete/domain/locale/config meng-invalidasi output terkait. Integrasi CDN/edge (ADR-0028 §7) di luar scope.
- **Kontrak `seo_facts` naik ke 1.1.0 (MINOR, additive):** metode opsional `summarizePublicResourceFacts` (roll-up count/max untuk ukuran index + validator cache) plus opsi `order`/`offset` pada `listPublicResourceFacts` (feed newest-first + paginasi child sitemap deterministik). Provider 1.0.0 tetap valid. `SEO_RENDER_CONTRACT_VERSION` diselaraskan ke 1.1.0.
- **Config feed per-tenant (migration baru sql/082, extend `awcms_micro_seo_tenant_settings`):** `feed_title`/`feed_description`/`feed_logo_media_id`/`feed_item_limit` (1–200)/`included_resource_types` (allow-list, null=all)/`sitemap_enabled`/`feeds_enabled`, semua dalam batas aman (CHECK + validasi app). Dikelola lewat `GET`/`PUT /api/v1/seo/config` yang sudah ada (aktivitas `config` — tanpa permission baru; route publik tanpa auth).
- **Keamanan:** output XML/JSON di-escape (escape-never-reject, mewarisi guard beku); JSON feed memakai `content_text` (tanpa HTML tenant); cache signature tenant-first (tak bisa lintas tenant / bocor draft-deleted); batas amplifikasi sitemap. Uji host-poisoning, XML injection, kebocoran unpublished, cache-poisoning, dan isolasi lintas-tenant (RLS) disertakan.
- **Descriptor `seo_distribution` v0.2.0:** tidak menambah modul base baru (registry tetap 18); route + config bukan modul.

Hardening review (PR #280, sebelum rilis fitur ini):

- **Atom `<author>` wajib (RFC 4287 §4.1.1):** `renderAtom` kini memancarkan satu `<author><name>…</name></author>` tingkat-feed (dinamai sesuai publikasi), karena entri tidak punya author sendiri — tanpa ini dokumen non-conformant.
- **Tanpa primary host → 404, bukan URL relatif:** `<loc>`/`<id>`/`<guid>` sitemap & feed WAJIB absolut; bila tenant tak punya domain primary aktif, `/sitemap.xml`, `/sitemap-{n}.xml`, `/feed.xml`, `/atom.xml`, `/feed.json` kini **404** (robots.txt tetap 200 tanpa baris `Sitemap:`). Penajaman ADR-0028 §5.4 khusus permukaan yang dikonsumsi mesin.
- **Cache signature injektif + tenant-scoped:** `buildDiscoverySignature` menambahkan `tenantId` dan meng-join bagian dengan NUL (bukan spasi) agar bagian free-text tak bisa melebur melewati batas (klaim injektivitas kini benar).
- **Strip C0 control chars ilegal-XML:** serializer feed + sitemap memakai `escapeXmlText` (strip U+0000–U+0008/U+000B/U+000C/U+000E–U+001F sebelum entity-escape) — satu control char di judul post tak lagi merusak well-formedness seluruh dokumen.
- **Timestamp feed kosong stabil:** `<updated>`/`<lastBuildDate>` feed kosong memakai nilai stabil (settings updated_at, else epoch) yang cocok dengan ETag/Last-Modified-nya, bukan `now()` yang berubah tiap request.
- **Guard segmen halaman sitemap:** `/sitemap-{n}.xml` hanya menerima `^\d+$` — `1e3`/`0x10`/`%205` kini 404.
