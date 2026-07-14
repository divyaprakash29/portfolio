import { ScrollProgress } from "@/components/scroll-progress";
import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <SiteNav />
      <main>
        <Hero />
        <About />
        {/* Projects (redesigned, no pinned scroll), Log, Skills, Contact
            land here in later checkpoints */}
      </main>
    </>
  );
}
