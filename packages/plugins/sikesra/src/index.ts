import { definePlugin } from "emdash";
import type { PluginDescriptor } from "emdash";

export interface SikesraPluginOptions {
  enabled?: boolean;
}

export function sikesraPlugin(options: SikesraPluginOptions = {}): PluginDescriptor {
  return {
    id: "sikesra",
    version: "0.1.0",
    format: "native",
    entrypoint: "@ahliweb/plugin-sikesra",
    options,
    adminPages: [
      {
        path: "/",
        label: "SIKESRA",
      },
    ],
  };
}

export function createPlugin(_options: SikesraPluginOptions = {}) {
  return definePlugin({
    id: "sikesra",
    version: "0.1.0",
    routes: {},
    hooks: {},
  });
}

export default createPlugin;
