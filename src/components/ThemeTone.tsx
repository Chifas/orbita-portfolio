"use client";

import { useEffect } from "react";
import { getUiTone } from "@/lib/sky";

/**
 * Ajusta el TONO de la UI (textos y acentos) según la hora local, manteniendo
 * el tema oscuro. Sobrescribe las variables CSS de marca en <html>, así que
 * todos los componentes que usan esos tokens se retiñen en vivo.
 * Modo prueba: ?hora=20 fuerza esa hora.
 */
export function ThemeTone() {
  useEffect(() => {
    const apply = () => {
      const override = new URLSearchParams(window.location.search).get("hora");
      let date = new Date();
      if (override !== null) {
        const h = parseFloat(override);
        if (!Number.isNaN(h)) {
          date = new Date();
          date.setHours(Math.floor(h), Math.round((h % 1) * 60), 0, 0);
        }
      }
      const tone = getUiTone(date);
      const root = document.documentElement;
      root.style.setProperty("--star", tone.star);
      root.style.setProperty("--star-dim", tone.starDim);
      root.style.setProperty("--nebula", tone.nebula);
      root.style.setProperty("--plasma", tone.plasma);
      root.style.setProperty("--void", tone.void1);
      root.style.setProperty("--void-2", tone.void2);
    };

    apply();
    // Reaplica cada 5 min por si cambia la franja horaria durante la visita.
    const id = window.setInterval(apply, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return null;
}
