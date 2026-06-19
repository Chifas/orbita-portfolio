"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial, Icosahedron } from "@react-three/drei";
import * as THREE from "three";

/** Planeta central: icosaedro distorsionado con glow + una capa wireframe. */
function Planet() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <group ref={group}>
      <Icosahedron args={[1.35, 12]}>
        <MeshDistortMaterial
          color="#7c5cff"
          emissive="#3b1f8f"
          emissiveIntensity={0.4}
          roughness={0.25}
          metalness={0.6}
          distort={0.35}
          speed={1.4}
        />
      </Icosahedron>
      {/* Cáscara wireframe en cian */}
      <Icosahedron args={[1.55, 2]}>
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.18} />
      </Icosahedron>
    </group>
  );
}

/** Mueve ligeramente la cámara siguiendo el ratón (parallax suave). */
function CameraParallax() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 0.5 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/** Polvo cósmico: puntos flotando que dan profundidad. */
function Dust({ count = 350 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    // Pseudo-aleatorio determinista (puro): mismas posiciones en cada render.
    const rand = (n: number) => {
      const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
      return (x - Math.floor(x) - 0.5) * 14;
    };
    for (let i = 0; i < count; i++) {
      arr[i * 3] = rand(i * 3);
      arr[i * 3 + 1] = rand(i * 3 + 1);
      arr[i * 3 + 2] = rand(i * 3 + 2);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#9aa0b4" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/**
 * Escena cósmica a pantalla completa, fija detrás del contenido.
 * Se monta solo en cliente (ver Scene3D wrapper) para evitar SSR de WebGL.
 */
export default function CosmosScene() {
  return (
    <Canvas
      className="!fixed inset-0 -z-10"
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#060814"]} />
      <fog attach="fog" args={["#060814", 6, 16]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 2]} intensity={1.2} color="#22d3ee" />
      <pointLight position={[-4, -2, -2]} intensity={2} color="#7c5cff" />

      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
        <Planet />
      </Float>

      <Dust />
      <Stars radius={60} depth={40} count={2500} factor={4} saturation={0} fade speed={0.6} />

      <CameraParallax />
    </Canvas>
  );
}
