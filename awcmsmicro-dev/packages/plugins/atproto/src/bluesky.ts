/**
 * Bluesky cross-posting helpers
 *
 * Builds app.bsky.feed.post records with link cards and rich text facets.
 */

import type { BlobRef } from "./atproto.js";
import { buildContentPath, getContentString } from "./content.js";

const TEMPLATE_TITLE_RE = /\{title\}/g;
const TEMPLATE_URL_RE = /\{url\}/g;
const TEMPLATE_EXCERPT_RE = /\{excerpt\}/g;

// ── Types ───────────────────────────────────────────────────────

export interface BskyPost {
	$type: "app.bsky.feed.post";
	text: string;
	createdAt: string;
	langs?: string[];
	facets?: BskyFacet[];
	embed?: BskyEmbed;
}

export interface BskyFacet {
	index: { byteStart: number; byteEnd: number };
	features: Array<
		| { $type: "app.bsky.richtext.facet#link"; uri: string }
		| { $type: "app.bsky.richtext.facet#tag"; tag: string }
	>;
}

export type BskyEmbed = {
	$type: "app.bsky.embed.external";
	external: {
		uri: string;
		title: string;
		description: string;
		thumb?: BlobRef;
	};
};

// ── Post builder ────────────────────────────────────────────────

/**
 * Build a Bluesky post record for cross-posting published content.
 */
export function buildBskyPost(opts: {
	template: string;
	collection?: string;
	content: Record<string, unknown>;
	siteUrl: string;
	thumbBlob?: BlobRef;
	langs?: string[];
}): BskyPost {
	const { template, collection, content, siteUrl, thumbBlob, langs } = opts;

	const title = getContentString(content, "title") || "Untitled";
	const excerpt =
		getContentString(content, "excerpt") || getContentString(content, "description") || "";
	const path = buildContentPath(collection, content);
	const url = path ? `${stripTrailingSlash(siteUrl)}${path}` : siteUrl;

	// Apply template -- substitute before truncation so we can detect
	// if the URL survives intact after truncation
	const fullText = template
		.replace(TEMPLATE_TITLE_RE, title)
		.replace(TEMPLATE_URL_RE, url)
		.replace(TEMPLATE_EXCERPT_RE, excerpt);

	// Truncate to 300 graphemes (Bluesky limit)
	const text = truncateGraphemes(fullText, 300);
	const wasTruncated = text !== fullText;

	const post: BskyPost = {
		$type: "app.bsky.feed.post",
		text,
		createdAt: new Date().toISOString(),
	};

	if (langs && langs.length > 0) {
		post.langs = langs.slice(0, 3); // Max 3 per spec
	}

	// Auto-detect URLs in text and build facets.
	// If text was truncated, skip facets -- truncation may have cut
	// a URL mid-string, producing a broken link facet.
	if (!wasTruncated) {
		const facets = buildFacets(text);
		if (facets.length > 0) {
			post.facets = facets;
		}
	}

	// Link card embed
	post.embed = {
		$type: "app.bsky.embed.external",
		external: {
			uri: url,
			title,
			description: truncateGraphemes(excerpt, 300),
			...(thumbBlob ? { thumb: thumbBlob } : {}),
		},
	};

	return post;
}

// ── Rich text facets ────────────────────────────────────────────

/**
 * Build rich text facets for URLs and hashtags in text.
 *
 * CRITICAL: Facet byte offsets use UTF-8 bytes, not JavaScript string indices.
 */
export function buildFacets(text: string): BskyFacet[] {
	const encoder = new TextEncoder();
	const facets: BskyFacet[] = [];

	let i = 0;
	while (i < text.length) {
		if (startsWithHttpUrl(text, i)) {
			const start = i;
			let end = i;
			while (end < text.length && !isUrlTerminator(text[end]!)) {
				end++;
			}
			const cleanUrl = trimTrailingPunctuation(text.slice(start, end));
			if (cleanUrl) {
				const beforeBytes = encoder.encode(text.slice(0, start));
				const matchBytes = encoder.encode(cleanUrl);
				facets.push({
					index: {
						byteStart: beforeBytes.length,
						byteEnd: beforeBytes.length + matchBytes.length,
					},
					features: [{ $type: "app.bsky.richtext.facet#link", uri: cleanUrl }],
				});
			}
			i = end;
			continue;
		}

		if (isHashtagStart(text, i)) {
			let end = i + 1;
			while (end < text.length && isHashtagChar(text[end]!)) {
				end++;
			}
			if (end > i + 1) {
				const beforeBytes = encoder.encode(text.slice(0, i));
				const matchBytes = encoder.encode(text.slice(i, end));
				facets.push({
					index: {
						byteStart: beforeBytes.length,
						byteEnd: beforeBytes.length + matchBytes.length,
					},
					features: [{ $type: "app.bsky.richtext.facet#tag", tag: text.slice(i + 1, end) }],
				});
			}
			i = end;
			continue;
		}

		i++;
	}

	return facets;
}

// ── Utilities ───────────────────────────────────────────────────

/**
 * Truncate a string to a maximum number of graphemes.
 * Uses Intl.Segmenter for correct Unicode handling.
 */
function truncateGraphemes(text: string, maxGraphemes: number): string {
	// Intl.Segmenter handles multi-codepoint graphemes (emoji, combining chars)
	const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
	const segments = [...segmenter.segment(text)];

	if (segments.length <= maxGraphemes) return text;

	// Truncate and add ellipsis
	return (
		segments
			.slice(0, maxGraphemes - 1)
			.map((s) => s.segment)
			.join("") + "\u2026"
	);
}

function stripTrailingSlash(url: string): string {
	return url.endsWith("/") ? url.slice(0, -1) : url;
}

function startsWithHttpUrl(text: string, index: number): boolean {
	return text.startsWith("http://", index) || text.startsWith("https://", index);
}

function isUrlTerminator(ch: string): boolean {
	return ch === " " || ch === "\t" || ch === "\n" || ch === "\r" || ch === ")" || ch === ">" || ch === "]";
}

function trimTrailingPunctuation(value: string): string {
	let end = value.length;
	while (end > 0) {
		const ch = value[end - 1]!;
		if (ch === "." || ch === "," || ch === ";" || ch === ":" || ch === "!" || ch === "?" || ch === "'" || ch === '"') {
			end--;
			continue;
		}
		break;
	}
	return value.slice(0, end);
}

function isHashtagStart(text: string, index: number): boolean {
	if (text[index] !== "#") return false;
	if (index === 0) return true;
	return isBoundaryChar(text[index - 1]!);
}

function isHashtagChar(ch: string): boolean {
	return (
		(ch >= "a" && ch <= "z") ||
		(ch >= "A" && ch <= "Z") ||
		(ch >= "0" && ch <= "9") ||
		ch === "_"
	);
}

function isBoundaryChar(ch: string): boolean {
	return ch === " " || ch === "\t" || ch === "\n" || ch === "\r";
}
