# ÓRBITA — Identidad de marca

> Sistema visual del portfolio. Concepto: una carrera profesional como un **viaje por el cosmos**;
> cada proyecto es un mundo visitado, cada habilidad una estrella en tu constelación.

## Concepto

**ÓRBITA** es el sistema de diseño de este portfolio inmersivo. La metáfora espacial no es
decorativa: estructura la narrativa (despegue → exploración → mundos → contacto) y justifica la
escena 3D protagonista. Tono: **curioso, seguro y cósmico**, pero siempre profesional y legible.

## Paleta (Cosmos)

| Token        | Hex       | Uso                                            |
|--------------|-----------|------------------------------------------------|
| `--void`     | `#060814` | Fondo principal (espacio profundo)             |
| `--void-2`   | `#0b0e1f` | Superficies elevadas, tarjetas                 |
| `--nebula`   | `#7c5cff` | **Primario** — violeta nebulosa (CTA, marca)   |
| `--plasma`   | `#22d3ee` | **Secundario** — cian plasma (acentos, enlaces)|
| `--solar`    | `#fbbf24` | Acento cálido — destellos y detalles puntuales |
| `--star`     | `#f5f7ff` | Texto principal (luz de estrella)              |
| `--star-dim` | `#9aa0b4` | Texto secundario / apagado                     |

Gradiente de marca: `--nebula → --plasma` (auroras, bordes con glow, títulos destacados).

## Tipografía

- **Display / títulos** → `Space Grotesk` — geométrica, técnica y espacial. Es la voz de la marca.
- **Cuerpo** → `Inter` — neutra y muy legible para textos largos.
- **Mono / etiquetas** → `JetBrains Mono` — para "telemetría", labels de sección y código.

## Logo / marca

Monograma dentro de una **órbita** (círculo con un satélite). En SVG, escalable, monocromo sobre
el gradiente de marca. Ver `public/logo.svg` y el componente `Logo`.

## Movimiento

Animaciones **suaves y con inercia** (sensación de gravedad): easing tipo `power3.out`, scroll
suavizado con Lenis y revelados al hacer scroll con GSAP ScrollTrigger. Se respeta
`prefers-reduced-motion`.

## Cómo personalizar

Todo tu contenido (nombre, rol, bio, proyectos, experiencia, redes) vive en
`src/config/site.ts`. Cambia ahí los textos y el portfolio se actualiza entero.
