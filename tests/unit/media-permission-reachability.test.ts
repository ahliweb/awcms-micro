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
 * of them. Issue #634 declared the full set while shipping only the upload flow,
 * so 6 of them were grantable authority that conferred nothing — exactly what
 * `media-permissions.ts`'s original header warned about. (`awcms-mini` has the
 * identical gap; it was inherited upstream shape, not something micro invented.)
 *
 * ADR-0026 step 5 closed it in two moves, and this test drove both: when the
 * read API landed it FAILED AND NAMED `read`; when the lifecycle API landed it
 * failed and named the other five. That is the whole point of it existing — the
 * gap was a fact the suite knew, not a comment someone had to notice.
 *
 * It stays after the gap is closed, because the drift it guards runs both ways:
 *
 *   * A NEW permission declared with no route → it lands in neither set → the
 *     totals stop matching → whoever added it has to say why it is unreachable.
 *     That matters: an inert key can be granted for no effect and silently
 *     becomes real the instant a route appears.
 *   * A guard naming an undeclared key → caught below (a dead endpoint: 403 with
 *     no way to grant past it).
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
  test("all 9 declared `media.*` permissions are now reachable — the seeded-but-inert gap is closed", () => {
    const guarded = findGuardedActions("media");

    // The gap is gone: `read` closed with step 5's read API, and
    // `attach`/`detach`/`delete`/`restore`/`purge` with the lifecycle API. Every
    // declared media permission is now enforced by a route, which is what
    // `media-permissions.ts`'s original header asked for before Issue #634
    // declared all 9 while shipping only the upload flow.
    expect([...guarded].sort()).toEqual(Object.keys(MEDIA_PERMISSIONS).sort());

    const unreachable = Object.keys(MEDIA_PERMISSIONS).filter(
      (action) => !guarded.has(action)
    );
    expect(unreachable).toEqual([]);
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
