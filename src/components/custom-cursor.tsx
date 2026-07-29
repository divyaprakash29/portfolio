"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

/** Set via `data-cursor` on any ancestor of the pointer target. */
type Variant = "default" | "view" | "mail";

const LABELS: Record<Exclude<Variant, "default">, string> = {
  view: "view",
  mail: "say hi",
};

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<Variant>("default");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    function handleMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      const v = el?.getAttribute("data-cursor");
      setVariant(v === "view" || v === "mail" ? v : "default");
    }
    function handleLeaveWindow() {
      setVisible(false);
    }

    window.addEventListener("mousemove", handleMove);
    document.documentElement.addEventListener("mouseleave", handleLeaveWindow);
    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeaveWindow);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2"
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {variant === "default" ? (
          /* bg-ink/70 compiled to nothing (plain-var token), leaving the dot
             transparent while cursor:none hid the native pointer */
          <motion.span
            key="dot"
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.4 }}
            transition={{ duration: 0.18, ease: [0.16, 0.84, 0.44, 1] }}
            className="block h-2 w-2 rounded-full bg-[color-mix(in_srgb,var(--ink)_70%,transparent)]"
          />
        ) : (
          <motion.span
            key={variant}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 0.84, 0.44, 1] }}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--accent-soft)_70%,transparent)] bg-[color-mix(in_srgb,var(--canvas)_90%,transparent)] font-mono text-[0.65rem] tracking-wide text-marker shadow-2 backdrop-blur"
          >
            {LABELS[variant]}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
