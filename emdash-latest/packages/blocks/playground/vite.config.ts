import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		// esbuild 0.28.x can't downlevel Rolldown-generated destructuring to browser targets; playground is dev-only.
		target: "esnext",
	},
	resolve: {
		alias: {
			// Resolve @emdash-cms/blocks from source for HMR
			"@emdash-cms/blocks": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
		},
	},
});
