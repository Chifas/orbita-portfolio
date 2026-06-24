"use client";

import { useRef, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Magnetic } from "../Magnetic";
import { getGreeting } from "@/lib/sky";
import { site } from "@/config/site";

/** Saludo según la hora local (respeta ?hora=); SSR-safe para no romper hidratación. */
function greetingNow(): string {
  const override = new URLSearchParams(window.location.search).get("hora");
  if (override !== null) {
    const h = parseFloat(override);
    if (!Number.isNaN(h)) {
      const d = new Date();
      d.setHours(Math.floor(h), 0, 0, 0);
      return getGreeting(d);
    }
  }
  return getGreeting();
}

function useGreeting(): string {
  return useSyncExternalStore(
    () => () => {},
    greetingNow,
    () => "Hola",
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const greeting = useGreeting();

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero='eyebrow']", { opacity: 0, y: 16, duration: 0.6 })
        .from("[data-hero='title'] > span", { opacity: 0, y: 40, duration: 0.9, stagger: 0.12 }, "-=0.2")
        .from("[data-hero='tagline']", { opacity: 0, y: 20, duration: 0.7 }, "-=0.4")
        .from("[data-hero='cta'] > *", { opacity: 0, y: 16, duration: 0.6, stagger: 0.1 }, "-=0.3")
        .from("[data-hero='scroll']", { opacity: 0, duration: 0.8 }, "-=0.2");
    },
    { scope: root },
  );

  return (
    <section
      id="inicio"
      ref={root}
      className="relative flex min-h-svh flex-col items-center justify-center px-6 text-center"
    >
      {/* Velo radial para asegurar contraste del texto sobre el planeta 3D */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(85% 75% at 50% 45%, rgba(6,8,20,0.6), transparent 95%)",
        }}
      />

      <p data-hero="eyebrow" className="eyebrow relative z-10 mb-6">
        Portfolio · {site.location}
      </p>

      <h1
        data-hero="title"
        className="relative z-10 max-w-4xl text-balance text-5xl font-bold leading-[1.05] sm:text-7xl"
      >
        <span className="block">{greeting}, soy</span>
        <span className="block text-gradient">{site.name}</span>
      </h1>

      <p data-hero="tagline" className="relative z-10 mt-7 max-w-xl text-balance text-lg text-star-dim sm:text-xl">
        <span className="font-medium text-star">{site.role}.</span> {site.tagline}
      </p>

      <div data-hero="cta" className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4">
        <Magnetic>
          <a
            href="#proyectos"
            className="inline-block rounded-full bg-gradient-to-r from-nebula to-plasma px-7 py-3.5 text-sm font-semibold text-void"
          >
            Ver proyectos
          </a>
        </Magnetic>
        <Magnetic>
          <a
            href="#contacto"
            className="inline-block rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-star transition-colors hover:border-plasma/60 hover:bg-white/5"
          >
            Contacto
          </a>
        </Magnetic>
      </div>

      <a
        data-hero="scroll"
        href="#sobre-mi"
        aria-label="Desplázate hacia abajo"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-star-dim transition-colors hover:text-star"
      >
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-current p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-current" />
        </span>
      </a>
    </section>
  );
}
