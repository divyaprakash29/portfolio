# Cinematic Scroll Experience — "The Site Builds Itself"

**Date:** 2026-07-12
**Project:** divya-portfolio (Next.js 14, App Router)
**Status:** Approved design, pending implementation plan

## Concept

A full-page scroll-driven cinematic journey where the visitor flies through the
anatomy of an interface being born — wireframes → design tokens → assembling
components → the finished page. The final zoom-out reveals that the scene they
traveled through composes into the real, interactive portfolio hero. The medium
is the message: the experience itself demonstrates Divya's frontend engineering
and UX design capability. No stock or AI-generated imagery — every visual is a
design artifact (wireframes, tokens, components) generated procedurally.

After the reveal, the WebGL canvas persists behind the whole page: section
transitions get subtle camera drifts and depth-layer parallax (the "cinematic
thread"), while the sections themselves remain readable HTML.

## Decisions (locked with user)

| Decision | Choice |
|---|---|
| Location | Inside divya-portfolio |
| Scope | Full-page journey; cinematic thread continues after the intro |
| Concept | "The Site Builds Itself" (meta build-up + reveal) |
| Fallbacks | Tiered: desktop full / mobile-lite / reduced-motion static |
| Stack | @react-three/fiber + @react-three/drei + GSAP ScrollTrigger + Lenis |

## Dependencies

New: `three`, `@react-three/fiber`, `@react-three/drei`.
Already installed: `gsap` 3.15 (includes ScrollTrigger), `@gsap/react`,
`lenis`, `next-themes`, `framer-motion`.

## Architecture

All new code under `src/components/cinematic/`.

- **`CinematicRoot`** (client component) — mounts one fixed full-viewport
  R3F `<Canvas>` behind the page content. Owns tier detection
  (desktop / mobile-lite / reduced-motion). In the reduced-motion tier it
  renders no WebGL at all. Loaded via `next/dynamic` with `ssr: false` so
  first paint of HTML content is never blocked.
- **`ScrollRig`** — single source of truth for scroll. One GSAP master
  timeline bound to one ScrollTrigger spanning the page, synced to Lenis.
  Camera position, look-at target, and per-act progress all derive from this
  one timeline — this is what makes it read as one continuous scene.
- **Act components** — `ActBlueprint`, `ActTokens`, `ActAssembly`,
  `ActReveal`. Each is a self-contained scene group taking a `progress`
  input (0–1) from the rig; each can be developed and tuned independently.
- **`DepthLayers`** — 4–6 translucent planes at staggered Z depths (grid
  textures, gradient fog cards, annotation sprites) that parallax against
  camera motion. Textures generated via SVG/canvas at runtime.
- **Theme bridge** — hook reading `next-themes`, feeding scene colors (fog,
  lights, materials) from the same design tokens Tailwind uses, so the
  light/dark toggle restyles the 3D world too.

**Data flow:** Lenis → ScrollTrigger progress → master timeline → per-act
progress + camera path → R3F frame render. HTML sections remain normal DOM
(SEO/accessibility untouched); the canvas is purely presentational
(`aria-hidden`).

## Scroll choreography

**Intro pin:** first viewport pinned for ~400vh (mobile-lite ~250vh).
`scrub: true`; internal animations use `power2/power3.inOut` eases so motion
accelerates and settles naturally under scrub.

- **Act 1 — Blueprint (0–25%):** camera dollies forward inside a
  dark-blueprint void. Wireframe planes (hero, nav, card outlines) float at
  staggered depths with dashed edges and annotation lines. Subtle mouse-move
  camera drift on desktop. Fog fades far layers.
- **Act 2 — Tokens (25–50%):** camera accelerates; design-token particles
  stream past (color chips, type-scale specimens, spacing units, radius
  values) as instanced sprites. Passing a wireframe plane "absorbs" tokens:
  edges gain color, corners gain radius. Strongest parallax here.
- **Act 3 — Assembly (50–75%):** components snap together mid-air — a button
  gains fill/shadow and demos its own hover state as the camera passes; a
  project card folds from flat panels. Key light ramps up; contact shadows
  fade in.
- **Act 4 — Reveal (75–100%):** camera pulls back through an oversized
  browser-chrome frame; assembled pieces glide into a screen-space
  composition matching the real hero layout. Final 5%: WebGL composition
  crossfades into the actual DOM hero (positions aligned). Pin releases;
  native scroll continues seamlessly.

**After the reveal:** each HTML section (projects, about, contact) gets a
lightweight ScrollTrigger that nudges the persistent camera and drifts depth
layers as it enters; a few token particles float far behind content at low
opacity. No pinning after the intro; nothing fights reading.

**Scroll feel:** Lenis `lerp: 0.09` desktop / `0.12` mobile. No snap points
inside the pin, but a gentle snap to reveal completion so users never park
between the 3D world and the page.

## Realism

- One ambient fill + one directional key light; intensity ramps across acts
  (blueprint = flat/cold → reveal = warm/dimensional).
- drei `ContactShadows` under assembling components (cheap, no cascades).
- Scene fog for depth falloff; vignette + film-grain postprocessing pass on
  desktop only.
- Depth illusion: real Z-separation (z −2 to −30) + fog + parallax speed
  differences + stretched-sprite motion-blur cheat on fast particles.
- All colors from existing design tokens per theme.

## Performance budget

- Target 60fps desktop, stable 30+ mobile-lite.
- Instanced meshes for particles (single draw call); texture atlas for token
  sprites.
- `frameloop="demand"` outside the pinned intro.
- DPR cap: 1.5 mobile / 2 desktop. No depth-of-field on mobile.
- Entire cinematic bundle lazy-loaded (`next/dynamic`, `ssr: false`);
  blueprint act fades in when ready.

## Accessibility

- Canvas `aria-hidden`, non-interactive; all content in DOM order.
- `prefers-reduced-motion`: no canvas, no pin — composed hero appears with a
  simple opacity fade; conventional scrolling.
- Visible, keyboard-focusable "Skip intro" button (first tab stop) jumps
  scroll past the pin.
- Maintains the WCAG AA bar established in earlier sessions (44px touch
  targets, no horizontal overflow).

## Testing

Playwright (already configured in this project):

- Screenshots at 0/25/50/75/100% scroll progress, both themes.
- Mobile viewport (375px) pass; reduced-motion emulation pass.
- Console-error assertion on all passes.
- Scroll-performance smoke check via CDP frame metrics.

Final phase is an explicit refinement loop: tune eases, act overlaps, and
light ramps until the four acts read as one continuous camera move.
