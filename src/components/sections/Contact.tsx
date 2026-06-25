import { Reveal } from "../Reveal";
import { Magnetic } from "../Magnetic";
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
            Tienes una idea, una oferta o solo te apetece saludar. Escríbeme: respondo
            rápido (y de buenas).
          </p>

          <Magnetic className="mt-9">
            <a
              href={`mailto:${site.email}`}
              className="inline-block rounded-full bg-gradient-to-r from-nebula to-plasma px-8 py-4 text-sm font-semibold text-void"
            >
              {site.email}
            </a>
          </Magnetic>

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
