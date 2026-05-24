/**
 * Transformers for WordPress embed blocks
 */

import type { BlockTransformer } from "../types.js";
import { attrString } from "../types.js";
import { sanitizeMediaUrl } from "../url.js";

function findElementAttr(html: string, tagName: string, attrName: string): string | undefined {
	const lower = html.toLowerCase();
	const open = `<${tagName}`;
	const start = lower.indexOf(open);
	if (start === -1) return undefined;
	const end = html.indexOf(">", start);
	if (end === -1) return undefined;
	const attrs = html.slice(start, end);
	const attrLower = attrName.toLowerCase();
	const candidates = [attrName + '="', attrName + "='", attrLower + '="', attrLower + "='"];
	for (const candidate of candidates) {
		const pos = attrs.toLowerCase().indexOf(candidate.toLowerCase());
		if (pos !== -1) {
			const valueStart = pos + candidate.length;
			const quote = candidate.endsWith("\"") ? '"' : "'";
			const valueEnd = attrs.indexOf(quote, valueStart);
			if (valueEnd !== -1) return attrs.slice(valueStart, valueEnd);
		}
	}
	return undefined;
}

/**
 * core/embed and variants → embed block
 */
export const embed: BlockTransformer = (block, _options, context) => {
	const url = attrString(block.attrs, "url");
	const providerSlug = attrString(block.attrs, "providerNameSlug");

	// Extract iframe src if present
	const iframeSrc = findElementAttr(block.innerHTML, "iframe", "src");
	const safeUrl = sanitizeMediaUrl(url || iframeSrc || "") || "";

	return [
		{
			_type: "embed",
			_key: context.generateKey(),
			url: safeUrl,
			provider: providerSlug || detectProvider(safeUrl),
			html: block.innerHTML.trim() || undefined,
		},
	];
};

/**
 * core-embed/youtube → embed block
 */
export const youtube: BlockTransformer = (block, options, context) => {
	return embed(block, options, context);
};

/**
 * core-embed/twitter → embed block
 */
export const twitter: BlockTransformer = (block, options, context) => {
	return embed(block, options, context);
};

/**
 * core-embed/vimeo → embed block
 */
export const vimeo: BlockTransformer = (block, options, context) => {
	return embed(block, options, context);
};

/**
 * core/video → embed block (self-hosted video)
 */
export const video: BlockTransformer = (block, _options, context) => {
	const src = attrString(block.attrs, "src");

	// Extract from video tag if not in attrs
	const videoSrc = sanitizeMediaUrl(
		src || findElementAttr(block.innerHTML, "video", "src") || findElementAttr(block.innerHTML, "source", "src") || "",
	) || "";

	return [
		{
			_type: "embed",
			_key: context.generateKey(),
			url: videoSrc,
			provider: "video",
			html: block.innerHTML.trim() || undefined,
		},
	];
};

/**
 * core/audio → embed block (self-hosted audio)
 */
export const audio: BlockTransformer = (block, _options, context) => {
	const src = attrString(block.attrs, "src");

	// Extract from audio tag if not in attrs
	const audioSrc = sanitizeMediaUrl(
		src || findElementAttr(block.innerHTML, "audio", "src") || findElementAttr(block.innerHTML, "source", "src") || "",
	) || "";

	return [
		{
			_type: "embed",
			_key: context.generateKey(),
			url: audioSrc,
			provider: "audio",
			html: block.innerHTML.trim() || undefined,
		},
	];
};

/**
 * Detect embed provider from URL
 */
function detectProvider(url: string): string | undefined {
	if (!url) return undefined;

	const host = getHostname(url);
	if (!host) return undefined;

	for (const entry of PROVIDER_HOSTS) {
		if (entry.hosts.some((allowed) => hostMatches(host, allowed))) {
			return entry.provider;
		}
	}

	return undefined;
}

const PROVIDER_HOSTS: Array<{ provider: string; hosts: string[] }> = [
	{ provider: "youtube", hosts: ["youtube.com", "youtu.be"] },
	{ provider: "vimeo", hosts: ["vimeo.com"] },
	{ provider: "twitter", hosts: ["twitter.com", "x.com"] },
	{ provider: "instagram", hosts: ["instagram.com"] },
	{ provider: "facebook", hosts: ["facebook.com"] },
	{ provider: "tiktok", hosts: ["tiktok.com"] },
	{ provider: "spotify", hosts: ["spotify.com"] },
	{ provider: "soundcloud", hosts: ["soundcloud.com"] },
	{ provider: "codepen", hosts: ["codepen.io"] },
	{ provider: "gist", hosts: ["gist.github.com"] },
];

function hostMatches(host: string, domain: string): boolean {
	return host === domain || host.endsWith(`.${domain}`);
}

function getHostname(url: string): string | undefined {
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return undefined;
		return parsed.hostname.toLowerCase();
	} catch {
		return undefined;
	}
}
