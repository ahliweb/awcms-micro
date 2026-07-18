export function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password);
}

export function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return Bun.password.verify(password, hash);
}

/**
 * A throwaway secret that only ever exists to be hashed once, so
 * `verifyPasswordOrDummy` has something argon2id-shaped to burn a verify
 * against when there is no real hash. Randomized per process purely as
 * defense in depth: the verify result on that path is discarded
 * unconditionally (see below), so even a caller who knew this value could
 * not turn it into a login.
 */
const DUMMY_PASSWORD_SOURCE = crypto.randomUUID();

let dummyPasswordHashPromise: Promise<string> | null = null;

/**
 * Produced by `hashPassword` itself rather than by a hardcoded literal, so
 * the dummy carries byte-for-byte the same argon2id parameters (algorithm,
 * memory cost, time cost) as every real `awcms_micro_identities.password_hash`
 * this deployment writes — that parameter match is the entire point, since
 * verification cost is a function of the parameters encoded in the hash. A
 * pinned literal would silently stop matching the moment Bun's defaults moved,
 * re-opening the very gap this closes.
 *
 * Computed lazily and memoized: at most one extra hash per process, on the
 * first unknown identifier seen, instead of an ~80 ms hash on every boot.
 *
 * COLD-START RESIDUAL, accepted. The first unknown identifier of each process
 * pays hash + verify instead of just verify (~2.7x a warm verify on the base
 * standard's harness). Three reasons it does not re-open the oracle:
 *
 *   1. It is once per PROCESS, not per request. `??=` assigns the promise
 *      synchronously, so even a concurrent first burst shares one hash, and
 *      every attempt after it is warm. An attacker's own first probe warms it.
 *   2. The skew runs the SAFE direction: cold-unknown is SLOWER than known.
 *      The exploitable signal was "unknown answers FAST"; a single slow
 *      outlier does not reconstruct it.
 *   3. It is unattributable: one sample cannot be told apart from a GC pause
 *      or a busy server, and the attacker would have to know they were the
 *      first caller of a fresh process AND that no other traffic beat them.
 *
 * Eager warming was considered and REJECTED — do not "fix" this by adding it:
 * a blocking top-level `await` would stall module evaluation for every
 * importer (tests, seeds, `scripts/*`, CLI) that only ever wants
 * `hashPassword`, and a fire-and-forget `void getDummyPasswordHash()` at
 * module scope would silently burn an argon2id hash in each of those same
 * processes and needs its own rejection handling to avoid an unhandled
 * rejection. Both trade a real, every-process cost for a once-per-process
 * skew that already points the harmless way.
 */
function getDummyPasswordHash(): Promise<string> {
  dummyPasswordHashPromise ??= hashPassword(DUMMY_PASSWORD_SOURCE);

  return dummyPasswordHashPromise;
}

/**
 * Verifies `password` against `hash`, or, when `hash` is `null` (no such
 * identity), performs an equivalent argon2id verification against a dummy hash
 * and returns `false`. Ported from the awcms-mini base standard (Issue #840).
 *
 * WHY: `POST /auth/login` used to skip `verifyPassword` entirely for an
 * unknown `loginIdentifier` (`identityRow ? await verifyPassword(...) :
 * false`). Measured on the base standard's integration harness, that made an
 * unknown identifier answer in a median of **4.1 ms** against **80.1 ms** for
 * a known one — a ~19x gap, which is a far cheaper and more reliable account
 * enumeration oracle than any response-body difference: one request, no
 * lockout to trip, default configuration, every deployment. Collapsing the
 * response bodies alone would leave it wide open.
 *
 * The dummy-verify result is discarded rather than returned: this function
 * must answer `false` for a nonexistent identity even in the impossible case
 * that `password` collided with `DUMMY_PASSWORD_SOURCE`. `hash === null` is
 * the ONLY thing that selects this path — never a property of `password` — so
 * the work performed does not vary with attacker-controlled input.
 *
 * This equalizes the dominant cost (the KDF), not every last instruction: the
 * caller still skips a couple of identity-scoped SELECTs for an unknown
 * identifier. Those are ~1-2 ms of loopback Postgres against an ~80-90 ms
 * hash and do not surface above the noise. Not a constant-time proof, and not
 * claimed as one: a motivated attacker with enough samples may still resolve a
 * sub-millisecond difference. The property is pinned end-to-end in
 * tests/integration/login-enumeration.integration.test.ts and at the unit
 * level in tests/unit/password-timing-equalization.test.ts.
 */
export async function verifyPasswordOrDummy(
  password: string,
  hash: string | null
): Promise<boolean> {
  if (hash === null) {
    await verifyPassword(password, await getDummyPasswordHash());

    return false;
  }

  return verifyPassword(password, hash);
}
