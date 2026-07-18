---
"awcms-micro": patch
---

Secret-scanning #2: swap the high-entropy synthetic Telegram Bot Token test fixture in `tests/unit/social-account-validation.test.ts` for a low-entropy repeated-character placeholder of the same shape.

`looksLikeRawSecretToken`'s own detection regex for a Telegram-shaped token (`\d{6,10}:[A-Za-z0-9_-]{30,45}`) is close enough to GitHub's real Telegram Bot Token secret-scanning pattern that any sufficiently random-looking fixture value in that charset trips the scanner, whether or not it's a real credential — this happened twice in a row (alert #1, then its "fixed" replacement became alert #2). The sibling fixture two lines below, which uses repeated-character padding, has never been flagged; this change matches that shape so the code path under test is unchanged but the fixture no longer reads as high-entropy secret material.
