#!/usr/bin/env bun
/**
 * `bun run edge-cache:purge -- --host=<fqdn> [--path=<regex>]`
 * (Issue #353, ADR-0037).
 *
 * Operator-facing explicit invalidation. TTL expiry remains the primary
 * freshness contract — reach for this when the TTL bound is not acceptable
 * for a specific change (a retracted page, a corrected headline).
 *
 * `--host` is mandatory and is the tenant boundary in the cache key: a
 * purge can never reach beyond the hostname it names.
 */
import { purgeEdgeCache } from "../src/lib/cache/edge-cache-purge";
import { loadEdgeCacheConfig } from "../src/lib/cache/edge-cache-config";

function readFlag(name: string): string | undefined {
  const prefix = `--${name}=`;
  const match = process.argv.find((argument) => argument.startsWith(prefix));

  return match?.slice(prefix.length);
}

const host = readFlag("host");
const pathPattern = readFlag("path");

if (!host) {
  console.error(
    "Usage: bun run edge-cache:purge -- --host=<fqdn> [--path=<regex>]"
  );
  process.exit(2);
}

const config = loadEdgeCacheConfig();
const result = await purgeEdgeCache({ host, pathPattern }, config);

console.log(
  JSON.stringify(
    {
      check: "edge-cache-purge",
      host,
      pathPattern: pathPattern ?? "^/",
      result
    },
    null,
    2
  )
);

if (result.status !== "purged") {
  process.exitCode = 1;
}
