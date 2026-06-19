import { Scene3D } from "@/components/three/Scene3D";
import { ShootingStars } from "@/components/ShootingStars";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Arrival } from "@/components/sections/Arrival";
import { About } from "@/components/sections/About";
import { Stats } from "@/components/sections/Stats";
import { Stack } from "@/components/sections/Stack";
import { Marquee } from "@/components/Marquee";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      {/* Escena WebGL fija detrás de todo */}
      <Scene3D />
      <ShootingStars />

      <Navbar />

      <main>
        <Hero />
        <Arrival />
        <About />
        <Stats />
        <Stack />
        <Marquee />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
