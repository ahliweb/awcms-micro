/**
 * standard.site record builders
 *
 * Builds site.standard.publication and site.standard.document records
 * from EmDash content.
 */

import { buildContentPath, getContentData, getContentString, getString } from "./content.js";

// ── Types ───────────────────────────────────────────────────────

export interface StandardPublication {
	$type: "site.standard.publication";
	url: string;
	name: string;
	description?: string;
}

export interface StandardDocument {
	$type: "site.standard.document";
	/** AT-URI of the publication record, or HTTPS URL for loose documents */
	site: string;
	title: string;
	publishedAt: string;
	/** Path component -- combined with publication URL to form canonical URL */
	path?: string;
	description?: string;
	textContent?: string;
	tags?: string[];
	updatedAt?: string;
	coverImage?: BlobRefLike;
	/** Strong reference to a Bluesky post for off-platform comments */
	bskyPostRef?: { uri: string; cid: string };
}

interface BlobRefLike {
	$type: "blob";
	ref: { $link: string };
	mimeType: string;
	size: number;
}

// ── Builders ────────────────────────────────────────────────────

/**
 * Build a site.standard.publication record.
 */
export function buildPublication(
	siteUrl: string,
	siteName: string,
	description?: string,
): StandardPublication {
	return {
		$type: "site.standard.publication",
		url: stripTrailingSlash(siteUrl),
		name: siteName,
		...(description ? { description } : {}),
	};
}

/**
 * Build a site.standard.document record from EmDash content.
 */
export function buildDocument(opts: {
	publicationUri: string;
	collection?: string;
	content: Record<string, unknown>;
	coverImageBlob?: BlobRefLike;
	bskyPostRef?: { uri: string; cid: string };
}): StandardDocument {
	const { publicationUri, collection, content, coverImageBlob, bskyPostRef } = opts;

	const title = getContentString(content, "title") || "Untitled";
	const description =
		getContentString(content, "excerpt") || getContentString(content, "description");
	const publishedAt =
		getString(content, "publishedAt") ||
		getString(content, "published_at") ||
		new Date().toISOString();
	const updatedAt = getString(content, "updatedAt") || getString(content, "updated_at");
	const tags = extractTags(content);

	const doc: StandardDocument = {
		$type: "site.standard.document",
		site: publicationUri,
		title,
		publishedAt,
	};

	const path = buildContentPath(collection, content);
	if (path) doc.path = path;

	if (description) {
		doc.description = description;
	}

	const plainText = extractPlainText(content);
	if (plainText) {
		doc.textContent = plainText;
	}

	if (tags.length > 0) {
		doc.tags = tags;
	}

	if (updatedAt) {
		doc.updatedAt = updatedAt;
	}

	if (coverImageBlob) {
		doc.coverImage = coverImageBlob;
	}

	if (bskyPostRef) {
		doc.bskyPostRef = bskyPostRef;
	}

	return doc;
}

// ── Helpers ─────────────────────────────────────────────────────

function stripTrailingSlash(url: string): string {
	return url.endsWith("/") ? url.slice(0, -1) : url;
}

const HASH_PREFIX_RE = /^#/;
const MAX_TEXT_CONTENT_LENGTH = 10_000;

/**
 * Extract tags from content. Handles both string arrays and
 * tag objects with a name property.
 */
function extractTags(content: Record<string, unknown>): string[] {
	const raw = content.tags || getContentData(content).tags;
	if (!Array.isArray(raw)) return [];

	const tags: string[] = [];
	for (const item of raw) {
		if (typeof item === "string") {
			tags.push(item.replace(HASH_PREFIX_RE, ""));
		} else if (
			typeof item === "object" &&
			item !== null &&
			"name" in item &&
			typeof (item as Record<string, unknown>).name === "string"
		) {
			tags.push(((item as Record<string, unknown>).name as string).replace(HASH_PREFIX_RE, ""));
		}
	}
	return tags;
}

/**
 * Extract plain text from content for the textContent field.
 * Strips HTML tags and collapses whitespace.
 */
export function extractPlainText(content: Record<string, unknown>): string | undefined {
	// Try common content field names
	const body =
		getContentString(content, "body") ||
		getContentString(content, "content") ||
		getContentString(content, "text");

	if (!body) return undefined;

	// Decode entities first, then strip tags with a small scanner to avoid regex-based
	// stripping on untrusted input.
	let text = decodeHtmlEntities(body);
	text = stripHtmlTags(text);

	if (!text) return undefined;

	// Truncate to 10,000 chars to avoid exceeding PDS record size limits (~100KB)
	if (text.length > MAX_TEXT_CONTENT_LENGTH) {
		text = text.slice(0, MAX_TEXT_CONTENT_LENGTH - 1) + "\u2026";
	}

	return text;
}

function decodeHtmlEntities(input: string): string {
	return input
		.split("&lt;").join("<")
		.split("&gt;").join(">")
		.split("&quot;").join('"')
		.split("&#39;").join("'")
		.split("&#039;").join("'")
		.split("&#38;").join("&")
		.split("&#038;").join("&")
		.split("&#x26;").join("&")
		.split("&amp;").join("&")
		.split("&nbsp;").join(" ");
}

function stripHtmlTags(input: string): string {
	let out = "";
	let inTag = false;
	let pendingSpace = false;

	for (let i = 0; i < input.length; i++) {
		const ch = input[i]!;
		if (inTag) {
			if (ch === ">") inTag = false;
			continue;
		}
		if (ch === "<") {
			inTag = true;
			pendingSpace = out.length > 0;
			continue;
		}
		if (ch === " " || ch === "\n" || ch === "\t" || ch === "\r" || ch === "\f") {
			pendingSpace = out.length > 0;
			continue;
		}
		if (pendingSpace) {
			out += " ";
			pendingSpace = false;
		}
		out += ch;
	}

	return out.trim();
}
