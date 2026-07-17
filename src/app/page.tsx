import { ScrollProgress } from "@/components/scroll-progress";
import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Log } from "@/components/log";
import { SkillsSection } from "@/components/skills-section";
import { Contact } from "@/components/contact";

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
        <Contact />
        {/* Projects (redesigned, no pinned scroll) lands between Log and
            Skills in a later checkpoint */}
      </main>
    </>
  );
}
