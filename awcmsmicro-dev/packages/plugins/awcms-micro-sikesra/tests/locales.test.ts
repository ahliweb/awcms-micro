import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import { getExampleAdminCopy } from "../src/admin-copy.js";
import {
	SIKESRA_ADMIN_COPY_MESSAGE_KEYS,
	SIKESRA_PO_LOCALE_MESSAGES,
} from "../src/locales/messages.js";

type PoEntry = {
	msgctxt?: string;
	msgid?: string;
	msgstr?: string;
};

const unescapePo = (value: string) => value.replace(/\\"/g, '"').replace(/\\\\/g, "\\");

const parsePoEntries = (catalog: string) => {
	const entries: PoEntry[] = [];
	let current: PoEntry = {};

	for (const line of catalog.split("\n")) {
		const match = /^(msgctxt|msgid|msgstr) "((?:\\.|[^"\\])*)"$/.exec(line);
		if (!match) continue;
		const field = match[1] as keyof PoEntry;
		const value = match[2] ?? "";
		if (field === "msgctxt" && (current.msgid || current.msgstr)) {
			entries.push(current);
			current = {};
		}
		current[field as keyof PoEntry] = unescapePo(value);
		if (field === "msgstr") {
			entries.push(current);
			current = {};
		}
	}

	return entries;
};

const readCatalog = async (locale: "en" | "id") =>
	parsePoEntries(
		await readFile(new URL(`../src/locales/${locale}/messages.po`, import.meta.url), "utf8"),
	);

const placeholders = (value = "") =>
	Array.from(value.matchAll(/\{[A-Za-z0-9_]+\}|<\/?\d+>/g), String).sort();

const copyShape = (value: unknown, path = "root") => {
	const shape = new Map<string, string>();

	const visit = (current: unknown, currentPath: string) => {
		if (Array.isArray(current)) {
			shape.set(currentPath, `array:${current.length}`);
			current.forEach((item, index) => visit(item, `${currentPath}[${index}]`));
			return;
		}

		if (typeof current === "function") {
			shape.set(currentPath, `function:${current.length}`);
			return;
		}

		if (current && typeof current === "object") {
			shape.set(currentPath, "object");
			for (const [key, item] of Object.entries(current)) {
				visit(item, `${currentPath}.${key}`);
			}
			return;
		}

		shape.set(currentPath, typeof current);
	};

	visit(value, path);
	return Object.fromEntries(
		[...shape.entries()].toSorted(([left], [right]) => left.localeCompare(right)),
	);
};

describe("SIKESRA PO catalogs", () => {
	it("cover every compiled runtime adapter key", async () => {
		const expectedKeys = Object.keys(SIKESRA_PO_LOCALE_MESSAGES.en ?? {}).toSorted();

		for (const locale of ["en", "id"] as const) {
			expect(
				(await readCatalog(locale))
					.map((entry) => entry.msgctxt)
					.filter((key): key is string =>
						Boolean(key?.startsWith("awcms.nav.") || key?.startsWith("awcms.meta.")),
					)
					.toSorted(),
				`${locale} PO runtime catalog keys drifted`,
			).toEqual(expectedKeys);
		}
	});

	it("cover every migrated admin-copy adapter key", async () => {
		const expectedKeys = SIKESRA_ADMIN_COPY_MESSAGE_KEYS.toSorted();

		for (const locale of ["en", "id"] as const) {
			expect(
				(await readCatalog(locale))
					.map((entry) => entry.msgctxt)
					.filter((key): key is string => key?.startsWith("awcms.adminCopy.") ?? false)
					.toSorted(),
				`${locale} PO admin-copy keys drifted`,
			).toEqual(expectedKeys);
		}
	});

	it("preserves placeholders between source and translated strings", async () => {
		for (const locale of ["en", "id"] as const) {
			for (const entry of await readCatalog(locale)) {
				expect(
					placeholders(entry.msgstr),
					`${locale} placeholder drift in ${entry.msgctxt}`,
				).toEqual(placeholders(entry.msgid));
			}
		}
	});

	it("keeps the temporary admin-copy adapter shape aligned across en and id", () => {
		expect(copyShape(getExampleAdminCopy("id"))).toEqual(copyShape(getExampleAdminCopy("en")));
	});
});
