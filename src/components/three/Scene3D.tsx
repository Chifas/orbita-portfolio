"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";

/** Carga diferida y solo en cliente de la escena WebGL. */
const CosmosScene = dynamic(() => import("./CosmosScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

/** Fondo de respaldo (sin WebGL / reduced-motion / mientras carga): degradado cósmico. */
function SceneFallback() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10"
      style={{
        background:
          "radial-gradient(60% 50% at 50% 35%, rgba(124,92,255,0.25), transparent 70%)," +
          "radial-gradient(40% 40% at 80% 80%, rgba(34,211,238,0.18), transparent 70%)," +
          "var(--void)",
      }}
    />
  );
}

/** Suscripción a prefers-reduced-motion sin setState en efectos (SSR-safe). */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function Scene3D() {
  const reduce = usePrefersReducedMotion();

  // Montamos el WebGL cuando el navegador está libre (tras el primer pintado),
  // para que la carga inicial sea fluida y no compita con la hidratación.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (reduce) return;
    type IdleWin = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWin;
    let idleId = 0;
    let timeoutId = 0;
    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(() => setReady(true), { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(() => setReady(true), 500);
    }
    return () => {
      if (idleId && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [reduce]);

  if (reduce || !ready) return <SceneFallback />;
  return <CosmosScene />;
}
