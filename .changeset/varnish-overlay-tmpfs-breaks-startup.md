---
"awcms-micro": patch
---

Perbaiki `docker-compose.varnish.yml` yang tidak bisa start (Issue #353).

Overlay itu memasang `tmpfs: /var/lib/varnish`. Varnish berjalan sebagai
pengguna non-root dan tidak dapat membuat direktori kerjanya sendiri di
dalam tmpfs yang baru dipasang, sehingga container crash-loop dengan
`Cannot create working directory '/var/lib/varnish/varnishd': Permission
denied`. Baris itu dihapus — direktori bawaan image sudah berkepemilikan
benar. `cap_drop: [ALL]` diverifikasi tetap aman dan dipertahankan.

Ditemukan saat memasang overlay ini pada instance staging sungguhan, bukan
lewat pembacaan ulang.
