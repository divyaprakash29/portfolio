import { projects } from "@/data/profile";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

/**
 * Projects as an editorial index: numbered rows with a big serif name,
 * the pitch, the story detail, stack chips, and (where the résumé backs
 * one) a measured result. Plain native scrolling — the pinned horizontal
 * gallery this replaces was rejected for hijacking the scroll.
 */
export function Projects() {
  return (
    <section id="projects" className="relative border-t border-line py-20 lg:py-28">
      <div className="mx-auto w-full max-w-content px-5 sm:px-8">
        <SectionHeading label="projects" aside={`${projects.length} shipped`} />

        {/* .projects-index dims the rows you aren't pointing at (CSS only, in
            globals.css, and hover-capable pointers only) — the editorial-index
            equivalent of pulling one card out of a stack. */}
        <ol className="projects-index mt-6 lg:mt-10">
          {projects.map((p, i) => (
            <li
              key={p.slug}
              data-cursor="view"
              className="group relative border-b border-line transition-opacity duration-300"
            >
              {/* warm light bleeding in from the leading edge on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--accent)_11%,transparent),transparent_60%)] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              />
              <Reveal>
                <div className="grid grid-cols-1 gap-x-10 gap-y-4 py-10 transition-transform duration-500 ease-out group-hover:translate-x-3 lg:grid-cols-[auto_1.1fr_1fr] lg:py-12">
                  <span className="font-mono text-sm text-ink-faint transition-colors duration-300 group-hover:text-signal lg:pt-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="flex items-baseline gap-3 font-display text-3xl font-medium leading-tight text-ink transition-colors duration-300 group-hover:text-signal sm:text-4xl">
                      {p.tag}
                      <span
                        aria-hidden
                        className="-translate-x-3 text-2xl opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                      >
                        →
                      </span>
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
                      {p.desc}
                    </p>
                    {p.stat && (
                      <p className="mt-3 font-mono text-sm text-signal">{p.stat}</p>
                    )}
                  </div>

                  <div className="lg:pt-2">
                    <p className="max-w-md text-sm leading-relaxed text-ink-faint">
                      {p.detail}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <li
                          key={s}
                          className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:text-ink"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
