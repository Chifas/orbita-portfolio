import { Scene3D } from "@/components/three/Scene3D";
import { BilbaoBackdrop } from "@/components/BilbaoBackdrop";
import { ContentScrim } from "@/components/ContentScrim";
import { ThemeTone } from "@/components/ThemeTone";
import { ShootingStars } from "@/components/ShootingStars";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
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
      <ThemeTone />
      {/* Fondos fijos detrás de todo: espacio (WebGL) + Bilbao al final */}
      <Scene3D />
      <ContentScrim />
      <BilbaoBackdrop />
      <ShootingStars />

      <Navbar />

      <main>
        <Hero />
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
