import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff5f5",
          100: "#ffd9dc",
          500: "#e63946",
          600: "#a51d2a",
          700: "#6e0f18"
        }
      },
      borderRadius: {
        panel: "14px"
      },
      boxShadow: {
        panel: "0 10px 30px -20px rgba(230, 57, 70, 0.25)"
      }
    }
  },
  plugins: [typography]
};

export default config;
