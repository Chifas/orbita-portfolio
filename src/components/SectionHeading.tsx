import { Reveal } from "./Reveal";

/** Encabezado consistente para cada sección: eyebrow + título + intro opcional. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <Reveal className="text-plate mb-12 w-fit max-w-2xl">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="text-3xl font-bold sm:text-5xl">{title}</h2>
      {intro && <p className="mt-5 text-lg text-star-dim">{intro}</p>}
    </Reveal>
  );
}
