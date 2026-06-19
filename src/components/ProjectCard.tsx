"use client";

import { useRef, type MouseEvent } from "react";
import type { Project } from "@/config/site";

/**
 * Tarjeta de proyecto con "spotlight" que sigue al cursor (patrón estilo 21st.dev).
 * El glow se pinta con un radial-gradient cuya posición se actualiza vía variables CSS,
 * usando solo background-position (barato) — acorde a fixing-motion-performance.
 */
export function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    el.style.setProperty("--mx", `${px}px`);
    el.style.setProperty("--my", `${py}px`);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Inclinación 3D según la posición del cursor dentro de la tarjeta.
    const rx = (py / rect.height - 0.5) * -8;
    const ry = (px / rect.width - 0.5) * 8;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  }

  const isExternal = project.href.startsWith("http");

  return (
    <a
      ref={ref}
      href={project.href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      style={{ transition: "transform 0.3s ease, border-color 0.3s ease", willChange: "transform" }}
      className="group surface relative overflow-hidden rounded-2xl p-6 hover:border-plasma/40"
    >
      {/* Spotlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--mx) var(--my), rgba(124,92,255,0.18), transparent 60%)",
        }}
      />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-star">{project.title}</h3>
          <span className="font-mono text-xs text-star-dim">{project.year}</span>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-star-dim">{project.description}</p>

        <ul className="mb-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-plasma"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="text-star transition-colors group-hover:text-plasma">
            Ver proyecto →
          </span>
          {project.repo && (
            <span className="text-star-dim">Código</span>
          )}
        </div>
      </div>
    </a>
  );
}
