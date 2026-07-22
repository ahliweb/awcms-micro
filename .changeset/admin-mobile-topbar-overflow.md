---
"awcms-micro": patch
---

Fix admin mobile layout defects surfaced by a 360px headless pass:

- **Topbar no longer overflows on phones.** The admin topbar (brand, tenant badge, sync, theme, language, roles, logout) ran off the right edge below `--bp-md`, forcing a whole-page horizontal scroll. It now wraps onto a second row (desktop flex spacer dropped on mobile; secondary role text hidden) — no single control is wider than a phone viewport, so wrapping guarantees no horizontal scroll.
- **Dashboard module-usage table** scroll container is now a keyboard-focusable labelled region (`role="region"` + `aria-label` + `tabindex="0"`), resolving an axe `scrollable-region-focusable` (serious) finding that only appears once the table overflows at narrow widths.
