/**
 * Utilidades de "hora del día": calculan la dirección real del sol y una paleta
 * de ambiente (cielo/niebla/luz) según la hora local del visitante.
 */

export type SkyPhase = "night" | "dawn" | "day" | "dusk";

export type SkyState = {
  /** Dirección del sol en espacio de la TEXTURA de la Tierra (misma convención que latLonToVector3). */
  sun: [number, number, number];
  background: string;
  fog: string;
  sunColor: string;
  sunIntensity: number;
  phase: SkyPhase;
};

/** Dirección del sol (punto subsolar) en el espacio local de la Tierra. */
function sunDirectionLocal(date: Date): [number, number, number] {
  const utc = date.getUTCHours() + date.getUTCMinutes() / 60;
  const lon = (12 - utc) * 15; // longitud subsolar (grados)

  // Declinación solar aproximada según el día del año.
  const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayMs = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - startOfYear;
  const dayOfYear = Math.floor(dayMs / 86400000);
  const decl = 23.44 * Math.sin((2 * Math.PI * (dayOfYear - 81)) / 365);

  // Misma convención que latLonToVector3 en CosmosScene.
  const phi = ((90 - decl) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  const x = -Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);
  const len = Math.hypot(x, y, z) || 1;
  return [x / len, y / len, z / len];
}

type Key = { h: number; bg: [number, number, number]; sun: [number, number, number]; i: number };

// Keyframes de ambiente por hora local (RGB 0-255).
const KEYS: Key[] = [
  { h: 0, bg: [5, 6, 15], sun: [51, 64, 107], i: 0.5 }, // noche
  { h: 6, bg: [25, 20, 39], sun: [255, 178, 122], i: 1.1 }, // amanecer
  { h: 9, bg: [10, 20, 48], sun: [255, 243, 223], i: 1.8 }, // día
  { h: 17, bg: [10, 20, 48], sun: [255, 243, 223], i: 1.8 }, // día
  { h: 19.5, bg: [29, 16, 32], sun: [255, 126, 77], i: 1.1 }, // atardecer
  { h: 22, bg: [5, 6, 15], sun: [51, 64, 107], i: 0.5 }, // noche
  { h: 24, bg: [5, 6, 15], sun: [51, 64, 107], i: 0.5 },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hex = (c: [number, number, number]) =>
  "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

function phaseFor(h: number): SkyPhase {
  if (h >= 5 && h < 8) return "dawn";
  if (h >= 8 && h < 18.5) return "day";
  if (h >= 18.5 && h < 21) return "dusk";
  return "night";
}

/** Estado del cielo para una fecha/hora (por defecto, ahora). */
export function getSkyState(date: Date = new Date()): SkyState {
  const h = date.getHours() + date.getMinutes() / 60;

  let a = KEYS[0];
  let b = KEYS[KEYS.length - 1];
  for (let i = 0; i < KEYS.length - 1; i++) {
    if (h >= KEYS[i].h && h <= KEYS[i + 1].h) {
      a = KEYS[i];
      b = KEYS[i + 1];
      break;
    }
  }
  const span = b.h - a.h || 1;
  const t = Math.min(1, Math.max(0, (h - a.h) / span));

  const bg: [number, number, number] = [
    lerp(a.bg[0], b.bg[0], t),
    lerp(a.bg[1], b.bg[1], t),
    lerp(a.bg[2], b.bg[2], t),
  ];
  const sunCol: [number, number, number] = [
    lerp(a.sun[0], b.sun[0], t),
    lerp(a.sun[1], b.sun[1], t),
    lerp(a.sun[2], b.sun[2], t),
  ];

  return {
    sun: sunDirectionLocal(date),
    background: hex(bg),
    fog: hex(bg),
    sunColor: hex(sunCol),
    sunIntensity: lerp(a.i, b.i, t),
    phase: phaseFor(h),
  };
}
