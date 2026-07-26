/**
 * Issue #372 — the three client-side validation branches of
 * `/admin/security`, now importable from
 * `modules/identity-access/presentation/security-admin-client.ts`.
 *
 * All three used to live inside that page's inline `<script>`, where no
 * test could reach them, and each one decides whether a mutation is even
 * attempted:
 *   - the break-glass guard is the client half of Issue #592's own
 *     acceptance criterion ("UI prevents enabling `sso_required` unless a
 *     valid break-glass local owner/account exists");
 *   - the two secret-choice predicates decide whether a provider's secret
 *     is stored inline or read from an env var.
 *
 * These are convenience layers, never the enforcement point — the server's
 * `saveTenantAuthPolicy` and the provider endpoints remain authoritative —
 * but a predicate that is backwards here rejects legitimate edits or waves
 * doomed ones through to a confusing 409.
 */
import { describe, expect, test } from "bun:test";

import {
  isCreateProviderSecretChoiceValid,
  isEditProviderSecretChoiceValid,
  parseDelimitedList,
  requiresBreakGlassOwner
} from "../../src/modules/identity-access/presentation/security-admin-client";

describe("parseDelimitedList (Issue #372)", () => {
  test("trims entries and drops empty ones", () => {
    expect(parseDelimitedList(" example.com , foo.test ,, ")).toEqual([
      "example.com",
      "foo.test"
    ]);
  });

  test('a missing or blank field is an empty list, never [""]', () => {
    expect(parseDelimitedList(null)).toEqual([]);
    expect(parseDelimitedList("")).toEqual([]);
    expect(parseDelimitedList("   ")).toEqual([]);
    expect(parseDelimitedList(",,,")).toEqual([]);
  });
});

describe("requiresBreakGlassOwner (Issue #372)", () => {
  test("requiring SSO requires a break-glass owner", () => {
    expect(
      requiresBreakGlassOwner({ passwordLoginEnabled: true, ssoRequired: true })
    ).toBe(true);
  });

  test("turning password login off requires a break-glass owner", () => {
    expect(
      requiresBreakGlassOwner({
        passwordLoginEnabled: false,
        ssoRequired: false
      })
    ).toBe(true);
  });

  test("both at once still requires one", () => {
    expect(
      requiresBreakGlassOwner({
        passwordLoginEnabled: false,
        ssoRequired: true
      })
    ).toBe(true);
  });

  test("password login on and SSO optional needs no break-glass owner", () => {
    expect(
      requiresBreakGlassOwner({
        passwordLoginEnabled: true,
        ssoRequired: false
      })
    ).toBe(false);
  });
});

describe("provider secret-source choice (Issue #372)", () => {
  test("create accepts exactly one source", () => {
    expect(isCreateProviderSecretChoiceValid("s3cret", "")).toBe(true);
    expect(isCreateProviderSecretChoiceValid("", "OIDC_CLIENT_SECRET")).toBe(
      true
    );
  });

  test("create rejects both sources at once", () => {
    expect(
      isCreateProviderSecretChoiceValid("s3cret", "OIDC_CLIENT_SECRET")
    ).toBe(false);
  });

  test("create rejects neither source — a new provider needs a secret", () => {
    expect(isCreateProviderSecretChoiceValid("", "")).toBe(false);
  });

  test("edit accepts neither source: the stored secret stays untouched", () => {
    expect(isEditProviderSecretChoiceValid("", "")).toBe(true);
  });

  test("edit accepts either single source", () => {
    expect(isEditProviderSecretChoiceValid("rotated", "")).toBe(true);
    expect(isEditProviderSecretChoiceValid("", "OIDC_CLIENT_SECRET")).toBe(
      true
    );
  });

  test("edit rejects both sources at once", () => {
    expect(isEditProviderSecretChoiceValid("rotated", "OIDC_SECRET")).toBe(
      false
    );
  });
});
