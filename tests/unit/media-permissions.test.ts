import { describe, expect, test } from "bun:test";

import { mediaLibraryModule } from "../../src/modules/media-library/module";
import {
  MEDIA_PERMISSION_ACTIVITY_CODE,
  MEDIA_PERMISSIONS
} from "../../src/modules/media-library/domain/media-permissions";

describe("MEDIA_PERMISSIONS", () => {
  test("declares one key per required media lifecycle action (including cancel, added by Issue #634 for aborting a not-yet-uploaded session)", () => {
    expect(Object.keys(MEDIA_PERMISSIONS).sort()).toEqual(
      [
        "attach",
        "cancel",
        "create",
        "delete",
        "detach",
        "purge",
        "read",
        "restore",
        "verify"
      ].sort()
    );
  });

  test("every permission key follows the media_library.media.<action> shape", () => {
    for (const value of Object.values(MEDIA_PERMISSIONS)) {
      expect(value).toMatch(
        new RegExp(
          `^media_library\\.${MEDIA_PERMISSION_ACTIVITY_CODE}\\.[a-z]+$`
        )
      );
    }
  });

  test("module.ts now declares these as real permissions (Issue #634 added the endpoints that enforce them)", () => {
    // Previously (#633) `permissions` was deliberately left undeclared until
    // a real endpoint existed to enforce them. Issue #634 added the
    // presigned-upload-session endpoints (create/finalize/cancel) — see
    // ADR-0026 step 2: the owner is `media_library` now, not `news_portal`.
    // The exhaustive key-by-key match lives in
    // `tests/modules/media-library-module.test.ts`; this only pins that the
    // declared `media` permission COUNT tracks these constants, so adding a
    // constant without declaring it (or vice versa) fails here too.
    expect(mediaLibraryModule.permissions).toBeDefined();
    const mediaPermissions = mediaLibraryModule.permissions?.filter(
      (permission) => permission.activityCode === MEDIA_PERMISSION_ACTIVITY_CODE
    );
    expect(mediaPermissions?.length).toBe(
      Object.keys(MEDIA_PERMISSIONS).length
    );
  });
});
