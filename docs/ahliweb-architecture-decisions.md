# Keputusan Arsitektur AhliWeb (ADR) — Berlaku untuk AWCMS-Micro

**Tujuan:** Ringkasan kanonik keputusan arsitektur product-line AWCMS (ADR-013…023) dengan **kolom keberlakuan per produk**, sehingga repo ini selaras dengan keputusan terbaru. **Source of truth** = repo `personal-coding`.

> **FOKUS REPO INI (AWCMS-Micro):** **EmDash-based** (adopsi 100% upstream `emdash-cms/emdash`, tanpa fork core) di **Cloudflare D1 + R2**; hanya plugin & template ber-standar AWCMS-Micro. **Inilah satu-satunya produk yang memakai full EmDash** (ADR-020). Toolchain mengikuti EmDash/Cloudflare — **Bun tidak dipaksakan** (ADR-019). Data `highly_restricted` (mis. SIKESRA) **bukan** beban Micro/D1 → naik ke AWCMS-Mini (ADR-016).

---

## Document Control

| Field | Value |
|---|---|
| Status | Referensi (mirror dari personal-coding) |
| Source of truth | `ahliweb/personal-coding` |
| Berlaku untuk | `awcms-micro` |
| Last updated | 2026-06-18 |
| Classification | internal |

---

## Matriks keberlakuan ADR per produk

| ADR | Keputusan | **Micro** | Mini | AWCMS |
|---|---|:---:|:---:|:---:|
| ADR-013 | Konektivitas PostgreSQL via pooler OSS | — (pakai **D1**) | ✅ | ✅ |
| ADR-014 | PostgreSQL murni tanpa Supabase | — (pakai **D1**) | ✅ | ✅ |
| ADR-015 | RLS wajib | — (**D1 prefix isolation + repository guard**) | ✅ | ✅ |
| ADR-016 | SIKESRA & SatuSehatKobar = plugin di Mini; plugin Micro di-deprecate | ✅ **`awcms-micro-sikesra` deprecated/dibekukan** (#210/#211) | ✅ host | — |
| ADR-017 | AWCMS = platform modular ERP ala Odoo | — | — | ✅ |
| ADR-018 | Kontrak plugin/module manifest + data adapter | ✅ **adapter D1/koleksi EmDash + prefix isolation** | ✅ PostgreSQL+RLS | ✅ |
| ADR-019 | Toolchain + runtime Bun | ❌ **tidak dipaksa** — ikut toolchain EmDash/Cloudflare (Workers/Wrangler) | ✅ | ✅ |
| ADR-020 | EmDash = rujukan saja (Mini/AWCMS); **full EmDash hanya Micro** | ✅ **full EmDash (di sini)** | rujukan saja | rujukan saja |
| ADR-021 | Logging Pino | — (ikut EmDash/Workers) | ✅ | ✅ Workers-native |
| ADR-022 | Tiga rujukan arsitektur (Supabase/Odoo/EmDash) | — | ✅ | ✅ |
| ADR-023 | CQRS pencarian (Tier 1 PostgreSQL; Tier 2 Kafka) | — | ✅ | ✅ |

Legenda: ✅ berlaku · — tidak relevan · ❌ sengaja tidak diberlakukan.

---

## Aturan operasional repo ini (turunan ADR)

1. **Full EmDash** (ADR-020): adopsi 100% upstream `emdash-cms/emdash` tanpa fork core; produk = plugin & template ber-standar AWCMS-Micro saja. Ini berbeda dari Mini/AWCMS yang memperlakukan EmDash sebagai rujukan saja.
2. **D1 + R2** (ADR-003/004): D1 sebagai database; R2 untuk seluruh objek biner. Keputusan PostgreSQL/RLS/pooler (ADR-013/014/015) **tidak** berlaku di Micro — gantinya **prefix isolation + repository guard** untuk isolasi data.
3. **Plugin/template** (ADR-018): manifest plugin `kind: emdash-plugin`, `appliesTo: [awcms-micro]`, **adapter D1/koleksi EmDash + prefix isolation**. Kontrak manifest portabel lintas produk; hanya adapter datanya berbeda.
4. **SIKESRA deprecated** (ADR-016): plugin `awcms-micro-sikesra` dibekukan; SIKESRA & SatuSehatKobar produksi dibangun sebagai plugin di **AWCMS-Mini** (PostgreSQL, RLS wajib, audit). Data kesehatan/personal tidak di D1.
5. **Toolchain** (ADR-019): ikut EmDash/Cloudflare (Wrangler/Workers). **Bun tidak dipaksakan** di Micro.
6. **AI gateway = Hermes** (bukan OpenClaw) bila relevan pada referensi platform.

---

## Referensi

- Source of truth: `ahliweb/personal-coding` — `docs/concepts/canvas-arsitektur-awcms-mini-awcms-emdash-pattern.md` (ADR penuh), `docs/ahliweb-repo-decision-log.md`, `docs/architecture/awcms-plugin-architecture.md` (kontrak plugin + adapter).
- Di repo ini: `README.md`, `AGENTS.md`, `docs/awcms-micro-prd.md`, `docs/awcms-micro-implementation-boundaries.md`.
