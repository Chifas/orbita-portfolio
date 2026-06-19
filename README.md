# 🪐 ÓRBITA — Portfolio inmersivo

Portfolio personal con una **escena 3D a pantalla completa**, animaciones al scroll y una
identidad de marca cósmica. Construido como pieza de CV y como excusa para aprender tecnologías
modernas de la web.

![Stack](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-149eca) ![Three.js](https://img.shields.io/badge/Three.js-r184-049ef4) ![GSAP](https://img.shields.io/badge/GSAP-3-88ce02)

## ✨ Características

- **Escena 3D en tiempo real** con [React Three Fiber](https://r3f.docs.pmnd.rs/) + Three.js
  (planeta distorsionado, campo de estrellas, polvo cósmico y parallax con el ratón).
- **Animaciones al scroll** con [GSAP](https://gsap.com/) + ScrollTrigger y scroll suavizado con
  [Lenis](https://lenis.darkroom.engineering/).
- **Diseño de marca propio** (ÓRBITA) documentado en [`BRAND.md`](./BRAND.md).
- **Accesible y con buen SEO**: contraste cuidado, `prefers-reduced-motion`, navegación por
  teclado, Open Graph y metadatos.
- **Todo el contenido en un solo sitio**: edita [`src/config/site.ts`](./src/config/site.ts).

## 🧱 Stack

| Capa        | Tecnología                                  |
|-------------|---------------------------------------------|
| Framework   | Next.js 16 (App Router) + React 19          |
| Lenguaje    | TypeScript                                  |
| Estilos     | Tailwind CSS v4                             |
| 3D          | Three.js · @react-three/fiber · @react-three/drei |
| Animación   | GSAP · @gsap/react · Lenis                  |

## 🚀 Desarrollo

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo en http://localhost:3000
npm run build    # build de producción
npm run start    # servir el build
```

## 🎨 Personalización

1. **Tu contenido** → edita [`src/config/site.ts`](./src/config/site.ts) (nombre, rol, bio,
   proyectos, experiencia, redes). Todos los placeholders están marcados con `// 👈 EDITA`.
2. **Colores y tipografías** → tokens en [`src/app/globals.css`](./src/app/globals.css)
   (ver [`BRAND.md`](./BRAND.md)).
3. **La escena 3D** → [`src/components/three/CosmosScene.tsx`](./src/components/three/CosmosScene.tsx).

## 📂 Estructura

```
src/
├─ app/                 # layout, página, estilos globales, favicon
├─ components/
│  ├─ three/            # escena WebGL (Canvas + objetos 3D)
│  ├─ sections/         # Hero, About, Stack, Projects, Experience, Contact
│  └─ ...               # Navbar, Footer, Reveal (GSAP), ProjectCard, Logo
└─ config/site.ts       # ← tu contenido
```

---

Hecho con Next.js, Three.js y GSAP.
