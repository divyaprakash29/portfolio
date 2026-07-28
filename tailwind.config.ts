import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        "canvas-alt": "var(--canvas-alt)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-faint": "var(--ink-faint)",
        signal: "var(--accent)",
        marker: "var(--coral)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
      },
      fontFamily: {
        mono: ["var(--font-plex-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      boxShadow: {
        1: "var(--shadow-1)",
        2: "var(--shadow-2)",
        3: "var(--shadow-3)",
      },
      maxWidth: {
        content: "72rem",
      },
      keyframes: {
        "draw-line": {
          to: { transform: "scaleX(1)" },
        },
      },
      animation: {
        "draw-line": "draw-line 1s cubic-bezier(.2,.7,.3,1) forwards",
      },
    },
  },
  plugins: [],
};
export default config;
