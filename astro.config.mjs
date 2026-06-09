import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  integrations: [react()],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh-CN"],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
