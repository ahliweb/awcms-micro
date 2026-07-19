/**
 * Unit tests for the bounded, non-recursive redirect-chain resolver + query policy
 * (Issue #268) — loop/self-redirect/chain-too-long prevention and status-code
 * combination. Pure, no DB (in-memory lookup map).
 */
import { describe, expect, test } from "bun:test";

import {
  combineChainStatus,
  MAX_REDIRECT_HOPS,
  resolveRedirectChain,
  type RedirectHopRule
} from "../../src/modules/seo-distribution/domain/redirect-chain";
import { applyRedirectQueryPolicy } from "../../src/modules/seo-distribution/domain/redirect-query-policy";

function hop(
  target: string,
  statusCode = 301,
  preserveQuery = false
): RedirectHopRule {
  return {
    id: target,
    targetType: target.startsWith("/")
      ? "relative_same_tenant"
      : "verified_external",
    target,
    statusCode: statusCode as RedirectHopRule["statusCode"],
    preserveQuery
  };
}

function lookupFrom(map: Record<string, RedirectHopRule>) {
  return (pathKey: string) => map[pathKey] ?? null;
}

describe("resolveRedirectChain", () => {
  test("no rule -> none", async () => {
    const out = await resolveRedirectChain("/x", lookupFrom({}));
    expect(out.outcome).toBe("none");
  });

  test("single hop -> redirect to target", async () => {
    const out = await resolveRedirectChain(
      "/a",
      lookupFrom({ "/a": hop("/b") })
    );
    expect(out.outcome).toBe("redirect");
    if (out.outcome === "redirect") {
      expect(out.finalTarget).toBe("/b");
      expect(out.statusCode).toBe(301);
    }
  });

  test("collapses a chain to the final destination", async () => {
    const out = await resolveRedirectChain(
      "/a",
      lookupFrom({ "/a": hop("/b"), "/b": hop("/c"), "/c": hop("/d") })
    );
    expect(out.outcome).toBe("redirect");
    if (out.outcome === "redirect") expect(out.finalTarget).toBe("/d");
  });

  test("self-redirect -> loop (fail closed)", async () => {
    const out = await resolveRedirectChain(
      "/a",
      lookupFrom({ "/a": hop("/a") })
    );
    expect(out.outcome).toBe("loop");
  });

  test("cycle A->B->A -> loop (fail closed)", async () => {
    const out = await resolveRedirectChain(
      "/a",
      lookupFrom({ "/a": hop("/b"), "/b": hop("/a") })
    );
    expect(out.outcome).toBe("loop");
  });

  test("chain longer than the cap -> chain_too_long (fail closed)", async () => {
    const map: Record<string, RedirectHopRule> = {};
    for (let i = 0; i < MAX_REDIRECT_HOPS + 3; i++) {
      map[`/p${i}`] = hop(`/p${i + 1}`);
    }
    const out = await resolveRedirectChain("/p0", lookupFrom(map));
    expect(out.outcome).toBe("chain_too_long");
  });

  test("an absolute (verified_external) target is terminal, not followed", async () => {
    const out = await resolveRedirectChain(
      "/a",
      lookupFrom({
        "/a": hop("https://tenant.example.com/x"),
        "/x": hop("/loop")
      })
    );
    expect(out.outcome).toBe("redirect");
    if (out.outcome === "redirect") {
      expect(out.finalTarget).toBe("https://tenant.example.com/x");
      expect(out.finalTargetType).toBe("verified_external");
    }
  });
});

describe("combineChainStatus", () => {
  test("all permanent -> first hop's permanent code", () => {
    expect(combineChainStatus([hop("/b", 301), hop("/c", 308)])).toBe(301);
    expect(combineChainStatus([hop("/b", 308), hop("/c", 301)])).toBe(308);
  });

  test("any temporary hop downgrades to a temporary code", () => {
    expect(combineChainStatus([hop("/b", 301), hop("/c", 302)])).toBe(302);
    expect(combineChainStatus([hop("/b", 308), hop("/c", 302)])).toBe(307);
  });

  test("single temporary hop keeps its own code", () => {
    expect(combineChainStatus([hop("/b", 302)])).toBe(302);
    expect(combineChainStatus([hop("/b", 307)])).toBe(307);
  });
});

describe("applyRedirectQueryPolicy", () => {
  test("drops the query by default", () => {
    expect(
      applyRedirectQueryPolicy({
        target: "/b",
        targetType: "relative_same_tenant",
        preserveQuery: false,
        incomingSearch: "?a=1"
      })
    ).toBe("/b");
  });

  test("preserves the query onto a relative target with no query of its own", () => {
    expect(
      applyRedirectQueryPolicy({
        target: "/b",
        targetType: "relative_same_tenant",
        preserveQuery: true,
        incomingSearch: "?a=1"
      })
    ).toBe("/b?a=1");
  });

  test("does not override a target that carries its own query", () => {
    expect(
      applyRedirectQueryPolicy({
        target: "/b?keep=1",
        targetType: "relative_same_tenant",
        preserveQuery: true,
        incomingSearch: "?a=1"
      })
    ).toBe("/b?keep=1");
  });

  test("never appends the incoming query to an absolute target", () => {
    expect(
      applyRedirectQueryPolicy({
        target: "https://tenant.example.com/x",
        targetType: "verified_external",
        preserveQuery: true,
        incomingSearch: "?a=1"
      })
    ).toBe("https://tenant.example.com/x");
  });
});
