"use client";

import { useEffect } from "react";
import { site } from "@/config/site";

/** Mensaje amistoso en la consola para quien abra las DevTools (toque humano). */
export function ConsoleHello() {
  useEffect(() => {
    console.log(
      "%c👋 ¿Curioseando el código? Me caes bien.",
      "color:#22d3ee;font-size:14px;font-weight:700",
    );
    console.log(
      `%cHecho a mano por ${site.name} desde Bilbao. ¿Construimos algo juntos? → ${site.email}`,
      "color:#9aa6c0;font-size:12px",
    );
  }, []);
  return null;
}
