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
 * identical gap; this is inherited upstream shape, not something micro invented.)
 *
 * ADR-0026 step 5's read API closed part of it: `read` is now enforced by
 * `GET /api/v1/media/objects` and `GET /api/v1/media/objects/{id}`. When that
 * route landed, THIS TEST FAILED AND NAMED `read` — which is the whole point of
 * it existing. The remaining 5 (`attach`, `detach`, `delete`, `restore`,
 * `purge`) are still inert, with working application functions behind them and
 * no route.
 *
 * Two directions of drift both fail here:
 *
 *   * A route starts guarding one of the remaining 5 → this fails naming it →
 *     whoever lands it updates the list and, doing so, reads the header
 *     explaining these keys are a contract being IMPLEMENTED, not free naming.
 *     That matters: a tenant may already have granted `media.purge` for no
 *     effect, and it becomes real the instant a purge route exists.
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
  test("4 of the 9 declared `media.*` permissions have a guard — the other 5 are still seeded but inert", () => {
    const guarded = findGuardedActions("media");

    // `read` joined this list with ADR-0026 step 5's read API. If it grows
    // again, the lifecycle routes have landed: update `unreachable` below AND
    // `media-permissions.ts`'s header, which states the same split in prose.
    expect([...guarded].sort()).toEqual(["cancel", "create", "read", "verify"]);

    const unreachable = Object.keys(MEDIA_PERMISSIONS).filter(
      (action) => !guarded.has(action)
    );

    // Each of these already has a working application function
    // (`attachNewsMediaObject`, `softDeleteNewsMediaObject`, ...) — only the
    // route is missing. So they are inert authority sitting on live code, which
    // is why granting one today is a no-op that silently becomes real later.
    expect(unreachable.sort()).toEqual([
      "attach",
      "delete",
      "detach",
      "purge",
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
