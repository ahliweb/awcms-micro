import { describe, expect, test } from "bun:test";

import { isSelfRegistrationEnabled } from "../../src/lib/auth/self-registration-config";

describe("isSelfRegistrationEnabled", () => {
  test("false when unset", () => {
    expect(isSelfRegistrationEnabled({} as NodeJS.ProcessEnv)).toBe(false);
  });

  test('true only for the literal string "true"', () => {
    expect(
      isSelfRegistrationEnabled({
        AUTH_SELF_REGISTRATION_ENABLED: "true"
      } as NodeJS.ProcessEnv)
    ).toBe(true);
    expect(
      isSelfRegistrationEnabled({
        AUTH_SELF_REGISTRATION_ENABLED: "1"
      } as NodeJS.ProcessEnv)
    ).toBe(false);
    expect(
      isSelfRegistrationEnabled({
        AUTH_SELF_REGISTRATION_ENABLED: "TRUE"
      } as NodeJS.ProcessEnv)
    ).toBe(false);
  });
});
