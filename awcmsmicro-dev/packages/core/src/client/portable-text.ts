/**
 * Portable Text <-> Markdown conversion layer.
 *
 * Three tiers of block handling:
 *   Tier 1: Standard PT blocks <-> standard Markdown (headings, paragraphs, lists, etc.)
 *   Tier 2: EmDash custom blocks <-> Markdown directives (future)
 *   Tier 3: Unknown blocks <-> opaque HTML comment fences (preserved, not editable)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Minimal Portable Text block shape */
export interface PortableTextBlock {
	_type: string;
	_key?: string;
	style?: string;
	level?: number;
	listItem?: string;
	markDefs?: MarkDef[];
	children?: PortableTextSpan[];
	[key: string]: unknown;
}

interface PortableTextSpan {
	_type: string;
	_key?: string;
	text?: string;
	marks?: string[];
	[key: string]: unknown;
}

interface MarkDef {
	_key: string;
	_type: string;
	href?: string;
	[key: string]: unknown;
}

interface ParsedInline {
	spans: PortableTextSpan[];
	markDefs: MarkDef[];
}

// ---------------------------------------------------------------------------
// PT -> Markdown
// ---------------------------------------------------------------------------

/**
 * Convert Portable Text blocks to Markdown.
 * Unknown block types are serialized as opaque fences.
 */
export function portableTextToMarkdown(blocks: PortableTextBlock[]): string {
	const lines: string[] = [];
	let prevWasList = false;

	for (let i = 0; i < blocks.length; i++) {
		const block = blocks[i];

		if (block._type === "block") {
			const isList = !!block.listItem;

			// Blank line between non-contiguous block types
			if (i > 0 && (!isList || !prevWasList)) {
				lines.push("");
			}

			lines.push(renderStandardBlock(block));
			prevWasList = isList;
		} else if (block._type === "code") {
			if (i > 0) lines.push("");
			const lang = (block.language as string) || "";
			const code = (block.code as string) || "";
			lines.push("```" + lang);
			lines.push(code);
			lines.push("```");
			prevWasList = false;
		} else if (block._type === "image") {
			if (i > 0) lines.push("");
			const alt = (block.alt as string) || "";
			const url = (block.asset as { url?: string })?.url || "";
			lines.push(`![${alt}](${url})`);
			prevWasList = false;
		} else {
			// Tier 3: Unknown block -> opaque fence
			if (i > 0) lines.push("");
			lines.push(`<!--ec:block ${JSON.stringify(block)} -->`);
			prevWasList = false;
		}
	}

	return lines.join("\n") + "\n";
}

function renderStandardBlock(block: PortableTextBlock): string {
	const text = renderSpans(block.children ?? [], block.markDefs ?? []);

	// List items
	if (block.listItem) {
		const indent = "  ".repeat(Math.max(0, (block.level ?? 1) - 1));
		const marker = block.listItem === "number" ? "1." : "-";
		return `${indent}${marker} ${text}`;
	}

	// Headings
	if (block.style && block.style.startsWith("h")) {
		const level = parseInt(block.style.substring(1), 10);
		if (level >= 1 && level <= 6) {
			return `${"#".repeat(level)} ${text}`;
		}
	}

	// Blockquote
	if (block.style === "blockquote") {
		return `> ${text}`;
	}

	return text;
}

function renderSpans(spans: PortableTextSpan[], markDefs: MarkDef[]): string {
	let result = "";

	for (const span of spans) {
		if (span._type !== "span") continue;

		let text = span.text ?? "";
		const marks = span.marks ?? [];

		for (const mark of marks) {
			const def = markDefs.find((d) => d._key === mark);
			if (def) {
				if (def._type === "link") {
					text = `[${text}](${def.href ?? ""})`;
				}
			} else {
				switch (mark) {
					case "strong":
						text = `**${text}**`;
						break;
					case "em":
						text = `_${text}_`;
						break;
					case "code":
						text = `\`${text}\``;
						break;
					case "strike-through":
					case "strikethrough":
						text = `~~${text}~~`;
						break;
				}
			}
		}

		result += text;
	}

	return result;
}

// ---------------------------------------------------------------------------
// Markdown -> PT
// ---------------------------------------------------------------------------

/**
 * Convert Markdown to Portable Text blocks.
 * Opaque fences (<!--ec:block ... -->) are deserialized and spliced back in.
 */
export function markdownToPortableText(markdown: string): PortableTextBlock[] {
	const blocks: PortableTextBlock[] = [];
	const lines = markdown.split("\n");
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];

		// Opaque fence
		const opaque = parseOpaqueFence(line);
		if (opaque) {
			try {
				blocks.push(JSON.parse(opaque) as PortableTextBlock);
			} catch {
				blocks.push(makeBlock(line));
			}
			i++;
			continue;
		}

		// Code fence
		if (isCodeFence(line)) {
			const lang = line.slice(3).trim();
			const codeLines: string[] = [];
			i++;
			while (i < lines.length && !isCodeFence(lines[i])) {
				codeLines.push(lines[i]);
				i++;
			}
			blocks.push({
				_type: "code",
				_key: generateKey(),
				language: lang || undefined,
				code: codeLines.join("\n"),
			});
			i++; // skip closing ```
			continue;
		}

		// Blank line
		if (line.trim() === "") {
			i++;
			continue;
		}

		// Heading
		const heading = parseHeading(line);
		if (heading) {
			blocks.push(makeBlock(heading.text, `h${heading.level}`));
			i++;
			continue;
		}

		// Blockquote
		if (isBlockquote(line)) {
			blocks.push(makeBlock(line.slice(2), "blockquote"));
			i++;
			continue;
		}

		// Unordered list
		const unorderedList = parseUnorderedList(line);
		if (unorderedList) {
			blocks.push(makeListBlock(unorderedList.text, "bullet", unorderedList.level));
			i++;
			continue;
		}

		// Ordered list
		const orderedList = parseOrderedList(line);
		if (orderedList) {
			blocks.push(makeListBlock(orderedList.text, "number", orderedList.level));
			i++;
			continue;
		}

		// Image
		const image = parseImage(line);
		if (image) {
			blocks.push({
				_type: "image",
				_key: generateKey(),
				alt: image.alt,
				asset: { url: image.url },
			});
			i++;
			continue;
		}

		// Paragraph
		blocks.push(makeBlock(line));
		i++;
	}

	return blocks;
}

function parseOpaqueFence(line: string): string | null {
	if (line.length < 17 || line.slice(0, 13) !== "<!--ec:block ") return null;
	if (line.slice(-4) !== " -->") return null;
	return line.slice(13, -4);
}

function isCodeFence(line: string): boolean {
	return line.length >= 3 && line.charCodeAt(0) === 96 && line.charCodeAt(1) === 96 && line.charCodeAt(2) === 96;
}

function isBlockquote(line: string): boolean {
	return line.length >= 2 && line.charCodeAt(0) === 62 && line.charCodeAt(1) === 32;
}

// ---------------------------------------------------------------------------
// Block builders
// ---------------------------------------------------------------------------

function makeBlock(text: string, style: string = "normal"): PortableTextBlock {
	const { spans, markDefs } = parseInline(text);
	return { _type: "block", _key: generateKey(), style, markDefs, children: spans };
}

function makeListBlock(text: string, listItem: string, level: number): PortableTextBlock {
	const { spans, markDefs } = parseInline(text);
	return {
		_type: "block",
		_key: generateKey(),
		style: "normal",
		listItem,
		level,
		markDefs,
		children: spans,
	};
}

/**
 * Parse inline markdown (bold, italic, code, links, strikethrough) into PT spans + markDefs.
 */
function parseInline(text: string): ParsedInline {
	const spans: PortableTextSpan[] = [];
	const markDefs: MarkDef[] = [];

	let i = 0;
	let lastTextStart = 0;

	while (i < text.length) {
		if (text.charCodeAt(i) === 42 && text.charCodeAt(i + 1) === 42) {
			const end = findClosingDelimiter(text, "**", i + 2);
			if (end > i + 2) {
				pushTextSpan(text, spans, lastTextStart, i);
				spans.push({ _type: "span", _key: generateKey(), text: text.slice(i + 2, end), marks: ["strong"] });
				i = end + 2;
				lastTextStart = i;
				continue;
			}
		}

		if (text[i] === "_") {
			const end = findClosingChar(text, "_", i + 1);
			if (end > i + 1) {
				pushTextSpan(text, spans, lastTextStart, i);
				spans.push({ _type: "span", _key: generateKey(), text: text.slice(i + 1, end), marks: ["em"] });
				i = end + 1;
				lastTextStart = i;
				continue;
			}
		}

		if (text[i] === "`") {
			const end = findClosingChar(text, "`", i + 1);
			if (end > i + 1) {
				pushTextSpan(text, spans, lastTextStart, i);
				spans.push({ _type: "span", _key: generateKey(), text: text.slice(i + 1, end), marks: ["code"] });
				i = end + 1;
				lastTextStart = i;
				continue;
			}
		}

		if (text.charCodeAt(i) === 126 && text.charCodeAt(i + 1) === 126) {
			const end = findClosingDelimiter(text, "~~", i + 2);
			if (end > i + 2) {
				pushTextSpan(text, spans, lastTextStart, i);
				spans.push({
					_type: "span",
					_key: generateKey(),
					text: text.slice(i + 2, end),
					marks: ["strike-through"],
				});
				i = end + 2;
				lastTextStart = i;
				continue;
			}
		}

		if (text[i] === "[") {
			const closeBracket = findClosingDelimiter(text, "](", i + 1);
			const closeParen = closeBracket === -1 ? -1 : findClosingChar(text, ")", closeBracket + 2);
			if (closeBracket > i + 1 && closeParen > closeBracket + 2) {
				pushTextSpan(text, spans, lastTextStart, i);
				const key = generateKey();
				markDefs.push({ _key: key, _type: "link", href: text.slice(closeBracket + 2, closeParen) });
				spans.push({ _type: "span", _key: generateKey(), text: text.slice(i + 1, closeBracket), marks: [key] });
				i = closeParen + 1;
				lastTextStart = i;
				continue;
			}
		}

		i += 1;
	}

	pushTextSpan(text, spans, lastTextStart, text.length);

	if (spans.length === 0) {
		spans.push({ _type: "span", _key: generateKey(), text, marks: [] });
	}

	return { spans, markDefs };
}

function pushTextSpan(text: string, spans: PortableTextSpan[], start: number, end: number): void {
	if (end > start) {
			spans.push({
				_type: "span",
				_key: generateKey(),
				text: text.slice(start, end),
				marks: [],
			});
		}
}

function parseHeading(line: string): { level: number; text: string } | null {
	let level = 0;
	while (level < 6 && line[level] === "#") level++;
	if (level === 0 || line[level] !== " ") return null;
	const text = line.slice(level + 1);
	return text ? { level, text } : null;
}

function parseUnorderedList(line: string): { level: number; text: string } | null {
	const trimmed = line.trimStart();
	const indent = line.length - trimmed.length;
	const marker = trimmed[0];
	if (marker !== "-" && marker !== "*" && marker !== "+") return null;
	if (trimmed[1] !== " ") return null;
	const text = trimmed.slice(2);
	return text ? { level: Math.floor(indent / 2) + 1, text } : null;
}

function parseOrderedList(line: string): { level: number; text: string } | null {
	const trimmed = line.trimStart();
	const indent = line.length - trimmed.length;
	let cursor = 0;
	let sawDigit = false;
	while (true) {
		const code = trimmed.charCodeAt(cursor);
		if (code < 48 || code > 57) break;
		sawDigit = true;
		cursor++;
	}
	if (!sawDigit || trimmed[cursor] !== "." || trimmed[cursor + 1] !== " ") return null;
	const text = trimmed.slice(cursor + 2);
	return text ? { level: Math.floor(indent / 2) + 1, text } : null;
}

function parseImage(line: string): { alt: string; url: string } | null {
	if (line.length < 5 || line.charCodeAt(0) !== 33 || line.charCodeAt(1) !== 91) return null;
	const closeBracket = findClosingDelimiter(line, "](", 2);
	if (closeBracket <= 2 || line.charCodeAt(line.length - 1) !== 41) return null;
	const alt = line.slice(2, closeBracket);
	const url = line.slice(closeBracket + 2, -1);
	return alt && url ? { alt, url } : null;
}

function findClosingChar(text: string, ch: string, fromIndex: number): number {
	for (let i = fromIndex; i < text.length; i++) {
		if (text[i] === ch) return i;
	}
	return -1;
}

function findClosingDelimiter(text: string, delimiter: string, fromIndex: number): number {
	for (let i = fromIndex; i <= text.length - delimiter.length; i++) {
		if (text.slice(i, i + delimiter.length) === delimiter) return i;
	}
	return -1;
}

// ---------------------------------------------------------------------------
// Key generation
// ---------------------------------------------------------------------------

let keyCounter = 0;

function generateKey(): string {
	return `k${(keyCounter++).toString(36)}`;
}

/** Reset key counter (useful for testing) */
export function resetKeyCounter(): void {
	keyCounter = 0;
}

// ---------------------------------------------------------------------------
// Schema-aware conversion helpers
// ---------------------------------------------------------------------------

export interface FieldSchema {
	slug: string;
	type: string;
}

/**
 * Convert content data for reading: PT fields -> markdown strings.
 * Only converts fields with type "portableText" that contain arrays.
 */
export function convertDataForRead(
	data: Record<string, unknown>,
	fields: FieldSchema[],
	raw: boolean = false,
): Record<string, unknown> {
	if (raw) return data;

	const result = { ...data };
	for (const field of fields) {
		if (field.type === "portableText" && Array.isArray(result[field.slug])) {
			result[field.slug] = portableTextToMarkdown(result[field.slug] as PortableTextBlock[]);
		}
	}
	return result;
}

/**
 * Convert content data for writing: markdown strings -> PT arrays.
 * Only converts fields with type "portableText" that contain strings.
 */
export function convertDataForWrite(
	data: Record<string, unknown>,
	fields: FieldSchema[],
): Record<string, unknown> {
	const result = { ...data };
	for (const field of fields) {
		if (field.type === "portableText" && typeof result[field.slug] === "string") {
			result[field.slug] = markdownToPortableText(result[field.slug] as string);
		}
	}
	return result;
}
