---
"awcms-micro": minor
---

Redesign the admin dashboard (`/admin`) into a professional, scannable executive layout — subtle-professional, fully token-driven, no new i18n strings (reuses the existing `admin.dashboard.*` labels verbatim):

- **KPI hero row** — four headline tiles (active users, active offices, allow-decisions in the audit window, sync node health) with theme-aware line icons, a semantic accent rail, and a hover-lift. Mobile-first: 2-up at 360px, flowing to 4-up on wider viewports.
- **Detail cards** get icon headers, a divider between title and body, right-aligned emphasized values, and status badges (sync healthy / needs-attention, tenant status). Non-zero deny / open-conflict / failed-object counts render in the warning colour **paired with their descriptive label** (never colour alone — WCAG 1.4.1).
- **Module-usage** becomes a full-width card with an uppercase table header, tabular-nums count column, and the existing `overflow-x` scroll container preserved.
- Cards ease up on entrance with a small stagger; every animation references the shared motion tokens, so the global `prefers-reduced-motion` guard neutralizes it (and the stagger delay is zeroed for reduced-motion users). All SVG is static inline markup and all styles are Astro-scoped, so the strict admin CSP is unchanged.
