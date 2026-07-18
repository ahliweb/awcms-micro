# ADR-0027 — Profil deployment full-online, tujuan `sync_storage`, dan aturan durable object-storage

- **Status:** Accepted
- **Tanggal:** 2026-07-19
- **Pengambil keputusan:** @ahliweb
- **Terkait:** ADR-0006 (transactional outbox + sync HMAC — di sini **diamandemen dalam scope**: pola outbox dipertahankan, klaim offline-first/LAN-first sebagai mode operasi base ditarik), ADR-0025 §2 (scope full online website + alasan `sync_storage` dipertahankan), ADR-0026 (`media_library`), ADR-0010 (public host tenant routing), epic #261, Issue #262 (keystone Wave 0 — #263/#264/#265 merujuk terminologi profil di sini)

## Konteks

AWCMS-Micro adalah **turunan scope website online penuh** dari standar AWCMS-Mini (ADR-0025). Namun sebagian dokumentasi aktif — README (diagram "Prinsip offline-first", zona `Client / LAN`, node `Local file storage`, baris stack "Offline-first / LAN-first"), `package.json` (keyword `offline-first`), `deployment-profiles.md`, dan skill deploy — masih memuat asumsi **offline-first / LAN-first** yang diwarisi apa adanya dari upstream. Asumsi itu benar untuk aplikasi ERP/POS turunan yang memang bisa berjalan tanpa internet; **salah** untuk platform website yang seluruh nilainya adalah tersaji online.

Drift ini menimbulkan panduan implementasi yang bertentangan bagi agent dan operator:

1. **Mode operasi.** README menyebut "Offline-first / LAN-first" sebagai mode operasi, padahal website base tidak punya kapabilitas offline yang terimplementasi (tidak ada service worker + IndexedDB outbox yang aktif; halaman publik SSR butuh koneksi).
2. **Tujuan `sync_storage`.** Modul ini gampang disalahpahami sebagai sinkronisasi data bisnis offline node-to-node. Padahal di repo ini ia dipertahankan **hanya** karena object queue-nya adalah jalur unggah media ke object storage (ADR-0025 §2).
3. **Storage produksi.** Diagram README menampilkan `Local file storage` sebagai penyimpanan media. Untuk deployment container produksi, filesystem container bersifat **ephemeral** — media yang ditulis ke sana hilang saat container diganti/di-redeploy.

ADR ini menetapkan satu model deployment/storage yang otoritatif dan menjadi rujukan kanonik terminologi profil untuk issue turunan (#263 cleanup dokumentasi, #264 rekonsiliasi media-library, #265 admission SEO).

## Keputusan

### 1. Profil deployment yang didukung

Base mendukung **tiga** profil operasi. Nama kanonik (lowercase snake_case) — dipakai identik di kode (`src/lib/deployment/storage-profile.ts` `FullOnlineDeploymentProfile`), dokumen, dan issue turunan:

| Profil                    | Runtime & data                                                          | Storage media terkelola                                                                                             | Paparan                                     |
| ------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `development`             | Bun + Astro SSR + PostgreSQL lokal, semua provider off                  | Lokal/ephemeral **boleh** — eksplisit **bukan** untuk produksi                                                      | Lokal (`bun run dev`)                       |
| `full_online_single_host` | Bun + Astro SSR + PostgreSQL, satu host (systemd atau `docker-compose`) | **Volume ter-mount durable** _atau_ object storage. Bila memakai volume: wajib kebijakan backup + rekonsiliasi      | Internet (via nginx TLS) atau LAN tepercaya |
| `full_online_production`  | Bun + Astro SSR + PostgreSQL + **object storage provider-neutral**      | Object storage wajib. **Cloudflare R2 = adapter rekomendasi pertama, bukan wajib** (kontrak tetap provider-neutral) | Internet, terpapar publik                   |

`staging` adalah **mirror produksi**, bukan profil keempat — ia diklasifikasikan sebagai `full_online_single_host` oleh evaluator (lihat `classifyDeploymentProfile`). Pemetaan ke `APP_ENV`: `development` → `APP_ENV=development`/unset; `full_online_single_host` → `APP_ENV=staging`; `full_online_production` → `APP_ENV=production`.

**Tidak ada perilaku hybrid/degraded yang didokumentasikan sebagai mode operasi base**, karena tidak ada kapabilitas offline base yang terimplementasi dan teruji untuk mendukungnya. Klaim "alur kritikal tetap jalan tanpa internet" ditarik dari dokumen aktif.

#### Tidak ada env var `DEPLOYMENT_PROFILE`

Profil adalah keputusan **topologi** yang dipilih operator, bukan switch runtime. Repo ini sengaja **tidak** punya env var global `DEPLOYMENT_PROFILE`/`FILE_STORAGE_DRIVER`/`LOCAL_MEDIA_STORAGE_ENABLED` (lihat `scripts/config-docs-check.ts` `DOC18_NON_VARIABLE_TOKENS`). Evaluator menurunkan profil dari sinyal yang sudah ada: `APP_ENV`, `R2_ENABLED`, `NEWS_MEDIA_R2_ENABLED`.

### 2. Tujuan `sync_storage`: object queue/outbox, bukan sinkronisasi data bisnis offline

Di repositori ini `sync_storage` menyediakan **object queue/outbox untuk unggah objek** — pola CLAIM/UPLOAD/FINALIZE tiga fase yang tidak pernah memanggil provider di dalam transaksi DB (ADR-0006/ADR-0025 §2), keluar dari transaksi lewat worker `bun run sync:objects:dispatch`. Ia **bukan** sinkronisasi data bisnis offline/LAN node-to-node. Endpoint sync HMAC (`/sync/push`, `/sync/pull`) dan machinery node/conflict yang diwarisi tetap ada sebagai infrastruktur yang dipertahankan untuk aplikasi turunan yang benar-benar butuh, **bukan** sebagai fitur operasi website base.

### 3. Aturan durable storage

**Produksi tidak boleh mengandalkan filesystem container ephemeral sebagai penyimpanan durable untuk media terkelola.** Media terkelola pada profil online wajib berada di salah satu:

- **Object storage provider-neutral** (R2 rekomendasi pertama) — durable secara desain; atau
- **Volume ter-mount durable** yang bertahan melewati penggantian container/host, **hanya** untuk `full_online_single_host`, dan wajib disertai kebijakan backup + rekonsiliasi.

`STORAGE_DRIVER`/`LOCAL_STORAGE_PATH` adalah env var **mati** (Issue #689) — tidak dibaca kode mana pun; switch nyata local-vs-object-storage adalah `R2_ENABLED` (sync object queue) dan `NEWS_MEDIA_R2_ENABLED` (media-library/news-portal).

### 4. Kegagalan object storage, retry/rekonsiliasi, dan public URL/CDN

- **Kegagalan panggilan provider tidak memblokir alur transaksional.** Panggilan object-provider di luar transaksi DB; kredensial hanya dari environment/secrets manager, tidak pernah di-commit.
- **Retry & rekonsiliasi upload queue.** Object queue sync-storage men-retry via dispatcher terjadwal; objek media berita `pending_upload` yang lewat `NEWS_MEDIA_R2_PENDING_TTL_MINUTES` dibersihkan/direkonsiliasi oleh `bun run news-media:reconcile` (`r2-backup-lifecycle.md`). `security:readiness` `checkNewsMediaR2NoStalePendingObjects` menggagalkan go-live bila ada objek stuck melewati TTL.
- **Public URL/CDN least-privilege.** Media berita publik-by-design wajib custom domain (`NEWS_MEDIA_R2_PUBLIC_BASE_URL`), bukan default `*.r2.dev` di produksi; bucket policy/CORS/MIME validation/presigned upload tetap least-privilege (checks `checkNewsMediaR2*` di `security:readiness`).

### 5. Matriks severity readiness

Invarian durable-storage ditegakkan oleh `checkDurableMediaStorageReady` (`scripts/security-readiness.ts`), yang mendelegasikan keputusan ke fungsi murni `evaluateDurableStorageReadiness` (`src/lib/deployment/storage-profile.ts`). **Hanya temuan `critical` yang memblokir go-live.**

| Profil / sinyal                                                | status | severity     | reason code                             |
| -------------------------------------------------------------- | ------ | ------------ | --------------------------------------- |
| `development` (`APP_ENV` bukan online)                         | pass   | info         | `development_local_ok`                  |
| online + object storage on + kredensial lengkap                | pass   | info         | `object_storage_configured`             |
| online + object storage on + kredensial **tidak lengkap**      | fail   | **critical** | `object_storage_credentials_incomplete` |
| `APP_ENV=staging` + tanpa object storage (single-host, volume) | pass   | warning      | `single_host_local_volume_unverified`   |
| `APP_ENV=production` + tanpa object storage (FS ephemeral)     | fail   | **critical** | `production_ephemeral_storage`          |

### 6. Hubungan dengan label `offline-lan`

`offline-lan` **tetap ada** sebagai label kapabilitas di kontrak kompatibilitas modul/ekstensi (`ModuleDeploymentProfile`, `ExtensionManifestDeploymentProfile`) — dipakai **aplikasi turunan** yang menambah modul offline sendiri (mis. POS LAN-first), dan ditegakkan oleh checker kompatibilitas yang teruji. Itu **bukan** mode operasi website base. Type `FullOnlineDeploymentProfile` sengaja tidak memuat `offline-lan`. Retensi label ini memenuhi kriteria issue "klaim LAN/offline dihapus kecuali didukung kapabilitas teruji" — ini kapabilitas turunan yang teruji, bukan klaim base.

## Konsekuensi

**Positif.** Satu model deployment/storage yang otoritatif dan bisa dirujuk kode + issue turunan. Produksi tidak bisa lagi diam-diam memakai FS ephemeral sebagai durable media store — gate readiness menangkapnya. Kontrak object storage tetap provider-neutral (R2 rekomendasi, bukan lock).

**Negatif / utang yang diakui.** ADR ini merekonsiliasi dokumen aktif yang dienumerasi Issue #262 (README, package metadata, ADR, deployment docs, diagram, config docs, runbook backup, derived-app guide). Paket dokumen naratif yang lebih luas (doc 01 canvas, 12 generator, 13 traceability, 14 UI/UX, 15 frontend, 19 glossary) dan SOP (doc 08) **masih** memuat bahasa offline-first/LAN yang diwarisi — itu utang dokumentasi yang sama diakui ADR-0025 §Konsekuensi dan sebagian masuk scope #263, **bukan** deskripsi perilaku repo ini. Sampai dirapikan: `src/`, `sql/`, dan gate CI tetap sumber kebenaran.

**Netral.** Karena profil diturunkan dari `APP_ENV` (bukan env var baru), operator yang sudah men-set `APP_ENV` dengan benar tidak perlu migrasi konfigurasi apa pun.

## Alternatif yang ditolak

- **Menambah env var `DEPLOYMENT_PROFILE`.** Ditolak — bertentangan dengan keputusan repo yang sudah ada (config-docs-check `DOC18_NON_VARIABLE_TOKENS`), dan menduplikasi sinyal yang sudah ada di `APP_ENV`/`R2_ENABLED`/`NEWS_MEDIA_R2_ENABLED`.
- **Menghapus `sync_storage` / machinery sync HMAC.** Ditolak — object queue-nya adalah jalur unggah media yang nyata (ADR-0025 §2); yang salah adalah framing-nya, bukan keberadaannya.
- **Menjadikan durable-storage check selalu critical di semua profil online.** Ditolak — `full_online_single_host` dengan volume ter-mount durable adalah topologi sah; check tidak bisa memverifikasi durabilitas volume, jadi severity warning (bukan block) dengan tuntutan atestasi operasional adalah yang jujur.
- **Menghapus label `offline-lan` dari kontrak ekstensi.** Ditolak — itu kapabilitas turunan teruji, bukan klaim base; menghapusnya breaking change tanpa manfaat scope.
