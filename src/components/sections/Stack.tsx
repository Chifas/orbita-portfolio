import { SectionHeading } from "../SectionHeading";
import { Reveal } from "../Reveal";
import { skills } from "@/config/site";

export function Stack() {
  return (
    <section id="stack" className="mx-auto max-w-5xl px-6 py-28">
      <SectionHeading
        eyebrow="02 · Stack"
        title="Mi constelación técnica"
        intro="Con lo que construyo cada día (y lo que ando aprendiendo ahora mismo)."
      />

      <Reveal stagger className="grid gap-5 sm:grid-cols-2">
        {skills.map((category) => (
          <div key={category.group} className="surface rounded-2xl p-6">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-plasma">
              {category.group}
            </h3>
            <ul className="flex flex-wrap gap-2.5">
              {category.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm text-star"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
