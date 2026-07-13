"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import { projects, type Project } from "@/data/profile";
import { cn } from "@/lib/cn";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pinEnabled, setPinEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)"
    );
    const update = () => setPinEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      if (!pinEnabled || !trackRef.current || !sectionRef.current) return;

      const track = trackRef.current;
      const scrollDistance = track.scrollWidth - window.innerWidth;
      if (scrollDistance <= 0) return;

      const tween = gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { dependencies: [pinEnabled], scope: sectionRef }
  );

  return (
    <section id="work" ref={sectionRef} className="relative border-t border-line py-14 lg:py-0">
      <div className="lg:flex lg:h-screen lg:flex-col lg:justify-center">
        <div className="mx-auto w-full max-w-content px-5 sm:px-8">
          <div className="mb-8 flex items-baseline justify-between lg:mb-10">
            <h2 className="font-mono text-2xl font-medium tracking-tight sm:text-3xl">
              <span className="text-signal">{"//"}</span> projects
            </h2>
            <span className="font-mono text-sm text-ink-faint">{projects.length} shipped</span>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-8 lg:snap-none lg:overflow-visible lg:pb-0 lg:pl-8"
          style={{ scrollbarWidth: "none" }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
          <div className="w-px shrink-0 lg:w-[calc(50vw-15rem)]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      data-cursor="view"
      className="w-[85vw] shrink-0 snap-center rounded-xl border border-line bg-canvas-alt p-6 shadow-1 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-3 sm:w-[24rem] lg:w-[28rem]"
    >
      <p className="mb-3 font-mono text-lg font-semibold">
        <span className="text-signal">&lt;</span>
        {project.tag}
        <span className="text-signal"> /&gt;</span>
      </p>
      <p className="mb-4 text-sm leading-relaxed text-ink-soft">{project.desc}</p>
      <div className="flex flex-wrap gap-1.5 border-t border-dashed border-line pt-3">
        {project.stack.map((s) => (
          <span
            key={s}
            className="rounded-[3px] border border-line bg-canvas px-2 py-0.5 font-mono text-xs text-ink-soft"
          >
            {s}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-4 flex min-h-11 items-center gap-1.5 font-mono text-xs text-ink-soft transition-colors hover:text-marker"
      >
        {open ? "less" : "details"}
        <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", open && "rotate-180")} />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="mt-3 border-t border-dashed border-line pt-3 text-sm leading-relaxed text-ink-soft">
            {project.detail}
          </p>
        </div>
      </div>
    </div>
  );
}
