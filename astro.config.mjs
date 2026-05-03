// @ts-check
import { defineConfig } from "astro/config";
import sentry from "@sentry/astro";
import spotlight from "@spotlightjs/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [sentry({ telemetry: false }), spotlight()],
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
