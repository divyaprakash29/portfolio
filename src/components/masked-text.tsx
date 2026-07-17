"use client";

import { motion, MotionConfig } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Word-level masked reveal: every word sits inside its own overflow-hidden
 * slot and rises from below it when the element scrolls into view. The
 * plain text lives in aria-label; the animated words are presentational.
 * MotionConfig(user) keeps SSR markup identical and reduces to an opacity
 * fade for reduced-motion users.
 */
export function MaskedText({
  text,
  className,
  accentWords = [],
  delay = 0,
}: {
  text: string;
  className?: string;
  /** words rendered in the accent colour + italic (matched lowercase) */
  accentWords?: string[];
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <MotionConfig reducedMotion="user">
      <span aria-label={text} role="text" className={cn("inline", className)}>
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            aria-hidden
            className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
          >
            <motion.span
              className={cn(
                "inline-block",
                accentWords.includes(word.toLowerCase().replace(/[^\w']/g, "")) &&
                  "italic text-signal"
              )}
              initial={{ y: "110%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{
                duration: 0.65,
                delay: delay + i * 0.055,
                ease: [0.16, 0.84, 0.44, 1],
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </MotionConfig>
  );
}
