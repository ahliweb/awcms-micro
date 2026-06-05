-- AWCMS-Micro SIKESRA Kotawaringin Barat baseline seed.
-- Replace tenant/site placeholders before applying to local or remote D1.

INSERT OR IGNORE INTO sikesra_official_regions (
	tenant_id,
	site_id,
	code,
	parent_code,
	level,
	name,
	official_source,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', '62', NULL, 'province', 'Kalimantan Tengah', 'kemendagri', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', '6201', '62', 'regency', 'Kotawaringin Barat', 'kemendagri', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', '620102', '6201', 'district', 'Arut Selatan', 'kemendagri', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', '6201021002', '620102', 'village', 'Kelurahan Mendawai Seberang', 'kemendagri', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', '6201021003', '620102', 'village', 'Kelurahan Mendawai', 'kemendagri', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', '6201021005', '620102', 'village', 'Kelurahan Madurejo', 'kemendagri', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', '6201021007', '620102', 'village', 'Kelurahan Raja', 'kemendagri', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', '6201021008', '620102', 'village', 'Kelurahan Raja Seberang', 'kemendagri', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', '6201021009', '620102', 'village', 'Kelurahan Baru', 'kemendagri', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_settings (
	tenant_id,
	site_id,
	key,
	value_json,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'baseline_region', '{"provinceCode":"62","regencyCode":"6201","regencyName":"Kotawaringin Barat"}', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_data_types (
	tenant_id,
	site_id,
	id,
	code,
	label,
	description,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'rumah_ibadah', '01', 'Rumah Ibadah', 'Tempat ibadah dan status verifikasinya.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'lembaga_keagamaan', '02', 'Lembaga Keagamaan', 'Lembaga keagamaan dan status kelembagaannya.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'pendidikan_keagamaan', '03', 'Pendidikan Keagamaan', 'Satuan pendidikan keagamaan dan kapasitas layanan.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'lks', '04', 'LKS', 'Lembaga kesejahteraan sosial dan layanan sosialnya.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'guru_agama', '05', 'Guru Agama', 'Tenaga pengajar agama yang dikelola sebagai data terbatas.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'anak_yatim', '06', 'Anak Yatim', 'Penerima layanan anak yatim yang wajib dilindungi.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'disabilitas', '07', 'Disabilitas', 'Penerima layanan disabilitas yang wajib dilindungi.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'lansia_terlantar', '08', 'Lansia Terlantar', 'Penerima layanan lansia terlantar yang wajib dilindungi.', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_data_subtypes (
	tenant_id,
	site_id,
	data_type_id,
	code,
	label,
	description,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'rumah_ibadah', '01', 'Masjid', 'Masjid atau musala referensi.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'lembaga_keagamaan', '01', 'Majelis Taklim', 'Lembaga pembinaan masyarakat referensi.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'pendidikan_keagamaan', '01', 'TPA', 'Taman pendidikan agama referensi.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'lks', '01', 'Panti Sosial', 'Lembaga layanan sosial referensi.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'guru_agama', '01', 'Guru Agama Islam', 'Guru agama Islam referensi.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'anak_yatim', '01', 'Anak Yatim Piatu', 'Kategori anak yatim piatu referensi.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'disabilitas', '03', 'Tuna Daksa', 'Kategori disabilitas fisik.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'lansia_terlantar', '01', 'Lansia Terlantar', 'Kategori lansia terlantar referensi.', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_registry_entities (
	tenant_id,
	site_id,
	id,
	sikesra_id_20,
	code,
	label,
	entity_type,
	subtype_code,
	sensitivity,
	province_code,
	regency_code,
	district_code,
	village_code,
	verification_stage,
	input_level,
	public_summary,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-rumah-ibadah-01', '62010210090101000001', 'RI-001', 'Rumah Ibadah Al-Ikhlas', 'rumah_ibadah', '01', 'public_safe', '62', '6201', '620102', '6201021009', 'active_verified', 'desa_kelurahan', 'Rumah ibadah aktif dan sudah terverifikasi di wilayah Kotawaringin Barat.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-lembaga-keagamaan-01', '62010210090201000001', 'LK-006', 'Majelis Taklim Referensi', 'lembaga_keagamaan', '01', 'internal', '62', '6201', '620102', '6201021009', 'verified_district', 'desa_kelurahan', 'Lembaga keagamaan aktif sebagai contoh data internal.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-pendidikan-keagamaan-01', '62010210050301000001', 'PK-011', 'TPA Referensi', 'pendidikan_keagamaan', '01', 'internal', '62', '6201', '620102', '6201021005', 'submitted_district', 'desa_kelurahan', 'Satuan pendidikan keagamaan disajikan sebagai agregat aman.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-lks-01', '62010210050401000001', 'LKS-008', 'LKS Referensi', 'lks', '01', 'internal', '62', '6201', '620102', '6201021005', 'verified_sopd', 'kecamatan', 'Lembaga kesejahteraan sosial aktif untuk contoh layanan.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-guru-agama-01', '62010210050501000001', 'GA-014', 'Guru Agama Referensi', 'guru_agama', '01', 'restricted', '62', '6201', '620102', '6201021005', 'submitted_sopd', 'kecamatan', 'Data tenaga pengajar disajikan hanya sebagai agregat aman.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-anak-yatim-01', '62010210030601000001', 'AY-019', 'Penerima Layanan Anak Yatim', 'anak_yatim', '01', 'highly_restricted', '62', '6201', '620102', '6201021003', 'submitted_village', 'desa_kelurahan', 'Data anak hanya disajikan sebagai hitungan agregat aman.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-disabilitas-01', '62010210030703000001', 'DS-021', 'Penerima Layanan Disabilitas', 'disabilitas', '03', 'highly_restricted', '62', '6201', '620102', '6201021003', 'verified_sopd', 'sopd', 'Kasus berisiko tinggi hanya disajikan sebagai hitungan agregat aman.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-lansia-terlantar-01', '62010210090801000001', 'LT-004', 'Penerima Layanan Lansia', 'lansia_terlantar', '01', 'restricted', '62', '6201', '620102', '6201021009', 'submitted_district', 'desa_kelurahan', 'Data lansia terlantar disajikan hanya sebagai agregat aman.', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_rumah_ibadah_details (
	tenant_id,
	site_id,
	registry_entity_id,
	detail_json,
	field_standard_version,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-rumah-ibadah-01', '{"luasBangunanM2":240,"statusTanah":"wakaf","kapasitasJamaah":320}', '2026-01-reference', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_lembaga_keagamaan_details (
	tenant_id,
	site_id,
	registry_entity_id,
	detail_json,
	field_standard_version,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-lembaga-keagamaan-01', '{"jumlahAnggota":48,"statusKelembagaan":"aktif","fokusPembinaan":"keluarga"}', '2026-01-reference', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_pendidikan_keagamaan_details (
	tenant_id,
	site_id,
	registry_entity_id,
	detail_json,
	field_standard_version,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-pendidikan-keagamaan-01', '{"jumlahSantri":72,"jumlahPengajar":6,"statusIzin":"tercatat"}', '2026-01-reference', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_lks_details (
	tenant_id,
	site_id,
	registry_entity_id,
	detail_json,
	field_standard_version,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-lks-01', '{"jenisLayanan":"panti_sosial","kapasitasLayanan":35,"statusAkreditasi":"proses"}', '2026-01-reference', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_person_profiles (
	tenant_id,
	site_id,
	id,
	display_name,
	identity_label,
	phone_masked,
	email_masked,
	data_class,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'person-guru-agama-01', 'Guru Agama Referensi', 'NIK-REDACTED', '+62-REDACTED-014', 'guru-redacted@example.invalid', 'sensitive_personal', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'person-anak-yatim-01', 'Penerima Layanan Anak Yatim', 'NIK-REDACTED', NULL, NULL, 'sensitive_personal', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'person-disabilitas-01', 'Penerima Layanan Disabilitas', 'NIK-REDACTED', '+62-REDACTED-021', NULL, 'sensitive_personal', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'person-lansia-01', 'Penerima Layanan Lansia', 'NIK-REDACTED', '+62-REDACTED-004', NULL, 'sensitive_personal', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_entity_people (
	tenant_id,
	site_id,
	registry_entity_id,
	person_profile_id,
	relationship_type,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-guru-agama-01', 'person-guru-agama-01', 'primary_subject', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-anak-yatim-01', 'person-anak-yatim-01', 'primary_subject', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-disabilitas-01', 'person-disabilitas-01', 'primary_subject', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-lansia-terlantar-01', 'person-lansia-01', 'primary_subject', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_guru_agama_details (
	tenant_id,
	site_id,
	registry_entity_id,
	person_profile_id,
	detail_json,
	field_standard_version,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-guru-agama-01', 'person-guru-agama-01', '{"mapel":"Pendidikan Agama Islam","statusKepegawaian":"non_asn","alamat_ktp_detail":"REDACTED","alamat_domisili_sama_dengan_ktp":true}', '2026-01-reference', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_anak_yatim_details (
	tenant_id,
	site_id,
	registry_entity_id,
	person_profile_id,
	detail_json,
	field_standard_version,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-anak-yatim-01', 'person-anak-yatim-01', '{"statusWali":"keluarga_pengasuh","kebutuhanPrioritas":"pendidikan","alamat_ktp_detail":"REDACTED","alamat_domisili_sama_dengan_ktp":false,"alamat_domisili_detail":"REDACTED"}', '2026-01-reference', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_disabilitas_details (
	tenant_id,
	site_id,
	registry_entity_id,
	person_profile_id,
	detail_json,
	field_standard_version,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-disabilitas-01', 'person-disabilitas-01', '{"jenisDisabilitas":"tuna_daksa","kebutuhanLayanan":"alat_bantu","alamat_ktp_detail":"REDACTED","alamat_domisili_sama_dengan_ktp":false,"alamat_domisili_detail":"REDACTED"}', '2026-01-reference', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_lansia_terlantar_details (
	tenant_id,
	site_id,
	registry_entity_id,
	person_profile_id,
	detail_json,
	field_standard_version,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-lansia-terlantar-01', 'person-lansia-01', '{"kondisiTinggal":"sendiri","kebutuhanPrioritas":"pendampingan","alamat_ktp_detail":"REDACTED","alamat_domisili_sama_dengan_ktp":true}', '2026-01-reference', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_file_objects (
	tenant_id,
	site_id,
	id,
	storage_key,
	original_filename,
	safe_filename,
	content_type,
	file_extension,
	file_size_bytes,
	checksum_sha256,
	classification,
	validation_status,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'file-rumah-ibadah-01', 'sikesra/reference/rumah-ibadah-al-ikhlas.pdf', 'surat-keterangan-rumah-ibadah.pdf', 'surat-keterangan-rumah-ibadah.pdf', 'application/pdf', 'pdf', 245760, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'internal', 'valid', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'file-guru-agama-01', 'sikesra/reference/guru-agama-redacted.pdf', 'identitas-guru-agama-redacted.pdf', 'identitas-guru-agama-redacted.pdf', 'application/pdf', 'pdf', 184320, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'restricted', 'valid', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'file-disabilitas-01', 'sikesra/reference/disabilitas-redacted.pdf', 'rekomendasi-disabilitas-redacted.pdf', 'rekomendasi-disabilitas-redacted.pdf', 'application/pdf', 'pdf', 196608, 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc', 'highly_restricted', 'pending', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_supporting_documents (
	tenant_id,
	site_id,
	id,
	registry_entity_id,
	file_object_id,
	document_type,
	title,
	classification,
	validation_status,
	verification_stage,
	issuer,
	issued_at,
	metadata_json,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'doc-rumah-ibadah-01', 'registry-entity-rumah-ibadah-01', 'file-rumah-ibadah-01', 'surat_keterangan', 'Surat Keterangan Rumah Ibadah', 'internal', 'valid', 'active_verified', 'Kecamatan Arut Selatan', '2026-01-08T00:00:00.000Z', '{"publicSafe":false}', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'doc-guru-agama-01', 'registry-entity-guru-agama-01', 'file-guru-agama-01', 'identitas', 'Identitas Tenaga Pengajar', 'restricted', 'valid', 'submitted_sopd', 'Kecamatan Arut Selatan', '2026-01-09T00:00:00.000Z', '{"containsPersonalData":true}', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'doc-disabilitas-01', 'registry-entity-disabilitas-01', 'file-disabilitas-01', 'rekomendasi_layanan', 'Rekomendasi Layanan Khusus', 'highly_restricted', 'pending', 'verified_sopd', 'SOPD Sosial', '2026-01-11T00:00:00.000Z', '{"containsSensitivePersonalData":true}', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_verification_stage_state (
	tenant_id,
	site_id,
	registry_entity_id,
	stage,
	current_level,
	next_level,
	status,
	region_scope_code,
	assigned_to,
	submitted_at,
	decided_at,
	decision_notes,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-rumah-ibadah-01', 'active_verified', 'kabupaten', NULL, 'approved', '6201', 'user-demo-sikesra-admin', '2026-01-12T08:00:00.000Z', '2026-01-12T10:00:00.000Z', 'Data lengkap dan aktif.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-lembaga-keagamaan-01', 'verified_district', 'sopd', 'kabupaten', 'pending', '6201', 'user-demo-district', '2026-01-12T09:00:00.000Z', NULL, 'Menunggu validasi lanjutan.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-pendidikan-keagamaan-01', 'submitted_district', 'kecamatan', 'sopd', 'pending', '620101', 'user-demo-district', '2026-01-12T09:30:00.000Z', NULL, 'Menunggu review kecamatan.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-lks-01', 'verified_sopd', 'kabupaten', NULL, 'needs_review', '6201', 'user-demo-sopd', '2026-01-12T10:00:00.000Z', '2026-01-12T12:00:00.000Z', 'Perlu review kapasitas layanan.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-guru-agama-01', 'submitted_sopd', 'sopd', 'kabupaten', 'pending', '6201', 'user-demo-sopd', '2026-01-13T08:00:00.000Z', NULL, 'Menunggu review SOPD.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-anak-yatim-01', 'submitted_village', 'desa_kelurahan', 'kecamatan', 'pending', '6201021003', 'user-demo-village', '2026-01-13T09:00:00.000Z', NULL, 'Menunggu review desa atau kelurahan.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-disabilitas-01', 'verified_sopd', 'kabupaten', NULL, 'needs_review', '6201', 'user-demo-sikesra-admin', '2026-01-14T08:00:00.000Z', '2026-01-14T10:00:00.000Z', 'Perlu validasi lanjutan sebelum publikasi agregat.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'registry-entity-lansia-terlantar-01', 'submitted_district', 'kecamatan', 'sopd', 'pending', '620101', 'user-demo-district', '2026-01-14T09:00:00.000Z', NULL, 'Menunggu verifikasi kecamatan.', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_verification_events (
	tenant_id,
	site_id,
	id,
	registry_entity_id,
	from_stage,
	to_stage,
	verifier_level,
	verifier_user_id,
	decision,
	notes,
	region_scope_code,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'verify-rumah-ibadah-village', 'registry-entity-rumah-ibadah-01', 'submitted_village', 'verified_village', 'desa_kelurahan', 'user-demo-village', 'approved', 'Dokumen lengkap dan lokasi sesuai.', '6201021009', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'verify-lembaga-district', 'registry-entity-lembaga-keagamaan-01', 'submitted_district', 'verified_district', 'kecamatan', 'user-demo-district', 'approved', 'Lembaga aktif dan tercatat.', '620101', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'verify-pendidikan-village', 'registry-entity-pendidikan-keagamaan-01', 'submitted_village', 'submitted_district', 'desa_kelurahan', 'user-demo-village', 'approved', 'Data diteruskan ke kecamatan.', '6201021005', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'verify-lks-sopd', 'registry-entity-lks-01', 'submitted_sopd', 'verified_sopd', 'sopd', 'user-demo-sopd', 'needs_review', 'Perlu review kapasitas layanan.', '6201', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'verify-guru-district', 'registry-entity-guru-agama-01', 'submitted_district', 'submitted_sopd', 'kecamatan', 'user-demo-district', 'approved', 'Data diteruskan ke SOPD terkait.', '620101', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'verify-anak-yatim-village', 'registry-entity-anak-yatim-01', 'draft', 'submitted_village', 'desa_kelurahan', 'user-demo-village', 'pending', 'Menunggu dokumen pendukung.', '6201021003', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'verify-disabilitas-sopd', 'registry-entity-disabilitas-01', 'submitted_sopd', 'verified_sopd', 'sopd', 'user-demo-sopd', 'needs_review', 'Perlu review lanjutan oleh admin kabupaten.', '6201', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'verify-lansia-district', 'registry-entity-lansia-terlantar-01', 'submitted_village', 'submitted_district', 'kecamatan', 'user-demo-district', 'pending', 'Menunggu verifikasi kecamatan.', '620101', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_permission_catalog (
	tenant_id,
	site_id,
	slug,
	scope,
	label,
	description,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'sikesra.registry.read', 'registry', 'Read SIKESRA Registry', 'Read admin-safe registry records.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'sikesra.verification.review', 'verification', 'Review SIKESRA Verification', 'Review and advance verification records.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'sikesra.audit.read', 'audit', 'Read SIKESRA Audit', 'Read redacted audit events.', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_role_catalog (
	tenant_id,
	site_id,
	slug,
	label,
	description,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'sikesra_admin', 'SIKESRA Admin', 'Kabupaten-level SIKESRA administrator.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'sikesra_verifikator_kecamatan', 'SIKESRA Verifikator Kecamatan', 'District-level verification user.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'sikesra_viewer_laporan', 'SIKESRA Viewer Laporan', 'Read-only reporting user.', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_role_permission_assignments (
	tenant_id,
	site_id,
	role_slug,
	permission_slug,
	effect,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'sikesra_admin', 'sikesra.registry.read', 'allow', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'sikesra_admin', 'sikesra.verification.review', 'allow', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'sikesra_admin', 'sikesra.audit.read', 'allow', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'sikesra_verifikator_kecamatan', 'sikesra.registry.read', 'allow', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'sikesra_verifikator_kecamatan', 'sikesra.verification.review', 'allow', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'sikesra_viewer_laporan', 'sikesra.registry.read', 'allow', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_user_role_assignments (
	tenant_id,
	site_id,
	id,
	emdash_user_id,
	sikesra_role_slug,
	is_active,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'user-role-demo-admin', 'user-demo-sikesra-admin', 'sikesra_admin', 1, 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'user-role-demo-district', 'user-demo-district', 'sikesra_verifikator_kecamatan', 1, 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_user_scope_assignments (
	tenant_id,
	site_id,
	id,
	emdash_user_id,
	region_scope_type,
	region_scope_code,
	organization_scope_type,
	organization_scope_code,
	is_active,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'user-scope-demo-admin', 'user-demo-sikesra-admin', 'regency', '6201', 'all', NULL, 1, 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'user-scope-demo-district', 'user-demo-district', 'district', '620101', 'all', NULL, 1, 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_abac_attribute_catalog (
	tenant_id,
	site_id,
	key,
	target_type,
	data_type,
	label,
	description,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'region_scope', 'subject', 'string', 'Region Scope', 'Trusted user region boundary.', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'resource_sensitivity', 'resource', 'string', 'Resource Sensitivity', 'Sensitivity classification for SIKESRA resources.', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_abac_subject_assignments (
	tenant_id,
	site_id,
	id,
	emdash_user_id,
	attribute_key,
	attribute_value,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'abac-subject-demo-admin-region', 'user-demo-sikesra-admin', 'region_scope', '6201', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'abac-subject-demo-district-region', 'user-demo-district', 'region_scope', '620101', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_abac_resource_assignments (
	tenant_id,
	site_id,
	id,
	resource_type,
	resource_id,
	attribute_key,
	attribute_value,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'abac-resource-rumah-ibadah-sensitivity', 'registry_entity', 'registry-entity-rumah-ibadah-01', 'resource_sensitivity', 'public_safe', 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'abac-resource-disabilitas-sensitivity', 'registry_entity', 'registry-entity-disabilitas-01', 'resource_sensitivity', 'highly_restricted', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_abac_policy_rules (
	tenant_id,
	site_id,
	id,
	effect,
	actions_json,
	subject_conditions_json,
	resource_conditions_json,
	priority,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'allow-regency-public-safe-read', 'allow', '["registry.read"]', '{"region_scope":"6201"}', '{"resource_sensitivity":"public_safe"}', 100, 'seed', 'seed'),
	('__TENANT_ID__', '__SITE_ID__', 'deny-public-highly-restricted-read', 'deny', '["public.read"]', '{}', '{"resource_sensitivity":"highly_restricted"}', 10, 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_audit_events (
	tenant_id,
	site_id,
	id,
	kind,
	scope,
	actor_user_id,
	actor_name,
	summary,
	metadata_json,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'audit-seed-baseline', 'seed.apply', 'setup', 'seed', 'SIKESRA Seed', 'Applied Kotawaringin Barat SIKESRA baseline dummy data.', '{"seed":"kotawaringin-barat-core","containsRawPersonalData":false}', 'seed', 'seed');
