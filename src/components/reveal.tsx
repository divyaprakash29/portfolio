"use client";

import type { ReactNode } from "react";
import { motion, MotionConfig } from "framer-motion";

/**
 * Scroll-into-view fade/rise. reducedMotion="user" (same pattern as the
 * hero) keeps SSR markup identical for every client — the old
 * `if (reduceMotion) return <div>` branch hydration-mismatched for
 * reduced-motion users — while still honouring their preference: framer
 * snaps the transform and keeps only the opacity fade.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
        transition={{ duration: 0.6, delay, ease: [0.16, 0.84, 0.44, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
