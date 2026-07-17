"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./theme-toggle";

const links = [
  // Work returns when the projects section is redesigned (the pinned
  // horizontal gallery was pulled — user didn't like the scroll hijack).
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <header
      className={cn(
        // color-mix instead of bg-canvas/85: the token is a plain CSS var,
        // which Tailwind's /alpha modifier can't generate rules for.
        "sticky top-0 z-40 border-b border-transparent bg-[color-mix(in_srgb,var(--canvas)_85%,transparent)] backdrop-blur-md transition-shadow duration-300",
        scrolled && "border-line-strong shadow-2"
      )}
    >
      <div className="mx-auto flex max-w-content items-center justify-between gap-2 px-5 py-3 sm:px-8">
        <a href="#top" className="whitespace-nowrap font-mono text-[1.05rem] font-semibold tracking-tight">
          <span className="text-signal">&lt;</span>DP
          <span className="text-signal"> /&gt;</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 font-mono text-sm sm:flex sm:gap-2 lg:gap-3">
          <span className="hidden items-center gap-2 pr-3 text-ink-soft lg:inline-flex">
            <span className="relative flex h-[7px] w-[7px]">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-40" />
              <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-signal" />
            </span>
            available for work
          </span>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex items-center px-2 py-3 text-ink-soft transition-colors hover:text-ink lg:px-3"
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-marker hover:text-marker focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            {open ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Primary"
            initial={reduceMotion ? { height: 0 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { height: "auto" } : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? { height: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.16, 0.84, 0.44, 1] }}
            className="overflow-hidden border-t border-line font-mono text-sm sm:hidden"
          >
            <div className="flex flex-col px-5 py-2">
              <span className="flex items-center gap-2 py-3 text-ink-soft">
                <span className="relative flex h-[7px] w-[7px]">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-40" />
                  <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-signal" />
                </span>
                available for work
              </span>
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center border-t border-line py-3 text-ink-soft transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
