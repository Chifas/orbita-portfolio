import { Reveal } from "../Reveal";
import { site, socials } from "@/config/site";

export function Contact() {
  return (
    <section id="contacto" className="mx-auto max-w-5xl px-6 py-28">
      <Reveal className="surface relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16">
        {/* Aurora de fondo */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-0 opacity-60"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 0%, rgba(124,92,255,0.25), transparent 70%)",
          }}
        />

        <div className="relative">
          <p className="eyebrow mb-5">05 · Contacto</p>
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold sm:text-5xl">
            ¿Construimos algo que <span className="text-gradient">orbite</span> alto?
          </h2>
          <p className="mx-auto mt-5 max-w-md text-star-dim">
            Estoy a un mensaje de distancia. Hablemos de tu proyecto, una colaboración o
            simplemente para saludar.
          </p>

          <a
            href={`mailto:${site.email}`}
            className="mt-9 inline-block rounded-full bg-gradient-to-r from-nebula to-plasma px-8 py-4 text-sm font-semibold text-void transition-transform hover:scale-[1.04]"
          >
            {site.email}
          </a>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-sm font-medium text-star-dim underline-offset-4 transition-colors hover:text-plasma hover:underline"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
