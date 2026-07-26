---
"awcms-micro": patch
---

Buang penggambaran "LAN-first/offline" yang sudah usang dari stack default dan
resolver tenant publik (komentar saja — tidak ada perubahan perilaku).

Ditemukan lewat graphify: graf pengetahuan repo memunculkan tautan mengejutkan
antara `docker-compose.yml (LAN-first single-server stack)` dan
`getWorkerDatabaseClient()`, dan label itulah yang salah — bukan tautannya.
`docker-compose.yml` masih menyebut dirinya "LAN-first single-server stack"
dan mengutip **`doc 18 §Topologi deployment LAN-first`**, judul yang sudah
tidak ada; doc 18 sekarang berjudul §Topologi deployment **full-online
single-host**. Jadi rujukan silangnya menggantung sekaligus salah arah.

ADR-0027 menetapkan tiga profil operasi (`development`,
`full_online_single_host`, `full_online_production`) dan ADR-0034 menegaskan
repo ini template website **full-online** yang dipakai langsung. Label
`offline-lan` hanya bertahan sebagai penanda applicability untuk aplikasi
turunan, bukan mode operasi repo ini.

Yang diperbaiki: header `docker-compose.yml` + empat penyebutan di dalamnya,
satu rujukan di `docker-compose.prod.yml`, dan alasan pada
`public-tenant-resolver.ts` — komentarnya membenarkan routing `tenantCode`
dengan "default LAN-first/offline" yang sudah dihapus ADR-0027/0034. Pilihan
routingnya sendiri tetap benar dan kini dijelaskan dengan alasan yang masih
berlaku: resolusi berbasis host bersifat **opt-in**
(`PUBLIC_TENANT_RESOLUTION_MODE=host_default` + `awcms_micro_tenant_domains`),
sedangkan bentuk path adalah fallback yang selalu bekerja.
