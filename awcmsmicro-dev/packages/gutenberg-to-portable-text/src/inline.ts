/**
 * Inline HTML to Portable Text spans converter
 *
 * Parses inline HTML elements (strong, em, a, code, etc.) and converts
 * them to Portable Text spans with marks.
 */

import { parseFragment, type DefaultTreeAdapterMap } from "parse5";

import type { PortableTextSpan, PortableTextMarkDef } from "./types.js";
import { sanitizeHref } from "./url.js";

// Regex patterns for inline parsing
const WHITESPACE_PATTERN = /\S/;

type Node = DefaultTreeAdapterMap["node"];
type TextNode = DefaultTreeAdapterMap["textNode"];
type Element = DefaultTreeAdapterMap["element"];

interface ParseResult {
	children: PortableTextSpan[];
	markDefs: PortableTextMarkDef[];
}

/**
 * Parse inline HTML content into Portable Text spans
 */
export function parseInlineContent(html: string, generateKey: () => string): ParseResult {
	const children: PortableTextSpan[] = [];
	const markDefs: PortableTextMarkDef[] = [];
	const markDefMap = new Map<string, string>();

	// Handle whitespace-only input BEFORE stripping (parse5 normalizes whitespace away)
	if (html.length > 0 && !WHITESPACE_PATTERN.test(html)) {
		return {
			children: [{ _type: "span", _key: generateKey(), text: html }],
			markDefs: [],
		};
	}

	// Strip wrapping tags like <p>, <h1>, etc.
	const strippedHtml = stripBlockTags(html);

	// Parse HTML fragment
	const fragment = parseFragment(strippedHtml);

	// Walk the tree and build spans
	walkNodes(fragment.childNodes, [], children, markDefs, markDefMap, generateKey);

	// Ensure at least one span exists
	if (children.length === 0) {
		children.push({
			_type: "span",
			_key: generateKey(),
			text: "",
		});
	}

	return { children, markDefs };
}

/**
 * Strip common block-level wrapper tags
 */
function stripBlockTags(html: string): string {
	// Remove leading/trailing whitespace
	let stripped = html.trim();

	// Strip common block wrappers
	const blockTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "blockquote", "figcaption"];

	for (const tag of blockTags) {
		const unwrapped = unwrapBlockTag(stripped, tag);
		if (unwrapped !== stripped) {
			stripped = unwrapped;
			break;
		}
	}

	return stripped;
}

function unwrapBlockTag(html: string, tag: string): string {
	const lower = html.toLowerCase();
	const openPrefix = `<${tag}`;
	if (!lower.startsWith(openPrefix)) return html;

	const openEnd = html.indexOf(">");
	if (openEnd === -1) return html;

	const close = `</${tag}>`;
	if (!lower.endsWith(close)) return html;

	return html.slice(openEnd + 1, html.length - close.length).trim();
}

/**
 * Recursively walk DOM nodes and build spans
 */
function walkNodes(
	nodes: Node[],
	currentMarks: string[],
	children: PortableTextSpan[],
	markDefs: PortableTextMarkDef[],
	markDefMap: Map<string, string>,
	generateKey: () => string,
): void {
	for (const node of nodes) {
		if (isTextNode(node)) {
			const text = node.value;
			if (text) {
				// Handle line breaks in text
				const parts = text.split("\n");
				for (let i = 0; i < parts.length; i++) {
					const part = parts[i];
					if (part || i > 0) {
						// Add text span
						if (part) {
							children.push({
								_type: "span",
								_key: generateKey(),
								text: part,
								marks: currentMarks.length > 0 ? [...currentMarks] : undefined,
							});
						}
						// Add newline (except after last part)
						if (i < parts.length - 1) {
							// Append newline to previous span or create new one
							if (children.length > 0) {
								const lastChild = children.at(-1);
								if (lastChild) {
									lastChild.text += "\n";
								}
							} else {
								children.push({
									_type: "span",
									_key: generateKey(),
									text: "\n",
								});
							}
						}
					}
				}
			}
		} else if (isElement(node)) {
			const tagName = node.tagName.toLowerCase();

			// Handle <br> as newline
			if (tagName === "br") {
				if (children.length > 0) {
					const lastChild = children.at(-1);
					if (lastChild) {
						lastChild.text += "\n";
					}
				} else {
					children.push({
						_type: "span",
						_key: generateKey(),
						text: "\n",
					});
				}
				continue;
			}

			// Get mark for this element
			const markResult = getMarkForElement(node, markDefs, markDefMap, generateKey);
			const newMarks = markResult ? [...currentMarks, markResult] : currentMarks;

			// Recurse into children
			walkNodes(node.childNodes, newMarks, children, markDefs, markDefMap, generateKey);
		}
	}
}

/**
 * Get the Portable Text mark for an HTML element
 */
function getMarkForElement(
	element: Element,
	markDefs: PortableTextMarkDef[],
	markDefMap: Map<string, string>,
	generateKey: () => string,
): string | null {
	const tagName = element.tagName.toLowerCase();

	switch (tagName) {
		case "strong":
		case "b":
			return "strong";

		case "em":
		case "i":
			return "em";

		case "u":
			return "underline";

		case "s":
		case "strike":
		case "del":
			return "strike-through";

		case "code":
			return "code";

		case "sup":
			return "superscript";

		case "sub":
			return "subscript";

		case "a": {
			const href = sanitizeHref(getAttr(element, "href"));
			const target = getAttr(element, "target");

			// Check if we already have a markDef for this href
			const existingKey = markDefMap.get(href);
			if (existingKey) {
				return existingKey;
			}

			// Create new mark definition
			const key = generateKey();
			const markDef: PortableTextMarkDef = {
				_type: "link",
				_key: key,
				href,
			};
			if (target === "_blank") {
				markDef.blank = true;
			}
			markDefs.push(markDef);
			markDefMap.set(href, key);
			return key;
		}

		default:
			// Unknown inline element - ignore the tag, process children
			return null;
	}
}

/**
 * Get attribute value from element
 */
function getAttr(element: Element, name: string): string | undefined {
	const attr = element.attrs.find((a) => a.name.toLowerCase() === name);
	return attr?.value;
}

/**
 * Type guard for text nodes
 */
function isTextNode(node: Node): node is TextNode {
	return node.nodeName === "#text";
}

/**
 * Type guard for elements
 */
function isElement(node: Node): node is Element {
	return "tagName" in node;
}

/**
 * Extract plain text from HTML (for alt text, captions)
 */
export function extractText(html: string): string {
	const fragment = parseFragment(html);
	return getTextContent(fragment.childNodes);
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

/**
 * Extract alt text from an img element in HTML
 */
export function extractAlt(html: string): string | undefined {
	return findFirstElement(parseFragment(html), "img")?.attrs.find((attr) => attr.name === "alt")?.value;
}

/**
 * Extract caption from a figcaption element
 */
export function extractCaption(html: string): string | undefined {
	const element = findFirstElement(parseFragment(html), "figcaption");
	return element ? extractText(getTextContent(element.childNodes)) : undefined;
}

/**
 * Extract src from an img element
 */
export function extractSrc(html: string): string | undefined {
	const src = findFirstElement(parseFragment(html), "img")?.attrs.find((attr) => attr.name === "src")?.value;
	return src ? decodeUrlEntities(src) : undefined;
}

/**
 * Decode HTML entities commonly found in URLs
 */
function decodeUrlEntities(url: string): string {
	let out = "";
	for (let i = 0; i < url.length; i++) {
		if (url.startsWith("&#038;", i) || url.startsWith("&#38;", i) || url.startsWith("&#x26;", i)) {
			out += "&";
			i += url.startsWith("&#038;", i) || url.startsWith("&#x26;", i) ? 5 : 4;
			continue;
		}
		if (url.startsWith("&amp;", i)) {
			out += "&";
			i += 4;
			continue;
		}
		out += url[i]!;
	}
	return out;
}

function findFirstElement(node: Node, tagName: string): Element | undefined {
	if (isElement(node) && node.tagName.toLowerCase() === tagName) {
		return node;
	}
	if ("childNodes" in node && Array.isArray(node.childNodes)) {
		for (const child of node.childNodes) {
			const found = findFirstElement(child, tagName);
			if (found) return found;
		}
	}
	return undefined;
}
