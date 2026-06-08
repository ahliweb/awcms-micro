---
"@awcms-micro/plugin-sikesra": patch
---

Add standardized cursor-paged list contracts for SIKESRA import workflows. New read-only routes `import/list` (persisted import batches) and `import/staging/list` (staged rows for a batch) return the shared `{ items, nextCursor, pagination }` shape, are tenant/site scoped, exclude soft-deleted rows, and mask raw staged-row payloads (no personal data such as NIK leaks through the list contract). Adds typed contracts, admin API client wrappers, and focused paging/cursor tests. Existing import create/promote routes and admin UI are unchanged.
