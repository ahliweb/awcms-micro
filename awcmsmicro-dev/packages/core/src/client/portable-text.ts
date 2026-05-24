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
			blocks.push(opaque);
			i++;
			continue;
		}

		// Code fence
		if (line.startsWith("```")) {
			const lang = line.slice(3).trim();
			const codeLines: string[] = [];
			i++;
			while (i < lines.length && !lines[i].startsWith("```")) {
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
		if (line.startsWith("> ")) {
			blocks.push(makeBlock(line.slice(2), "blockquote"));
			i++;
			continue;
		}

		// Unordered list
		const listItem = parseListItem(line);
		if (listItem?.kind === "bullet") {
			blocks.push(makeListBlock(listItem.text, "bullet", listItem.level));
			i++;
			continue;
		}

		if (listItem?.kind === "number") {
			blocks.push(makeListBlock(listItem.text, "number", listItem.level));
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

function parseOpaqueFence(line: string): PortableTextBlock | null {
	if (!line.startsWith("<!--ec:block ") || !line.endsWith(" -->")) return null;
	const json = line.slice("<!--ec:block ".length, -4);
	try {
		return JSON.parse(json) as PortableTextBlock;
	} catch {
		return makeBlock(line);
	}
}

function parseHeading(line: string): { level: number; text: string } | null {
	let level = 0;
	while (level < line.length && line[level] === "#" && level < 6) level++;
	if (level < 1 || line[level] !== " ") return null;
	return { level, text: line.slice(level + 1) };
}

function parseListItem(line: string): { kind: "bullet" | "number"; level: number; text: string } | null {
	let i = 0;
	while (i < line.length && line[i] === " ") i++;
	const level = Math.floor(i / 2) + 1;
	const rest = line.slice(i);
	if (rest.length >= 2 && "-*+".includes(rest[0]!) && rest[1] === " ") {
		return { kind: "bullet", level, text: rest.slice(2) };
	}
	let j = 0;
	while (j < rest.length && rest[j] >= "0" && rest[j] <= "9") j++;
	if (j > 0 && rest[j] === "." && rest[j + 1] === " ") {
		return { kind: "number", level, text: rest.slice(j + 2) };
	}
	return null;
}

function parseImage(line: string): { alt: string; url: string } | null {
	if (!line.startsWith("![") || !line.includes("](") || !line.endsWith(")")) return null;
	const altEnd = line.indexOf("](");
	if (altEnd === -1) return null;
	const alt = line.slice(2, altEnd);
	const url = line.slice(altEnd + 2, -1);
	return { alt, url };
}

/**
 * Parse inline markdown (bold, italic, code, links, strikethrough) into PT spans + markDefs.
 */
function parseInline(text: string): ParsedInline {
	const spans: PortableTextSpan[] = [];
	const markDefs: MarkDef[] = [];
	let start = 0;
	let i = 0;

	const pushText = (end: number) => {
		if (end <= start) return;
		spans.push({
			_type: "span",
			_key: generateKey(),
			text: text.slice(start, end),
			marks: [],
		});
	};

	while (i < text.length) {
		if (text.startsWith("**", i)) {
			const close = text.indexOf("**", i + 2);
			if (close !== -1) {
				pushText(i);
				spans.push({ _type: "span", _key: generateKey(), text: text.slice(i + 2, close), marks: ["strong"] });
				i = close + 2;
				start = i;
				continue;
			}
		}

		if (text[i] === "_") {
			const close = text.indexOf("_", i + 1);
			if (close !== -1) {
				pushText(i);
				spans.push({ _type: "span", _key: generateKey(), text: text.slice(i + 1, close), marks: ["em"] });
				i = close + 1;
				start = i;
				continue;
			}
		}

		if (text[i] === "`") {
			const close = text.indexOf("`", i + 1);
			if (close !== -1) {
				pushText(i);
				spans.push({ _type: "span", _key: generateKey(), text: text.slice(i + 1, close), marks: ["code"] });
				i = close + 1;
				start = i;
				continue;
			}
		}

		if (text[i] === "[") {
			const closeBracket = text.indexOf("](", i + 1);
			if (closeBracket !== -1) {
				const closeParen = text.indexOf(")", closeBracket + 2);
				if (closeParen !== -1) {
					pushText(i);
					const key = generateKey();
					markDefs.push({ _key: key, _type: "link", href: text.slice(closeBracket + 2, closeParen) });
					spans.push({ _type: "span", _key: generateKey(), text: text.slice(i + 1, closeBracket), marks: [key] });
					i = closeParen + 1;
					start = i;
					continue;
				}
			}
		}

		if (text.startsWith("~~", i)) {
			const close = text.indexOf("~~", i + 2);
			if (close !== -1) {
				pushText(i);
				spans.push({
					_type: "span",
					_key: generateKey(),
					text: text.slice(i + 2, close),
					marks: ["strike-through"],
				});
				i = close + 2;
				start = i;
				continue;
			}
		}

		i++;
	}

	pushText(text.length);

	if (spans.length === 0) {
		spans.push({ _type: "span", _key: generateKey(), text, marks: [] });
	}

	return { spans, markDefs };
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
