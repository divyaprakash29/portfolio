"use client";

import { useEffect, useRef } from "react";

type Speck = {
  /** Anchor, in device pixels. A speck wanders around this and never leaves. */
  hx: number;
  hy: number;
  /** Index into the precomputed kernel table. */
  k: number;
  /** Phase offset so specks don't twinkle in lockstep. */
  phase: number;
  /** How fast this speck twinkles. Varied, or the whole field pulses as one. */
  twinkle: number;
  /** Peak alpha, 0–255. */
  a: number;
  /** Wander radius in device px, and the frequencies + phases driving it. */
  ax: number;
  ay: number;
  f1: number;
  f2: number;
  p1: number;
  p2: number;
};

/** Soft round dot: radius in device px → weight table, cached per size. */
type Kernel = { R: number; size: number; w: Float32Array };

function makeKernel(radius: number): Kernel {
  const reach = Math.max(radius * 2.2, 1);
  const R = Math.ceil(reach);
  const size = R * 2 + 1;
  const w = new Float32Array(size * size);
  for (let y = -R; y <= R; y++) {
    for (let x = -R; x <= R; x++) {
      const d = Math.sqrt(x * x + y * y) / reach;
      // (1-d)^2.2 — hot core, quick falloff, soft tail. Same profile as the
      // radial-gradient sprite this replaces, evaluated once per size instead
      // of rasterised per speck per frame.
      w[(y + R) * size + (x + R)] = d >= 1 ? 0 : Math.pow(1 - d, 2.2);
    }
  }
  return { R, size, w };
}

/**
 * Several thousand small white specks, each crawling within a few pixels of a
 * fixed anchor and twinkling on its own clock.
 *
 * Movement is bounded by construction, not by clamping. Position is computed
 * from `t` as anchor + sin/cos offsets, so nothing integrates and nothing
 * accumulates — a speck physically cannot leave its neighbourhood. An earlier
 * version integrated a velocity field, which streamed specks clear across the
 * viewport and needed edge wrapping; capping that velocity would have given
 * slow travel, not local motion.
 *
 * Rendering writes pixels directly into one ImageData buffer rather than
 * issuing a canvas call per speck. That is the whole reason this density is
 * possible: ~8600 `drawImage` calls measured 13–23fps, because the cost is
 * per-call overhead, not fill rate. Plotting a small weight kernel into a
 * typed array and doing a single `putImageData` moves the per-speck cost to
 * roughly a dozen array writes.
 *
 * Canvas 2D on purpose — this project has rejected WebGL three times.
 */
export function WaterShimmer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Pinned to 1, not the usual 2. Once per-speck cost is a handful of array
    // writes, the fixed cost dominates: `fill(0)` plus `putImageData` over the
    // whole backing store every frame, both scaling with its pixel count. At
    // dpr 1.25 that buffer is 2.0M px and measured 54fps; at 1 it is 1.3M and
    // clears 60. Nothing here has a crisp edge to alias, so the resolution
    // buys no visible quality.
    const dpr = 1;

    let raf = 0;
    let W = 0; // device px
    let H = 0;
    let specks: Speck[] = [];
    let kernels: Kernel[] = [];
    let img: ImageData;
    let buf32: Uint32Array;
    let t = 0;
    /** 0x00BBGGRR — alpha is written per pixel, colour never changes. */
    let rgb = 0x00ffffff;

    function readColour() {
      // The canvas carries `text-ink`, so its computed colour IS the primary
      // ink token: #ffffff dark, #131517 light. Hardcoding white would make
      // the entire field invisible on the light theme's near-white canvas.
      const m = getComputedStyle(canvas!).color.match(/(\d+),\s*(\d+),\s*(\d+)/);
      const r = m ? +m[1] : 255;
      const g = m ? +m[2] : 255;
      const b = m ? +m[3] : 255;
      // Little-endian: the Uint32 view puts red in the low byte.
      rgb = (b << 16) | (g << 8) | r;
    }

    function seed() {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      W = Math.round(cssW * dpr);
      H = Math.round(cssH * dpr);
      canvas!.width = W;
      canvas!.height = H;
      canvas!.style.width = `${cssW}px`;
      canvas!.style.height = `${cssH}px`;

      img = ctx!.createImageData(W, H);
      buf32 = new Uint32Array(img.data.buffer);

      // Radii quantised into 8 buckets so kernels are built once, not per
      // speck — continuous radii would mean thousands of near-identical tables.
      // 0.12–0.87 CSS px. Smaller specks are also cheaper — kernel area falls
      // with the square of the radius — which is what pays for the count below.
      kernels = Array.from({ length: 8 }, (_, i) => makeKernel((0.12 + i * 0.107) * dpr));

      // ~21,600 on a 1440x900 viewport.
      const count = Math.min(30000, Math.round((cssW * cssH) / 60));
      specks = Array.from({ length: count }, () => {
        // Cubed random biases hard toward the small end: mostly fine sparkle
        // with occasional larger glints, which is how a specular field looks.
        const s = Math.pow(Math.random(), 3);
        return {
          hx: Math.random() * W,
          hy: Math.random() * H,
          k: Math.min(7, Math.floor(s * 8)),
          phase: Math.random() * Math.PI * 2,
          twinkle: 0.6 + Math.random() * 2.6,
          // Lower than before: at ~2.5x the count, the previous peak alpha
          // accumulated into a milky sheet instead of discrete points.
          a: (0.1 + Math.random() * 0.34) * 255,
          // 2–9 CSS px of travel — a speck stays in its own neighbourhood.
          ax: (2 + Math.random() * 7) * dpr,
          ay: (2 + Math.random() * 7) * dpr,
          // Deliberately unrelated frequencies. Harmonics would close the path
          // into a clean repeating loop; incommensurate ones never quite
          // retrace, which reads as searching rather than orbiting.
          f1: 0.5 + Math.random() * 1.3,
          f2: 0.9 + Math.random() * 2.2,
          p1: Math.random() * Math.PI * 2,
          p2: Math.random() * Math.PI * 2,
        };
      });
    }

    function paint() {
      buf32.fill(0);

      for (let n = 0; n < specks.length; n++) {
        const p = specks[n];

        // Squared sine: mostly near zero with brief spikes, which is a glint.
        // Raw sine gives a lazy throb.
        const tw = Math.sin(p.phase + t * p.twinkle);
        const alpha = p.a * (0.12 + 0.88 * tw * tw);
        if (alpha < 1) continue;

        const x =
          p.hx + Math.sin(t * p.f1 + p.p1) * p.ax + Math.sin(t * p.f2 + p.p2) * p.ax * 0.45;
        const y =
          p.hy + Math.cos(t * p.f2 + p.p1) * p.ay + Math.cos(t * p.f1 + p.p2) * p.ay * 0.45;

        const ker = kernels[p.k];
        const R = ker.R;
        const size = ker.size;
        const kw = ker.w;
        const cx = (x + 0.5) | 0;
        const cy = (y + 0.5) | 0;

        // Clip the kernel to the buffer up front rather than testing every
        // pixel — at this speck count the branch cost is the inner loop.
        let j0 = 0;
        let j1 = size;
        if (cy - R < 0) j0 = R - cy;
        if (cy - R + size > H) j1 = H - cy + R;

        let i0 = 0;
        let i1 = size;
        if (cx - R < 0) i0 = R - cx;
        if (cx - R + size > W) i1 = W - cx + R;

        for (let j = j0; j < j1; j++) {
          const row = (cy - R + j) * W + (cx - R);
          const krow = j * size;
          for (let i = i0; i < i1; i++) {
            const weight = kw[krow + i];
            if (weight === 0) continue;
            const idx = row + i;
            // Additive alpha: overlapping specks pile into brighter points,
            // which is what makes the dense field shimmer instead of flatten.
            const acc = (buf32[idx] >>> 24) + alpha * weight;
            buf32[idx] = (((acc > 255 ? 255 : acc) << 24) | rgb) >>> 0;
          }
        }
      }

      ctx!.putImageData(img, 0, 0);
    }

    function step() {
      t += 0.016;
      paint();
      raf = requestAnimationFrame(step);
    }

    function start() {
      cancelAnimationFrame(raf);
      if (!reduce) raf = requestAnimationFrame(step);
    }

    readColour();
    seed();
    paint();
    start();

    const onResize = () => {
      seed();
      paint();
    };
    window.addEventListener("resize", onResize);

    // next-themes swaps the class on <html>; re-read the ink colour when it does.
    const themeObserver = new MutationObserver(() => {
      readColour();
      paint();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // A backgrounded tab still runs rAF in some browsers, and this is purely
    // decorative — stop burning cycles nobody can see.
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 text-ink"
    />
  );
}
