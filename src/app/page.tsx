import { ScrollProgress } from "@/components/scroll-progress";
import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Marquee } from "@/components/marquee";
import { SkillsSection } from "@/components/skills-section";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <SiteNav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Projects />
        <SkillsSection />
        <Contact />
      </main>
    </>
  );
}
