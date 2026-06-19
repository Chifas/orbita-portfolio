"use client";

import { useEffect, useRef } from "react";

/**
 * Anillo-cursor con glow que sigue al puntero con inercia y crece sobre
 * elementos interactivos. Solo en dispositivos con puntero fino y si el usuario
 * no prefiere menos movimiento. El cursor nativo se mantiene (accesibilidad).
 */
export function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduce) return;

    const el = ring.current;
    if (!el) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.style.opacity = "1";
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      el.classList.toggle("cursor-grow", !!target?.closest("a, button, [role='button']"));
    };

    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ring} aria-hidden="true" className="custom-cursor" />;
}
