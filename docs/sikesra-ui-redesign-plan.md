# SIKESRA Plugin Admin UI — Professional Redesign Plan

**Status:** In Progress  
**Date:** 2026-05-28  
**Scope:** `awcms-micro-sikesra` plugin — `src/admin.tsx` only  
**Type:** Cosmetic / UX redesign — no API or business logic changes

---

## 1. Latar Belakang

Antarmuka admin plugin SIKESRA saat ini bersifat fungsional namun "utility-grade":

- Layout kartu/daftar dasar dengan hierarki visual minimal
- Tidak ada ikon atau penanda visual untuk membedakan bagian-bagian
- Step navigator wizard registry menggunakan label kecil dan terpotong sehingga membingungkan
- Kartu dashboard overview tidak menarik secara visual
- Baris tabel monoton tanpa perbedaan visual
- Indikator status (Pill, Badge) tidak konsisten
- Form kurang pemisahan visual antar kelompok field logis

---

## 2. Tujuan Redesign

1. **Profesional**: Hierarki tipografi yang lebih jelas, spacing yang konsisten, visual yang bersih
2. **Menarik**: Ikon inline SVG, warna yang bermakna, kartu metric yang lebih kaya informasi
3. **Tidak membingungkan**: Wizard dengan stepper vertikal yang jelas, label form yang eksplisit, status badge yang informatif

---

## 3. Prinsip Desain

### 3.1 Ikon Visual Anchor
- Setiap header section, kartu metric, dan item navigasi mendapat ikon SVG inline
- Tiap tipe entitas SIKESRA (rumah ibadah, guru agama, dll.) mendapat warna aksen yang konsisten

### 3.2 Hierarki Status yang Kuat
- Indikator status lebih besar dan menonjol dengan ikon (✓ ✗ ⏱)
- Badge warna yang bermakna: hijau (terverifikasi), kuning (pending), merah (ditolak)

### 3.3 Kedalaman Kartu dan Pengelompokan
- Latar belakang yang berbeda secara halus di dalam kartu untuk mengelompokkan field terkait
- Divider visual antar seksi logis dalam satu halaman

### 3.4 Progressive Disclosure
- Wizard registry mendapat step indicator vertikal yang proper menggantikan tombol horizontal kecil
- Setiap step memiliki deskripsi kontekstual

### 3.5 Tipografi yang Lebih Baik
- Kontras yang lebih kuat antara heading, subheading, body, dan caption
- Penggunaan `font-mono` untuk ID/kode SIKESRA

---

## 4. Rincian Perubahan

### 4.1 Shared UI Components (`admin.tsx`)

| Komponen | Perubahan |
|---|---|
| `PageHeader` | Gradient accent bar, eyebrow badge lebih besar, slot action lebih baik |
| `Card` | Prop `icon` opsional, header section spacing lebih baik |
| `MetricCard` | Prop `icon` dengan dukungan SVG, display nilai lebih besar |
| `Pill` | Tambah `EntityTypePill` yang memetakan tipe entitas ke warna unik |
| `Field` | Tanda `required` asterisk, styling hint lebih baik |
| `LoadingState` | Spinner animasi menggantikan teks polos |
| `EmptyState` | Ikon terpusat, layout teks lebih engaging |
| `ErrorState` | Visual lebih baik dengan ikon |
| `Feedback` | Prefix ikon (✓ atau ✗) |
| `SectionDivider` | Komponen baru untuk pengelompokan dalam card |

### 4.2 OverviewPage

- **Kartu metric hero**: Ikon tipe entitas dan color coding yang proper
- **Kartu modul dashboard**: Lebih besar, dengan ikon, titik status berwarna
- **Recent events**: Timeline-style list dengan kind icon badge
- **Form konfigurasi**: Layout dua kolom yang lebih baik dengan field group

### 4.3 RegistryPage

- **Redesign wizard**: Ganti tombol step horizontal kecil dengan stepper vertikal proper
  - Panel kiri: daftar step dengan nomor, ikon, dan deskripsi
  - Panel kanan: konten step saat ini
  - Progress bar di bagian bawah
- **Daftar registry**: Row design lebih baik dengan ikon tipe entitas, chip sensitivitas berwarna
- **Filter bar**: Layout search + filter yang lebih baik

### 4.4 VerificationPage

- Item queue: UI approve/reject lebih menonjol dengan CTA yang jelas
- Kartu status: Color-coded berdasarkan stage

### 4.5 DocumentsPage

- Daftar dokumen: Ikon tipe file, tampilan metadata lebih baik
- Form upload: Gaya drag-zone untuk pemilih file

### 4.6 ReportsPage

- Tabel kategori: Tambah visual bar untuk total
- Kartu catatan publik: Format yang lebih baik

### 4.7 AuditPage

- Log audit: Timeline-style dengan ikon kind dan tipe event berwarna

---

## 5. Entity Type Color Mapping

| Tipe Entitas | Warna | Ikon |
|---|---|---|
| `rumah_ibadah` | Biru (brand) | 🕌 |
| `lembaga_keagamaan` | Ungu | 🏛️ |
| `pendidikan_keagamaan` | Hijau | 📚 |
| `lks` | Teal | 🤝 |
| `guru_agama` | Amber | 👨‍🏫 |
| `anak_yatim` | Rose | 🧒 |
| `disabilitas` | Indigo | ♿ |
| `lansia_terlantar` | Orange | 👴 |

---

## 6. Komponen Tidak Diubah

- Semua routing halaman
- API call dan handler
- Permission checks
- Business logic (wizard submit, verification advance, dll.)
- File `runtime.ts`, `permissions.ts`, `audit.ts`, `navigation.ts`
- Semua test files

---

## 7. Verifikasi

```bash
# Typecheck
pnpm --filter @awcms-micro/plugin-sikesra typecheck

# Build
pnpm --filter @awcms-micro/plugin-sikesra build

# Tests
pnpm --filter @awcms-micro/plugin-sikesra test
```

Setelah build berhasil, verifikasi visual pada halaman:
- `/overview` — Dashboard dan konfigurasi
- `/registry` — Daftar dan wizard input
- `/verification` — Antrian verifikasi
- `/documents` — Upload dan katalog dokumen

---

## 8. File yang Diubah

```
awcmsmicro-dev/
  packages/
    plugins/
      awcms-micro-sikesra/
        src/
          admin.tsx          ← SATU-SATUNYA file yang dimodifikasi
```

---

## 9. Referensi

- [TECHNICAL_PRD.md](../awcmsmicro-dev/packages/plugins/awcms-micro-sikesra/docs/TECHNICAL_PRD.md)
- [awcms-micro-prd.md](./awcms-micro-prd.md)
- [awcms-micro-implementation-boundaries.md](./awcms-micro-implementation-boundaries.md)
