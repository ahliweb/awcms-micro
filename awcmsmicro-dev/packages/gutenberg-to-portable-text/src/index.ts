/**
 * Gutenberg to Portable Text Converter
 */

import { parse } from "@wordpress/block-serialization-default-parser";
import { parseFragment, type DefaultTreeAdapterMap } from "parse5";

import { parseInlineContent } from "./inline.js";
import { getTransformer } from "./transformers/index.js";
import { sanitizeHref, sanitizeMediaUrl } from "./url.js";
import type {
	ConvertOptions,
	GutenbergBlock,
	PortableTextBlock,
	TransformContext,
} from "./types.js";

type Node = DefaultTreeAdapterMap["node"];
type TextNode = DefaultTreeAdapterMap["textNode"];
type Element = DefaultTreeAdapterMap["element"];

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

export { defaultTransformers, fallbackTransformer } from "./transformers/index.js";
export * as coreTransformers from "./transformers/core.js";
export * as embedTransformers from "./transformers/embed.js";

export {
	parseInlineContent,
	extractText,
	extractAlt,
	extractCaption,
	extractSrc,
} from "./inline.js";

function createKeyGenerator(): () => string {
	let counter = 0;
	return () => {
		counter++;
		return `key-${counter}-${Math.random().toString(36).substring(2, 7)}`;
	};
}

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

export function gutenbergToPortableText(
	content: string,
	options: ConvertOptions = {},
): PortableTextBlock[] {
	if (!content || !content.trim()) return [];
	if (!content.includes("<!-- wp:")) return htmlToPortableText(content, options);

	const blocks = normalizeBlocks(parse(content));
	const generateKey = options.keyGenerator || createKeyGenerator();
	const context = createTransformContext(options, generateKey);

	return blocks.flatMap((block) => transformBlock(block, options, context));
}

export function htmlToPortableText(
	html: string,
	options: ConvertOptions = {},
): PortableTextBlock[] {
	const generateKey = options.keyGenerator || createKeyGenerator();
	const blocks: PortableTextBlock[] = [];
	const fragment = parseFragment(html);
	let pendingText = "";

	for (const node of fragment.childNodes) {
		if (isTextNode(node)) {
			pendingText += node.value;
			continue;
		}

		if (!isElement(node)) continue;
		const tag = node.tagName.toLowerCase();

		if (!isBlockTag(tag)) {
			pendingText += serializeElement(node, generateKey, blocks);
			continue;
		}

		flushTextBlock(pendingText, generateKey, blocks);
		pendingText = "";

		switch (tag) {
			case "img":
				pushImageBlock(node, generateKey, blocks);
				break;
			case "p":
			case "div": {
				const innerHtml = serializeNodes(node.childNodes, generateKey, blocks, {
					skipTags: new Set(["ul", "ol"]),
				});
				pushTextHtml(innerHtml.trim(), generateKey, blocks);
				break;
			}
			case "h1":
			case "h2":
			case "h3":
			case "h4":
			case "h5":
			case "h6": {
				const innerHtml = serializeNodes(node.childNodes, generateKey, blocks);
				const { children, markDefs } = parseInlineContent(innerHtml.trim(), generateKey);
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
				const innerHtml = serializeNodes(node.childNodes, generateKey, blocks);
				const { children, markDefs } = parseInlineContent(innerHtml.trim(), generateKey);
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
				const codeElement = findFirstElement(node, "code");
				const code = codeElement ? getTextContent(codeElement.childNodes) : getTextContent(node.childNodes);
				blocks.push({
					_type: "code",
					_key: generateKey(),
					code: decodeHtmlEntities(code),
				});
				break;
			}
			case "ul":
			case "ol": {
				const listItem = tag === "ol" ? "number" : "bullet";
				blocks.push(...parseListItems(node.childNodes, listItem, 1, generateKey, blocks));
				break;
			}
			case "table": {
				blocks.push(...parseTableBlock(node, generateKey, blocks));
				break;
			}
			case "hr":
				blocks.push({
					_type: "break",
					_key: generateKey(),
					style: "lineBreak",
				});
				break;
			case "figure": {
				const img = findFirstElement(node, "img");
				if (img) {
					const caption = findFirstElement(node, "figcaption");
					const src = getAttr(img, "src");
					const imgUrl = src ? sanitizeMediaUrl(decodeUrlEntities(src)) : undefined;
					blocks.push({
						_type: "image",
						_key: generateKey(),
						asset: {
							_type: "reference",
							_ref: imgUrl || "",
							url: imgUrl,
						},
						alt: getAttr(img, "alt"),
						caption: caption ? getTextContent(caption.childNodes) : undefined,
					});
				}
				break;
			}
		}
	}

	flushTextBlock(pendingText, generateKey, blocks);
	return blocks;
}

function createTransformContext(options: ConvertOptions, generateKey: () => string): TransformContext {
	const context: TransformContext = {
		generateKey,
		parseInlineContent: (html: string) => parseInlineContent(html, generateKey),
		transformBlocks: (blocks: GutenbergBlock[]) =>
			blocks.flatMap((block) => transformBlock(block, options, context)),
	};
	return context;
}

function transformBlock(
	block: GutenbergBlock,
	options: ConvertOptions,
	context: TransformContext,
): PortableTextBlock[] {
	const transformer = getTransformer(block.blockName, options.customTransformers);
	return transformer(block, options, context);
}

function pushTextHtml(html: string, generateKey: () => string, blocks: PortableTextBlock[]): void {
	if (!html) return;
	const { children, markDefs } = parseInlineContent(html, generateKey);
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

function flushTextBlock(text: string, generateKey: () => string, blocks: PortableTextBlock[]): void {
	const trimmed = text.trim();
	if (!trimmed) return;
	pushTextHtml(trimmed, generateKey, blocks);
}

function parseListItems(
	nodes: Node[],
	listItem: "bullet" | "number",
	level: number,
	generateKey: () => string,
	blocks: PortableTextBlock[],
): PortableTextBlock[] {
	const out: PortableTextBlock[] = [];

	for (const node of nodes) {
		if (!isElement(node) || node.tagName.toLowerCase() !== "li") continue;

		const nestedLists: Element[] = [];
		const textHtml = serializeNodes(node.childNodes, generateKey, blocks, {
			skipTags: new Set(["ul", "ol"]),
			onNestedElement: (nested) => {
				const tag = nested.tagName.toLowerCase();
				if (tag === "ul" || tag === "ol") nestedLists.push(nested);
			},
		});

		const { children, markDefs } = parseInlineContent(textHtml.trim(), generateKey);
		if (children.some((c) => c.text.trim())) {
			out.push({
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
			out.push(...parseListItems(nested.childNodes, nestedItem, level + 1, generateKey, blocks));
		}
	}

	return out;
}

function parseTableBlock(
	tableElement: Element,
	generateKey: () => string,
	blocks: PortableTextBlock[],
): PortableTextBlock[] {
	const tableContent = findFirstElement(tableElement, "table") ?? tableElement;
	const thead = findFirstElement(tableContent, "thead");
	const tbody = findFirstElement(tableContent, "tbody");
	const rows: Array<{
		_type: "tableRow";
		_key: string;
		cells: Array<{
			_type: "tableCell";
			_key: string;
			content: ReturnType<typeof parseInlineContent>["children"];
			markDefs?: ReturnType<typeof parseInlineContent>["markDefs"];
			isHeader?: boolean;
		}>;
	}> = [];

	if (thead) rows.push(...parseTableRows(thead.childNodes, true, generateKey, blocks));
	if (tbody) {
		rows.push(...parseTableRows(tbody.childNodes, false, generateKey, blocks));
	} else if (!thead) {
		rows.push(...parseTableRows(tableContent.childNodes, false, generateKey, blocks));
	}

	return [{
		_type: "table",
		_key: generateKey(),
		rows,
		hasHeaderRow: !!thead,
	}];
}

function parseTableRows(
	nodes: Node[],
	isHeader: boolean,
	generateKey: () => string,
	blocks: PortableTextBlock[],
): Array<{
	_type: "tableRow";
	_key: string;
	cells: Array<{
		_type: "tableCell";
		_key: string;
		content: ReturnType<typeof parseInlineContent>["children"];
		markDefs?: ReturnType<typeof parseInlineContent>["markDefs"];
		isHeader?: boolean;
	}>;
}> {
	const rows: Array<{
		_type: "tableRow";
		_key: string;
		cells: Array<{
			_type: "tableCell";
			_key: string;
			content: ReturnType<typeof parseInlineContent>["children"];
			markDefs?: ReturnType<typeof parseInlineContent>["markDefs"];
			isHeader?: boolean;
		}>;
	}> = [];

	for (const node of nodes) {
		if (!isElement(node) || node.tagName.toLowerCase() !== "tr") continue;
		const cells: Array<{
			_type: "tableCell";
			_key: string;
			content: ReturnType<typeof parseInlineContent>["children"];
			markDefs?: ReturnType<typeof parseInlineContent>["markDefs"];
			isHeader?: boolean;
		}> = [];
		for (const cellNode of node.childNodes) {
			if (!isElement(cellNode)) continue;
			const cellTag = cellNode.tagName.toLowerCase();
			if (cellTag !== "td" && cellTag !== "th") continue;
			const contentHtml = serializeNodes(cellNode.childNodes, generateKey, blocks).trim();
			const { children, markDefs } = parseInlineContent(contentHtml, generateKey);
			cells.push({
				_type: "tableCell",
				_key: generateKey(),
				content: children,
				markDefs: markDefs.length > 0 ? markDefs : undefined,
				isHeader: isHeader || cellTag === "th",
			});
		}
		rows.push({
			_type: "tableRow",
			_key: generateKey(),
			cells,
		});
	}

	return rows;
}

interface SerializeOptions {
	skipTags?: Set<string>;
	onNestedElement?: (element: Element) => void;
}

function serializeNodes(
	nodes: Node[],
	generateKey: () => string,
	blocks: PortableTextBlock[],
	options: SerializeOptions = {},
): string {
	let html = "";
	for (const node of nodes) {
		if (isTextNode(node)) {
			html += escapeHtml(node.value);
			continue;
		}
		if (!isElement(node)) continue;

		const tag = node.tagName.toLowerCase();
		if (options.skipTags?.has(tag)) {
			options.onNestedElement?.(node);
			continue;
		}
		if (tag === "img") {
			pushImageBlock(node, generateKey, blocks);
			continue;
		}
		if (tag === "a") {
			const img = findFirstElement(node, "img");
			if (img) {
				const href = getAttr(node, "href");
				pushImageBlock(img, generateKey, blocks, href ? sanitizeHref(decodeUrlEntities(href)) : undefined);
				continue;
			}
		}

		html += serializeElement(node, generateKey, blocks, options);
	}
	return html;
}

function serializeElement(
	element: Element,
	generateKey: () => string,
	blocks: PortableTextBlock[],
	options: SerializeOptions = {},
): string {
	const tag = element.tagName.toLowerCase();
	if (tag === "br" || tag === "hr") return `<${tag}>`;
	return `<${tag}${serializeAttrs(element.attrs)}>${serializeNodes(element.childNodes, generateKey, blocks, options)}</${tag}>`;
}

function serializeAttrs(attrs: Array<{ name: string; value: string }>): string {
	if (attrs.length === 0) return "";
	return attrs.map((attr) => ` ${attr.name}="${escapeHtml(attr.value)}"`).join("");
}

function pushImageBlock(
	element: Element,
	generateKey: () => string,
	blocks: PortableTextBlock[],
	link?: string,
): void {
	const src = getAttr(element, "src");
	if (!src) return;

	const imgUrl = sanitizeMediaUrl(decodeUrlEntities(src));
	blocks.push({
		_type: "image",
		_key: generateKey(),
		asset: {
			_type: "reference",
			_ref: imgUrl || "",
			url: imgUrl,
		},
		alt: getAttr(element, "alt"),
		...(link ? { link } : {}),
	});
}

function getAttr(element: Element, name: string): string | undefined {
	const lowerName = name.toLowerCase();
	return element.attrs.find((attr) => attr.name.toLowerCase() === lowerName)?.value;
}

function getTextContent(nodes: Node[]): string {
	let text = "";
	for (const node of nodes) {
		if (isTextNode(node)) {
			text += node.value;
		} else if (isElement(node)) {
			text += getTextContent(node.childNodes);
		}
	}
	return text.trim();
}

function findFirstElement(node: Node, tagName: string): Element | undefined {
	if (isElement(node) && node.tagName.toLowerCase() === tagName) return node;
	if ("childNodes" in node && Array.isArray(node.childNodes)) {
		for (const child of node.childNodes) {
			const found = findFirstElement(child, tagName);
			if (found) return found;
		}
	}
	return undefined;
}

function isBlockTag(tag: string): boolean {
	return tag === "p" || tag === "div" || tag === "blockquote" || tag === "pre" || tag === "ul" || tag === "ol" || tag === "hr" || tag === "figure" || tag === "img" || tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6";
}

function isTextNode(node: Node): node is TextNode {
	return node.nodeName === "#text";
}

function isElement(node: Node): node is Element {
	return "tagName" in node;
}

function escapeHtml(text: string): string {
	return text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function decodeHtmlEntities(html: string): string {
	let out = "";
	for (let i = 0; i < html.length; i++) {
		if (html.startsWith("&lt;", i)) {
			out += "<";
			i += 3;
			continue;
		}
		if (html.startsWith("&gt;", i)) {
			out += ">";
			i += 3;
			continue;
		}
		if (html.startsWith("&quot;", i)) {
			out += '"';
			i += 5;
			continue;
		}
		if (html.startsWith("&#039;", i)) {
			out += "'";
			i += 5;
			continue;
		}
		if (html.startsWith("&#38;", i) || html.startsWith("&#038;", i) || html.startsWith("&#x26;", i) || html.startsWith("&amp;", i)) {
			out += "&";
			i += html.startsWith("&#038;", i) || html.startsWith("&#x26;", i) ? 5 : html.startsWith("&#38;", i) || html.startsWith("&amp;", i) ? 4 : 0;
			continue;
		}
		if (html.startsWith("&nbsp;", i)) {
			out += " ";
			i += 5;
			continue;
		}
		out += html[i]!;
	}
	return out;
}

function decodeUrlEntities(url: string): string {
	let out = "";
	for (let i = 0; i < url.length; i++) {
		if (url.startsWith("&#038;", i) || url.startsWith("&#38;", i) || url.startsWith("&#x26;", i) || url.startsWith("&amp;", i)) {
			out += "&";
			i += url.startsWith("&#038;", i) || url.startsWith("&#x26;", i) ? 5 : url.startsWith("&#38;", i) || url.startsWith("&amp;", i) ? 4 : 0;
			continue;
		}
		out += url[i]!;
	}
	return out;
}

export function parseGutenbergBlocks(content: string): GutenbergBlock[] {
	if (!content || !content.trim()) return [];
	return normalizeBlocks(parse(content));
}
