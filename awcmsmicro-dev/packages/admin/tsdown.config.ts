import { transformAsync } from "@babel/core";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "rolldown";
import { defineConfig } from "tsdown";

const ROOT_DIR = dirname(fileURLToPath(import.meta.url));
const AWCMS_ROOT_VERSION = readFileSync(resolve(ROOT_DIR, "../../../VERSION"), "utf-8").trim() || "0.1.0";

const JS_TS_RE = /\.[jt]sx?$/;

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
		"import.meta.env.AWCMS_ROOT_VERSION": JSON.stringify(AWCMS_ROOT_VERSION),
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
