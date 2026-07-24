/**
 * Minimal, dependency-free QR Code generator (Issue #587-#593 browser UX —
 * TOTP 2FA enrollment QR).
 *
 * Vendored so the strict Content-Security-Policy this app ships
 * (`astro.config.mjs`: `default-src 'self'`, no external script/img/connect
 * sources — see `src/lib/security/security-headers.ts`) is never violated:
 * there is NO external QR library, NO remote image, and NO `data:`/`blob:`
 * image load. The caller renders the returned boolean module matrix as an
 * INLINE `<svg>` built from same-document DOM nodes (a `<path>`), which is
 * not a resource fetch and so is unaffected by `default-src`/`img-src`.
 *
 * Algorithm adapted from Project Nayuki's "QR Code generator library"
 * (https://www.nayuki.io/page/qr-code-generator-library), released by the
 * author under the MIT License / into the public domain. Trimmed to
 * byte-mode encoding with automatic version (1-40) and mask selection —
 * everything a short ASCII `otpauth://` enrollment URI needs — and to a pure
 * matrix output plus an SVG-path helper (no `<canvas>`/DOM coupling here).
 *
 * Pure math/crypto-free, no I/O, fully unit-testable
 * (`tests/unit/qr-code.test.ts`).
 */

export type QrEccLevel = "L" | "M" | "Q" | "H";

const MIN_VERSION = 1;
const MAX_VERSION = 40;

// Penalty constants for the mask-selection heuristic (QR spec section 8.8.2).
const PENALTY_N1 = 3;
const PENALTY_N2 = 3;
const PENALTY_N3 = 40;
const PENALTY_N4 = 10;

const ECC_ORDINAL: Record<QrEccLevel, number> = { L: 0, M: 1, Q: 2, H: 3 };
// 2-bit format value per ECC level (NOT the same as the ordinal above).
const ECC_FORMAT_BITS: Record<QrEccLevel, number> = { L: 1, M: 0, Q: 3, H: 2 };

// Number of error-correction codewords per block, indexed [eccOrdinal][version].
// Index 0 (version placeholder) is an illegal value. Sourced verbatim from the
// QR Code specification tables (via Nayuki's reference implementation).
const ECC_CODEWORDS_PER_BLOCK: number[][] = [
  // prettier-ignore
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  // prettier-ignore
  [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  // prettier-ignore
  [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  // prettier-ignore
  [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
];

// Number of error-correction blocks, indexed [eccOrdinal][version].
const NUM_ERROR_CORRECTION_BLOCKS: number[][] = [
  // prettier-ignore
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  // prettier-ignore
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  // prettier-ignore
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  // prettier-ignore
  [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
];

function getBit(x: number, i: number): boolean {
  return ((x >>> i) & 1) !== 0;
}

/** Total number of data + EC modules available (excludes function patterns). */
function getNumRawDataModules(version: number): number {
  let result = (16 * version + 128) * version + 64;

  if (version >= 2) {
    const numAlign = Math.floor(version / 7) + 2;
    result -= (25 * numAlign - 10) * numAlign - 55;

    if (version >= 7) {
      result -= 36;
    }
  }

  return result;
}

/** Number of 8-bit data codewords (excludes error-correction codewords). */
function getNumDataCodewords(version: number, ecc: QrEccLevel): number {
  const ord = ECC_ORDINAL[ecc];

  return (
    Math.floor(getNumRawDataModules(version) / 8) -
    ECC_CODEWORDS_PER_BLOCK[ord]![version]! *
      NUM_ERROR_CORRECTION_BLOCKS[ord]![version]!
  );
}

/** Byte-mode character-count field width (bits) for a given version. */
function byteModeCharCountBits(version: number): number {
  return [8, 16, 16][Math.floor((version + 7) / 17)]!;
}

/** GF(256) multiply used by Reed-Solomon (reducing polynomial 0x11D). */
function reedSolomonMultiply(x: number, y: number): number {
  let z = 0;

  for (let i = 7; i >= 0; i -= 1) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }

  return z & 0xff;
}

/** Generator polynomial (Reed-Solomon divisor) of the given degree. */
function reedSolomonComputeDivisor(degree: number): number[] {
  const result: number[] = new Array(degree).fill(0);
  result[degree - 1] = 1;

  let root = 1;

  for (let i = 0; i < degree; i += 1) {
    for (let j = 0; j < result.length; j += 1) {
      result[j] = reedSolomonMultiply(result[j]!, root);

      if (j + 1 < result.length) {
        result[j] = result[j]! ^ result[j + 1]!;
      }
    }

    root = reedSolomonMultiply(root, 0x02);
  }

  return result;
}

/** Reed-Solomon remainder (the error-correction codewords) for `data`. */
function reedSolomonComputeRemainder(
  data: number[],
  divisor: number[]
): number[] {
  const result: number[] = divisor.map(() => 0);

  for (const b of data) {
    const factor = b ^ result.shift()!;
    result.push(0);
    divisor.forEach((coef, i) => {
      result[i] = result[i]! ^ reedSolomonMultiply(coef, factor);
    });
  }

  return result;
}

/**
 * An encoded QR Code as an immutable square boolean matrix. `get(x, y)` is
 * `true` for a dark module. `size` is `4 * version + 17`.
 */
export interface QrMatrix {
  readonly size: number;
  readonly version: number;
  get(x: number, y: number): boolean;
}

class QrCode implements QrMatrix {
  readonly size: number;
  private readonly modules: boolean[][];
  private readonly isFunction: boolean[][];

  constructor(
    readonly version: number,
    private readonly ecc: QrEccLevel,
    dataCodewords: number[]
  ) {
    if (version < MIN_VERSION || version > MAX_VERSION) {
      throw new RangeError("QR version out of range");
    }

    this.size = version * 4 + 17;
    this.modules = Array.from({ length: this.size }, () =>
      new Array<boolean>(this.size).fill(false)
    );
    this.isFunction = Array.from({ length: this.size }, () =>
      new Array<boolean>(this.size).fill(false)
    );

    this.drawFunctionPatterns();
    const allCodewords = this.addEccAndInterleave(dataCodewords);
    this.drawCodewords(allCodewords);

    // Automatic mask selection: pick the mask with the lowest penalty score.
    let minPenalty = Infinity;
    let bestMask = 0;

    for (let mask = 0; mask < 8; mask += 1) {
      this.applyMask(mask);
      this.drawFormatBits(mask);
      const penalty = this.getPenaltyScore();

      if (penalty < minPenalty) {
        bestMask = mask;
        minPenalty = penalty;
      }

      this.applyMask(mask); // XOR is its own inverse — undo before the next.
    }

    this.applyMask(bestMask);
    this.drawFormatBits(bestMask);
  }

  get(x: number, y: number): boolean {
    return (
      x >= 0 && x < this.size && y >= 0 && y < this.size && this.modules[y]![x]!
    );
  }

  private setFunctionModule(x: number, y: number, isDark: boolean): void {
    this.modules[y]![x] = isDark;
    this.isFunction[y]![x] = true;
  }

  private drawFunctionPatterns(): void {
    for (let i = 0; i < this.size; i += 1) {
      this.setFunctionModule(6, i, i % 2 === 0);
      this.setFunctionModule(i, 6, i % 2 === 0);
    }

    this.drawFinderPattern(3, 3);
    this.drawFinderPattern(this.size - 4, 3);
    this.drawFinderPattern(3, this.size - 4);

    const alignPatPos = this.getAlignmentPatternPositions();
    const numAlign = alignPatPos.length;

    for (let i = 0; i < numAlign; i += 1) {
      for (let j = 0; j < numAlign; j += 1) {
        if (!(
          (i === 0 && j === 0) ||
          (i === 0 && j === numAlign - 1) ||
          (i === numAlign - 1 && j === 0)
        )) {
          this.drawAlignmentPattern(alignPatPos[i]!, alignPatPos[j]!);
        }
      }
    }

    // Placeholder format/version bits — overwritten with the real mask below.
    this.drawFormatBits(0);
    this.drawVersion();
  }

  private drawFinderPattern(x: number, y: number): void {
    for (let dy = -4; dy <= 4; dy += 1) {
      for (let dx = -4; dx <= 4; dx += 1) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const xx = x + dx;
        const yy = y + dy;

        if (xx >= 0 && xx < this.size && yy >= 0 && yy < this.size) {
          this.setFunctionModule(xx, yy, dist !== 2 && dist !== 4);
        }
      }
    }
  }

  private drawAlignmentPattern(x: number, y: number): void {
    for (let dy = -2; dy <= 2; dy += 1) {
      for (let dx = -2; dx <= 2; dx += 1) {
        this.setFunctionModule(
          x + dx,
          y + dy,
          Math.max(Math.abs(dx), Math.abs(dy)) !== 1
        );
      }
    }
  }

  private getAlignmentPatternPositions(): number[] {
    if (this.version === 1) {
      return [];
    }

    const numAlign = Math.floor(this.version / 7) + 2;
    const step =
      this.version === 32
        ? 26
        : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2;
    const result = [6];

    for (let pos = this.size - 7; result.length < numAlign; pos -= step) {
      result.splice(1, 0, pos);
    }

    return result;
  }

  private drawFormatBits(mask: number): void {
    const data = (ECC_FORMAT_BITS[this.ecc] << 3) | mask;
    let rem = data;

    for (let i = 0; i < 10; i += 1) {
      rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    }

    const bits = ((data << 10) | rem) ^ 0x5412;

    for (let i = 0; i <= 5; i += 1) {
      this.setFunctionModule(8, i, getBit(bits, i));
    }

    this.setFunctionModule(8, 7, getBit(bits, 6));
    this.setFunctionModule(8, 8, getBit(bits, 7));
    this.setFunctionModule(7, 8, getBit(bits, 8));

    for (let i = 9; i < 15; i += 1) {
      this.setFunctionModule(14 - i, 8, getBit(bits, i));
    }

    for (let i = 0; i < 8; i += 1) {
      this.setFunctionModule(this.size - 1 - i, 8, getBit(bits, i));
    }

    for (let i = 8; i < 15; i += 1) {
      this.setFunctionModule(8, this.size - 15 + i, getBit(bits, i));
    }

    this.setFunctionModule(8, this.size - 8, true);
  }

  private drawVersion(): void {
    if (this.version < 7) {
      return;
    }

    let rem = this.version;

    for (let i = 0; i < 12; i += 1) {
      rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    }

    const bits = (this.version << 12) | rem;

    for (let i = 0; i < 18; i += 1) {
      const color = getBit(bits, i);
      const a = this.size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      this.setFunctionModule(a, b, color);
      this.setFunctionModule(b, a, color);
    }
  }

  private addEccAndInterleave(data: number[]): number[] {
    const ord = ECC_ORDINAL[this.ecc];
    const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[ord]![this.version]!;
    const blockEccLen = ECC_CODEWORDS_PER_BLOCK[ord]![this.version]!;
    const rawCodewords = Math.floor(getNumRawDataModules(this.version) / 8);
    const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
    const shortBlockLen = Math.floor(rawCodewords / numBlocks);

    const blocks: number[][] = [];
    const rsDiv = reedSolomonComputeDivisor(blockEccLen);

    for (let i = 0, k = 0; i < numBlocks; i += 1) {
      const dat = data.slice(
        k,
        k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1)
      );
      k += dat.length;
      const eccBytes = reedSolomonComputeRemainder(dat, rsDiv);

      if (i < numShortBlocks) {
        dat.push(0);
      }

      blocks.push(dat.concat(eccBytes));
    }

    const result: number[] = [];

    for (let i = 0; i < blocks[0]!.length; i += 1) {
      blocks.forEach((block, j) => {
        // Skip the padding placeholder byte in every short block.
        if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) {
          result.push(block[i]!);
        }
      });
    }

    return result;
  }

  private drawCodewords(data: number[]): void {
    let i = 0;

    for (let right = this.size - 1; right >= 1; right -= 2) {
      if (right === 6) {
        right = 5;
      }

      for (let vert = 0; vert < this.size; vert += 1) {
        for (let j = 0; j < 2; j += 1) {
          const x = right - j;
          const upward = ((right + 1) & 2) === 0;
          const y = upward ? this.size - 1 - vert : vert;

          if (!this.isFunction[y]![x] && i < data.length * 8) {
            this.modules[y]![x] = getBit(data[i >>> 3]!, 7 - (i & 7));
            i += 1;
          }
        }
      }
    }
  }

  private applyMask(mask: number): void {
    for (let y = 0; y < this.size; y += 1) {
      for (let x = 0; x < this.size; x += 1) {
        let invert: boolean;

        switch (mask) {
          case 0:
            invert = (x + y) % 2 === 0;
            break;
          case 1:
            invert = y % 2 === 0;
            break;
          case 2:
            invert = x % 3 === 0;
            break;
          case 3:
            invert = (x + y) % 3 === 0;
            break;
          case 4:
            invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
            break;
          case 5:
            invert = ((x * y) % 2) + ((x * y) % 3) === 0;
            break;
          case 6:
            invert = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
            break;
          case 7:
            invert = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
            break;
          default:
            throw new RangeError("Mask out of range");
        }

        if (!this.isFunction[y]![x] && invert) {
          this.modules[y]![x] = !this.modules[y]![x];
        }
      }
    }
  }

  private getPenaltyScore(): number {
    let result = 0;

    // Rows: runs of same color + finder-like patterns.
    for (let y = 0; y < this.size; y += 1) {
      let runColor = false;
      let runX = 0;
      const runHistory = [0, 0, 0, 0, 0, 0, 0];

      for (let x = 0; x < this.size; x += 1) {
        if (this.modules[y]![x] === runColor) {
          runX += 1;

          if (runX === 5) {
            result += PENALTY_N1;
          } else if (runX > 5) {
            result += 1;
          }
        } else {
          this.finderPenaltyAddHistory(runX, runHistory);

          if (!runColor) {
            result += this.finderPenaltyCountPatterns(runHistory) * PENALTY_N3;
          }

          runColor = this.modules[y]![x]!;
          runX = 1;
        }
      }

      result +=
        this.finderPenaltyTerminateAndCount(runColor, runX, runHistory) *
        PENALTY_N3;
    }

    // Columns.
    for (let x = 0; x < this.size; x += 1) {
      let runColor = false;
      let runY = 0;
      const runHistory = [0, 0, 0, 0, 0, 0, 0];

      for (let y = 0; y < this.size; y += 1) {
        if (this.modules[y]![x] === runColor) {
          runY += 1;

          if (runY === 5) {
            result += PENALTY_N1;
          } else if (runY > 5) {
            result += 1;
          }
        } else {
          this.finderPenaltyAddHistory(runY, runHistory);

          if (!runColor) {
            result += this.finderPenaltyCountPatterns(runHistory) * PENALTY_N3;
          }

          runColor = this.modules[y]![x]!;
          runY = 1;
        }
      }

      result +=
        this.finderPenaltyTerminateAndCount(runColor, runY, runHistory) *
        PENALTY_N3;
    }

    // 2x2 blocks of one color.
    for (let y = 0; y < this.size - 1; y += 1) {
      for (let x = 0; x < this.size - 1; x += 1) {
        const color = this.modules[y]![x];

        if (
          color === this.modules[y]![x + 1] &&
          color === this.modules[y + 1]![x] &&
          color === this.modules[y + 1]![x + 1]
        ) {
          result += PENALTY_N2;
        }
      }
    }

    // Balance of dark vs. light modules.
    let dark = 0;

    for (const row of this.modules) {
      dark = row.reduce((sum, color) => sum + (color ? 1 : 0), dark);
    }

    const total = this.size * this.size;
    const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
    result += k * PENALTY_N4;

    return result;
  }

  private finderPenaltyCountPatterns(runHistory: number[]): number {
    const n = runHistory[1]!;
    const core =
      n > 0 &&
      runHistory[2] === n &&
      runHistory[3] === n * 3 &&
      runHistory[4] === n &&
      runHistory[5] === n;

    return (
      (core && runHistory[0]! >= n * 4 && runHistory[6]! >= n ? 1 : 0) +
      (core && runHistory[6]! >= n * 4 && runHistory[0]! >= n ? 1 : 0)
    );
  }

  private finderPenaltyTerminateAndCount(
    currentRunColor: boolean,
    currentRunLength: number,
    runHistory: number[]
  ): number {
    let runLength = currentRunLength;

    if (currentRunColor) {
      this.finderPenaltyAddHistory(runLength, runHistory);
      runLength = 0;
    }

    runLength += this.size;
    this.finderPenaltyAddHistory(runLength, runHistory);

    return this.finderPenaltyCountPatterns(runHistory);
  }

  private finderPenaltyAddHistory(
    currentRunLength: number,
    runHistory: number[]
  ): void {
    let runLength = currentRunLength;

    if (runHistory[0] === 0) {
      runLength += this.size;
    }

    runHistory.pop();
    runHistory.unshift(runLength);
  }
}

/**
 * Encodes `text` (UTF-8, byte mode) into a QR Code matrix, choosing the
 * smallest version (1-40) that fits at the requested error-correction level.
 * Throws if the text is too long for any version at that level.
 */
export function encodeQrByteMode(
  text: string,
  ecc: QrEccLevel = "M"
): QrMatrix {
  const bytes = Array.from(new TextEncoder().encode(text));
  const dataBitLen = bytes.length * 8;

  let version = MIN_VERSION;

  for (; ; version += 1) {
    if (version > MAX_VERSION) {
      throw new RangeError("Data too long for a QR Code");
    }

    const capacityBits = getNumDataCodewords(version, ecc) * 8;
    const usedBits = 4 + byteModeCharCountBits(version) + dataBitLen;

    if (usedBits <= capacityBits) {
      break;
    }
  }

  // Build the bit stream: mode indicator (0b0100) + char count + data bytes.
  const bits: number[] = [];
  const appendBits = (value: number, len: number): void => {
    for (let i = len - 1; i >= 0; i -= 1) {
      bits.push((value >>> i) & 1);
    }
  };

  appendBits(0x4, 4);
  appendBits(bytes.length, byteModeCharCountBits(version));

  for (const b of bytes) {
    appendBits(b, 8);
  }

  const dataCapacityBits = getNumDataCodewords(version, ecc) * 8;

  // Terminator (up to 4 zero bits), then pad to a byte boundary.
  appendBits(0, Math.min(4, dataCapacityBits - bits.length));
  appendBits(0, (8 - (bits.length % 8)) % 8);

  // Pad with alternating 0xEC / 0x11 bytes until full.
  for (let pad = 0xec; bits.length < dataCapacityBits; pad ^= 0xec ^ 0x11) {
    appendBits(pad, 8);
  }

  // Pack bits into codeword bytes.
  const dataCodewords: number[] = new Array(bits.length >>> 3).fill(0);

  for (let i = 0; i < bits.length; i += 1) {
    dataCodewords[i >>> 3]! |= bits[i]! << (7 - (i & 7));
  }

  return new QrCode(version, ecc, dataCodewords);
}

/**
 * Builds an SVG `<path d="...">` string covering every dark module, plus the
 * dimension of the (quiet-zone-padded) square viewBox. The caller sets this
 * on a same-document `<path>` node inside an inline `<svg>` — no resource is
 * fetched, so the strict CSP is never engaged.
 */
export function qrToSvgPath(
  qr: QrMatrix,
  border = 4
): { pathData: string; dimension: number } {
  if (border < 0) {
    throw new RangeError("Border must be non-negative");
  }

  const parts: string[] = [];

  for (let y = 0; y < qr.size; y += 1) {
    for (let x = 0; x < qr.size; x += 1) {
      if (qr.get(x, y)) {
        parts.push(`M${x + border},${y + border}h1v1h-1Z`);
      }
    }
  }

  return {
    pathData: parts.join(" "),
    dimension: qr.size + border * 2
  };
}
