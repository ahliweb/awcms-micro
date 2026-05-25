/**
 * Gutenberg to Portable Text Converter
 *
 * Converts WordPress Gutenberg block content to Portable Text format.
 * Uses @wordpress/block-serialization-default-parser to parse the hybrid
 * HTML+JSON format that WordPress uses.
 */

import { parse } from "@wordpress/block-serialization-default-parser";
import { parseFragment, type DefaultTreeAdapterMap } from "parse5";

import { parseInlineContent } from "./inline.js";
import { getTransformer } from "./transformers/index.js";
import type {
	GutenbergBlock,
	PortableTextBlock,
	ConvertOptions,
	TransformContext,
} from "./types.js";

// Re-export types
export type {
	GutenbergBlock,
	PortableTextBlock,
	PortableTextTextBlock,
	PortableTextImageBlock,
	PortableTextCodeBlock,
	PortableTextEmbedBlock,
	PortableTextGalleryBlock,
	PortableTextColumnsBlock,
	PortableTextBreakBlock,
	PortableTextHtmlBlock,
	PortableTextButtonBlock,
	PortableTextButtonsBlock,
	PortableTextCoverBlock,
	PortableTextFileBlock,
	PortableTextPullquoteBlock,
	PortableTextSpan,
	PortableTextMarkDef,
	ConvertOptions,
	BlockTransformer,
	TransformContext,
} from "./types.js";

// Re-export transformers for customization
export { defaultTransformers, fallbackTransformer } from "./transformers/index.js";
export * as coreTransformers from "./transformers/core.js";
export * as embedTransformers from "./transformers/embed.js";

// Re-export inline utilities
export {
	parseInlineContent,
	extractText,
	extractAlt,
	extractCaption,
	extractSrc,
} from "./inline.js";

/**
 * Default key generator
 */
function createKeyGenerator(): () => string {
	let counter = 0;
	return () => {
		counter++;
		return `key-${counter}-${Math.random().toString(36).substring(2, 7)}`;
	};
}

/**
 * Normalize parsed blocks from the WP parser into our GutenbergBlock type.
 * The WP parser returns `attrs: Record<string, any> | null`, so we normalize
 * null attrs to empty objects and recursively process innerBlocks.
 */
function normalizeBlocks(blocks: ReturnType<typeof parse>): GutenbergBlock[] {
	return blocks.map(
		(block): GutenbergBlock => ({
			blockName: block.blockName,
			attrs: (block.attrs ?? {}) satisfies Record<string, unknown>,
			innerHTML: block.innerHTML,
			innerBlocks: normalizeBlocks(block.innerBlocks),
			innerContent: block.innerContent,
		}),
	);
}

/**
 * Convert WordPress Gutenberg content to Portable Text
 *
 * @param content - WordPress post content (HTML with Gutenberg block comments)
 * @param options - Conversion options
 * @returns Array of Portable Text blocks
 *
 * @example
 * ```ts
 * const portableText = gutenbergToPortableText(`
 *   <!-- wp:paragraph -->
 *   <p>Hello <strong>world</strong>!</p>
 *   <!-- /wp:paragraph -->
 * `);
 * // → [{ _type: "block", style: "normal", children: [...] }]
 * ```
 */
export function gutenbergToPortableText(
	content: string,
	options: ConvertOptions = {},
): PortableTextBlock[] {
	// Handle empty content
	if (!content || !content.trim()) {
		return [];
	}

	// Check if content has Gutenberg blocks
	const hasBlocks = content.includes("<!-- wp:");

	if (!hasBlocks) {
		// Classic editor content - treat as HTML
		return htmlToPortableText(content, options);
	}

	// Parse Gutenberg blocks
	const blocks = normalizeBlocks(parse(content));

	// Create key generator
	const generateKey = options.keyGenerator || createKeyGenerator();

	// Create transform context
	const context = createTransformContext(options, generateKey);

	// Transform blocks
	return blocks.flatMap((block) => transformBlock(block, options, context));
}

/**
 * Convert plain HTML (classic editor) to Portable Text
 */
export function htmlToPortableText(
	html: string,
	options: ConvertOptions = {},
): PortableTextBlock[] {
	const generateKey = options.keyGenerator || createKeyGenerator();
	const blocks: PortableTextBlock[] = [];
	const fragment = parseFragment(html);
	const inlineBuffer: string[] = [];

	const flushInlineBuffer = () => {
		const content = inlineBuffer.join("").trim();
		inlineBuffer.length = 0;
		if (!content) return;

		const { children, markDefs } = parseInlineContent(content, generateKey);
		if (children.some((c) => c.text.trim())) {
			blocks.push({
				_type: "block",
				_key: generateKey(),
				style: "normal",
				children,
				markDefs: markDefs.length > 0 ? markDefs : undefined,
			});
		}
	};

	for (const node of fragment.childNodes) {
		if (isTextNode(node)) {
			inlineBuffer.push(node.value);
			continue;
		}

		if (!isElement(node)) continue;

		const tag = node.tagName.toLowerCase();

		switch (tag) {
			case "p":
			case "div": {
				flushInlineBuffer();
				const extracted = extractImagesAndText(node.childNodes.map(nodeToHtml).join(""), generateKey);
				blocks.push(...extracted.images);

				const textContent = extracted.text.trim();
				if (textContent) {
					const { children, markDefs } = parseInlineContent(textContent, generateKey);
					if (children.some((c) => c.text.trim())) {
						blocks.push({
							_type: "block",
							_key: generateKey(),
							style: "normal",
							children,
							markDefs: markDefs.length > 0 ? markDefs : undefined,
						});
					}
				}
				break;
			}

			case "h1":
			case "h2":
			case "h3":
			case "h4":
			case "h5":
			case "h6": {
				flushInlineBuffer();
				const { children, markDefs } = parseInlineContent(node.childNodes.map(nodeToHtml).join(""), generateKey);
				blocks.push({
					_type: "block",
					_key: generateKey(),
					style: tag,
					children,
					markDefs: markDefs.length > 0 ? markDefs : undefined,
				});
				break;
			}

			case "blockquote": {
				flushInlineBuffer();
				const { children, markDefs } = parseInlineContent(node.childNodes.map(nodeToHtml).join(""), generateKey);
				blocks.push({
					_type: "block",
					_key: generateKey(),
					style: "blockquote",
					children,
					markDefs: markDefs.length > 0 ? markDefs : undefined,
				});
				break;
			}

			case "pre": {
				flushInlineBuffer();
				const codeNode = findFirstElementInHtml(node.childNodes.map(nodeToHtml).join(""), "code");
				const code = codeNode ? getNodeText(codeNode.childNodes) : node.childNodes.map(nodeToHtml).join("");
				blocks.push({
					_type: "code",
					_key: generateKey(),
					code: decodeHtmlEntities(code),
				});
				break;
			}

			case "ul":
			case "ol": {
				flushInlineBuffer();
				const listItem = tag === "ol" ? "number" : "bullet";
				blocks.push(...extractListBlocks(node.childNodes, listItem, 1, generateKey));
				break;
			}

			case "hr": {
				flushInlineBuffer();
				blocks.push({
					_type: "break",
					_key: generateKey(),
					style: "lineBreak",
				});
				break;
			}

			case "figure": {
				flushInlineBuffer();
				const image = findFirstImage(node.childNodes.map(nodeToHtml).join(""));
				if (image?.src) {
					const caption = extractFigureCaption(node.childNodes.map(nodeToHtml).join(""));
					blocks.push({
						_type: "image",
						_key: generateKey(),
						asset: {
							_type: "reference",
							_ref: image.src,
							url: image.src,
						},
						alt: image.alt,
						caption,
					});
				}
				break;
			}

			case "img": {
				flushInlineBuffer();
				const image = readImage(node);
				if (image?.src) {
					blocks.push({
						_type: "image",
						_key: generateKey(),
						asset: {
							_type: "reference",
							_ref: image.src,
							url: image.src,
						},
						alt: image.alt,
					});
				}
				break;
			}

			default:
				inlineBuffer.push(nodeToHtml(node));
		}
	}

	flushInlineBuffer();

	return blocks;
}

/**
 * Create transform context for recursive block transformation
 */
function createTransformContext(
	options: ConvertOptions,
	generateKey: () => string,
): TransformContext {
	const context: TransformContext = {
		generateKey,
		parseInlineContent: (html: string) => parseInlineContent(html, generateKey),
		transformBlocks: (blocks: GutenbergBlock[]) =>
			blocks.flatMap((block) => transformBlock(block, options, context)),
	};
	return context;
}

/**
 * Transform a single block
 */
function transformBlock(
	block: GutenbergBlock,
	options: ConvertOptions,
	context: TransformContext,
): PortableTextBlock[] {
	const transformer = getTransformer(block.blockName, options.customTransformers);
	return transformer(block, options, context);
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(html: string): string {
	return html;
}

/**
 * Decode HTML entities in URLs (used for image src attributes)
 */
function decodeUrlEntities(url: string): string {
	return url;
}

/**
 * Parse Gutenberg blocks without converting to Portable Text
 * Useful for inspection and debugging
 */
export function parseGutenbergBlocks(content: string): GutenbergBlock[] {
	if (!content || !content.trim()) {
		return [];
	}
	return normalizeBlocks(parse(content));
}

function stripHtmlTags(html: string): string {
	let out = "";
	let i = 0;

	while (i < html.length) {
		const char = html[i]!;
		if (char !== "<") {
			out += char;
			i += 1;
			continue;
		}

		const close = html.indexOf(">", i + 1);
		if (close === -1) {
			out += char;
			i += 1;
			continue;
		}

		i = close + 1;
	}

	return out;
}

type Node = DefaultTreeAdapterMap["node"];
type TextNode = DefaultTreeAdapterMap["textNode"];
type Element = DefaultTreeAdapterMap["element"];

function extractImagesAndText(
	html: string,
	generateKey: () => string,
): { images: PortableTextBlock[]; text: string } {
	const fragment = parseFragment(html);
	const images: PortableTextBlock[] = [];
	const textParts: string[] = [];

	for (const node of fragment.childNodes) {
		if (isElement(node) && node.tagName.toLowerCase() === "a") {
			const image = findFirstImageInNodes(node.childNodes);
			if (image?.src) {
				const link = getAttr(node, "href");
				images.push(makeImageBlock(image.src, image.alt, generateKey, link));
				continue;
			}
		}

		if (isElement(node) && node.tagName.toLowerCase() === "img") {
			const image = readImage(node);
			if (image?.src) {
				images.push(makeImageBlock(image.src, image.alt, generateKey));
				continue;
			}
		}

		textParts.push(nodeToHtml(node));
	}

	return { images, text: textParts.join("") };
}

function extractFigureCaption(html: string): string | undefined {
	const captionNode = findFirstElementInHtml(html, "figcaption");
	if (!captionNode) return undefined;
	return stripHtmlTags(getNodeText(captionNode.childNodes)).trim() || undefined;
}

function findFirstImage(html: string): { src?: string; alt?: string } | undefined {
	return readImage(findFirstElementInHtml(html, "img") ?? undefined);
}

function findFirstImageInNodes(nodes: Node[]): { src?: string; alt?: string } | undefined {
	return readImage(findElement(nodes, "img") ?? undefined);
}

function extractListBlocks(
	nodes: Node[],
	listItem: "bullet" | "number",
	level: number,
	generateKey: () => string,
): PortableTextBlock[] {
	const blocks: PortableTextBlock[] = [];

	for (const node of nodes) {
		if (!isElement(node) || node.tagName.toLowerCase() !== "li") continue;

		const nestedLists: Element[] = [];
		for (const child of node.childNodes) {
			if (isElement(child) && (child.tagName.toLowerCase() === "ul" || child.tagName.toLowerCase() === "ol")) {
				nestedLists.push(child);
			}
		}
		const textContent = getNodeTextWithoutNestedLists(node.childNodes).trim();

		if (textContent) {
			const { children, markDefs } = parseInlineContent(textContent, generateKey);
			blocks.push({
				_type: "block",
				_key: generateKey(),
				style: "normal",
				listItem,
				level,
				children,
				markDefs: markDefs.length > 0 ? markDefs : undefined,
			});
		}

		for (const nested of nestedLists) {
			const nestedItem = nested.tagName.toLowerCase() === "ol" ? "number" : "bullet";
			blocks.push(...extractListBlocks(nested.childNodes, nestedItem, level + 1, generateKey));
		}
	}

	return blocks;
}

function findFirstElementInHtml(html: string, tagName: string): Element | undefined {
	return findElement(parseFragment(html).childNodes, tagName);
}

function findElement(nodes: Node[], tagName: string): Element | undefined {
	for (const node of nodes) {
		if (isElement(node)) {
			if (node.tagName.toLowerCase() === tagName) return node;
			const found = findElement(node.childNodes, tagName);
			if (found) return found;
		}
	}
	return undefined;
}

function getAttr(element: Element, name: string): string | undefined {
	const attr = element.attrs.find((a) => a.name.toLowerCase() === name);
	return attr?.value;
}

function readImage(element?: Element): { src?: string; alt?: string } | undefined {
	if (!element) return undefined;
	return { src: getAttr(element, "src"), alt: getAttr(element, "alt") };
}

function makeImageBlock(
	src: string,
	alt: string | undefined,
	generateKey: () => string,
	link?: string,
): PortableTextBlock {
	return {
		_type: "image",
		_key: generateKey(),
		asset: {
			_type: "reference",
			_ref: decodeUrlEntities(src),
			url: decodeUrlEntities(src),
		},
		alt,
		...(link ? { link } : {}),
	};
}

function getNodeText(nodes: Node[]): string {
	let text = "";
	for (const node of nodes) {
		if (isTextNode(node)) text += node.value;
		else if (isElement(node)) text += getNodeText(node.childNodes);
	}
	return text;
}

function getNodeTextWithoutNestedLists(nodes: Node[]): string {
	let text = "";
	for (const node of nodes) {
		if (isTextNode(node)) {
			text += node.value;
		} else if (isElement(node)) {
			const tag = node.tagName.toLowerCase();
			if (tag === "ul" || tag === "ol") continue;
			text += getNodeTextWithoutNestedLists(node.childNodes);
		}
	}
	return text;
}

function nodeToHtml(node: Node): string {
	if (isTextNode(node)) return node.value;
	if (!isElement(node)) return "";
	const attrs = node.attrs.length
		? ` ${node.attrs.map((attr) => `${attr.name}="${escapeHtml(attr.value)}"`).join(" ")}`
		: "";
	return `<${node.tagName}${attrs}>${node.childNodes.map(nodeToHtml).join("")}</${node.tagName}>`;
}

function escapeHtml(value: string): string {
	return value
		.split("&")
		.join("&amp;")
		.split('"')
		.join("&quot;")
		.split("<")
		.join("&lt;")
		.split(">")
		.join("&gt;");
}

function isTextNode(node: Node): node is TextNode {
	return node.nodeName === "#text";
}

function isElement(node: Node): node is Element {
	return "tagName" in node;
}
