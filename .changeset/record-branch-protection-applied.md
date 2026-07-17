---
"awcms-micro": patch
---

Correct two now-false claims that `main` has no branch protection: `release.yml`'s header and `branch-protection.md`'s intro. Protection was applied (6 required checks, `strict`, `enforce_admins`), so both documents were describing the opposite of reality.
