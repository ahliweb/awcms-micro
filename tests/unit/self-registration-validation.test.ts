import { describe, expect, test } from "bun:test";

import { validateRegistrationInput } from "../../src/modules/identity-access/domain/self-registration-validation";

describe("validateRegistrationInput", () => {
  const valid = {
    displayName: "Ada Lovelace",
    loginIdentifier: "ada@example.com",
    password: "correct horse battery"
  };

  test("accepts a well-formed request and trims text fields", () => {
    const result = validateRegistrationInput({
      ...valid,
      displayName: "  Ada Lovelace  ",
      loginIdentifier: "  ada@example.com  "
    });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value.displayName).toBe("Ada Lovelace");
      expect(result.value.loginIdentifier).toBe("ada@example.com");
      expect(result.value.password).toBe(valid.password);
    }
  });

  test("rejects a short password", () => {
    const result = validateRegistrationInput({ ...valid, password: "short" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((e) => e.field === "password")).toBe(true);
    }
  });

  test("rejects missing display name and identifier", () => {
    const result = validateRegistrationInput({
      displayName: "   ",
      loginIdentifier: "",
      password: valid.password
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      const fields = result.errors.map((e) => e.field);
      expect(fields).toContain("displayName");
      expect(fields).toContain("loginIdentifier");
    }
  });

  test("never accepts a privilege field (roleIds is ignored)", () => {
    const result = validateRegistrationInput({
      ...valid,
      roleIds: ["11111111-1111-1111-1111-111111111111"]
    } as unknown);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect("roleIds" in result.value).toBe(false);
    }
  });

  test("rejects an over-long identifier", () => {
    const result = validateRegistrationInput({
      ...valid,
      loginIdentifier: `${"a".repeat(320)}@x.com`
    });
    expect(result.valid).toBe(false);
  });
});
