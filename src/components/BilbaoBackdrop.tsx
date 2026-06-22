"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { bilbao } from "@/config/site";

/**
 * Fondo de Bilbao: capa fija a pantalla completa, DETRÁS del contenido y por
 * encima de la escena espacial. Aparece (fade-in) al acercarte al final del
 * scroll, sustituyendo al fondo de estrellas/globo → "aterrizas" en Bilbao.
 * La opacidad se controla por estilo directo (sin re-render) por rendimiento.
 */
export function BilbaoBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      // Aparece en el último tramo del scroll.
      const o = Math.min(1, Math.max(0, (p - 0.75) / 0.2));
      el.style.opacity = String(o);
      el.style.visibility = o > 0.001 ? "visible" : "hidden";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0"
      style={{ zIndex: -5, opacity: 0, visibility: "hidden", willChange: "opacity" }}
    >
      <Image src={bilbao.image} alt="" fill priority={false} sizes="100vw" quality={85} className="object-cover" />
      {/* Oscurecido para legibilidad del contenido encima */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(6,8,20,0.55), rgba(6,8,20,0.35) 40%, rgba(6,8,20,0.75))",
        }}
      />
      <a
        href={bilbao.creditUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        className="absolute bottom-2 right-3 text-[10px] text-star-dim/70 transition-colors hover:text-star-dim"
      >
        {bilbao.creditText}
      </a>
    </div>
  );
}
