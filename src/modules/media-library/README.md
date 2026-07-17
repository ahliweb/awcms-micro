# Media Library

Modul **System Foundation** (lapisan ADR-0013 #2) — registry objek media
tenant-scoped dan alur unggahnya, dipakai ulang oleh setiap modul website.

> **Status: `active` — modul ini MEMILIKI registry media dan kapabilitasnya**
> (ADR-0026 langkah 2–4). Registry, alur presigned upload/finalize/cancel, MIME
> sniffing, object key, R2 config/client, verifikasi, rekonsiliasi, 9 permission
> (`media_library.media.*`, `sql/077`), dan port `media_library`
> (`_shared/ports/media-library-port.ts` + adaptornya di sini) semuanya ada di sini.
> Jangan menambahkan tabel/route media baru di `news_portal`. Keputusan lengkap:
> [ADR-0026](../../../docs/adr/0026-media-library-module-admission.md).
>
> **Penegakan media punya tombolnya sendiri** (langkah 5a):
> `GET`/`POST /api/v1/media/enforcement`, permission
> `media_library.enforcement.read`/`.enable` (`sql/079`). Situs brosur tak lagi
> butuh portal berita — tidak untuk kapabilitasnya, tidak untuk menyalakannya.
>
> **Penegakan itu SATU ARAH dan harus tetap begitu.** Tidak ada `disable`, tidak
> ada "unmark", tidak ada DELETE ke `awcms_micro_media_library_tenant_state`.
> Itu properti keamanan (header `sql/043`: desain lama terbukti dieksploitasi
> karena tenant bisa mematikan validasinya sendiri), bukan API setengah jadi —
> jangan "lengkapi demi simetri". Empat guard menjaganya.

## Kenapa modul ini ada

Registry media **sudah ada dan sudah generik** — `awcms_micro_news_media_objects`
(`sql/041`) punya kolom `module_key text NOT NULL DEFAULT 'news_portal'` plus
`owner_resource_type`/`owner_resource_id`. Kolom itu tidak punya alasan untuk ada
kecuali tabelnya memang dirancang melayani lebih dari satu modul. Ia lengkap:
presigned upload langsung ke R2, verifikasi magic-byte + checksum, lifecycle
orphan (`sql/046`), job rekonsiliasi, dan capability port yang sudah dikonsumsi
`blog_content` + `social_publishing`.

Masalahnya bukan penamaan, melainkan **konsekuensi produk**. Gate media
`blog_content` (`application/news-media-reference-gate.ts`) hanya aktif saat mode
R2-only menyala — dan mode itu milik `news_portal`. Akibatnya:

> Tenant yang menjalankan situs brosur (`blog_content` + `tenant_domain`, tanpa
> portal berita) **tidak punya media terkelola sama sekali** — hanya bisa menempel
> URL mentah. Preset `online_website` hari ini secara harfiah adalah website tanpa
> manajemen media.

Mengunggah logo tidak boleh menuntut penyalaan modul **portal berita**. Karena itu
ADR-0026 memutuskan **membalik arah kepemilikan** lewat ekstraksi — bukan membangun
modul media kedua yang akan menduplikasi tabel, alur presigned, gate R2, lifecycle
orphan, dan job rekonsiliasi, lalu meninggalkan dua sumber kebenaran.

Ini pola yang sama dengan **generic idempotency store** (ADR-0025 §3): infrastruktur
bersama yang lahir di dalam modul yang epic-nya kebetulan pertama membutuhkannya.

### Kenapa adaptornya sempat tertinggal di `news_portal` (langkah 2 → 3–4)

Langkah 2 sengaja meninggalkan `news-media-port-adapter.ts` di `news_portal`: ia
mengomposisikan registry modul ini dengan kebijakan editorial R2-only milik
`news_portal`, jadi memindahkannya begitu saja akan membuat `media_library`
mengimpor `news_portal` — inversi ADR-0013 §1 yang justru ingin dihapus ekstraksi
ini. Percobaan memindahkannya langsung ditangkap typecheck.

Langkah 3–4 menemukan **akar sebenarnya**: koplingnya ada di **kontrak port**, bukan
di letak adaptornya. `NewsMediaPort` membawa `isFullOnlineR2ModeActiveForTenant` —
pertanyaan `news_portal`, bukan pertanyaan media. Selama method itu ada di kontrak,
port media wajib menjawab pertanyaan portal berita, dan memindahkan adaptor mustahil.

Karena itu langkah 3 dan 4 dikerjakan **sebagai satu langkah**: kontraknya dipecah
lebih dulu (media menjawab "apakah referensi harus berbasis registry?", `news_portal`
menyimpan presetnya sendiri), baru konsumennya di-rewire. Port lama + adaptornya
dihapus; `news_media` dipensiunkan. Detail dan pelajarannya ada di
[ADR-0026 §Konsekuensi](../../../docs/adr/0026-media-library-module-admission.md).

### Bukti tambahan: pengecualian batas yang hanya ada karena salah tempat

Audit impor lintas-modul (dijalankan saat menyiapkan langkah 2) menemukan
`social-publishing/infrastructure/linkedin-provider-adapter.ts` mengimpor
`news-portal/domain/news-media-r2-config` **secara langsung**, padahal `news_portal`
bukan `dependencies` terdeklarasi `social_publishing`.

Ini **bukan pelanggaran liar** — impornya sengaja dan terdokumentasi di file itu
("narrow, documented cross-module import of a single pure config getter... no DB
access, no side effects"), mengikuti preseden yang sudah ada. Jadi jangan
diperlakukan sebagai bug.

Yang penting: **pengecualian itu hanya perlu ada karena konfigurasinya salah tempat.**
`resolveNewsMediaR2Config` adalah konfigurasi _media_, tapi ia hidup di modul _portal
berita_ — sehingga modul mana pun yang butuh media terpaksa meminta pengecualian batas
untuk menjangkaunya. Setelah langkah 2, config itu milik `media_library` (System
Foundation), dan impornya menjadi jenis panggilan infrastruktur yang memang disanksi
repo ini — sama seperti ~10 modul yang memanggil `logging` langsung tanpa port
(lihat header `domain-event-runtime/infrastructure/consumer-registry.ts`).

Catatan gate: `tests/unit/module-boundary.test.ts` hanya memindai pasangan
`blog_content` ↔ `news_portal`, jadi ia tidak melihat tepi ini sama sekali. Itu
disengaja di upstream (pasangan itulah yang pernah menumbuhkan siklus), tapi artinya
audit batas lintas-modul di repo ini masih manual — pertimbangkan memperluas cakupannya
saat langkah 2/3 selesai dan peta impor media sudah stabil.

## Rencana bertahap (ADR-0026 §Konsekuensi)

Setiap langkah mendarat dengan `bun run check` hijau — ini menyentuh empat modul
dan tiga migrasi, jadi **bukan satu commit raksasa**.

| #   | Langkah                                                                                      | Status      |
| --- | -------------------------------------------------------------------------------------------- | ----------- |
| 1   | Daftarkan modul ini (`experimental`, tanpa kode)                                             | **selesai** |
| 2   | Pindahkan registry/directory/upload-session ke sini + kepemilikan permission (`sql/077`)     | **selesai** |
| 3+4 | Pecah kontrak port, rewire konsumen, pensiunkan `news_media`, lepas gate R2-only (`sql/078`) | **selesai** |
| 5a  | Endpoint penyalaan enforcement (`/api/v1/media/enforcement`, `sql/079`) — satu arah          | **selesai** |
| 5b  | Varian gambar/`srcset`                                                                       | belum       |
| 5c  | Tipe media non-gambar                                                                        | belum       |
| 5d  | Admin media browser                                                                          | belum       |

Langkah 3 dan 4 direncanakan terpisah tapi **dikerjakan sebagai satu** — koplingnya
ada di kontrak port, sehingga langkah 3 sendirian hanya akan mengganti nama tanpa
membalik apa pun. Alasan lengkapnya di ADR-0026 §Konsekuensi.

Langkah 5a melunasi utang yang dicatat langkah 3–4 (kapabilitas ada, tombol tidak),
dan menaati peringatannya: flag TIDAK diekspos lewat `awcms_micro_module_settings`,
melainkan lewat endpoint terdedikasi dengan activity code terpisah (`enforcement`,
bukan `media` — beda radius ledakan) yang hanya bisa menyalakan.

## Batas scope

Modul ini **tidak pernah**:

- Memproses/mentranskode byte di dalam transaksi DB (ADR-0006) — pembuatan varian
  mengikuti pola CLAIM/UPLOAD/FINALIZE 3-fase milik object queue `sync_storage`,
  bukan pekerjaan sinkron di jalur request.
- Menjadi CDN, image proxy, atau DAM (tagging/kolaborasi/versioning aset).
- Mengunci satu provider — `storage_driver` sudah kolom; R2 driver pertama, bukan
  satu-satunya.
- Menulis ke tabel modul lain — kolaborasi hanya lewat capability port
  (ADR-0011, ADR-0013 §6).

## Catatan penamaan tabel

Tabel **tidak akan di-rename** jadi `awcms_micro_media_objects`, meski namanya kini
keliru menyebut pemilik (ADR-0026 §3, alasan sama dengan gap penomoran migrasi
ADR-0025 §4): namanya dirujuk `sql/041`/`042`/`046`, seluruh application layer, dan
puluhan komentar. Me-rename-nya menukar ketidaknyamanan kosmetik dengan risiko nyata
dan diff yang tak terbaca. `module_key` sudah menjadi pembeda pemilik sesungguhnya.
