"use client";

import { useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { profile, aboutViews } from "@/data/profile";
import { Reveal } from "@/components/reveal";
import { MaskedText } from "@/components/masked-text";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/cn";

type Lens = keyof typeof aboutViews;

const LENSES = Object.keys(aboutViews) as Lens[];

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

const row = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 0.84, 0.44, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

export function About() {
  const [lens, setLens] = useState<Lens>("engineer");

  return (
    <section id="about" className="relative border-t border-line py-20 lg:py-28">
      <div className="mx-auto w-full max-w-content px-5 sm:px-8">
        <SectionHeading label="about" />

        <div className="mt-10 grid grid-cols-1 gap-12 lg:mt-14 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          {/* narrative */}
          <Reveal>
            <p className="max-w-xl font-display text-3xl font-medium leading-snug text-ink sm:text-4xl">
              <MaskedText text="The interface is the product." accentWords={["is"]} />
            </p>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              {profile.lede}
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              These days that means Boston: an M.S. in Information Systems at
              Northeastern, with as many hours in Figma and usability sessions
              as in React — because the best fixes I&apos;ve shipped started as
              questions asked before any code was written.
            </p>
          </Reveal>

          {/* spec-sheet card */}
          <Reveal delay={0.15}>
            <div className="rounded-sm border border-line bg-canvas-alt p-6 shadow-2 sm:p-7">
              <div role="group" aria-label="View facts as" className="flex flex-wrap gap-2">
                {LENSES.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setLens(v)}
                    aria-pressed={lens === v}
                    className={cn(
                      "min-h-[44px] rounded-full border px-5 font-mono text-xs tracking-widest transition-colors",
                      lens === v
                        ? "border-signal text-signal"
                        : "border-line text-ink-soft hover:border-line-strong hover:text-ink"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>

              {/* min-height of the tallest lens so toggling never shifts layout */}
              <MotionConfig reducedMotion="user">
                <div className="relative mt-6 min-h-[16rem] sm:min-h-[15rem]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.dl
                      key={lens}
                      variants={list}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                    >
                      {aboutViews[lens].map(({ key, value }) => (
                        <motion.div
                          key={key}
                          variants={row}
                          className="flex items-baseline justify-between gap-6 border-b border-line py-3 first:pt-0"
                        >
                          <dt className="shrink-0 font-mono text-xs tracking-widest text-ink-faint">
                            {key}
                          </dt>
                          <dd className="text-right text-sm text-ink sm:text-base">{value}</dd>
                        </motion.div>
                      ))}
                    </motion.dl>
                  </AnimatePresence>
                </div>
              </MotionConfig>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
