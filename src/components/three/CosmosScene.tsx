"use client";

import { useRef, useMemo, useEffect, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial, Icosahedron } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

/** Generador pseudo-aleatorio determinista (puro) basado en un índice. */
function det(n: number, spread: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * spread;
}

/** Sistema planeta: planeta distorsionado + cáscara wireframe, reactivo al scroll. */
function PlanetSystem({ scroll }: { scroll: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      // Gira más rápido cuanto más bajas en la página.
      const boost = 1 + scroll.current * 3;
      group.current.rotation.y += delta * 0.12 * boost;
      group.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <group ref={group}>
      <Icosahedron args={[1.35, 12]}>
        <MeshDistortMaterial
          color="#7c5cff"
          emissive="#4c2fb0"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.7}
          distort={0.38}
          speed={1.5}
        />
      </Icosahedron>
      <Icosahedron args={[1.55, 2]}>
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.2} />
      </Icosahedron>
    </group>
  );
}

/** Luna ámbar en órbita (acento solar que brilla con el bloom). */
function Moon() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.55;
    ref.current?.position.set(Math.cos(t) * 2.7, Math.sin(t) * 0.7, Math.sin(t) * 2.7);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.16, 32, 32]} />
      <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2.2} toneMapped={false} />
    </mesh>
  );
}

/** Anillo de asteroides (puntos) alrededor del planeta. */
function AsteroidRing({ count = 600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 2.3 + det(i, 0.5);
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = det(i + 99, 0.18);
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.06;
  });

  return (
    <points ref={ref} rotation={[0.5, 0, 0.2]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#22d3ee" transparent opacity={0.85} sizeAttenuation toneMapped={false} />
    </points>
  );
}

/** Polvo cósmico de fondo. */
function Dust({ count = 350 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = det(i * 3, 14);
      arr[i * 3 + 1] = det(i * 3 + 1, 14);
      arr[i * 3 + 2] = det(i * 3 + 2, 14);
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

/** Parallax de cámara con el ratón + leve alejamiento al hacer scroll. */
function CameraRig({ scroll }: { scroll: RefObject<number> }) {
  const { camera, pointer } = useThree();
  useFrame(() => {
    const targetZ = 5 + scroll.current * 1.5;
    camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 0.5 - camera.position.y) * 0.04;
    camera.position.z += (targetZ - camera.position.z) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function CosmosScene() {
  const scroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Canvas
      className="!fixed inset-0 -z-10"
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#060814"]} />
      <fog attach="fog" args={["#060814", 7, 18]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 2]} intensity={1.3} color="#22d3ee" />
      <pointLight position={[-4, -2, -2]} intensity={2.4} color="#7c5cff" />

      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.7}>
        <PlanetSystem scroll={scroll} />
        <AsteroidRing />
        <Moon />
      </Float>

      <Dust />
      <Stars radius={60} depth={40} count={2800} factor={4} saturation={0} fade speed={0.6} />

      <CameraRig scroll={scroll} />

      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.25} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette offset={0.25} darkness={0.65} />
      </EffectComposer>
    </Canvas>
  );
}
