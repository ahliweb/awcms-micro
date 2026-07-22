---
"awcms-micro": minor
---

Add a design-token motion foundation: duration (`--dur-fast/base/slow`) and easing (`--ease-standard/decelerate/accelerate/spring`) tokens, reusable transition primitives (`--transition-colors/transform/opacity`), keyframe + helper primitives (`awcms-fade-in`/`slide-up`/`scale-in`, `.awcms-skeleton` shimmer), and a `--color-scrim` overlay token — all in `src/styles/tokens.css`, with a **global `prefers-reduced-motion: reduce` neutralizer** so every animation built on these tokens is accessibility-safe by default (WCAG 2.3.3). `PublicThemeLayout` (which intentionally doesn't import `tokens.css`) ships its own copy of the motion tokens + guard via `is:global` so the reduced-motion guard reaches slotted page content, not just the layout's own elements. The admin drawer now uses the motion tokens and its scrim fades in/out (via `data-open` + `pointer-events`) instead of hard-popping.
