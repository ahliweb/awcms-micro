import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import { SIKESRA_PO_LOCALE_MESSAGES } from "../src/locales/messages.js";

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

const placeholders = (value = "") => [...value.matchAll(/\{[A-Za-z0-9_]+\}|<\/?\d+>/g)].map(String).sort();

	describe("SIKESRA PO catalogs", () => {
	it("cover every compiled navigation adapter key", async () => {
		const expectedKeys = Object.keys(SIKESRA_PO_LOCALE_MESSAGES.en ?? {}).toSorted();

		for (const locale of ["en", "id"] as const) {
			expect(
				(await readCatalog(locale)).map((entry) => entry.msgctxt).toSorted(),
				`${locale} PO catalog keys drifted`,
			).toEqual(expectedKeys);
		}
	});

	it("preserves placeholders between source and translated strings", async () => {
		for (const locale of ["en", "id"] as const) {
			for (const entry of await readCatalog(locale)) {
				expect(placeholders(entry.msgstr), `${locale} placeholder drift in ${entry.msgctxt}`).toEqual(
					placeholders(entry.msgid),
				);
			}
		}
	});
});
