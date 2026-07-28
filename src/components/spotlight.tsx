import { cn } from "@/lib/cn";

/**
 * One-time light sweep across the hero — adapted from the 21st.dev
 * catalog ("Spotlight" by manuarora700). A blurred ellipse fades and glides in
 * once on load (CSS keyframes in globals.css), then holds. Dark theme only: a
 * light beam has no contrast to work with on the light canvas.
 *
 * Filled with --ink, not --accent. Coral at 16% over the teal wash mixed to a
 * brown smudge sitting on an otherwise clean gradient; this is a light source,
 * so it wants near-white and a lower opacity.
 */
export function Spotlight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn(
        "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] opacity-0 lg:w-[84%]",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#hero-spotlight-blur)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          style={{ fill: "var(--ink)" }}
          fillOpacity="0.09"
        />
      </g>
      <defs>
        <filter
          id="hero-spotlight-blur"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  );
}
