/**
 * ───────────────────────────────────────────────────────────────────────────
 *  CONFIGURACIÓN DEL PORTFOLIO — edita SOLO este archivo para personalizarlo.
 * ───────────────────────────────────────────────────────────────────────────
 */

export const site = {
  /** Tu nombre completo — aparece en hero, nav y metadatos. */
  name: "Ekain Bernabé",
  /** Tu rol / titular profesional. */
  role: "Desarrollador de Software",
  /** Frase corta de marca (tagline). */
  tagline:
    "De día domo ERPs con Delphi; de noche cacharreo con React, Three.js e IA. Aprender construyendo es mi vicio.",
  /** Dominio público (para SEO / Open Graph). Sin barra final. Cámbialo al desplegar. */
  url: "https://orbita-portfolio.vercel.app", // 👈 EDITA al desplegar (p. ej. tu dominio o URL de Vercel)
  /** Ubicación. */
  location: "Bilbao, Bizkaia, España",
  /** Email de contacto. */
  email: "ekainberna58@gmail.com",
} as const;

/** Bio / sección "Sobre mí". Cada string es un párrafo. */
export const about: string[] = [
  "Soy Ekain, de Bilbao. Llevo años metido en sistemas empresariales y ERP, pero si algo me define es que no sé estarme quieto: siempre ando trasteando con alguna tecnología nueva.",
  "De día trabajo con Delphi y bases de datos; al salir me lío con React, Three.js, IA con Claude y automatizaciones varias. Me obsesiona el detalle y dejar el código de forma que mañana —otro, o yo mismo— lo entienda a la primera.",
];

/** Constelación de habilidades (stack). */
export const skills: { group: string; items: string[] }[] = [
  { group: "Lenguajes", items: ["Delphi / Pascal", "C#", "Python", "TypeScript", "JavaScript", "SQL"] },
  { group: "Frameworks", items: [".NET", "Node.js", "React", "Streamlit"] },
  { group: "Bases de datos", items: ["SQL Server", "Firebird", "Oracle", "PostgreSQL"] },
  { group: "IA & Automatización", items: ["Claude AI", "Telegram Bots", "OCR / documentos"] },
  { group: "Herramientas", items: ["Git", "Docker", "REST APIs", "Figma"] },
];

/**
 * Aterrizaje en Bilbao: foto panorámica a pantalla completa tras el viaje por el globo.
 * Cambia `image` por otra panorámica si quieres (ponla en public/images/).
 */
export const bilbao = {
  caption: "Bilbao",
  image: "/images/bilbao.jpg",
  alt: "Panorámica de Bilbao: el Museo Guggenheim y la ría del Nervión",
  creditText: "Foto: Tiia Monto · CC BY-SA 3.0",
  creditUrl: "https://commons.wikimedia.org/wiki/File:Bilbao_panorama_2.jpg",
} as const;

/** Cifras destacadas (contador animado). Ajusta los valores a tu realidad. */
export const stats: { value: number; suffix?: string; label: string }[] = [
  { value: 3, suffix: "+", label: "Años de experiencia" },
  { value: 10, suffix: "+", label: "Proyectos" },
  { value: 6, label: "Lenguajes" },
  { value: 4, label: "Bases de datos" },
];

export type Project = {
  title: string;
  description: string;
  tags: string[];
  href: string;
  repo?: string;
  year: string;
};

/** Proyectos destacados — los "mundos" que has visitado. */
export const projects: Project[] = [
  {
    title: "AitaTax-AI",
    description:
      "Automatización fiscal con IA para autónomos: procesa documentos y prepara presentaciones usando Claude AI.",
    tags: ["Python", "Claude AI", "Streamlit"],
    href: "https://github.com/Chifas/AitaTax-AI",
    repo: "https://github.com/Chifas/AitaTax-AI",
    year: "2025",
  },
  {
    title: "ZentroIA",
    description:
      "Plataforma profesional de reservas para especialistas, con gestión de citas y clientes.",
    tags: ["JavaScript", "Node.js", "Reservas"],
    href: "https://github.com/Chifas/ZentroIA",
    repo: "https://github.com/Chifas/ZentroIA",
    year: "2025",
  },
  {
    title: "Base_Camp",
    description:
      "Plataforma empresarial construida con TypeScript para centralizar la operativa de negocio.",
    tags: ["TypeScript", "Plataforma"],
    href: "https://github.com/Chifas/Base_Camp",
    repo: "https://github.com/Chifas/Base_Camp",
    year: "2024",
  },
  {
    title: "Presupuestos de Obra",
    description:
      "Gestor de presupuestos para pladur, escayola y construcción: cálculo y seguimiento de partidas.",
    tags: ["JavaScript", "Construcción"],
    href: "https://github.com/Chifas/presupuestos-obra",
    repo: "https://github.com/Chifas/presupuestos-obra",
    year: "2024",
  },
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  description: string;
};

/** Trayectoria / experiencia. (Ajusta los años exactos si quieres). */
export const experience: Experience[] = [
  {
    role: "Programador Analista — Desarrollo de ERP",
    company: "Comeralia",
    period: "Actualidad",
    description:
      "Desarrollo y mantenimiento de ERP con Delphi y bases de datos (SQL Server, Firebird, Oracle), atendiendo necesidades reales de negocio.",
  },
  {
    role: "I+D — Desarrollo .NET",
    company: "Zucchetti España",
    period: "Anterior",
    description:
      "Departamento de I+D trabajando con C#/.NET y SQL Server en producto empresarial.",
  },
  {
    role: "Administrador de Sistemas",
    company: "EKIN S.COOP",
    period: "Inicios",
    description:
      "Administración de sistemas e infraestructura. Donde empezó el viaje por la tecnología.",
  },
];

/** Redes y enlaces de contacto. */
export const socials: { label: string; href: string }[] = [
  { label: "GitHub", href: "https://github.com/Chifas" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ekain-bernabe-belaustegui-a82a35252/",
  },
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
