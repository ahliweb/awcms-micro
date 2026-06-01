-- AWCMS-Micro SIKESRA migration 0013
-- Adds explicit registry query indexes required by issue #125.
-- Forward-only and idempotent. Do not add destructive SQL to this file.

CREATE INDEX IF NOT EXISTS idx_sikesra_entities_tenant_site
	ON sikesra_registry_entities (tenant_id, site_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_entities_type_status
	ON sikesra_registry_entities (tenant_id, site_id, entity_type, verification_stage);

CREATE INDEX IF NOT EXISTS idx_sikesra_entities_region
	ON sikesra_registry_entities (tenant_id, site_id, province_code, regency_code, district_code, village_code);

CREATE INDEX IF NOT EXISTS idx_sikesra_entities_code
	ON sikesra_registry_entities (tenant_id, site_id, sikesra_id_20);

CREATE INDEX IF NOT EXISTS idx_sikesra_rumah_ibadah_details_tenant_site
	ON sikesra_rumah_ibadah_details (tenant_id, site_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_lembaga_keagamaan_details_tenant_site
	ON sikesra_lembaga_keagamaan_details (tenant_id, site_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_pendidikan_keagamaan_details_tenant_site
	ON sikesra_pendidikan_keagamaan_details (tenant_id, site_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_lks_details_tenant_site
	ON sikesra_lks_details (tenant_id, site_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_guru_agama_details_tenant_site
	ON sikesra_guru_agama_details (tenant_id, site_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_anak_yatim_details_tenant_site
	ON sikesra_anak_yatim_details (tenant_id, site_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_disabilitas_details_tenant_site
	ON sikesra_disabilitas_details (tenant_id, site_id);

CREATE INDEX IF NOT EXISTS idx_sikesra_lansia_terlantar_details_tenant_site
	ON sikesra_lansia_terlantar_details (tenant_id, site_id);
