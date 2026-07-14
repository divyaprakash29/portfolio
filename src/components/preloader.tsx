"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const NAME = "DIVYA";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Preloader() {
  // Rendered on the server so the curtain paints immediately. The name's
  // entrance is pure CSS (globals.css) for the same reason: it must play
  // before hydration — framer-motion letters would sit at opacity 0 until
  // React wakes up, showing a blank curtain exactly when it matters most.
  const [show, setShow] = useState(true);
  // When true we drop <AnimatePresence> entirely rather than setting show=false,
  // because AnimatePresence would otherwise intercept the removal and play its
  // 0.8s exit — the one thing a reduced-motion user asked not to see.
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
    const t = setTimeout(() => setShow(false), 1900);
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
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0f0f0f] motion-reduce:hidden"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            aria-hidden="true"
          >
            <h2 className="flex font-display text-[clamp(3rem,12vw,9rem)] uppercase leading-none tracking-tight text-[#dedede]">
              {NAME.split("").map((char, i) => (
                <span
                  key={i}
                  className={`preloader-letter ${i === 0 ? "text-[#00f050]" : ""}`}
                  style={{ animationDelay: `${0.12 + i * 0.07}s` }}
                >
                  {char}
                </span>
              ))}
              <span className="preloader-cursor ml-1 text-[#00f050]">_</span>
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
