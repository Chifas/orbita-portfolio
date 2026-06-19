/**
 * ───────────────────────────────────────────────────────────────────────────
 *  CONFIGURACIÓN DEL PORTFOLIO — edita SOLO este archivo para personalizarlo.
 *  Todos los valores marcados con  // 👈 EDITA  son placeholders. Cámbialos.
 * ───────────────────────────────────────────────────────────────────────────
 */

export const site = {
  /** Tu nombre completo — aparece en hero, nav y metadatos. */
  name: "Tu Nombre", // 👈 EDITA
  /** Tu rol / titular profesional. */
  role: "Desarrollador/a Creativo/a", // 👈 EDITA
  /** Frase corta de marca (tagline). */
  tagline: "Construyo experiencias web que orbitan entre el diseño y el código.", // 👈 EDITA
  /** Dominio público (para SEO / Open Graph). Sin barra final. */
  url: "https://tu-dominio.com", // 👈 EDITA
  /** Ubicación (opcional, se muestra en contacto). */
  location: "España", // 👈 EDITA
  /** Email de contacto. */
  email: "hola@tu-dominio.com", // 👈 EDITA
} as const;

/** Bio / sección "Sobre mí". Cada string es un párrafo. */
export const about: string[] = [
  // 👈 EDITA estos párrafos con tu historia real.
  "Soy una persona curiosa por naturaleza a la que le apasiona transformar ideas en interfaces que se sienten vivas. Me muevo cómodo entre el diseño y la ingeniería.",
  "Disfruto especialmente con el detalle: la animación que llega en el momento justo, el rendimiento que no se nota porque simplemente funciona, y el código que otra persona puede leer mañana.",
];

/** Constelación de habilidades (stack). Agrupadas por categoría. */
export const skills: { group: string; items: string[] }[] = [
  // 👈 EDITA con tus tecnologías reales.
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { group: "Creativo / 3D", items: ["Three.js", "React Three Fiber", "GSAP", "WebGL"] },
  { group: "Backend", items: ["Node.js", "PostgreSQL", "REST", "GraphQL"] },
  { group: "Herramientas", items: ["Git", "Figma", "Vercel", "Vite"] },
];

export type Project = {
  title: string;
  description: string;
  tags: string[];
  /** Enlace al proyecto / demo. Usa "#" si aún no tienes. */
  href: string;
  /** Enlace al repositorio (opcional). */
  repo?: string;
  /** Año o estado. */
  year: string;
};

/** Proyectos destacados — los "mundos" que has visitado. */
export const projects: Project[] = [
  // 👈 EDITA con tus proyectos reales.
  {
    title: "Proyecto Estelar",
    description:
      "Una aplicación web a pantalla completa con visualización de datos en tiempo real y micro-interacciones cuidadas.",
    tags: ["Next.js", "TypeScript", "D3"],
    href: "#",
    repo: "#",
    year: "2025",
  },
  {
    title: "Nebulosa UI",
    description:
      "Sistema de diseño y librería de componentes accesibles, documentada y publicada como paquete.",
    tags: ["React", "Storybook", "a11y"],
    href: "#",
    repo: "#",
    year: "2024",
  },
  {
    title: "Órbita 3D",
    description:
      "Experiencia interactiva en WebGL con escena 3D, físicas ligeras y animaciones sincronizadas al scroll.",
    tags: ["Three.js", "R3F", "GSAP"],
    href: "#",
    repo: "#",
    year: "2024",
  },
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  description: string;
};

/** Trayectoria / experiencia. */
export const experience: Experience[] = [
  // 👈 EDITA con tu experiencia real.
  {
    role: "Tu puesto actual",
    company: "Empresa / Freelance",
    period: "2024 — Hoy",
    description:
      "Describe aquí tu impacto: qué construiste, con qué tecnologías y qué resultados conseguiste.",
  },
  {
    role: "Puesto anterior",
    company: "Empresa anterior",
    period: "2022 — 2024",
    description:
      "Otro hito de tu carrera. Sé concreto/a con números y logros cuando puedas.",
  },
  {
    role: "Inicio del viaje",
    company: "Formación / primer empleo",
    period: "2021 — 2022",
    description:
      "Dónde empezó todo. Estudios, bootcamp o tu primer proyecto serio.",
  },
];

/** Redes y enlaces de contacto. Deja "" para ocultar uno. */
export const socials: { label: string; href: string }[] = [
  // 👈 EDITA con tus enlaces reales.
  { label: "GitHub", href: "https://github.com/tu-usuario" },
  { label: "LinkedIn", href: "https://linkedin.com/in/tu-usuario" },
  { label: "Email", href: `mailto:${site.email}` },
];

/** Enlaces de navegación (anclas internas). */
export const navLinks: { label: string; href: string }[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Stack", href: "#stack" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Trayectoria", href: "#trayectoria" },
  { label: "Contacto", href: "#contacto" },
];
