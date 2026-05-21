import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2, sandbox } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import { awcmsExamplePlugin } from "./src/plugins/awcms-example-plugin";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  vite: {
    resolve: {
      alias: {
        "awcms-example-plugin": "/home/data/dev_react/awcms-micro/src/plugins/awcms-example-plugin",
      },
    },
  },
  integrations: [
    react(),
    emdash({
      database: d1({ binding: "DB", session: "auto" }),
      storage: r2({ binding: "MEDIA" }),
      plugins: [awcmsExamplePlugin()],
      sandboxRunner: sandbox(),
      marketplace: "https://marketplace.emdashcms.com",
    }),
  ],
  devToolbar: { enabled: false },
});
