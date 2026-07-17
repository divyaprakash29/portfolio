import { ScrollProgress } from "@/components/scroll-progress";
import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Log } from "@/components/log";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <SiteNav />
      <main>
        <Hero />
        <About />
        <Log />
        {/* Projects (redesigned, no pinned scroll), Skills, Contact
            land here in later checkpoints */}
      </main>
    </>
  );
}
