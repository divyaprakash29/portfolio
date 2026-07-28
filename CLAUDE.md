# Divya Prakash — Portfolio

Next.js rebuild of a personal portfolio, built section-by-section with the user
reviewing each checkpoint (screenshot + live dev server) before moving on. See
`SKILLS.md` for the design system and the design-tool decisions behind it.

## Stack (pinned on purpose — read before upgrading anything)

- **Next.js 14**, App Router. Pinned intentionally at the user's request — the
  latest `create-next-app` now scaffolds Next 16, which ships its own breaking
  API changes. Don't `npm i next@latest` without checking with the user first.
- **TypeScript**, **Tailwind CSS v3** (not v4 — tokens are CSS variables in
  `globals.css`, consumed via `tailwind.config.ts` `theme.extend.colors`, not
  Tailwind v4's CSS-first `@theme`).
- **Framer Motion** for all animation (stagger entrances, scroll reveals,
  hover/press states, the mobile nav's height transition).
- **next-themes** for light/dark (class-based, toggle in the nav).
- **GSAP + ScrollTrigger** (`@gsap/react`) — currently unused: the pinned
  horizontal projects gallery (its only consumer) was pulled from the page
  on 2026-07-13 because the user rejected the scroll hijack — the third
  such rejection (WebGL hero, cinematic scroll intro, pinned gallery).
  `projects.tsx` stays on disk pending a conventional-scroll redesign.
  Avoid pinning/scroll-hijack patterns in whatever replaces it; don't mix
  GSAP and Framer Motion on the same element.
- No 3D/WebGL library. A Three.js hero was built, polished, and then removed
  at the user's request — see `SKILLS.md` "History" section before
  reintroducing anything WebGL-based here.

## Structure

- `src/components/` — one file per section/piece (`hero.tsx`, `site-nav.tsx`,
  `theme-toggle.tsx`, `scroll-progress.tsx`, …). Sections are composed in
  `src/app/page.tsx`.
- `src/data/profile.ts` — **all real content lives here** (experience,
  projects, skills, bio facts). Edit content here, not inline in components.
- `src/lib/cn.ts` — `clsx` + `tailwind-merge` helper, used everywhere instead
  of raw template-string class concatenation.
- `src/app/globals.css` — design tokens as CSS variables (`:root` = light,
  `.dark` = dark). `tailwind.config.ts` just points Tailwind at these vars.

## Commands

```
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Gotchas already hit once — don't re-hit them

- **Variable fonts must not get an explicit `weight` array** in
  `next/font/google`. Inter and Fraunces (the current body and display faces)
  are both variable; passing `weight: ["400","500","600","700"]` forces Next to
  download 4 separate static instances instead of the one variable file. Leave
  `weight` unset. (IBM Plex Mono has no variable axis, so its weight array is
  correct and necessary — don't "fix" that one.)
- **A variable font's non-weight axes need naming in `axes`, or Next drops
  them.** Fraunces ships `opsz` and `SOFT`; without `axes: ["SOFT", "opsz"]`
  Next subsets to the wght axis alone and the display type silently renders at
  its small-text design — chunkier and tighter — at 7rem. No error, just wrong
  letterforms.
- **Every interactive element needs a ≥44×44px hit target.** Checked via an
  actual DOM audit script (bounding rects), not eyeballing — see `SKILLS.md`
  for the QC method. The nav links and theme toggle both failed this once.
- **Mobile nav is a hamburger below `sm`.** Cramming the desktop link row
  into 375px overflows by a few px even with tight padding — don't try to
  fix that by shaving padding, collapse it instead.
- **No `chromium-cli` in this environment.** QC screenshots go through a
  scratch Playwright script using `playwright-core` (browsers already cached
  at `~/AppData/Local/ms-playwright` from the first install) rather than any
  packaged browser-driving tool.
- **Don't re-add WebGL/Three.js without checking with the user first.** It
  was tried, engineered carefully (perf-gated, zero mobile requests, verified
  with Playwright network traces), polished to a genuinely good render
  quality — and still rejected on concept grounds, not execution. See
  `SKILLS.md` History section. **Rejected a second time on 2026-07-12:** a
  fully spec'd + approved R3F "cinematic scroll" intro (4-act scroll-driven
  scene, 5 of 7 tasks built and verified) was rolled back mid-build — the
  user didn't like the scroll-hijacking feel. The site's direction is a
  Tajmirul-style elegant DOM hero — coral accent (#ff7a4d dark / #b33608
  light, token `--accent`), Fraunces for display type in mixed case, Inter
  for body, a ~1.9s "DIVYA PRAKASH" preloader. The user explicitly
  rejected green accents. Scroll animations may come later, but keep them
  light and DOM-based (Framer Motion / GSAP), not a WebGL scene.
- **The palette is teal-slate, not the old flat #212121** (changed
  2026-07-28 at the user's request, referencing Luma's event-page
  background — `background.png` in the repo root is the reference crop).
  Dark canvas `#0a1a20`; the page sits on a fixed near-vertical gradient
  `#071619 → #1a3340 → #2b4356` with a film-grain overlay
  (`grain-field.tsx` + the `.field-*` rules). Type is pure white on a
  neutral grey ramp — Luma's own values. Luma paints that background with a
  three.js shader; ours is CSS, and it should stay that way.
- **A CSS keyframe that animates `transform` silently kills Tailwind's
  transform utilities on the same element.** They're the same property, so
  `animate-[spin]` + `-translate-y-1/2` drops the element half a viewport with
  no error. Position with `top`/`left` instead, or wrap in a positioning parent
  and animate the child.
- **Changing the wash costs contrast.** The gradient's light end sits under
  text for the whole page, so lightening `--wash-bot` pushes the mono
  captions (`--ink-faint`) and the accent stat text toward failing AA.
  Measure it — `contrast-check.js` in the scratch dir screenshots the field
  with content hidden, samples the gradient at five viewport heights, and
  prints ratios per token. Every token currently clears AA for normal text in
  both themes; worst case is 4.74 (dark `--accent` at the bottom of the
  gradient). Don't lighten `--wash-bot` or the accent without re-running it.
- **`useReducedMotion()` is `false` on the first render.** Framer's hook only
  flips after mount, so anything gated on it will *mount and then animate away*
  — which is precisely what a reduced-motion user asked not to see. For
  render-or-not decisions (the preloader curtain), read
  `window.matchMedia("(prefers-reduced-motion: reduce)").matches` in a layout
  effect instead; it's correct synchronously.
- **`AnimatePresence` will play its exit even when you want an element gone
  instantly.** Setting `show=false` isn't enough — AnimatePresence intercepts
  the removal. To drop something immediately, unmount the `AnimatePresence`
  itself (early `return null`).
- **Expo-out is the wrong curve for a slow "settle" over a value range.**
  `cubic-bezier(0.16,1,0.3,1)` resolves ~97% of its travel in the first third
  of the duration — great for something entering from offscreen, useless for
  the preloader's letter-spacing settle, which snapped shut and then sat
  motionless for 800ms while the timeline said it was still animating. Use an
  ease-in-out (`cubic-bezier(0.65,0,0.35,1)`) when the *middle* of the motion
  is what should be seen. Note this is invisible to code review and to
  wall-clock screenshots — see the seeking tip below.
- **To inspect a specific animation frame, seek it — don't sleep to it.**
  `page.waitForTimeout(450)` lands hundreds of ms late (screenshot latency +
  dev-mode hydration), which made a broken easing curve look fine. Instead:
  `document.getAnimations().forEach(a => a.pause())`, then set
  `a.currentTime = ms`. Deterministic, and it's how the easing bug above was
  actually found. Script: `seek-preloader.mjs` in the scratch dir.
- **Splitting text into per-letter `inline-block` spans eats the spaces.**
  A span whose only child is a normal space collapses to zero width, so
  "DIVYA PRAKASH" renders as "DIVYAPRAKASH" with no error. Substitute a
  non-breaking space (` ` as an escape, not a literal — a literal nbsp
  in the source silently breaks `Edit`'s string matching).
- **Tailwind `/alpha` modifiers silently do nothing on the token colors.**
  The theme colors are plain `var(--x)` strings, so `bg-ink/70` or
  `bg-canvas/85` generate no CSS rule at all — the element is just
  transparent, with no build error. This made the custom cursor invisible
  once (`cursor: none` + transparent dot = no pointer anywhere). For
  translucent token colors use a color-mix arbitrary value:
  `bg-[color-mix(in_srgb,var(--ink)_70%,transparent)]`.
- **Editing `tailwind.config.ts` requires a dev-server restart.** Config
  changes are NOT hot-reloaded. Adding `fontFamily.display` silently produced
  no `.font-display` utility at all, so the headline kept falling back to the
  body font and looked "wrong" for no visible reason. If a utility class seems
  to do nothing, `grep` the served CSS for the rule before debugging anything
  else — if the rule isn't there, restart the server.
- **A text animation seeded with `useState(realText)` runs backwards.** The
  scramble hero hit this: SSR renders the resolved name, then `useEffect`
  starts the scramble *after* hydration, so you see name → scramble → name.
  Fix (already applied in `scramble-text.tsx`): commit the scrambled first
  frame in a client `useLayoutEffect` (before paint) and fade the `<h1>` in
  from `opacity: 0`. The real text still lives in the SSR HTML and the
  `aria-label`, so crawlers and screen readers never see the scrambled state.
  **Verify text animations with screenshots, not `innerText` sampling** —
  `innerText` can't see opacity and will happily tell you a hidden element is
  "visible".
- **`npm run build` (production) and `npm run dev` fight over `.next/` on
  this machine** — running a production build while the dev server is up
  corrupted its cache once (`MODULE_NOT_FOUND` / stale webpack pack files).
  If you need a production build for bundle-size analysis, expect to
  `rm -rf .next` and restart the dev server afterward.

## Workflow

Build one section at a time. After each: start/confirm the dev server,
screenshot light + dark + mobile with the Playwright scratch script, check
console errors, then report to the user and wait before continuing — this is
an explicit process the user asked for, not optional polish.
