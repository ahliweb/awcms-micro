/**
 * Unit tests for the vendored QR Code generator (`src/lib/ui/qr-code.ts`),
 * used to render the TOTP 2FA enrollment QR as inline SVG under the app's
 * strict CSP (full-online auth hardening browser UX, epic #587-#593).
 *
 * There is no QR *decoder* in this repo to prove scannability directly, so
 * these assert independently-verifiable structural invariants of a valid QR
 * symbol instead: the three 7x7 finder patterns, the alternating timing
 * patterns, the always-dark module, correct version/size selection, and — the
 * strongest black-box check — that the encoded format-information bits are a
 * self-consistent BCH(15,5) codeword encoding the requested error-correction
 * level. A structurally-broken matrix fails at least one of these.
 */
import { describe, expect, test } from "bun:test";

import {
  encodeQrByteMode,
  qrToSvgPath,
  type QrMatrix
} from "../../src/lib/ui/qr-code";

const SAMPLE_OTPAUTH =
  "otpauth://totp/AWCMS-Micro:owner@example.com?secret=JBSWY3DPEHPK3PXP" +
  "&issuer=AWCMS-Micro&digits=6&period=30&algorithm=SHA1";

/** Reads the 15 stored format-info bits from the first copy (per QR spec). */
function readFormatBits(qr: QrMatrix): number {
  let value = 0;
  const set = (dark: boolean, i: number): void => {
    if (dark) value |= 1 << i;
  };

  for (let i = 0; i <= 5; i += 1) {
    set(qr.get(8, i), i);
  }
  set(qr.get(8, 7), 6);
  set(qr.get(8, 8), 7);
  set(qr.get(7, 8), 8);
  for (let i = 9; i < 15; i += 1) {
    set(qr.get(14 - i, 8), i);
  }

  return value;
}

/** True if a 7x7 finder pattern is centred at (cx, cy). */
function hasFinderPattern(qr: QrMatrix, cx: number, cy: number): boolean {
  for (let dy = -3; dy <= 3; dy += 1) {
    for (let dx = -3; dx <= 3; dx += 1) {
      const dist = Math.max(Math.abs(dx), Math.abs(dy));
      const expected = dist !== 2; // dark ring except the one-module light ring
      if (qr.get(cx + dx, cy + dy) !== expected) {
        return false;
      }
    }
  }

  return true;
}

describe("encodeQrByteMode", () => {
  test("selects the smallest version whose size matches 4*version+17", () => {
    const qr = encodeQrByteMode("HELLO", "M");
    expect(qr.version).toBe(1);
    expect(qr.size).toBe(4 * qr.version + 17);
  });

  test("encodes a realistic otpauth URI into a modest version", () => {
    const qr = encodeQrByteMode(SAMPLE_OTPAUTH, "M");
    expect(qr.version).toBeGreaterThanOrEqual(1);
    expect(qr.version).toBeLessThanOrEqual(15);
    expect(qr.size).toBe(4 * qr.version + 17);
  });

  test("places all three finder patterns at the corners", () => {
    const qr = encodeQrByteMode(SAMPLE_OTPAUTH, "M");
    expect(hasFinderPattern(qr, 3, 3)).toBe(true);
    expect(hasFinderPattern(qr, qr.size - 4, 3)).toBe(true);
    expect(hasFinderPattern(qr, 3, qr.size - 4)).toBe(true);
  });

  test("draws alternating timing patterns on row/column 6", () => {
    const qr = encodeQrByteMode(SAMPLE_OTPAUTH, "M");
    for (let i = 8; i < qr.size - 8; i += 1) {
      expect(qr.get(i, 6)).toBe(i % 2 === 0);
      expect(qr.get(6, i)).toBe(i % 2 === 0);
    }
  });

  test("sets the always-dark module below the top-left finder", () => {
    const qr = encodeQrByteMode(SAMPLE_OTPAUTH, "M");
    expect(qr.get(8, qr.size - 8)).toBe(true);
  });

  test("format bits are a valid BCH codeword encoding the ECC level", () => {
    // ECC 'M' has the 2-bit format value 0 (NOT the ordinal 1).
    for (const [ecc, formatBits] of [
      ["L", 1],
      ["M", 0],
      ["Q", 3],
      ["H", 2]
    ] as const) {
      const qr = encodeQrByteMode(SAMPLE_OTPAUTH, ecc);
      const unmasked = readFormatBits(qr) ^ 0x5412;
      const data = unmasked >>> 10;

      // Recompute the 10-bit BCH remainder and confirm it matches — proves the
      // stored 15 bits are a self-consistent format-info codeword.
      let rem = data;
      for (let i = 0; i < 10; i += 1) {
        rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      }
      expect(((data << 10) | rem) >>> 0).toBe(unmasked >>> 0);

      expect(data >>> 3).toBe(formatBits); // ECC level bits
      const mask = data & 7;
      expect(mask).toBeGreaterThanOrEqual(0);
      expect(mask).toBeLessThanOrEqual(7);
    }
  });

  test("is deterministic for the same input", () => {
    const a = encodeQrByteMode(SAMPLE_OTPAUTH, "M");
    const b = encodeQrByteMode(SAMPLE_OTPAUTH, "M");
    expect(a.size).toBe(b.size);
    for (let y = 0; y < a.size; y += 1) {
      for (let x = 0; x < a.size; x += 1) {
        expect(a.get(x, y)).toBe(b.get(x, y));
      }
    }
  });

  test("throws when the data cannot fit any version", () => {
    expect(() => encodeQrByteMode("x".repeat(5000), "H")).toThrow();
  });
});

describe("qrToSvgPath", () => {
  test("pads the viewBox by the quiet-zone border and emits path segments", () => {
    const qr = encodeQrByteMode("HELLO", "M");
    const { pathData, dimension } = qrToSvgPath(qr, 4);
    expect(dimension).toBe(qr.size + 8);
    expect(pathData.length).toBeGreaterThan(0);
    // Every dark module contributes one "M..h1v1h-1Z" sub-path.
    const darkCount = pathData.split("Z").length - 1;
    let expected = 0;
    for (let y = 0; y < qr.size; y += 1) {
      for (let x = 0; x < qr.size; x += 1) {
        if (qr.get(x, y)) expected += 1;
      }
    }
    expect(darkCount).toBe(expected);
  });

  test("rejects a negative border", () => {
    const qr = encodeQrByteMode("HELLO", "M");
    expect(() => qrToSvgPath(qr, -1)).toThrow();
  });
});
