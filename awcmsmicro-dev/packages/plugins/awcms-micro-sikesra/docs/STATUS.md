# SIKESRA Implementation Status

This status note tracks current implementation state against the frozen historical GitHub issue backlog (issues #119-#143). Production SIKESRA development has moved to AWCMS-Mini; this backlog is preserved as historical design context only, per README.md and issue #210.

## SIKESRA D1 Table and Collection Naming Rule

Issue #119 establishes the naming rule for all SIKESRA-owned D1 tables and plugin storage collections.

All SIKESRA-owned D1 tables and plugin storage collections MUST use the `sikesra_` prefix.

Examples:

```txt
sikesra_registry_entities
sikesra_supporting_documents
sikesra_verification_events
sikesra_audit_events
sikesra_import_batches
sikesra_export_jobs
```

Rules:

- Do not create SIKESRA production tables without the `sikesra_` prefix.
- Do not store canonical SIKESRA business data in generic EmDash tables, generic plugin tables, or shared plugin collections unless the use is only compatibility, migration, or temporary fallback.
- Generic `_plugin_storage` is not the canonical production storage for SIKESRA business data once dedicated D1 tables are implemented.
- The canonical production source of truth for SIKESRA must be dedicated D1 tables with the `sikesra_` prefix.

Current enforcement:

- `AWCMS_SIKESRA_STORAGE` defines plugin storage collections with `sikesra_` names.
- `AWCMS_SIKESRA_D1_TABLE_NAMES` defines the target D1 table-name surface.
- The plugin test suite validates that storage collection names and target D1 table names use the `sikesra_` prefix.
