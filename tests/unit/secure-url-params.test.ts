import { describe, expect, test } from "bun:test";

import {
  openUrlParams,
  sealUrlParams
} from "../../src/lib/security/secure-url-params";

// Deterministic 32-byte test key (base64). Never a real deployment key.
const KEY = Buffer.alloc(32, 7);

describe("secure-url-params", () => {
  test("seals and opens a round trip", () => {
    const params = { token: "abc123", tenantId: "t-1" };
    const sealed = sealUrlParams(params, KEY);
    expect(sealed).toBeTruthy();
    expect(sealed!.startsWith("v1.")).toBe(true);
    // No structured `token=`/`tenantId=` leakage in the opaque token.
    expect(sealed).not.toContain("abc123");
    expect(openUrlParams(sealed!, KEY)).toEqual(params);
  });

  test("is randomized — same input yields different ciphertext", () => {
    const params = { token: "abc123", tenantId: "t-1" };
    const a = sealUrlParams(params, KEY);
    const b = sealUrlParams(params, KEY);
    expect(a).not.toBe(b);
    expect(openUrlParams(a!, KEY)).toEqual(params);
    expect(openUrlParams(b!, KEY)).toEqual(params);
  });

  test("returns null (no throw) with no key — callers fall back to plain params", () => {
    expect(sealUrlParams({ a: "b" }, null)).toBeNull();
    expect(openUrlParams("v1.x.y.z", null)).toBeNull();
  });

  test("fails closed on tampering", () => {
    const sealed = sealUrlParams({ token: "abc123" }, KEY)!;
    const parts = sealed.split(".");
    // Flip the last char of the ciphertext.
    const last = parts[3]!;
    parts[3] = last.slice(0, -1) + (last.at(-1) === "A" ? "B" : "A");
    expect(openUrlParams(parts.join("."), KEY)).toBeNull();
  });

  test("rejects a malformed token", () => {
    expect(openUrlParams("not-a-real-token", KEY)).toBeNull();
    expect(openUrlParams("v2.a.b.c", KEY)).toBeNull();
    expect(openUrlParams("", KEY)).toBeNull();
  });

  test("opening with the wrong key fails closed", () => {
    const sealed = sealUrlParams({ token: "abc123" }, KEY)!;
    expect(openUrlParams(sealed, Buffer.alloc(32, 9))).toBeNull();
  });
});
