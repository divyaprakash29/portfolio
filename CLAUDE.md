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
- **GSAP + ScrollTrigger** (`@gsap/react`) — used *only* for the pinned
  horizontal projects gallery. Everything else stays on Framer Motion; don't
  mix the two on the same element.
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

- **Instrument Sans must not get an explicit `weight` array** in
  `next/font/google`. It's a variable font on Google Fonts; passing
  `weight: ["400","500","600","700"]` forces Next to download 4 separate
  static instances instead of the one variable file. Leave `weight` unset.
  (IBM Plex Mono has no variable axis, so its weight array is correct and
  necessary — don't "fix" that one.)
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
  Tajmirul-style elegant DOM hero — dark #212121, coral accent (#f28763
  dark / #d8552f light, token `--accent`), Playfair Display for display
  type in mixed case, fast (~0.9s) name preloader. The user explicitly
  rejected green accents. Scroll animations may come later, but keep them
  light and DOM-based (Framer Motion / GSAP), not a WebGL scene.
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
