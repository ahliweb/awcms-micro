---
"awcms-micro": minor
---

Rekonsiliasi deployment full-online, tujuan `sync_storage`, dan profil durable object-storage (Issue #262, keystone epic #261 Wave 0).

- ADR-0027 baru mendefinisikan profil kanonik `development`/`full_online_single_host`/`full_online_production`, aturan durable storage (produksi tidak boleh mengandalkan FS container ephemeral untuk media terkelola), perilaku kegagalan/retry/rekonsiliasi object storage + ekspektasi public URL/CDN, matriks severity readiness, dan penegasan `sync_storage` = object queue/outbox (bukan sync data bisnis offline). R2 = adapter rekomendasi pertama, bukan wajib.
- `security:readiness` menambah gate `checkDurableMediaStorageReady` (murni via `src/lib/deployment/storage-profile.ts`): `APP_ENV=production` tanpa object storage → critical (blok go-live); `APP_ENV=staging` single-host tanpa object storage → warning; object storage on dengan kredensial tidak lengkap → critical.
- Menghapus/menulis ulang klaim offline-first/LAN-first di README, `package.json`, doc 18, deployment-profiles, deploy skill, deploy-coolify, derived-application-guide, dan indeks docs; menambah backup/rekonsiliasi object-storage di `deploy/backup/README.md`. ADR-0006 diamandemen dalam scope.
