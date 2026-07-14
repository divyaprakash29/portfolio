# About Section — Dual-Lens Design

**Date:** 2026-07-13 · **Status:** Approved (user picked dual-lens concept)

## Concept

Two-column About expressing Divya's engineer + designer identity. Left:
narrative — a large Playfair statement ("The interface is the product.")
plus two short sans paragraphs from `profile.lede` and real résumé facts
(Boston, M.S. Northeastern, usability practice). Right: a spec-sheet card
whose mono toggle chips ([engineer] / [designer]) flip a key→value fact
list, powered by the existing `aboutViews` data in `src/data/profile.ts`.

## Structure

- `src/components/about.tsx` (client component), mounted after Projects in
  `page.tsx` as `<section id="about">`.
- Section skeleton matches Projects: `border-t border-line`, max-w-content,
  `// about` mono heading.
- Card: `bg-canvas-alt`, hairline border, `shadow-2`; rows are `dl` pairs —
  mono faint keys, ink values; fixed min-height so toggling doesn't shift
  layout (engineer has 5 rows, designer 4).

## Interaction & motion

- Toggle chips: ≥44px targets, `aria-pressed`, coral accent when active.
- Fact rows crossfade with a small stagger (AnimatePresence `mode="wait"`).
- Section enters via the existing `Reveal` wrapper. Reveal is refactored to
  the `MotionConfig reducedMotion="user"` pattern (same hydration-mismatch
  fix as the hero) — reduced-motion users get opacity-only, no transforms.

## Verification

Playwright: dark/light/mobile screenshots of the section, toggle exercised,
zero console errors, 44px hit-target audit on the chips.
