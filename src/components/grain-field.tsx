import { WaterShimmer } from "@/components/water-shimmer";

/**
 * The ambient page backdrop: a slow drifting colour wash, a canvas weave, the
 * water shimmer, a film-grain overlay, and a vignette, fixed behind every
 * section.
 *
 * Modelled on the grain-gradient background on Luma's event pages — which
 * renders it through a three.js shader canvas. This does it in CSS instead
 * (see the `.field-*` rules in globals.css): no WebGL, no canvas, no
 * `"use client"`, zero JS shipped, and it paints with the first HTML rather
 * than after hydration.
 *
 * The gradient stops and grain amplitude are sampled from background.png (the
 * reference crop) rather than eyeballed — see the `.field-*` comments for what
 * the measurements were and where we deliberately depart from them.
 *
 * `bg-canvas` on the container is the base the grain's `mix-blend-mode`
 * composites against: blending only sees backdrops inside this stacking
 * context, so without an opaque layer here the grain would composite against
 * transparency and lose most of its effect. The wash covers it in practice,
 * but it keeps the grain correct if the wash ever goes translucent again.
 */
export function GrainField() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-canvas">
      <div className="field-wash absolute -inset-[15%]" />
      {/* Paper sits under the grain: the weave is the substrate, the grain is
          the tooth on top of it. Static — a canvas texture that drifts stops
          reading as a surface and starts reading as an overlay. */}
      <div className="field-paper absolute inset-0" />
      {/* Shimmer sits above the paper but under the grain and vignette, so the
          glints are textured and edge-darkened along with everything else
          rather than floating on top as a separate plane. */}
      <WaterShimmer />
      <div className="field-grain absolute -inset-[4%]" />
      <div className="field-vignette absolute inset-0" />
      {/* Last two, so they cover every layer above and the whole backdrop moves
          together: a one-shot resolve out of darkness once the preloader
          curtain clears, then a continuous breathe that picks up where it
          ends. Separate elements — CSS can't chain a one-shot into an infinite
          loop on the same property. */}
      <div className="field-reveal absolute inset-0" />
      <div className="field-breathe absolute inset-0" />
    </div>
  );
}
