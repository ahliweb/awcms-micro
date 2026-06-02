import { transformAsync } from "@babel/core";
import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import type { Plugin } from "rolldown";
import { defineConfig } from "tsdown";

const JS_TS_RE = /\.[jt]sx?$/;
const CHANGELOG_VERSION_RE = /^##\s+([^\s]+)/m;
const ROOT_VERSION_PATHS = [new URL("../../../VERSION", import.meta.url), new URL("../../VERSION", import.meta.url)];
const ROOT_CHANGELOG_PATHS = [
	new URL("../../../CHANGELOG.md", import.meta.url),
	new URL("../../CHANGELOG.md", import.meta.url),
];

function readFirstExisting(paths: URL[]): string | undefined {
	for (const path of paths) {
		if (existsSync(path)) return readFileSync(path, "utf8").trim();
	}
}

function readRootVersion(): string {
	const version = readFirstExisting(ROOT_VERSION_PATHS);
	if (version) return version;

	const changelog = readFirstExisting(ROOT_CHANGELOG_PATHS);
	const latestChangelogVersion = changelog?.match(CHANGELOG_VERSION_RE)?.[1];
	return latestChangelogVersion || "0.0.0";
}

function readRootCommit(): string {
	try {
		return execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
	} catch {
		return "";
	}
}

function linguiMacroPlugin(): Plugin {
	return {
		name: "lingui-macro",
		transform: {
			filter: { id: JS_TS_RE },
			async handler(code: string, id: string) {
				if (!code.includes("@lingui")) return;
				const result = await transformAsync(code, {
					filename: id,
					plugins: ["@lingui/babel-plugin-lingui-macro"],
					parserOpts: { plugins: ["jsx", "typescript"] },
				});
				if (!result?.code) return;
				return { code: result.code, map: result.map ?? undefined };
			},
		},
	};
}

export default defineConfig({
	entry: ["src/index.ts", "src/locales/index.ts"],
	format: ["esm"],
	dts: true,
	clean: true,
	platform: "browser",
	plugins: [linguiMacroPlugin()],
	define: {
		"import.meta.env.AWCMS_ROOT_VERSION": JSON.stringify(readRootVersion()),
		"import.meta.env.AWCMS_ROOT_COMMIT": JSON.stringify(readRootCommit()),
	},
	// @tiptap/suggestion is intentionally bundled (devDependency)
	inlineOnly: false,
	external: [
		"react",
		"react-dom",
		"react/jsx-runtime",
		"react/jsx-dev-runtime",
		// Keep TanStack external - Vite in consumer project will need to resolve these
		"@tanstack/react-router",
		"@tanstack/react-query",
	],
});
