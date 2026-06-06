-- AWCMS-Micro SIKESRA migration 0017
-- Adds missing update actor metadata to delete snapshots for databases that already applied 0015.
-- awcms-sikesra-idempotent-add-column: apply only when PRAGMA table_info(sikesra_delete_snapshots) shows updated_by is missing.

ALTER TABLE sikesra_delete_snapshots ADD COLUMN updated_by TEXT;
