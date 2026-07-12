# Cinematic Scroll Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A scroll-driven cinematic intro ("The Site Builds Itself") — wireframes → design tokens → assembling components → crossfade reveal into the live hero — with a persistent ambient 3D thread behind the rest of the page.

**Architecture:** One fixed full-viewport R3F `<Canvas>` behind the page (z-0; page content above). A 400vh DOM spacer (`#cinematic-intro`) at the top of `<main>` provides scroll distance; one GSAP ScrollTrigger timeline scrubbed over it drives a camera-proxy object and a shared `rigState.progress`. Four act components read `rigState.progress` in `useFrame` and derive local 0–1 progress from overlapping windows. Spec: `docs/superpowers/specs/2026-07-12-cinematic-scroll-design.md`.

**Tech Stack:** Next.js 14 App Router, React 18, three + @react-three/fiber v8 + @react-three/drei v9, GSAP 3.15 ScrollTrigger (installed), Lenis (installed), next-themes.

## Global Constraints

- React 18 requires R3F v8: install exactly `three@0.170.0 @react-three/fiber@8.18.0 @react-three/drei@9.122.0`. Do NOT install fiber v9/drei v10 (React 19 only).
- Every file under `src/components/cinematic/` starts with `"use client"`.
- All scene colors come from `useSceneTokens()` (CSS variables), never hard-coded hex.
- Canvas wrapper is `aria-hidden` and `pointer-events-none`. Real content stays in DOM order; no SEO-relevant text lives in WebGL.
- Reduced motion: spacer hidden via Tailwind `motion-reduce:hidden`; canvas not mounted (tier `static`). Never rely on JS alone for the reduced-motion layout.
- Verify after every task: dev server compiles clean + `node scripts/verify-cinematic.mjs` reports zero console errors. Commit after every task.
- Deviations from spec (approved at plan time): postprocessing grain/vignette is a CSS overlay, not a GPU pass; `frameloop` stays `"always"` because the ambient thread animates continuously so demand-mode never idles; reveal alignment is compositional (matching hero layout regions) with crossfade covering the seam, not pixel-exact.

## File Structure

```
src/components/cinematic/
  rig-state.ts            module-level mutable store (no React state)
  util.ts                 window01() progress-window helper
  use-experience-tier.ts  tier: "full" | "lite" | "static"
  use-scene-tokens.ts     theme bridge: CSS vars -> scene colors
  cinematic-root.tsx      fixed wrapper; mounts Scene via next/dynamic
  scene.tsx               <Canvas>: bg, fog, lights, rig, acts
  scroll-rig.tsx          master ScrollTrigger timeline + camera driver
  intro-pin.tsx           DOM: 400vh spacer, captions, skip link
  depth-layers.tsx        parallax planes + ambient far particles
  acts/act-blueprint.tsx  Act 1
  acts/act-tokens.tsx     Act 2
  acts/act-assembly.tsx   Act 3
  acts/act-reveal.tsx     Act 4
scripts/verify-cinematic.mjs   Playwright verification
Modify: src/app/page.tsx, src/app/layout.tsx, src/app/globals.css,
        src/components/hero.tsx (mount-anim -> whileInView), .gitignore
```

---

### Task 1: Baseline commit, dependencies, tiers, theme bridge, empty scene

**Files:**
- Create: `src/components/cinematic/rig-state.ts`, `util.ts`, `use-experience-tier.ts`, `use-scene-tokens.ts`, `cinematic-root.tsx`, `scene.tsx`
- Create: `scripts/verify-cinematic.mjs`
- Modify: `src/app/page.tsx` (mount CinematicRoot), `.gitignore` (add `scripts/.shots/`)

**Interfaces:**
- Produces: `rigState = { progress: number; threadY: number; pointer: {x,y} }`; `window01(p, a, b): number`; `useExperienceTier(): "full"|"lite"|"static"|null`; `useSceneTokens(): SceneTokens|null` where `SceneTokens = { canvas, ink, inkSoft, inkFaint, signal, marker, line: string; isDark: boolean }`; `Scene` accepts `{ tier: "full"|"lite" }`. Acts added later render inside `scene.tsx`.

- [ ] **Step 1: Commit the uncommitted baseline** (prior sessions' portfolio work):

```bash
git add -A && git commit -m "chore: baseline portfolio state before cinematic scroll work"
```

- [ ] **Step 2: Install pinned 3D deps**

```bash
npm install three@0.170.0 @react-three/fiber@8.18.0 @react-three/drei@9.122.0 && npm install -D @types/three@0.170.0
```

Expected: no peer-dependency errors (fiber 8 pairs with React 18).

- [ ] **Step 3: Create `rig-state.ts` and `util.ts`**

```ts
// rig-state.ts
export const rigState = {
  progress: 0, // 0..1 through the intro spacer
  threadY: 0,  // ambient camera drift after the reveal
  pointer: { x: 0, y: 0 }, // -1..1, desktop only
};
```

```ts
// util.ts — map global progress into a local 0..1 window
export const window01 = (p: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (p - a) / (b - a)));
```

- [ ] **Step 4: Create `use-experience-tier.ts`** — `static` for reduced motion, `lite` for coarse pointer or <768px, else `full`. Returns `null` before mount (SSR-safe; canvas simply isn't mounted server-side).

- [ ] **Step 5: Create `use-scene-tokens.ts`** — on `resolvedTheme` change, `getComputedStyle(document.documentElement)` and read `--canvas --ink --ink-soft --ink-faint --green --coral --line` into `SceneTokens`.

- [ ] **Step 6: Create `cinematic-root.tsx` + `scene.tsx`** — root renders `null` for `static`/unresolved tier, else a `fixed inset-0 z-0 pointer-events-none` `aria-hidden` div with `Scene` loaded via `next/dynamic({ ssr: false })`. Scene: `<Canvas dpr={[1, lite?1.5:2]} camera={{ fov: 55, near: 0.1, far: 60, position: [0,0,10] }} gl={{ antialias: true, powerPreference: "high-performance" }}>` with `<color attach="background" args={[tokens.canvas]} />`, `<fog attach="fog" args={[tokens.canvas, 8, 46]} />`, `<ambientLight intensity={tokens.isDark ? 0.5 : 0.8} />`. Mount `<CinematicRoot />` first inside `page.tsx`'s fragment, and wrap page content so it stacks above: give `<main>` `className="relative z-10"` (nav/scroll-progress already use higher z or fixed positioning — verify visually).

- [ ] **Step 7: Create `scripts/verify-cinematic.mjs`** — Playwright chromium: navigate to `http://localhost:3000`, collect `console.error`/`pageerror`, wait for `canvas` element, scroll through the intro in fractions {0, .25, .5, .75, 1} of `#cinematic-intro` height (skip gracefully if the spacer doesn't exist yet), screenshot each to `scripts/.shots/<theme>-p<frac>.png`, repeat after clicking the theme toggle, then a 375×700 viewport pass and a `reducedMotion: "reduce"` context asserting no `canvas` mounts and the spacer is hidden. Exit non-zero if any console error. Add `scripts/.shots/` to `.gitignore`.

- [ ] **Step 8: Verify** — `npm run dev` in background; `node scripts/verify-cinematic.mjs`. Expected: PASS, canvas visible, background matches theme canvas color in both themes, zero console errors.

- [ ] **Step 9: Commit** — `git add -A && git commit -m "feat(cinematic): canvas foundation, tiers, theme bridge"`

### Task 2: Intro spacer, scroll rig, depth layers, Act 1 Blueprint

**Files:**
- Create: `src/components/cinematic/intro-pin.tsx`, `scroll-rig.tsx`, `depth-layers.tsx`, `acts/act-blueprint.tsx`
- Modify: `src/app/page.tsx` (spacer before Hero), `scene.tsx` (render rig + layers + act)

**Interfaces:**
- Consumes: `rigState`, `window01`, `SceneTokens`.
- Produces: DOM `#cinematic-intro` spacer; camera proxy driven by the master timeline; act prop shape `{ tokens: SceneTokens; tier: "full"|"lite" }` used by all later acts. Act 1 window: `window01(p, 0, 0.28)`, fades out by 0.34.

- [ ] **Step 1: `intro-pin.tsx`** — section `id="cinematic-intro"` `className="relative h-[250vh] lg:h-[400vh] motion-reduce:hidden"` containing a `sticky top-0 h-screen` overlay with: four act captions (mono, small, e.g. "01 — It starts with structure." / "02 — Tokens give it a voice." / "03 — Components bring it to life." / "04 — Ship it.") absolutely centered near the bottom-left, each faded in/out by its own scrubbed ScrollTrigger over the spacer (windows 0–.25/.25–.5/.5–.75/.75–.95); and a keyboard-focusable `<a href="#top">Skip intro</a>` pill (min 44px target) bottom-right, `pointer-events-auto`. Lenis's existing anchor handler smooth-scrolls it past the pin. Place `<CinematicIntro />` as the first child of `<main>` in `page.tsx`.

- [ ] **Step 2: `scroll-rig.tsx`** — inside-Canvas component. Module-level `const cam = { x:0, y:0, z:10, lookY:0 }`. In `useEffect`: one `gsap.timeline({ scrollTrigger: { trigger: "#cinematic-intro", start: "top top", end: "bottom bottom", scrub: true, snap: (v) => (v > 0.88 ? 1 : v), onUpdate: (st) => { rigState.progress = st.progress; } } })` with camera keyframes (positions sum to duration 1):

```ts
tl.to(cam, { z: -2,          duration: 0.25, ease: "power2.inOut" }, 0)
  .to(cam, { z: -14,         duration: 0.25, ease: "power2.in"    }, 0.25)
  .to(cam, { z: -22, y: 0.6, duration: 0.25, ease: "power3.inOut" }, 0.5)
  .to(cam, { z: 9,   y: 0,   duration: 0.25, ease: "power3.inOut" }, 0.75);
```

`useFrame`: `camera.position.set(cam.x + pointer.x*0.4, cam.y + pointer.y*0.25 + rigState.threadY, cam.z); camera.lookAt(0, cam.lookY, cam.z - 8);`. Pointer listener (full tier only) maps mousemove to −1..1 with lerp smoothing. Kill trigger + listener on cleanup.

- [ ] **Step 3: `depth-layers.tsx`** — 5 large translucent planes (z −3, −8, −14, −20, −30; alternating faint grid CanvasTexture and soft radial-gradient CanvasTexture built from `tokens.line`/`tokens.inkFaint`; opacity .05–.12) plus one `InstancedMesh` of 30 tiny (0.05) `tokens.inkFaint` dots spread x∈[−10,10], y∈[−5,5], z∈[−28,−42], drifting slowly in `useFrame` (wrap around). Layers translate slightly against `rigState.pointer` for parallax. Lite tier: 3 planes, 15 dots.

- [ ] **Step 4: `acts/act-blueprint.tsx`** — group of 8 dashed wireframe rectangles (drei `Line` with `dashed dashScale={8}` around plane corners, color `tokens.line`, two larger "hero"/"nav" rects tinted `tokens.inkSoft`) at z −1…−10 with x/y scatter; small `+` annotation crosses between them; a few thin leader lines. Local `t = window01(rigState.progress, 0, 0.28)`; group opacity ramps 0→1 over t 0–0.15 and →0 over `window01(p, 0.28, 0.34)` (set material opacity in `useFrame`; materials `transparent`). Edge color lerps `line→signal` starting p≈0.25 (tokens beginning to land). Render rig, layers, and act inside `scene.tsx`.

- [ ] **Step 5: Verify** — `node scripts/verify-cinematic.mjs`. Expected: p0/p25 screenshots show blueprint world with camera dollying forward; captions legible; skip link scrolls past intro; zero console errors. Inspect screenshots with Read.

- [ ] **Step 6: Commit** — `git commit -am "feat(cinematic): intro spacer, scroll rig, depth layers, blueprint act"`

### Task 3: Act 2 — Tokens

**Files:**
- Create: `src/components/cinematic/acts/act-tokens.tsx`
- Modify: `scene.tsx` (render act)

**Interfaces:** Consumes `rigState`, `window01`, act prop shape. Window: fade in `window01(p, .22, .3)`, out `window01(p, .5, .58)`.

- [ ] **Step 1: Implement** — six CanvasTextures drawn at mount (128–256px canvases, `tokens.canvas` chip background, 14px mono labels in `tokens.ink`): a `signal` color chip, a `marker` color chip, `Aa 1.333`, `4 · 8 · 16 · 24`, `radius 12`, `wght 600`. Six `InstancedMesh`es (one per texture), full: 8 instances each / lite: 4, plane geometry ~0.6×0.4, `MeshBasicMaterial({ map, transparent })`. Instances seeded in a loose tube around the camera path: x∈[−4,4] avoiding |x|<0.8, y∈[−2.5,2.5], z∈[−4,−17]. `useFrame`: each instance drifts toward +z at its own speed × local t (streaming past the accelerating camera), gentle per-instance rotation wobble; group opacity from the fade windows. Chips passing z > camera z reset to far z (continuous stream).

- [ ] **Step 2: Verify** — verify script; p50 (lite p50) screenshot shows token chips streaming past with strong parallax against depth layers; both themes readable. Zero console errors.

- [ ] **Step 3: Commit** — `git commit -am "feat(cinematic): design-token particle stream act"`

### Task 4: Act 3 — Assembly

**Files:**
- Create: `src/components/cinematic/acts/act-assembly.tsx`
- Modify: `scene.tsx` (render act + directional key light whose intensity is driven here or in rig)

**Interfaces:** Consumes `rigState`, `window01`. Window: in `window01(p, .48, .56)`, out `window01(p, .78, .84)`. Produces: key light ramp `keyIntensity = 0.2 + window01(p, .5, .75) * 0.9` (read by scene's directional light via a ref updated in `useFrame`).

- [ ] **Step 1: Implement** — centered group at z −20, y 0.6 (camera's act-3 resting view):
  - **Button:** drei `RoundedBox args={[1.6, 0.5, 0.12]} radius={0.09}` in `tokens.signal` (`meshStandardMaterial`), assembling: scales from 0 with `power3.out` feel (`t*t*(3-2*t)` smoothstep on local t), plus a white 3-bar "label" plane. Hover demo: `pulse = smoothstep window01(p, .62, .66) * (1 - window01(p, .68, .72))`; scale `1 + pulse*0.08`, y `+pulse*0.06`.
  - **Card:** three planes (media area `tokens.inkFaint`, two text bars `tokens.inkSoft`) folding in: rotationX from −Math.PI/2 → 0 staggered by local t offsets, converging into a 1.4×1.8 card to the button's right.
  - drei `<ContactShadows position={[0, -0.9, -20]} opacity={0.5 * t} scale={8} blur={2.4} far={2} />`.
  - `<directionalLight position={[3, 5, -14]} />` in scene with intensity from `keyIntensity` (flat/cold before, warm/dimensional here per spec).

- [ ] **Step 2: Verify** — verify script; p75 screenshot shows assembled button+card with contact shadows and ramped key light; hover pulse visible around p≈64% (add a 0.64 screenshot fraction while tuning). Zero console errors.

- [ ] **Step 3: Commit** — `git commit -am "feat(cinematic): component assembly act with light ramp and contact shadows"`

### Task 5: Act 4 — Reveal, hero handoff, grain overlay

**Files:**
- Create: `src/components/cinematic/acts/act-reveal.tsx`
- Modify: `scene.tsx` (render act), `src/components/hero.tsx` (mount anim → `whileInView`), `src/app/globals.css` (grain/vignette overlay), `cinematic-root.tsx` (overlay div, desktop only)

**Interfaces:** Consumes `rigState`, `window01`. Window: in `window01(p, .72, .8)`, everything WebGL-intro fades out over `window01(p, .93, 1)` (acts 1–3 already gone; reveal group + depth-layer intro boost fade; ambient dots persist for the thread).

- [ ] **Step 1: `act-reveal.tsx`** — as the camera pulls back (z −22→9): an oversized browser-chrome outline (drei `Line` rect ~7×4.4 + top bar line + three dots) at z −2 in `tokens.line` that the camera passes back through while it fades in then out; inside it, a hero-echo composition gliding into place (local t eased): two stacked headline slabs left (signal + ink planes, proportions echoing the real hero's two-line display block), a thin stat rail right (three small ink-soft bars) — matching the hero's layout regions. Over `window01(p, .93, 1)` the whole group's opacity → 0 exactly as the real DOM hero scrolls into the viewport underneath; the ScrollTrigger snap (rig, Task 2) parks users at p=1 so nobody strands mid-crossfade.

- [ ] **Step 2: Hero handoff** — in `hero.tsx`, change the container `motion.div` from `initial/animate` to `initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}` so its stagger plays when the intro delivers the viewport to it, not at page mount. Keep reduced-motion branches unchanged.

- [ ] **Step 3: Grain + vignette** — in `cinematic-root.tsx` add a sibling fixed overlay div (`hidden lg:block`, `pointer-events-none`, z-0) styled in `globals.css`: SVG `feTurbulence` noise data-URI at ~4% opacity plus a radial vignette using `--ink` at ~6%, `mix-blend-mode: multiply` (`.dark` uses `screen` at lower opacity).

- [ ] **Step 4: Verify** — verify script with an added 0.97 fraction: screenshots show browser frame pull-back, composition matching hero regions, and a clean crossfade — p1.0 must look identical to the plain hero (no WebGL remnants above ambient dots). Confirm hero stagger plays at arrival. Zero console errors.

- [ ] **Step 5: Commit** — `git commit -am "feat(cinematic): reveal act with hero crossfade and film grain"`

### Task 6: The thread — post-reveal ambience

**Files:**
- Create: none
- Modify: `scroll-rig.tsx` (thread trigger), `depth-layers.tsx` (post-intro behavior), `src/app/page.tsx`/section components only if section ids are missing

**Interfaces:** Consumes `rigState.threadY` (already applied by the rig's `useFrame`).

- [ ] **Step 1: Implement** — in `scroll-rig.tsx`, a second ScrollTrigger from `#top` (hero) to `document.body` bottom, scrub, tweening `rigState.threadY` 0 → −1.6 with `ease: "none"` (the lerped pointer smoothing keeps it soft), so the ambient dot field and far layers drift as the user reads. In `depth-layers.tsx`, keep only the two farthest layers + dots visible after p=1 at reduced opacity (≤0.06) so text contrast is untouched; verify contrast on both themes.

- [ ] **Step 2: Verify** — scroll to projects/contact: dots drift subtly behind content, no readability loss, projects' own pinned gallery still works (its ScrollTrigger must be unaffected — regression check), zero console errors.

- [ ] **Step 3: Commit** — `git commit -am "feat(cinematic): ambient thread behind page sections"`

### Task 7: Tiers, full verification, refinement

**Files:**
- Modify: whatever the passes below surface; `scripts/verify-cinematic.mjs` if fractions/assertions need extending

- [ ] **Step 1: Tier passes** — mobile 375px run: 250vh spacer, halved counts, DPR ≤1.5, no pointer drift, captions fit. Reduced-motion run: no canvas, no spacer, hero visible immediately with plain fade, conventional scroll.
- [ ] **Step 2: Build gate** — `npm run build` must pass (catches SSR leaks from three imports).
- [ ] **Step 3: Refinement loop** — read every screenshot end-to-end as a filmstrip; tune ease overlaps, fog range, light ramp, and act windows until the four acts read as ONE camera move (no dead zones, no pops). Repeat script → adjust → script.
- [ ] **Step 4: Perf smoke** — CDP `Performance` metrics during a scripted intro scroll; investigate if frame time p95 > 33ms desktop.
- [ ] **Step 5: Final commit** — `git commit -am "feat(cinematic): tier tuning and refinement pass"`
