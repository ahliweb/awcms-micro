import type { APIRoute } from "astro";
import { getEmDashCollection, getSiteSettings } from "emdash";

export const GET: APIRoute = async ({ site, url }) => {
  const siteUrl = site?.toString() || url.origin;
  const settings = await getSiteSettings();
  const siteTitle = settings?.title ?? "AWCMS-Micro";
  const siteTagline =
    settings?.tagline ??
    "An EmDash example repository with a full-feature plugin";

  const { entries: posts } = await getEmDashCollection("posts", {
    orderBy: { published_at: "desc" },
    limit: 20,
  });

  const items = posts
    .map((post) => {
      if (!post.data.publishedAt) return null;

      const postUrl = `${siteUrl}/posts/${post.id}`;
      return `    <item>\n      <title>${escapeXml(post.data.title || "Untitled")}</title>\n      <link>${postUrl}</link>\n      <guid isPermaLink="true">${postUrl}</guid>\n      <pubDate>${post.data.publishedAt.toUTCString()}</pubDate>\n      <description>${escapeXml(post.data.excerpt || "")}</description>\n    </item>`;
    })
    .filter(Boolean)
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <description>${escapeXml(siteTagline)}</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};

const XML_ESCAPE_PATTERNS = [
  [/&/g, "&amp;"],
  [/</g, "&lt;"],
  [/>/g, "&gt;"],
  [/"/g, "&quot;"],
  [/'/g, "&apos;"],
] as const;

function escapeXml(value: string): string {
  let result = value;
  for (const [pattern, replacement] of XML_ESCAPE_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
