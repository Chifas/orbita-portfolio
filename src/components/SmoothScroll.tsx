"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Scroll suavizado con inercia (Lenis). Envuelve toda la app.
 * Respeta prefers-reduced-motion desactivando el "lerp" agresivo.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <ReactLenis
      root
      options={{
        lerp: reduce ? 1 : 0.1,
        smoothWheel: !reduce,
        duration: 1.2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
