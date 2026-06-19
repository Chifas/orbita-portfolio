"use client";

import { Suspense, useRef, useMemo, useEffect, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

/** Generador pseudo-aleatorio determinista (puro) basado en un índice. */
function det(n: number, spread: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * spread;
}

const R = 1.35; // radio de la Tierra

/** Tierra con estilo cartoon: textura real + sombreado toon (cel), contorno y atmósfera. */
function Earth({ scroll }: { scroll: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const map = useTexture("/textures/earth.jpg");
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;

  // Rampa de pocos pasos para el banding cel del MeshToonMaterial.
  const gradientMap = useMemo(() => {
    const steps = new Uint8Array([70, 130, 190, 245]);
    const tex = new THREE.DataTexture(steps, steps.length, 1, THREE.RedFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame((_, delta) => {
    if (group.current) {
      const boost = 1 + scroll.current * 3;
      group.current.rotation.y += delta * 0.12 * boost;
    }
  });

  return (
    <group ref={group} rotation={[0.35, 0, 0.18]}>
      {/* Contorno cartoon (inverted hull) */}
      <mesh scale={1.035}>
        <sphereGeometry args={[R, 64, 64]} />
        <meshBasicMaterial color="#070b22" side={THREE.BackSide} />
      </mesh>

      {/* Tierra con sombreado toon */}
      <mesh>
        <sphereGeometry args={[R, 64, 64]} />
        <meshToonMaterial map={map} gradientMap={gradientMap} />
      </mesh>

      {/* Atmósfera con glow (additivo, lo realza el bloom) */}
      <mesh scale={1.14}>
        <sphereGeometry args={[R, 64, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          side={THREE.BackSide}
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** Luna gris en órbita alrededor de la Tierra. */
function Moon() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.5;
    ref.current?.position.set(Math.cos(t) * 2.8, Math.sin(t) * 0.6, Math.sin(t) * 2.8);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.22, 32, 32]} />
      <meshStandardMaterial color="#cbd2e0" emissive="#6b7280" emissiveIntensity={0.4} roughness={0.9} />
    </mesh>
  );
}

/** Anillo de polvo/asteroides estilizado (licencia artística cartoon). */
function DebrisRing({ count = 500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 2.3 + det(i, 0.45);
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = det(i + 99, 0.15);
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });

  return (
    <points ref={ref} rotation={[0.5, 0, 0.2]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#22d3ee" transparent opacity={0.7} sizeAttenuation toneMapped={false} />
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

      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 2, 3]} intensity={1.6} color="#fff7e6" />
      <pointLight position={[-4, -2, -2]} intensity={2} color="#7c5cff" />

      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.6}>
          <Earth scroll={scroll} />
          <DebrisRing />
          <Moon />
        </Float>
      </Suspense>

      <Dust />
      <Stars radius={60} depth={40} count={2800} factor={4} saturation={0} fade speed={0.6} />

      <CameraRig scroll={scroll} />

      <EffectComposer>
        <Bloom intensity={0.7} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette offset={0.25} darkness={0.6} />
      </EffectComposer>
    </Canvas>
  );
}
