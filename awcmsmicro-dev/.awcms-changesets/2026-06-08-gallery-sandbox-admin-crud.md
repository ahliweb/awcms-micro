---
"@awcms-micro/plugin-gallery": patch
---

Fix the production gallery sandbox admin handler so Gallery content management works through the runtime entrypoint. The sandbox admin route now handles gallery create, update, delete, search, and inline media import interactions with Content API writes, safe event-date parsing, audit events, and success toasts. Adds focused regression tests for sandbox create, edit, delete, import, and search interactions.
