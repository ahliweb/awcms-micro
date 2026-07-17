# GitHub Issues Closed 001

| Metadata           | Nilai                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Repository         | `ahliweb/awcms-micro`                                                                                                                    |
| Snapshot           | 2026-07-17T02:26:02.042Z                                                                                                                 |
| State              | `CLOSED`                                                                                                                                 |
| File page          | 1/1                                                                                                                                      |
| Max issue per file | 100                                                                                                                                      |
| Issue dalam file   | 177                                                                                                                                      |
| Range              | #371-#454 (#409-#432, #439-#446, #448-#449, #455-#460 adalah nomor PR, bukan issue — issue/PR berbagi satu urutan nomor per repo GitHub) |

> File ini adalah snapshot dari GitHub. Refresh dengan proses di `docs/awcms-micro/github/README.md` bila state issue berubah.

Baris #371-#408 (38 issue) adalah backlog doc06 original — lihat narasi lengkap di bawah tabel dan di `docs/awcms-micro/github/README.md`. Baris #433-#454 (12 issue) adalah epic M9 + issue pasca-analisis lanjutan, **di luar** backlog doc06 — ringkasan singkat di bawah, detail lengkap di `CHANGELOG.md` dan `docs/awcms-micro/AUDIT_STANDAR_PENGEMBANGAN_2026-07-04.md` §Perawatan pasca-backlog.

Seluruh issue di bawah ditutup dengan reason `not planned` pada 2026-07-04: kontennya spesifik domain POS/retail (katalog, stok, checkout, warehouse, pajak/Coretax, CRM receipt, AI business analyst) yang tidak sesuai konteks AWCMS-Micro sebagai contoh repo pengembangan umum. Konten dipindahkan ke aplikasi turunan contoh (mis. AWPOS), bukan dihapus riwayatnya.

Issue [#371](https://github.com/ahliweb/awcms-micro/issues/371), [#372](https://github.com/ahliweb/awcms-micro/issues/372), dan [#373](https://github.com/ahliweb/awcms-micro/issues/373) ditutup dengan reason `completed` pada 2026-07-05 setelah foundation skeleton Issue 0.1, migration runner Issue 0.2, dan API contract baseline Issue 0.3 merge. Issue [#376](https://github.com/ahliweb/awcms-micro/issues/376), [#377](https://github.com/ahliweb/awcms-micro/issues/377), [#378](https://github.com/ahliweb/awcms-micro/issues/378), dan [#379](https://github.com/ahliweb/awcms-micro/issues/379) ditutup dengan reason `completed` setelah tenant/office (2.1), central profile (2.2), identity login (2.3), dan RBAC/ABAC (2.4) schema merge — epic M2 tuntas. Issue [#407](https://github.com/ahliweb/awcms-micro/issues/407) ditutup dengan reason `completed` setelah setup wizard (12.1) merge. Issue [#391](https://github.com/ahliweb/awcms-micro/issues/391), [#392](https://github.com/ahliweb/awcms-micro/issues/392), dan [#393](https://github.com/ahliweb/awcms-micro/issues/393) ditutup dengan reason `completed` setelah sync outbox/inbox (6.1), sync conflict tracking/resolution (6.2), dan R2 object sync queue (6.3) merge — epic M5 tuntas. Issue [#398](https://github.com/ahliweb/awcms-micro/issues/398) dan [#401](https://github.com/ahliweb/awcms-micro/issues/401) ditutup dengan reason `completed` setelah admin layout shell (8.1) dan management reporting views (9.1) merge — epic M7 tuntas. Karena M5 dan M7 kini sama-sama tuntas, label `#403`/`#404`/`#405`/`#406`/`#408` (M8) `status:blocked` → `status:ready` (lihat doc 06 §Ketergantungan milestone: M8 butuh M5 **dan** M7). Issue [#403](https://github.com/ahliweb/awcms-micro/issues/403) ditutup dengan reason `completed` setelah structured logging & audit trail (10.1) merge — issue pertama epic M8. Issue [#404](https://github.com/ahliweb/awcms-micro/issues/404) ditutup dengan reason `completed` setelah database connection pooling & backpressure (10.2) merge. Issue [#405](https://github.com/ahliweb/awcms-micro/issues/405) ditutup dengan reason `completed` setelah production security readiness checklist (10.3) merge. Issue [#406](https://github.com/ahliweb/awcms-micro/issues/406) ditutup dengan reason `completed` setelah workflow approval engine (11.1) merge. Issue [#408](https://github.com/ahliweb/awcms-micro/issues/408) ditutup dengan reason `completed` setelah offline/LAN deployment profile (12.2) merge — **issue terakhir dari seluruh 18 issue backlog base generik**, epic M8 dan seluruh backlog kini tuntas.

|                                                         # | Judul                                                              | Milestone (saat dibuat)                |
| --------------------------------------------------------: | ------------------------------------------------------------------ | -------------------------------------- |
| [#371](https://github.com/ahliweb/awcms-micro/issues/371) | 0.1 — Initialize AWCMS-Micro Modular Monolith Repository Structure | M0 — Repository Foundation             |
| [#372](https://github.com/ahliweb/awcms-micro/issues/372) | 0.2 — Add SQL Migration Runner                                     | M0 — Repository Foundation             |
| [#373](https://github.com/ahliweb/awcms-micro/issues/373) | 0.3 — Add OpenAPI and AsyncAPI Baseline                            | M0 — Repository Foundation             |
| [#374](https://github.com/ahliweb/awcms-micro/issues/374) | 1.1 — Add Legacy Migration Toolkit Schema                          | -                                      |
| [#375](https://github.com/ahliweb/awcms-micro/issues/375) | 1.2 — Add Legacy Migration Dry-Run Service                         | -                                      |
| [#376](https://github.com/ahliweb/awcms-micro/issues/376) | 2.1 — Add Tenant and Office Schema                                 | M2 — Identity, Tenant, Profile         |
| [#377](https://github.com/ahliweb/awcms-micro/issues/377) | 2.2 — Add Central Profile Schema                                   | M2 — Identity, Tenant, Profile         |
| [#378](https://github.com/ahliweb/awcms-micro/issues/378) | 2.3 — Add Identity Login and Tenant User Membership                | M2 — Identity, Tenant, Profile         |
| [#379](https://github.com/ahliweb/awcms-micro/issues/379) | 2.4 — Add RBAC and ABAC Access Control                             | M2 — Identity, Tenant, Profile         |
| [#380](https://github.com/ahliweb/awcms-micro/issues/380) | 3.1 — Add Product Catalog MVP                                      | -                                      |
| [#381](https://github.com/ahliweb/awcms-micro/issues/381) | 3.2 — Add Stock Balance and Stock Movement MVP                     | -                                      |
| [#382](https://github.com/ahliweb/awcms-micro/issues/382) | 3.3 — Add Checkout Session and Cart                                | -                                      |
| [#383](https://github.com/ahliweb/awcms-micro/issues/383) | 3.4 — Add Idempotent Atomic Transaction Posting                    | -                                      |
| [#384](https://github.com/ahliweb/awcms-micro/issues/384) | 4.1 — Add Warehouse Zone and Bin Schema                            | -                                      |
| [#385](https://github.com/ahliweb/awcms-micro/issues/385) | 4.2 — Add Inventory Lot, Batch, Serial, and Expired Date           | -                                      |
| [#386](https://github.com/ahliweb/awcms-micro/issues/386) | 4.3 — Add Warehouse Transfer Order Workflow                        | -                                      |
| [#387](https://github.com/ahliweb/awcms-micro/issues/387) | 4.4 — Add Cycle Count and Stock Adjustment Request                 | -                                      |
| [#388](https://github.com/ahliweb/awcms-micro/issues/388) | 5.1 — Add PDF Receipt Generator                                    | M5 — Sync Storage                      |
| [#389](https://github.com/ahliweb/awcms-micro/issues/389) | 5.2 — Add StarSender WhatsApp Receipt Delivery                     | M5 — Sync Storage                      |
| [#390](https://github.com/ahliweb/awcms-micro/issues/390) | 5.3 — Add Mailketing Email Receipt Delivery                        | M5 — Sync Storage                      |
| [#391](https://github.com/ahliweb/awcms-micro/issues/391) | 6.1 — Add Sync Outbox and Inbox                                    | M5 — Sync Storage                      |
| [#392](https://github.com/ahliweb/awcms-micro/issues/392) | 6.2 — Add Sync Conflict Tracking and Resolution                    | M5 — Sync Storage                      |
| [#393](https://github.com/ahliweb/awcms-micro/issues/393) | 6.3 — Add R2 Object Sync Queue                                     | M5 — Sync Storage                      |
| [#394](https://github.com/ahliweb/awcms-micro/issues/394) | 7.1 — Add Tenant Tax Profile and Tax Business Unit                 | -                                      |
| [#395](https://github.com/ahliweb/awcms-micro/issues/395) | 7.2 — Add Party and Product Tax Profiles                           | -                                      |
| [#396](https://github.com/ahliweb/awcms-micro/issues/396) | 7.3 — Add VAT Invoice Staging from Sales Document                  | -                                      |
| [#397](https://github.com/ahliweb/awcms-micro/issues/397) | 7.4 — Add Coretax XML Batch Export                                 | -                                      |
| [#398](https://github.com/ahliweb/awcms-micro/issues/398) | 8.1 — Build Admin Layout Shell                                     | M7 — UI/UX & Reporting                 |
| [#399](https://github.com/ahliweb/awcms-micro/issues/399) | 8.2 — Build Cashier POS Fullscreen UI                              | M7 — UI/UX & Reporting                 |
| [#400](https://github.com/ahliweb/awcms-micro/issues/400) | 8.3 — Build Customer Receipt Portal                                | M7 — UI/UX & Reporting                 |
| [#401](https://github.com/ahliweb/awcms-micro/issues/401) | 9.1 — Add Management Reporting Views                               | M7 — UI/UX & Reporting                 |
| [#402](https://github.com/ahliweb/awcms-micro/issues/402) | 9.2 — Add AI Business Analyst Safe Views and Tools                 | M7 — UI/UX & Reporting                 |
| [#403](https://github.com/ahliweb/awcms-micro/issues/403) | 10.1 — Add Structured Logging and Audit Trail                      | M8 — Security, Performance, Production |
| [#404](https://github.com/ahliweb/awcms-micro/issues/404) | 10.2 — Add Database Connection Pooling and Backpressure            | M8 — Security, Performance, Production |
| [#405](https://github.com/ahliweb/awcms-micro/issues/405) | 10.3 — Add Production Security Readiness Checklist                 | M8 — Security, Performance, Production |
| [#406](https://github.com/ahliweb/awcms-micro/issues/406) | 11.1 — Add Workflow Approval Engine                                | M8 — Security, Performance, Production |
| [#407](https://github.com/ahliweb/awcms-micro/issues/407) | 12.1 — Add Initial Setup Wizard API                                | M0 — Repository Foundation             |
| [#408](https://github.com/ahliweb/awcms-micro/issues/408) | 12.2 — Add Offline/LAN Deployment Profile                          | M8 — Security, Performance, Production |

## Epic M9 + issue pasca-analisis lanjutan (di luar backlog doc06)

Ditutup `completed` pada 2026-07-06 s.d. 2026-07-07, setelah seluruh 18 issue backlog doc06 di atas tuntas. Ringkasan per issue ada di `docs/awcms-micro/github/README.md` §Epic M9/§Issue pasca-analisis #450-#454/§Issue pasca-analisis #461-#465, #473, #475; detail teknis lengkap di `CHANGELOG.md` (versi 0.23.0-0.23.5) dan `docs/awcms-micro/AUDIT_STANDAR_PENGEMBANGAN_2026-07-04.md` §Perawatan pasca-backlog.

<!-- github-snapshot:closed-issues-post-doc06:start -->

|   # | Judul | Milestone (saat dibuat) |
| --: | ----- | ----------------------- |

<!-- github-snapshot:closed-issues-post-doc06:end -->
<!-- Regenerated by `bun run github:snapshot:refresh` (Issue #464) between the
     markers above — grows as more post-doc06 issues close. Everything else
     in this file (the doc06 table above, all prose) is preserved verbatim. -->
