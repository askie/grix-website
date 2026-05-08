import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff9ff",
          100: "#dff1ff",
          500: "#1477ff",
          600: "#0f61d4",
          700: "#0f4da7"
        }
      },
      borderRadius: {
        panel: "14px"
      },
      boxShadow: {
        panel: "0 10px 30px -20px rgba(15, 97, 212, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
