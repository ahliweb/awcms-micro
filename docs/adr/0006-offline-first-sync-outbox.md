# ADR-0006 — Offline-first + transactional outbox + sync HMAC

- **Status:** Accepted (diamandemen dalam scope oleh ADR-0027)
- **Tanggal:** 2026-07-05
- **Terkait:** ADR-0025 §2, ADR-0027 (profil deployment full-online), `docs/awcms-micro/15_frontend_architecture_integration.md`, `docs/awcms-micro/16_backend_data_access_integration.md`, `docs/awcms-micro/10_template_kode_coding_standard.md` (§Sync HMAC)

> **Amandemen scope (ADR-0027, 2026-07-19).** AWCMS-Micro adalah platform **website online penuh** (ADR-0025). Yang **dipertahankan** dari ADR ini di repo turunan: pola **transactional outbox** (event/pesan provider/upload objek ditulis dalam transaksi lalu dikirim worker terpisah; provider tidak pernah dipanggil di dalam transaksi DB) dan **sync HMAC + anti-replay** sebagai infrastruktur. Yang **ditarik** untuk base ini: klaim **offline-first / LAN-first sebagai mode operasi** — website base tidak punya kapabilitas offline yang terimplementasi/teruji. `sync_storage` di sini = **object queue/outbox untuk unggah media**, bukan sinkronisasi data bisnis offline node-to-node (ADR-0025 §2). Konteks "aplikasi turunan dapat berjalan di lingkungan LAN/offline" di bawah tetap berlaku untuk **aplikasi turunan** yang menambah modulnya sendiri, bukan untuk website base.

## Konteks

Aplikasi turunan dapat berjalan di lingkungan LAN/offline. Alur operasional kritikal tidak boleh bergantung pada koneksi internet atau provider eksternal. Sinkronisasi antar-node dan pemanggilan provider harus andal tanpa mengorbankan konsistensi database.

## Keputusan

Kami memutuskan pola **offline-first**:

- **Transactional outbox** — domain event, pesan provider, dan payload sync ditulis dalam transaksi yang sama dengan perubahan data, lalu dikirim worker terpisah. Provider eksternal **tidak pernah** dipanggil di dalam DB transaction.
- **Sync HMAC** — push/pull antar-node ditandatangani `HMAC(timestamp.body)` dengan anti-replay (skew maks default 300 detik, timing-safe compare) dan idempotency (event duplikat aman).
- **Conflict manual** — konflik tidak diselesaikan otomatis; ditandai untuk resolusi manual + audit.

## Konsekuensi

- **Positif:** alur kritikal tahan gangguan koneksi; konsistensi DB terjaga; sync aman dari replay/duplikasi.
- **Trade-off:** perlu worker dispatcher, tabel outbox, dan mekanisme resolusi konflik.
- **Netral:** provider (R2, pesan) bersifat opsional via feature flag; fitur off tidak menghentikan aplikasi.

## Alternatif yang dipertimbangkan

- **Pemanggilan provider langsung di request/transaction** — ditolak: menautkan alur kritikal ke ketersediaan eksternal dan berisiko partial commit.
- **Auto-merge konflik** — ditolak: berisiko kehilangan/menimpa data tanpa jejak.
