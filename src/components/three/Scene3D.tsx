"use client";

import dynamic from "next/dynamic";

/** Carga diferida y solo en cliente de la escena WebGL. */
const CosmosScene = dynamic(() => import("./CosmosScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

/** Fondo de respaldo (sin WebGL / mientras carga): degradado cósmico estático. */
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

export function Scene3D() {
  return <CosmosScene />;
}
