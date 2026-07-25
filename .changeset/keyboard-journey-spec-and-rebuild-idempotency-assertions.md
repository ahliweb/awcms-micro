---
"awcms-micro": patch
---

test: assert what the public keyboard journey and the search rebuild actually do

Two test gaps, both found by CodeQL flagging an unused binding — the kind of
finding that is usually dead code and occasionally a test that stops short of
its own claim.

**`js/unused-local-variable` alert 298 was a coverage gap, not dead code.**
`site-search.integration.test.ts`'s "rebuild is idempotent" test captured the
second rebuild's result and never asserted on it, checking only the document
count. That left the interesting half unproven: `rebuildTenantSearchIndex`
DELETEs the source's documents before reconciling, so every row comes back as
`added`, never `unchanged` — which is exactly what separates a rebuild from the
checksum-skipping reconcile the same test exercises three lines later. The
result is now asserted (distinct run id, `sourceCount` 5, `added` 5,
`unchanged` 0, `removed` 0, `failures` 0), making "idempotent" a claim about the
end state rather than about the amount of work done. Verified against a real
`postgres:18.4`: 11/11 pass.

**New `tests/e2e/public-keyboard-journey.e2e.ts`** covers what axe structurally
cannot. axe is a static DOM auditor — it never presses Tab — so a keyboard trap
(WCAG 2.1.2), a tab order diverging from document order (2.4.3), and a blanket
`outline: none` that leaves a keyboard user with no visible position (2.4.7) all
survive a green axe scan. The spec tabs each public page until focus escapes or
provably cycles (bounded at 40 presses, so a trap fails fast instead of hanging),
asserts visit order equals document order, requires an outline or box-shadow on
every visited control, and checks `Shift+Tab` walks back.

A border-colour change is deliberately not accepted as a focus indicator:
recognising it needs a diff against the same element unfocused, and accepting it
unconditionally would make the assertion unfalsifiable. That falsifiability was
verified rather than assumed — a negative control injecting
`*, *:focus { outline: none !important; box-shadow: none !important }` makes the
spec fail. Run unmodified against the deployed instance: 5/5 pass, EN + ID, pure
Playwright with no database import (read-only traffic).

Tests only — no application behavior changes.
