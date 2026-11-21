import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { Services } from "@/components/services";
import { Work } from "@/components/work";
import { Team } from "@/components/team";
import { Reviews } from "@/components/reviews";
import { Visit } from "@/components/visit";
import { Booking } from "@/components/booking";
import { Footer } from "@/components/footer";
import { MobileBar } from "@/components/mobile-bar";
import { getWorkItems } from "@/lib/work";

export default function Home() {
  const work = getWorkItems();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-chalk focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Services />
        <Work items={work} />
        <Team />
        <Reviews />
        <Visit />
        <Booking />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
