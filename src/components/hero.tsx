"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { profile, stats } from "@/data/profile";
import { Magnetic } from "@/components/magnetic";
import { ParticleField } from "@/components/particle-field";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 0.84, 0.44, 1] } },
};

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100svh-4.25rem)] items-center overflow-hidden py-16"
    >
      <ParticleField />

      {/* vertical email rail */}
      <a
        href={`mailto:${profile.email}`}
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 font-mono text-xs tracking-widest text-ink-faint transition-colors hover:text-signal lg:block"
        style={{ writingMode: "vertical-rl" }}
      >
        {profile.email}
      </a>

      <motion.div
        className="mx-auto grid w-full max-w-content grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.4fr_auto] lg:gap-8"
        variants={reduceMotion ? undefined : container}
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "show"}
      >
        {/* left: headline block */}
        <div>
          <h1 className="font-display uppercase leading-[0.85] tracking-tight">
            <motion.span
              variants={reduceMotion ? undefined : item}
              className="block text-[clamp(3.2rem,10vw,7.5rem)] text-signal"
            >
              Frontend
            </motion.span>
            <motion.span
              variants={reduceMotion ? undefined : item}
              className="block pl-[0.12em] text-[clamp(3.2rem,10vw,7.5rem)] text-ink"
            >
              Engineer
            </motion.span>
          </h1>

          <motion.p
            variants={reduceMotion ? undefined : item}
            className="mt-7 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            Hi! I&apos;m <span className="font-semibold text-ink">Divya</span>. I build interfaces
            the way I test them — with real users, not just unit tests. Two years shipping
            production React, now sharpening the design side at Northeastern.
          </motion.p>

          <motion.div variants={reduceMotion ? undefined : item} className="mt-8">
            <Magnetic strength={0.4}>
              <a
                href="#contact"
                className="inline-block bg-signal px-8 py-4 font-display text-lg uppercase tracking-wide text-canvas transition-opacity duration-200 hover:opacity-90 active:scale-[0.97]"
              >
                Let&apos;s talk
              </a>
            </Magnetic>
          </motion.div>

          <motion.p
            variants={reduceMotion ? undefined : item}
            className="mt-5 flex items-center gap-2.5 text-sm text-ink-soft"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            Available for full-time opportunities
          </motion.p>
        </div>

        {/* right: stat stack */}
        <motion.dl
          variants={reduceMotion ? undefined : item}
          className="flex gap-8 lg:flex-col lg:gap-10 lg:text-right"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-display text-4xl tabular-nums text-signal sm:text-5xl">
                  {s.value}
                </span>
                <span className="mt-1 block text-xs text-ink-soft sm:text-sm">{s.label}</span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
