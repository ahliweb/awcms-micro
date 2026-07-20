# ADR-0030 — Fondasi Redis opsional untuk cache dan koordinasi ephemeral

- **Status:** Accepted
- **Tanggal:** 2026-07-20
- **Pengambil keputusan:** @ahliweb
- **Terkait:** Issue #284; AWCMS-Mini Issue #890 / draft PR #891; ADR-0001, ADR-0003, ADR-0004, ADR-0006, ADR-0011, ADR-0025, ADR-0027

## Konteks

AWCMS-Micro adalah platform website full-online multi-tenant yang memakai PostgreSQL dengan RLS sebagai sumber kebenaran. Ketika aplikasi turunan berkembang menjadi beberapa instance atau memiliki beban baca tinggi, dibutuhkan lapisan cache dan koordinasi sementara yang dapat dipakai tanpa menambah beban serta latensi PostgreSQL pada setiap permintaan.

Menambahkan Redis langsung ke modul tertentu sebelum ada aturan bersama menimbulkan risiko:

1. key tenant bercampur atau bertabrakan;
2. Redis berubah tanpa sengaja menjadi sumber data authoritative;
3. gangguan Redis menggagalkan transaksi utama;
4. nilai cache hidup tanpa TTL dan menumpuk;
5. kredensial atau payload sensitif masuk log;
6. deployment membuka port Redis ke internet;
7. implementasi AWCMS-Micro menyimpang dari standar upstream AWCMS-Mini.

AWCMS-Mini telah menyiapkan pola Redis pada Issue #890 / draft PR #891. AWCMS-Micro mem-port pola yang kompatibel, mengganti namespace produk, dan mempertahankan batas full-online website pada ADR-0025.

## Keputusan

AWCMS-Micro mengadopsi **fondasi Redis opsional berbasis `RedisClient` native Bun** sebagai kapabilitas infrastruktur, bukan modul domain dan bukan sumber kebenaran baru.

Fondasi terdiri dari:

- parser dan validator konfigurasi Redis;
- singleton client lazy dengan timeout dan retry terbatas;
- pembentuk key tenant-aware;
- helper JSON cache-aside dengan TTL wajib;
- health command dengan redaksi kredensial;
- overlay Docker Compose hardened yang diaktifkan eksplisit;
- unit test tanpa Redis hidup;
- panduan keamanan, operasi, pemulihan, dan adopsi bertahap.

Tidak ada tabel, migration, endpoint OpenAPI, atau event AsyncAPI baru.

## Invariant arsitektur

1. **Nonaktif secara default.** Tidak ada koneksi Redis ketika `REDIS_ENABLED` bukan `true`.
2. **PostgreSQL authoritative.** Konten, konfigurasi tenant, identity, session, permission, audit, idempotency, outbox, domain event, dan state transaksional tetap di PostgreSQL.
3. **Fail-open khusus cache.** Kegagalan baca menjadi cache miss; kegagalan tulis/invalidation menjadi skip. Loader PostgreSQL tetap menentukan hasil.
4. **Di luar transaksi PostgreSQL.** Command Redis tidak boleh ditempatkan dalam callback transaksi database.
5. **Tenant-aware.** Data tenant wajib membangun key melalui `buildRedisKey()` dengan `tenantId` eksplisit.
6. **TTL wajib.** Helper cache hanya menulis melalui `SET ... EX` dengan batas 1–86.400 detik.
7. **Tidak ada data rahasia di log.** URL diagnostik meredaksi username/password; payload dan key tenant tidak dicetak.
8. **Jaringan internal.** Overlay Compose tidak mempublikasikan port Redis dan mematikan user default.
9. **Least privilege.** Application ACL user dibatasi pada prefix key aplikasi serta command read/write yang diperlukan; command berbahaya ditolak.
10. **Startup tidak bergantung Redis.** Service aplikasi tidak menunggu health Redis karena Redis hanya akselerator.

## Penggunaan yang disetujui

Penggunaan awal yang dapat diterapkan melalui issue terpisah:

- cache agregat dashboard/reporting yang boleh stale singkat;
- cache konfigurasi publik tenant, metadata domain, tema, SEO, sitemap, dan feed;
- cache hasil render atau fragment publik yang deterministik dan dapat dihitung ulang;
- cache katalog/reference yang sumber aslinya tetap PostgreSQL;
- koordinasi ephemeral idempotent setelah threat model dan race-condition review.

Distributed rate limiting, lock, pub/sub, delayed job, dan queue **tidak otomatis disetujui** oleh ADR ini. Masing-masing membutuhkan issue atomik, failure-mode eksplisit, atomicity test, dan observability.

## Penggunaan yang dilarang pada fondasi awal

Redis tidak boleh menjadi:

- session store tunggal;
- audit log atau security log;
- sumber permission/RBAC/ABAC/RLS;
- durable outbox, inbox, job queue, atau event log;
- penyimpanan konten/media authoritative;
- pengganti idempotency record PostgreSQL;
- tempat secret jangka panjang;
- satu-satunya mekanisme rate limit endpoint berisiko tinggi tanpa fallback yang ditetapkan.

## Alternatif yang dipertimbangkan

### Tidak menambah Redis

Paling sederhana, tetapi setiap aplikasi turunan akan merancang client, key, TTL, dan failure behavior sendiri. Ditolak karena berpotensi menghasilkan drift dan kelemahan tenant isolation.

### Menambah package Redis berbasis Node.js

Ekosistem luas, tetapi menambah dependency runtime dan berlawanan dengan kebijakan Bun-only bila native client sudah memenuhi kebutuhan dasar. Ditolak untuk fondasi awal.

### Menjadikan Redis service wajib pada stack utama

Memudahkan standardisasi deployment, tetapi memperbesar kebutuhan operasi untuk semua instalasi dan menjadikan cache sebagai dependency startup. Ditolak; Redis tetap overlay opt-in.

### Memindahkan session/outbox ke Redis sejak awal

Dapat memberi throughput tertentu, tetapi mengubah model durability, recovery, security, dan audit secara signifikan. Ditolak dan di luar scope.

## Konsekuensi

### Positif

- aplikasi turunan mempunyai pola cache yang seragam dan tenant-safe;
- tidak ada dependency npm baru;
- gangguan Redis tidak memutus transaksi PostgreSQL;
- deployment dapat mengaktifkan Redis bertahap pada LAN, VPS, atau Coolify;
- rollback cukup dengan menonaktifkan flag/overlay, tanpa rollback database.

### Negatif dan batasan

- setiap modul tetap harus mendokumentasikan TTL, staleness, invalidation, dan metrik hit/miss;
- invalidation lintas instance belum diotomasi;
- Redis Cluster dan Sentinel belum didukung fondasi client awal;
- cache stampede/single-flight belum ditangani;
- cache serialization masih JSON generik dan tidak cocok untuk payload besar atau data sensitif.

## Keamanan dan privasi

- Redis hanya berada di private/internal network atau memakai TLS untuk endpoint managed yang melintasi jaringan tidak tepercaya.
- ACL user dan secret unik per aplikasi/deployment.
- prefix key berbeda per aplikasi turunan.
- payload mengikuti data minimization; data sensitif tidak dicache kecuali issue khusus membuktikan kebutuhan, perlindungan, retensi, dan penghapusan.
- backup Redis tidak diperlakukan sebagai backup authoritative. Backup PostgreSQL dan object storage tetap menjadi recovery source.

## Rollback

Set `REDIS_ENABLED=false`, hapus overlay `docker-compose.redis.yml` dari command deployment, lalu hentikan service Redis. Aplikasi kembali langsung membaca PostgreSQL. Tidak ada migration atau data domain yang perlu di-rollback.
