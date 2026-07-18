---
"awcms-micro": patch
---

Close the login account-enumeration timing oracle on `POST /api/v1/auth/login` (ported from the awcms-mini base standard, Issue #840).

The handler skipped `verifyPassword` entirely for an unknown `loginIdentifier` (`identityRow ? await verifyPassword(...) : false`). On the base standard's harness that made an unknown identifier answer in a median of ~4 ms against ~80 ms for a known one — a ~19x timing gap that enumerates accounts in a single unauthenticated request, needs no lockout to trip, and works on default configuration (OWASP ASVS V2.2.1 / WSTG-IDNT-04).

`src/lib/auth/password.ts` gains `verifyPasswordOrDummy(password, hash | null)`: when `hash` is `null` it performs an equivalent argon2id verify against a process-memoized dummy hash and returns `false`, so the KDF cost is paid whether or not the identity exists. The dummy is produced by `hashPassword` itself (not a pinned literal), so it always carries the same argon2id parameters as real hashes even if Bun's defaults move. `hash === null` is the only thing that selects the dummy path — never a property of attacker input — so the work performed does not vary with the request. A once-per-process cold-start hash is documented and skews the safe (slower-unknown) direction.

`login.ts` now calls `verifyPasswordOrDummy(password, identityRow?.password_hash ?? null)`. No API/response-shape change. Pinned by a unit test (`tests/unit/password-timing-equalization.test.ts`, mutation-verified) and an end-to-end integration test (`tests/integration/login-enumeration.integration.test.ts`, skipped without `DATABASE_URL`).
