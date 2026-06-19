import { Scene3D } from "@/components/three/Scene3D";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Stack } from "@/components/sections/Stack";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      {/* Escena WebGL fija detrás de todo */}
      <Scene3D />

      <Navbar />

      <main>
        <Hero />
        <About />
        <Stack />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
