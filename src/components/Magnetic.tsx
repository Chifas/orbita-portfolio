"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { gsap } from "gsap";

/**
 * Envuelve un elemento para darle efecto "magnético": se desplaza ligeramente
 * hacia el cursor y vuelve con rebote al salir. Se desactiva con prefers-reduced-motion.
 */
export function Magnetic({
  children,
  strength = 0.4,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onMove(e: MouseEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (!el || reduce()) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    gsap.to(el, { x: mx * strength, y: my * strength, duration: 0.4, ease: "power3.out" });
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  }

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
