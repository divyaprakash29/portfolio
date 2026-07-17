import { profile } from "@/data/profile";
import { Magnetic } from "@/components/magnetic";
import { Reveal } from "@/components/reveal";

/**
 * Closing section: a big serif invitation, the email as the primary
 * action, socials and location as quiet mono metadata. Doubles as the
 * page footer.
 */
export function Contact() {
  return (
    <section id="contact" className="relative border-t border-line pb-10 pt-20 lg:pt-28">
      <div className="mx-auto w-full max-w-content px-5 sm:px-8">
        <Reveal>
          <h2 className="font-mono text-2xl font-medium tracking-tight sm:text-3xl">
            <span className="text-signal">{"//"}</span> contact
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-10 max-w-3xl font-display text-4xl font-medium leading-tight text-ink sm:text-5xl lg:mt-14 lg:text-6xl">
            Let&apos;s build something people{" "}
            <em className="text-signal">actually</em> use.
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Magnetic strength={0.3}>
              <a
                href={`mailto:${profile.email}`}
                className="inline-block bg-signal px-8 py-4 font-mono text-sm uppercase tracking-widest text-canvas transition-opacity duration-200 hover:opacity-90 active:scale-[0.97]"
              >
                {profile.email}
              </a>
            </Magnetic>

            <ul className="flex items-center gap-2 font-mono text-sm">
              {[
                { label: "github", href: profile.github },
                { label: "linkedin", href: profile.linkedin },
              ].map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[44px] items-center px-3 text-ink-soft underline-offset-4 transition-colors hover:text-signal hover:underline"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-wrap items-baseline justify-between gap-3 border-t border-line pt-6 font-mono text-xs text-ink-faint lg:mt-24">
          <span>
            {profile.name} · {profile.location}
          </span>
          <a href="#top" className="min-h-[44px] pt-1 transition-colors hover:text-ink">
            back to top ↑
          </a>
        </div>
      </div>
    </section>
  );
}
