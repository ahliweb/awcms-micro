---
"awcms-micro": minor
---

Tambah edge cache Varnish opsional dengan eskalasi otomatis (Issue #353,
ADR-0037).

Cache HTTP bersama di depan aplikasi (Traefik → Varnish → aplikasi →
PostgreSQL) yang menghapus pekerjaan database berulang untuk pembaca
anonim. Container-nya opt-in lewat `docker-compose.varnish.yml`; yang
**otomatis** adalah agresivitas cache-nya — aplikasi menaikkan TTL
surrogate sendiri ketika mengukur tekanan database (saturasi work-class
foreground atau circuit breaker tidak `closed`), lalu menurunkannya kembali
dengan histeresis 20 poin dan tahan minimum 30 detik.

Nonaktif secara default: selama `EDGE_CACHE_ENABLED` bukan `true`,
middleware tidak menambah header cache apa pun. Kebijakan cacheability
default-deny (allowlist rute publik, tanpa cookie sesi, tanpa `Set-Cookie`,
status 200 saja), dan aturan lintas-pembaca ditegakkan berlapis di
kebijakan aplikasi, cache key, dan VCL. `stale-if-error` mengubah gangguan
database menjadi halaman agak basi alih-alih 503. Rollback = arahkan proxy
kembali ke port aplikasi.

Perintah baru: `bun run edge-cache:health` dan `bun run edge-cache:purge`.
