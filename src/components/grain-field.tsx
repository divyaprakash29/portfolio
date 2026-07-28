/**
 * The ambient page backdrop: a slow drifting colour wash, a film-grain
 * overlay, and a vignette, fixed behind every section.
 *
 * Modelled on the grain-gradient background on Luma's event pages — which
 * renders it through a three.js shader canvas. This does it in CSS instead
 * (see the `.field-*` rules in globals.css): no WebGL, no canvas, no
 * `"use client"`, zero JS shipped, and it paints with the first HTML rather
 * than after hydration.
 *
 * `bg-canvas` on the container is load-bearing, not redundant with `body`:
 * `mix-blend-mode` on the grain only blends against backdrops inside this
 * stacking context, so without an opaque base here the grain would composite
 * against transparency and lose most of its effect.
 */
export function GrainField() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-canvas">
      <div className="field-wash absolute -inset-[15%]" />
      <div className="field-grain absolute -inset-[4%]" />
      <div className="field-vignette absolute inset-0" />
    </div>
  );
}
