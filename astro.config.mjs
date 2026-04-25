// @ts-check
import { defineConfig } from "astro/config";
import spotlight from "@spotlightjs/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [spotlight()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "one-light",
        dark: "github-dark-default",
      },
      defaultColor: "light-dark()",
    },
  },
});
