-- AWCMS-Micro SIKESRA migration 0017
-- Adds missing update actor metadata to delete snapshots for databases that already applied 0015.
-- awcms-sikesra-idempotent-add-column: table=sikesra_delete_snapshots columns=updated_by guard=PRAGMA table_info(sikesra_delete_snapshots)

ALTER TABLE sikesra_delete_snapshots ADD COLUMN updated_by TEXT;
