import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2, sandbox } from "@emdash-cms/cloudflare";
import { defineConfig, fontProviders } from "astro/config";
import emdash from "emdash/astro";
import awcmsMicroPlugin from "./src/plugins/awcms-micro-plugin";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  site: "https://awcms-micro.ahlikoding.com",
  vite: {
    resolve: {
      alias: {
        "awcms-micro-plugin": "/home/data/dev_react/awcms-micro/src/plugins/awcms-micro-plugin",
      },
    },
  },
  integrations: [
    react(),
    emdash({
      database: d1({ binding: "DB", session: "auto" }),
      storage: r2({
        binding: "MEDIA",
        publicUrl: "https://awcms-micro-s3.ahlikoding.com",
      }),
      plugins: [awcmsMicroPlugin()],
      sandboxRunner: sandbox(),
      marketplace: "https://marketplace.emdashcms.com",
    }),
  ],
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-sans",
      weights: [400, 500, 600, 700],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-mono",
      weights: [400, 500],
      fallbacks: ["monospace"],
    },
  ],
  devToolbar: { enabled: false },
});
