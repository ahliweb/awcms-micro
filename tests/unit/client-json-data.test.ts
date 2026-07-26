/**
 * `serializeClientJson` — the `</script>` breakout guard for the data islands
 * that hand SSR values to client scripts.
 *
 * Found by the review round on PR #374 (epic #373): `ClientJsonData.astro`
 * used bare `JSON.stringify`, which escapes nothing HTML-significant. No call
 * site was exploitable at the time, but the component is documented as taking
 * "any JSON-serializable payload" across 35 candidate admin pages — so this
 * pins the escape rather than the current call sites' good behaviour.
 */
import { describe, expect, test } from "bun:test";

import { serializeClientJson } from "../../src/lib/ui/client-json-data";

describe("serializeClientJson", () => {
  test("a payload containing </script> cannot close the data island", () => {
    const payload = { name: "</script><img src=x onerror=alert(1)>" };

    const serialized = serializeClientJson(payload);

    expect(serialized).not.toContain("</script>");
    expect(serialized).not.toContain("<");
  });

  test("escaping is a no-op for the parsed value", () => {
    const payload = {
      name: "</script><img src=x onerror=alert(1)>",
      nested: { markup: "<b>bold</b>", plain: "no markup here" },
      list: ["<a>", 1, true, null]
    };

    expect(JSON.parse(serializeClientJson(payload))).toEqual(payload);
  });

  test("payloads without markup are byte-identical to JSON.stringify", () => {
    // The common case must not change shape — every existing call site ships
    // translated sentences with quotes and apostrophes, not markup.
    const payload = {
      save: "Simpan",
      warn: "Anda yakin?",
      quote: 'He said "hi"'
    };

    expect(serializeClientJson(payload)).toBe(JSON.stringify(payload));
  });
});
