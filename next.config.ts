import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite acceder al servidor de desarrollo desde otros equipos de la red local
  // (móvil, otro PC). Añade aquí la IP/host desde el que pruebas si cambia.
  allowedDevOrigins: ["172.16.1.144", "172.16.1.*", "192.168.1.*"],
  // Next 16 solo permite calidad 75 por defecto; habilitamos 85 para el fondo.
  images: {
    qualities: [75, 85],
  },
};

export default nextConfig;
