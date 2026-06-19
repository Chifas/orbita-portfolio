import { skills } from "@/config/site";

/**
 * Cinta infinita con el stack tecnológico. Se duplica el contenido para un bucle
 * sin costuras; la animación CSS se pausa con prefers-reduced-motion (ver globals.css).
 */
export function Marquee() {
  const items = skills.flatMap((g) => g.items);

  return (
    <div className="marquee relative flex overflow-hidden border-y border-white/10 py-5">
      {/* Difuminado en los bordes */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent" />

      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy === 1}
          className="marquee-track flex shrink-0 items-center gap-10 px-5"
        >
          {items.map((item, i) => (
            <li key={`${copy}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
              <span className="font-display text-lg font-medium text-star-dim">{item}</span>
              <span aria-hidden="true" className="text-plasma">
                ✦
              </span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
