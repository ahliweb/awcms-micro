---
"awcms-micro": minor
---

ADR-0026 step 2: move the media registry, presigned upload flow, R2 config/client, verification, reconciliation, and the 9 media permissions out of `news_portal` and into `media_library`, which flips from `experimental` to `active`. Permission keys move from `news_portal.media.*` to `media_library.media.*` via `sql/077`, which repoints existing role grants rather than revoking them.
