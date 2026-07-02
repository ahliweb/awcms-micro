import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		target: "esnext",
	},
	resolve: {
		alias: {
			// Resolve @emdash-cms/blocks from source for HMR
			"@emdash-cms/blocks": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
		},
	},
});
