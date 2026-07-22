"use client";

import type { ReactNode } from "react";
import { motion, MotionConfig } from "framer-motion";

/**
 * The shared "// label" section heading. The text wipes up out of an
 * overflow mask as it scrolls into view, and a short coral rule draws
 * itself in beside it. Optional `aside` keeps the right-aligned mono
 * captions some sections carry (e.g. "4 shipped", "$ tree --stack").
 *
 * reducedMotion="user" snaps the transforms for reduced-motion users
 * while leaving the layout identical for SSR.
 */
export function SectionHeading({ label, aside }: { label: string; aside?: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="font-mono text-2xl font-medium tracking-tight sm:text-3xl">
            <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
              <motion.span
                className="block"
                initial={{ y: "115%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-12% 0px" }}
                transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
              >
                <span className="text-signal">{"//"}</span> {label}
              </motion.span>
            </span>
          </h2>
          <motion.span
            aria-hidden
            className="hidden h-px w-10 origin-left bg-signal sm:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.5, ease: [0.16, 0.84, 0.44, 1], delay: 0.15 }}
          />
        </div>
        {aside && <span className="font-mono text-sm text-ink-faint">{aside}</span>}
      </div>
    </MotionConfig>
  );
}
