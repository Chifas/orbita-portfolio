import Image from "next/image";
import { SectionHeading } from "../SectionHeading";
import { Reveal } from "../Reveal";
import { about, site } from "@/config/site";

const initials = site.name
  .split(" ")
  .map((w) => w[0])
  .slice(0, 2)
  .join("");

export function About() {
  return (
    <section id="sobre-mi" className="mx-auto max-w-5xl px-6 py-28">
      <SectionHeading eyebrow="01 · Sobre mí" title="Quién hay detrás del código" />

      <div className="grid gap-12 md:grid-cols-[1.5fr_1fr]">
        <Reveal stagger className="text-plate h-fit space-y-5 text-lg leading-relaxed text-star-dim">
          {about.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          <p className="border-l-2 border-plasma/60 pl-4 text-base italic text-star/90">
            “{site.quote}”
          </p>
        </Reveal>

        <Reveal className="surface h-fit rounded-2xl p-6">
          {/* Avatar (foto si existe; si no, iniciales) */}
          <div className="mb-6 flex items-center gap-4">
            {site.photo ? (
              <Image
                src={site.photo}
                alt={site.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover object-[center_30%] ring-2 ring-plasma/40"
              />
            ) : (
              <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-nebula to-plasma font-display text-xl font-bold text-void">
                {initials}
              </span>
            )}
            <div>
              <p className="font-display font-semibold text-star">{site.name}</p>
              <p className="text-sm text-star-dim">{site.role}</p>
            </div>
          </div>

          <dl className="space-y-4 border-t border-white/10 pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-star-dim">Ubicación</dt>
              <dd className="text-right font-medium text-star">{site.location}</dd>
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
