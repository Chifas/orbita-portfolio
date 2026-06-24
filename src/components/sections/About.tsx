import { SectionHeading } from "../SectionHeading";
import { Reveal } from "../Reveal";
import { about, site } from "@/config/site";

export function About() {
  return (
    <section id="sobre-mi" className="mx-auto max-w-5xl px-6 py-28">
      <SectionHeading eyebrow="01 · Sobre mí" title="Quién hay detrás del código" />

      <div className="grid gap-12 md:grid-cols-[1.5fr_1fr]">
        <Reveal stagger className="text-plate h-fit space-y-5 text-lg leading-relaxed text-star-dim">
          {about.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </Reveal>

        <Reveal className="surface h-fit rounded-2xl p-6">
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-star-dim">Ubicación</dt>
              <dd className="font-medium text-star">{site.location}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-star-dim">Rol</dt>
              <dd className="text-right font-medium text-star">{site.role}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-star-dim">Disponibilidad</dt>
              <dd className="flex items-center gap-2 font-medium text-star">
                <span className="inline-block h-2 w-2 rounded-full bg-solar" aria-hidden="true" />
                Abierto a oportunidades
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
