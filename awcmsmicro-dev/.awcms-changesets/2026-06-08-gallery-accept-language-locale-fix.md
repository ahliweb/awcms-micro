---
"@awcms-micro/plugin-gallery": patch
---

Fix a 500 "Plugin route error" on the gallery admin page. The raw `Accept-Language` request header (e.g. `id-ID,id;q=0.9,en;q=0.8`) was passed directly as an Intl locale to `toLocaleDateString`, which throws `RangeError` on real browser requests when a gallery has an `event_date`. Headers are now read defensively (Fetch `Headers` or plain object) and normalized to a supported locale (`en`/`id`), and all date formatting/parsing is hardened against missing or malformed values. The shared helpers are applied to both the standard entry (`index.ts`) and the sandbox runtime entry (`sandbox.ts`, which is what production loads). Adds regression tests covering the admin page on `page_load` with a raw `Accept-Language` header for both entries.
