"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { profile, stats } from "@/data/profile";
import { cn } from "@/lib/cn";
import { Magnetic } from "@/components/magnetic";
import { ParticleField } from "@/components/particle-field";
import { Spotlight } from "@/components/spotlight";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.55 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 0.84, 0.44, 1] } },
};

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * A hero stat that counts up from zero once, on load. Renders the real
 * value in the SSR HTML (crawlers + no-JS see the true number), then a
 * layout effect resets it to 0 before paint so the count starts clean.
 * Reduced-motion users just get the final number.
 */
function HeroStatValue({ value, delay }: { value: string; delay: number }) {
  const reduce = useReducedMotion();
  const parsed = useMemo(() => {
    const m = value.match(/^(\d+)(.*)$/);
    return m ? { target: parseInt(m[1], 10), suffix: m[2] } : null;
  }, [value]);

  const mv = useMotionValue(parsed?.target ?? 0);
  const [display, setDisplay] = useState(parsed?.target ?? 0);

  useIsomorphicLayoutEffect(() => {
    if (!parsed || reduce) return;
    mv.set(0);
    setDisplay(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!parsed || reduce) return;
    const unsub = mv.on("change", (v) => setDisplay(Math.round(v)));
    const controls = animate(mv, parsed.target, {
      duration: 1.1,
      delay,
      ease: [0.16, 0.84, 0.44, 1],
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [parsed, reduce, delay, mv]);

  if (!parsed) return <>{value}</>;
  return (
    <>
      {display}
      {parsed.suffix}
    </>
  );
}

/**
 * One headline line rising letter by letter out of an overflow mask.
 * Each letter also swaps color on hover (hoverClass) — a quiet
 * touch-nothing-moves interaction, no looping animation.
 */
function LetterLine({
  text,
  delay,
  className,
  hoverClass,
}: {
  text: string;
  delay: number;
  className?: string;
  hoverClass: string;
}) {
  return (
    <span aria-hidden className={cn("block overflow-hidden pb-[0.08em] -mb-[0.08em]", className)}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, delay: delay + i * 0.045, ease: [0.16, 0.84, 0.44, 1] }}
          className={cn("inline-block transition-colors duration-300", hoverClass)}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Parallax: as the hero scrolls away, layers drift at different speeds —
  // particles fastest, headline lagging — pure scroll-linked transforms on
  // native scrolling. Zeroed out for reduced motion.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const particlesY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const statsY = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[calc(100svh-4.25rem)] items-center overflow-hidden py-16"
    >
      <motion.div
        aria-hidden
        style={{ y: reduceMotion ? 0 : particlesY }}
        className="absolute inset-0"
      >
        <ParticleField />
      </motion.div>

      {/* coral light sweep, once, after the preloader lifts (dark only) */}
      <Spotlight className="-top-40 left-0 hidden md:-top-20 md:left-40 dark:block" />

      {/* vertical email rail */}
      <a
        href={`mailto:${profile.email}`}
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 font-mono text-xs tracking-widest text-ink-faint transition-colors hover:text-signal lg:block"
        style={{ writingMode: "vertical-rl" }}
      >
        {profile.email}
      </a>

      {/* reducedMotion="user": SSR markup stays identical for every client;
          reduced-motion users get opacity-only entrances. */}
      <MotionConfig reducedMotion="user">
        <motion.div
          className="relative z-10 mx-auto grid w-full max-w-content grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.4fr_auto] lg:gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* left: headline block */}
          <div>
            <motion.h1
              aria-label="Frontend Engineer"
              style={{ y: reduceMotion ? 0 : headlineY }}
              className="font-display font-medium leading-[0.95] tracking-tight"
            >
              <LetterLine
                text="Frontend"
                delay={0.15}
                className="text-[clamp(3.2rem,10vw,7.5rem)] text-signal"
                hoverClass="hover:text-ink"
              />
              <LetterLine
                text="Engineer"
                delay={0.4}
                className="pl-[0.12em] text-[clamp(3.2rem,10vw,7.5rem)] text-ink"
                hoverClass="hover:text-signal"
              />
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-7 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg"
            >
              Hi! I&apos;m <span className="font-semibold text-ink">Divya</span>. I build
              interfaces the way I test them — with real users, not just unit tests. Two years
              shipping production React, now sharpening the design side at Northeastern.
            </motion.p>

            <motion.div variants={item} className="mt-8">
              <Magnetic strength={0.4}>
                <a
                  href="#contact"
                  className="inline-block bg-signal px-8 py-4 font-mono text-sm uppercase tracking-widest text-canvas transition-opacity duration-200 hover:opacity-90 active:scale-[0.97]"
                >
                  Let&apos;s talk
                </a>
              </Magnetic>
            </motion.div>

            <motion.p variants={item} className="mt-5 flex items-center gap-2.5 text-sm text-ink-soft">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
              </span>
              Available for full-time opportunities
            </motion.p>
          </div>

          {/* right: stat stack */}
          <motion.dl
            variants={item}
            style={{ y: reduceMotion ? 0 : statsY }}
            className="flex gap-8 lg:flex-col lg:gap-10 lg:text-right"
          >
            {stats.map((s, i) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-4xl font-semibold text-signal sm:text-5xl">
                    <HeroStatValue value={s.value} delay={0.9 + i * 0.12} />
                  </span>
                  <span className="mt-1 block text-xs text-ink-soft sm:text-sm">{s.label}</span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </MotionConfig>
    </section>
  );
}
