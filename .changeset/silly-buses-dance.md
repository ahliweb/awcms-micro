---
"awcms-micro": patch
---

Fix `Dockerfile.production`'s runtime stage missing `i18n/`, `sql/`, `openapi/`, and `asyncapi/` — the previous image only copied `dist/`, `package.json`, and `node_modules`, so every page render that calls `translate()` 500'd with `ENOENT: no such file or directory, open '/app/i18n/en.po'` since locale catalogs are read from disk at request time, not bundled into `dist/`.
