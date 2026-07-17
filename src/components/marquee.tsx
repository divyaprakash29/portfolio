const ITEMS = [
  "React",
  "Next.js",
  "TypeScript",
  "Design Systems",
  "UX Research",
  "Accessibility",
  "Framer Motion",
  "Figma",
  "Usability Testing",
  "REST APIs",
];

/**
 * Infinite text ribbon between sections. Two identical tracks scroll via a
 * pure-CSS keyframe (globals.css) so it costs nothing and pauses entirely
 * under prefers-reduced-motion. aria-hidden: it's decoration — the same
 * skills live in the skills section as real content.
 */
export function Marquee() {
  const Track = () => (
    <div className="marquee-track flex shrink-0 items-baseline">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-baseline whitespace-nowrap">
          <span className="px-6 font-display text-2xl font-medium italic text-ink-soft sm:text-3xl">
            {item}
          </span>
          <span aria-hidden className="font-mono text-lg text-signal">
            ·
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden
      className="marquee flex overflow-hidden border-y border-line py-5"
    >
      <Track />
      <Track />
    </div>
  );
}
