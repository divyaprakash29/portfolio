import { ScrollProgress } from "@/components/scroll-progress";
import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Log } from "@/components/log";
import { SkillsSection } from "@/components/skills-section";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <SiteNav />
      <main>
        <Hero />
        <About />
        <Log />
        <SkillsSection />
        {/* Projects (redesigned, no pinned scroll) and Contact land here
            in later checkpoints */}
      </main>
    </>
  );
}
