---
"awcms-micro": minor
---

UI/UX overhaul (phase 2) — subtle-professional, token-driven animation + mobile-first responsiveness across public, shared-component, and admin surfaces, all built on the motion-token foundation:

- **Public content pages** now ship a real stylesheet (`public/css/public-content.css`, external + CSP-safe): mobile-first readable layout, responsive media (`max-width`/`aspect-ratio`/lazy-load) that fixes horizontal-scroll and layout-shift on phones, a `prefers-color-scheme: dark` path, card hover-lift + a CSS-only reduced-motion-safe scroll-in reveal, and image fade-in. `PublicThemeLayout` gains a dark-mode path. `login` gets `100dvh`, autofocus, a card entrance, and an animated error reveal. `CommentsSection` fixes an AA solid-fill contrast bug (`--color-*-strong`), adds 44px touch targets and a skeleton loading state. The newsletter/comments demo pages adopt tokens + CSP-safe scoped styles.
- **Shared UI components** get subtle motion: `ConfirmDialog` animates open (`@starting-style` + `allow-discrete`) with a fading scrim, `ActionBanner` slides in, `DataTable` gains an optional skeleton-loading affordance, and buttons/badges/steppers ease their state changes. All APIs stay backward-compatible.
- **Admin**: the four remaining wide tables are wrapped in `overflow-x` scroll containers (no more whole-page horizontal scroll on mobile); the `comments` and `newsletter` admin pages are brought onto the design tokens with 44px touch targets and skeleton loading states.

Every animation references the shared motion tokens, so the global `prefers-reduced-motion` guard neutralizes all of it for users who ask for reduced motion.
