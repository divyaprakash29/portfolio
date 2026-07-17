import { skills } from "@/data/profile";
import { Reveal } from "@/components/reveal";

/**
 * Skills as a repo tree: each group in profile.ts already carries a path
 * ("src/", "design/", "./"), so groups render as folders — mono header
 * with the path, then the stack as quiet chips. Static, no scroll tricks.
 */
export function SkillsSection() {
  return (
    <section id="skills" className="relative border-t border-line py-20 lg:py-28">
      <div className="mx-auto w-full max-w-content px-5 sm:px-8">
        <Reveal>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-mono text-2xl font-medium tracking-tight sm:text-3xl">
              <span className="text-signal">{"//"}</span> skills
            </h2>
            <span className="font-mono text-sm text-ink-faint">$ tree --stack</span>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {skills.map((group, i) => (
            <Reveal key={group.group} delay={i * 0.05} className="h-full">
              <div className="flex h-full flex-col rounded-sm border border-line bg-canvas-alt p-6 shadow-1">
                <p className="font-mono text-xs tracking-widest text-ink-faint">
                  {group.path}
                  <span className="text-signal">{group.group}</span>
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-ink-soft"
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
