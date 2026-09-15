import {defineConfig} from "vite";
import {resolve} from "node:path";

import {hydrogen} from "@shopify/hydrogen/vite";
import {oxygen} from "@shopify/mini-oxygen/vite";
import {reactRouter} from "@react-router/dev/vite";

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    reactRouter(),
  ],

  resolve: {
    alias: {
      "~": resolve(__dirname, "app"),
    },
  },

  ssr: {
    resolve: {
      conditions: [
        "workerd",
        "worker",
        "browser",
      ],
      externalConditions: [
        "workerd",
        "worker",
      ],
    },
  },

  build: {
    assetsInlineLimit: 0,
  },
});