import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

// Design tokens follow the "Steep" style spec: warm/cool pastel washes on a
// pure-white canvas, ink neutrals, a single rust accent, serif display + sans body.
const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Palette mirrors the Grix app theme (lib/app/themes/app_theme.dart):
        // warm cream surfaces + 龙虾红 accent + deep-brown text.
        ink: "#2a2214", // lightTextPrimary (deep brown — headings/body)
        fog: "#f7f0e0", // lightInput (warm secondary surface)
        ash: "#7a6641", // lightTextSecondary (brown-grey body)
        graphite: "#9a8763", // muted brown (tertiary text)
        dove: "#c9bda0", // hairline / placeholder
        rust: "#a51d2a", // primaryDark (accent text on washes)
        apricot: "#ffd9dc", // primaryContainer (pink wash)
        sky: "#ffe0cc", // tertiaryContainer (peach wash)
        honey: "#f5e6c8", // secondaryContainer (honey-cream wash)
        cream: {
          bg: "#fdf9ef", // lightBg (page canvas)
          card: "#fffcf5", // lightCard (surfaces)
          divider: "#e8ddc8" // lightDivider
        },
        brand: {
          50: "#fff5f5",
          100: "#ffd9dc", // primaryContainer
          500: "#e63946", // primaryColor 龙虾红
          600: "#a51d2a", // primaryDark
          700: "#6e0f18" // onPrimaryContainer
        }
      },
      fontFamily: {
        display: ["Fraunces", "GT Sectra", "Tiempos Headline", "Source Serif 4", "Georgia", "serif"],
        sans: ["Inter", "Untitled Sans", "General Sans", "system-ui", "sans-serif"]
      },
      letterSpacing: {
        display: "-0.025em",
        body: "-0.009em"
      },
      borderRadius: {
        panel: "24px",
        card: "24px",
        input: "16px"
      },
      maxWidth: {
        shell: "1200px"
      },
      boxShadow: {
        // signature three-layer Steep card shadow
        card: "0 0 0 1px rgba(23,25,28,0.06), 0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.10)",
        panel: "0 0 0 1px rgba(23,25,28,0.06), 0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.10)",
        float: "0 24px 50px -20px rgba(23,25,28,0.30)"
      }
    }
  },
  plugins: [typography]
};

export default config;
