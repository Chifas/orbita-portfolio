import { SectionHeading } from "../SectionHeading";
import { Reveal } from "../Reveal";
import { hobbies } from "@/config/site";

/** "Cuando no programo": hobbies que humanizan el perfil. */
export function Beyond() {
  return (
    <section id="mas" className="mx-auto max-w-5xl px-6 py-28">
      <SectionHeading
        eyebrow="05 · Más allá del código"
        title="Cuando no programo"
        intro="…sigo aprendiendo igual. Estas son las cosas que me cargan las pilas."
      />

      <Reveal stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {hobbies.map((h) => (
          <div
            key={h.label}
            className="surface flex items-center gap-3 rounded-2xl p-5 transition-colors hover:border-plasma/40"
          >
            <span className="text-2xl" aria-hidden="true">
              {h.emoji}
            </span>
            <span className="font-medium text-star">{h.label}</span>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
