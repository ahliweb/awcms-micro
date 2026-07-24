---
"awcms-micro": patch
---

Rename the sync-storage R2 object-storage env vars under a unified `AWCMS_MICRO_` prefix, with a zero-downtime backward-compat fallback. `R2_ENABLED`/`R2_ACCOUNT_ID`/`R2_ACCESS_KEY_ID`/`R2_SECRET_ACCESS_KEY`/`R2_BUCKET` become `AWCMS_MICRO_R2_*`. The runtime readers (`object-storage-uploader.ts`, `sync/objects`) and the `config:validate`/`security:readiness` gates read the new canonical name and fall back to the legacy `R2_*` name during the migration window, so a deployment still on the old keys keeps working until the operator swaps them. Bucket-name convention documented as `awcms-micro-*` (e.g. `awcms-micro-objects`).

Registry, `.env.example`, and doc 18 use the canonical names (three-way `config:docs:check` stays in sync; legacy names kept in doc 18 migration prose via `DOC18_NON_VARIABLE_TOKENS`). The public-media `NEWS_MEDIA_R2_*` namespace is intentionally unchanged. Drop the `?? R2_*` fallback (and the exemption/migration notes) once every deployment has migrated.
