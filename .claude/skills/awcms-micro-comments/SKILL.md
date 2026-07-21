---
name: awcms-micro-comments
description: Kerjakan bagian mana pun dari epic comments AWCMS-Micro (Issue #271, epic #261 Wave 2, ADR-0032 — SELESAI) — thread, komentar bounded-depth, moderasi (queue/approve/reject/spam/archive/restore/delete), anti-abuse (honeypot/timing/blocked-terms/duplicate/rate-limit/Turnstile), reply-notify terenkripsi via outbox event, settings per-tenant, retensi/anonymisasi, rute publik + admin UI, atau seam kontribusi commentableResources untuk tipe konten baru. Gunakan saat menambah endpoint/logic ke src/modules/comments, src/pages/api/v1/comments, src/pages/admin/comments, atau src/components/comments, mengubah schema komentar, menyumbang CommentableResourceDescriptor dari modul konten, atau mengerjakan issue susulan. Merangkum keputusan yang sudah dibuat di Issue #271 supaya tidak diulang/dikontradiksi.
---

# AWCMS-Micro — Comments Module

`comments` (`src/modules/comments`) adalah **modul domain Official Optional
Module** (ADR-0032, Issue #271, epic #261 Wave 2) — komentar
**MODERATION-FIRST** atas resource TERBIT & PUBLIK. Admission + runtime pertama
mendarat dalam satu PR (#271), menaikkan registry base **20 → 21** dan
`MODULE_CONTRACT_VERSION` **1.3.0 → 1.4.0**. Modul terdaftar `status: "active"`,
default-OFF, `dependencies: ["tenant_admin", "identity_access"]` saja. Skill ini
merangkum keputusan yang sudah dibuat supaya issue susulan **wajib** memakai
ulang, bukan mendesain ulang — baca `src/modules/comments/README.md` untuk detail
lengkap tiap tabel dan endpoint, dan `docs/awcms-micro/comments.md` untuk
policy/runbook/privacy.

## Kapan pakai skill ini vs skill generik

Skill ini melengkapi (bukan menggantikan) `awcms-micro-new-endpoint`,
`awcms-micro-new-migration`, `awcms-micro-abac-guard`, `awcms-micro-idempotency`,
`awcms-micro-data-lifecycle`, `awcms-micro-testing`, dll. — itu tetap dipakai
untuk cara **membangun** endpoint/migration/guard/test. Skill ini menyediakan
konteks **domain comments spesifik** yang tidak jelas dari sekadar membaca satu
file migration.

## Status per area (jangan bangun ulang yang sudah ada)

| Area                                                      | Status                                                                                                            |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Schema + RLS + permission seed                            | **Selesai** (`sql/089` skema 7 tabel, `sql/090` permission seed)                                                  |
| Contribution seam                                         | **Selesai** (`ModuleDescriptor.commentableResources` + `CommentableResourceDescriptor`, kontrak 1.4.0)            |
| Public API (submit/list/reply/edit/report/delete-request) | **Selesai** (`/api/v1/comments`, lihat README)                                                                    |
| Admin moderation API                                      | **Selesai** (`/admin/queue`, `/admin/{id}/moderate\|archive\|restore`, `/admin/bulk-moderate`, `/admin/settings`) |
| Anti-abuse + timing token + hashing                       | **Selesai** (`domain/anti-abuse.ts`, `timing-token.ts`, `request-hashing.ts`)                                     |
| Reply-notify + subscriber crypto                          | **Selesai** (`application/reply-notifications.ts`, `domain/subscriber-crypto.ts`) — dispatcher email = follow-up  |
| Retensi/anonymisasi job                                   | **Selesai** (`bun run comments:retention`, `application/comment-retention.ts`)                                    |
| Domain events + AsyncAPI                                  | **Selesai** (`awcms-micro.comments.comment.submitted/.approved`, `.reply.created`, v1.0)                          |
| UI publik + admin queue + i18n                            | **Selesai** (`CommentsSection.astro`, `/comments/demo`, `/admin/comments`, en+id, a11y AA)                        |

## Yang sudah ada — pakai ulang, jangan re-derive

- **Tabel** (`sql/089`, semua RLS FORCE + `tenant_id` FK): `awcms_micro_comments_threads` (1 per `(resource_type, resource_id, locale)`, unik), `_comments` (depth 0..4 CHECK, `status pending|approved|rejected|spam|deleted`, body plain-text ≤4000, field penulis minimized), `_moderation_events` (append-only, action `approve|reject|spam|archive|restore|delete|edit`), `_reports` (dedup unik `(comment, reporter_ip_hash, reason)`, `open|reviewed|dismissed`), `_reply_subscriptions` (minimized/encrypted double-opt-in), `_settings` (PK `tenant_id`, CHECK-bounded), `_abuse_events` (telemetry minimized). Worker GRANT eksplisit di akhir `sql/089` (SELECT/UPDATE comments, SELECT/DELETE abuse_events + reply_subscriptions, dll).
- **Permission** (`sql/090`): 8 permission `comments.moderation.{read,approve,reject,archive,restore,delete}` + `comments.settings.{read,update}`. `reject` menggerbangi reject DAN mark-as-spam — **jangan** menciptakan `AccessAction` `spam` baru.
- **Domain** (`src/modules/comments/domain/`): `comment-status.ts` (`applyModerationAction`/`isLegalTransition` — SATU tempat semantik transisi), `comment-policy.ts` (`decideCommentPolicy`, 4 mode), `comment-sanitization.ts` (`normalizeCommentBody`/`escapeHtml`/`isSafeLinkUrl`/`renderCommentHtml` — SECURITY SPINE), `comment-thread.ts` (`resolveReplyDepth`/`buildBoundedThread`, `HARD_MAX_DEPTH=4`), `anti-abuse.ts` (`evaluateAntiAbuse`/`containsBlockedTerm`/`computeContentFingerprint`), `timing-token.ts` (HMAC), `request-hashing.ts` (tenant-salted sha256), `subscriber-crypto.ts` (AES-256-GCM), `comment-settings.ts` (`validateCommentSettings` + bounds + `DEFAULT_COMMENT_SETTINGS`), `commentable-resource-registry.ts` (aggregate + validate + `assertSafeIdentifier`/`assertSafeTableName`), `comment-events.ts`, `comments-permissions.ts`. **Panggil fungsi-fungsi ini**, jangan tulis ulang regex/aturan yang sama di handler.
- **Application** (`src/modules/comments/application/`): `comment-service.ts` (submit/list/edit/report/delete-request publik), `comment-moderation.ts` (queue + `moderateComment`/`bulkModerateComments`), `commentable-resource-engine.ts` (`resolvePublishedCommentableResource` — publication-check ber-parameter), `comment-thread-directory.ts` (`getOrCreateThread` + counters), `comment-settings-directory.ts`, `reply-notifications.ts` (`createReplySubscription` + `appendCommentEvent` address-free), `comment-retention.ts` (`anonymizeAgedComments` + `purgeUnconfirmedReplySubscriptions`), `author-resolution.ts` (`resolveOptionalRegisteredAuthor`), `public-comments-tenant-resolution.ts`.
- **Metrics** (`src/lib/observability/metrics-port.ts`): `comments_submissions_total`, `comments_moderation_total`, `comments_abuse_blocks_total`, `comments_reports_total`.

## Aturan lintas-issue yang wajib diikuti

1. **Store-plaintext, escape-on-render (SECURITY SPINE)** — body disimpan raw plain text (`body_format='plain'`, CHECK). Rendering publik SELALU lewat `renderCommentHtml` (escape SETIAP karakter, hanya autolink http(s) polos dengan `rel="nofollow ugc noopener noreferrer"`, `<br>` untuk newline). **Jangan** pernah menyimpan HTML, menambah tag ke whitelist render, atau `set:html` body mentah. `javascript:`/`data:`/`vbscript:`/`file:`/relative tak pernah jadi live link.
2. **Publication-state di boundary resource→thread** — komentar HANYA diterima/ditampilkan terhadap resource yang lolos `publicationFilter` descriptor (via `resolvePublishedCommentableResource`, query ber-parameter, nilai bound, identifier tervalidasi). Permukaan komentar **bukan** sumber otorisasi. Jangan lewati gate ini di endpoint baru.
3. **Contribution seam descriptor-list, BUKAN capability `provides`** — modul konten menyumbang `CommentableResourceDescriptor` di `commentableResources` `module.ts`-nya sendiri; `comments` mengagregasi lewat `listModules()`. >1 penyedia capability = `capability_provider_conflict`. `ownerModuleKey` WAJIB = key modul pendeklarasi; key + `(tableName, resourceType)` unik. Descriptor DATA MURNI — tak ada extractor/SQL. Modul konten menyumbang lewat `commentableResources` di `module.ts`-nya (teragregasi via `listModules()`), tanpa tulis ke tabel `comments`.
4. **State machine adalah otoritas transisi** — semua approve/reject/spam/archive/restore/delete lewat `applyModerationAction` (`comment-status.ts`). `archive` = approved→`rejected` dengan reserved reason `archived` (bukan status enum baru). `deleted` terminal. Jangan tulis `UPDATE ... SET status` liar di handler; transisi ilegal wajib ditolak.
5. **Moderation-first** — setiap submission diterima mulai `pending` secara default; anonymous SELALU `pending` apa pun `require_moderation`. Registered auto-approve HANYA saat tenant matikan `require_moderation` di thread `authenticated-only`/`moderated-registered`. Jangan longgarkan default ini.
6. **Public list = approved-only, TANPA moderation metadata** — `listApprovedComments` mengembalikan hanya `approved` non-deleted, tanpa reason/actor/hash. Metadata moderasi HANYA di `/admin/queue`. Jangan bocorkan field admin ke response publik.
7. **Minimisasi PII penulis** — email tak pernah raw: `author_email_hash` (sha256 via `profile-identity`'s `hashIdentifier`) + `author_email_masked` (`maskIdentifier`, `j***@e***`). ip/ua lewat `hashRequestSignal` (tenant-salted). Recipient reply-notify AES-256-GCM (`subscriber-crypto.ts`) atau sentinel `unresolvable`. **Jangan** simpan/return/log alamat mentah, dan **jangan** taruh alamat di payload event.
8. **Event address-free lewat outbox** — `appendCommentEvent` (`appendDomainEvent`, same-commit, ADR-0006) payload hanya id + resourceType/url + status. Dispatcher email me-resolve recipient terenkripsi di send time DI LUAR tx. Kalau menambah event, update AsyncAPI + `event-type-registry.ts` + `module.ts events.publishes` (divalidasi `api:spec:check`). Turnstile/email = provider opsional (ADR-0006), no-op tanpa config.
9. **Anti-abuse server-side** — honeypot (`website`), timing floor (HMAC `timing-token.ts` — jangan percaya angka klien), blocked-terms (substring case-insensitive), duplicate fingerprint (sha256 body+author, window 600s), rate limit per-IP, link/length bounds. Setiap block tulis SATU `abuse_events` row (hash+reason) + increment `comments_abuse_blocks_total`. Jangan pindahkan verifikasi Turnstile ke dalam tx DB.
10. **Idempotency + audit high-risk** — approve/restore/delete/settings-update wajib `Idempotency-Key` + audit dengan reason code (skill `awcms-micro-idempotency`/`awcms-micro-audit-log`). ABAC default-deny di setiap endpoint admin (skill `awcms-micro-abac-guard`). `reject` menggerbangi reject+spam.
11. **Retensi = anonymize-in-place honor legal hold** — `comments:retention` NULL identitas penulis pada komentar tua (tahan baris+body+history), hapus subscription tak terkonfirmasi. SKIP tenant di bawah legal hold aktif pada `comments.comments` (delegated descriptor). `abuse_events` + `reply_subscriptions` di-purge engine generik `data_lifecycle` (worker role). Jangan tambah hard-delete komentar.
12. **Depth bounded 0..4** — `resolveReplyDepth` (min tenant `max_depth` + `HARD_MAX_DEPTH=4`), DB CHECK `depth BETWEEN 0 AND 4`. `max_depth` setting boleh menyempitkan (0..8 di DB, tapi runtime dibatasi 4), tak pernah melampaui 4. Reply melebihi = tolak `depth_exceeded`.

## Belum ada — jangan asumsikan sudah dikerjakan

Epic #271 selesai, tapi beberapa hal **di luar scope secara sengaja** — jangan
asumsikan sudah dikerjakan:

- **Dispatcher email reply-notify** — event `reply.created` address-free sudah diterbitkan, subscription tersimpan terenkripsi, tapi consumer yang benar-benar mengirim email adalah follow-up terdokumentasi (belum ada).
- **Verifikasi Turnstile nyata** — seam provider tipis (`turnstile_enabled` setting), no-op tanpa `COMMENTS_TURNSTILE_*` config; belum ada adapter provider nyata.
- **Tipe commentable resource selain `blog_post`** — blog pages (tak ada rute publik), media/gallery — seam descriptor sudah mendukung, tapi belum ada descriptor kedua.
- **Override policy per-tipe-resource** — policy mode saat ini per-tenant (settings) + default per-descriptor; belum ada override per tipe.
- **UI notifikasi/subscription self-service pengunjung** yang lebih kaya (kelola/lihat subscription) — hanya opt-in double-opt-in + unsubscribe token yang ada.

`src/modules/comments/README.md` §Deferred dan `docs/awcms-micro/comments.md`
berisi detail lengkap tiap item.
