/**
 * Transformers for WordPress core/* blocks
 */

import { parseFragment, type DefaultTreeAdapterMap } from "parse5";

import { extractAlt, extractCaption, extractSrc, extractText } from "../inline.js";
import type {
	GutenbergBlock,
	PortableTextBlock,
	PortableTextTextBlock,
	BlockTransformer,
	TransformContext,
} from "../types.js";
import { attrString, attrNumber, attrBoolean, attrObject } from "../types.js";
import { sanitizeHref } from "../url.js";

/**
 * core/paragraph → block with style "normal"
 */
export const paragraph: BlockTransformer = (block, _options, context) => {
	const { children, markDefs } = context.parseInlineContent(block.innerHTML);

	// Skip empty paragraphs
	if (children.length === 1 && children[0]?.text === "") {
		return [];
	}

	const result: PortableTextTextBlock = {
		_type: "block",
		_key: context.generateKey(),
		style: "normal",
		children,
	};

	if (markDefs.length > 0) {
		result.markDefs = markDefs;
	}

	return [result];
};

/**
 * core/heading → block with style "h1"-"h6"
 */
export const heading: BlockTransformer = (block, _options, context) => {
	const level = attrNumber(block.attrs, "level") ?? 2;
	const { children, markDefs } = context.parseInlineContent(block.innerHTML);

	const result: PortableTextTextBlock = {
		_type: "block",
		_key: context.generateKey(),
		style: toHeadingStyle(level),
		children,
	};

	if (markDefs.length > 0) {
		result.markDefs = markDefs;
	}

	return [result];
};

/**
 * core/list → blocks with listItem
 *
 * Handles both old format (HTML list) and new format (innerBlocks with list-item)
 */
export const list: BlockTransformer = (block, _options, context) => {
	const ordered = block.attrs.ordered === true;
	const listItem = ordered ? "number" : "bullet";

	// Check for new format (WordPress 6.x) with core/list-item innerBlocks
	if (block.innerBlocks.length > 0) {
		return parseListItemBlocks(block.innerBlocks, listItem, 1, context);
	}

	// Old format: HTML content in innerHTML
	const listElement = findFirstElement(block.innerHTML, "ol") || findFirstElement(block.innerHTML, "ul");
	const listContent = listElement ? getNodeInnerHtml(listElement.childNodes) : block.innerHTML;

	return parseListItems(listContent, listItem, 1, context);
};

/**
 * Parse list-item blocks (WordPress 6.x format)
 */
function parseListItemBlocks(
	innerBlocks: GutenbergBlock[],
	listItem: "bullet" | "number",
	level: number,
	context: TransformContext,
): PortableTextTextBlock[] {
	const blocks: PortableTextTextBlock[] = [];

	for (const itemBlock of innerBlocks) {
		if (itemBlock.blockName !== "core/list-item") continue;

		// Get text content from the <li> in innerHTML
		const liNode = findFirstElement(itemBlock.innerHTML, "li");
		const textContent = liNode ? getNodeInnerHtml(liNode.childNodes).trim() : "";

		if (textContent) {
			const { children, markDefs } = context.parseInlineContent(textContent);

			const block: PortableTextTextBlock = {
				_type: "block",
				_key: context.generateKey(),
				style: "normal",
				listItem,
				level,
				children,
			};

			if (markDefs.length > 0) {
				block.markDefs = markDefs;
			}

			blocks.push(block);
		}

		// Handle nested lists in innerBlocks
		if (itemBlock.innerBlocks.length > 0) {
			for (const nested of itemBlock.innerBlocks) {
				if (nested.blockName === "core/list") {
					const nestedOrdered = nested.attrs.ordered === true;
					const nestedListItem = nestedOrdered ? "number" : "bullet";
					blocks.push(
						...parseListItemBlocks(nested.innerBlocks, nestedListItem, level + 1, context),
					);
				}
			}
		}
	}

	return blocks;
}

/**
 * Parse list items from HTML
 */
function parseListItems(
	html: string,
	listItem: "bullet" | "number",
	level: number,
	context: TransformContext,
): PortableTextTextBlock[] {
	const blocks: PortableTextTextBlock[] = [];

	// Match <li> elements - need to handle nested lists carefully
	// Find each top-level <li> by tracking tag depth
	const liItems = extractTopLevelListItems(html);

	for (const liContent of liItems) {
		// Check for nested lists
		const nestedUl = findFirstElement(liContent, "ul");
		const nestedOl = findFirstElement(liContent, "ol");

		// Get text content (excluding nested lists)
		let textContent = stripNestedLists(liContent).trim();

		if (textContent) {
			const { children, markDefs } = context.parseInlineContent(textContent);

			const block: PortableTextTextBlock = {
				_type: "block",
				_key: context.generateKey(),
				style: "normal",
				listItem,
				level,
				children,
			};

			if (markDefs.length > 0) {
				block.markDefs = markDefs;
			}

			blocks.push(block);
		}

		// Process nested lists
		if (nestedUl) {
			blocks.push(...parseListItems(getNodeInnerHtml(nestedUl.childNodes), "bullet", level + 1, context));
		}
		if (nestedOl) {
			blocks.push(...parseListItems(getNodeInnerHtml(nestedOl.childNodes), "number", level + 1, context));
		}
	}

	return blocks;
}

/**
 * Extract top-level <li> items from HTML, handling nested lists correctly
 */
function extractTopLevelListItems(html: string): string[] {
	const items: string[] = [];
	let depth = 0;
	let currentItem = "";
	let inLi = false;
	let i = 0;

	while (i < html.length) {
		// Check for opening tags
		if (html.substring(i, i + 3).toLowerCase() === "<li") {
			// Find end of tag
			const tagEnd = html.indexOf(">", i);
			if (tagEnd === -1) break;

			if (!inLi) {
				inLi = true;
				i = tagEnd + 1;
				continue;
			} else {
				// Nested li
				currentItem += html.substring(i, tagEnd + 1);
				depth++;
				i = tagEnd + 1;
				continue;
			}
		}

		// Check for closing </li>
		if (html.substring(i, i + 5).toLowerCase() === "</li>") {
			if (depth === 0) {
				// End of current top-level item
				items.push(currentItem);
				currentItem = "";
				inLi = false;
				i += 5;
				continue;
			} else {
				// End of nested item
				currentItem += "</li>";
				depth--;
				i += 5;
				continue;
			}
		}

		// Check for nested list tags to track depth
		if (
			html.substring(i, i + 3).toLowerCase() === "<ul" ||
			html.substring(i, i + 3).toLowerCase() === "<ol"
		) {
			const tagEnd = html.indexOf(">", i);
			if (tagEnd !== -1) {
				currentItem += html.substring(i, tagEnd + 1);
				i = tagEnd + 1;
				continue;
			}
		}

		if (
			html.substring(i, i + 5).toLowerCase() === "</ul>" ||
			html.substring(i, i + 5).toLowerCase() === "</ol>"
		) {
			currentItem += html.substring(i, i + 5);
			i += 5;
			continue;
		}

		// Regular character
		if (inLi) {
			currentItem += html[i];
		}
		i++;
	}

	// Handle case where closing </li> is missing
	if (currentItem.trim()) {
		items.push(currentItem);
	}

	// Filter out empty items that may result from whitespace between tags
	return items.filter((item) => item.trim().length > 0);
}

type Node = DefaultTreeAdapterMap["node"];
type TextNode = DefaultTreeAdapterMap["textNode"];
type Element = DefaultTreeAdapterMap["element"];

function findFirstElement(html: string, tagName: string): Element | undefined {
	return findElement(parseFragment(html).childNodes, tagName);
}

function findElements(html: string, tagName: string): Element[] {
	const out: Element[] = [];
	collectElements(parseFragment(html).childNodes, tagName, out);
	return out;
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

function collectElements(nodes: Node[], tagName: string, out: Element[]): void {
	for (const node of nodes) {
		if (isElement(node)) {
			if (node.tagName.toLowerCase() === tagName) out.push(node);
			collectElements(node.childNodes, tagName, out);
		}
	}
}

function getAttr(element: Element, name: string): string | undefined {
	const attr = element.attrs.find((a) => a.name.toLowerCase() === name);
	return attr?.value;
}

function getNodeInnerHtml(nodes: Node[]): string {
	let html = "";
	for (const node of nodes) {
		if (isTextNode(node)) {
			html += node.value;
		} else if (isElement(node)) {
			html += renderElement(node);
		}
	}
	return html;
}

function renderElement(element: Element): string {
	const attrs = element.attrs.length
		? ` ${element.attrs.map((attr) => `${attr.name}="${escapeHtml(attr.value)}"`).join(" ")}`
		: "";
	return `<${element.tagName}${attrs}>${getNodeInnerHtml(element.childNodes)}</${element.tagName}>`;
}

function stripNestedLists(html: string): string {
	const fragment = parseFragment(html);
	let out = "";
	for (const node of fragment.childNodes) {
		if (isElement(node) && (node.tagName.toLowerCase() === "ul" || node.tagName.toLowerCase() === "ol")) {
			continue;
		}
		out += isElement(node) ? renderElement(node) : isTextNode(node) ? node.value : "";
	}
	return out;
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

/**
 * core/quote → block with style "blockquote"
 */
export const quote: BlockTransformer = (block, _options, context) => {
	const blocks: PortableTextBlock[] = [];

	// Extract paragraphs from the blockquote
	for (const paragraphNode of findElements(block.innerHTML, "p")) {
		const content = getNodeInnerHtml(paragraphNode.childNodes);
		const { children, markDefs } = context.parseInlineContent(content);

		const quoteBlock: PortableTextTextBlock = {
			_type: "block",
			_key: context.generateKey(),
			style: "blockquote",
			children,
		};

		if (markDefs.length > 0) {
			quoteBlock.markDefs = markDefs;
		}

		blocks.push(quoteBlock);
	}

	// If no paragraphs found, treat entire content as quote
	if (blocks.length === 0) {
		const { children, markDefs } = context.parseInlineContent(block.innerHTML);

		const quoteBlock: PortableTextTextBlock = {
			_type: "block",
			_key: context.generateKey(),
			style: "blockquote",
			children,
		};

		if (markDefs.length > 0) {
			quoteBlock.markDefs = markDefs;
		}

		blocks.push(quoteBlock);
	}

	// Handle citation if present
	const citation = attrString(block.attrs, "citation");
	if (citation) {
		const { children, markDefs } = context.parseInlineContent(citation);

		const citationBlock: PortableTextTextBlock = {
			_type: "block",
			_key: context.generateKey(),
			style: "normal",
			children: [
				{
					_type: "span",
					_key: context.generateKey(),
					text: "— ",
				},
				...children,
			],
		};

		if (markDefs.length > 0) {
			citationBlock.markDefs = markDefs;
		}

		blocks.push(citationBlock);
	}

	return blocks;
};

/**
 * core/image → image block
 */
export const image: BlockTransformer = (block, options, context) => {
	const wpId = attrNumber(block.attrs, "id");
	const src = attrString(block.attrs, "url") ?? extractSrc(block.innerHTML);
	const alt = attrString(block.attrs, "alt") ?? extractAlt(block.innerHTML);
	const caption = extractCaption(block.innerHTML);
	const align = attrString(block.attrs, "align");

	// Resolve media ID if we have a map
	const ref = wpId && options.mediaMap?.get(wpId);

	return [
		{
			_type: "image",
			_key: context.generateKey(),
			asset: {
				_type: "reference",
				_ref: ref || String(wpId || src || ""),
				url: src,
			},
			alt,
			caption,
			alignment: mapAlignment(align),
		},
	];
};

/**
 * core/code → code block
 */
export const code: BlockTransformer = (block, _options, context) => {
	// Extract code from <pre><code>...</code></pre>
	const codeNode = findFirstElement(block.innerHTML, "code");
	const codeContent = codeNode ? getNodeInnerHtml(codeNode.childNodes) : block.innerHTML;

	// Decode HTML entities
	const decoded = decodeHtmlEntities(codeContent);

	return [
		{
			_type: "code",
			_key: context.generateKey(),
			code: decoded,
			language: attrString(block.attrs, "language"),
		},
	];
};

/**
 * core/preformatted → code block (no syntax highlighting)
 */
export const preformatted: BlockTransformer = (block, _options, context) => {
	const text = extractText(block.innerHTML);

	return [
		{
			_type: "code",
			_key: context.generateKey(),
			code: text,
		},
	];
};

/**
 * core/separator / core/spacer → break block
 */
export const separator: BlockTransformer = (_block, _options, context) => {
	return [
		{
			_type: "break",
			_key: context.generateKey(),
			style: "lineBreak",
		},
	];
};

/**
 * core/gallery → gallery block
 */
export const gallery: BlockTransformer = (block, options, context) => {
	const images: Array<{
		_type: "image";
		_key: string;
		asset: { _type: "reference"; _ref: string; url?: string };
		alt?: string;
		caption?: string;
	}> = [];

	// Extract images from inner blocks or HTML
	if (block.innerBlocks.length > 0) {
		for (const innerBlock of block.innerBlocks) {
			if (innerBlock.blockName === "core/image") {
				const wpId = attrNumber(innerBlock.attrs, "id");
				const src = attrString(innerBlock.attrs, "url") ?? extractSrc(innerBlock.innerHTML);
				const alt = attrString(innerBlock.attrs, "alt") ?? extractAlt(innerBlock.innerHTML);
				const caption = extractCaption(innerBlock.innerHTML);
				const ref = wpId && options.mediaMap?.get(wpId);

				images.push({
					_type: "image",
					_key: context.generateKey(),
					asset: {
						_type: "reference",
						_ref: ref || String(wpId || src || ""),
						url: src,
					},
					alt,
					caption,
				});
			}
		}
	} else {
		// Parse from HTML (older gallery format)
		for (const imageNode of findElements(block.innerHTML, "img")) {
			const imgHtml = renderElement(imageNode);
			const src = getAttr(imageNode, "src") ?? extractSrc(imgHtml);
			const alt = getAttr(imageNode, "alt") ?? extractAlt(imgHtml);
			const wpIdValue = getAttr(imageNode, "data-id");
			const wpId = wpIdValue ? Number.parseInt(wpIdValue, 10) : undefined;
			const ref = wpId && options.mediaMap?.get(wpId);

			images.push({
				_type: "image",
				_key: context.generateKey(),
				asset: {
					_type: "reference",
					_ref: ref || String(wpId || src || ""),
					url: src,
				},
				alt,
			});
		}
	}

	return [
		{
			_type: "gallery",
			_key: context.generateKey(),
			images,
			columns: attrNumber(block.attrs, "columns"),
		},
	];
};

/**
 * core/columns → columns block
 */
export const columns: BlockTransformer = (block, _options, context) => {
	const columnBlocks = block.innerBlocks.map((col) => ({
		_type: "column" as const,
		_key: context.generateKey(),
		content: context.transformBlocks(col.innerBlocks),
	}));

	return [
		{
			_type: "columns",
			_key: context.generateKey(),
			columns: columnBlocks,
		},
	];
};

/**
 * core/group → flatten children (no special container)
 */
export const group: BlockTransformer = (block, _options, context) => {
	return context.transformBlocks(block.innerBlocks);
};

/**
 * core/table → table block
 */
export const table: BlockTransformer = (block, _options, context) => {
	const tableElement = findFirstElement(block.innerHTML, "table");
	if (!tableElement) {
		return [];
	}

	const thead = findFirstElement(getNodeInnerHtml(tableElement.childNodes), "thead");
	const tbody = findFirstElement(getNodeInnerHtml(tableElement.childNodes), "tbody");

	const rows: Array<{
		_type: "tableRow";
		_key: string;
		cells: Array<{
			_type: "tableCell";
			_key: string;
			content: import("../types.js").PortableTextSpan[];
			markDefs?: import("../types.js").PortableTextMarkDef[];
			isHeader?: boolean;
		}>;
	}> = [];

	// Parse header rows
	if (thead) {
		const headerRows = parseTableRows(thead.childNodes, context, true);
		rows.push(...headerRows);
	}

	// Parse body rows
	if (tbody) {
		const bodyRows = parseTableRows(tbody.childNodes, context, false);
		rows.push(...bodyRows);
	} else if (!thead) {
		// No thead or tbody, parse rows directly
		const directRows = parseTableRows(tableElement.childNodes, context, false);
		rows.push(...directRows);
	}

	if (rows.length === 0) {
		return [];
	}

	return [
		{
			_type: "table" as const,
			_key: context.generateKey(),
			rows,
			hasHeaderRow: !!thead,
		},
	];
};

/**
 * Parse table rows from HTML
 */
function parseTableRows(
	nodes: Node[],
	context: import("../types.js").TransformContext,
	isHeader: boolean,
): Array<{
	_type: "tableRow";
	_key: string;
	cells: Array<{
		_type: "tableCell";
		_key: string;
		content: import("../types.js").PortableTextSpan[];
		markDefs?: import("../types.js").PortableTextMarkDef[];
		isHeader?: boolean;
	}>;
}> {
	const rows: Array<{
		_type: "tableRow";
		_key: string;
		cells: Array<{
			_type: "tableCell";
			_key: string;
			content: import("../types.js").PortableTextSpan[];
			markDefs?: import("../types.js").PortableTextMarkDef[];
			isHeader?: boolean;
		}>;
	}> = [];

	for (const rowNode of getChildElements(nodes, "tr")) {
		const cells: Array<{
			_type: "tableCell";
			_key: string;
			content: import("../types.js").PortableTextSpan[];
			markDefs?: import("../types.js").PortableTextMarkDef[];
			isHeader?: boolean;
		}> = [];

		// Match both th and td cells
		for (const cellNode of rowNode.childNodes) {
			if (!isElement(cellNode)) continue;
			const cellTag = cellNode.tagName.toLowerCase();
			if (cellTag !== "th" && cellTag !== "td") continue;

			const isHeaderCell = cellTag === "th" || isHeader;
			const cellContent = getNodeInnerHtml(cellNode.childNodes);

			const { children, markDefs } = context.parseInlineContent(cellContent);

			cells.push({
				_type: "tableCell" as const,
				_key: context.generateKey(),
				content: children,
				markDefs: markDefs.length > 0 ? markDefs : undefined,
				isHeader: isHeaderCell || undefined,
			});
		}

		if (cells.length > 0) {
			rows.push({
				_type: "tableRow" as const,
				_key: context.generateKey(),
				cells,
			});
		}
	}

	return rows;
}

function getChildElements(nodes: Node[], tagName: string): Element[] {
	return nodes.filter((node): node is Element => isElement(node) && node.tagName.toLowerCase() === tagName);
}

/**
 * Convert a heading level number to a PortableTextTextBlock style
 */
function toHeadingStyle(level: number): PortableTextTextBlock["style"] {
	switch (level) {
		case 1:
			return "h1";
		case 2:
			return "h2";
		case 3:
			return "h3";
		case 4:
			return "h4";
		case 5:
			return "h5";
		case 6:
			return "h6";
		default:
			return "h2";
	}
}

/**
 * Map WordPress alignment to Portable Text alignment
 */
function mapAlignment(
	align: string | undefined,
): "left" | "center" | "right" | "wide" | "full" | undefined {
	switch (align) {
		case "left":
		case "center":
		case "right":
		case "wide":
		case "full":
			return align;
		default:
			return undefined;
	}
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(html: string): string {
	return html;
}

/**
 * core/button → button block
 */
export const button: BlockTransformer = (block, _options, context) => {
	const url = sanitizeHref(attrString(block.attrs, "url"));
	const text = extractText(block.innerHTML).trim() || "Button";

	// Detect button style from className
	let style: "default" | "outline" | "fill" = "default";
	const className = attrString(block.attrs, "className");
	if (className?.includes("is-style-outline")) {
		style = "outline";
	} else if (className?.includes("is-style-fill")) {
		style = "fill";
	}

	return [
		{
			_type: "button",
			_key: context.generateKey(),
			text,
			url,
			style,
		},
	];
};

/**
 * core/buttons → buttons container block
 */
export const buttons: BlockTransformer = (block, _options, context) => {
	const buttonBlocks: Array<{
		_type: "button";
		_key: string;
		text: string;
		url?: string;
		style?: "default" | "outline" | "fill";
	}> = [];

	for (const innerBlock of block.innerBlocks) {
		if (innerBlock.blockName === "core/button") {
			const url = attrString(innerBlock.attrs, "url");
			const text = extractText(innerBlock.innerHTML).trim() || "Button";

			let style: "default" | "outline" | "fill" = "default";
			const className = attrString(innerBlock.attrs, "className");
			if (className?.includes("is-style-outline")) {
				style = "outline";
			} else if (className?.includes("is-style-fill")) {
				style = "fill";
			}

			buttonBlocks.push({
				_type: "button",
				_key: context.generateKey(),
				text,
				url,
				style,
			});
		}
	}

	// Detect layout from attrs
	const layoutObj = attrObject(block.attrs, "layout");
	const layout =
		layoutObj && typeof layoutObj["type"] === "string" && layoutObj["type"] === "flex"
			? "horizontal"
			: "vertical";

	return [
		{
			_type: "buttons",
			_key: context.generateKey(),
			buttons: buttonBlocks,
			layout: layout,
		},
	];
};

/**
 * core/cover → cover block
 */
export const cover: BlockTransformer = (block, _options, context) => {
	const url = attrString(block.attrs, "url");
	const overlayColor = attrString(block.attrs, "overlayColor");
	const customOverlayColor = attrString(block.attrs, "customOverlayColor");
	const dimRatio = attrNumber(block.attrs, "dimRatio");
	const minHeight = attrNumber(block.attrs, "minHeight");
	const minHeightUnit = attrString(block.attrs, "minHeightUnit");
	const contentPosition = attrString(block.attrs, "contentPosition");

	// Transform inner blocks for content
	const content = context.transformBlocks(block.innerBlocks);

	// Determine alignment from content position
	let alignment: "left" | "center" | "right" | undefined;
	if (contentPosition?.includes("left")) alignment = "left";
	else if (contentPosition?.includes("right")) alignment = "right";
	else if (contentPosition?.includes("center")) alignment = "center";

	// Build min height string
	let minHeightStr: string | undefined;
	if (minHeight !== undefined) {
		minHeightStr = minHeightUnit ? `${minHeight}${minHeightUnit}` : `${minHeight}px`;
	}

	return [
		{
			_type: "cover",
			_key: context.generateKey(),
			backgroundImage: url,
			overlayColor: customOverlayColor || overlayColor,
			overlayOpacity: dimRatio !== undefined ? dimRatio / 100 : undefined,
			content,
			minHeight: minHeightStr,
			alignment,
		},
	];
};

/**
 * core/file → file block
 */
export const file: BlockTransformer = (block, _options, context) => {
	const href = sanitizeHref(attrString(block.attrs, "href"));
	const fileName = attrString(block.attrs, "fileName");
	const showDownloadButton = attrBoolean(block.attrs, "showDownloadButton");

	// Try to extract href from HTML if not in attrs
	let url = href;
	if (!url) {
		const linkNode = findFirstElement(block.innerHTML, "a");
		url = sanitizeHref(linkNode ? getAttr(linkNode, "href") : undefined);
	}

	// Try to extract filename from HTML if not in attrs
	let filename = fileName;
	if (!filename && url) {
		filename = url.split("/").pop()?.split("?")[0];
	}

	return [
		{
			_type: "file",
			_key: context.generateKey(),
			url: url || "",
			filename,
			showDownloadButton: showDownloadButton !== false,
		},
	];
};

/**
 * core/pullquote → pullquote block
 */
export const pullquote: BlockTransformer = (block, _options, context) => {
	// Extract text from blockquote > p
	const pNode = findFirstElement(block.innerHTML, "p");
	const text = pNode ? getNodeInnerHtml(pNode.childNodes) : extractText(block.innerHTML);

	// Extract citation
	const citeNode = findFirstElement(block.innerHTML, "cite");
	const citation = citeNode ? getNodeInnerHtml(citeNode.childNodes) : attrString(block.attrs, "citation");

	return [
		{
			_type: "pullquote",
			_key: context.generateKey(),
			text: text.trim(),
			citation: citation?.trim(),
		},
	];
};

/**
 * core/html → htmlBlock (pass through)
 */
export const html: BlockTransformer = (block, _options, context) => {
	return [
		{
			_type: "htmlBlock",
			_key: context.generateKey(),
			html: block.innerHTML.trim(),
			originalBlockName: "core/html",
		},
	];
};

/**
 * core/verse → code block (preserves whitespace like preformatted)
 */
export const verse: BlockTransformer = (block, _options, context) => {
	const text = extractText(block.innerHTML);

	return [
		{
			_type: "code",
			_key: context.generateKey(),
			code: text,
			language: "text", // Mark as plain text
		},
	];
};

/**
 * core/more → break block with "readMore" style
 */
export const more: BlockTransformer = (_block, _options, context) => {
	return [
		{
			_type: "break",
			_key: context.generateKey(),
			style: "lineBreak", // Could be "readMore" if we add that type
		},
	];
};

/**
 * core/nextpage → break block with page break indicator
 */
export const nextpage: BlockTransformer = (_block, _options, context) => {
	return [
		{
			_type: "break",
			_key: context.generateKey(),
			style: "lineBreak", // Could be "pageBreak" if we add that type
		},
	];
};

/**
 * core/shortcode → htmlBlock (preserve for manual handling)
 */
export const shortcode: BlockTransformer = (block, _options, context) => {
	return [
		{
			_type: "htmlBlock",
			_key: context.generateKey(),
			html: block.innerHTML.trim(),
			originalBlockName: "core/shortcode",
		},
	];
};

/**
 * core/media-text → columns block with 2 columns
 */
export const mediaText: BlockTransformer = (block, _options, context) => {
	const mediaId = attrNumber(block.attrs, "mediaId");
	const mediaUrl = attrString(block.attrs, "mediaUrl");
	const mediaType = attrString(block.attrs, "mediaType");
	const mediaPosition = attrString(block.attrs, "mediaPosition");
	const mediaAlt = attrString(block.attrs, "mediaAlt");

	// Create media column
	const mediaBlock: PortableTextBlock[] =
		mediaType === "video"
			? [
					{
						_type: "embed",
						_key: context.generateKey(),
						url: mediaUrl || "",
						provider: "video",
					},
				]
			: [
					{
						_type: "image",
						_key: context.generateKey(),
						asset: {
							_type: "reference",
							_ref: String(mediaId || mediaUrl || ""),
							url: mediaUrl,
						},
						alt: mediaAlt,
					},
				];

	// Transform content blocks
	const contentBlocks = context.transformBlocks(block.innerBlocks);

	// Order based on media position
	const mediaTextColumns =
		mediaPosition === "right"
			? [
					{ _type: "column" as const, _key: context.generateKey(), content: contentBlocks },
					{ _type: "column" as const, _key: context.generateKey(), content: mediaBlock },
				]
			: [
					{ _type: "column" as const, _key: context.generateKey(), content: mediaBlock },
					{ _type: "column" as const, _key: context.generateKey(), content: contentBlocks },
				];

	return [
		{
			_type: "columns",
			_key: context.generateKey(),
			columns: mediaTextColumns,
		},
	];
};
