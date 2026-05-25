/**
 * Transformers for WordPress embed blocks
 */

import type { BlockTransformer } from "../types.js";
import { attrString } from "../types.js";

/**
 * core/embed and variants → embed block
 */
export const embed: BlockTransformer = (block, _options, context) => {
	const url = attrString(block.attrs, "url");
	const providerSlug = attrString(block.attrs, "providerNameSlug");

	// Extract iframe src if present
	const iframeSrc = extractHtmlAttribute(block.innerHTML, "src");

	return [
		{
			_type: "embed",
			_key: context.generateKey(),
			url: url || iframeSrc || "",
			provider: providerSlug || detectProvider(url || iframeSrc || ""),
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
	const videoSrc = src || extractHtmlAttribute(block.innerHTML, "src");

	return [
		{
			_type: "embed",
			_key: context.generateKey(),
			url: videoSrc || "",
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
	const audioSrc = src || extractHtmlAttribute(block.innerHTML, "src");

	return [
		{
			_type: "embed",
			_key: context.generateKey(),
			url: audioSrc || "",
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

	let hostname = "";
	try {
		hostname = new URL(url).hostname.toLowerCase();
		if (hostname.startsWith("www.")) hostname = hostname.slice(4);
	} catch {
		return undefined;
	}

	if (hostname === "youtu.be" || hostname.endsWith(".youtube.com") || hostname === "youtube.com") {
		return "youtube";
	}
	if (hostname === "vimeo.com" || hostname.endsWith(".vimeo.com")) {
		return "vimeo";
	}
	if (hostname === "twitter.com" || hostname.endsWith(".twitter.com") || hostname === "x.com" || hostname.endsWith(".x.com")) {
		return "twitter";
	}
	if (hostname === "instagram.com" || hostname.endsWith(".instagram.com")) {
		return "instagram";
	}
	if (hostname === "facebook.com" || hostname.endsWith(".facebook.com") || hostname === "fb.watch") {
		return "facebook";
	}
	if (hostname === "tiktok.com" || hostname.endsWith(".tiktok.com")) {
		return "tiktok";
	}
	if (hostname === "spotify.com" || hostname.endsWith(".spotify.com")) {
		return "spotify";
	}
	if (hostname === "soundcloud.com" || hostname.endsWith(".soundcloud.com")) {
		return "soundcloud";
	}
	if (hostname === "codepen.io" || hostname.endsWith(".codepen.io")) {
		return "codepen";
	}
	if (hostname === "gist.github.com") {
		return "gist";
	}

	return undefined;
}

function extractHtmlAttribute(html: string, attrName: string): string | undefined {
	let i = 0;
	while (i < html.length) {
		const found = html.indexOf(attrName, i);
		if (found === -1) return undefined;

		const before = html[found - 1];
		const afterName = html[found + attrName.length];
		const beforeCode = before?.charCodeAt(0) ?? 0;
		const beforeIsIdentChar =
			(beforeCode >= 48 && beforeCode <= 57) ||
			(beforeCode >= 65 && beforeCode <= 90) ||
			(beforeCode >= 97 && beforeCode <= 122) ||
			before === "_" ||
			before === "-";
		if ((before && beforeIsIdentChar) || afterName !== "=") {
			i = found + attrName.length;
			continue;
		}

		let j = found + attrName.length + 1;
		while (html[j] === " ") j++;
		const quote = html[j];
		if (quote !== "\"" && quote !== "'") {
			i = j;
			continue;
		}

		const end = html.indexOf(quote, j + 1);
		if (end === -1) return undefined;
		return html.slice(j + 1, end);
	}
	return undefined;
}
