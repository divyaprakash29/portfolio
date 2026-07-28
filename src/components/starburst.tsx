import { cn } from "@/lib/cn";

/**
 * The jagged multi-point burst behind the hero — the one element of the
 * reference poster (Luma's "UX Research" event cover) that translates to a
 * portfolio. Its other two layers deliberately don't: the blurred interior
 * photo and the cut-out subject aren't assets this site has, and inventing
 * stock imagery for them would be a different design, not this one.
 *
 * The points are a fixed list, not generated at runtime. They came out of a
 * seeded generator (scratch `burst.js`, seed 42) with BOTH the radius and the
 * angular spacing jittered — evenly spaced spikes read as a snowflake, which
 * is the thing that makes a hand-drawn burst look computed. 17 spikes, an odd
 * count, so no axis of symmetry lands anywhere obvious.
 *
 * Currently layered over the ambient gradient rather than replacing it, and
 * scoped to the hero rather than the whole page — see the note in the reply.
 * Both are one-line changes if the intent was the other way round.
 */
const POINTS =
  "60.6,6.9 57.2,28.6 69.0,16.6 64.8,32.1 87.2,19.5 70.1,39.3 94.0,35.1 " +
  "71.2,46.8 95.6,50.5 73.3,55.1 92.4,71.9 66.6,60.1 78.2,78.0 60.8,66.2 " +
  "67.8,89.6 54.1,68.8 51.3,92.8 46.9,75.3 36.5,83.9 40.6,67.0 24.8,80.4 " +
  "31.9,66.0 8.5,70.6 25.8,59.2 10.5,56.4 28.7,49.0 7.2,34.5 27.1,41.2 " +
  "13.0,17.6 33.4,34.9 29.5,18.5 42.0,32.6 38.8,6.9 49.0,23.8";

export function Starburst({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("field-burst pointer-events-none absolute", className)}
      viewBox="0 0 100 100"
      /* meet, not slice: every spike tip sits within radius 50 of centre, so
         the shape stays inside the viewBox through a full rotation — but slice
         would scale it to cover and shear the outer spikes off the sides. */
      preserveAspectRatio="xMidYMid meet"
    >
      <polygon points={POINTS} style={{ fill: "var(--burst)" }} />
    </svg>
  );
}
