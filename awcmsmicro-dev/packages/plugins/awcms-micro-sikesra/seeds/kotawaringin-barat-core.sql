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
	('__TENANT_ID__', '__SITE_ID__', '6201', '62', 'regency', 'Kotawaringin Barat', 'kemendagri', 'seed', 'seed');

INSERT OR IGNORE INTO sikesra_settings (
	tenant_id,
	site_id,
	key,
	value_json,
	created_by,
	updated_by
) VALUES
	('__TENANT_ID__', '__SITE_ID__', 'baseline_region', '{"provinceCode":"62","regencyCode":"6201","regencyName":"Kotawaringin Barat"}', 'seed', 'seed');
