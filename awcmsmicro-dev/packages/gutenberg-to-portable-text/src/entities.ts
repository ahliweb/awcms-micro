const HTML_ENTITY_REPLACEMENTS: Array<[string, string]> = [
	["&lt;", "<"],
	["&gt;", ">"],
	["&quot;", '"'],
	["&#039;", "'"],
	["&#39;", "'"],
	["&nbsp;", " "],
	["&#038;", "&"],
	["&#38;", "&"],
	["&#x26;", "&"],
	["&#X26;", "&"],
	["&amp;", "&"],
];

const URL_ENTITY_REPLACEMENTS: Array<[string, string]> = [
	["&#038;", "&"],
	["&#38;", "&"],
	["&#x26;", "&"],
	["&#X26;", "&"],
	["&amp;", "&"],
];

function replaceAllLiteral(input: string, search: string, replacement: string): string {
	return input.includes(search) ? input.split(search).join(replacement) : input;
}

export function decodeHtmlEntities(input: string): string {
	let output = input;
	for (const [search, replacement] of HTML_ENTITY_REPLACEMENTS) {
		output = replaceAllLiteral(output, search, replacement);
	}
	return output;
}

export function decodeUrlEntities(input: string): string {
	let output = input;
	for (const [search, replacement] of URL_ENTITY_REPLACEMENTS) {
		output = replaceAllLiteral(output, search, replacement);
	}
	return output;
}
