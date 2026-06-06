-- awcms-sikesra-idempotent-add-column: apply only when PRAGMA table_info(sikesra_code_history) shows the column is missing.
ALTER TABLE sikesra_code_history ADD COLUMN event_type TEXT NOT NULL DEFAULT 'issued';
ALTER TABLE sikesra_code_history ADD COLUMN previous_sikesra_id_20 TEXT;
ALTER TABLE sikesra_code_history ADD COLUMN correction_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_sikesra_code_history_event_type
	ON sikesra_code_history (tenant_id, site_id, event_type);
