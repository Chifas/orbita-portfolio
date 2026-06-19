"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Retraso en segundos. */
  delay?: number;
  /** Desplazamiento vertical inicial en px. */
  y?: number;
  /** Si true, anima los hijos directos de forma escalonada. */
  stagger?: boolean;
};

/**
 * Revela su contenido al entrar en viewport con GSAP ScrollTrigger.
 * Usa transform + opacity (propiedades de compositor) para no provocar jank
 * — siguiendo la guía de la skill fixing-motion-performance.
 */
export function Reveal({ children, className, delay = 0, y = 24, stagger = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const targets = stagger ? Array.from(el.children) : el;

      if (reduce) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.9,
        ease: "power3.out",
        delay,
        stagger: stagger ? 0.1 : 0,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
