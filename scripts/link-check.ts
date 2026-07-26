#!/usr/bin/env bun
/**
 * `bun run link:check -- --url=https://example.test/` (Issue #296, epic #261).
 *
 * Operator-runnable broken-link check over the RENDERED site: crawls the
 * public page graph from an entry URL, seeded additionally by `robots.txt`
 * and the XML sitemap(s), and reports every internal, SEO or feed link that
 * does not resolve.
 *
 * WHY A SCRIPT AND NOT ONLY THE E2E SPEC
 * --------------------------------------
 * `tests/e2e/public-link-crawl.e2e.ts` proves link integrity for the
 * HERMETIC page set a test database can produce — a handful of pages with
 * no published content. The links that actually break in the field are the
 * ones only a populated site has: a sitemap `<loc>` pointing at a post that
 * was unpublished, a canonical URL still naming a retired domain, an
 * hreflang alternate for a translation that was never published, a feed
 * autodiscovery `<link>` whose route is 404 because the module got
 * disabled. None of those exist in CI, and none of them are visible to a
 * test that can only reach what it seeded itself. This command runs the
 * same check against ANY deployed URL, so the operator can verify a real
 * site (staging, production, a customer's tenant domain) without a
 * database, credentials, or a checkout of its content.
 *
 * WHAT IS CHECKED
 *   - every same-origin `<a href>` the crawled pages render;
 *   - `<link rel="canonical">` and every `<link rel="alternate" hreflang>`
 *     (the SEO graph — a broken canonical is invisible to a human but
 *     de-indexes the page);
 *   - feed autodiscovery links (`<link rel="alternate" type="…rss+xml|
 *     atom+xml|feed+json">`);
 *   - every `Sitemap:` URL declared in `robots.txt`, every sitemap in a
 *     sitemap INDEX, and every `<loc>` inside each sitemap;
 *   - `rel="next"`/`rel="prev"` pagination links.
 *
 * Non-HTML targets (feeds, sitemaps, images, downloads) are VERIFIED but
 * never crawled for further links; only same-origin HTML pages are
 * expanded. Cross-origin links are skipped by default (`--include-external`
 * turns them into checked-but-never-crawled targets) — an unreachable third
 * party is not this site's defect and would make the check flaky.
 *
 * "Broken" means: the request failed, or the response status is >= 400
 * AFTER following redirects. A redirect chain that ends in a 404 is broken;
 * one that ends in a 200 is not (it is reported as `redirected` in the
 * verbose link list, not as a failure — permanent redirects are how a site
 * is supposed to move a URL).
 *
 * Read-only: only GET requests, no writes, no auth. Safe against production.
 *
 * Exit codes: 0 = no broken links; 1 = broken links found; 2 = usage error
 * or the entry URL itself is unreachable (nothing was actually checked —
 * deliberately NOT reported as "no broken links found").
 *
 * Machine-readable JSON goes to STDOUT (like `edge-cache:verify`); pass
 * `--json-output=<path>` to also write it to a file for an evidence
 * artifact.
 *
 * `--site-origin=<origin>` exists because this app writes ABSOLUTE canonical,
 * hreflang and sitemap URLs using the tenant's own primary domain. Checking a
 * deployment through any other address (a staging host, an internal IP behind
 * the CDN, `localhost` before DNS is cut over) would otherwise classify every
 * one of those links as "external" and silently skip exactly the links this
 * command exists to check. Give it the origin the site believes it is served
 * from and those links become internal: they are probed against `--url`'s
 * origin, path and query preserved, and the `Host` header defaults to the
 * site origin's hostname so host-based tenant resolution still resolves.
 */

import { logScriptFailure } from "../src/lib/logging/error-log";

function readFlag(name: string): string | undefined {
  const prefix = `--${name}=`;
  const match = process.argv.find((argument) => argument.startsWith(prefix));

  return match?.slice(prefix.length);
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function readNumberFlag(name: string, fallback: number): number {
  const raw = readFlag(name);
  if (raw === undefined) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    console.error(`--${name} must be a positive number (got ${raw})`);
    process.exit(2);
  }
  return parsed;
}

const rawUrl = readFlag("url");

if (!rawUrl) {
  console.error(
    "Usage: bun run link:check -- --url=<public url> [--site-origin=<origin>] " +
      "[--host=<fqdn>] [--max-pages=100] [--concurrency=4] " +
      "[--timeout-ms=10000] [--include-external] [--json-output=<path>]"
  );
  process.exit(2);
}

let entry: URL;

try {
  entry = new URL(rawUrl);
} catch {
  console.error(`--url is not a valid URL: ${rawUrl}`);
  process.exit(2);
}

const entryOrigin = entry.origin;

const rawSiteOrigin = readFlag("site-origin");
let siteOrigin: string | null = null;
if (rawSiteOrigin !== undefined) {
  try {
    siteOrigin = new URL(rawSiteOrigin).origin;
  } catch {
    console.error(`--site-origin is not a valid URL: ${rawSiteOrigin}`);
    process.exit(2);
  }
}

/**
 * The site may resolve its tenant by request host (awcms-micro's
 * `PUBLIC_TENANT_RESOLUTION_MODE=host_default`), so probing an internal
 * address while presenting the public hostname has to be possible — same
 * `--host` escape hatch `edge-cache:verify` provides. When `--site-origin`
 * is given it also supplies the default `Host`, since a link on that origin
 * is only meaningful to the server if it is asked for under that name.
 */
const hostHeader =
  readFlag("host") ?? (siteOrigin ? new URL(siteOrigin).hostname : undefined);
const maxPages = readNumberFlag("max-pages", 100);
const concurrency = readNumberFlag("concurrency", 4);
const timeoutMs = readNumberFlag("timeout-ms", 10_000);
const includeExternal = hasFlag("include-external");
const jsonOutput = readFlag("json-output");

type LinkKind =
  | "anchor"
  | "canonical"
  | "alternate"
  | "feed"
  | "pagination"
  | "sitemap"
  | "sitemap-loc"
  | "robots-sitemap"
  | "entry";

type Target = {
  /** The link exactly as the site published it — what gets reported. */
  url: string;
  /** Where it is actually fetched from (differs only under `--site-origin`). */
  probeUrl: string;
  kind: LinkKind;
  /** The page (or sitemap/robots document) this link was found on. */
  foundOn: string;
  /** Internal HTML pages are expanded; everything else is only verified. */
  crawl: boolean;
};

type Probe = {
  url: string;
  kind: LinkKind;
  foundOn: string;
  status: number | null;
  finalUrl: string | null;
  contentType: string | null;
  redirected: boolean;
  error?: string;
  body?: string;
};

const requestHeaders: Record<string, string> = {
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "user-agent": "awcms-micro-link-check/1"
};
if (hostHeader) requestHeaders["Host"] = hostHeader;

/**
 * One GET per target. `redirect: "follow"` on purpose — the question this
 * command answers is "does this link take a visitor somewhere", and the
 * answer for a 301 is yes.
 */
async function probe(target: Target, wantBody: boolean): Promise<Probe> {
  const base: Omit<
    Probe,
    "status" | "finalUrl" | "contentType" | "redirected"
  > = {
    url: target.url,
    kind: target.kind,
    foundOn: target.foundOn
  };

  try {
    const response = await fetch(target.probeUrl, {
      headers: requestHeaders,
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs)
    });
    const contentType = response.headers.get("content-type");
    const body =
      wantBody && response.status < 400 ? await response.text() : undefined;
    if (body === undefined) {
      // Drain so the connection is released before the next probe.
      await response.arrayBuffer();
    }

    const finalUrl = response.url || target.probeUrl;

    return {
      ...base,
      status: response.status,
      finalUrl,
      contentType,
      redirected: finalUrl !== target.probeUrl,
      body
    };
  } catch (error) {
    return {
      ...base,
      status: null,
      finalUrl: null,
      contentType: null,
      redirected: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * `&amp;` MUST be decoded LAST. Decoding it first would let a literal
 * `&amp;lt;` collapse all the way to `<` (double-unescaping, CodeQL
 * js/double-escaping) — same ordering rule the SEO integration test uses.
 */
function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

/** Schemes that are not navigable HTTP(S) links. */
/** `URL` with any `user:pass@` stripped — never log what the operator typed. */
function redactUrlUserinfo(url: URL): string {
  const copy = new URL(url.toString());
  copy.username = "";
  copy.password = "";
  return copy.toString();
}

function isNavigableHref(href: string): boolean {
  if (href.length === 0) return false;
  if (href.startsWith("#")) return false;
  const lower = href.toLowerCase();
  // ALLOW-list, not a deny-list. The deny-list this replaced missed `file:`,
  // so with `--include-external` a crawled page could point this crawler at
  // the operator's own filesystem. Anything that is not an http(s) absolute
  // URL or a relative reference is simply not a link this tool follows.
  const schemeMatch = /^([a-z][a-z0-9+.-]*):/.exec(lower);
  if (schemeMatch) {
    return schemeMatch[1] === "http" || schemeMatch[1] === "https";
  }
  // No scheme = relative reference (resolved against the current page).
  // Protocol-relative `//host/path` inherits the entry scheme, so it is fine.
  return true;
}

type Tag = { name: string; raw: string };

/**
 * Single-pass tag scanner. Comments, CDATA, `<script>` and `<style>` bodies
 * are SKIPPED as the scan walks past them — deliberately not stripped by a
 * chain of `.replace()` calls and re-scanned, which produces both wrong
 * results on nested markup and a CodeQL
 * js/incomplete-multi-character-sanitization alert.
 */
function scanTags(html: string, wanted: ReadonlySet<string>): Tag[] {
  const tags: Tag[] = [];
  let index = 0;

  while (index < html.length) {
    const open = html.indexOf("<", index);
    if (open === -1) break;

    if (html.startsWith("<!--", open)) {
      const end = html.indexOf("-->", open + 4);
      index = end === -1 ? html.length : end + 3;
      continue;
    }
    if (html.startsWith("<![CDATA[", open)) {
      const end = html.indexOf("]]>", open + 9);
      index = end === -1 ? html.length : end + 3;
      continue;
    }

    const close = html.indexOf(">", open);
    if (close === -1) break;
    const raw = html.slice(open, close + 1);
    const nameMatch = /^<\/?\s*([a-zA-Z][a-zA-Z0-9-]*)/.exec(raw);
    const name = nameMatch ? nameMatch[1]!.toLowerCase() : "";

    if ((name === "script" || name === "style") && !raw.startsWith("</")) {
      // Skip the raw-text element's whole body — its contents are not markup.
      const endTag = `</${name}`;
      const end = html.toLowerCase().indexOf(endTag, close + 1);
      index = end === -1 ? html.length : end;
      continue;
    }

    if (wanted.has(name)) tags.push({ name, raw });
    index = close + 1;
  }

  return tags;
}

function attr(tag: string, name: string): string | null {
  const match = new RegExp(
    `\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s"'>]+))`,
    "i"
  ).exec(tag);
  if (!match) return null;
  return decodeEntities(match[2] ?? match[3] ?? match[4] ?? "");
}

const FEED_TYPES = ["rss+xml", "atom+xml", "feed+json"];

/** Every link an HTML page contributes to the graph, with its kind. */
function extractHtmlLinks(
  html: string,
  pageUrl: string
): { href: string; kind: LinkKind }[] {
  const out: { href: string; kind: LinkKind }[] = [];

  for (const tag of scanTags(html, new Set(["a", "link"]))) {
    const href = attr(tag.raw, "href");
    if (!href || !isNavigableHref(href)) continue;

    if (tag.name === "a") {
      out.push({ href, kind: "anchor" });
      continue;
    }

    const rel = (attr(tag.raw, "rel") ?? "").toLowerCase();
    const type = (attr(tag.raw, "type") ?? "").toLowerCase();
    if (rel.includes("canonical")) {
      out.push({ href, kind: "canonical" });
    } else if (FEED_TYPES.some((feedType) => type.includes(feedType))) {
      out.push({ href, kind: "feed" });
    } else if (rel.includes("alternate")) {
      out.push({ href, kind: "alternate" });
    } else if (rel.includes("next") || rel.includes("prev")) {
      out.push({ href, kind: "pagination" });
    }
  }

  void pageUrl;
  return out;
}

/** `<loc>` values of a sitemap or sitemap index. */
function extractSitemapLocs(xml: string): string[] {
  const locs: string[] = [];
  const pattern = /<loc>([\s\S]*?)<\/loc>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(xml)) !== null) {
    const value = decodeEntities(match[1]!.trim());
    if (value.length > 0) locs.push(value);
  }
  return locs;
}

function isSitemapIndex(xml: string): boolean {
  return /<sitemapindex[\s>]/i.test(xml);
}

/** `Sitemap: <url>` directives in a robots.txt. */
function extractRobotsSitemaps(text: string): string[] {
  const out: string[] = [];
  for (const line of text.split("\n")) {
    const match = /^\s*sitemap\s*:\s*(\S+)/i.exec(line);
    if (match) out.push(match[1]!);
  }
  return out;
}

function normalize(href: string, base: string): string | null {
  try {
    const resolved = new URL(href, base);
    resolved.hash = "";
    return resolved.toString();
  } catch {
    return null;
  }
}

type BrokenLink = {
  url: string;
  kind: LinkKind;
  foundOn: string;
  status: number | null;
  reason: string;
};

const seen = new Set<string>();
const queue: Target[] = [];
const broken: BrokenLink[] = [];
const redirectedLinks: { url: string; finalUrl: string; kind: LinkKind }[] = [];
const externalSkipped = new Set<string>();
const declaredSitemaps: string[] = [];

let pagesCrawled = 0;
let linksChecked = 0;
let pageLimitHit = false;

function enqueue(target: Target): void {
  if (seen.has(target.probeUrl)) return;
  seen.add(target.probeUrl);
  queue.push(target);
}

const internalHosts = new Set([entry.host]);
if (siteOrigin !== null) internalHosts.add(new URL(siteOrigin).host);

/**
 * Internal is decided by HOST (host+port), deliberately NOT by full origin.
 * A site behind a TLS-terminating proxy legitimately emits both schemes for
 * itself — measured on this app: the sitemap `<loc>`s are `https://` while
 * the rendered share/permalink URLs on the very same page are `http://`. An
 * origin-strict comparison classifies half of a site's own links as
 * "external, not checked" and reports a confident green while never having
 * looked at them. Scheme mismatch is a canonicalisation smell, not a broken
 * link, so it does not fail the run — but the links are still checked.
 */
function isInternal(absolute: string): boolean {
  return internalHosts.has(new URL(absolute).host);
}

/**
 * Map an internal link onto the address actually being probed: whatever
 * `--url` pointed at. Path and query are preserved verbatim; only the origin
 * moves, so a `--site-origin` (or mixed-scheme) URL is fetched from the
 * deployment under test rather than from wherever DNS would send it.
 */
function toProbeUrl(absolute: string): string {
  const url = new URL(absolute);
  if (!internalHosts.has(url.host)) return absolute;
  if (url.origin === entryOrigin) return absolute;
  return new URL(url.pathname + url.search, entryOrigin).toString();
}

function classify(
  href: string,
  base: string,
  kind: LinkKind,
  foundOn: string
): void {
  const absolute = normalize(href, base);
  if (absolute === null) return;

  if (!isInternal(absolute)) {
    if (!includeExternal) {
      externalSkipped.add(absolute);
      return;
    }
    enqueue({
      url: absolute,
      probeUrl: absolute,
      kind,
      foundOn,
      crawl: false
    });
    return;
  }

  // Only internal anchors/pagination/sitemap pages are expanded further;
  // canonical/hreflang/feed targets are endpoints of the graph, not new
  // crawl frontiers.
  const crawl =
    kind === "anchor" ||
    kind === "pagination" ||
    kind === "sitemap-loc" ||
    kind === "entry";
  enqueue({
    url: absolute,
    probeUrl: toProbeUrl(absolute),
    kind,
    foundOn,
    crawl
  });
}

async function report(exitCode: number, verdict: string): Promise<never> {
  const payload = {
    check: "link-check",
    // Userinfo stripped: this payload is printed AND written to
    // `--json-output`, an artefact operators routinely attach to issues. A
    // `--url=https://user:pass@host/` would otherwise carry the credentials
    // straight into it.
    entryUrl: redactUrlUserinfo(entry),
    origin: entryOrigin,
    siteOrigin,
    host: hostHeader ?? entry.hostname,
    verdict,
    summary: {
      pagesCrawled,
      maxPages,
      pageLimitHit,
      linksChecked,
      brokenCount: broken.length,
      redirectedCount: redirectedLinks.length,
      externalSkipped: externalSkipped.size,
      externalChecked: includeExternal
    },
    declaredSitemaps,
    broken,
    redirected: redirectedLinks,
    // Listed, not silently dropped: an operator reading a green report has
    // to be able to see WHICH links this run declined to verify.
    externalNotChecked: includeExternal ? [] : [...externalSkipped].sort()
  };

  const json = JSON.stringify(payload, null, 2);
  console.log(json);

  if (jsonOutput) {
    try {
      // Awaited, not fire-and-forget: `process.exit` below would otherwise
      // race the write and could truncate the evidence artifact.
      await Bun.write(jsonOutput, `${json}\n`);
    } catch (error) {
      // Never print a raw caught value — a filesystem error can carry the
      // path/credentials it failed on (src/lib/logging/error-sanitizer.ts).
      logScriptFailure(`failed to write --json-output=${jsonOutput}`, error);
    }
  }

  process.exit(exitCode);
}

// ---------------------------------------------------------------------------
// 1) The entry page itself. If this does not resolve, nothing below is
//    meaningful — a crawl of zero pages finding zero broken links is not a
//    green result, so it exits 2, not 0.
// ---------------------------------------------------------------------------
const entryTarget: Target = {
  url: entry.toString(),
  probeUrl: entry.toString(),
  kind: "entry",
  foundOn: "--url",
  crawl: true
};
seen.add(entryTarget.probeUrl);
const entryProbe = await probe(entryTarget, true);
linksChecked += 1;

if (entryProbe.status === null || entryProbe.status >= 400) {
  broken.push({
    url: entryTarget.url,
    kind: "entry",
    foundOn: "--url",
    status: entryProbe.status,
    reason: entryProbe.error ?? `HTTP ${entryProbe.status}`
  });
  await report(2, "entry_unreachable");
}

pagesCrawled += 1;
if (entryProbe.body && (entryProbe.contentType ?? "").includes("text/html")) {
  for (const link of extractHtmlLinks(entryProbe.body, entryProbe.finalUrl!)) {
    classify(link.href, entryProbe.finalUrl!, link.kind, entryTarget.url);
  }
}

// ---------------------------------------------------------------------------
// 2) Discovery surfaces: robots.txt `Sitemap:` directives, then the
//    conventional /sitemap.xml as a fallback seed. Sitemaps are what a
//    crawler actually consumes, so a sitemap full of dead `<loc>`s is a real
//    defect even when every rendered anchor is fine.
// ---------------------------------------------------------------------------
const robotsUrl = new URL("/robots.txt", entryOrigin).toString();
const robotsProbe = await probe(
  {
    url: robotsUrl,
    probeUrl: robotsUrl,
    kind: "robots-sitemap",
    foundOn: "robots.txt",
    crawl: false
  },
  true
);
linksChecked += 1;
seen.add(robotsUrl);

const sitemapSeeds = new Set<string>();
if (
  robotsProbe.status !== null &&
  robotsProbe.status < 400 &&
  robotsProbe.body
) {
  for (const declared of extractRobotsSitemaps(robotsProbe.body)) {
    const absolute = normalize(declared, robotsUrl);
    if (absolute === null) continue;
    declaredSitemaps.push(absolute);
    if (isInternal(absolute)) sitemapSeeds.add(absolute);
  }
}
if (sitemapSeeds.size === 0) {
  sitemapSeeds.add(new URL("/sitemap.xml", entryOrigin).toString());
}

/**
 * Resolve sitemaps breadth-first: an index yields more sitemaps, a leaf
 * sitemap yields `<loc>` page URLs that join the normal verification queue.
 * `sitemapVisited` bounds a self-referential index.
 */
const sitemapVisited = new Set<string>();
const sitemapQueue = [...sitemapSeeds];

while (sitemapQueue.length > 0) {
  const sitemapUrl = sitemapQueue.shift()!;
  if (sitemapVisited.has(sitemapUrl)) continue;
  sitemapVisited.add(sitemapUrl);
  const sitemapProbeUrl = toProbeUrl(sitemapUrl);
  seen.add(sitemapProbeUrl);

  const sitemapProbe = await probe(
    {
      url: sitemapUrl,
      probeUrl: sitemapProbeUrl,
      kind: "sitemap",
      foundOn: declaredSitemaps.includes(sitemapUrl) ? robotsUrl : "--url",
      crawl: false
    },
    true
  );
  linksChecked += 1;

  if (sitemapProbe.status === null || sitemapProbe.status >= 400) {
    // A sitemap declared by robots.txt that 404s is a broken SEO link. A
    // MISSING conventional /sitemap.xml on a site that never declared one
    // is not — many valid sites have no sitemap at all.
    if (declaredSitemaps.includes(sitemapUrl)) {
      broken.push({
        url: sitemapUrl,
        kind: "robots-sitemap",
        foundOn: robotsUrl,
        status: sitemapProbe.status,
        reason: sitemapProbe.error ?? `HTTP ${sitemapProbe.status}`
      });
    }
    continue;
  }

  const xml = sitemapProbe.body ?? "";
  const locs = extractSitemapLocs(xml);
  if (isSitemapIndex(xml)) {
    for (const loc of locs) {
      const absolute = normalize(loc, sitemapUrl);
      if (absolute !== null && isInternal(absolute)) {
        sitemapQueue.push(absolute);
      }
    }
    continue;
  }

  for (const loc of locs) {
    classify(loc, sitemapUrl, "sitemap-loc", sitemapUrl);
  }
}

// ---------------------------------------------------------------------------
// 3) Verify (and, for same-origin HTML pages, expand) everything queued.
// ---------------------------------------------------------------------------
while (queue.length > 0) {
  const batch = queue.splice(0, Math.max(1, Math.floor(concurrency)));
  const wantBody = batch.map(
    (target) => target.crawl && pagesCrawled < maxPages
  );
  const probes = await Promise.all(
    batch.map((target, index) => probe(target, wantBody[index]!))
  );

  for (const [index, result] of probes.entries()) {
    linksChecked += 1;

    if (result.status === null || result.status >= 400) {
      broken.push({
        url: result.url,
        kind: result.kind,
        foundOn: result.foundOn,
        status: result.status,
        reason: result.error ?? `HTTP ${result.status}`
      });
      continue;
    }

    if (result.redirected && result.finalUrl) {
      redirectedLinks.push({
        url: result.url,
        finalUrl: result.finalUrl,
        kind: result.kind
      });
    }

    const isHtml = (result.contentType ?? "").includes("text/html");
    if (!wantBody[index] || !isHtml || !result.body || !result.finalUrl)
      continue;

    if (pagesCrawled >= maxPages) {
      pageLimitHit = true;
      continue;
    }
    pagesCrawled += 1;

    for (const link of extractHtmlLinks(result.body, result.finalUrl)) {
      classify(link.href, result.finalUrl, link.kind, result.url);
    }
  }

  if (pagesCrawled >= maxPages && queue.length > 0) pageLimitHit = true;
}

await report(
  broken.length === 0 ? 0 : 1,
  broken.length === 0 ? "ok" : "broken_links"
);
