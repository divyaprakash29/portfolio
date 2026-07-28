import { skills } from "@/data/profile";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

/**
 * Skills as a repo tree: each group in profile.ts already carries a path
 * ("src/", "design/", "./"), so groups render as folders — mono header
 * with the path, then the stack as quiet chips. Static, no scroll tricks.
 */
export function SkillsSection() {
  return (
    <section id="skills" className="relative border-t border-line py-20 lg:py-28">
      <div className="mx-auto w-full max-w-content px-5 sm:px-8">
        <SectionHeading label="skills" aside="$ tree --stack" />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {skills.map((group, i) => (
            <Reveal key={group.group} delay={i * 0.05} className="h-full">
              {/* Translucent + blurred rather than solid bg-canvas-alt, so the
                  ambient wash behind the page reads through the cards instead
                  of being punched out by them. `/opacity` modifiers do nothing
                  on the token colours (CLAUDE.md) — hence color-mix. */}
              <div className="flex h-full flex-col rounded-sm border border-line bg-[color-mix(in_srgb,var(--canvas-alt)_62%,transparent)] p-6 shadow-1 backdrop-blur-md">
                <p className="font-mono text-xs tracking-widest text-ink-faint">
                  {group.path}
                  <span className="text-signal">{group.group}</span>
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-ink-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:text-ink"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
