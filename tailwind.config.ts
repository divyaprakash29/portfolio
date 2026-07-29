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
        // Renamed from --coral: the token holds a blue now, and a var called
        // "coral" is the kind of thing that misleads a later reader into
        // reintroducing a warm. The utility names (signal/marker) are
        // hue-neutral and unchanged.
        marker: "var(--accent-soft)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-instrument-serif)", "Georgia", "serif"],
        // `mono` deliberately points at Geist Sans, not a monospace. The brief
        // was two families total, so the ~40 `font-mono` call sites (section
        // headings, nav, chips, dates, stat labels) resolve to the sans rather
        // than being rewritten. Kept as a separate key so the mono-flavoured
        // content stays greppable — and so restoring a real mono is one line.
        mono: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
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
