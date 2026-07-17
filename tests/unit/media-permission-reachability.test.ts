import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  MEDIA_PERMISSIONS,
  MEDIA_ENFORCEMENT_PERMISSIONS
} from "../../src/modules/media-library/domain/media-permissions";
import { mediaLibraryModule } from "../../src/modules/media-library/module";

/**
 * Which media permissions are actually ENFORCED by code, versus merely declared
 * and seeded.
 *
 * `module.ts` declares 9 `media.*` permissions and `sql/042`/`sql/077` seed all
 * of them, but only 3 have a guard: `create`, `verify`, `cancel`. The other 6
 * are grantable authority that confers nothing, because no endpoint exists yet —
 * exactly what `media-permissions.ts`'s original header warned about, and which
 * Issue #634 did anyway when it declared the full set while shipping only the
 * upload flow.
 *
 * This test exists so that gap is a FACT THE SUITE KNOWS rather than a comment
 * someone has to notice. Two directions of drift both fail here:
 *
 *   * Someone adds `GET /api/v1/media/objects` (ADR-0026 step 5's media object
 *     API) → `read` becomes enforced → this fails → they update the list and, in
 *     doing so, read the header explaining these keys are a contract being
 *     implemented, not free naming.
 *   * Someone declares a NEW permission with no route → it lands in neither set
 *     → the totals stop matching → they have to say which it is.
 *
 * Deliberately scans `src/` as a whole, not just `src/pages/`: `verify`'s guard
 * lives in `application/media-finalize-upload-session.ts` and its route merely
 * delegates. An audit that only looked at route files reported `verify` as
 * unenforced — a false finding this scope prevents repeating.
 */

function listTsFiles(dir: string): string[] {
  const out: string[] = [];

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...listTsFiles(full));
    } else if (full.endsWith(".ts")) {
      out.push(full);
    }
  }

  return out;
}

/** Actions guarded for `activityCode`, found anywhere under `src/`. */
function findGuardedActions(activityCode: string): Set<string> {
  const guarded = new Set<string>();
  const pattern = new RegExp(
    `activityCode:\\s*"${activityCode}"\\s*,\\s*action:\\s*"(\\w+)"`,
    "g"
  );

  for (const file of listTsFiles("src")) {
    const source = readFileSync(file, "utf8").replace(/\s+/g, " ");
    for (const match of source.matchAll(pattern)) {
      guarded.add(match[1] as string);
    }
  }

  return guarded;
}

describe("media permission reachability", () => {
  test("exactly 3 of the 9 declared `media.*` permissions have a guard — the other 6 are seeded but inert", () => {
    const guarded = findGuardedActions("media");

    // If this list grows, the media object API has landed: update the
    // `unreachable` list below and `media-permissions.ts`'s header with it.
    expect([...guarded].sort()).toEqual(["cancel", "create", "verify"]);

    const unreachable = Object.keys(MEDIA_PERMISSIONS).filter(
      (action) => !guarded.has(action)
    );

    expect(unreachable.sort()).toEqual([
      "attach",
      "delete",
      "detach",
      "purge",
      "read",
      "restore"
    ]);
  });

  test("both `enforcement.*` permissions are reachable — ADR-0026 step 5a shipped its routes with its keys", () => {
    // The counter-example the media set should eventually match: declared and
    // enforced in the same change, so no inert authority is ever granted.
    const guarded = findGuardedActions("enforcement");

    expect([...guarded].sort()).toEqual(["enable", "read"]);
    expect([...guarded].sort()).toEqual(
      Object.keys(MEDIA_ENFORCEMENT_PERMISSIONS).sort()
    );
  });

  test("every guarded action is a declared permission — no route may check a key the descriptor does not have", () => {
    // The dangerous direction: a guard naming a permission that was never
    // declared/seeded can never be granted, so the endpoint is dead to every
    // caller — a 403 with no way to fix it. Default-deny makes this fail closed
    // rather than open, but it is still a broken endpoint.
    const declaredMedia = new Set(
      (mediaLibraryModule.permissions ?? [])
        .filter((p) => p.activityCode === "media")
        .map((p) => p.action)
    );
    const declaredEnforcement = new Set(
      (mediaLibraryModule.permissions ?? [])
        .filter((p) => p.activityCode === "enforcement")
        .map((p) => p.action)
    );

    for (const action of findGuardedActions("media")) {
      expect({ action, declared: declaredMedia.has(action) }).toEqual({
        action,
        declared: true
      });
    }

    for (const action of findGuardedActions("enforcement")) {
      expect({ action, declared: declaredEnforcement.has(action) }).toEqual({
        action,
        declared: true
      });
    }
  });
});
