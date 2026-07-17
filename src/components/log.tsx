import { experience } from "@/data/profile";
import { Reveal } from "@/components/reveal";

/**
 * Work experience as a git log: each role milestone is a "commit" with a
 * hash, conventional-commit scope, and a measured stat. The data in
 * profile.ts is already shaped this way — the section just renders it.
 */
export function Log() {
  return (
    <section id="log" className="relative border-t border-line py-20 lg:py-28">
      <div className="mx-auto w-full max-w-content px-5 sm:px-8">
        <Reveal>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-mono text-2xl font-medium tracking-tight sm:text-3xl">
              <span className="text-signal">{"//"}</span> log
            </h2>
            <span className="font-mono text-sm text-ink-faint">$ git log --work</span>
          </div>
        </Reveal>

        <div className="relative mt-10 lg:mt-14">
          {/* commit rail */}
          <div aria-hidden className="absolute bottom-3 left-[5px] top-3 w-px bg-line" />

          <ol className="space-y-10">
            {experience.map((e, i) => (
              <li key={e.hash} className="relative pl-8 sm:pl-10">
                <span
                  aria-hidden
                  className="absolute left-0 top-[0.35rem] h-[11px] w-[11px] rounded-full border-2 border-signal bg-canvas"
                />
                <Reveal delay={i * 0.06}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                    <span className="font-mono text-sm text-signal">{e.hash}</span>
                    <h3 className="font-mono text-base text-ink sm:text-lg">
                      <span className="text-ink-soft">{e.scope}</span> {e.message}
                    </h3>
                    <span className="rounded-full border border-line px-3 py-1 font-mono text-xs text-signal sm:ml-auto">
                      {e.stat}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-xs tracking-wide text-ink-faint">
                    {e.company} · {e.title} · {e.dates}
                  </p>
                  <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
                    {e.detail}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
