# Tata Kelola / Governance

Dokumen ini menjelaskan bagaimana keputusan diambil dan bagaimana AWCMS-Micro dikelola.

## Ringkasan

AWCMS-Micro adalah **base modular monolith standar** milik AhliWeb, dikelola sebagai proyek open-source (lisensi [MIT](LICENSE)) yang dipakai langsung sebagai salah satu dari tiga template paralel keluarga AWCMS (awcms / awcms-mini / awcms-micro). Tata kelola bersifat ringan namun eksplisit agar standar tetap konsisten.

## Peran

| Peran                  | Tanggung jawab                                                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Maintainer**         | Menetapkan arah, meninjau & merge PR, menjaga standar dokumen, merilis versi. Tercantum di [`.github/CODEOWNERS`](.github/CODEOWNERS). |
| **Kontributor**        | Siapa pun yang mengirim issue/PR sesuai [`CONTRIBUTING.md`](CONTRIBUTING.md).                                                          |
| **Security responder** | Maintainer yang menangani laporan kerentanan privat (lihat [`SECURITY.md`](SECURITY.md)).                                              |

## Pengambilan keputusan

1. **Perubahan kecil** (fix, docs, chore): satu approval maintainer + CI hijau.
2. **Perubahan standar** (arsitektur, aturan wajib, kontrak API/event, keputusan lintas-dokumen): wajib **Architecture Decision Record** di [`docs/adr/`](docs/adr/README.md) dan disetujui minimal dua maintainer bila tersedia.
3. **Perubahan keamanan/breaking**: memerlukan review keamanan (`awcms-micro-security-review`) dan changeset dengan bump SemVer yang sesuai.

Keputusan diusahakan lewat konsensus. Bila buntu, maintainer utama memutuskan dan mencatat alasannya di ADR atau issue terkait.

## Perubahan standar & dokumen

- Standar yang mengikat ada di `AGENTS.md` dan `docs/awcms-micro/`. Perubahannya harus konsisten lintas dokumen (doc, skill `.claude/skills/`, dan kode terkait berubah bersama).
- Keputusan arsitektural dicatat sebagai ADR (lihat `docs/adr/`), tidak dihapus melainkan ditandai `Superseded` bila diganti.

## Rilis

Versioning memakai SemVer + [Changesets](.changeset/README.md). Proses rilis diatur di [`docs/awcms-micro/09_roadmap_repository_commit.md`](docs/awcms-micro/09_roadmap_repository_commit.md) dan skill `awcms-micro-release`.

## Code of Conduct

Semua partisipan tunduk pada [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
