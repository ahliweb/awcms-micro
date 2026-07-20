---
"awcms-micro": minor
---

Tambahkan fondasi Redis opsional berbasis `RedisClient` native Bun untuk kesiapan skala AWCMS-Micro: konfigurasi tervalidasi, namespace key tenant-aware, helper JSON cache-aside dengan TTL dan fail-open, pemeriksaan health yang meredaksi kredensial, overlay Docker Compose hardened tanpa port publik, unit test, ADR, serta panduan operasional. PostgreSQL tetap menjadi sumber data authoritative dan Redis tetap nonaktif secara default.
