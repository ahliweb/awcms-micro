---
"awcms-micro": patch
---

chore: remove sensitive references

Infrastructure details (server address, host, OS user, backup locations), local
paths and an internal reference in the deploy skill are replaced with
placeholders in docs and skills, and the default bootstrap owner email now uses
`example.com`. No other runtime behaviour changes.
