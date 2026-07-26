---
"awcms-micro": minor
---

`bun run bootstrap:default-tenant` — satu perintah agar development, staging,
dan production berangkat dari tenant default dan owner akses-penuh yang sama.

Audit ketiga fase menemukan mereka cocok hanya karena kebetulan: production
punya tenant `default` + `admin@ahlikoding.com`, staging punya `staging` +
`owner@staging.ahlikoding.com`, dan development tidak punya jalur seed sama
sekali — instance lokal seorang developer adalah apa pun yang dia ketik di
setup wizard. Bagian akses penuh tidak pernah berisiko (bootstrap memberi role
owner **seluruh baris** `awcms_micro_permissions`, jadi permission baru ikut
otomatis), tapi identitas dan kode tenant murni konvensi. Perintah ini
mengubah konvensi itu menjadi sesuatu yang dijalankan dan diperiksa.

Idempoten dan tidak merusak secara default:

- database kosong → memakai composition root yang **sama** dengan setup wizard
  (`bootstrapPlatformTenant`), jadi hanya ada satu jalur kode yang bisa
  membuat tenant/owner, bukan implementasi kedua yang bisa menyimpang;
- sudah sesuai → melapor, tidak mengubah apa pun;
- owner yang diharapkan tidak ada → dilaporkan; dengan `--repair` identitas itu
  ditambahkan dan diberi role owner akses-penuh (owner lama tidak diganti);
- role kurang permission (mis. setelah migration menambah permission baru) →
  ditambal dengan `--repair`;
- **kode tenant berbeda → dilaporkan, tidak pernah ditulis ulang.** Kode tenant
  muncul di URL publik (`/blog/{tenantCode}`, ADR-0009), jadi mengubahnya
  adalah keputusan routing milik operator, bukan efek samping perintah
  bootstrap. Jalur ini tetap read-only bahkan dengan `--repair`.

Password dibaca **hanya** dari `BOOTSTRAP_OWNER_PASSWORD`, tidak pernah dari
flag CLI — flag terlihat di daftar proses oleh proses lokal mana pun.

Tabel keputusannya diuji unit (7 kasus, termasuk dua jalur yang wajib menolak
menulis) dan perilaku SQL-nya diuji integrasi terhadap PostgreSQL sungguhan
dengan menjalankan CLI-nya sebagai proses nyata, sehingga exit code yang
dibaca operator/pipeline ikut jadi bagian assertion.
