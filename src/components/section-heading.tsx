"use client";

import type { ReactNode } from "react";
import { motion, MotionConfig, type Variants } from "framer-motion";

/**
 * The shared "// label" section heading. The text wipes up out of an
 * overflow mask as it scrolls into view, and a short coral rule draws
 * itself in beside it. Optional `aside` keeps the right-aligned mono
 * captions some sections carry (e.g. "4 shipped", "$ tree --stack").
 *
 * Two traps here, both found by screenshot and both invisible to code review:
 *
 * 1. `whileInView` CANNOT live on the masked span itself. IntersectionObserver
 *    intersects the target against every ancestor's clip rect, and the span
 *    starts translated fully outside its `overflow-hidden` parent — so its
 *    intersection rect is empty, it never "enters view", and the reveal never
 *    fires. The observer has to sit on the unclipped mask; the inner span
 *    follows via variants.
 * 2. The viewport margin insets only the BOTTOM. A symmetric "-12% 0px" also
 *    carves a dead band off the top of the viewport — and every nav link jumps
 *    a heading to exactly there, so with `once: true` it would stay masked
 *    permanently for anyone navigating by anchor instead of scrolling.
 */
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

const wipe: Variants = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: 0.6, ease: [0.16, 0.84, 0.44, 1] } },
};

const rule: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.5, delay: 0.15, ease: [0.16, 0.84, 0.44, 1] } },
};

export function SectionHeading({ label, aside }: { label: string; aside?: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="flex items-baseline justify-between gap-4"
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
      >
        <div className="flex items-center gap-4">
          <h2 className="font-mono text-2xl font-medium tracking-tight sm:text-3xl">
            <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
              <motion.span className="block" variants={wipe}>
                <span className="text-signal">{"//"}</span> {label}
              </motion.span>
            </span>
          </h2>
          <motion.span
            aria-hidden
            className="hidden h-px w-10 origin-left bg-signal sm:block"
            variants={rule}
          />
        </div>
        {aside && <span className="font-mono text-sm text-ink-faint">{aside}</span>}
      </motion.div>
    </MotionConfig>
  );
}
