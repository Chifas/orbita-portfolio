import Image from "next/image";
import { Reveal } from "../Reveal";
import { bilbao } from "@/config/site";

/**
 * Aterrizaje: tras el viaje por el globo, "llegas" a Bilbao.
 * Foto panorámica a pantalla completa, fundida arriba y abajo con el fondo
 * espacial mediante degradados (sin recuadros / "pegotes").
 */
export function Arrival() {
  return (
    <section id="bilbao" className="relative my-16 h-[78vh] min-h-[440px] w-full overflow-hidden">
      <Image
        src={bilbao.image}
        alt={bilbao.alt}
        fill
        sizes="100vw"
        className="object-cover"
      />

      {/* Degradados para fundir la foto con el fondo (arriba y abajo) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--void) 0%, transparent 28%, transparent 62%, rgba(6,8,20,0.92) 100%)",
        }}
      />
      {/* Tinte de marca + oscurecido para legibilidad del texto */}
      <div aria-hidden="true" className="absolute inset-0 bg-nebula/10 mix-blend-overlay" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(6,8,20,0.45), transparent 75%)" }}
      />

      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <p className="eyebrow mb-3">Destino · 43.26°N, -2.93°O</p>
          <h2 className="text-4xl font-bold sm:text-6xl">
            Bienvenido a <span className="text-gradient">{bilbao.caption}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-star-dim">
            Donde vivo y construyo. Mi base de operaciones.
          </p>
        </Reveal>
      </div>

      {/* Atribución (CC BY-SA) */}
      <a
        href={bilbao.creditUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-3 text-[10px] text-star-dim/70 transition-colors hover:text-star-dim"
      >
        {bilbao.creditText}
      </a>
    </section>
  );
}
