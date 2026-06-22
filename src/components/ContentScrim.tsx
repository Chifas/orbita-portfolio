"use client";

import { useEffect, useRef } from "react";

/**
 * Velo de contenido: capa oscura fija ENTRE la escena 3D (globo) y el contenido,
 * que atenúa el fondo para que el texto se lea bien en todas las secciones.
 * Es sutil en el hero (el globo luce) y más marcado al bajar (mejor legibilidad).
 * Va por DEBAJO del fondo de Bilbao para no oscurecer la foto del final.
 */
export function ContentScrim() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const p = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
      el.style.opacity = String(0.28 + p * 0.34); // 0.28 (hero) → 0.62 (secciones)
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -6, background: "var(--void)", opacity: 0.28 }}
    />
  );
}
