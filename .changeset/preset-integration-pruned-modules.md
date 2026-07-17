---
"awcms-micro": patch
---

Fix `module-presets.integration.test.ts`, which still asserted tenant module state for seven unported ERP modules and did not account for the newly registered `media_library`. These assertions never ran locally (integration tests skip without `DATABASE_URL`), so the drift was only visible in CI.
