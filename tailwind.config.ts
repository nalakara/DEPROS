import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        depros: {
          orange: "#FF4F00",
          black: "#0D0D0D",
          white: "#FFFFFF",
          muted: "#888888",
          light: "#F7F7F7",
          border: "#E5E5E5",
          borderDark: "#222222",
        },
      },
      fontFamily: {
        sans: ["var(--font-gotham)", "system-ui", "sans-serif"],
        display: ["var(--font-gotham)", "system-ui", "sans-serif"],
        body: ["var(--font-gotham)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      letterSpacing: {
        editorial: "0.25em",
        wideDisplay: "0.15em",
        ultraWide: "0.35em",
        tightDisplay: "-0.03em",
      },
    },
  },
  plugins: [],
};

export default config;
