/**
 * The bootstrap command's decision table (`bun run bootstrap:default-tenant`).
 *
 * The SQL in that script is a straight-line application of this verdict, so
 * every branch that decides whether to WRITE to a live database is pinned
 * here — including the two that deliberately refuse to write.
 */
import { describe, expect, test } from "bun:test";

import {
  decideBootstrapAction,
  type BootstrapObservation,
  type BootstrapTarget
} from "../../scripts/bootstrap-default-tenant";

const target: BootstrapTarget = {
  tenantCode: "default",
  tenantName: "Default",
  ownerLogin: "admin@example.test",
  ownerDisplayName: "Owner",
  officeCode: "hq",
  officeName: "Head Office"
};

function observation(
  overrides: Partial<BootstrapObservation> = {}
): BootstrapObservation {
  return {
    initialized: true,
    actualTenantCode: "default",
    ownerIdentityExists: true,
    ownerHasFullAccess: true,
    ...overrides
  };
}

describe("bootstrap:default-tenant decision table", () => {
  test("an empty database is bootstrapped", () => {
    const verdict = decideBootstrapAction(
      {
        initialized: false,
        ownerIdentityExists: false,
        ownerHasFullAccess: false
      },
      target
    );

    expect(verdict.action).toBe("bootstrap");
  });

  test("a conforming database is left alone", () => {
    expect(decideBootstrapAction(observation(), target).action).toBe("none");
  });

  test("a missing owner is added", () => {
    const verdict = decideBootstrapAction(
      observation({ ownerIdentityExists: false, ownerHasFullAccess: false }),
      target
    );

    expect(verdict.action).toBe("add_owner");
  });

  test("an owner without every permission is topped up", () => {
    const verdict = decideBootstrapAction(
      observation({ ownerHasFullAccess: false }),
      target
    );

    expect(verdict.action).toBe("grant_full_access");
  });

  test("a different tenant code is reported, never renamed", () => {
    const verdict = decideBootstrapAction(
      observation({ actualTenantCode: "staging" }),
      target
    );

    // The tenant code is part of public URLs (`/blog/{tenantCode}`,
    // ADR-0009). Renaming it silently would break every existing link, so
    // this path must stay non-writing no matter how convenient it looks.
    expect(verdict.action).toBe("report_only");
    expect(verdict.reason).toContain("staging");
  });

  test("a tenant-code mismatch outranks a missing owner", () => {
    // Order matters: adding the owner to the WRONG tenant would look like
    // success while leaving the deployment non-conformant.
    const verdict = decideBootstrapAction(
      observation({ actualTenantCode: "staging", ownerIdentityExists: false }),
      target
    );

    expect(verdict.action).toBe("report_only");
  });

  test("an unknown tenant code is not treated as a mismatch", () => {
    // `actualTenantCode: undefined` means "not observed", which must not be
    // read as "different" — that would block a repair for no reason.
    const verdict = decideBootstrapAction(
      observation({ actualTenantCode: undefined, ownerIdentityExists: false }),
      target
    );

    expect(verdict.action).toBe("add_owner");
  });
});
