"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const NAME = "Divya";
const SUBTITLE = "Frontend Engineer";

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
    // Hold just long enough for the name + rule to land, then lift.
    const t = setTimeout(() => setShow(false), 620);
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
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0f0f0f] motion-reduce:hidden"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
            aria-hidden="true"
          >
            {/* one overflow mask around the whole word; letters rise on a
                stagger from behind it. pb/-mb keeps the 'y' descender uncut. */}
            <div className="overflow-hidden pb-[0.16em] -mb-[0.16em]">
              <h2 className="flex font-display font-medium text-[clamp(3rem,12vw,9rem)] leading-none tracking-tight text-[#ededed]">
                {NAME.split("").map((char, i) => (
                  <span
                    key={i}
                    className="pl-letter"
                    style={{ animationDelay: `${0.04 + i * 0.055}s` }}
                  >
                    {char}
                  </span>
                ))}
              </h2>
            </div>

            <div className="pl-rule mt-6 h-px w-16 bg-[#f28763] sm:w-20" />

            <p className="pl-sub mt-5 font-mono text-[0.7rem] uppercase tracking-[0.32em] text-[#8f8f8f] sm:text-xs">
              {SUBTITLE}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
