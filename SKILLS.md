# Design system & the tools that produced it

This file exists so the design direction doesn't have to be re-derived every
session. If you're about to add a new section or component, read this first.

## Concept (from the `frontend-design` skill)

The whole page is a payoff of one idea: Divya works across code *and* design,
so the page renders as if it were her own component. The hero opens with
`<Portfolio role="..." />` (a self-closing JSX tag), the footer closes it.
Everything else derives from that:

- **Experience** section is styled as `git log --stat` output — real
  chronological order (most recent job first), her actual résumé metrics as
  commit trailers. Not decorative — the ordering carries real information,
  which is the bar for using any kind of numbered/sequential device.
- **Project titles** render as self-closing JSX tags (`<HustleHub />`) instead
  of numbered cards.
- **Hero: bold condensed display** (current). Modeled on
  **tajmirul.site**, which the user supplied as the reference — match it, don't
  reinvent it. Two-line stacked headline in **Anton** (ultra-condensed display),
  `FRONTEND` in the green accent over `ENGINEER` in ink, set tight
  (`leading-[0.85]`, second line indented `pl-[0.12em]`). Supporting cast:
  first-person lede, solid green `LET'S TALK` CTA, pulsing availability dot,
  vertical email rail down the left edge, a right-hand stat stack, and a
  drifting canvas particle field. Files: `hero.tsx`, `particle-field.tsx`.
- **Stats are real** (`stats` in `profile.ts`): 2+ years, 4 projects, 35%
  faster load times — all traceable to her résumé. Don't inflate them; the
  reference site's "10K+ Hours Worked" style vanity metric would be a lie here.
- **Projects: GSAP-pinned horizontal gallery.** Vertical scroll drives
  horizontal movement through the project cards. Pinning is gated to
  `min-width: 1024px` + `prefers-reduced-motion: no-preference`; everywhere
  else it degrades to a native snap-scroll carousel (never scroll-jack touch).
  Per GSAP guidance: **max 1–2 pinned sections per page** — this is the one.
  Don't spend the pin budget elsewhere.
- **Supporting polish:** magnetic buttons (`magnetic.tsx`), contextual custom
  cursor (`custom-cursor.tsx` — `[view]` over project cards, caret over code;
  strictly gated to `hover:hover` + `pointer:fine`, so it never exists on
  touch).

Do not introduce a second unrelated "signature" element. Boldness is spent in
two deliberate places — the scramble hero and the pinned gallery. Everything
else stays quiet.

### Reference research (Awwwards, done — don't redo from scratch)

Screenshotted award-winning *individual* dev/designer portfolios (Russell
Numo, Roshan Sahu, Tolis C., Sebastian Wittig) with Playwright rather than
guessing. The consistent pattern, and what this hero now applies:

- **The type IS the hero** — massive, often bleeding off the edges. Not a
  polite centered column with a card beside it (which is what we had, twice).
- **Technical "instrument panel" furniture** — crop marks, dashed rules, live
  clocks, coordinates, `STATUS:` readouts. Makes it feel engineered.
- **Restraint everywhere else.** Resn (resn.co.nz) is near-black with one
  glowing object and almost nothing else. The spectacle is *concentrated*,
  not scattered.

Caveat worth remembering: those agency sites are flex pieces with no
conversion constraints. Divya's site has a job — a recruiter must read her
name, role, and work within seconds. So: no preloader gate, no "click to
enter", no sound. Steal the *restraint principle*, not the whole spectacle.

### History: why there's no WebGL here

First pass was a literal 3D `<` `/` `>` bracket built in Three.js
(`@react-three/fiber`), chosen to avoid the generic sphere/torus-knot most
"modern" Three.js portfolio heroes default to. It was engineered carefully —
dynamically imported with `ssr:false`, gated behind viewport width and
`prefers-reduced-motion`, verified via Playwright network traces to make
**zero** requests on mobile — and even after a real quality pass (ACES tone
mapping, `MeshPhysicalMaterial` clearcoat, `RoundedBox` instead of hard box
edges, a synthetic `Lightformer` environment for reflections, contact
shadows), the user still didn't like it and asked for it removed. Two
lessons, not one:

1. **The engineering care didn't save a concept that wasn't landing.** Perf
   gating and material polish fix *how good* an idea looks; they don't fix
   *whether it's the right idea*. Don't over-invest in implementation quality
   before the concept itself has been validated.
2. **If 3D-vs-not comes up again, don't silently re-guess.** Ask first, or at
   minimum confirm the direction in fewer steps than last time.

`three`, `@react-three/fiber`, `@react-three/drei` were fully uninstalled —
if you see them mentioned anywhere else, that's stale.

## Tokens

Defined as CSS variables in `src/app/globals.css` (`:root` = light, `.dark` =
dark), surfaced to Tailwind via `tailwind.config.ts`:

| Token | Light | Dark | Use |
|---|---|---|---|
| `canvas` | `#EFF2ED` | `#14161A` | page background |
| `canvas-alt` | `#F8F9F5` | `#1B1E21` | card/panel background |
| `ink` | `#171B18` | `#E9EBE4` | primary text |
| `ink-soft` / `ink-faint` | greys | greys | secondary/tertiary text |
| `signal` (green) | `#23824A` | `#56C687` | "code world" accent — links, status dot |
| `marker` (coral) | `#D8552F` | `#F28763` | "design world" accent — CTAs, redline annotations |
| `line` / `line-strong` | greys | greys | borders |
| `shadow-1/2/3` | — | — | elevation scale, use these instead of ad-hoc `box-shadow` |

Only two accent hues, ever. If a new component needs a third color, it's
probably semantic (error/success) and should be named as such, not added to
the palette.

**Type:** three roles.
- `font-display` = **Anton** — the hero headline, stat numbers, CTA. Single
  400 weight, ultra-condensed, uppercase only. Impact type, used sparingly.
- `font-mono` = IBM Plex Mono — labels, nav, code-flavored UI, technical
  metadata.
- `font-sans` = Instrument Sans — body copy and paragraphs.

Don't blur these: Anton is never body copy, mono is never a paragraph.

## Animation stack (matched to tajmirul.site)

Probed the reference with Playwright rather than guessing — it runs **Lenis**
(`html.lenis`) plus Framer Motion. No GSAP at runtime. What we now mirror:

1. **Lenis smooth scroll** (`smooth-scroll.tsx`) — the momentum-scroll feel,
   and the single biggest contributor to the "premium" impression. **It must be
   synced to ScrollTrigger** (`lenis.on("scroll", ScrollTrigger.update)` + drive
   `lenis.raf` from the GSAP ticker) or the pinned projects gallery silently
   stops tracking. Anchor links must also be routed through `lenis.scrollTo`,
   otherwise they hard-jump. Disabled entirely under reduced motion.
   Also required: no CSS `scroll-behavior: smooth` — it fights Lenis.
2. **Preloader intro** (`preloader.tsx`) — `DIVYA` reveals letter-by-letter in
   Anton on a dark curtain (green initial + blinking cursor), then the curtain
   wipes upward. Capped at **1.75s**, shown **once per session**
   (`sessionStorage`), and skipped under reduced motion — a recruiter must
   never be gated behind it twice.
3. **Scroll reveals** (`reveal.tsx`) — `whileInView`, `once: true`.

## Motion rules

- All animation goes through Framer Motion, not raw CSS `@keyframes`, except
  the scroll-progress bar's spring (also Framer, via `useSpring`).
- Every animated component checks `useReducedMotion()` and either skips the
  animation or drops to instant. Don't add motion without this check.
- Micro-interaction timing: 150–300ms. Entrance stagger: ~90ms per item.
- One orchestrated moment per section beats scattered effects — this is why
  the hero has a single staggered entrance sequence rather than every element
  animating independently.

## `ui-ux-pro-max` skill usage

Ran `--design-system` early on for a gut-check; its actual suggestion (blue
`#2563EB` accent, Archivo + Space Grotesk) was **rejected as templated** — kept
the green/coral/Plex-Mono/Instrument-Sans system established by
`frontend-design` instead. What *was* incorporated from `ui-ux-pro-max`:

- Elevation shadow scale (`shadow-1/2/3` tokens above).
- Touch-target minimum (44×44px, CRITICAL severity in that skill's
  checklist) — verify with a real DOM audit, not eyeballing. See
  `CLAUDE.md` gotchas: this caught two real bugs (theme toggle, nav links)
  the first time it was run against this codebase.
- Its `--stack react` / `--stack nextjs` guidance: `next/font` variable-font
  rule (also caught a real bug — see `CLAUDE.md`), rules-of-hooks, avoid
  inline object/array creation in render.

Re-run it (`--stack react`, `--stack nextjs`, `--domain ux`) whenever adding a
new interactive component — it's cheap and it has caught real bugs both times
it's been used here so far, not just style nitpicks.

## QC method

No `chromium-cli` in this environment. Screenshots and DOM audits (touch
target sizes, horizontal-scroll check, console-error check) go through a
scratch Playwright script using the `playwright-core` package — see
`CLAUDE.md` for where the cached browser binaries live. Every checkpoint gets
a light-mode, dark-mode, and 375px-mobile screenshot before it's reported as
done.
