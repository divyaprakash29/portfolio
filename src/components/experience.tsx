"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  MotionConfig,
} from "framer-motion";
import { experience } from "@/data/profile";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

/** "+20% user engagement" → counts 0→20 when scrolled into view. */
function CountStat({ stat }: { stat: string }) {
  const m = stat.match(/^([+−-]?)(\d+)(%?)\s*(.*)$/);
  const target = m ? Number(m[2]) : 0;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, {
      duration: reduceMotion ? 0 : 1.1,
      ease: [0.16, 0.84, 0.44, 1],
    });
    return () => controls.stop();
  }, [inView, target, reduceMotion, count]);

  if (!m) return <span className="font-mono text-sm text-signal">{stat}</span>;
  return (
    <span ref={ref} className="font-mono text-sm text-signal">
      {m[1]}
      <motion.span>{rounded}</motion.span>
      {m[3]}&nbsp;{m[4]}
    </span>
  );
}

/**
 * Work experience on a self-drawing timeline: the rail fills with the
 * accent colour as you scroll (scroll-linked, native scrolling untouched)
 * and each node ignites as the fill reaches it. Stats count up on entry.
 */
export function Experience() {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.75", "end 0.45"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });
  // A glowing head rides the tip of the fill. `top` as a percentage of the
  // track, not a translate — translateY percentages resolve against the dot's
  // own 8px height, which would barely move it.
  const headTop = useTransform(scaleY, (v) => `${v * 100}%`);
  const headOpacity = useTransform(scaleY, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);

  return (
    <section id="experience" className="relative border-t border-line py-20 lg:py-28">
      <div className="mx-auto w-full max-w-content px-5 sm:px-8">
        <SectionHeading label="work experience" />

        <div ref={railRef} className="relative mt-10 lg:mt-14">
          {/* track + scroll-drawn fill + the glowing head at its tip */}
          <div aria-hidden className="absolute bottom-3 left-[5px] top-3 w-px bg-line">
            <motion.div style={{ scaleY }} className="absolute inset-0 origin-top bg-signal" />
            <motion.span
              style={{ top: headTop, opacity: headOpacity }}
              className="absolute left-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_14px_3px_color-mix(in_srgb,var(--accent)_50%,transparent)]"
            />
          </div>

          <ol className="space-y-14 lg:space-y-16">
            {experience.map((e) => (
              <li key={e.company} className="relative pl-8 sm:pl-12">
                <MotionConfig reducedMotion="user">
                  {/* node ignites as the fill reaches it, and throws one ring */}
                  <span aria-hidden className="absolute left-0 top-[0.3rem] h-[11px] w-[11px]">
                    <motion.span
                      initial={{ backgroundColor: "var(--canvas)", scale: 1 }}
                      whileInView={{ backgroundColor: "var(--accent)", scale: 1.15 }}
                      viewport={{ once: true, margin: "-30% 0px -30% 0px" }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0 rounded-full border-2 border-signal"
                    />
                    <motion.span
                      initial={{ opacity: 0, scale: 1 }}
                      whileInView={{ opacity: [0, 0.45, 0], scale: [1, 3, 3.4] }}
                      viewport={{ once: true, margin: "-30% 0px -30% 0px" }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full bg-signal"
                    />
                  </span>
                </MotionConfig>
                <Reveal delay={0.05}>
                  <p className="font-mono text-xs tracking-widest text-ink-faint">{e.dates}</p>
                  <h3 className="mt-2 text-lg font-semibold text-ink sm:text-xl">{e.title}</h3>
                  <p className="mt-1 font-mono text-xs tracking-wide text-ink-faint">
                    {e.company} · {e.location}
                  </p>
                  <ul className="mt-5 max-w-2xl space-y-4">
                    {e.highlights.map((h) => (
                      <li
                        key={h.text}
                        className="border-l border-line pl-4 text-sm leading-relaxed text-ink sm:text-base"
                      >
                        {h.text}
                        {h.stat && (
                          <span className="mt-1 block">
                            <CountStat stat={h.stat} />
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
