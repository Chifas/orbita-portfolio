import { SectionHeading } from "../SectionHeading";
import { Reveal } from "../Reveal";
import { experience } from "@/config/site";

export function Experience() {
  return (
    <section id="trayectoria" className="mx-auto max-w-5xl px-6 py-28">
      <SectionHeading eyebrow="04 · Trayectoria" title="Mi viaje hasta aquí" />

      <Reveal stagger className="relative space-y-10">
        {/* Línea de la órbita */}
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-nebula via-plasma to-transparent"
        />

        {experience.map((item) => (
          <article key={`${item.company}-${item.period}`} className="relative pl-10">
            <span
              aria-hidden="true"
              className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-plasma bg-void"
            />
            <p className="font-mono text-xs text-plasma">{item.period}</p>
            <h3 className="mt-1 text-xl font-semibold text-star">{item.role}</h3>
            <p className="text-sm text-star-dim">{item.company}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-star-dim">
              {item.description}
            </p>
          </article>
        ))}
      </Reveal>
    </section>
  );
}
