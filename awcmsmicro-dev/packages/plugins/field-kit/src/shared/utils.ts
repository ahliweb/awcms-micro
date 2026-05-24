import type { SubFieldDef, GridAxisDef } from "./types";

/**
 * Normalize a value into a plain object keyed by sub-field definitions.
 * Missing declared keys get their defaultValue (or undefined). Keys present
 * on the input that aren't declared in `fields` are preserved verbatim, so
 * stored JSON round-trips cleanly when the schema evolves or partial data
 * is managed outside this widget.
 */
export function normalizeObject(value: unknown, fields: SubFieldDef[]): Record<string, unknown> {
	const source =
		value && typeof value === "object" && !Array.isArray(value)
			? (value as Record<string, unknown>)
			: {};
	const result: Record<string, unknown> = Object.create(null);
	for (const [key, val] of Object.entries(source)) {
		if (isSafeObjectKey(key)) {
			Object.defineProperty(result, key, {
				value: val,
				enumerable: true,
				writable: true,
				configurable: true,
			});
		}
	}
	for (const field of fields) {
		if (!isSafeObjectKey(field.key)) continue;
		if (result[field.key] === undefined) {
			Object.defineProperty(result, field.key, {
				value: field.defaultValue ?? undefined,
				enumerable: true,
				writable: true,
				configurable: true,
			});
		}
	}
	return result;
}

/** Normalize a value into an array. Non-arrays become empty arrays. */
export function normalizeArray(value: unknown): unknown[] {
	return Array.isArray(value) ? value : [];
}

/**
 * Normalize a grid value into `{ rowKey: { colKey: cellValue } }`.
 *
 * Handles two input formats:
 * - Object format: `{ jan: { leaf: true, fruit: true } }` (canonical)
 * - Array format: `{ jan: ["leaf", "fruit"] }` (legacy, e.g. harvest calendar)
 *
 * Missing rows are initialized as empty objects.
 */
export function normalizeGrid(
	value: unknown,
	rows: GridAxisDef[],
	columns: GridAxisDef[],
): Record<string, Record<string, unknown>> {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		return Object.fromEntries(rows.map((row) => [row.key, {}]));
	}

	const source = value as Record<string, unknown>;
	return Object.fromEntries(rows.map((row) => {
		const rowVal = source[row.key];
		const rowEntries: Array<[string, unknown]> = [];
		if (Array.isArray(rowVal)) {
			// Legacy array format: convert ["leaf", "fruit"] → { leaf: true, fruit: true }
			for (const code of rowVal) {
				if (typeof code === "string") {
					if (isSafeObjectKey(code)) {
						rowEntries.push([code, true]);
					}
				}
			}
		} else if (rowVal && typeof rowVal === "object") {
			// Object format: preserve all stored keys, then layer declared columns
			// over them. Unknown keys survive so cells added to the schema later
			// or managed outside this widget aren't silently dropped on save.
			const rowObj = rowVal as Record<string, unknown>;
			for (const [key, val] of Object.entries(rowObj)) {
				if (isSafeObjectKey(key)) {
					rowEntries.push([key, val]);
				}
			}
			for (const col of columns) {
				if (isSafeObjectKey(col.key) && rowObj[col.key] !== undefined) {
					rowEntries.push([col.key, rowObj[col.key]]);
				}
			}
		}
		return [row.key, Object.fromEntries(rowEntries)];
	}));
}

/** Normalize a value into a string array. Filters out non-strings. */
export function normalizeTags(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value.filter((item): item is string => typeof item === "string");
}

const MUSTACHE_PATTERN = /\{\{(\w+)\}\}/g;

/**
 * Render a simple mustache-style summary template.
 * Replaces `{{key}}` with the corresponding value from `item`.
 * Non-scalar values render as empty to avoid `[object Object]` leaking into UI.
 */
export function renderSummary(template: string, item: Record<string, unknown>): string {
	return template.replace(MUSTACHE_PATTERN, (_match, key: string) => {
		const val = item[key];
		if (val === undefined || val === null) return "";
		if (typeof val === "string") return val;
		if (typeof val === "number" || typeof val === "boolean") return String(val);
		return "";
	});
}

function isSafeObjectKey(key: string): boolean {
	return key !== "__proto__" && key !== "prototype" && key !== "constructor";
}
