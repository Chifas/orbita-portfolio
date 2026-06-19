import { Reveal } from "../Reveal";
import { streetView } from "@/config/site";

/**
 * Aterrizaje: tras el viaje por el globo, "llegas" a San Mamés.
 * Muestra un Street View incrustado a pantalla completa (config en site.ts).
 */
export function Arrival() {
  return (
    <section id="bilbao" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal className="text-center">
        <p className="eyebrow mb-4">Destino · 43.26°N, -2.93°O</p>
        <h2 className="text-3xl font-bold sm:text-5xl">
          Bienvenido a <span className="text-gradient">{streetView.caption}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-star-dim">
          Desde aquí construyo. Date un paseo por el estadio.
        </p>
      </Reveal>

      <Reveal className="mt-10">
        <div className="surface relative overflow-hidden rounded-3xl">
          <div className="relative aspect-video w-full">
            {streetView.embedUrl ? (
              <iframe
                src={streetView.embedUrl}
                title={`Street View de ${streetView.caption}`}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div
                className="absolute inset-0 grid place-items-center text-center"
                style={{
                  background:
                    "radial-gradient(60% 80% at 50% 30%, rgba(124,92,255,0.22), transparent 70%), var(--void-2)",
                }}
              >
                <div className="px-6">
                  <p className="font-display text-3xl text-star">📍 {streetView.caption}</p>
                  <p className="mt-3 text-sm text-star-dim">Donde la pelota es religión.</p>
                  <a
                    href="https://www.google.com/maps?q=San+Mam%C3%A9s,+Bilbao"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-star transition-colors hover:border-plasma/60 hover:bg-white/5"
                  >
                    Ver en Google Maps →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
