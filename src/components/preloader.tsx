"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const NAME = "DIVYA";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Preloader() {
  // Rendered on the server so the curtain paints immediately. Without this
  // there's a blank gap between first paint and hydration where neither the
  // curtain nor the hero (which starts at opacity 0) is visible.
  const [show, setShow] = useState(true);
  // When true we drop <AnimatePresence> entirely rather than setting show=false,
  // because AnimatePresence would otherwise intercept the removal and play its
  // 0.8s exit — the one thing a reduced-motion user asked not to see.
  const [skip, setSkip] = useState(false);

  useIsomorphicLayoutEffect(() => {
    // Read the media query directly rather than framer's useReducedMotion():
    // that hook reports `false` on the first render and only flips after mount,
    // which would mount the curtain and then animate it away.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Repeat visitors and reduced-motion users skip it — before paint, so the
    // curtain never flashes for them.
    if (prefersReduced || sessionStorage.getItem("intro-seen")) {
      setSkip(true);
      setShow(false);
    }
    // The flag is set when the curtain finishes (in the hide timeout), not
    // here: StrictMode double-fires this effect in dev, and setting it on
    // the first run would make the second run skip its own curtain.
  }, []);

  useEffect(() => {
    if (!show) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      sessionStorage.setItem("intro-seen", "1");
      setShow(false);
    }, 1750);
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
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0f0f0f]"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            aria-hidden="true"
          >
            <h2 className="flex font-display text-[clamp(3rem,12vw,9rem)] uppercase leading-none tracking-tight text-[#dedede]">
              {NAME.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.12 + i * 0.07,
                    duration: 0.4,
                    ease: [0.16, 0.84, 0.44, 1],
                  }}
                  className={i === 0 ? "text-[#00f050]" : undefined}
                >
                  {char}
                </motion.span>
              ))}
              <motion.span
                className="ml-1 text-[#00f050]"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
              >
                _
              </motion.span>
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
