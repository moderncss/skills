// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
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
