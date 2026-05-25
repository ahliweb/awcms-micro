/**
 * Transformers for WordPress embed blocks
 */

import { parseFragment, type DefaultTreeAdapterMap } from "parse5";

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

	if (hostname === "youtu.be" || hostname === "youtube.com") {
		return "youtube";
	}
	if (hostname === "vimeo.com") {
		return "vimeo";
	}
	if (hostname === "twitter.com" || hostname === "x.com") {
		return "twitter";
	}
	if (hostname === "instagram.com") {
		return "instagram";
	}
	if (hostname === "facebook.com" || hostname === "fb.watch") {
		return "facebook";
	}
	if (hostname === "tiktok.com") {
		return "tiktok";
	}
	if (hostname === "spotify.com") {
		return "spotify";
	}
	if (hostname === "soundcloud.com") {
		return "soundcloud";
	}
	if (hostname === "codepen.io") {
		return "codepen";
	}
	if (hostname === "gist.github.com") {
		return "gist";
	}

	return undefined;
}

function extractHtmlAttribute(html: string, attrName: string): string | undefined {
	const fragment = parseFragment(html);
	return extractAttrFromFragment(fragment.childNodes, attrName);
}

type Node = DefaultTreeAdapterMap["node"];
type Element = DefaultTreeAdapterMap["element"];

function extractAttrFromFragment(nodes: Node[], attrName: string): string | undefined {
	for (const node of nodes) {
		if (!isElement(node)) continue;
		const attr = node.attrs.find((a) => a.name.toLowerCase() === attrName);
		if (attr) return attr.value;
		const nested = extractAttrFromFragment(node.childNodes, attrName);
		if (nested !== undefined) return nested;
	}
	return undefined;
}

function isElement(node: Node): node is Element {
	return "tagName" in node;
}
