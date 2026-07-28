"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// A plain " " here would be dropped: each letter is its own inline-block, and
// one whose only child is a normal space collapses to zero width — the two
// names would run together as DIVYAPRAKASH. Written as an escape rather than
// a literal so the character is visible in the source.
const NBSP = " ";
const NAME = "DIVYA PRAKASH";

// The curtain and its contents leave at different rates — the name drifts up
// faster than the panel and fades as it goes, so the exit reads as depth
// rather than one flat sheet sliding off. Framer only propagates an exit to
// children when both sides use variant *labels*, not object props.
const curtain = {
  exit: {
    y: "-100%",
    transition: { duration: 0.62, ease: [0.76, 0, 0.24, 1] as const },
  },
};

const inner = {
  exit: {
    y: -64,
    opacity: 0,
    transition: { duration: 0.46, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Preloader() {
  // Rendered on the server so the curtain paints immediately. The name's
  // entrance is pure CSS (globals.css) for the same reason: it must play
  // before hydration — framer-motion letters would sit at opacity 0 until
  // React wakes up, showing a blank curtain exactly when it matters most.
  const [show, setShow] = useState(true);
  // When true we drop <AnimatePresence> entirely rather than setting show=false,
  // because AnimatePresence would otherwise intercept the removal and play its
  // exit — the one thing a reduced-motion user asked not to see.
  const [skip, setSkip] = useState(false);

  useIsomorphicLayoutEffect(() => {
    // Read the media query directly rather than framer's useReducedMotion():
    // that hook reports `false` on the first render and only flips after mount,
    // which would mount the curtain and then animate it away.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSkip(true);
      setShow(false);
    }
  }, []);

  useEffect(() => {
    if (!show) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    // Holds ~30ms past the last entrance move (the tracking settle, 1.25s) so
    // the composed word gets a beat of stillness before it goes. That pause is
    // the point — lifting the instant the motion stops is what made the
    // previous, quicker pass feel abrupt rather than composed.
    const t = setTimeout(() => setShow(false), 1300);
    return () => clearTimeout(t);
  }, [show]);

  if (skip) return null;

  return (
    <>
      {/* Without JS the curtain would never lift, so hide it outright. */}
      <noscript>
        <style>{`#preloader{display:none !important}`}</style>
      </noscript>

      <AnimatePresence>
        {show && (
          <motion.div
            id="preloader"
            key="preloader"
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#061317] motion-reduce:hidden"
            variants={curtain}
            exit="exit"
            aria-hidden="true"
          >
            <motion.div variants={inner} className="flex flex-col items-center">
              {/* one overflow mask around the whole name; letters rise on a
                  stagger from behind it. The name is all-caps so there are no
                  descenders to clear — the mask sits tight to the baseline. */}
              <div className="overflow-hidden px-4 pb-[0.06em] -mb-[0.06em]">
                {/* Pure white, matching --ink. This was a warm bone (#f4efe6)
                    to sit closer in temperature to the coral rule, but the
                    curtain now hands off to a page whose type is #fff — and a
                    bone-to-white shift on the lift read as a colour pop. */}
                <h2 className="pl-name flex justify-center font-display font-medium text-[clamp(2rem,6.5vw,6.5rem)] leading-none text-white">
                  {NAME.split("").map((char, i) => (
                    <span
                      key={i}
                      className="pl-letter"
                      style={{ animationDelay: `${0.05 + i * 0.035}s` }}
                    >
                      {char === " " ? NBSP : char}
                    </span>
                  ))}
                </h2>
              </div>

              <div className="pl-rule mt-7 h-px w-16 bg-[#f28763] sm:w-24" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
