---
"awcms-micro": patch
---

Give the `/login` page dark-mode parity. It imported the design tokens but never set `data-theme`, so it rendered light-only regardless of the visitor's OS preference (real-browser verification of the UI overhaul caught this: `/news` switched to dark correctly while `/login` stayed light). Login now runs the same shared, CSP-hash-registered theme-init script AdminLayout uses; being pre-auth (no tenant default) it resolves to "system" and follows `prefers-color-scheme`.
