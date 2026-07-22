import { describe, expect, test } from "bun:test";

import { isLoginTenantPickerEnabled } from "../../src/lib/auth/login-tenant-picker";

describe("isLoginTenantPickerEnabled", () => {
  test("false when unset", () => {
    expect(isLoginTenantPickerEnabled({} as NodeJS.ProcessEnv)).toBe(false);
  });

  test('true only for the literal string "true"', () => {
    expect(
      isLoginTenantPickerEnabled({
        AUTH_LOGIN_TENANT_PICKER: "true"
      } as NodeJS.ProcessEnv)
    ).toBe(true);
    expect(
      isLoginTenantPickerEnabled({
        AUTH_LOGIN_TENANT_PICKER: "TRUE"
      } as NodeJS.ProcessEnv)
    ).toBe(false);
    expect(
      isLoginTenantPickerEnabled({
        AUTH_LOGIN_TENANT_PICKER: "1"
      } as NodeJS.ProcessEnv)
    ).toBe(false);
  });
});
